"use client";

import { format } from "date-fns";

interface MetricCardProps {
  metric: {
    category: string;
    count: number;
    avg_value: number;
    total_value: number;
    max_value: number;
    min_value: number;
    latest_timestamp: string;
  };
}

export default function MetricCard({ metric }: MetricCardProps) {
  const formatValue = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(2)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(2)}K`;
    }
    return value.toFixed(2);
  };

  const categoryConfig: Record<
    string,
    {
      label: string;
      gradient: string;
      bgGradient: string;
      icon: string;
    }
  > = {
    revenue: {
      label: "Revenue",
      gradient: "from-green-500 to-emerald-600",
      bgGradient:
        "from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20",
      icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    },
    users: {
      label: "Users",
      gradient: "from-blue-500 to-cyan-600",
      bgGradient:
        "from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20",
      icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
    },
    conversion: {
      label: "Conversion",
      gradient: "from-purple-500 to-pink-600",
      bgGradient:
        "from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20",
      icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
    },
    engagement: {
      label: "Engagement",
      gradient: "from-yellow-500 to-orange-600",
      bgGradient:
        "from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20",
      icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
    },
    performance: {
      label: "Performance",
      gradient: "from-red-500 to-rose-600",
      bgGradient:
        "from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20",
      icon: "M13 10V3L4 14h7v7l9-11h-7z",
    },
  };

  const config = categoryConfig[metric.category] || {
    label: metric.category,
    gradient: "from-gray-500 to-gray-600",
    bgGradient: "from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700",
    icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
  };

  return (
    <div
      className={`bg-gradient-to-br ${config.bgGradient} backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 group`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`p-2.5 bg-gradient-to-br ${config.gradient} rounded-lg shadow-md group-hover:shadow-lg transition-shadow`}
          >
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={config.icon}
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {config.label}
          </h3>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1">
            Average Value
          </p>
          <p
            className={`text-3xl font-bold bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent`}
          >
            {formatValue(
              typeof metric.avg_value === "string"
                ? parseFloat(metric.avg_value)
                : metric.avg_value
            )}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-200/50 dark:border-gray-700/50">
          <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3 backdrop-blur-sm">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              Total
            </p>
            <p className="text-sm font-bold text-gray-900 dark:text-white">
              {formatValue(
                typeof metric.total_value === "string"
                  ? parseFloat(metric.total_value)
                  : metric.total_value
              )}
            </p>
          </div>
          <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3 backdrop-blur-sm">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              Count
            </p>
            <p className="text-sm font-bold text-gray-900 dark:text-white">
              {metric.count.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2 text-xs text-gray-500 dark:text-gray-400">
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>
            Updated {format(new Date(metric.latest_timestamp), "MMM d, HH:mm")}
          </span>
        </div>
      </div>
    </div>
  );
}
