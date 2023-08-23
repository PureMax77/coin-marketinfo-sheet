import React from "react";

interface FetchButtonProps {
  onClick: () => void;
}

const FetchButton: React.FC<FetchButtonProps> = ({ onClick }) => {
  return (
    <button
      className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded dark:bg-gray-700'
      onClick={onClick}>
      Fetch Data
    </button>
  );
};

export default FetchButton;
