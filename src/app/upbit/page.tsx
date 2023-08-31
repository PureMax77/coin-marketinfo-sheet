"use client";

import { useEffect, useMemo, useState } from "react";
import { http } from "../api/http";
import { ChartData_Upbit, coinListRes_Upbit } from "@/types/apiTypes";
import {
  CsvInfoType,
  UpbitCoinMapType,
  UpbitCurrencyTypes,
} from "@/types/commonTypes";
import LoadingScreen from "@/components/Loading";
import CsvDownButton from "@/components/Button/CsvDownButton";
import FetchButton from "@/components/Button/FetchButton";
import CommonSelect from "@/components/Select/CommonSelect";
import LabelNumInput from "@/components/Input/LabelNumInput";
import { coinListFilter } from "@/utils/upbitUtils";
import CoinChart from "@/components/Chart/CoinChart";
import moment from "moment";

const DefaultToken = "META";

export default function Upbit() {
  const [chartData, setChartData] = useState<ChartData_Upbit[]>([]); // 데이터를 저장할 상태
  const [currency, setCurrency] = useState<UpbitCurrencyTypes>(
    UpbitCurrencyTypes.KRW
  ); // 화폐 단위
  const [coinMapList, setCoinMapList] = useState<UpbitCoinMapType>(new Map()); // 코인 종목
  const [nowSymbol, setNowSymbol] = useState<string>(DefaultToken);
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth() + 1
  );
  const [csvFile, setCsvFile] = useState<string>("");
  const [csvInfo, setCsvInfo] = useState<CsvInfoType>({
    symbol: DefaultToken,
    market: UpbitCurrencyTypes.KRW,
    year: 2023,
    month: 1,
  });

  const CurrencyArray = useMemo(
    () => Object.values(UpbitCurrencyTypes) as string[],
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
    const newCurrency = event.target.value as UpbitCurrencyTypes;
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

  const makeCSV = (
    filteredData: ChartData_Upbit[],
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
      const date = new Date(data.candle_date_time_kst);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();

      return `${market},${symbol},${year},${month},${day},${data.trade_price}`;
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

    let tmpData: ChartData_Upbit[] = [];

    // const startTime = new Date(selectedYear, selectedMonth - 1, 1, 9).getTime(); // 선택한 달의 다음달 첫날을 지정해서 범위를 러프하게 잡음
    const endTime = new Date(selectedYear, selectedMonth, 1, 9); // 선택한 달의 다음달 첫날을 지정해서 범위를 러프하게 잡음
    const formattedTime = moment(endTime).format("YYYY-MM-DD HH:mm:ss");

    try {
      const jsonData = await http<ChartData_Upbit[]>(
        `api/upbit/candles/days?market=${
          currency + "-" + nowSymbol
        }&to=${formattedTime}&count=34`
      );
      tmpData = jsonData;
    } catch (error) {
      console.error("Error fetching data:", error);
    }

    // 한국시간 기준 오전12시 (1시간봉 11시 종가) 필터링
    const filteredData = tmpData.filter((data) => {
      const date = new Date(data.candle_date_time_kst);
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

    // 날짜 sort
    filteredData.sort((a, b) => a.timestamp - b.timestamp);

    // csvFile 만들기
    makeCSV(filteredData, currency, nowSymbol, selectedYear, selectedMonth);

    setChartData(filteredData);
  };

  const fetchCoinList = async () => {
    try {
      const jsonData = await http<coinListRes_Upbit[]>(`api/upbit/market/all`);
      const coinMapData = coinListFilter(jsonData);
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
                exchange={"Upbit"}
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
                  const date = new Date(entry.candle_date_time_kst);
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
                        {entry.trade_price} {csvInfo.market}
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
