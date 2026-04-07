import "../CaseSummary/CaseSummary.scss";
import EditButton from "../EditButton/EditButton.jsx";
import alertIcon from "../../assets/icons/Alert.svg";

const toLines = (value) => {
  if (!value) return [];
  const lines = Array.isArray(value)
    ? value.map(String).filter(Boolean)
    : String(value).split(/\n|,\s*/).map((s) => s.trim()).filter(Boolean);
  return lines.map((s) => s.charAt(0).toUpperCase() + s.slice(1));
};

function CaseSummarySecond({ isFullWidth = false, onEditClick, onTranscriptClick, patientData }) {
  const caseSummaryClassName = isFullWidth
    ? "case-summary case-summary--full"
    : "case-summary";

  const symptoms = toLines(patientData?.symptoms);
  const [firstSymptom, ...restSymptoms] = symptoms;
  const profileLines = toLines(patientData?.profile);
  const historyLines = toLines(patientData?.history);

  return (
    <section className={caseSummaryClassName}>
      <header className="case-summary__header">
        <h2 className="case-summary__title">Case Summary</h2>
        <EditButton onClick={onEditClick} />
      </header>
      <div className="case-summary__divider" />

      <div className="case-summary__content">
        <div className="case-summary__top-row">
          <section className="case-summary__info" aria-label="Case Information">
            <div className="case-summary__info-row">
              <span className="case-summary__info-label">Call ID:</span>
              <span className="case-summary__info-value">911-2026-09107</span>
            </div>
            <div className="case-summary__info-row">
              <span className="case-summary__info-label">Timestamp:</span>
              <span className="case-summary__info-value">
                2:43:11 PM - 2:46:02 PM
              </span>
            </div>
            <div className="case-summary__info-row">
              <span className="case-summary__info-label">Location:</span>
              <span className="case-summary__info-value">
                {patientData?.location ?? "88 Bloor St E, Toronto, ON"}
              </span>
            </div>
            <div className="case-summary__info-row">
              <span className="case-summary__info-label">
                Caller Relationship:
              </span>
              <span className="case-summary__info-value">
                {patientData?.relationship ?? "Bystander"}
              </span>
            </div>
          </section>

          <section className="case-summary__section">
            <h3 className="case-summary__heading">
              {patientData?.name ?? "Unidentified"}
            </h3>
            <div className="case-summary__details">
              {profileLines.length > 0
                ? profileLines.map((line, i) => <p key={i}>{line}</p>)
                : <>
                    <p>Female, 29</p>
                    <p>Known asthma, no cardiac history</p>
                  </>}
            </div>
          </section>

          <section className="case-summary__section">
            <h3 className="case-summary__heading">Background</h3>
            <div className="case-summary__details">
              {historyLines.length > 0
                ? historyLines.map((line, i) => <p key={i}>{line}</p>)
                : <>
                    <p>Asthma (moderate)</p>
                    <p>No known allergies</p>
                  </>}
            </div>
          </section>
        </div>

        <section className="case-summary__critical">
          <div className="case-summary__critical-header">
            <img
              className="case-summary__alert-icon"
              src={alertIcon}
              alt=""
              aria-hidden="true"
            />
            <span>CRITICAL SYMPTOMS</span>
          </div>
          <p className="case-summary__critical-lead">
            {firstSymptom ?? "Severe shortness of breath and wheezing"}
          </p>
          {restSymptoms.length > 0 && (
            <ul className="case-summary__critical-list">
              {restSymptoms.map((symptom, i) => (
                <li key={i}>{symptom}</li>
              ))}
            </ul>
          )}
          {restSymptoms.length === 0 && !patientData && (
            <ul className="case-summary__critical-list">
              <li>Rapid breathing and audible wheeze</li>
              <li>Unable to speak full sentences</li>
              <li>Chest tightness reported</li>
              <li>Rescue inhaler used with minimal relief</li>
              <li>Patient anxious but responsive</li>
            </ul>
          )}
        </section>

        <div className="case-summary__actions">
          <button
            className="case-summary__action"
            type="button"
            onClick={onTranscriptClick}
          >
            View 911 Transcript
          </button>
          <button
            className="case-summary__action case-summary__action--disabled"
            type="button"
            disabled
          >
            EMS Intake Unavailable
          </button>
        </div>
      </div>
    </section>
  );
}

export default CaseSummarySecond;
