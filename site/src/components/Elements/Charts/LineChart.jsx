import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler, // Import Filler
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler // Register Filler
);

export default function LineChart({ props_labels, props_label, props_data }) {
  const data = {
    labels: [...props_labels],
    datasets: [
      {
        label: `${props_label}`,
        data: [...props_data],
        borderColor: "rgb(39, 176, 255)", 
        // Transparent blue fill
        backgroundColor: (context) => {
            const chart = context.chart;
            const { ctx, chartArea } = chart;
            if (!ctx || !chartArea) {
                return "rgba(39, 176, 255, 0.2)"; // Fallback solid color
            }
            const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
            gradient.addColorStop(0, "rgba(39, 176, 255, 0.0)");
            gradient.addColorStop(1, "rgba(39, 176, 255, 0.4)");
            return gradient;
        },
        borderWidth: 3,
        pointRadius: 4,
        pointBackgroundColor: "rgb(39, 176, 255)",
        pointBorderColor: "#fff",
        fill: true,
        tension: 0.4, 
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: '#fff',
        bodyColor: '#cbd5e1',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#94a3b8" }, // slate-400
      },
      y: {
        grid: { color: "rgba(255, 255, 255, 0.05)" },
        ticks: { color: "#94a3b8" },
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  };

  return (
    <div style={{ width: "100%", height: "300px" }}>
      <Line data={data} options={options} />
    </div>
  );
}
