import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/diaryView.css';
import Header from '../components/header';
import axios from 'axios';
import arrow_back from '../assets/arrow_back.png';

function DiaryView() {
    const navigate = useNavigate();
    const [images, setImages] = useState<string[]>([]);
    const diaryId = localStorage.getItem('diaryId');

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const res = await axios.get(`http://localhost:5001/diary/${diaryId}/images`);
                const imagePaths = res.data.map((img: { image_path: string }) => img.image_path);
                setImages(imagePaths);
            } catch (error) {
                console.error('이미지 불러오기 실패:', error);
            }
        };
        fetchImages();
    }, [diaryId]);

    const handleBack = () => {
        navigate('/home');
    };

    return (
        <div>
            <Header />
            <img
                src={arrow_back}
                alt="되돌아가기"
                className="back-image"
                style={{ cursor: 'pointer', width: 40, height: 40, position: 'fixed', top: 150, left: 325, zIndex: 1000 }}
                onClick={handleBack}
            />
            {images.length > 0 ? (
                images.map((path, index) => (
                    <img key={index} src={path} alt={`이미지 ${index}`} className="diaryPicture" />
                ))
            ) : (
                <p className="message">다이어리 페이지가 없습니다.</p>
            )}
        </div>
    );
}

export default DiaryView;
