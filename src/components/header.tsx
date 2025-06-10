import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/header.css'

const Header = () => {
    const navigate = useNavigate();

    const handleHome = () => {
        navigate('/home');
    };

    return (
        <div className='bar'>
            <h2 className='headerLogo' onClick={handleHome}>MEMENTO</h2>
        </div>
    )
};

export default Header;
