/**
 * @gogleset 다크모드 토글 버튼입니다.
 */

import Image from "next/image";
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
      type="button"
      className={`px-3 py-1.5 rounded-full border border-gray-300 dark:border-gray-700 
      ${toggle ? "bg-gray-800 text-white" : "bg-white text-black"} 
      hover:bg-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium text-sm flex items-center`}
      onClick={onClickHandler}
    >
      {toggle ? (
        <Image
          src="/sun.svg"
          alt="Sun Icon"
          width={24}
          height={24}
          className=" mr-1"
        />
      ) : (
        <Image
          src="/moon.svg"
          alt="Moon Icon"
          width={24}
          height={24}
          className=" mr-1"
        />
      )}
      {toggle ? "Light Mode" : "Dark Mode"}
    </button>
  );
};

export default DarkModeToggle;
