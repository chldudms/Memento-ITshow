import React, { useRef, useState, useEffect } from "react";
import { useGesture } from "@use-gesture/react";
import { Resizable } from "re-resizable";

interface ImageFileProps {
    src: string;
    alt?: string;
    initialLeft?: number;
    initialTop?: number;
    initialWidth?: number;
    initialHeight?: number;
    onDelete?: () => void; // 삭제 시 호출할 콜백 함수
}

const ImageFile: React.FC<ImageFileProps> = ({
    src,
    alt,
    initialLeft = 10,
    initialTop = 10,
    initialWidth = 150,
    initialHeight = 150,
    onDelete,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);

    // 부모 박스(왼쪽 + 오른쪽 박스 합친 영역) 크기 상태
    const [bounds, setBounds] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

    // 이미지 위치 상태 (왼쪽 박스 기준 0,0 시작)
    const [position, setPosition] = useState({ x: initialLeft, y: initialTop });

    // 이미지 크기 상태
    const [size, setSize] = useState({ width: initialWidth, height: initialHeight });

    // 이미지 선택/포커스 상태
    const [isFocused, setIsFocused] = useState(false);

    // 컴포넌트 마운트 시, main-box의 크기를 계산해 bounds 설정
    useEffect(() => {
        const mainBox = document.querySelector(".main-box");

        if (mainBox ) {
            const mainRect = mainBox.getBoundingClientRect();

            // 메인 박스의 시작(left)부터 끝(right)까지 합친 너비와 최대 높이 계산
            const combinedWidth = 1060.30;
            const combinedHeight = Math.max(mainRect.height);

            setBounds({ width: combinedWidth, height: combinedHeight });
        }
    }, []);

    // 외부 클릭 시 이미지 포커스 해제 처리
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setIsFocused(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // useGesture로 드래그 이벤트 바인딩
    const bind = useGesture(
        {
            // 드래그 중일 때 위치 업데이트, bounds 안에서만 움직임 허용
            onDrag: ({ delta: [dx, dy] }) => {
                setPosition((pos) => {
                    const newX = Math.min(Math.max(0, pos.x + dx), bounds.width - size.width);
                    const newY = Math.min(Math.max(0, pos.y + dy), bounds.height - size.height);
                    return { x: newX, y: newY };
                });
                setIsFocused(true); // 드래그 시 포커스 유지
            },
            // 드래그 시작 시 포커스 설정
            onDragStart: () => {
                setIsFocused(true);
            }
        },
        {
            drag: {
                from: () => [position.x, position.y], // 드래그 시작 위치 지정
                filterTaps: true, // 탭 동작 걸러내기
                pointer: { touch: true }, // 터치 이벤트도 활성화
            },
        }
    );

    // 리사이즈 종료 시 호출되는 콜백
    const handleResizeStop = (
        e: MouseEvent | TouchEvent,
        direction: any,
        ref: HTMLElement,
        delta: { width: number; height: number }
    ) => {
        let newWidth = ref.offsetWidth;
        let newHeight = ref.offsetHeight;

        // bounds 안에서 크기 제한
        newWidth = Math.min(newWidth, bounds.width - position.x);
        newHeight = Math.min(newHeight, bounds.height - position.y);

        setSize({
            width: newWidth,
            height: newHeight,
        });
    };

    // 삭제키(Backspace, Delete) 입력 시 삭제 콜백 호출 처리
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (isFocused && (e.key === "Delete" || e.key === "Backspace")) {
                e.preventDefault();
                if (onDelete) {
                    onDelete();
                }
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isFocused, onDelete]);

    return (
        <div
            ref={containerRef}
            {...bind()} // useGesture 바인딩 적용
            style={{
                position: "absolute",
                top: position.y,
                left: position.x,
                width: size.width,
                height: size.height,
                touchAction: "none", // 터치 스크롤 막기
                border: isFocused ? "2px dashed #999" : "none", // 포커스 시 테두리 표시
                backgroundColor: "transparent",
                userSelect: "none", // 텍스트 선택 방지
                cursor: "grab", // 마우스 커서 표시
                zIndex: 20,
            }}
            onClick={() => setIsFocused(true)} // 클릭 시 포커스 활성화
        >
            <Resizable
                size={{ width: size.width, height: size.height }}
                onResizeStop={handleResizeStop} // 리사이즈 완료 시 콜백
                minWidth={50}
                minHeight={50}
                maxWidth={bounds.width - position.x} // bounds 내 최대 크기 제한
                maxHeight={bounds.height - position.y}
                enable={{ bottomRight: true }} // 오른쪽 하단만 리사이즈 가능
                style={{
                    width: "100%",
                    height: "100%",
                    position: "relative",
                    touchAction: "none", // 터치 스크롤 막기
                }}
            >
                {/* 클릭 시 이벤트 버블링 방지 (포커스 해제 방지) */}
                <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", height: "100%" }}>
                    <img
                        src={src}
                        alt={alt || "uploaded"}
                        style={{
                            width: "100%",
                            height: "100%",
                            pointerEvents: "none", // 이미지 자체는 이벤트 무시
                            display: "block",
                            zIndex: 20,
                        }}
                        draggable={false} // 드래그 방지
                    />
                </div>
            </Resizable>
        </div>
    );
};

export default ImageFile;