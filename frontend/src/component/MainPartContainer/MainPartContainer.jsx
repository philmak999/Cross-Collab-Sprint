import "./MainPartContainer.scss";
import CaseSummary from "../CaseSummary/CaseSummary";

function MainPartContainer({ isMenuOpen, onEditClick }) {
  const containerClassName = isMenuOpen
    ? "main-part main-part--menu-open"
    : "main-part";

  return (
    <div className={containerClassName}>
      <CaseSummary isFullWidth={isMenuOpen} onEditClick={onEditClick} />
    </div>
  );
}

export default MainPartContainer;
