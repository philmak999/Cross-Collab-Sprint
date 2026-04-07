import { useState } from 'react';
import './HospitalCard.scss';
import CheckIconTag from '../../assets/icons/Check.svg';
import MapIconTag from '../../assets/icons/Map.svg';
import AlertIconTag from '../../assets/icons/Alert.svg';

function HospitalInfo({ text, details, icon, iconAlt, iconClass }) {
    const [expanded, setExpanded] = useState(false);
    if (!text) return null;

    return (
        <div className='hospital-info'>
            <img src={icon} alt={iconAlt} className={iconClass} />
            <div className='hospital-info__body'>
                <div className='hospital-info__row'>
                    <p className='hospital-info__label'>{text}</p>
                    {details && (
                        <button
                            className='hospital-info__toggle'
                            onClick={(e) => { e.stopPropagation(); setExpanded((v) => !v); }}
                        >
                            {expanded ? 'Less' : 'View more details'}
                        </button>
                    )}
                </div>
                {expanded && details && (
                    <p className='hospital-info__details'>{details}</p>
                )}
            </div>
        </div>
    );
}

function HospitalCard({
    HospitalName,
    Recommendscore,
    HospitalNameDistance,
    DriveTime,
    HospitalInfo: info,
    HospitalDetails,
    AiRecommend,
    onClick,
    isSelected
}) {
    return (
        <div
            className={`card ${AiRecommend ? 'ai' : 'normal'} ${isSelected ? 'selected' : ''}`}
            onClick={onClick}
        >
            <div className='display-area'>
                {AiRecommend ? (
                    <>
                        <div className='recommend-flag'>
                            <img src={CheckIconTag} alt="CheckLogo" className="check-icon_white" />
                            <p>RECOMMENDED</p>
                        </div>
                        <h3 className='hospital-name'>{HospitalName}</h3>
                        <div className='hospital-detail'>
                            <div className='hospital-score'>
                                <p className='score-icon'>•</p>
                                <p className='score-number'>{Recommendscore} Match Score</p>
                            </div>
                            <div className='gps-info'>
                                <img src={MapIconTag} alt="MapLogo" className="map-icon" />
                                <p>{HospitalNameDistance} km away</p>
                                <p>•</p>
                                <p className="drive-time">{DriveTime} minutes</p>
                            </div>
                            <HospitalInfo
                                text={info}
                                details={HospitalDetails}
                                icon={CheckIconTag}
                                iconAlt="CheckLogo"
                                iconClass="check-icon_green"
                            />
                        </div>
                    </>
                ) : (
                    <>
                        <h3 className='hospital-name'>{HospitalName}</h3>
                        <div className='hospital-detail'>
                            <div className='hospital-score'>
                                <p className='score-icon'>•</p>
                                <p className='score-number'>{Recommendscore} Match Score</p>
                            </div>
                            <div className='gps-info'>
                                <img src={MapIconTag} alt="MapLogo" className="map-icon" />
                                <p>{HospitalNameDistance} km away</p>
                                <p>•</p>
                                <p className="drive-time">{DriveTime} minutes</p>
                            </div>
                            <HospitalInfo
                                text={info}
                                details={HospitalDetails}
                                icon={AlertIconTag}
                                iconAlt="AlertLogo"
                                iconClass="alert-icon"
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default HospitalCard;
