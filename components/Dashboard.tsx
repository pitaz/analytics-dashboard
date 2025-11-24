'use client';

import { useState, useEffect } from 'react';
import MetricCard from './MetricCard';
import TimeSeriesChart from './TimeSeriesChart';
import CategoryDistribution from './CategoryDistribution';
import D3Visualization from './D3Visualization';
import ReportGenerator from './ReportGenerator';
import { fetchMetrics, fetchTimeSeries } from '@/lib/api';

interface DashboardProps {
  realTimeData?: any;
}

export default function Dashboard({ realTimeData }: DashboardProps) {
  const [metrics, setMetrics] = useState<any[]>([]);
  const [timeSeries, setTimeSeries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');

  useEffect(() => {
    loadData();
  }, [selectedTimeRange]);

  useEffect(() => {
    if (realTimeData?.data) {
      setMetrics(realTimeData.data.metrics || []);
      setTimeSeries(realTimeData.data.timeSeries || []);
    }
  }, [realTimeData]);

  async function loadData() {
    try {
      setLoading(true);
      const [metricsData, timeSeriesData] = await Promise.all([
        fetchMetrics(selectedTimeRange),
        fetchTimeSeries(selectedTimeRange),
      ]);
      setMetrics(metricsData);
      setTimeSeries(timeSeriesData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }

  const timeRanges = [
    { value: '1h', label: 'Last Hour' },
    { value: '24h', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
  ];

  if (loading && metrics.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Time Range Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm p-5 rounded-xl shadow-lg border border-gray-200/50 dark:border-gray-700/50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Time Range
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Select a time period to analyze
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {timeRanges.map((range) => (
            <button
              key={range.value}
              onClick={() => setSelectedTimeRange(range.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                selectedTimeRange === range.value
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/50 scale-105'
                  : 'bg-white/80 dark:bg-gray-700/80 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <MetricCard key={index} metric={metric} />
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Time Series Analysis
            </h3>
          </div>
          <TimeSeriesChart data={timeSeries} />
        </div>

        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-md">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Category Distribution
            </h3>
          </div>
          <CategoryDistribution data={metrics} />
        </div>
      </div>

      {/* D3.js Advanced Visualization */}
      <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl transition-shadow duration-300">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg shadow-md">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Advanced Data Visualization
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Powered by D3.js for interactive insights
            </p>
          </div>
        </div>
        <D3Visualization data={timeSeries} />
      </div>

      {/* Report Generator */}
      <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl transition-shadow duration-300">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-md">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Custom Report Generator
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Create and save custom analytics reports
            </p>
          </div>
        </div>
        <ReportGenerator metrics={metrics} timeSeries={timeSeries} />
      </div>
    </div>
  );
}

