"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { http } from "../api/http";
import {
  CandleChartRes,
  ChartData,
  CoinListData,
  coinListRes_Coinone,
} from "@/types/apiTypes";
import {
  CsvInfoType,
  CoinoneCurrencyTypes,
  IntervalTypes,
} from "@/types/commonTypes";
import LoadingScreen from "@/components/Loading";
import CsvDownButton from "@/components/Button/CsvDownButton";
import FetchButton from "@/components/Button/FetchButton";
import CommonSelect from "@/components/Select/CommonSelect";
import LabelNumInput from "@/components/Input/LabelNumInput";
import CoinChart from "@/components/Chart/CoinChart";

const DefaultToken = "WEMIX";

export default function Coinone() {
  const [chartData, setChartData] = useState<ChartData[]>([]); // 데이터를 저장할 상태
  const [currency, setCurrency] = useState<CoinoneCurrencyTypes>(
    CoinoneCurrencyTypes.KRW
  ); // 화폐 단위
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
    market: CoinoneCurrencyTypes.KRW,
    year: 2023,
    month: 1,
  });

  const CurrencyArray = useMemo(
    () => Object.values(CoinoneCurrencyTypes) as string[],
    []
  );
  const IntervalArray = useMemo(
    () => Object.values(IntervalTypes) as string[],
    []
  );

  const clearData = () => {
    if (csvFile) {
      setCsvFile(""); // csv파일 초기화
      setChartData([]);
    }
  };

  // select onchange
  const handleYearChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputYear = parseInt(event.target.value);
    setSelectedYear(inputYear);
    clearData();
  };
  const handleMonthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputMonth = parseInt(event.target.value);

    if (inputMonth >= 1 && inputMonth <= 12) {
      setSelectedMonth(inputMonth);
      clearData();
    } else {
      alert("1~12의 숫자만 입력 가능합니다.");
    }
  };
  const currencyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (event.target.value !== CoinoneCurrencyTypes.KRW) {
      alert("코인원은 현재 KRW 마켓만 지원합니다.");
      return;
    }
    setCurrency(event.target.value as CoinoneCurrencyTypes);
    clearData();
  };
  const symbolChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setNowSymbol(event.target.value);
    clearData();
  };
  const IntervalChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setInterval(event.target.value as IntervalTypes);
    clearData();
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
    const csvHeader = "market,symbol,year,month,day,close\n";

    // CSV 데이터 생성
    const csvData = filteredData.map((data) => {
      const date = new Date(data.timestamp);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();

      return `${market},${symbol},${year},${month},${day},${data.close}`;
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
      const jsonData = await http<coinListRes_Coinone>(
        `api/coinone/currencies`
      );
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
              <FetchButton onClick={fetchData} />
              <CommonSelect
                value={currency}
                onChange={currencyChange}
                dataArray={CurrencyArray}
              />
              <CommonSelect
                value={nowSymbol}
                onChange={symbolChange}
                dataArray={symbolList}
              />
              <LabelNumInput
                title={"Year"}
                step={1}
                value={selectedYear}
                onChange={handleYearChange}
              />
              <LabelNumInput
                title={"Month"}
                step={1}
                min={1}
                max={12}
                value={selectedMonth}
                onChange={handleMonthChange}
              />
            </div>
            <div className="mt-5">
              <CsvDownButton
                exchange={"Coinone"}
                csvContent={csvFile}
                csvInfo={csvInfo}
                isDisabled={!csvFile}
              />
            </div>
          </div>
          {chartData.length > 0 && (
            <>
              <div className="my-2 dark:text-white mt-10 font-medium">
                종가: 24시 기준
              </div>
              <div className="mb-10 grid lg:grid-cols-7 sm:grid-cols-5 grid-cols-4 gap-4">
                {chartData.map((entry, index) => {
                  const date = new Date(entry.timestamp);
                  const year = date.getFullYear();
                  const month = date.getMonth() + 1; // 월은 0부터 시작하므로 1을 더해줍니다.
                  const day = date.getDate();
                  return (
                    <div
                      key={index}
                      className="bg-gray-200 p-2 text-center rounded-sm flex flex-col"
                    >
                      <span>{`${year}.${month}.${day}`}</span>
                      <span>
                        {entry.close} {csvInfo.market}
                      </span>
                    </div>
                  );
                })}
              </div>
              <CoinChart data={chartData} currency={csvInfo.market} />
            </>
          )}
        </div>
      )}
    </div>
  );
}
