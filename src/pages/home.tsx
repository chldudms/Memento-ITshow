import React, { useEffect, useState } from "react";
import Header from '../components/header';
import '../styles/home.css'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

interface Diary {
  id: number;
  title: string;
  color: string;
  hashtags: string;
  sticker: string;
  password: string,
  created_at: string;
}

const Home = () => {
  const navigate = useNavigate();
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [inputPw, setInputPw] = useState(""); // 유저 입력값
  const [selectedDiary, setSelectedDiary] = useState<Diary | null>(null); // 클릭된 다이어리 저장
  const [diaryPw, setPw] = useState("");

  function diaryView(diary: Diary) {
    setPw(diary.password)
    console.log(inputPw)
    if (diary.password) {
      // 비번 있는 다이어리는 모달 오픈
      setSelectedDiary(diary);
      setShowModal(true);
    } else {
      // 비번 없는 다이어리는 바로 페이지로 이동
      localStorage.setItem('diaryId', diary.id.toString());
      navigate("/DiaryView");
    }
  }

  const passwordCheck = async () => {
    if (selectedDiary && inputPw === selectedDiary.password) {
      console.log(inputPw);
      console.log(selectedDiary.password);
      localStorage.setItem('diaryId', selectedDiary.id.toString());
      navigate("/DiaryView");
      setShowModal(false);
      setInputPw("");
    } else {
      await Swal.fire({
        title: '비밀번호가 일치하지 않습니다.',
        icon: undefined,
        background: '#fff',
        timer: 1000,
        showConfirmButton: false,
        customClass: {
          popup: 'warn-popup',
          title: 'warn-title',
        },
      });
    }
  };

  useEffect(() => {
    const fetchDiaries = async () => {
      try {
        const response = await axios.get('http://localhost:5001/loadDiarys');
        setDiaries(response.data);
        console.log(response.data)

      } catch (error) {
        console.error('다이어리 불러오기 실패.', error);
      }
    };
    fetchDiaries();
  }, []);


  return (
    <div>
      <Header />
      <img
        src="/img/addBtn.svg"
        className="diaryAddBtn"
        alt="다이어리 생성 버튼"
        onClick={() => navigate('/createDiary')}
      />

      <div className="diaryList">
        {diaries.map((v, i) => (
          <div onClick={() => diaryView(v)} className="diaryItem" key={i}>
            <img src={`img/${v.color}Cover.png`} alt={`다이어리 ${i + 1}`} />
            {v.sticker && (
              <img src={`img/${v.sticker}.png`} className="diary-Sticker" />
            )}            <p className="diary-Title">{v.title}</p>
            {v.hashtags && <div className="hashs">{v.hashtags}</div>}
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modalOverlay">
          <div className="pwModal">
            <p className="pw">다이어리 비밀번호</p>
            <input placeholder="다이어리 비밀번호를 입력 해주세요."
              onChange={(e) => setInputPw(e.target.value)} />
            <button className="submitBtn" onClick={passwordCheck}>확인</button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Home;
