import NotiPopup from "@/components/Popup/NotiPopup";
import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-gray-100 dark:bg-black min-h-screen p-10">
      {/* Main Content */}
      <div className="container mx-auto p-6 md:p-12 bg-white dark:bg-gray-400 shadow-lg rounded-lg">
        <h1 className="text-2xl md:text-4xl font-semibold mb-4">
          Convert Exchange Price Data to CSV
        </h1>
        <p className="text-gray-600 mb-10 dark:text-white">
          Welcome to our service that allows you to easily convert exchange
          price data into CSV files. Upload your data and let us handle the
          rest!
        </p>

        {/* Convert Button */}
        <Link
          href={"/coinone"}
          className=" bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition duration-300 dark:bg-indigo-700"
        >
          Getting Started with Coinone
        </Link>
      </div>

      <NotiPopup />
    </div>
  );
}
