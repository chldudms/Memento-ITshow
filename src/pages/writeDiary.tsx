import React, { useState, useRef } from "react";
import "../styles/writediary.css";
import Header from "../components/header";
import TextBox from "../components/textBox";
import ColorPicker from "../components/colorPicker";
import image1 from "../assets/next_page.png";
import image2 from "../assets/complete.png";
import icon1 from "../assets/text.png";
import icon2 from "../assets/draw.png";
import icon3 from "../assets/eraser.png";
import icon4 from "../assets/file.png";
import icon5 from "../assets/sticker.png";
import icon6 from "../assets/color_fill.png";

interface TextBoxData {
  id: number;
  parent: "left" | "right"; // 텍스트박스 위치 구분
  color: string;
  fontSize: number;
}

const WriteDiary = () => {
  // 텍스트박스 상태 관리
  const [textBoxes, setTextBoxes] = useState<TextBoxData[]>([]);
  // 색상 리스트 및 선택된 색상 상태
  const colors = ["#000000", "#FF4C4C", "#4C6EFF", "#4CFF9E", "#FFD54C", "#A64CFF"];
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  // 선택된 텍스트박스 id 상태
  const [selectedTextBoxId, setSelectedTextBoxId] = useState<number | null>(null);
  // 색상 선택기 참조
  const colorPickerRef = React.useRef<HTMLDivElement>(null);

  // 텍스트박스 추가 (기본은 왼쪽 박스)
  const handleTextIconClick = () => {
    setTextBoxes((prev) => [
      ...prev,
      { id: Date.now(), parent: "left", color: "#000000", fontSize: 20 },
    ]);
  };

  // 텍스트박스 삭제
  const handleDeleteTextBox = (id: number) => {
    setTextBoxes((prev) => prev.filter((box) => box.id !== id));
  };

  // 선택된 텍스트박스 색상 변경
  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    if (selectedTextBoxId !== null) {
      setTextBoxes((prev) =>
        prev.map((box) =>
          box.id === selectedTextBoxId ? { ...box, color } : box
        )
      );
    }
  };

  // 선택된 텍스트박스 폰트 크기 변경
  const handleFontSizeChange = (newSize: number) => {
    if (selectedTextBoxId === null) return;
    setTextBoxes((prev) =>
      prev.map((box) =>
        box.id === selectedTextBoxId ? { ...box, fontSize: newSize } : box
      )
    );
  };

  return (
    <div className="write-container">
      <Header />
      <div className="diary-title">오늘의 다이어리</div>

      {/* 색상 선택기 컴포넌트 */}
      <div ref={colorPickerRef} style={{ position: "absolute", top: 100, right: 20, zIndex: 10 }}>
        <ColorPicker
          colors={colors}
          selectedColor={selectedColor}
          onSelectColor={handleColorChange}
          fontSize={
            selectedTextBoxId !== null
              ? textBoxes.find(box => box.id === selectedTextBoxId)?.fontSize || 20
              : 20
          }
          onChangeFontSize={handleFontSizeChange}
        />
      </div>

      {/* 텍스트박스가 위치하는 좌우 박스 */}
      <div className="background-boxes" style={{ position: "relative" }}>
        {/* 왼쪽 박스: 날짜 표시 및 왼쪽 텍스트박스 렌더링 */}
        <div className="box left-box" style={{ position: "relative" }}>
          <div className="date-text">2025-05-20</div>
          {textBoxes
            .filter(box => box.parent === "left")
            .map(box => (
              <TextBox
                key={box.id}
                id={box.id}
                onDelete={handleDeleteTextBox}
                textColor={box.color}
                fontSize={box.fontSize}
                onSelect={setSelectedTextBoxId}
                excludeRefs={[colorPickerRef]} // 색상선택기 제외
              />
            ))}
        </div>

        {/* 오른쪽 박스: 이미지 및 오른쪽 텍스트박스 렌더링 */}
        <div className="box right-box" style={{ position: "relative" }}>
          <img src={image1} alt="다음 페이지" className="next-page-image" />
          {textBoxes
            .filter(box => box.parent === "right")
            .map(box => (
              <TextBox
                key={box.id}
                id={box.id}
                onDelete={handleDeleteTextBox}
                textColor={box.color}
                fontSize={box.fontSize}
                onSelect={setSelectedTextBoxId}
                excludeRefs={[colorPickerRef]} // 색상선택기 제외
              />
            ))}
        </div>
      </div>

      {/* 하단 툴바 - 텍스트 추가 아이콘에 클릭 이벤트 연결 */}
      <div className="toolbar">
        <div className="toolbar-inner">
          {[icon1, icon2, icon3, icon4, icon5, icon6].map((icon, index) =>
            index === 0 ? (
              <img
                key={index}
                src={icon}
                alt={`툴${index}`}
                className="tool-icon"
                onClick={handleTextIconClick}
                style={{ cursor: "pointer" }}
              />
            ) : (
              <img key={index} src={icon} alt={`툴${index}`} className="tool-icon" />
            )
          )}
        </div>
      </div>

      {/* 완료 이미지 */}
      <img src={image2} alt="완료" className="complete-image" />
    </div>
  );
};

export default WriteDiary;