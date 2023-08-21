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
      intersect: false,
    },
    stacked: false,
    // plugins: {
    //   title: {
    //     display: true,
    //     text: "Chart.js Line Chart - Multi Axis",
    //   },
    // },
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
      <Line options={options} data={datas} />;
    </div>
  );
};

export default CoinChart;
