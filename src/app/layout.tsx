import Header from "@/components/Header";
import "./globals.css";
import type { Metadata } from "next";
import { ssrDarkModeFn } from "@/utils/cookie";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Coin-MarketInfo-Sheet",
  description:
    "A site that retrieves the coin information from the exchange and extracts the sheet file.",
};

const ScriptTag = () => {
  const stringifyFn = String(ssrDarkModeFn);

  const fnToRunOnClient = `(${stringifyFn})()`;
  return <script dangerouslySetInnerHTML={{ __html: fnToRunOnClient }} />;
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' id='HTML' suppressHydrationWarning={true}>
      <body className='dark:bg-black '>
        <ScriptTag />
        <Header />
        {children}
      </body>
    </html>
  );
}
