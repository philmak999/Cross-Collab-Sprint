import Button from "../Button/Button.jsx";
import "./Transcript.scss";

const STATIC_LINES = [
  { speaker: "Operator", text: "911, what is your emergency?" },
  { speaker: "Caller", text: "My husband is having really bad chest pain. I think something's wrong with his heart." },
  { speaker: "Operator", text: "What is your address?" },
  { speaker: "Caller", text: "1458 Dundas Street West, apartment 304." },
  { speaker: "Operator", text: "Thank you. What is your husband's name?" },
  { speaker: "Caller", text: "Gabriel Smith." },
  { speaker: "Operator", text: "How old is Gabriel?" },
  { speaker: "Caller", text: "He's 62." },
  { speaker: "Operator", text: "Tell me exactly what's happening." },
  { speaker: "Caller", text: "He started having chest pain about twenty minutes ago. He says it feels like an elephant is sitting on his chest." },
  { speaker: "Operator", text: "Is he awake?" },
  { speaker: "Caller", text: "Yes, but he looks very weak." },
  { speaker: "Operator", text: "Is he breathing?" },
  { speaker: "Caller", text: "Yes, but he's short of breath." },
  { speaker: "Operator", text: "Is the pain going anywhere else?" },
  { speaker: "Caller", text: "Yes, he says it's going down his left arm." },
  { speaker: "Operator", text: "Is he sweating?" },
  { speaker: "Caller", text: "Yes, a lot. His shirt is soaked." },
  { speaker: "Operator", text: "Does he have any medical conditions?" },
  { speaker: "Caller", text: "He has high blood pressure and diabetes." },
  { speaker: "Operator", text: "Does he take medication for those?" },
  { speaker: "Caller", text: "Yes, blood pressure medication. I'm not sure what it's called." },
  { speaker: "Operator", text: "Stay on the line with me. Help is on the way. Do not let him walk. Have him sit or lie down. If he becomes unconscious or stops breathing, tell me immediately." },
  { speaker: "Caller", text: "Okay. Please hurry." },
  { speaker: "Operator", text: "The ambulance is on its way. I'm staying with you." },
];

const Transcript = ({ onClose, lines, callId, timestamp }) => {
  const displayLines = lines?.length > 0 ? lines : STATIC_LINES;
  const displayCallId = callId ?? "911-2026-07821";
  const displayTimestamp = timestamp ?? "10:14:32 AM - 10:16:31 AM";

  return (
    <div className="transcript__modal">
      <div className="transcript">
        <div className="transcript__header">
          <h2 className="transcript__title">Call Transcript</h2>
          <Button text="Close" onClick={onClose} variant="save" />
        </div>

        <div className="transcript__content">
          <div className="transcript__meta">
            <p>
              <strong>Call ID:</strong> {displayCallId}
            </p>
            <p>
              <strong>Timestamp:</strong> {displayTimestamp}
            </p>
          </div>

          {displayLines.map((line, i) => (
            <p key={i}>
              <strong>{line.speaker}:</strong> {line.text}
            </p>
          ))}
        </div>

        <div className="transcript__footer">
          <Button text="Close Transcript" onClick={onClose} variant="save" />
        </div>
      </div>
    </div>
  );
};

export default Transcript;
