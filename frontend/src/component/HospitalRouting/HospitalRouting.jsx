import "./HospitalRouting.scss";
import EditButton from "../EditButton/EditButton.jsx";

const HospitalRouting = () => {
  return (
    <div className="hospital__container">
      <h1 className="hospital__title">Hospital Routing</h1>
      <EditButton text="Add Another Hospital" />
    </div>
  );
};
export default HospitalRouting;
