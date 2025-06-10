import React, { useState, useEffect } from 'react';
import '../styles/diaryView.css'
import Header from '../components/header';
import axios from "axios";

function DiaryView(){
    const [images, setImages] = useState<string[]>([]);
    const diaryId = localStorage.getItem("diaryId")

    useEffect(() => {
        const fetchImages = async () => {
            const res = await axios.get(`http://localhost:5001/diary/${diaryId}/images`);
            const imagePaths = res.data.map((img: { image_path: string }) => img.image_path);
            setImages(imagePaths);
        };
        fetchImages();
    }, [diaryId]);


    return(
        <div>

       {images.length > 0 ? (
        images.map((path, index) => (
            <img key={index} src={path} alt={`이미지 ${index}`} className='diaryPicture'/>
        ))
        ) : (
        <p className='message'>다이어리 페이지가 없습니다.</p>
        )}

        </div>
    )
}
export default DiaryView;