import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/header.css'

const Header = () => {
    const navigate = useNavigate();

    const handleHome = () => {
        // 필터 유지 플래그 제거해서 전체 목록 보여주기
        localStorage.removeItem('selectedHashtag');
        navigate('/home');
    };

    return (
        <div className='bar'>
            <h2 className='headerLogo' onClick={handleHome}>MEMENTO</h2>
        </div>
    )
};

export default Header;
