import { CsvInfoType } from "@/types/commonTypes";
import React from "react";

interface CsvDownButtonProps {
  csvContent: string;
  csvInfo: CsvInfoType;
}

const CsvDownButton: React.FC<CsvDownButtonProps> = ({
  csvContent,
  csvInfo,
}) => {
  const handleDownload = () => {
    if (!csvContent) alert("데이터가 없습니다.");

    const { symbol, market, year, month } = csvInfo;

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = `${symbol}_${market}_${year}${month}.csv`;
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <button
      className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
      onClick={handleDownload}
    >
      CSV 파일 다운로드
    </button>
  );
};

export default CsvDownButton;
