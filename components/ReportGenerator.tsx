'use client';

import { useState } from 'react';
import { generateReport, saveReport } from '@/lib/api';

interface ReportGeneratorProps {
  metrics: any[];
  timeSeries: any[];
}

export default function ReportGenerator({ metrics, timeSeries }: ReportGeneratorProps) {
  const [reportName, setReportName] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['avg_value', 'total_value']);
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<any>(null);

  const categories = Array.from(new Set(metrics.map((m) => m.category)));
  const availableMetrics = [
    { value: 'avg_value', label: 'Average Value' },
    { value: 'total_value', label: 'Total Value' },
    { value: 'max_value', label: 'Maximum Value' },
    { value: 'min_value', label: 'Minimum Value' },
    { value: 'count', label: 'Count' },
  ];

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleMetricToggle = (metric: string) => {
    setSelectedMetrics((prev) =>
      prev.includes(metric)
        ? prev.filter((m) => m !== metric)
        : [...prev, metric]
    );
  };

  const handleGenerateReport = async () => {
    if (selectedCategories.length === 0 || selectedMetrics.length === 0) {
      alert('Please select at least one category and one metric');
      return;
    }

    setLoading(true);
    try {
      const config = {
        categories: selectedCategories,
        metrics: selectedMetrics,
        includeTimeSeries: true,
      };

      const data = await generateReport(config);
      setReportData(data);
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveReport = async () => {
    if (!reportName.trim()) {
      alert('Please enter a report name');
      return;
    }

    if (!reportData) {
      alert('Please generate a report first');
      return;
    }

    setLoading(true);
    try {
      const config = {
        categories: selectedCategories,
        metrics: selectedMetrics,
        includeTimeSeries: true,
      };

      await saveReport(reportName, reportDescription, config);
      alert('Report saved successfully!');
      setReportName('');
      setReportDescription('');
    } catch (error) {
      console.error('Error saving report:', error);
      alert('Failed to save report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Categories Selection */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
            Select Categories
          </h4>
          <div className="space-y-2">
            {categories.map((category) => (
              <label
                key={category}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={() => handleCategoryToggle(category)}
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                  {category}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Metrics Selection */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
            Select Metrics
          </h4>
          <div className="space-y-2">
            {availableMetrics.map((metric) => (
              <label
                key={metric.value}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedMetrics.includes(metric.value)}
                  onChange={() => handleMetricToggle(metric.value)}
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {metric.label}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Report Name and Description */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
            Report Name
          </label>
          <input
            type="text"
            value={reportName}
            onChange={(e) => setReportName(e.target.value)}
            placeholder="Enter report name"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
            Description (Optional)
          </label>
          <textarea
            value={reportDescription}
            onChange={(e) => setReportDescription(e.target.value)}
            placeholder="Enter report description"
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <button
          onClick={handleGenerateReport}
          disabled={loading || selectedCategories.length === 0 || selectedMetrics.length === 0}
          className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Generating...' : 'Generate Report'}
        </button>
        {reportData && (
          <button
            onClick={handleSaveReport}
            disabled={loading || !reportName.trim()}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Save Report
          </button>
        )}
      </div>

      {/* Report Results */}
      {reportData && (
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Report Summary
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedCategories.map((category) => {
              const categoryData = metrics.find((m) => m.category === category);
              if (!categoryData) return null;

              return (
                <div
                  key={category}
                  className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm"
                >
                  <h5 className="font-semibold text-gray-900 dark:text-white mb-2 capitalize">
                    {category}
                  </h5>
                  <div className="space-y-1">
                    {selectedMetrics.map((metric) => {
                      const value = categoryData[metric];
                      if (value === undefined) return null;
                      return (
                        <div key={metric} className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">
                            {availableMetrics.find((m) => m.value === metric)?.label}:
                          </span>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {typeof value === 'number'
                              ? value.toLocaleString()
                              : value}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

