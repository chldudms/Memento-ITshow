import React from "react";
import '../styles/downloaddiary.css';

const DownloadDiary = () => {
    return (
        <div className="download-container">
            <div className="white-box"></div>
            <div className='diaryCover'>
                <div className='d-cover' />
                <div className='d-strap' />
                <div className='d-label' />
            </div>
            <input className="d-input" name="email" placeholder="Email"/>
            <button className="d-button" type="submit">download</button>
        </div>
    );
};

export default DownloadDiary