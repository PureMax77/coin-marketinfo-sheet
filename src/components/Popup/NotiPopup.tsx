import { useEffect, useState } from "react";

const NotiPopup: React.FC = () => {
  const [showPopup, setShowPopup] = useState<boolean>(false);

  useEffect(() => {
    const storedTimestamp = localStorage.getItem("hidePopupTimestamp");
    if (storedTimestamp) {
      const currentTime = new Date().getTime();
      const weekAgo = currentTime - 7 * 24 * 60 * 60 * 1000; // 7일 전 타임스탬프 계산
      if (parseInt(storedTimestamp, 10) <= weekAgo) {
        setShowPopup(true);
      }
    } else {
      setShowPopup(true);
    }
  }, []);

  const closePopup = () => {
    setShowPopup(false);
  };

  const closePopupForWeek = () => {
    const timestamp = new Date().getTime();
    localStorage.setItem("hidePopupTimestamp", timestamp.toString());
    setShowPopup(false);
  };

  return (
    <div>
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 h-screen">
          {/* 모달 백그라운드 */}
          <div className="fixed inset-0 bg-black opacity-50 z-40 pointer-events-none"></div>

          <div className=" max-w-sm bg-white p-6 shadow-lg rounded-lg relative z-50">
            <p className="text-lg mb-4">
              해외에서 접속 시 값이 틑릴 수 있으니
              <br />꼭 확인 후 사용하세요.
            </p>
            <div className="flex justify-center">
              <button
                className="bg-blue-500 text-white px-4 py-2 mr-2 rounded hover:bg-blue-600"
                onClick={closePopup}
              >
                닫기
              </button>
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                onClick={closePopupForWeek}
              >
                이번주 더 이상 보지 않기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotiPopup;
