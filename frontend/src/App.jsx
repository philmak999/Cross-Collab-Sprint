import { useEffect, useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import CaseSummary from "./component/CaseSummary/CaseSummary.jsx";
import CaseSummarySecond from "./component/CaseSummarySecond/CaseSummarySecond.jsx";
import EditCaseSummary from "./component/EditCaseSummary/EditCaseSummary.jsx";
import HamburgerMenu from "./component/HamburgerMenu/HamburgerMenu.jsx";
import PageHeader from "./component/PageHeader/PageHeader.jsx";
import MainPageNav from "./component/MainPageNav/MainPageNav.jsx";
import HospitalRouting from "./component/HospitalRouting/HospitalRouting.jsx";
import HospitalsList from "./component/HospitalsList/HospitalsList.jsx";
import Map from "./component/Map/Map.jsx";
import DispatchButton from "./component/DispatchButton/DispatchButton.jsx";
import PageFooter from "./component/PageFooter/PageFooter.jsx";
import Transcript from "./component/Transcript/Transcript.jsx";
import AmbulanceDispatched from "./component/AmbulanceDispatched/AmbulanceDispatched.jsx";
import EmergencyCall from "./component/EmergencyCall/EmergencyCall.jsx";
import Map1 from "./assets/maps/Map-1.jpg";
import Map2 from "./assets/maps/Map-2.jpg";
import Map3 from "./assets/maps/Map-3.jpg";
import "./App.scss";

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isTranscriptOpen, setIsTranscriptOpen] = useState(false);
  const [selectedHospitalIndex, setSelectedHospitalIndex] = useState(null);

  const hospitals = [
    {
      HospitalName: "KT Hospital",
      Recommendscore: "90%",
      HospitalNameDistance: "10",
      DriveTime: "5",
      HospitalInfo: "Cardiac catheterization capability",
      AiRecommend: true,
      Map: Map1,
    },
    {
      HospitalName: "Smith Hospital",
      Recommendscore: "15%",
      HospitalNameDistance: "6",
      DriveTime: "15",
      HospitalInfo: "Traffic near Jane and Finch",
      AiRecommend: false,
      Map: Map2,
    },
    {
      HospitalName: "York Hospital",
      Recommendscore: "10%",
      HospitalNameDistance: "15",
      DriveTime: "12",
      HospitalInfo: "Distance too far",
      AiRecommend: false,
      Map: Map3,
    },
  ];

  const handleMenuToggle = () => {
    setIsMenuOpen((prev) => !prev);
  };
  const handleEditToggle = () => setIsEditOpen((prev) => !prev);
  const handleTranscriptToggle = () => setIsTranscriptOpen((prev) => !prev);
  const handleDispatch = () => navigate("/dispatched");

  const containerClassName = isMenuOpen
    ? "main-part main-part--menu-open"
    : "main-part";
  const selectedHospital = hospitals[selectedHospitalIndex] ?? null;

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/dispatched" || location.pathname === "/emergency") {
      setIsMenuOpen(false);
    }
  }, [location.pathname]);
  return (
    <>
      <PageHeader onMenuToggle={handleMenuToggle} />
      <HamburgerMenu isOpen={isMenuOpen} />
      {/* <button
        onClick={() => navigate("/dispatched")}
        style={{
          position: "fixed",
          bottom: "30px",
          right: "30px",
          zIndex: 9999,
          padding: "16px 24px",
          backgroundColor: "#E17100",
          color: "white",
          border: "none",
          borderRadius: "12px",
          cursor: "pointer",
          fontWeight: "bold",
          fontSize: "16px",
        }}
      >
        test an emergency button
      </button> */}
      <Routes>
        <Route
          path="/"
          element={
            <div className={containerClassName}>
              <MainPageNav />
              <div className="main-layout">
                <div className="main-layout__left">
                  <CaseSummary
                    isFullWidth={isMenuOpen}
                    onEditClick={handleEditToggle}
                    onTranscriptClick={handleTranscriptToggle}
                  />
                </div>
                <div className="main-layout__right">
                  <HospitalRouting />
                <div className="main-layout__right-row">
                  <HospitalsList
                    hospitals={hospitals}
                    selectedIndex={selectedHospitalIndex}
                    onSelect={setSelectedHospitalIndex}
                  />
                  <div className="main-layout__map-stack">
                    <Map hospital={selectedHospital} />
                    <DispatchButton
                      onClick={handleDispatch}
                      disabled={selectedHospitalIndex === null}
                    />
                  </div>
                </div>
              </div>
            </div>
            </div>
          }
        />
        <Route
          path="/case-summary-2"
          element={
            <div className={containerClassName}>
              <MainPageNav />
              <div className="main-layout">
                <div className="main-layout__left">
                  <CaseSummarySecond
                    isFullWidth={isMenuOpen}
                    onEditClick={handleEditToggle}
                    onTranscriptClick={handleTranscriptToggle}
                  />
                </div>
                <div className="main-layout__right">
                  <HospitalRouting />
                  <div className="main-layout__right-row">
                    <HospitalsList
                      hospitals={hospitals}
                      selectedIndex={selectedHospitalIndex}
                      onSelect={setSelectedHospitalIndex}
                    />
                    <div className="main-layout__map-stack">
                      <Map hospital={selectedHospital} />
                      <DispatchButton
                        onClick={handleDispatch}
                        disabled={selectedHospitalIndex === null}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }
        />
        <Route path="/dispatched" element={<AmbulanceDispatched />} />
        <Route path="/emergency" element={<EmergencyCall />} />
      </Routes>

      {isEditOpen && <EditCaseSummary onClose={handleEditToggle} />}
      {isTranscriptOpen && <Transcript onClose={handleTranscriptToggle} />}
      <PageFooter isMenuOpen={isMenuOpen} />
    </>
  );
}

export default App;
