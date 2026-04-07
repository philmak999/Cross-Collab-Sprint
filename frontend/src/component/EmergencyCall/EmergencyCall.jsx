import { useState, useRef, useEffect } from "react";
import "./EmergencyCall.scss";
import { useNavigate } from "react-router-dom";
import sendIcon from "../../assets/icons/Send.svg";

const BASE_URL = "http://localhost:8080";

const formatTime = (date) =>
  date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

const EmergencyCall = ({ baseHospitals = [] }) => {
  const navigate = useNavigate();
  const [lines, setLines] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState("");
  const [error, setError] = useState("");
  const [activeSpeaker, setActiveSpeaker] = useState(null);
  const recognitionRef = useRef(null);
  const transcriptRef = useRef(null);
  const callStartTimeRef = useRef(null);

  // Auto-scroll transcript to bottom on new lines
  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [lines]);

  const startRecording = (speaker) => {
    // Record call start time on first recording
    if (!callStartTimeRef.current) {
      callStartTimeRef.current = new Date();
    }

    recognitionRef.current?.stop();

    const SpeechRecognition = window["SpeechRecognition"] || window["webkitSpeechRecognition"];
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;

    let interim = "";

    recognition.onresult = (event) => {
      interim = Array.from(event.results)
        .map((r) => r[0].transcript)
        .join(" ");

      setLines((prev) => {
        const updated = [...prev];
        if (updated.length && updated[updated.length - 1].speaker === speaker && updated[updated.length - 1].interim) {
          updated[updated.length - 1] = { speaker, text: interim, interim: true };
        } else {
          updated.push({ speaker, text: interim, interim: true });
        }
        return updated;
      });
    };

    recognition.onend = () => {
      if (interim) {
        setLines((prev) => {
          const updated = [...prev];
          if (updated.length && updated[updated.length - 1].interim) {
            updated[updated.length - 1] = { speaker, text: interim, interim: false };
          }
          return updated;
        });
      }
      setActiveSpeaker(null);
    };

    recognition.start();
    recognitionRef.current = recognition;
    setActiveSpeaker(speaker);
    setError("");
  };

  const handleEndCall = async () => {
    recognitionRef.current?.stop();
    setIsProcessing(true);
    setError("");

    const callEndTime = new Date();
    const callStartTime = callStartTimeRef.current ?? callEndTime;
    const timestamp = `${formatTime(callStartTime)} - ${formatTime(callEndTime)}`;
    const year = callEndTime.getFullYear();
    const callId = `911-${year}-${String(Math.floor(Math.random() * 90000) + 10000)}`;

    const transcript = lines.map((l) => `${l.speaker}: ${l.text}`).join("\n");

    try {
      // Step 1: Extract patient data from transcript
      setProcessingStep("Extracting patient information...");
      const callRes = await fetch(`${BASE_URL}/api/process-call`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript }),
      });
      if (!callRes.ok) throw new Error(`process-call failed: ${callRes.status}`);
      const patientData = await callRes.json();

      // Step 2: Triage symptoms
      setProcessingStep("Triaging symptoms...");
      const triageRes = await fetch(`${BASE_URL}/api/triage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symptoms: patientData.symptoms,
          history: patientData.history,
          profile: patientData.profile,
        }),
      });
      if (!triageRes.ok) throw new Error(`triage failed: ${triageRes.status}`);
      const triageData = await triageRes.json();

      // Step 3: Score hospitals
      setProcessingStep("Scoring hospitals...");
      const hospRes = await fetch(`${BASE_URL}/api/recommend-hospitals`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patient: patientData, hospitals: baseHospitals }),
      });
      if (!hospRes.ok) throw new Error(`recommend-hospitals failed: ${hospRes.status}`);
      const { hospitals: scoredHospitals } = await hospRes.json();

      navigate("/", {
        state: {
          patientData: { ...patientData, callId, timestamp },
          triageData,
          scoredHospitals,
          transcriptLines: lines,
        },
      });
    } catch (err) {
      setError(`Failed to process call: ${err.message}`);
      setIsProcessing(false);
      setProcessingStep("");
    }
  };

  return (
    <div className="emergency">
      <div className="emergency__header">
        <h1 className="emergency__title">Emergency Call in Progress</h1>
      </div>

      <div className="emergency__content">
        <p className="emergency__subtitle">
          The system is recording your call. Once you hang up, it will process
          the case for you.
        </p>

        {!isProcessing && (
          <div className="emergency__speakers">
            <button
              className={`emergency__btn emergency__btn--speaker ${activeSpeaker === "Caller" ? "emergency__btn--active" : ""}`}
              onClick={() => startRecording("Caller")}
              disabled={activeSpeaker !== null}
            >
              {activeSpeaker === "Caller" ? "Caller Speaking..." : "Caller"}
            </button>
            <button
              className={`emergency__btn emergency__btn--speaker ${activeSpeaker === "Operator" ? "emergency__btn--active" : ""}`}
              onClick={() => startRecording("Operator")}
              disabled={activeSpeaker !== null}
            >
              {activeSpeaker === "Operator" ? "Operator Speaking..." : "Operator"}
            </button>
          </div>
        )}

        {lines.length > 0 && (
          <div className="emergency__transcript" ref={transcriptRef}>
            {lines.map((line, i) => (
              <p
                key={i}
                className={`emergency__transcript-line emergency__transcript-line--${line.speaker.toLowerCase()} ${line.interim ? "emergency__transcript-line--interim" : ""}`}
              >
                <span className="emergency__transcript-speaker">{line.speaker}:</span> {line.text}
              </p>
            ))}
          </div>
        )}

        {isProcessing && (
          <p className="emergency__processing">{processingStep}</p>
        )}

        {error && (
          <p className="emergency__error">{error}</p>
        )}

        <button
          className="emergency__btn emergency__btn--danger"
          onClick={handleEndCall}
          disabled={lines.length === 0 || isProcessing}
        >
          {isProcessing ? "PROCESSING..." : "END & PROCESS CALL"}
          {!isProcessing && <img src={sendIcon} alt="" className="emergency__icon" />}
        </button>
      </div>
    </div>
  );
};

export default EmergencyCall;
