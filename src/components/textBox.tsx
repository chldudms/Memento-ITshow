import React, { useState, useRef, useEffect } from "react";
import { useGesture } from "@use-gesture/react";
import "../styles/textbox.css";
import dragIcon from "../assets/drag_icon.png";

interface TextBoxProps {
  id: number;
  onDelete: (id: number) => void;
  textColor?: string;
  onSelect: (id: number) => void;
  fontSize: number;
  excludeRefs?: React.RefObject<HTMLElement | null>[];
}

const TextBox: React.FC<TextBoxProps> = ({
  id,
  onDelete,
  textColor = "#000000",
  onSelect,
  fontSize,
  excludeRefs = [],
}) => {
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const posRef = useRef(pos);

  const [size, setSize] = useState({ width: 200, height: 0 });
  const sizeRef = useRef(size);

  const boxRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [isSelected, setIsSelected] = useState(true);
  const [text, setText] = useState("");

  // excludeRefs 최신 참조 저장용 ref
  const excludeRefsRef = useRef<React.RefObject<HTMLElement | null>[]>(excludeRefs);
  useEffect(() => {
    excludeRefsRef.current = excludeRefs;
  }, [excludeRefs]);

  // pos 상태 동기화
  useEffect(() => {
    posRef.current = pos;
  }, [pos]);

  // size 상태 동기화
  useEffect(() => {
    sizeRef.current = size;
  }, [size]);

  // 외부 클릭 감지 (excludeRefs 직접 의존성 배열에서 제거)
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (boxRef.current?.contains(target)) return;
      for (const ref of excludeRefsRef.current) {
        if (ref.current?.contains(target)) return;
      }
      setIsSelected(false);
      if (text.trim() === "") onDelete(id);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [text, id, onDelete]);

  // 텍스트 높이 자동 조정 (텍스트, 폰트 변경 시)
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const newHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${newHeight}px`;
      setSize((prev) => ({
        ...prev,
        height: newHeight,
      }));
    }
  }, [text, fontSize]);

  // 텍스트 입력 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    const newHeight = el.scrollHeight;
    el.style.height = `${newHeight}px`;
    setSize((prev) => ({
      ...prev,
      height: newHeight,
    }));
  };

  // 드래그 제스처
  const bindDrag = useGesture({
    onDrag: ({ movement: [mx, my], memo }) => {
      if (!memo) memo = { x: posRef.current.x, y: posRef.current.y };
      let newX = memo.x + mx;
      let newY = memo.y + my;
  
      const maxX = 530.15 * 2 - sizeRef.current.width;
      const maxY = 583.31 - sizeRef.current.height;
      newX = Math.max(0, Math.min(newX, maxX));
      newY = Math.max(0, Math.min(newY, maxY));
  
      setPos({ x: newX, y: newY });
      posRef.current = { x: newX, y: newY };
  
      return memo;
    },
  });  

  // 리사이즈 제스처
  const bindResize = useGesture(
    {
      onDrag: ({ movement: [mx, my], memo }) => {
        if (!memo) memo = { width: sizeRef.current.width, height: sizeRef.current.height };
        const maxWidth = 513 * 2;
        const maxHeight = 544;
        let newWidth = Math.max(100, Math.min(memo.width + mx, maxWidth));
        let newHeight = Math.max(60, Math.min(memo.height + my, maxHeight));
        setSize({ width: newWidth, height: newHeight });
        return memo;
      },
    },
    { drag: { filterTaps: true, rubberband: false }, eventOptions: { passive: false } }
  );

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const newHeight = textareaRef.current.scrollHeight;
      // 리사이즈된 높이보다 작으면 리사이즈 높이 유지
      const heightToSet = Math.max(newHeight, sizeRef.current.height);
      textareaRef.current.style.height = `${heightToSet}px`;
      setSize((prev) => {
        if (prev.height !== heightToSet) {
          return { ...prev, height: heightToSet };
        }
        return prev;
      });      
    }
  }, [text, fontSize]);  

  // Delete 키 처리
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Delete" && isSelected) {
      e.preventDefault();
      onDelete(id);
    }
  };

  return (
    <div
      ref={boxRef}
      className={`text-box-container ${isSelected ? "selected" : ""}`}
      onMouseDown={() => {
        setIsSelected(true);
        onSelect(id);
      }}
      style={{
        transform: `translate(${pos.x}px, ${pos.y}px)`,
        width: size.width,
        position: "absolute",
      }}
    >
      <img
        {...bindDrag()}
        src={dragIcon}
        alt="드래그 핸들"
        className="drag-handle"
        draggable={false}
      />

      <textarea
        ref={textareaRef}
        className="text-box-textarea"
        style={{ height: size.height, fontSize, color: textColor }}
        placeholder="텍스트를 입력하세요"
        onKeyDown={handleKeyDown}
        onChange={handleChange}
        value={text}
        spellCheck={false}
      />

      <div {...bindResize()} className="resize-handle" />
    </div>
  );
};

export default TextBox;