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
  if (!data && !currency) return <div>not Data</div>;
  console.log(data, currency);
  const labels = data.map((data: any) => {
    const time = new Date(data.timestamp).toLocaleString();
    return time.slice(5, time.indexOf("오") - 2);
  });
  const datas = {
    labels,
    datasets: [
      {
        label: "종가",
        data: data.map((_data: any) => {
          return _data.close;
        }),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        yAxisID: "y",
      },
    ],
  };
  const options = {
    responsive: true,
    interaction: {
      mode: "index" as const,
    },

    plugins: {
      tooltip: {
        enabled: true,

        callbacks: {
          label: function (context: any) {
            const data = context.dataset.data;
            const maxValue = Math.max.apply(null, data);
            const minValue = Math.min.apply(null, data);
            // console.log(maxValue, minValue);
            const label = context.dataset.label || "";
            if (context.parsed.y === maxValue) {
              console.log(context.parsed.y);
              return label + ": " + context.parsed.y + " (최대값)";
            } else if (context.parsed.y === minValue) {
              console.log(context.parsed.y);
              return label + ": " + context.parsed.y + " (최소값)";
            } else {
              return label + ": " + context.parsed.y;
            }
          },
        },
      },
    },
    scales: {
      y: {
        type: "linear" as const,
        display: true,
        position: "left" as const,
        ticks: {
          callback: function (value: any) {
            // 변경하고자 하는 단위로 변환하는 로직을 작성
            return value + ` ${currency}`;
          },
        },
      },
    },
  };

  return (
    <div className='dark:bg-slate-100 '>
      <Line options={options} data={datas} />
    </div>
  );
};

export default CoinChart;
