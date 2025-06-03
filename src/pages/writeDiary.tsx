import React, { useState, useRef, useEffect } from "react";
import { ReactSketchCanvas } from "react-sketch-canvas";
import "../styles/writediary.css";
import Header from "../components/header";
import TextBox from "../components/textBox";
import ColorPicker from "../components/textCustom";
import DrawCustom from '../components/drawCustom';
import image1 from "../assets/next_page.png";
import image2 from "../assets/complete.png";
import icon1 from "../assets/text.png";
import icon2 from "../assets/draw.png";
import icon3 from "../assets/file.png";
import icon4 from "../assets/sticker.png";
import icon5 from "../assets/color_fill.png";

interface TextBoxData {
  id: number;
  parent: "left" | "right";
  color: string;
  fontSize: number;
}

const WriteDiary = () => {
  // 상태: 모든 텍스트 박스 정보 저장
  const [textBoxes, setTextBoxes] = useState<TextBoxData[]>([]);

  // 설정 가능한 색상 리스트와 현재 선택된 색상
  const colors = ["#000000", "#FFFFFF", "#FF7F9E", "#F6B8B8", "#FFE08A", "#8FD9A8", "#4DB8FF", "#9AA7FF"];
  const [selectedColor, setSelectedColor] = useState(colors[0]);

  // 현재 선택된 텍스트 박스 ID
  const [selectedTextBoxId, setSelectedTextBoxId] = useState<number | null>(null);

  // 커스텀(텍스트)과 텍스트 박스 DOM 요소를 추적하기 위한 ref
  const colorPickerRef = useRef<HTMLDivElement>(null);
  type TextBoxRef = {
    element: HTMLDivElement | null;
    getText: () => string;
  } | null;
  const textBoxRefs = useRef<Map<number, TextBoxRef>>(new Map());

  // 커스텀(텍스트) 보이기 여부
  const [colorPickerVisible, setColorPickerVisible] = useState(false);

  // 좌우 페이지 각각의 캔버스 참조
  const leftCanvasRef = useRef(null);
  const rightCanvasRef = useRef(null);

  // 그리기 모드 상태 & 현재 선택한 페이지 ("left" or "right")
  const [isDrawingLeft, setIsDrawingLeft] = useState(false);
  const [isDrawingRight, setIsDrawingRight] = useState(false);

  // 그리기 툴바 표시 여부 상태
  const [drawToolbarVisible, setDrawToolbarVisible] = useState(false);

  // 그리기 선 두께 상태
  const [lineWidth, setLineWidth] = useState(2);

  // 지우개 모드 활성화 상태
  const [isErasing, setIsErasing] = useState(false);

  // 그리기 툴바 DOM 참조
  const drawToolbarRef = useRef<HTMLDivElement>(null);

  // 배경 박스 DOM 참조
  const backgroundBoxesRef = useRef<HTMLDivElement>(null);

  // 그리기 아이콘 클릭 시, 양쪽 페이지 그리기 모드 활성화 및 툴바 표시
  const handleDrawIconClick = () => {
    setIsDrawingLeft(true);
    setIsDrawingRight(true);
    setDrawToolbarVisible(true);

    setSelectedTextBoxId(null);  // 텍스트 박스 선택 해제
    setColorPickerVisible(false); // 색상 선택기 숨기기
  };

  // 그리기 툴바 닫기 처리
  const handleCloseDrawCustom = () => {
    setDrawToolbarVisible(false);
  };

  // 바깥 클릭 시 선택 해제 및 커스텀(텍스트) 숨김 처리
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      const selectedBox = selectedTextBoxId ? textBoxRefs.current.get(selectedTextBoxId) : null;

      // 클릭한 요소가 선택된 텍스트박스나 커스텀(텍스트) 내부라면 무시
      if (
        drawToolbarRef.current?.contains(target) ||
        backgroundBoxesRef.current?.contains(target) ||
        selectedBox?.element?.contains(target) ||
        colorPickerRef.current?.contains(target)
      ) {
        return;
      }

      // 선택된 텍스트 박스가 비어 있으면 삭제
      if (selectedTextBoxId !== null) {
        const boxRefObj = textBoxRefs.current.get(selectedTextBoxId);
        const text = boxRefObj?.getText?.();
        if (text === "") {
          handleDeleteTextBox(selectedTextBoxId);
        }
      }

      // 바깥 클릭 시 선택 해제 및 커스텀(텍스트) 닫기
      setSelectedTextBoxId(null);
      setColorPickerVisible(false);
      setDrawToolbarVisible(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [selectedTextBoxId]);

  // 텍스트 아이콘 클릭 시 새 텍스트 박스 추가
  const handleTextIconClick = () => {
    const newId = Date.now(); // 고유한 ID 생성
    setTextBoxes(prev => [
      ...prev,
      { id: newId, parent: "left", color: "#000000", fontSize: 20 },
    ]);
    setSelectedTextBoxId(newId);
    setColorPickerVisible(true);
  };

  // 텍스트 박스 삭제 처리
  const handleDeleteTextBox = (id: number) => {
    setTextBoxes(prev => prev.filter(box => box.id !== id));
    if (id === selectedTextBoxId) {
      setSelectedTextBoxId(null);
      setColorPickerVisible(false);
    }
  };

  // 색상 변경 처리
  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    if (selectedTextBoxId !== null) {
      setTextBoxes(prev =>
        prev.map(box =>
          box.id === selectedTextBoxId ? { ...box, color } : box
        )
      );
    }
  };

  // 폰트 크기 변경 처리
  const handleFontSizeChange = (newSize: number) => {
    if (selectedTextBoxId === null) return;
    setTextBoxes(prev =>
      prev.map(box =>
        box.id === selectedTextBoxId ? { ...box, fontSize: newSize } : box
      )
    );
  };

  // 텍스트 박스 클릭 시 선택 상태로 전환
  const handleSelectTextBox = (id: number) => {
    setSelectedTextBoxId(id);
    setColorPickerVisible(true);
  };

  return (
    <div className="write-container">
      <Header />
      <div className="diary-title">오늘의 다이어리</div>

      {/* 커스텀(텍스트) 표시 */}
      {colorPickerVisible && selectedTextBoxId !== null && (
        <div
          ref={colorPickerRef}
          style={{ position: "absolute", top: 100, right: 20, zIndex: 10 }}
        >
          <ColorPicker
            colors={colors}
            selectedColor={selectedColor}
            onSelectColor={handleColorChange}
            fontSize={
              textBoxes.find(box => box.id === selectedTextBoxId)?.fontSize || 20
            }
            onChangeFontSize={handleFontSizeChange}
            onClose={() => setColorPickerVisible(false)}
          />
        </div>
      )}

      {/* 다이어리 본문 좌우 페이지 */}
      <div className="background-boxes" style={{ position: "relative" }} ref={backgroundBoxesRef}>
        <div className="box left-box" style={{ position: "relative" }}>
          <div className="date-text">2025-05-20</div>
          {/* 왼쪽 페이지 텍스트 박스 렌더링 */}
          {textBoxes
            .filter(box => box.parent === "left")
            .map(box => (
              <TextBox
                key={box.id}
                id={box.id}
                onDelete={handleDeleteTextBox}
                textColor={box.color}
                fontSize={box.fontSize}
                onSelect={handleSelectTextBox}
                isSelected={selectedTextBoxId === box.id}
                ref={(el) => {
                  if (el) {
                    textBoxRefs.current.set(box.id, el);
                  } else {
                    textBoxRefs.current.delete(box.id);
                  }
                }} />
            ))}
          {isDrawingLeft && (
            // 왼쪽 페이지 그리기 캔버스 표시
            <ReactSketchCanvas
              ref={leftCanvasRef}
              style={{
                position: "absolute",
                top: 0, left: 0, right: 0, bottom: 0,
                zIndex: 5,
                background: "transparent",
                pointerEvents: drawToolbarVisible ? "auto" : "none",
              }}
              strokeWidth={lineWidth} // 현재 선 두께 적용
              strokeColor={isErasing ? "#FFFFFF" : selectedColor}  // 지우개 모드면 배경색으로 선 색 변경
              width="100%"
              height="100%"
            />
          )}
          {drawToolbarVisible && (
            // 그리기 툴바 컴포넌트 표시 (색상, 선 두께, 지우개 등 조절)
            <div
              style={{
                position: "absolute",
                top: 100,
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 10,
              }}
            >
              <DrawCustom
                selectedColor={selectedColor}
                setSelectedColor={setSelectedColor}
                lineWidth={lineWidth}
                setLineWidth={setLineWidth}
                isErasing={isErasing}
                setIsErasing={setIsErasing}
                onClose={handleCloseDrawCustom}
              />
            </div>
          )}
        </div>

        <div className="box right-box" style={{ position: "relative" }}>
          <img src={image1} alt="다음 페이지" className="next-page-image" />
          {/* 오른쪽 페이지 텍스트 박스 렌더링 */}
          {textBoxes
            .filter(box => box.parent === "right")
            .map(box => (
              <TextBox
                key={box.id}
                id={box.id}
                onDelete={handleDeleteTextBox}
                textColor={box.color}
                fontSize={box.fontSize}
                onSelect={handleSelectTextBox}
                isSelected={selectedTextBoxId === box.id}
                ref={(el) => {
                  if (el) {
                    textBoxRefs.current.set(box.id, el);
                  } else {
                    textBoxRefs.current.delete(box.id);
                  }
                }} />
            ))}
          {isDrawingRight && (
            // 오른쪽 페이지 그리기 캔버스 표시
            <ReactSketchCanvas
              ref={rightCanvasRef}
              style={{
                position: "absolute",
                top: 0, left: 0, right: 0, bottom: 0,
                zIndex: 5,
                background: "transparent",
                pointerEvents: drawToolbarVisible ? "auto" : "none",
              }}
              strokeWidth={lineWidth}
              strokeColor={isErasing ? "#FFFFFF" : selectedColor}
              width="100%"
              height="100%"
            />
          )}
        </div>
      </div>

      {/* 툴바 아이콘 */}
      <div className="toolbar">
        <div className="toolbar-inner">
          {[icon1, icon2, icon3, icon4, icon5].map((icon, index) =>
            index === 0 ? (
              <img
                key={index}
                src={icon}
                alt={`툴${index}`}
                className="tool-icon"
                onClick={handleTextIconClick} // 텍스트 추가
                style={{ cursor: "pointer" }}
              />
            ) : index === 1 ? (
              <img
                key={index}
                src={icon}
                alt={`툴${index}`}
                className="tool-icon"
                onClick={handleDrawIconClick}
                style={{ cursor: "pointer" }}
              />
            ) : (
              <img key={index} src={icon} alt={`툴${index}`} className="tool-icon" />
            )
          )}
        </div>
      </div>

      {/* 완료 버튼 이미지 */}
      <img src={image2} alt="완료" className="complete-image" />
    </div>
  );
};

export default WriteDiary;