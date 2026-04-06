import { Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

function getColor(value) {
  if (value <= 20) return '#2ecc71';
  if (value <= 50) return '#f39c12';
  return '#e74c3c';
}

export function SimilarityDoughnut({ value, label = 'Similarity' }) {
  const color = getColor(value);
  const data = {
    labels: ['Similar', 'Unique'],
    datasets: [{
      data: [value, 100 - value],
      backgroundColor: [color, 'rgba(255,255,255,0.06)'],
      borderColor: ['transparent', 'transparent'],
      borderWidth: 0,
      cutout: '78%',
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(26,38,52,0.95)',
        titleColor: '#fff',
        bodyColor: 'rgba(255,255,255,0.8)',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        cornerRadius: 10,
        padding: 12,
      },
    },
  };

  return (
    <div style={styles.doughnutWrap}>
      <Doughnut data={data} options={options} />
      <div style={styles.doughnutCenter}>
        <span style={{ ...styles.doughnutValue, color }}>{value}%</span>
        <span style={styles.doughnutLabel}>{label}</span>
      </div>
    </div>
  );
}

export function SimilarityBar({ data: barData }) {
  if (!barData || barData.length === 0) return null;

  const data = {
    labels: barData.map(d => d.label),
    datasets: [{
      label: 'Similarity %',
      data: barData.map(d => d.value),
      backgroundColor: barData.map(d => getColor(d.value) + '99'),
      borderColor: barData.map(d => getColor(d.value)),
      borderWidth: 1,
      borderRadius: 6,
      borderSkipped: false,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: { color: 'rgba(255,255,255,0.5)', font: { size: 11 } },
        grid: { color: 'rgba(255,255,255,0.05)' },
      },
      x: {
        ticks: { color: 'rgba(255,255,255,0.5)', font: { size: 11 } },
        grid: { display: false },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(26,38,52,0.95)',
        titleColor: '#fff',
        bodyColor: 'rgba(255,255,255,0.8)',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        cornerRadius: 10,
        padding: 12,
      },
    },
  };

  return (
    <div style={{ height: 250, width: '100%' }}>
      <Bar data={data} options={options} />
    </div>
  );
}

const styles = {
  doughnutWrap: {
    position: 'relative',
    width: 180,
    height: 180,
    margin: '0 auto',
  },
  doughnutCenter: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  doughnutValue: {
    fontSize: '2rem',
    fontWeight: 800,
    lineHeight: 1,
  },
  doughnutLabel: {
    fontSize: '0.75rem',
    color: 'rgba(255,255,255,0.5)',
    fontWeight: 500,
    marginTop: 4,
  },
};

export default SimilarityDoughnut;
