import React, { forwardRef } from "react";
import "../styles/drawcustom.css";
import xIcon from "../assets/x_icon.png";
import eraserIcon from "../assets/eraser.png";
import penIcon from "../assets/pencil.png";

// 선택 가능한 색상 목록
const colors = ["#000000", "#FFFFFF", "#FF7F9E", "#F6B8B8", "#FFE08A", "#8FD9A8", "#4DB8FF", "#9AA7FF"];

interface DrawCustomProps {
    selectedColor: string;
    setSelectedColor: (color: string) => void;
    lineWidth: number;
    setLineWidth: (width: number) => void;
    isErasing: boolean;
    setIsErasing: (val: boolean) => void;
    onClose: () => void;
}

const DrawCustom = forwardRef<HTMLDivElement, DrawCustomProps>(({
    selectedColor,
    setSelectedColor,
    lineWidth,
    setLineWidth,
    isErasing,
    setIsErasing,
    onClose,
}, ref) => {
    return (
        <div className="drawcustom-wrapper" ref={ref}>
            {/* 닫기 버튼 (툴바 닫기 처리) */}
            <a onClick={onClose}>
                <img src={xIcon} alt="닫기 아이콘" className="close-icon" />
            </a>

            {/* 지우개/펜 모드 토글 버튼 */}
            <button
                className="drawcustom-toggle-erase-btn"
                onClick={() => setIsErasing(!isErasing)}
                aria-label={isErasing ? "그리기 모드로 전환" : "지우개 모드로 전환"}
            >
                {/* 현재 모드에 따른 아이콘 표시 */}
                <img
                    src={isErasing ? penIcon : eraserIcon}
                    alt={isErasing ? "펜 아이콘" : "지우개 아이콘"}
                    style={{ width: 20, height: 20, marginTop: "4px" }}
                />
            </button>

            {/* 선 두께 조절 슬라이더 */}
            <div className="drawcustom-linewidth-control">
                <input
                    id="lineWidthRange"
                    type="range"
                    min={1}
                    max={40}
                    value={lineWidth}
                    onChange={(e) => setLineWidth(parseInt(e.target.value))}
                />
            </div>

            {/* 색상 선택 버튼들 */}
            <div className="drawcustom-colors">
                {colors.map((c) => (
                    <button
                        key={c}
                        className={`drawcustom-color-btn ${c === selectedColor ? "drawcustom-selected" : ""}`}
                        style={{ backgroundColor: c }}
                        onClick={() => {
                            setIsErasing(false); // 색상 선택 시 지우개 모드 해제
                            setSelectedColor(c);  // 선택된 색상 변경
                        }}
                        aria-label={`선 색상 ${c}`}
                    />
                ))}
            </div>
        </div>
    );
});

export default DrawCustom;