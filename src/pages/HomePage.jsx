import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import 'chartjs-adapter-date-fns';
import { Link } from 'react-router-dom';

Chart.register(...registerables, zoomPlugin);

const HomePage = () => {
  const [invoices, setInvoices] = useState([]);
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [timeFrame, setTimeFrame] = useState('day'); 
  const chartRef = useRef(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/invoices');
        setInvoices(response.data.invoices);
      } catch (error) {
        console.error('Error fetching invoices:', error);
      }
    };
    fetchInvoices();
  }, []);

  useEffect(() => {
    if (invoices.length > 0) {
      const aggregatedData = aggregateInvoiceData(invoices, timeFrame);
      setChartData({
        labels: aggregatedData.labels,
        datasets: [
          {
            label: 'Revenue',
            data: aggregatedData.data,
            borderColor: 'rgba(75,192,192,1)',
            backgroundColor: 'rgba(75,192,192,0.2)',
          },
        ],
      });
    }
  }, [invoices, timeFrame]);

  const handleTimeFrameChange = (e) => {
    setTimeFrame(e.target.value);
  };

  const resetZoom = () => {
    if (chartRef.current) {
      chartRef.current.resetZoom();
    }
  };

  return (
    <div className="relative overflow-hidden">
      <div
    aria-hidden="true"
    class="flex absolute -top-96 start-1/2 transform -translate-x-1/2"
  >
    <div class="bg-gradient-to-r from-violet-300/50 to-purple-100 blur-3xl w-[25rem] h-[44rem] rotate-[-60deg] transform -translate-x-[10rem]"></div>
    <div class="bg-gradient-to-tl from-blue-50 via-blue-100 to-blue-50 blur-3xl w-[90rem] h-[50rem] rounded-fulls origin-top-left -rotate-12 -translate-x-[15rem]"></div>
  </div>

  <div class="relative z-10">
    <div class="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      <div class="max-w-2xl text-center mx-auto">
        <p class="inline-block text-sm font-medium bg-clip-text bg-gradient-to-l from-blue-600 to-violet-500 text-transparent">
          WidaTech: Invoice System
        </p>

        <div class="mt-5 max-w-2xl">
          <h1 class="block font-semibold text-gray-800 text-4xl md:text-5xl lg:text-6xl">
            Managing invoices easier than ever before
          </h1>
        </div>

        <div class="mt-5 max-w-3xl">
          <p class="text-lg text-gray-600">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Commodi,
            maxime perferendis laudantium incidunt non nihil natus quaerat odit
            delectus.
          </p>
        </div>

        <div class="mt-8 gap-3 flex justify-center">
          <Link
            class="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
            to="/add-invoice"
          >
            Start Creating
            <svg
              class="shrink-0 size-4"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </Link>
          <Link
            class="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-b-gray-300 text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none"
            to="/invoices"
          >
            Invoices
          </Link>
        </div>
      </div>
    </div>
  </div>

      {/* Time Frame Selector */}
      <div className="relative mt-10 max-w-5xl mx-auto">
        <div className="bg-white rounded-xl shadow p-4 sm:p-7">
          <h2 className="text-xl font-bold text-gray-800">Revenue Projection</h2>
          <label>Choose time frame:</label>
          <select value={timeFrame} onChange={handleTimeFrameChange}>
            <option value="day">Daily</option>
            <option value="week">Weekly</option>
            <option value="month">Monthly</option>
          </select>

          <Line ref={chartRef} data={chartData} options={chartOptions(timeFrame)} />
          <button onClick={resetZoom} className="mt-4">Reset Zoom</button>
        </div>
      </div>
    </div>
  );
};

const chartOptions = (timeFrame) => ({
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
});

const aggregateInvoiceData = (invoices, timeFrame) => {
  const grouped = invoices.reduce((acc, invoice) => {
    const date = new Date(invoice.date);
    const key = getTimeKey(date, timeFrame);
    const totalRevenue = invoice.products.reduce((sum, product) => sum + product.price, 0);

    if (!acc[key]) acc[key] = 0;
    acc[key] += totalRevenue;
    return acc;
  }, {});

  const labels = Object.keys(grouped);
  const data = Object.values(grouped);

  return { labels, data };
};

const getWeekNumber = (date) => {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
};

const getTimeKey = (date, timeFrame) => {
  const options = {
    day: 'yyyy-MM-dd',
    week: 'yyyy-WW',
    month: 'yyyy-MM',
  };

  if (timeFrame === 'day') {
    return date.toLocaleDateString('en-CA'); 
  } else if (timeFrame === 'week') {
    const weekNumber = getWeekNumber(date);
    return `${date.getFullYear()}-W${weekNumber}`;
  } else if (timeFrame === 'month') {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  }
};

export default HomePage;
