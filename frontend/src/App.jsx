import { useState } from 'react';
import CaseSummary from './component/CaseSummary/CaseSummary.jsx';
import HamburgerMenu from './component/HamburgerMenu/HamburgerMenu.jsx';
import PageHeader from './component/PageHeader/PageHeader.jsx';
import MainPartContainer from './component/MainPartContainer/MainPartContainer.jsx';
import './App.css';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <>
      <PageHeader onMenuToggle={handleMenuToggle} />
      <HamburgerMenu isOpen={isMenuOpen} />
      <MainPartContainer isMenuOpen={isMenuOpen} />
    </>
  );
}

export default App;
