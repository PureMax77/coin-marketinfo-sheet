"use client";

import Link from "next/link";
import DarkModeToggle from "./Button/DarkModeToggle";
import { usePathname } from "next/navigation";

const Header = () => {
  const pathname = usePathname();

  return (
    <header className="bg-blue-500 py-4 px-6 md:px-12 dark:bg-gray-700">
      <div className="flex items-center justify-between">
        <Link href="/" className="text-white font-semibold text-lg">
          Coin MarketInfo Sheet
        </Link>

        <nav className="flex space-y-2 md:space-y-0 md:space-x-4 space-x-4 justify-center items-center">
          <DarkModeToggle />
          <Link
            href="/coinone"
            className={`text-white hover:underline ${
              pathname === "/coinone" && "underline"
            }`}
          >
            Coinone
          </Link>
          <Link
            href="/mexc"
            className={`text-white hover:underline ${
              pathname === "/mexc" && "underline"
            }`}
          >
            MEXC
          </Link>
          <Link
            href="/upbit"
            className={`text-white hover:underline ${
              pathname === "/upbit" && "underline"
            }`}
          >
            Upbit
          </Link>
          {/* <Link href="/upbit" className="text-white hover:underline">
            Upbit
          </Link> */}
          {/* <a href="#" className="text-white hover:underline">
            Services
          </a>
          <a href="#" className="text-white hover:underline">
            Contact
          </a> */}
        </nav>
      </div>
    </header>
  );
};

export default Header;
