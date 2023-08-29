"use client";

import { useEffect, useMemo, useState } from "react";
import { http } from "../api/http";
import {
  CandleChartRes,
  ChartData_Mexc,
  coinListRes_Mexc,
} from "@/types/apiTypes";
import {
  CsvInfoType,
  MexcCurrencyTypes,
  IntervalTypes,
  MexcCoinMapType,
} from "@/types/commonTypes";
import LoadingScreen from "@/components/Loading";
import CsvDownButton from "@/components/Button/CsvDownButton";
import FetchButton from "@/components/Button/FetchButton";
import CommonSelect from "@/components/Select/CommonSelect";
import LabelNumInput from "@/components/Input/LabelNumInput";
import { coinListFilter } from "@/utils/mexcUtils";
import CoinChart from "@/components/Chart/CoinChart";

const DefaultToken = "MEGA";

export default function MEXC() {
  const [chartData, setChartData] = useState<ChartData_Mexc[]>([]); // 데이터를 저장할 상태
  const [currency, setCurrency] = useState<MexcCurrencyTypes>(
    MexcCurrencyTypes.USDT
  ); // 화폐 단위
  const [coinMapList, setCoinMapList] = useState<MexcCoinMapType>(new Map()); // 코인 종목
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
    market: MexcCurrencyTypes.USDT,
    year: 2023,
    month: 1,
  });

  const CurrencyArray = useMemo(
    () => Object.values(MexcCurrencyTypes) as string[],
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
    const newCurrency = event.target.value as MexcCurrencyTypes;
    setCurrency(newCurrency);

    // 현재 nowSymbol이 바뀐 market(커런시)에 있는지
    const newCoinList = coinMapList.get(newCurrency)!;
    const newSymbol = newCoinList.find((a) => a === nowSymbol);
    if (!newSymbol) {
      // 새로 선택한 market에 기존에 선택된 심볼이 없으면 첫번째 걸로 대체
      setNowSymbol(newCoinList[0]);
    }

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
    filteredData: ChartData_Mexc[],
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
      const date = new Date(data.openTime);
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

    // Data Type [Open time, Open, High,	Low, Close, Volume,	Close time, Quote asset volume]
    let tmpData: any[][] = [];

    const startTime = new Date(selectedYear, selectedMonth - 1, 1, 9).getTime(); // 선택한 달의 다음달 첫날을 지정해서 범위를 러프하게 잡음
    // const endTime = new Date(selectedYear, selectedMonth, 1, 9).getTime(); // 선택한 달의 다음달 첫날을 지정해서 범위를 러프하게 잡음

    try {
      const jsonData = await http<any[][]>(
        `api/mexc/klines?symbol=${
          nowSymbol + currency
        }&interval=1d&startTime=${startTime}&limit=1000`
      );
      tmpData = jsonData;
    } catch (error) {
      console.error("Error fetching data:", error);
    }

    // 한국시간 기준 오전12시 (1시간봉 11시 종가) 필터링
    const filteredData = tmpData.filter((data) => {
      // openTime Date 객체 생성
      const date = new Date(data[0]);

      // 원하는 조건 체크: 달과 시간
      const isTargetYaer = date.getFullYear() === selectedYear;
      const isTargetMonth = date.getMonth() + 1 === selectedMonth; // getMonth()는 0부터 시작하므로 +1 필요

      // 조건 충족 여부 반환
      return isTargetYaer && isTargetMonth;
    });

    if (filteredData.length === 0) {
      alert("해당 데이터가 없습니다.");
      return;
    }

    // 형식 변경
    const newData = filteredData.map((item) => {
      const data: ChartData_Mexc = { openTime: item[0], close: item[4] };
      return data;
    });

    // 날짜 sort
    newData.sort((a, b) => a.openTime - b.openTime);

    // csvFile 만들기
    makeCSV(newData, currency, nowSymbol, selectedYear, selectedMonth);

    setChartData(newData);
  };

  const fetchCoinList = async () => {
    try {
      const jsonData = await http<coinListRes_Mexc>(`api/mexc/exchangeInfo`);
      const coinMapData = coinListFilter(jsonData.symbols);
      setCoinMapList(coinMapData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchCoinList();
  }, []);

  return (
    <div>
      {coinMapList.size === 0 ? (
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
                dataArray={coinMapList.get(currency)!}
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
                exchange={"MEXC"}
                csvContent={csvFile}
                csvInfo={csvInfo}
                isDisabled={!csvFile}
              />
            </div>
          </div>
          {chartData.length > 0 && (
            <>
              <div className="my-2 dark:text-white mt-10 font-medium">
                종가: 오전 9시 기준
              </div>
              <div className="mb-10 grid lg:grid-cols-7 sm:grid-cols-5 grid-cols-4 gap-4">
                {chartData.map((entry, index) => {
                  const date = new Date(entry.openTime);
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
