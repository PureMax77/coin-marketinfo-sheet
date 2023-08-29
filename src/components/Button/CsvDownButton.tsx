import { CsvInfoType } from "@/types/commonTypes";
import React from "react";

interface CsvDownButtonProps {
  exchange: string;
  csvContent: string;
  csvInfo: CsvInfoType;
  isDisabled: boolean;
}

const CsvDownButton: React.FC<CsvDownButtonProps> = ({
  exchange,
  csvContent,
  csvInfo,
  isDisabled,
}) => {
  const handleDownload = () => {
    if (!csvContent) alert("데이터가 없습니다.");

    const { symbol, market, year, month } = csvInfo;

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = `${exchange}_${symbol}_${market}_${year}${month}.csv`;
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <button
      className={`bg-blue-500 ${
        isDisabled ? "bg-gray-400 cursor-not-allowed" : "hover:bg-blue-600"
      } text-white font-semibold py-2 px-4 rounded dark:bg-indigo-800`}
      onClick={handleDownload}
      disabled={isDisabled}
    >
      {isDisabled ? "Need Fetch" : "Download CSV"}
    </button>
  );
};

export default CsvDownButton;
