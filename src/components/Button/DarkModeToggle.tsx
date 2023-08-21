/**
 * @gogleset 다크모드 토글 버튼입니다.
 */

import React, { useEffect, useState } from "react";

const DarkModeToggle = () => {
  const [toggle, setToggle] = useState<boolean>(false);

  const onClickHandler = (event: React.MouseEvent) => {
    event.preventDefault();
    setToggle(!toggle);
  };
  useEffect(() => {
    console.log(toggle);
    toggle
      ? document.querySelector("html")?.classList.add("dark")
      : document.querySelector("html")?.classList.remove("dark");
  }, [toggle]);
  return (
    <button
      type='button'
      className='text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 sm:px-3  dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700'
      onClick={onClickHandler}>
      {toggle ? "DarkMode Off" : "DarkMode On"}
    </button>
  );
};

export default DarkModeToggle;
