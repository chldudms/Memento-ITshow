import React from "react";
import "../styles/colorpicker.css";

interface ColorPickerProps {
  colors: string[];
  selectedColor: string;
  onSelectColor: (color: string) => void;
  fontSize: number;
  onChangeFontSize: (newSize: number) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  colors,
  selectedColor,
  onSelectColor,
  fontSize,
  onChangeFontSize,
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
    <div className="color-picker" style={{ display: "flex", alignItems: "center", gap: 10 }}>
      {/* 색상 선택 버튼 리스트 */}
      {colors.map((color) => (
        <button
          key={color}
          className={`color-button ${selectedColor === color ? "selected" : ""}`}
          style={{ backgroundColor: color }}
          onClick={() => onSelectColor(color)}
          aria-label={`색상 선택 ${color}`}
        />
      ))}

      {/* 폰트 크기 감소 버튼 */}
      <button
        onClick={handleDecrease}
        aria-label="폰트 크기 작게"
        style={{
          width: 30,
          height: 30,
          fontSize: 20,
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        –
      </button>

      {/* 현재 폰트 크기 표시 */}
      <div style={{ minWidth: 30, textAlign: "center", fontSize: 16 }}>{fontSize}</div>

      {/* 폰트 크기 증가 버튼 */}
      <button
        onClick={handleIncrease}
        aria-label="폰트 크기 크게"
        style={{
          width: 30,
          height: 30,
          fontSize: 20,
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        +
      </button>
    </div>
  );
};

export default ColorPicker;