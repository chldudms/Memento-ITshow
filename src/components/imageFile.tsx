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
    onDelete?: () => void; // 삭제 시 호출할 콜백 함수-
}

const ImageFile: React.FC<ImageFileProps & { style?: React.CSSProperties }> = ({
    src,
    alt,
    initialLeft = 100,
    initialTop = 100,
    initialWidth = 150,
    initialHeight = 150,
    onDelete,
    style,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);

    // 부모 박스 크기 상태
    const [bounds, setBounds] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

    // 이미지 위치 상태
    const [position, setPosition] = useState({ x: initialLeft, y: initialTop });

    // 이미지 크기 상태
    const [size, setSize] = useState({ width: initialWidth, height: initialHeight });

    // 이미지 선택/포커스 상태
    const [isFocused, setIsFocused] = useState(false);

    // 리사이즈 중인지 확인하는 상태 (중요!)
    const [isResizing, setIsResizing] = useState(false);

    // 컴포넌트 마운트 시 bounds 설정
    useEffect(() => {
        const mainBox = document.querySelector(".main-box");
        if (mainBox) {
            const mainRect = mainBox.getBoundingClientRect();
            const combinedWidth = 1060.30;
            const combinedHeight = Math.max(mainRect.height);
            setBounds({ width: combinedWidth, height: combinedHeight });
        }
    }, []);

    // 외부 클릭 시 포커스 해제
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

    // useGesture 바인딩 - 리사이즈 중일 때는 드래그 비활성화
    const bind = useGesture(
        {
            onDrag: ({ delta: [dx, dy], event }) => {
                // 리사이즈 중이거나 리사이즈 핸들을 클릭한 경우 드래그 무시
                if (isResizing) return;

                // 리사이즈 핸들 클릭 감지
                const target = event.target as HTMLElement;
                if (target.closest('.react-resizable-handle')) {
                    return;
                }

                setPosition((pos) => {
                    const newX = Math.min(Math.max(0, pos.x + dx), bounds.width - size.width);
                    const newY = Math.min(Math.max(0, pos.y + dy), bounds.height - size.height);
                    return { x: newX, y: newY };
                });
                setIsFocused(true);
            },
            onDragStart: ({ event }) => {
                // 리사이즈 핸들 클릭 시 드래그 시작 방지
                const target = event.target as HTMLElement;
                if (target.closest('.react-resizable-handle') || isResizing) {
                    return false;
                }
                setIsFocused(true);
            }
        },
        {
            drag: {
                // 리사이즈 중일 때는 드래그 비활성화
                enabled: !isResizing,
                filterTaps: true,
                pointer: { touch: true },
            },
        }
    );

    // 리사이즈 시작 시 호출
    const handleResizeStart = () => {
        setIsResizing(true);
        setIsFocused(true);
    };

    // 리사이즈 중 호출 (실시간 크기 업데이트 방지)
    const handleResize = (
        e: MouseEvent | TouchEvent,
        direction: any,
        ref: HTMLElement,
        delta: { width: number; height: number }
    ) => {
        // 실시간 크기 업데이트는 하지 않음 (위치 변경 방지)
    };

    // 리사이즈 완료 시 호출
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

        // 위치는 그대로 두고 크기만 업데이트
        setSize({
            width: newWidth,
            height: newHeight,
        });

        // 리사이즈 완료
        setIsResizing(false);
    };

    // 삭제 키 처리
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
            {...bind()} // useGesture 바인딩
            style={{
                position: "absolute",
                top: position.y,
                left: position.x,
                width: size.width,
                height: size.height,
                touchAction: "none",
                border: isFocused ? "2px dashed #999" : "none",
                backgroundColor: "transparent",
                userSelect: "none",
                cursor: isResizing ? "default" : "grab", // 리사이즈 중일 때 커서 변경
                zIndex: style?.zIndex ?? 5,
            }}
            onClick={(e) => {
                // 리사이즈 핸들 클릭 시 포커스 이벤트 방지
                if (!(e.target as HTMLElement).closest('.react-resizable-handle')) {
                    setIsFocused(true);
                }
            }}
        >
            <Resizable
                size={{ width: size.width, height: size.height }}
                onResizeStart={handleResizeStart} // 리사이즈 시작
                onResize={handleResize} // 리사이즈 중 (사용하지 않음)
                onResizeStop={handleResizeStop} // 리사이즈 완료
                minWidth={50}
                minHeight={50}
                maxWidth={bounds.width - position.x}
                maxHeight={bounds.height - position.y}
                enable={{ bottomRight: true }}
                style={{
                    width: "100%",
                    height: "100%",
                    position: "relative",
                    touchAction: "none",
                }}
                handleStyles={{
                    bottomRight: {
                        background: isFocused ? '#FF90BB' : 'transparent',
                        border: isFocused ? '2px solid #FF90BB' : 'none',
                        borderRadius: '50%',
                        width: '12px',
                        height: '12px',
                        right: '-6px',
                        bottom: '-6px',
                    }
                }}
            >
                <div
                    onClick={(e) => e.stopPropagation()}
                    style={{ width: "100%", height: "100%" }}
                >
                    <img
                        ref={imageRef}
                        src={src}
                        alt={alt || "uploaded"}
                        style={{
                            width: "100%",
                            height: "100%",
                            pointerEvents: "none",
                            display: "block",
                            objectFit: "contain", // 이미지 비율 유지
                        }}
                        draggable={false}
                    />
                </div>
            </Resizable>
        </div>
    );
};

export default ImageFile;