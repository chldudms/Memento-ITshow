import React from "react"; 
import '../styles/writediary.css';
import Header from '../components/header';
import image1 from "../assets/next_page.png";
import image2 from "../assets/complete.png";
import icon1 from "../assets/text.png";
import icon2 from "../assets/draw.png";
import icon3 from "../assets/eraser.png";
import icon4 from "../assets/file.png";
import icon5 from "../assets/sticker.png";
import icon6 from "../assets/color_fill.png";

const WriteDiary = () => {
  return (
    <div className="container">
      <Header/>
      <div className="diary-title">오늘의 다이어리</div>
      {/* 사각형 2개 */}
      <div className="background-boxes">
        <div className="box left-box">
          <div className="date-text">2025-05-20</div>
        </div>
        <div className="box right-box">
          <img
            src={image1}
            alt="다음 페이지 이미지"
            className="next-page-image"
          />
        </div>
      </div>
      {/* 오른쪽 사이드 툴바 */}
      <div className="toolbar">
        <div className="toolbar-inner">
          {[icon1, icon2, icon3, icon4, icon5, icon6].map((icon, index) => (
            <img key={index} src={icon} alt={`툴아이콘${index}`} className="tool-icon" />
          ))}
        </div> 
      </div>
      <img
        src={image2}
        alt="완료 버튼 이미지"
        className="complete-image"
      />
    </div>
  );
}

export default WriteDiary;