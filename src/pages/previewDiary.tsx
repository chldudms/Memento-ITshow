import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/header";
import "../styles/previewdiary.css";
import imageIcon from "../assets/preview.png";
import arrow_back from "../assets/arrow_back.png";
import saveIcon from "../assets/download.png";
import Swal from 'sweetalert2';

const PreviewDiary = () => {
    const location = useLocation();
    const navigate = useNavigate();
    // 이전 페이지에서 전달된 상태값 (이미지) 추출
    const { imageDataUrl } = location.state || {};

    // 저장 버튼 클릭 시, 서버에 이미지 업로드 요청
    const handleSave = async () => {
        try {
            const response = await axios.post("http://localhost:5001/upload-image", {
                image: imageDataUrl,
            });
            const { imageUrl } = response.data;
            console.log("저장된 이미지 URL:", imageUrl);

            //alert("이미지가 성공적으로 저장되었습니다!");
            // 저장 후 다운로드 페이지로 이동
            navigate("/downloadDiary");
        } catch (error) {
            console.error("저장 실패:", error);
        }
    };

    // 되돌아가기 버튼 클릭 시 커스텀다이어리 페이지로 이동
    const handleBack = async () => {
        const result = await handleLeaveClick(); // 호출 및 결과 대기
        if (result) {
            navigate("/writeDiary", {
                state: {
                    imageDataUrl,
                }
            });
        }
    };

    // alter 커스텀
    const handleLeaveClick = async () => {
        const result = await Swal.fire({
            title: '작성 중인 내용이 초기화됩니다.',
            html: '<b>계속하시겠습니까?</b>',
            background: '#fff',
            showCancelButton: true,
            confirmButtonText: '돌아갈래!',
            cancelButtonText: '계속할래!',
            customClass: {
                popup: 'alert-popup',
                title: 'alert-title',
                htmlContainer: 'alert-html',
                confirmButton: 'alert-confirm',
                cancelButton: 'alert-cancel',
            },
        });

        return result.isConfirmed;
    };

    return (
        <div>
            <Header />
            <img src={arrow_back}
                alt="되돌아가기"
                className="back-image"
                style={{ cursor: "pointer", width: 40, height: 40, position: "fixed", top: 150, left: 325, zIndex: 1000 }}
                onClick={handleBack}
            />
            <img src={imageIcon}
                alt="미리보기 이미지"
                className="image"
                style={{ width: 40, height: 40, position: "fixed", top: 250, right: 350, zIndex: 1000 }}
            />
            {/* 캡처된 이미지 미리보기 출력 */}
            <img src={imageDataUrl} className="previewImage" alt="미리보기 이미지" />
            <div>
                <img src={saveIcon}
                    alt="저장"
                    className="save-image"
                    style={{ cursor: "pointer", width: 33, height: 33, position: "fixed", bottom: 80, right: 330, zIndex: 1000 }}
                    onClick={handleSave}
                />
            </div>
        </div>
    );
};

export default PreviewDiary;
