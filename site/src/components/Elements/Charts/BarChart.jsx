import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

export default function BarChart({ label_pr, labels_pr, data_pr }) {
  const data = {
    labels: [...labels_pr],
    datasets: [
      {
        label: label_pr,
        data: [...data_pr],
        backgroundColor: [
          'rgba(37, 99, 235, 0.8)',
          'rgba(99, 102, 241, 0.8)',
          'rgba(16, 185, 129, 0.8)'
        ],
        borderRadius: 8,
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1e293b',
        padding: 12,
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 13 },
        cornerRadius: 8,
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#64748b", font: { weight: '600' } }
      },
      y: {
        grid: { color: "rgba(0,0,0,0.05)", drawBorder: false },
        ticks: { color: "#64748b" }
      }
    }
  };

  return (
    <div style={{ width: "100%", height: "300px" }}>
      <Bar data={data} options={options} />
    </div>
  );
}
