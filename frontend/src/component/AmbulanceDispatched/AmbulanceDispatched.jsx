import React from "react";
import "./AmbulanceDispatched.scss";
import sendIcon from "../../icons/Send.svg";

const AmbulanceDispatched = () => {
  return (
    <div className="amb">
      <div className="amb__header">
        <h1 className="amb__title">Ambulance Dispatched</h1>
      </div>

      <div className="amb__content">
        <button className="amb__btn amb__btn--main">
          Take New Call
          <img src={sendIcon} alt="" className="amb__icon" />
        </button>

        <div className="amb__secondary-actions">
          <button className="amb__btn amb__btn--secondary">
            Review Last Case
          </button>
          <button className="amb__btn amb__btn--secondary">
            Review All Cases
          </button>
        </div>
      </div>
    </div>
  );
};

export default AmbulanceDispatched;
