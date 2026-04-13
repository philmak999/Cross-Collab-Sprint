// Entry point for the Express backend server.
// Depends on: express, cors, dotenv, groq-sdk, graphql, graphql-http, @graphql-tools/schema
// Consumed by: the React frontend (http://localhost:5173) via a single GraphQL mutation at /graphql
// Environment: requires GROQ_API_KEY and MAPBOX_TOKEN to be set in a .env file at the project root

const express = require("express");
const cors = require("cors");
require("dotenv").config();
const Groq = require("groq-sdk");
const { createHandler } = require("graphql-http/lib/use/express");
const { makeExecutableSchema } = require("@graphql-tools/schema");

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

// --- GraphQL Schema ---
// HospitalInput: the static hospital fields the frontend sends in (name, info, distance, drive time)
// CallResult: the combined output of all three AI steps returned in one response
const typeDefs = `
  input HospitalInput {
    HospitalName: String!
    HospitalInfo: String!
    HospitalNameDistance: String!
    DriveTime: String!
  }

  type PatientData {
    name: String!
    location: String!
    relationship: String!
    profile: String!
    history: String!
    symptoms: String!
  }

  type TriageData {
    severity: String!
    leadingSymptom: String!
    recommendedUnit: String!
  }

  type ScoredHospital {
    HospitalName: String!
    Recommendscore: String!
    AiRecommend: Boolean!
    HospitalInfo: String!
    HospitalDetails: String!
  }

  type CallResult {
    patientData: PatientData!
    triageData: TriageData!
    scoredHospitals: [ScoredHospital!]!
  }

  type Query {
    _empty: String
  }

  type Mutation {
    processEmergencyCall(transcript: String!, hospitals: [HospitalInput!]!): CallResult!
  }
`;

// --- Agentic Hospital Scoring ---

// Tool definition: the agent can call this to fetch real-time drive time for any hospital
const TOOLS = [
  {
    type: "function",
    function: {
      name: "get_live_drive_time",
      description:
        "Get the real-time traffic-aware drive time in minutes and distance in km from a patient location to a hospital using the Mapbox Directions API.",
      parameters: {
        type: "object",
        properties: {
          origin: {
            type: "string",
            description:
              "The patient's street address, e.g. '1458 Dundas St W, Toronto, ON'",
          },
          destination: {
            type: "string",
            description:
              "The hospital name and city, e.g. 'Toronto Western Hospital, Toronto, ON'",
          },
        },
        required: ["origin", "destination"],
      },
    },
  },
];

// Geocodes an address string to [lng, lat] via the Mapbox Geocoding API.
// Restricts results to the Greater Toronto Area bounding box for accuracy.
async function geocode(query, token) {
  const normalised = query.replace(/\band\b/gi, "&");
  const withCity = /toronto|ontario/i.test(normalised)
    ? normalised
    : `${normalised}, Toronto, Ontario`;
  const url =
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(withCity)}.json` +
    `?country=CA&bbox=-79.6393,43.5810,-79.1158,43.8554&limit=1&access_token=${token}`;
  const res = await fetch(url);
  const data = await res.json();
  if (!data.features?.length) throw new Error(`Could not geocode: "${query}"`);
  return data.features[0].center; // [lng, lat]
}

// Executes the get_live_drive_time tool: geocodes both addresses then calls
// the Mapbox Directions API with live traffic to get drive time and distance.
async function getLiveDriveTime(origin, destination) {
  const token = process.env.MAPBOX_TOKEN;
  if (!token) throw new Error("MAPBOX_TOKEN is not set in the environment");

  const [originCoords, destCoords] = await Promise.all([
    geocode(origin, token),
    geocode(destination, token),
  ]);

  const url =
    `https://api.mapbox.com/directions/v5/mapbox/driving-traffic/` +
    `${originCoords[0]},${originCoords[1]};${destCoords[0]},${destCoords[1]}` +
    `?overview=false&access_token=${token}`;
  const res = await fetch(url);
  const data = await res.json();

  if (!data.routes?.length) throw new Error("No route found between these locations");

  return {
    driveTimeMinutes: Math.round(data.routes[0].duration / 60),
    distanceKm: parseFloat((data.routes[0].distance / 1000).toFixed(1)),
  };
}

// Runs the agentic hospital scoring loop.
// The agent calls get_live_drive_time for each hospital to get real-time traffic data,
// then produces a final JSON ranking once it has live data for all hospitals.
// Falls back gracefully if the tool errors (e.g. missing MAPBOX_TOKEN).
async function runHospitalScoringAgent(patientData, hospitalList) {
  const messages = [
    {
      role: "system",
      content: `You are a hospital routing AI for 911 dispatch. You have access to the get_live_drive_time tool.

Your job:
1. Call get_live_drive_time for EVERY hospital listed, using the patient's location as the origin.
2. Once you have live drive times for all hospitals, return ONLY a JSON object with a "hospitals" array.

Each item in the array must have exactly these fields:
- HospitalName: string (exact match to input)
- Recommendscore: string (e.g. "87%")
- AiRecommend: boolean (true for the single best hospital only)
- HospitalInfo: string (5 words or fewer — blunt verdict on fit for this patient's specific emergency)
- HospitalDetails: string (2–3 sentences of clinical reasoning, referencing the real drive time you fetched)

Use sentence case. Do not use ALL CAPS. Return only the JSON — no explanation, no markdown.`,
    },
    {
      role: "user",
      content: `Patient location: ${patientData.location}

Patient:
Profile: ${patientData.profile}
History: ${patientData.history}
Symptoms: ${patientData.symptoms}

Hospitals (static reference data):
${hospitalList}

Call get_live_drive_time for each hospital from the patient's location, then return your final JSON ranking.`,
    },
  ];

  const MAX_ITERATIONS = 10;

  for (let i = 0; i < MAX_ITERATIONS; i++) {
    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages,
      tools: TOOLS,
      tool_choice: "auto",
    });

    const message = response.choices[0].message;
    messages.push(message);

    if (message.tool_calls?.length) {
      // Execute all tool calls in parallel and return results to the agent
      const toolResults = await Promise.all(
        message.tool_calls.map(async (toolCall) => {
          try {
            const args = JSON.parse(toolCall.function.arguments);
            const result = await getLiveDriveTime(args.origin, args.destination);
            console.log(`[tool] get_live_drive_time(${args.origin} → ${args.destination}):`, result);
            return {
              role: "tool",
              tool_call_id: toolCall.id,
              content: JSON.stringify(result),
            };
          } catch (err) {
            console.warn(`[tool] get_live_drive_time failed: ${err.message}`);
            return {
              role: "tool",
              tool_call_id: toolCall.id,
              content: JSON.stringify({ error: err.message }),
            };
          }
        })
      );
      messages.push(...toolResults);
    } else {
      // Agent is done — extract the JSON from its response
      const content = message.content || "";
      const match = content.match(/\{[\s\S]*\}/);
      if (!match) throw new Error("Hospital scoring agent returned no JSON");
      const parsed = JSON.parse(match[0]);
      if (!parsed.hospitals) throw new Error("Hospital scoring agent returned JSON without 'hospitals' key");
      console.log("hospital scoring agent response:", parsed.hospitals);
      return parsed.hospitals;
    }
  }

  throw new Error("Hospital scoring agent exceeded maximum iterations");
}

// --- Resolvers ---
// processEmergencyCall runs all three steps sequentially:
//   1. Extract patient data from transcript (Groq, direct)
//   2. Triage symptoms (Groq, direct)
//   3. Score and rank hospitals (Groq tool-calling agent with live Mapbox drive times)
const resolvers = {
  Mutation: {
    processEmergencyCall: async (_, { transcript, hospitals }) => {
      // Step 1: Extract patient data from transcript
      const callCompletion = await client.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: `You are a 911 dispatch assistant. Extract patient information from call transcripts and return ONLY valid JSON with these exact fields: name, location, relationship, profile, history, symptoms.

Rules:
- "name": use the victim's full name if stated. If the name was never mentioned or is unknown, set this to "Unidentified".
- "location": the precise street address or location mentioned by the caller. If an intersection is given, format as "Main St & 1st Ave" (use & not "and"). If a specific location is given (i.e. Eaton Centre, CN Tower, etc.), provide the exact name of the location mentioned. If no location is mentioned, set to "URGENT: Missing Location".
- "profile": format as labeled key-value pairs, one per line, in this exact order:
    Name: [victim's full name, or "Unidentified"]
    Sex: [Male/Female/Unknown]
    Age: [number, or "Unknown"]
    Ethnicity: [ethnicity if mentioned, otherwise omit this line]
  If the name is "Unidentified", also include any physical details the caller mentioned that could help identify the victim (approximate age, build, clothing, hair, etc.) as additional labeled lines, e.g. "Build: Heavyset", "Clothing: Red jacket". If no details at all are known, add a final line "Details: None mentioned".
- "history": format as labeled key-value pairs, one per line. Use these labels where applicable:
    Medical Emergency: [the specific incident or emergency type that triggered the call. Describe the incident first, then the medical nature — e.g. "Collision - Vehicle with cyclist", "Collision - Multi-vehicle", "Cardiac event - Chest pain", "Respiratory distress - Asthma attack", "Fall from height", "Assault - Blunt trauma", "Allergic reaction - Anaphylaxis". If the incident type is unclear, describe the primary symptom instead. If nothing is known, set to "Unknown emergency"]
    Conditions: [comma-separated list of pre-existing medical conditions, or "None mentioned"]
    Medications: [comma-separated list if mentioned, otherwise omit this line]
    Notes: [any other relevant medical history, or omit if none]
- "symptoms": the victim's current symptoms and condition as described by the caller. Each symptom on its own line as a plain sentence (no bullet characters).
- "relationship": the caller's relationship to the victim (e.g. spouse, bystander, etc). If not mentioned or unknown, set to "Unknown".

All field values must be plain strings. Use newline characters to separate lines within a field. Use sentence case: capitalize only the first letter of each sentence and proper nouns. Do not use ALL CAPS. Do not use bullet characters (•, -, *) — labeled lines only.`,
          },
          {
            role: "user",
            content: `Extract patient information from this 911 call transcript:\n\n${transcript} and use sentence case formatting for all fields. If any field is missing or cannot be determined, use the specified default values. Return the extracted information in a JSON format with the exact fields: name, location, relationship, profile, history, symptoms.`,
          },
        ],
      });
      const patientData = JSON.parse(callCompletion.choices[0].message.content);
      console.log("process-call response:", patientData);

      // Step 2: Triage symptoms
      const triageCompletion = await client.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: `You are an emergency medical triage assistant. Analyze patient data and return ONLY valid JSON with these exact fields:
- severity: must be exactly one of "Critical", "Urgent", or "Non-urgent"
- leadingSymptom: string — the primary and most urgent symptom driving the triage decision
- recommendedUnit: string — the specific hospital unit needed (e.g. "Cardiac catheterization lab", "Emergency department", "Trauma unit", "Respiratory/ICU unit")
Use sentence case: capitalize only the first letter of each sentence and proper nouns. Do not use ALL CAPS.`,
          },
          {
            role: "user",
            content: `Triage this patient:\nProfile: ${patientData.profile}\nMedical History: ${patientData.history}\nSymptoms: ${patientData.symptoms}`,
          },
        ],
      });
      const triageData = JSON.parse(triageCompletion.choices[0].message.content);
      console.log("triage response:", triageData);

      // Step 3: Agentic hospital scoring with live drive times
      // The agent calls get_live_drive_time for each hospital via the Mapbox Directions API,
      // then produces a final ranking informed by real traffic conditions.
      const hospitalList = hospitals
        .map(
          (h) =>
            `- ${h.HospitalName}: ${h.HospitalInfo}, ${h.HospitalNameDistance}km away (static), ${h.DriveTime} min drive (static)`
        )
        .join("\n");

      const scoredHospitals = await runHospitalScoringAgent(patientData, hospitalList);

      return { patientData, triageData, scoredHospitals };
    },
  },
};

// --- Server Start ---
const schema = makeExecutableSchema({ typeDefs, resolvers });
app.use("/graphql", createHandler({ schema }));

app.listen(8080, () => console.log("Server running on port 8080 — GraphQL at /graphql"));
