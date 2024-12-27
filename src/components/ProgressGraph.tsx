import React, { useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  ChartData,
  ChartOptions
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import { Assignment, ProgressData } from '@/types';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale);

interface ProgressGraphProps {
  assignments: Assignment[];
  progressData: ProgressData[];
}

type DataPoint = {
  x: Date;
  y: number;
};

const ProgressGraph: React.FC<ProgressGraphProps> = ({ assignments, progressData }) => {
  const chartRef = useRef<ChartJS<"line", DataPoint[]>>(null);

  const getDatasetColor = (index: number) => {
    const colors = ['#6CA18A', '#466857', '#5D9068', '#346780', '#7396A9', '#D7CDBE', '#25424C', '#8B4513'];
    return colors[index % colors.length];
  };

  const allDates = assignments.flatMap(assignment => [
    new Date(assignment.startDate),
    new Date(assignment.endDate),
    ...progressData
      .filter(progress => progress.assignmentId === assignment.id)
      .map(progress => new Date(progress.date))
  ]);

  const minDate = new Date(Math.min(...allDates.map(d => d.getTime())));
  const maxDate = new Date(Math.max(...allDates.map(d => d.getTime())));

  const allValues = assignments.flatMap(assignment => [
    assignment.baseline,
    parseFloat(assignment.goal),
    ...progressData
      .filter(progress => progress.assignmentId === assignment.id)
      .map(progress => progress.score)
  ]);

  const minValue = Math.min(...allValues);
  const maxValue = Math.max(...allValues);

  const assignmentData = assignments.map((assignment, index) => {
    const color = getDatasetColor(index);
    const relatedProgress = progressData.filter(progress => progress.assignmentId === assignment.id);
    const sortedProgress = relatedProgress.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const assessedData = [
      { x: new Date(assignment.startDate), y: assignment.baseline },
      ...sortedProgress.map(progress => ({ x: new Date(progress.date), y: progress.score }))
    ];

    const goalData = [
      { x: new Date(assignment.startDate), y: assignment.baseline },
      { x: new Date(assignment.endDate), y: parseFloat(assignment.goal) }
    ];

    return [
      {
        label: `Student ${assignment.studentId} - ${assignment.interventionId} (Assessed)`,
        data: assessedData,
        borderColor: color,
        backgroundColor: color,
        fill: false,
        tension: 0.1
      },
      {
        label: `Student ${assignment.studentId} - ${assignment.interventionId} (Goal)`,
        data: goalData,
        borderColor: color,
        backgroundColor: color,
        borderDash: [5, 5],
        fill: false,
        tension: 0.1
      },
      {
        label: `Student ${assignment.studentId} - ${assignment.interventionId} (Goal Point)`,
        data: [{ x: new Date(assignment.endDate), y: parseFloat(assignment.goal) }],
        borderColor: color,
        backgroundColor: 'white',
        pointStyle: 'circle',
        pointRadius: 6,
        pointHoverRadius: 8,
        showLine: false
      }
    ];
  }).flat();

  const options: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Student Progress',
      },
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day'
        },
        min: minDate.getTime(),
        max: maxDate.getTime()
      },
      y: {
        beginAtZero: false,
        min: Math.floor(minValue),
        max: Math.ceil(maxValue)
      }
    }
  };

  const data: ChartData<'line', DataPoint[]> = {
    datasets: assignmentData
  };

  return <Line ref={chartRef} options={options} data={data} />;
};

export default ProgressGraph;