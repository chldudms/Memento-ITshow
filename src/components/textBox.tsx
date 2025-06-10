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
    const [pos, setPos] = useState({ x: 50, y: 50 });
    const [size, setSize] = useState({ width: 200, height: 100 }); // 초기 높이 100으로 수정
    const [text, setText] = useState("");

    const posRef = useRef(pos);
    const sizeRef = useRef(size);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const divRef = useRef<HTMLDivElement>(null);

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

    // 드래그 시 .box 영역 크기 및 위치 참고해서 제한
    const getBoxRect = () => {
      const box = document.querySelector(".box");
      return box?.getBoundingClientRect();
    };

    // 글 내용 변경 시 textarea 높이 자동 조절 + box 영역 벗어나지 않도록 제한
    useEffect(() => {
      if (!textareaRef.current) return;
      const textarea = textareaRef.current;
      textarea.style.height = "auto"; // 먼저 자동 높이 계산
      const scrollHeight = textarea.scrollHeight;

      const boxRect = getBoxRect();
      if (!boxRect || !divRef.current) return;

      // 현재 박스 위치 (부모 .box 내부 좌표)
      const boxX = posRef.current.x;
      const boxY = posRef.current.y;

      // textarea 최대 높이 = 부모 박스 높이 - 현재 박스 Y 위치 (남은 공간)
      const maxHeight = boxRect.height - boxY;

      // 높이를 제한, 글 내용에 맞춰 최대값까지 늘어남
      const newHeight = Math.min(scrollHeight, maxHeight);

      textarea.style.height = `${newHeight}px`;
      setSize(prev => ({ ...prev, height: newHeight }));
    }, [text, fontSize]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setText(e.target.value);
      // 크기도 변경 시 갱신됨
    };

    const PADDING = 16 * 2; // 좌우 padding 총합
    const PADDING_VERTICAL = 16 * 2; // 상하 padding 총합

    const bindDrag = useGesture({
      onDrag: ({ movement: [mx, my], memo }) => {
        if (!memo) memo = { x: posRef.current.x, y: posRef.current.y };

        let newX = memo.x + mx;
        let newY = memo.y + my;

        // 드래그 제한 (다이어리 영역 + padding 반영)
        const maxX = 1060.3 - (sizeRef.current.width + PADDING);
        const maxY = 583.31 - (sizeRef.current.height + PADDING_VERTICAL);

        newX = Math.max(0, Math.min(newX, maxX));
        newY = Math.max(0, Math.min(newY, maxY));

        setPos({ x: newX, y: newY });
        posRef.current = { x: newX, y: newY };
        return memo;
      },
    });

    const bindResize = useGesture({
      onDrag: ({ movement: [mx, my], memo }) => {
        if (!memo) memo = { width: sizeRef.current.width, height: sizeRef.current.height };

        // padding을 제외한 최대 크기 제한
        const maxWidth = 700 - PADDING;
        const maxHeight = 400 - PADDING_VERTICAL;

        // 최소 크기 제한에도 padding을 반영
        let newWidth = Math.max(100 - PADDING, Math.min(memo.width + mx, maxWidth));
        let newHeight = Math.max(60 - PADDING_VERTICAL, Math.min(memo.height + my, maxHeight));

        setSize({ width: newWidth, height: newHeight });
        return memo;
      },
    });

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
          position: "absolute",
          top: 0,
          left: 0,
          transform: `translate(${pos.x}px, ${pos.y}px)`,
          width: size.width,
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
          style={{ height: size.height, fontSize, color: textColor, overflow: "hidden" }}
          placeholder="텍스트를 입력하세요."
          onKeyDown={handleKeyDown}
          onChange={handleChange}
          value={text}
          spellCheck={false}
        />
        <div {...bindResize()} className="resize-handle" />
      </div>
    );
  }
);

export default TextBox;