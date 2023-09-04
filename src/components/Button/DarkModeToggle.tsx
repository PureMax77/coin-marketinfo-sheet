/**
 * @gogleset 다크모드 토글 버튼입니다.
 */
"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { serialize } from "cookie";
import { getCookie } from "@/utils/cookie";

const DarkModeToggle = () => {
  const [toggle, setToggle] = useState<boolean>(() => {
    const darkModeCookie = getCookie("darkMode");
    return darkModeCookie === "true" ? true : false;
  });

  const onClickHandler = (event: React.MouseEvent) => {
    event.preventDefault();
    // toggle 값을 반전시키고 로컬 스토리지에 저장합니다.
    const newToggle = !toggle;
    setToggle(newToggle);
    // 쿠키에 다크 모드 상태를 저장합니다.
    document.cookie = serialize("darkMode", newToggle.toString(), {
      sameSite: "lax",
      path: "/",
    });
  };

  useEffect(() => {
    toggle
      ? document.querySelector("html")?.classList.add("dark")
      : document.querySelector("html")?.classList.remove("dark");
  }, [toggle]);

  return (
    <button
      type='button'
      className={`px-3 py-1.5 rounded-full border border-gray-300 dark:border-gray-700 
      ${toggle ? "bg-gray-800 text-white" : "bg-white text-black"} 
      hover:bg-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium text-sm flex items-center`}
      onClick={onClickHandler}>
      {toggle ? (
        <Image
          src='/sun.svg'
          alt='Sun Icon'
          width={24}
          height={24}
          className=' mr-1'
        />
      ) : (
        <Image
          src='/moon.svg'
          alt='Moon Icon'
          width={24}
          height={24}
          className=' mr-1'
        />
      )}
      {toggle ? "Light Mode" : "Dark Mode"}
    </button>
  );
};

export default DarkModeToggle;
