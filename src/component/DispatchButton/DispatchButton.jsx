import "./DispatchButton.scss";
import sendIcon from "../../assets/icons/Send.svg";

function DispatchButton({ onClick, disabled = false }) {
  return (
    <div className="dispatch-button__wrap">
      <button
        className="dispatch-button"
        type="button"
        onClick={onClick}
        disabled={disabled}
      >
        <span className="dispatch-button__text">DISPATCH AMBULANCE</span>
        <img
          className="dispatch-button__icon"
          src={sendIcon}
          alt=""
          aria-hidden="true"
        />
      </button>
      <p className="dispatch-button__note">
        This also sends patient information to the hospital.
      </p>
    </div>
  );
}

export default DispatchButton;
