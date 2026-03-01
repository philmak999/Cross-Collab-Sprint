import "./HamburgerMenu.scss";
import callIcon from "../../assets/icons/Call.svg";
import settingsIcon from "../../assets/icons/Settings.svg";
import { useNavigate } from "react-router-dom";

function HamburgerMenu({ isOpen }) {
  const navigate = useNavigate();
  return (
    <aside className={`hamburger-menu${isOpen ? ' hamburger-menu--open' : ''}`}>
      <div className="hamburger-menu__top">
        <button
          className="hamburger-menu__header hamburger-menu__button"
          type="button"
          onClick={() => navigate("/emergency")}
        >
          <h2 className="hamburger-menu__title">New Case</h2>
          <img
            className="hamburger-menu__icon"
            src={callIcon}
            alt=""
            aria-hidden="true"
          />
        </button>

        <div className="hamburger-menu__section">
          <h2 className="hamburger-menu__title">My Tickets</h2>
          <nav className="hamburger-menu__links">
            <span>My Previous Cases</span>
            <span>All Cases</span>
            <span>Weekly Analysis</span>
          </nav>
        </div>
      </div>

      <div className="hamburger-menu__bottom">
        <h3 className="hamburger-menu__settings">SETTINGS</h3>
        <img className="hamburger-menu__icon" src={settingsIcon} alt="" aria-hidden="true" />
      </div>
    </aside>
  );
}

export default HamburgerMenu;
