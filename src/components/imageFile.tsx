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
    onDelete?: () => void;
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

    // 실제 이미지 크기 상태 (이것이 컨테이너이자 이미지 크기)
    const [imageSize, setImageSize] = useState({ width: initialWidth, height: initialHeight });

    // 이미지 선택/포커스 상태
    const [isFocused, setIsFocused] = useState(false);

    // 리사이즈 중인지 확인하는 상태
    const [isResizing, setIsResizing] = useState(false);

    // 이미지의 원본 비율
    const [aspectRatio, setAspectRatio] = useState<number>(1);

    // 이미지 로드 시 원본 비율 계산
    const handleImageLoad = () => {
        if (imageRef.current) {
            const img = imageRef.current;
            const ratio = img.naturalWidth / img.naturalHeight;
            setAspectRatio(ratio);

            // 초기 크기를 비율에 맞게 조정
            if (ratio > 1) {
                // 가로가 더 긴 이미지
                setImageSize({
                    width: initialWidth,
                    height: initialWidth / ratio
                });
            } else {
                // 세로가 더 긴 이미지
                setImageSize({
                    width: initialHeight * ratio,
                    height: initialHeight
                });
            }
        }
    };

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

    // useGesture 바인딩
    const bind = useGesture(
        {
            onDrag: ({ delta: [dx, dy], event }) => {
                if (isResizing) return;

                const target = event.target as HTMLElement;
                if (target.closest('.react-resizable-handle')) {
                    return;
                }

                setPosition((pos) => {
                    const newX = Math.min(Math.max(0, pos.x + dx), bounds.width - imageSize.width);
                    const newY = Math.min(Math.max(0, pos.y + dy), bounds.height - imageSize.height);
                    return { x: newX, y: newY };
                });
                setIsFocused(true);
            },
            onDragStart: ({ event }) => {
                const target = event.target as HTMLElement;
                if (target.closest('.react-resizable-handle') || isResizing) {
                    return false;
                }
                setIsFocused(true);
            }
        },
        {
            drag: {
                enabled: !isResizing,
                filterTaps: true,
                pointer: { touch: true },
            },
        }
    );

    const handleResizeStart = () => {
        setIsResizing(true);
        setIsFocused(true);
    };

    const handleResize = (
        e: MouseEvent | TouchEvent,
        direction: any,
        ref: HTMLElement,
        delta: { width: number; height: number }
    ) => {
        // 비율 유지하면서 실시간 크기 조정
        const newWidth = ref.offsetWidth;
        const newHeight = newWidth / aspectRatio;

        // bounds 체크
        const constrainedWidth = Math.min(newWidth, bounds.width - position.x);
        const constrainedHeight = Math.min(newHeight, bounds.height - position.y);

        // 가장 제한적인 크기로 조정
        if (constrainedWidth / aspectRatio <= constrainedHeight) {
            setImageSize({
                width: constrainedWidth,
                height: constrainedWidth / aspectRatio
            });
        } else {
            setImageSize({
                width: constrainedHeight * aspectRatio,
                height: constrainedHeight
            });
        }
    };

    const handleResizeStop = (
        e: MouseEvent | TouchEvent,
        direction: any,
        ref: HTMLElement,
        delta: { width: number; height: number }
    ) => {
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
            {...bind()}
            style={{
                position: "absolute",
                top: position.y,
                left: position.x,
                width: imageSize.width,
                height: imageSize.height,
                touchAction: "none",
                border: isFocused ? "2px dashed #999" : "none", // 점선 테두리가 이미지 크기와 정확히 일치
                backgroundColor: "transparent",
                userSelect: "none",
                cursor: isResizing ? "default" : "grab",
                zIndex: style?.zIndex ?? 5,
            }}
            onClick={(e) => {
                if (!(e.target as HTMLElement).closest('.react-resizable-handle')) {
                    setIsFocused(true);
                }
            }}
        >
            <Resizable
                size={{ width: imageSize.width, height: imageSize.height }}
                onResizeStart={handleResizeStart}
                onResize={handleResize}
                onResizeStop={handleResizeStop}
                minWidth={50}
                minHeight={50 / aspectRatio}
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
                lockAspectRatio={true} // 비율 고정
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
                            objectFit: "fill", // 컨테이너에 딱 맞게 채움 (여백 없음)
                        }}
                        draggable={false}
                        onLoad={handleImageLoad}
                    />
                </div>
            </Resizable>
        </div>
    );
};

export default ImageFile;