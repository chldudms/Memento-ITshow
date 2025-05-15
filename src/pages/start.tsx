import React from 'react';
import '../styles/start.css'
import { useNavigate } from 'react-router-dom';
const Start= () => {
    const navigate = useNavigate();
    
    return (
        <div className='startp'>
        <div className="container">
            <img src="/img/diarypage.png" alt="diary" className="diaryImg" />
            <div className="overlay">
                <h1 className="logo">MEMENTO</h1>
                <button className="startBtn" onClick={()=>navigate('/home')}>시작 하기</button>
            </div>
            </div>
            
     </div>

    );
};

export default Start;
