import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export default function RadarChart({ labels, datasetLabel, dataValues }) {
  const data = {
    labels: labels || ['A', 'B', 'C', 'D', 'E'],
    datasets: [
      {
        label: datasetLabel || 'Dataset',
        data: dataValues || [0, 0, 0, 0, 0],
        backgroundColor: 'rgba(39, 176, 255, 0.2)',
        borderColor: 'rgba(39, 176, 255, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(39, 176, 255, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(39, 176, 255, 1)',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    elements: {
        line: {
            tension: 0.3
        }
    },
    scales: {
      r: {
        angleLines: {
            color: 'rgba(255, 255, 255, 0.1)'
        },
        grid: {
            color: 'rgba(255, 255, 255, 0.1)'
        },
        pointLabels: {
            color: '#94a3b8',
            font: {
                size: 12
            }
        },
        ticks: {
            backdropColor: 'transparent',
            color: '#64748b'
        }
      },
    },
    plugins: {
      legend: {
        display: false
      }
    }
  };

  return (
    <div style={{ width: '100%', height: '300px' }}>
      <Radar data={data} options={options} />
    </div>
  );
}
