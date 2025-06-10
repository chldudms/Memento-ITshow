import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import '../styles/downloaddiary.css';
import Swal from 'sweetalert2';
import { colorList } from "../constants/colorList";

const DownloadDiary = () => {
  const [email, setEmail] = useState('');
  const [coverColor, setColor] = useState("gray")
  const [strapColor, setStrap] = useState("")
  const [sticker, setSticker] = useState("")
  const [Color, setCover] = useState("gray")
  const navigate = useNavigate();

  // 이메일 입력값 상태 업데이트
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  useEffect(() => {
    // 로컬 스토리지에서 diaryData 불러오기
    const data = localStorage.getItem("diaryData");
    if (data) {
      try {
        const parsed = JSON.parse(data);
        if (parsed.color) {
          setColor(parsed.color);
        }
        if (parsed.sticker) {
          setSticker(parsed.sticker);
        }
      } catch (err) {
        console.error("데이터 파싱 오류:", err);
      }
    }
  }, []);

  useEffect(() => {
    const selectedColorData = colorList.find(
      (colorItem) => colorItem.id === coverColor
    );

    if (selectedColorData) {
      setCover(selectedColorData.color)
      setStrap(selectedColorData.strapColor);
    } else {
      setStrap("");

      console.warn(`${coverColor}`);
    }
  }, [coverColor, colorList]);

  const handleDownload = async () => {
    if (!email) {
      await Swal.fire({
        title: '이메일을 입력해주세요.',
        icon: undefined,
        background: '#fff',
        timer: 1000,
        showConfirmButton: false,
        customClass: {
          popup: 'warn-popup',
          title: 'warn-title',
        },
      });
      return;
    }

    try {
      // 서버 API 호출 (customId 없이 이메일만 보내면 서버가 최신 다이어리 찾아서 처리)
      const response = await axios.post('http://localhost:5001/send-email', {
        email,
      });

      // 이메일 전송 후 알림 표시
      await Swal.fire({
        title: response.data.message || "이메일이 전송되었습니다!",
        icon: undefined,
        background: '#fff',
        timer: 1000,
        showConfirmButton: false,
        customClass: {
          popup: 'warn-popup',
          title: 'warn-title',
        },
      });

      // 저장 후 다운로드 페이지로 이동
      navigate("/");
    } catch (error) {
      console.error("이메일 전송 실패:", error);
      await Swal.fire({
        title: '이메일 전송 중 오류가 발생했습니다.',
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

  return (
    <div className="download-container">
      {/* 다이어리 커버 UI */}
      <div className="white-box"></div>
      <div className='diaryCover'>
        <div className='d-cover' style={{ backgroundColor: Color }} />
        <div className='d-strap' style={{ backgroundColor: strapColor }} />
        <div className='d-label' />

        <img src={`img/${sticker}.png`} className="diarySticker" />
      </div>

      {/* 이메일 입력 */}
      <input
        className="d-input"
        name="email"
        placeholder="Email"
        value={email}
        onChange={handleEmailChange}
      />

      {/* 다운로드 버튼 */}
      <button className="d-button" type="button" onClick={handleDownload}>download</button>
    </div>
  );
};

export default DownloadDiary;
