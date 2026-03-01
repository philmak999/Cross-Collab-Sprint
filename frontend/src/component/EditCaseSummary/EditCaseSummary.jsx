import React from "react";
import Button from "../Button/Button.jsx";
import "./EditCaseSummary.scss";

const EditCaseSummary = ({ onClose }) => {
  return (
    <div className="edit-summary__modal">
      <div className="edit-summary">
        <div className="edit-summary__header">
          <h2 className="edit-summary__title">Case Summary</h2>
          <button className="edit-summary__close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="edit-summary__info">
          <div>
            <strong>Call ID:</strong> 123
          </div>
          <div>
            <strong>Timestamp:</strong> 123
          </div>
        </div>

        <div className="edit-summary__columns">
          <div className="edit-summary__column">
            <div className="edit-summary__form-group">
              <label>FIELD ENTRY NAME</label>
              <input type="text" defaultValue="John Doe" />
            </div>

            <div className="edit-summary__form-group">
              <label>LOCATION</label>
              <input type="text" defaultValue="123 Main St, Toronto, ON" />
            </div>

            <div className="edit-summary__form-group">
              <label>CALLER RELATIONSHIP</label>
              <input type="text" defaultValue="Spouse" />
            </div>
          </div>

          <div className="edit-summary__column">
            <div className="edit-summary__form-group">
              <label>PROFILE</label>
              <textarea defaultValue="Patient is a 45-year-old..." rows="3" />
            </div>

            <div className="edit-summary__form-group">
              <label>MEDICAL HISTORY</label>
              <textarea defaultValue="No known allergies." rows="3" />
            </div>

            <div className="edit-summary__form-group">
              <label>CRITICAL SYMPTOMS</label>
              <textarea defaultValue="Severe headache, dizziness." rows="3" />
            </div>
          </div>
        </div>

        <div className="edit-summary__footer">
          <Button text="Cancel" onClick={onClose} variant="cancel" />
          <Button text="Save" onClick={onClose} variant="save" />
        </div>
      </div>
    </div>
  );
};

export default EditCaseSummary;
