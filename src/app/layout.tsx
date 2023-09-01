import Header from "@/components/Header";
import "./globals.css";
import type { Metadata } from "next";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Coin-MarketInfo-Sheet",
  description:
    "A site that retrieves the coin information from the exchange and extracts the sheet file.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 서버랜더링에서도 dark mode 적용을 위해 로컬스토리지 대신 cookie 사용
  const cookieStore = cookies();
  const darkCookie = cookieStore.get("darkMode");
  const initDark = darkCookie ? darkCookie.value === "true" : false;

  return (
    <html lang="en" className={initDark ? "dark" : ""}>
      <body className="dark:bg-black ">
        <Header darkCookie={true} />
        {children}
      </body>
    </html>
  );
}
