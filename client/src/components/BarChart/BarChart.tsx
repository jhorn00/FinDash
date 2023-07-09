import React from "react";
import "./BarChart.css";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement } from "chart.js";

ChartJS.register(BarElement);

export function BarChart({
  plotLabel,
  xData,
  yData,
}: {
  plotLabel: string;
  xData: Array<string>;
  yData: Array<number>;
}) {
  const data = {
    labels: xData,
    datasets: [
      {
        label: plotLabel,
        data: yData,
        backgroundColor: "crimson",
        borderColor: "black",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        suggestedMin: 0,
        suggestedMax: 100,
      },
    },
  };

  return <Bar className="bar-chart" data={data} options={options} />;
}
