import { useState } from "react";
import CaseSummary from "./component/CaseSummary/CaseSummary.jsx";
import EditCaseSummary from "./component/EditCaseSummary/EditCaseSummary.jsx";
import HamburgerMenu from "./component/HamburgerMenu/HamburgerMenu.jsx";
import PageHeader from "./component/PageHeader/PageHeader.jsx";
import MainPartContainer from "./component/MainPartContainer/MainPartContainer.jsx";
import HospitalRouting from "./component/HospitalRouting/HospitalRouting.jsx";
import "./App.css";

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleMenuToggle = () => {
    setIsMenuOpen((prev) => !prev);
  };
  const handleEditToggle = () => setIsEditOpen((prev) => !prev);

  return (
    <>
      <PageHeader onMenuToggle={handleMenuToggle} />
      <HamburgerMenu isOpen={isMenuOpen} />
      <MainPartContainer
        isMenuOpen={isMenuOpen}
        onEditClick={handleEditToggle}
      />
      {isEditOpen && <EditCaseSummary onClose={handleEditToggle} />}
      {/* <HospitalRouting /> */}
    </>
  );
}

export default App;
