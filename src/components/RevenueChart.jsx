import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import 'chartjs-plugin-zoom';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const RevenueChart = ({ invoices }) => {
  const [chartData, setChartData] = useState({});
  const [timeFrame, setTimeFrame] = useState('daily'); 

  useEffect(() => {
    const processData = () => {
      const groupedData = aggregateInvoiceData(invoices, timeFrame);
      setChartData({
        labels: groupedData.labels,
        datasets: [
          {
            label: 'Revenue',
            data: groupedData.data,
            borderColor: 'rgba(75,192,192,1)',
            backgroundColor: 'rgba(75,192,192,0.2)',
          },
        ],
      });
    };

    processData();
  }, [invoices, timeFrame]);

  const options = {
    scales: {
      x: {
        type: 'time',
        time: {
          unit: timeFrame,
        },
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Revenue',
        },
      },
    },
    plugins: {
      zoom: {
        pan: {
          enabled: true,
          mode: 'x',
        },
        zoom: {
          enabled: true,
          mode: 'x',
        },
      },
    },
  };

  const handleTimeFrameChange = (e) => {
    setTimeFrame(e.target.value);
  };

  return (
    <div>
      <div>
        <label>Choose time frame:</label>
        <select value={timeFrame} onChange={handleTimeFrameChange}>
          <option value="day">Daily</option>
          <option value="week">Weekly</option>
          <option value="month">Monthly</option>
        </select>
      </div>
      <Line data={chartData} options={options} />
    </div>
  );
};

const aggregateInvoiceData = (invoices, timeFrame) => {
  const grouped = invoices.reduce((acc, invoice) => {
    const date = new Date(invoice.date); 
    const key = getTimeKey(date, timeFrame);
    if (!acc[key]) acc[key] = 0;
    acc[key] += invoice.amount; 
    return acc;
  }, {});

  const labels = Object.keys(grouped);
  const data = Object.values(grouped);

  return { labels, data };
};

const getTimeKey = (date, timeFrame) => {
  const options = {
    day: 'yyyy-MM-dd',
    week: 'yyyy-WW',
    month: 'yyyy-MM',
  };
  return new Intl.DateTimeFormat('en-US', { dateStyle: options[timeFrame] }).format(date);
};

export default RevenueChart;
