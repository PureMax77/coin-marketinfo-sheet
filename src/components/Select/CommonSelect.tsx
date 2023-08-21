import React from "react";

interface CommonSelectProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  dataArray: string[];
}

const CommonSelect: React.FC<CommonSelectProps> = ({
  value,
  onChange,
  dataArray,
}) => {
  return (
    <select
      value={value}
      onChange={onChange}
      className="py-2 px-4 ml-5 mt-5 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
    >
      {dataArray.map((str, index) => (
        <option key={index} value={str}>
          {str}
        </option>
      ))}
    </select>
  );
};

export default CommonSelect;
