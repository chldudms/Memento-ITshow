import React, { useState, useRef, useEffect } from "react";
import { ReactSketchCanvas, ReactSketchCanvasRef } from "react-sketch-canvas";
import "../styles/writediary.css";
import Header from "../components/header";
import TextBox from "../components/textBox";
import ColorPicker from "../components/textCustom";
import DrawCustom from '../components/drawCustom';
import ImageFile from '../components/imageFile';
import StickerToolbar from '../components/sticker';
import BackgroundColorToolbar from '../components/backgroundColor';
import image2 from "../assets/complete.png";
import icon1 from "../assets/text.png";
import icon2 from "../assets/draw.png";
import icon3 from "../assets/file.png";
import icon4 from "../assets/sticker.png";
import icon5 from "../assets/color_fill.png";

interface TextBoxData {
  id: number;
  parent: "main";
  color: string;
  fontSize: number;
}

interface StickerItem {
  id: number;
  src: string;
}

const WriteDiary = () => {
  // 모든 텍스트 박스 정보 저장
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

  // 캔버스 참조
  const CanvasRef = useRef<ReactSketchCanvasRef>(null);

  // 그리기 모드 상태
  const [isDrawing, setIsDrawing] = useState(false);

  // 그리기 툴바 표시 여부 상태
  const [drawToolbarVisible, setDrawToolbarVisible] = useState(false);

  // 그리기 선 두께 상태
  const [lineWidth, setLineWidth] = useState(2);

  // 그리기 툴바 DOM 참조
  const drawToolbarRef = useRef<HTMLDivElement>(null);

  // 배경 박스 DOM 참조
  const backgroundBoxesRef = useRef<HTMLDivElement>(null);

  // 파일 입력 ref 추가
  const fileInputRef = useRef<HTMLInputElement>(null);

  // StickerToolbar 컴포넌트에 붙일 ref 생성 (DOM 접근용)
  const stickerToolbarRef = useRef<HTMLDivElement>(null);

  // backgroundColorToolbarRef 컴포넌트에 붙일 ref 생성 (DOM 접근용)
  const backgroundColorToolbarRef = useRef<HTMLDivElement>(null);

  // 스티커 툴바 보임 여부 상태
  const [showStickerToolbar, setShowStickerToolbar] = useState(false);

  // 추가된 스티커 목록 상태 (id와 src로 구성된 배열)
  const [addedStickers, setAddedStickers] = useState<StickerItem[]>([]);

  // 배경색상 툴바 노출 상태를 관리하는 state (보여질 때 true)
  const [showBackgroundToolbar, setShowBackgroundToolbar] = useState(false);

  // 좌측 배경색 상태 (초기값 흰색)
  const [backgroundColor, setBackgroundColor] = useState("#FFFFFF");

  // 좌우 캔버스 지우개 모드를 독립적으로 관리
  const [eraseMode, setEraseMode] = useState(false);

  // 지우개 모드가 변경될 때마다 해당 캔버스에만 적용
  useEffect(() => {
    if (CanvasRef.current) {
      CanvasRef.current.eraseMode(eraseMode);
    }
  }, [eraseMode]);

  // 지우개 상태 변경 함수 (왼쪽 캔버스에만 적용)
  const handleEraseToggle = (val: boolean) => {
    setEraseMode(val);
  };

  // 지우개 상태 반환
  const getCurrentEraseMode = () => {
    return eraseMode;
  };

  // 스티커 추가 함수: 선택한 스티커 이미지 src를 받아 새로운 스티커 객체 생성 후 상태에 추가
  const handleAddSticker = (src: string) => {
    const newSticker = {
      id: Date.now(), // 고유 id로 현재 시간 사용
      src,            // 스티커 이미지 src
    };
    setAddedStickers((prev) => [...prev, newSticker]); // 기존 배열에 새 스티커 추가
  };

  // 삭제할 스티커 id를 받아 상태에서 해당 스티커 제거
  const handleDeleteSticker = (id: number) => {
    setAddedStickers((prev) => prev.filter((item) => item.id !== id)); // id가 다르면 유지
  };

  // icon3 클릭 시 파일 탐색기 열기 함수
  const handleFileIconClick = () => {
    fileInputRef.current?.click();
  };

  // icon4 클릭 시 스티커툴바 열기 함수
  const handleIcon4Click = () => {
    setShowStickerToolbar(prev => !prev); // 토글 방식으로 열고 닫기 가능
  };

  // 아이콘5 클릭 시 호출되는 함수
  const handleIcon5Click = () => {
    setShowBackgroundToolbar(prev => !prev); // 배경색상 툴바 토글 (켰다 껐다)
  };

  // 업로드된 이미지 목록 상태 관리 (id, 이미지 URL, 부모 영역 구분)
  const [uploadedImages, setUploadedImages] = useState<{ id: number; url: string; parent: "main" }[]>([]);

  // 파일 선택 시 실행되는 핸들러
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 선택된 파일 가져오기 (첫 번째 파일만 처리)
    const file = e.target.files?.[0];
    if (file) {
      // 선택된 파일을 임시 URL로 변환
      const imageUrl = URL.createObjectURL(file);
      // 기존 이미지 목록에 새 이미지 추가
      setUploadedImages(prev => [...prev, { id: Date.now(), url: imageUrl, parent: "main" }]);
    }
    // 같은 파일을 다시 업로드할 수 있게 input 초기화
    e.target.value = '';
  };

  // 그리기 아이콘 클릭 시, 그리기 모드 활성화 및 툴바 표시
  const handleDrawIconClick = () => {
    setIsDrawing(true);
    setDrawToolbarVisible(true);
    setEraseMode(false);  

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
        selectedBox?.element?.contains(target) ||
        colorPickerRef.current?.contains(target) ||
        stickerToolbarRef.current?.contains(target) ||
        backgroundColorToolbarRef.current?.contains(target)
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
      setShowStickerToolbar(false);
      setShowBackgroundToolbar(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [selectedTextBoxId]);

  // 텍스트 아이콘 클릭 시 새 텍스트 박스 추가
  const handleTextIconClick = () => {
    const newId = Date.now(); // 고유한 ID 생성
    setTextBoxes(prev => [
      ...prev,
      { id: newId, parent: "main", color: "#000000", fontSize: 20 },
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

      {/* 숨겨진 파일 입력 */}
      <input
        type="file"
        style={{ display: "none" }}
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      {/* 다이어리 본문 좌우 페이지 */}
      <div className="background-box" style={{ position: "relative" }} ref={backgroundBoxesRef}>
        <div className="box main-box" style={{ position: "relative", backgroundColor: backgroundColor }}>
          <div className="date-text">2025-05-20</div>
          {/* 왼쪽 페이지 텍스트 박스 렌더링 */}
          {textBoxes
            .filter(box => box.parent === "main")
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
          {isDrawing && (
            // 왼쪽 페이지 그리기 캔버스 표시
            <div
              style={{ position: "relative", width: "100%", height: "100%" }}
            >
              <ReactSketchCanvas
                ref={CanvasRef}
                canvasColor="transparent"
                style={{
                  position: "absolute",
                  top: 0, left: 0, right: 0, bottom: 0,
                  zIndex: 5,
                  background: "transparent",
                  pointerEvents: drawToolbarVisible ? "auto" : "none",
                }}
                strokeWidth={lineWidth}
                eraserWidth={lineWidth}
                strokeColor={selectedColor}
                width="100%"
                height="100%"
              />
            </div>
          )}
          {/* 그리기 툴바 표시 */}
          {drawToolbarVisible && (
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
                ref={drawToolbarRef}
                selectedColor={selectedColor}
                setSelectedColor={setSelectedColor}
                lineWidth={lineWidth}
                setLineWidth={setLineWidth}
                isErasing={getCurrentEraseMode()}
                setIsErasing={handleEraseToggle}
                onClose={handleCloseDrawCustom}
              />
            </div>
          )}
          {/* box 영역에 속한 업로드된 이미지 필터링 후 렌더링 */}
          {uploadedImages
            .filter(img => img.parent === "main")
            .map(img => (
              <ImageFile
                key={img.id}
                src={img.url}
                // 이미지 삭제 시 해당 이미지 상태에서 제거
                onDelete={() => {
                  setUploadedImages(prev =>
                    prev.filter(i => i.id !== img.id)
                  );
                }}
              />
            ))}
          {showStickerToolbar && (
            <StickerToolbar
              ref={stickerToolbarRef}
              onClose={() => setShowStickerToolbar(false)}
              onAddSticker={handleAddSticker} // 스티커 선택 시 추가 함수 호출
            />
          )}
          {/* 붙여놓은 스티커들 */}
          {addedStickers.map((sticker) => (
            <ImageFile
              key={sticker.id}
              src={sticker.src}
              initialLeft={100 + Math.random() * 200}
              initialTop={100 + Math.random() * 200}
              initialWidth={100}
              initialHeight={100}
              onDelete={() => handleDeleteSticker(sticker.id)}
            />
          ))}
          {/* 배경색상 툴바 컴포넌트 렌더링 (showBackgroundToolbar가 true일 때만) */}
          {showBackgroundToolbar ? (
            <BackgroundColorToolbar
              ref={backgroundColorToolbarRef}
              backgroundColor={backgroundColor}  // 현재 좌측 배경색 보여줌
              setBackgroundColor={(color) => {
                setBackgroundColor(color);       // 좌측 배경색 변경
              }}
              onClose={() => setShowBackgroundToolbar(false)} // 닫기 버튼 클릭 시 툴바 숨김
            />
          ) : null}
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
            ) : index === 2 ? (
              <img
                key={index}
                src={icon}
                alt={`툴${index}`}
                className="tool-icon"
                onClick={handleFileIconClick} // 파일 탐색기 열기
                style={{ cursor: "pointer" }}
              />
            ) : index === 3 ? (
              <img
                key={index}
                src={icon}
                alt={`툴${index}`}
                className="tool-icon"
                onClick={handleIcon4Click}
                style={{ cursor: "pointer" }}
              />
            ) : index === 4 ? (
              <img
                key={index}
                src={icon}
                alt={`툴${index}`}
                className="tool-icon"
                onClick={handleIcon5Click} // 배경색 변경
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