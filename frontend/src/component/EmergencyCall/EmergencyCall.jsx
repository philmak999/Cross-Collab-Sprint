import React from "react";
import "./EmergencyCall.scss";
import sendIcon from "../../icons/Send.svg";

const EmergencyCall = ({ onEndCall }) => {
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

        <button
          className="emergency__btn emergency__btn--danger"
          onClick={onEndCall}
        >
          END & PROCESS CALL
          <img src={sendIcon} alt="" className="emergency__icon" />
        </button>
      </div>
    </div>
  );
};

export default EmergencyCall;
