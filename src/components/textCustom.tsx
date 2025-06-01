import React from "react";
import "../styles/textcustom.css";
import xIcon from "../assets/x_icon.png";

interface ColorPickerProps {
  colors: string[];
  selectedColor: string;
  onSelectColor: (color: string) => void;
  fontSize: number;
  onChangeFontSize: (newSize: number) => void;
  onClose: () => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  colors,
  selectedColor,
  onSelectColor,
  fontSize,
  onChangeFontSize,
  onClose,
}) => {

  // 폰트 크기 증가 (최대 60)
  const handleIncrease = () => {
    if (fontSize < 60) onChangeFontSize(fontSize + 1);
  };

  // 폰트 크기 감소 (최소 10)
  const handleDecrease = () => {
    if (fontSize > 10) onChangeFontSize(fontSize - 1);
  };

  return (
    <div className="color-picker-wrapper">
      {/* 닫기 아이콘 */}
      <a onClick={onClose}>
        <img src={xIcon} alt="닫기 아이콘" className="close-icon" />
      </a>

      {/* 폰트 크기 조절 영역 */}
      <div className="font-size-controls">
        <button
          onClick={handleDecrease}
          aria-label="폰트 크기 작게"
          className="font-button"
        >
          –
        </button>

        <div className="font-size-display">{fontSize}</div>

        <button
          onClick={handleIncrease}
          aria-label="폰트 크기 크게"
          className="font-button"
        >
          +
        </button>
      </div>

      {/* 색상 선택 버튼 영역 */}
      <div className="color-picker-grid">
        {colors.map((color) => (
          <button
            key={color}
            className={`color-button ${selectedColor === color ? "selected" : ""}`}
            style={{ backgroundColor: color }}
            onClick={() => onSelectColor(color)}
            aria-label={`색상 선택 ${color}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ColorPicker;