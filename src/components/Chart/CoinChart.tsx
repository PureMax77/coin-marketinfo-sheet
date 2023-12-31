/**
 * @gogleset 차트 뷰 컴포넌트입니다.
 */
"use client";
import React from "react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { ChartOptions } from "chart.js";
import { usePathname, useRouter } from "next/navigation";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const CoinChart: React.FC<{ data: any; currency: string }> = ({
  data,
  currency,
}) => {
  const path = usePathname();
  const timeType = path.includes("mexc")
    ? "openTime"
    : path.includes("upbit")
    ? "candle_date_time_kst"
    : "timestamp";
  const dataType = path.includes("upbit") ? "trade_price" : "close";

  const labels = data.map((data: any) => {
    const time = new Date(data[timeType]).toLocaleString();
    return time.slice(5, time.indexOf("오") - 2);
  });
  const datas = {
    labels,
    datasets: [
      {
        label: "종가(" + currency + ")",
        data: data.map((_data: any) => {
          return _data[dataType];
        }),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        yAxisID: "y",
      },
    ],
  };
  const options: ChartOptions = {
    responsive: true,
    interaction: {
      mode: "index" as const,
    },
    animation: {
      duration: 1,
      onComplete: (context) => {
        let chart = context.chart;
        let ctx = chart.ctx;

        datas.datasets.forEach((dataset, i) => {
          let meta = chart.getDatasetMeta(i);
          // 종가들만 모아서 배열 추출
          const newData = meta.data.map((data, index) => {
            return dataset.data[index];
          });
          if (newData.length < 1) {
            return console.error("Invalid Values");
          }
          const max = Math.max(...newData);
          const min = Math.min(...newData);

          meta.data.forEach((bar, index) => {
            let datasetData = Number(dataset.data[index]);
            if (max === datasetData) {
              // 흰색 텍스트 그리기
              ctx.fillStyle = "black"; // 흰색 텍스트 설정
              ctx.font = "normal bold 18px sans-serif";
              ctx.fillText(`Max: ${datasetData}`, bar.x - 50, bar.y - 15);
            } else if (min === datasetData) {
              // 검정색 사각형 그리기

              // 흰색 텍스트 그리기
              ctx.fillStyle = "black"; // 흰색 텍스트 설정
              ctx.fillText(`Min: ${datasetData}`, bar.x - 50, bar.y + 20);
            }
          });
        });
      },
    },
    plugins: {
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      y: {
        type: "linear",
        display: true,
        position: "left",
        ticks: {
          callback: function (value) {
            // 변경하고자 하는 단위로 변환하는 로직을 작성
            return value;
          },
        },
      },
    },
  };

  return (
    <div className="dark:bg-slate-100 ">
      <Line options={options as any} data={datas} />
    </div>
  );
};

export default CoinChart;
