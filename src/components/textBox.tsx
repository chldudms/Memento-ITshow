import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { useGesture } from "@use-gesture/react";
import "../styles/textbox.css";
import dragIcon from "../assets/drag_icon.png";

interface TextBoxProps {
  id: number;
  onDelete: (id: number) => void;
  textColor?: string;
  onSelect: (id: number) => void;
  fontSize: number;
  isSelected: boolean;
}

export interface TextBoxRef {
  element: HTMLDivElement | null;
  getText: () => string;
}

const TextBox = forwardRef<TextBoxRef, TextBoxProps>(
  ({ id, onDelete, textColor = "#000000", onSelect, fontSize, isSelected }, ref) => {
    // 위치, 크기, 내용 상태 관리
    const [pos, setPos] = useState({ x: 50, y: 50 });
    const [size, setSize] = useState({ width: 200, height: 0 });
    const [text, setText] = useState("");

    // 외부 참조용 ref 및 내부 위치/크기 ref
    const posRef = useRef(pos);
    const sizeRef = useRef(size);
    const boxRef = useRef<HTMLDivElement | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const divRef = useRef<HTMLDivElement>(null);

    // 부모 컴포넌트에서 접근할 수 있도록 외부 ref에 div 노출
    useImperativeHandle(ref, () => ({
      element: divRef.current,
      getText: () => text,
    }));

    useEffect(() => {
      posRef.current = pos;
    }, [pos]);

    useEffect(() => {
      sizeRef.current = size;
    }, [size]);

    // 글 내용 변경 시 height 자동 조절
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

    // 텍스트 변경 핸들러
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setText(e.target.value);
      const el = e.target;
      el.style.height = "auto";
      const newHeight = el.scrollHeight;
      el.style.height = `${newHeight}px`;
      setSize(prev => ({ ...prev, height: newHeight }));
    };

    // 드래그 제스처로 위치 변경
    const bindDrag = useGesture({
      onDrag: ({ movement: [mx, my], memo }) => {
        if (!memo) memo = { x: posRef.current.x, y: posRef.current.y };
        let newX = memo.x + mx;
        let newY = memo.y + my;

        // 드래그 제한 (다이어리 범위)
        const maxX = 530.15 * 2 - sizeRef.current.width;
        const maxY = 583.31 - sizeRef.current.height;
        newX = Math.max(0, Math.min(newX, maxX));
        newY = Math.max(0, Math.min(newY, maxY));

        setPos({ x: newX, y: newY });
        posRef.current = { x: newX, y: newY };
        return memo;
      },
    });

    // 크기 조절 제스처
    const bindResize = useGesture({
      onDrag: ({ movement: [mx, my], memo }) => {
        if (!memo) memo = { width: sizeRef.current.width, height: sizeRef.current.height };
        const maxWidth = 513 * 2;
        const maxHeight = 544;
        let newWidth = Math.max(100, Math.min(memo.width + mx, maxWidth));
        let newHeight = Math.max(60, Math.min(memo.height + my, maxHeight));
        setSize({ width: newWidth, height: newHeight });
        return memo;
      },
    });

    // delete 키 누를 시 텍스트박스 삭제
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Delete" && isSelected) {
        e.preventDefault();
        onDelete(id);
      }
    };

    return (
      <div
        ref={divRef}
        className={`text-box-container ${isSelected ? "selected" : ""}`}
        onMouseDown={() => {
          onSelect(id);
        }}
        style={{
          transform: `translate(${pos.x}px, ${pos.y}px)`,
          width: size.width,
          position: "absolute",
        }}
      >
        {/* 드래그 핸들 */}
        <img
          {...bindDrag()}
          src={dragIcon}
          alt="드래그 핸들"
          className="drag-handle"
          draggable={false}
        />
        {/* 텍스트 입력 영역 */}
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
        {/* 크기 조절 핸들 */}
        <div {...bindResize()} className="resize-handle" />
      </div>
    );
  });

export default TextBox;
