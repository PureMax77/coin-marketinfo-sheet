"use client";

import Link from "next/link";

const Header = () => {
  return (
    <header className="bg-blue-500 py-4 px-6 md:px-12">
      <div className="flex items-center justify-between">
        <Link href="/" className="text-white font-semibold text-lg">
          Coin MarketInfo Sheet
        </Link>
        <nav className="md:flex space-y-2 md:space-y-0 md:space-x-4">
          <Link href="/coinone" className="text-white hover:underline">
            Coinone
          </Link>
          <button
            className="text-white hover:underline"
            onClick={() => {
              alert("준비중입니다...");
            }}
          >
            Upbit
          </button>
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
