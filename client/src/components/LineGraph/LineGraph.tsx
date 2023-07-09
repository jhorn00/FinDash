import React from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  TimeScale,
} from "chart.js";
import { Line } from "react-chartjs-2";
import "./LineGraph.css";
import { Moment } from "moment";
import "chartjs-adapter-moment"; // Allow ChartJS to accept Moment objects

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  TimeScale
);

export function LineGraph({
  plotLabel,
  xData,
  yData,
}: {
  plotLabel: string;
  xData: Array<Moment>;
  yData: Array<number>;
}) {
  const data = {
    labels: xData, // array of strings
    datasets: [
      {
        label: plotLabel, // string
        data: yData, // array of numbers
        tension: 0,
        backgroundColor: "gray",
        borderColor: "gray",
        // borderJoinStyle: "round",     these do not work
        // borderCapStyle: "round",
        pointBackgroundColor: "green",
        pointBorderColor: "black",
        pointHoverBackgroundColor: "#52CC7A",
      },
    ],
  };

  const options = {
    scales: {
      x: {
        type: "time" as const,
        time: {
          tooltipFormat: "MMM DD, YYYY HH:mm", // Date format for hovering over value
          displayFormats: {
            hour: "MMM DD, YYYY",
            day: "MMM DD, YYYY",
            week: "MMM DD, YYYY",
            month: "MMM YYYY",
          },
        },
      },
      y: {
        suggestedMin: -50, // Default y-axis
        suggestedMax: 100,
      },
    },
  };

  return <Line className="line-graph" data={data} options={options} />;
}
