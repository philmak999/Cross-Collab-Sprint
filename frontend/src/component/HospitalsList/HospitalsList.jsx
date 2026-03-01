import "./HospitalsList.scss";
import HospitalCard from "../HospitalCard/HospitalCard.jsx";

function HospitalsList({ hospitals = [], selectedIndex = null, onSelect }) {
    return (
        <div className='hospital-info'>
            <div className='hospital-ai'>
                {hospitals.map((hospital, index) => (
                    <HospitalCard
                        key={index}
                        HospitalName={hospital.HospitalName}
                        Recommendscore={hospital.Recommendscore}
                        HospitalNameDistance={hospital.HospitalNameDistance}
                        DriveTime={hospital.DriveTime}
                        HospitalInfo={hospital.HospitalInfo}
                        AiRecommend={hospital.AiRecommend}
                        onClick={() => onSelect?.(index)}
                        isSelected={selectedIndex === index}
                    />
                ))}

            </div>
        </div>
    )
}
export default HospitalsList;
