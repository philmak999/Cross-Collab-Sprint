const express = require("express");
const cors = require("cors");
require("dotenv").config();
const Groq = require("groq-sdk");

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.post("/api/process-call", async (req, res) => {
    const { transcript } = req.body;
    try {
        const completion = await client.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            response_format: { type: "json_object" },
            messages: [
                {
                    role: "system",
                    content: `You are a 911 dispatch assistant. Extract patient information from call transcripts and return ONLY valid JSON with these exact fields: name, location, relationship, profile, history, symptoms.

Rules:
- "name": use the victim's full name if stated. If the name was never mentioned or is unknown, set this to "Unidentified".
- "location": the precise street address exactly as stated by the caller — do not paraphrase or shorten, as it is used for map geocoding.
- "profile": if the name is known, describe the victim's age, sex, and relevant medical profile. If the name is "Unidentified", describe the victim using any available physical details mentioned or implied: approximate age, sex, ethnicity, body size/build, clothing, hair, and any other identifying information an operator would record. Each detail on its own line.
- "history": relevant medical history, conditions, or medications. Leave empty if none mentioned.
- "symptoms": the victim's current symptoms and condition. Each symptom on its own line.
- "relationship": the caller's relationship to the victim (e.g. spouse, bystander, unknown).

All field values must be plain strings. Use newline characters to separate multiple items within a field. Use sentence case: capitalize only the first letter of each sentence and proper nouns. Do not use ALL CAPS.`,
                },
                {
                    role: "user",
                    content: `Extract patient information from this 911 call transcript:\n\n${transcript}`,
                },
            ],
        });
        const json = JSON.parse(completion.choices[0].message.content);
        console.log("process-call response:", json);
        res.json(json);
    } catch (err) {
        console.error("Error processing call:", err.message);
        res.status(500).json({ error: err.message });
    }
});

app.post("/api/triage", async (req, res) => {
    const { symptoms, history, profile } = req.body;
    try {
        const completion = await client.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            response_format: { type: "json_object" },
            messages: [
                {
                    role: "system",
                    content: `You are an emergency medical triage assistant. Analyze patient data and return ONLY valid JSON with these exact fields:
- severity: must be exactly one of "Critical", "Urgent", or "Non-urgent"
- leadingSymptom: string — the single most life-threatening symptom in one sentence
- recommendedUnit: string — the specific hospital unit needed (e.g. "Cardiac catheterization lab", "Emergency department", "Trauma unit", "Respiratory/ICU unit")
Use sentence case: capitalize only the first letter of each sentence and proper nouns. Do not use ALL CAPS.`,
                },
                {
                    role: "user",
                    content: `Triage this patient:\nProfile: ${profile}\nMedical History: ${history}\nSymptoms: ${symptoms}`,
                },
            ],
        });
        const json = JSON.parse(completion.choices[0].message.content);
        console.log("triage response:", json);
        res.json(json);
    } catch (err) {
        console.error("Triage error:", err.message);
        res.status(500).json({ error: err.message });
    }
});

app.post("/api/recommend-hospitals", async (req, res) => {
    const { patient, hospitals } = req.body;
    try {
        const hospitalList = hospitals
            .map((h) => `- ${h.HospitalName}: ${h.HospitalInfo}, ${h.HospitalNameDistance}km away, ${h.DriveTime} min drive`)
            .join("\n");

        const completion = await client.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            response_format: { type: "json_object" },
            messages: [
                {
                    role: "system",
                    content: `You are a hospital routing AI for 911 dispatch. Score hospitals for a patient and return ONLY valid JSON with a "hospitals" array. Each item must have:
- HospitalName: string (exact match to input)
- Recommendscore: string (e.g. "87%")
- AiRecommend: boolean (true for the single best hospital only)
- HospitalInfo: string (exactly 5 words or fewer — a blunt verdict on whether this hospital fits THIS patient's specific emergency. Focus on the single deciding factor. No filler words. Examples for a cardiac case: "Best cardiac cath lab match", "No cardiac surgery unit", "Too far for cardiac event", "Closest trauma cardiac centre")
- HospitalDetails: string (2–3 sentences explaining the full clinical reasoning for or against this hospital for this specific patient)
Use sentence case: capitalize only the first letter of each sentence and proper nouns. Do not use ALL CAPS.`,
                },
                {
                    role: "user",
                    content: `Patient:\nProfile: ${patient.profile}\nHistory: ${patient.history}\nSymptoms: ${patient.symptoms}\n\nHospitals:\n${hospitalList}\n\nScore and rank these hospitals for this patient.`,
                },
            ],
        });
        const json = JSON.parse(completion.choices[0].message.content);
        console.log("recommend-hospitals response:", json);
        res.json(json);
    } catch (err) {
        console.error("Hospital recommendation error:", err.message);
        res.status(500).json({ error: err.message });
    }
});

app.listen(8080, () => console.log("Server running on port 8080"));
