import React from "react";
import Header from '../components/header';
import '../styles/home.css'
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Header />
      <img src="/img/addBtn.png" className="diaryAddBtn" alt="다이어리 생성 버튼"
        onClick={() => navigate('/createDiary')} />
    </div>
  );
};

export default Home;