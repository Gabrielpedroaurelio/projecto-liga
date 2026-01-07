// src/components/LineChart.jsx
import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

export default function BarChart({label_pr,labels_pr,data_pr}) {
  const data = {
    labels: [...labels_pr],
        datasets: [
      {
        label: label_pr,
        data: [...data_pr],
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "#4bc0c0",
        borderWidth: 2,
        pointBackgroundColor: "#4bc0c0",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
    },
  };

  return <Bar data={data} options={options} />;
}
