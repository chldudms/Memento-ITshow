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
            <a onClick={onClose}>
                <img src={xIcon} alt="닫기 아이콘" className="close-icon" />
            </a>

            <button
                className="drawcustom-toggle-erase-btn"
                onClick={() => setIsErasing(!isErasing)}
                aria-label={isErasing ? "그리기 모드로 전환" : "지우개 모드로 전환"}
            >
                <img
                    src={isErasing ? penIcon : eraserIcon}
                    alt={isErasing ? "펜 아이콘" : "지우개 아이콘"}
                    style={{ width: 20, height: 20, marginTop: "4px" }}
                />
            </button>

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

            <div className="drawcustom-colors">
                {colors.map((c) => (
                    <button
                        key={c}
                        className={`drawcustom-color-btn ${c === selectedColor ? "drawcustom-selected" : ""}`}
                        style={{ backgroundColor: c }}
                        onClick={() => {
                            setIsErasing(false);
                            setSelectedColor(c);
                        }}
                        aria-label={`선 색상 ${c}`}
                    />
                ))}
            </div>
        </div>
    );
});

export default DrawCustom;