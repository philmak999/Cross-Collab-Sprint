import './HospitalsList.scss';
import { useNavigate } from "react-router-dom";
import Button from '../Button/Button.jsx';
import EditIconTag from '../../assets/icons/Edit.svg';
import UserIconTag from '../../assets/icons/User.svg';
import HospitalCard from '../HospitalCard/HospitalCard.jsx';
import Map1 from '../../assets/maps/Map-1.jpg';
import Map2 from '../../assets/maps/Map-2.jpg';
import Map3 from '../../assets/maps/Map-3.jpg';
import { useState } from "react";

function HospitalsList() {
    const hospitals = [
        {
            HospitalName: "KT Hospital",
            Recommendscore: "90%",
            HospitalNameDistance: "10",
            DriveTime: "5",
            HospitalInfo: "Cardiac catheterization capability",
            AiRecommend: true,
            Map: Map1
        },
        {
            HospitalName: "Smith Hospital",
            Recommendscore: "15%",
            HospitalNameDistance: "6",
            DriveTime: "15",
            HospitalInfo: "Traffic near Jane and Finch",
            AiRecommend: false,
            Map: Map2
        },
        {
            HospitalName: "YORK HOSPITAL",
            Recommendscore: "10%",
            HospitalNameDistance: "15",
            DriveTime: "12",
            HospitalInfo: "Research-oriented Hospital",
            AiRecommend: false,
            Map: Map3
        }
    ]

     const [selectedIndex, setSelectedIndex] = useState(null);
    return (
        <div className='hospital-info'>
            <div className='top-part'>
                <p>Hospitals</p>
                {/* <Button
                    text="Add Custom Hospital"
                    icon={<img src={EditIconTag} alt="Hospital edit" />}
                    onClick={() => { }}
                    variant="hospital-edit"
                /> */}
            </div>
            <div className='main-part'>
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
                            icon={hospital.Map}
                            onClick={() => setSelectedIndex(index)}
                            isSelected={selectedIndex === index} 
                        />
                    ))}

                </div>
                <div className='map-display'>
                    {selectedIndex !== null && (
                        <img
                            src={hospitals[selectedIndex].Map}
                            alt="Selected Hospital Icon"
                            className="map"
                        />
                    )}
                </div>


            </div>
        </div>
    )
}
export default HospitalsList;
