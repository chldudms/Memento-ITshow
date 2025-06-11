import React, { useState } from 'react';
import '../styles/creatediary.css'
import Header from '../components/header';
import axios from "axios";
import { Navigate, useNavigate } from 'react-router-dom';
import { colorList } from '../constants/colorList';
import Swal from 'sweetalert2';

const CreateDiary = () => {
    const navigator = useNavigate()
    const [diaryTitle, setTitle] = useState("");
    const [coverColor, setColor] = useState('#AFAFAF')
    const [strapColor, setStrap] = useState('#5e5e5e')
    const [selectedColorId, setSelectedColorId] = useState("gray");
    const [hashtag, setHash] = useState('')
    const [showSticker, setStatus] = useState('none')
    const [stickerShape, setShape] = useState('')
    const [diaryKey, setKey] = useState('')


    // const colors = ["#FFC4C4", "#FFCDA2", "#FFED61", "#90FF83", "#A7B0FF", "#D88BFF", "#B7FFEC", "#AFAFAF"];
    // const strapColors = ["#FF9E9E", "#FFB97A", "#FFD500", "#5AFF47", "#7E8CFF", "#B84AFF", "#7FCBB7", "#8B8B8B"];
    const hashs = ["#아이티쇼", "#일상기록", "#감정일기", "#특별한일"]
    const stickers = ["smile", "cry", "sad", "lovely", "thinking", "star"];



    function chgCoverColor(colorId: string) {
        setSelectedColorId(colorId);
        const selected = colorList.find((c) => c.id === colorId);
        if (selected) {
            setColor(selected.color);         // 커버 배경
            setStrap(selected.strapColor);    // 스트랩 배경
        }
    }


    function putSticker(sticker: string) {
        setStatus('block')
        setShape(sticker)
    }

    const addDiary = async () => {
        if (diaryTitle.trim() === "") {
            await Swal.fire({
                title: '다이어리 제목을 입력해주세요!',
                icon: undefined,
                background: '#fff',
                timer: 1000,
                showConfirmButton: false,
                customClass: {
                    popup: 'warn-popup',
                    title: 'warn-title',
                },
            });
            return;
        }
        else if (diaryKey.length > 4) {
            await Swal.fire({
                title: '비밀번호를 4자리 이하로 입력해주세요!',
                icon: undefined,
                background: '#fff',
                timer: 1000,
                showConfirmButton: false,
                customClass: {
                    popup: 'warn-popup',
                    title: 'warn-title',
                },
            });
            return;
        }

        const diaryData = {"title":diaryTitle,"color":selectedColorId,"sticker":stickerShape}
        localStorage.setItem("diaryData", JSON.stringify(diaryData) )

        try {
            const response = await axios.post("http://localhost:5001/addDiary", {
                title: diaryTitle,
                color: selectedColorId,
                hashtags: hashtag,
                sticker: stickerShape,
                password: diaryKey,
            });

            console.log("서버 응답:", response.data);
            await Swal.fire({
                title: '다이어리 생성 완료!',
                icon: undefined,
                background: '#fff',
                timer: 1000,
                showConfirmButton: false,
                customClass: {
                    popup: 'warn-popup',
                    title: 'warn-title',
                },
            });

            navigator("/writeDiary");
        } catch (err) {
            console.error("에러 발생 : 저장 실패", err);
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
                    {colorList.map(({ id, color }) => (
                        <button
                            key={id}
                            className="colorBtn"
                            style={{ backgroundColor: color }}
                            onClick={() => chgCoverColor(id)}
                        />
                    ))}
                </div>

                <p>해시 태그</p>
                <div className='hashtags'>
                    {hashs.map((hash) => (
                        <div
                            key={hash}
                            className={`hashtag ${hashtag === hash ? 'selected' : ''}`}
                            onClick={() => setHash(hash)}>
                            {hash}
                        </div>
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
                        type='text'
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

            <button className='diaryCreateBtn' type='submit' onClick={() => addDiary()}>완료</button>
        </div>
    );
};

export default CreateDiary;
