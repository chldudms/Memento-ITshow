import React, { useState } from 'react';
import '../styles/creatediary.css'
import Header from '../components/header';
import axios from "axios";
import { Navigate, useNavigate } from 'react-router-dom';

const CreateDiary = () => {
    const navigator = useNavigate()
    const [diaryTitle, setTitle] = useState("");
    const [coverColor, setColor] = useState('#AFAFAF')
    const [strapColor, setStrap] = useState('#5e5e5e')
    const [hashtag, setHash] = useState('')
    const [showSticker, setSticker] = useState('none')
    const [stickerShape, setShape] = useState('smile')
    const [diaryKey, setKey] = useState('')

    const colors = ["#FFC4C4", "#FFCDA2", "#FFED61", "#90FF83", "#A7B0FF", "#D88BFF", "#B7FFEC", "#AFAFAF"];
    const strapColors = ["#FF9E9E", "#FFB97A", "#FFD500", "#5AFF47", "#7E8CFF", "#B84AFF", "#7FCBB7", "#8B8B8B"];
    const hashs = ["#아이티쇼", "#일상기록", "#감정일기", "#특별한일"]
    const stickers = ["smile", "cry", "sad", "lovely", "thinking", "star"];

    function chgCoverColor(color: string) {
        setColor(color)
        var i = colors.indexOf(color)
        console.log(color)
        setStrap(strapColors[i]);
    }

    function putSticker(sticker: string) {
        setSticker('block')
        setShape(sticker)
    }

    const addDiary = async () => {
        if (diaryTitle.trim() === "") {
            alert("다이어리 제목을 입력해주세요!");
            return;
        }

        try {
            const response = await axios.post("http://localhost:5001/addDiary", {
                title: diaryTitle,
                color: coverColor,
                hashtags: hashtag,
                sticker: showSticker,
                password: diaryKey,
            });

            console.log("서버 응답:", response.data);
            alert("다이어리 저장 완료");
            navigator("/home");
        } catch (err) {
            console.error("에러 발생", err);
            alert("저장 실패");
        }
    };

    

    return (
        <div className='diary'>
            <Header />
            <div className='options'>
                <p>다이어리 제목</p>
                <input
                    type='text'
                    className='diaryTitle'
                    placeholder="다이어리의 제목을 입력해주세요."
                    value={diaryTitle}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <p>커버 색상</p>
                <div className="colorGrid">
                    {colors.map((color, i) => (
                        <button
                            key={i}
                            className="colorBtn"
                            style={{ backgroundColor: color }}
                            onClick={() => chgCoverColor(color)}
                        />
                    ))}
                </div>

                <p>해시 태그</p>
                <div className='hashtags'>
                    {hashs.map((hash) => (
                        <div key={hash} onClick={() => setHash(hash)}>{hash}</div>
                    ))}
                </div>

                <p>스티커</p>
                <div className='board' />
                <div className='sticker'>
                    {stickers.map((sticker) => (
                        <img
                            key={sticker}
                            src={`img/${sticker}.png`}
                            className='stickers'
                            onClick={() => putSticker(sticker)}
                        />
                    ))}
                </div>

                <p>다이어리 암호 설정 (선택)</p>
                <div>
                    <input
                        type='number'
                        className='diaryKey'
                        placeholder='다이어리의 암호를 입력해주세요. (최대 4자리)'
                        value={diaryKey}
                        onChange={(e) => setKey(e.target.value)}
                    />
                </div>
            </div>

            <img
                src={`img/${stickerShape}.png`}
                className='smileEx'
                style={{ display: showSticker }}
            />

            <div className='diaryCover'>
                <div className='Cover' style={{ background: coverColor }} />
                <div className='strap' style={{ background: strapColor }} />
                <div className='label' />
            </div>

            <button className='diaryCreateBtn' type='submit' onClick={()=>addDiary()}>완료</button>
        </div>
    );
};

export default CreateDiary;
