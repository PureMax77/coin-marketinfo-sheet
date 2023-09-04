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
  const theme = cookies().get("darkMode");
  console.log(theme);

  function getThemeClass() {
    return theme ? (theme.value === "true" ? "dark" : "") : "";
  }
  return (
    <html lang='en' className={getThemeClass()}>
      <body className='dark:bg-black '>
        <Header />
        {children}
      </body>
    </html>
  );
}
