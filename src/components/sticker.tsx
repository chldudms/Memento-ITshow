import React, { forwardRef } from "react";
import "../styles/sticker.css";  // 스티커 관련 스타일 임포트
import xIcon from "../assets/x_icon.png"; // 닫기 아이콘 이미지 임포트
import smile from "../assets/smile.png";
import heartSmile from "../assets/heartSmile.png";
import delicious from "../assets/delicious.png";
import sadFace from "../assets/sadFace.png";
import handHeart from "../assets/handHeart.png";
import thumbsUp from "../assets/thumbsUp.png";
import heart from "../assets/heart.png";
import heartLight from "../assets/heartLight.png";
import lights from "../assets/lights.png";
import sunny from "../assets/sunny.png";
import star from "../assets/star.png";
import rainbow from "../assets/rainbow.png";
import partyPopper from "../assets/partyPopper.png";
import pencil from "../assets/pencil.png";

// StickerToolbar 컴포넌트에 전달되는 props 타입 정의
interface StickerToolbarProps {
    onClose: () => void; // 닫기 버튼 클릭 시 호출되는 콜백 함수
    onAddSticker: (src: string) => void; // 스티커 클릭 시 호출되며, 선택된 스티커 이미지 src 전달
}

// 스티커 이미지 데이터 배열
const stickers = [
    smile,
    heartSmile,
    delicious,
    sadFace,
    handHeart,
    thumbsUp,
    heart,
    heartLight,
    lights,
    sunny,
    star,
    rainbow,
    partyPopper,
    pencil,
];

// StickerToolbar 컴포넌트 정의, forwardRef로 ref 전달 가능하게 처리
const StickerToolbar = forwardRef<HTMLDivElement, StickerToolbarProps>(
    ({ onClose, onAddSticker }, ref) => {
        return (
            // 스티커 툴바 전체 컨테이너, ref 전달
            <div className="sticker-wrapper" ref={ref}>
                {/* 닫기 버튼, 클릭 시 onClose 함수 호출 */}
                <a onClick={onClose}>
                    <img src={xIcon} alt="닫기 아이콘" className="close-icon" />
                </a>
                {/* 스티커들을 격자 형태로 보여주는 영역 */}
                <div className="sticker-grid">
                    {stickers.map((sticker, idx) => (
                        // 각 스티커 이미지 표시
                        <img
                            key={idx}
                            src={sticker}
                            alt={`sticker-${idx}`}
                            className="sticker-item"
                            onClick={() => onAddSticker(sticker)} // 클릭 시 해당 스티커 src 전달
                            style={{
                                borderRadius: "10px",
                                boxShadow: "0 0 5px rgba(0,0,0,0.3)",
                                cursor: "pointer",
                            }}
                        />
                    ))}
                </div>
            </div>
        );
    }
);

export default StickerToolbar;