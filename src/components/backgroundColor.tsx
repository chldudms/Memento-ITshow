import React, { forwardRef } from "react";
import "../styles/backgroundcolor.css";
import xIcon from "../assets/x_icon.png";

// 선택 가능한 색상 목록
const colors = ["#000000", "#FFFFFF", "#FFB6C1", "#FADADD", "#FFF1E6", "#FFF7B1", "#B7E4C7", "#E3F6F5","#A9D1FF", "#C2C9FF"];

interface BackgroundColorToolbarProps {
    backgroundColor: string;
    setBackgroundColor: (color: string) => void;
    onClose: () => void;
}

const BackgroundColorToolbar = forwardRef<HTMLDivElement, BackgroundColorToolbarProps>(({
    backgroundColor,
    setBackgroundColor,
    onClose,
}, ref) => {
    return (
        <div className="backgroundcolor-wrapper" ref={ref}>
            {/* 닫기 버튼 */}
            <a onClick={onClose}>
                <img src={xIcon} alt="닫기 아이콘" className="close-icon" />
            </a>

            {/* 색상 선택 버튼들 */}
            <div className="backgroundcolor-colors">
                {colors.map((c) => (
                    <button
                        key={c}
                        className={`backgroundcolor-color-btn ${c === backgroundColor ? "backgroundcolor-selected" : ""}`}
                        style={{ backgroundColor: c }}
                        onClick={() => {
                            setBackgroundColor(c);  // 배경 색상 변경
                        }}
                        aria-label={`배경 색상 ${c}`}
                    />
                ))}
            </div>
        </div>
    );
});

export default BackgroundColorToolbar;
