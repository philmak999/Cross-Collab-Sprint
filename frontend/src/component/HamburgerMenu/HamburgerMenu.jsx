import "./HamburgerMenu.scss";
import callIcon from "../../assets/icons/Call.svg";
import settingsIcon from "../../assets/icons/Settings.svg";
import { useNavigate } from "react-router-dom";

function HamburgerMenu({ isOpen, isDarkMode, onDarkModeToggle }) {
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
        <div className="hamburger-menu__settings-row">
          <h3 className="hamburger-menu__settings">SETTINGS</h3>
          <img className="hamburger-menu__icon" src={settingsIcon} alt="" aria-hidden="true" />
        </div>

        <div className="hamburger-menu__dark-mode-row">
          <span className="hamburger-menu__dark-mode-label">Dark Mode</span>
          <button
            className={`hamburger-menu__toggle${isDarkMode ? ' hamburger-menu__toggle--on' : ''}`}
            role="switch"
            aria-checked={isDarkMode}
            aria-label="Toggle dark mode"
            onClick={onDarkModeToggle}
            type="button"
          >
            <span className="hamburger-menu__toggle-thumb" />
          </button>
        </div>
      </div>
    </aside>
  );
}

export default HamburgerMenu;
