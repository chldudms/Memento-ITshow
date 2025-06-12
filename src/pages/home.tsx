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
  const [selectedHashtag, setSelectedHashtag] = useState<string | null>(null);

  function diaryView(diary: Diary) {
    // 비밀번호가 있는 다이어리는 모달 오픈
    if (diary.password) {
      setSelectedDiary(diary);
      setShowModal(true);
    } else {
      // 비밀번호 없는 다이어리는 바로 페이지로 이동
      localStorage.setItem('diaryId', diary.id.toString());
      navigate("/DiaryView");
    }
  }

  const passwordCheck = async () => {
    if (selectedDiary && inputPw === selectedDiary.password) {
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
        const keepFilter = localStorage.getItem('keepHashtagFilter');
        const storedTag = localStorage.getItem('selectedHashtag');

        if (keepFilter && storedTag) {
          // 플래그가 있고 저장된 태그가 있으면 필터된 목록 불러오기
          const response = await axios.get(`http://localhost:5001/loadHashtagDiarys?hashtag=${encodeURIComponent(storedTag)}`);
          setDiaries(response.data);
          setSelectedHashtag(storedTag);
          localStorage.removeItem('keepHashtagFilter'); // 플래그는 사용 후 제거
        } else {
          // 플래그 없으면 전체 목록 불러오기
          const response = await axios.get('http://localhost:5001/loadDiarys');
          setDiaries(response.data);
          setSelectedHashtag(null);
          localStorage.removeItem('selectedHashtag'); // 태그도 제거해서 초기화
        }
      } catch (error) {
        console.error('다이어리 불러오기 실패.', error);
      }
    };
    fetchDiaries();
  }, []);

  // 모달 닫기 함수
  const closeModal = () => {
    setShowModal(false);
    setInputPw("");
    setSelectedDiary(null);
  };

  // 외부 클릭 시 모달 닫기
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  // 해시태그별 다이어리 목록 필터링
  const handleHashtagClick = async (tag: string) => {
    try {
      if (selectedHashtag === tag) {
        const response = await axios.get('http://localhost:5001/loadDiarys');
        setDiaries(response.data);
        setSelectedHashtag(null);
        localStorage.removeItem('selectedHashtag'); // 저장된 해시태그 제거
      } else {
        const response = await axios.get(`http://localhost:5001/loadHashtagDiarys?hashtag=${encodeURIComponent(tag)}`);
        setDiaries(response.data);
        setSelectedHashtag(tag);
        localStorage.setItem('selectedHashtag', tag); // 해시태그 저장
      }
    } catch (error) {
      console.error('다이어리 불러오기 실패:', error);
    }
  };

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
        {diaries.map((v) => (
          <div onClick={() => diaryView(v)} className="diaryItem" key={v.id}>
            <div className="imageContainer">
              <img src={`img/${v.color}Cover.png`} alt={`다이어리 ${v.title}`} />
              {v.sticker && (
                <img src={`img/${v.sticker}.png`} className="diary-Sticker" alt="감정 스티커" />
              )}
            </div>
            <div className="contentContainer">
              <p className="diary-Title">{v.title}</p>
              {v.hashtags && (
                <div className="hashs" onClick={(e) => {
                  e.stopPropagation(); // 부모 클릭 이벤트 방지
                  handleHashtagClick(v.hashtags);
                }}>
                  {v.hashtags}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modalOverlay" onClick={handleOverlayClick}>
          <div className="pwModal">
            <p className="pw">다이어리 비밀번호</p>
            <input
              placeholder="다이어리 비밀번호를 입력 해주세요."
              onChange={(e) => setInputPw(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  passwordCheck();
                }
              }}
              value={inputPw}
              type="password"
            />
            <button className="submitBtn" onClick={passwordCheck}>확인</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;