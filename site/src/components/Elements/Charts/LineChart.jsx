import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export default function LineChart({props_labels,props_label,props_data}) {
  const data = {
    labels: [...props_labels],
    datasets: [
      {
        label: `${props_label}`,
        data: [...props_data],
        borderColor: "rgb(39, 176, 255)",       // azul forte
        backgroundColor: "rgb(47, 196, 255)", // fundo totalmente transparente
        borderWidth: 3,
        pointRadius: 4,
        pointBackgroundColor: "rgb(47, 189, 255)",
        pointBorderColor: "#fff",
        fill:true,
        tension: 0.4, // linha mais suave
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#304164" },
      },
      y: {
        grid: { color: "rgba(0,0,0,0.05)" },
        ticks: { color: "#304164" },
      },
    },
  };

  return (
    <div style={{ width: "100%", height: "300px" }}>
      <Line data={data} options={options} />
    </div>
  );
}
