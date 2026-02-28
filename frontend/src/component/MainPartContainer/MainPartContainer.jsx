import './MainPartContainer.scss'
import CaseSummary from '../CaseSummary/CaseSummary';

function MainPartContainer({ isMenuOpen }) {
  const containerClassName = isMenuOpen
    ? 'main-part main-part--menu-open'
    : 'main-part';

  return (
    <div className={containerClassName}>
      <CaseSummary isFullWidth={isMenuOpen} />
    </div>
  );
}

export default MainPartContainer;
