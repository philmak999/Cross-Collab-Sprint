import "./Button.scss";

function Button({ onClick, text, variant = "default" }) {
  return (
    <button className="btn" type="button" onClick={onClick} btn-type={variant}>
      <span className="btn__text">{text}</span>
    </button>
  );
}

export default Button;
