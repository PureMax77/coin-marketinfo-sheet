import Header from "@/components/Header";
import "./globals.css";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import Script from "next/script";

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
  const darkClass = initDark ? "dark" : "";

  return (
    <html lang='en' className={darkClass}>
      <body className='dark:bg-black '>
        <Script
          id='show-banner'
          dangerouslySetInnerHTML={{
            __html: `
            const html = document.getElementsByTagName("html")
            let cookieName = "darkMode=";
            let cookieData = document.cookie;
            let cookieValue = "";
            let start = cookieData.indexOf(cookieName);

            if (start !== -1) {
            start += cookieName.length;
            let end = cookieData.indexOf(";", start);
            if (end === -1) end = cookieData.length;
            cookieValue = cookieData.substring(start, end);
            }
  
            let result = unescape(cookieValue);
            if(result){
              html.className = "dark"
            } else {
              html.className = ""
            }
            `,
          }}
        />
        <Header />
        {children}
      </body>
    </html>
  );
}
