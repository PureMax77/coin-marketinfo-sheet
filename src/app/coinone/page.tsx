"use client";

import { useEffect, useRef, useState } from "react";
import { http } from "../api/http";
import {
  CandleChartRes,
  ChartData,
  CoinListData,
  coinListRes,
} from "@/types/apiTypes";
import { CsvInfoType, CurrencyTypes, IntervalTypes } from "@/types/commonTypes";
import LoadingScreen from "@/components/Loading";
import CsvDownButton from "@/components/Button/CsvDownButton";

const DefaultToken = "WEMIX";

export default function Home() {
  const [chartData, setChartData] = useState<ChartData[]>([]); // 데이터를 저장할 상태
  const [currency, setCurrency] = useState<CurrencyTypes>(CurrencyTypes.KRW); // 화폐 단위
  const [symbolList, setSymbolList] = useState<string[]>([]); // 코인 종목
  const [nowSymbol, setNowSymbol] = useState<string>(DefaultToken);
  const [Interval, setInterval] = useState<IntervalTypes>(IntervalTypes.T1H);
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth() + 1
  );
  const [csvFile, setCsvFile] = useState<string>("");
  const [csvInfo, setCsvInfo] = useState<CsvInfoType>({
    symbol: DefaultToken,
    market: CurrencyTypes.KRW,
    year: 2023,
    month: 1,
  });

  const CurrencyArray = Object.values(CurrencyTypes) as string[];
  const IntervalArray = Object.values(IntervalTypes) as string[];

  // select onchange
  const handleYearChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputYear = parseInt(event.target.value);
    setSelectedYear(inputYear);
  };
  const handleMonthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputMonth = parseInt(event.target.value);

    if (inputMonth >= 1 && inputMonth <= 12) {
      setSelectedMonth(inputMonth);
    } else {
      alert("1~12의 숫자만 입력 가능합니다.");
    }
  };
  const currencyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (event.target.value !== CurrencyTypes.KRW) {
      alert("코인원은 현재 KRW 마켓만 지원합니다.");
      return;
    }

    setCurrency(event.target.value as CurrencyTypes);
  };
  const symbolChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setNowSymbol(event.target.value);
  };
  const IntervalChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setInterval(event.target.value as IntervalTypes);
  };

  const makeCSV = (
    filteredData: ChartData[],
    market: string,
    symbol: string,
    year: number,
    month: number
  ) => {
    // Info 저장
    setCsvInfo({
      symbol,
      market,
      year,
      month,
    });

    // CSV 헤더 생성
    const csvHeader =
      "market,symbol,timestamp,year,month,day,open,high,low,close(종가),target_volume,quote_volume\n";

    // CSV 데이터 생성
    const csvData = filteredData.map((data) => {
      const date = new Date(data.timestamp);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();

      return `${market},${symbol},${data.timestamp},${year},${month},${day},${data.open},${data.high},${data.low},${data.close},${data.target_volume},${data.quote_volume}`;
    });

    // 최종 CSV 문자열 생성
    const csvContent = csvHeader + csvData.join("\n");

    setCsvFile(csvContent);
  };

  const fetchData = async () => {
    if (selectedYear < 2009) {
      alert("Year은 비트코인 최초 발행일인 2009년으로 제한합니다.");
      return;
    } else if (selectedYear > new Date().getFullYear()) {
      alert("Year이 미래입니다.\n미래를 알면 회사 때려치지~🤣");
      return;
    }

    let tmpData: ChartData[] = [];

    // 1달치 데이터를 충분히 불러오기 위해서 3번 돌림
    for (let i = 0; i < 4; i++) {
      const isNow =
        new Date().getFullYear() === selectedYear &&
        new Date().getMonth() + 1 === selectedMonth; // 선택한 날짜가 현재와 같은지
      const baseStamp = isNow
        ? new Date().getTime()
        : new Date(selectedYear, selectedMonth, 1).getTime(); // 선택한 달의 다음달 첫날을 지정해서 범위를 러프하게 잡음
      const time = baseStamp - i * 1000 * 3600 * 200; // 1시간봉 기준으로 200개씩 불러와져서

      try {
        const jsonData = await http<CandleChartRes>(
          `api/coinone/chart/${currency}/${nowSymbol}?interval=${Interval}&timestamp=${time}`
        );
        if (jsonData.result === "success") {
          tmpData = [...tmpData, ...jsonData.chart];
        } else {
          console.error("API request failed:", jsonData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    if (tmpData.length === 0) {
      alert("해당 데이터가 없습니다.");
      return;
    }

    // 한국시간 기준 오후12시 (1시간봉 11시 종가) 필터링
    const filteredData = tmpData.filter((data) => {
      // timestamp로부터 Date 객체 생성
      const date = new Date(data.timestamp);

      // 원하는 조건 체크: 달과 시간
      const isTargetYaer = date.getFullYear() === selectedYear;
      const isTargetMonth = date.getMonth() + 1 === selectedMonth; // getMonth()는 0부터 시작하므로 +1 필요
      const isTargetHour = date.getHours() === 23;

      // 조건 충족 여부 반환
      return isTargetYaer && isTargetMonth && isTargetHour;
    });

    // 날짜 sort
    filteredData.sort((a, b) => a.timestamp - b.timestamp);

    // csvFile 만들기
    makeCSV(filteredData, currency, nowSymbol, selectedYear, selectedMonth);

    setChartData(filteredData);
  };

  const fetchCoinList = async () => {
    try {
      const jsonData = await http<coinListRes>(`api/coinone/currencies`);
      if (jsonData.result === "success") {
        setSymbolList(
          jsonData.currencies.map((data) => data.symbol).sort() as any
        );
      } else {
        console.error("API request failed:", jsonData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  // console.log(
  //   43,
  //   new Date(chartData[0].timestamp).getMonth(),
  //   new Date(chartData[0].timestamp).getDate(),
  //   new Date(chartData[0].timestamp).getHours()
  // );
  useEffect(() => {
    fetchCoinList();
  }, []);

  return (
    <div>
      {symbolList.length === 0 ? (
        <LoadingScreen />
      ) : (
        <div className="container mx-auto p-4">
          <div>
            <div>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={fetchData}
              >
                Fetch Data
              </button>
              <select
                value={currency}
                onChange={currencyChange}
                className="py-2 px-4 ml-5 mt-5 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                {CurrencyArray.map((str, index) => (
                  <option key={index} value={str}>
                    {str}
                  </option>
                ))}
              </select>
              <select
                value={nowSymbol}
                onChange={symbolChange}
                className="py-2 px-4 ml-5 mt-5 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                {symbolList.map((str, index) => (
                  <option key={index} value={str}>
                    {str}
                  </option>
                ))}
              </select>
              {/* <select
            value={Interval}
            onChange={IntervalChange}
            className="py-2 px-4 ml-5 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            {IntervalArray.map((str, index) => (
              <option key={index} value={str}>
                {str}
              </option>
            ))}
          </select> */}
              <label className="text-lg ml-5">Year : </label>
              <input
                type="number"
                step="1"
                value={selectedYear}
                onChange={handleYearChange}
                className="w-24 px-2 py-1 mt-5 border rounded-lg"
              />
              <label className="text-lg ml-5">Month : </label>
              <input
                type="number"
                min="1"
                max="12"
                step="1"
                value={selectedMonth}
                onChange={handleMonthChange}
                className="w-16 px-2 py-1 mt-5 border rounded-lg"
              />
            </div>
            <div className="mt-5">
              <CsvDownButton csvContent={csvFile} csvInfo={csvInfo} />
            </div>
          </div>
          <div className="mt-4 flex flex-col">
            {chartData.map((entry, index) => (
              <div
                key={index}
                className="bg-gray-200 p-2 m-2 inline-block text-center"
              >
                {new Date(entry.timestamp).toLocaleString()} &rarr; 종가:{" "}
                {entry.close}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
