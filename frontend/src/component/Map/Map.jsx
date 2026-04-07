import "./Map.scss";
import MapBlank from "../../assets/maps/Map-Blank.jpg";
import MapIcon from "../../assets/icons/Map.svg";

function Map({ hospital }) {
  return (
    <section className="map-panel" aria-label="Hospital map">
      <header className="map-panel__header">
        <p className="map-panel__subtitle">
          {hospital?.HospitalName ?? "Select a hospital"}
        </p>
      </header>
      <div className="map-panel__body">
        <div className="map-panel__banner">
          <img className="map-panel__banner-icon" src={MapIcon} alt="" />
          <span className="map-panel__banner-text">LIVE TRAFFIC VIEW</span>
        </div>
        <img
          className="map-panel__image"
          src={hospital?.Map ?? MapBlank}
          alt={hospital?.HospitalName ? `${hospital.HospitalName} map` : "Map"}
        />
      </div>
    </section>
  );
}

export default Map;
