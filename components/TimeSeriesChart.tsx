'use client';

import { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface TimeSeriesChartProps {
  data: any[];
}

export default function TimeSeriesChart({ data }: TimeSeriesChartProps) {
  const chartRef = useRef<ChartJS<'line'>>(null);

  // Group data by category
  const categories = Array.from(new Set(data.map((d) => d.category)));
  const colors = [
    'rgba(59, 130, 246, 0.5)',
    'rgba(16, 185, 129, 0.5)',
    'rgba(245, 158, 11, 0.5)',
    'rgba(239, 68, 68, 0.5)',
    'rgba(139, 92, 246, 0.5)',
  ];

  const datasets = categories.map((category, index) => {
    const categoryData = data
      .filter((d) => d.category === category)
      .sort((a, b) => new Date(a.hour).getTime() - new Date(b.hour).getTime());

    return {
      label: category,
      data: categoryData.map((d) => parseFloat(d.avg_value)),
      borderColor: colors[index % colors.length].replace('0.5', '1'),
      backgroundColor: colors[index % colors.length],
      fill: true,
      tension: 0.4,
      pointRadius: 2,
      pointHoverRadius: 5,
    };
  });

  const labels = Array.from(
    new Set(
      data
        .map((d) => d.hour)
        .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
    )
  ).map((hour) => new Date(hour).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));

  const chartData = {
    labels,
    datasets,
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false,
        },
      },
      y: {
        display: true,
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    },
  };

  return (
    <div className="h-80">
      <Line ref={chartRef} data={chartData} options={options} />
    </div>
  );
}

