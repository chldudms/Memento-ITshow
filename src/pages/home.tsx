import React, { useEffect, useState } from "react";
import Header from '../components/header';
import '../styles/home.css'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Diary {
  id: number;
  title: string;
  color: string;
  hashtags: string;
  sticker: string;
  created_at: string;
}

const Home = () => {
  const navigate = useNavigate();
  const [diaries, setDiaries] = useState<Diary[]>([]);

  useEffect(() => {
    const fetchDiaries = async () => {
      try {
        const response = await axios.get('http://localhost:5001/loadDiarys');
        setDiaries(response.data);
        console.log(response.data)

      } catch (error) {
        console.error('다이어리 불러오기 실패', error);
      } 
    };
    fetchDiaries();
  }, []);

  return (
    <div>
      <Header />
      <img
        src="/img/addBtn.png"
        className="diaryAddBtn"
        alt="다이어리 생성 버튼"
        onClick={() => navigate('/createDiary')}
      />

      <div className="diaryList">
        {diaries.map((v, i) => (
          <div className="diaryItem" key={i}>
            <img src={`img/${v.color}Cover.png`} alt={`다이어리 ${i + 1}`} />
            {v.sticker && (
              <img src={`img/${v.sticker}.png`} className="diarySticker" />
            )}            <p className="diaryTitle">{v.title}</p>
          </div>
        ))}
      </div>


      
    </div>
  );
};

export default Home;
