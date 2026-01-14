import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function DoughnutChart({ labels, dataValues, colors, borderColors }) {
  const data = {
    labels: labels || ['Red', 'Blue', 'Yellow'],
    datasets: [
      {
        label: '# of Votes',
        data: dataValues || [12, 19, 3],
        backgroundColor: colors || [
          'rgba(37, 99, 235, 0.8)', // Primary Blue
          'rgba(59, 130, 246, 0.8)', // Lighter Blue
          'rgba(147, 197, 253, 0.8)', // Very Light Blue
          'rgba(30, 41, 59, 0.8)',    // Dark Slate
        ],
        borderColor: borderColors || [
          'rgba(37, 99, 235, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(147, 197, 253, 1)',
          'rgba(30, 41, 59, 1)',
        ],
        borderWidth: 0,
        hoverOffset: 4
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
            color: '#94a3b8',
            font: {
                size: 12
            },
            boxWidth: 12,
            usePointStyle: true
        }
      },
    },
    cutout: '75%', // Thinner donut
  };

  return (
    <div style={{ width: '100%', height: '250px' }}>
      <Doughnut data={data} options={options} />
    </div>
  );
}
