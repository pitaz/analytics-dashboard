"use client";

import { useEffect, useState } from "react";
import Dashboard from "@/components/Dashboard";
import { useWebSocket } from "@/hooks/useWebSocket";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

export default function DashboardPage() {
  const [isConnected, setIsConnected] = useState(false);
  const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:3001";
  const { data, error } = useWebSocket(wsUrl);

  useEffect(() => {
    if (data) {
      setIsConnected(true);
    }
  }, [data]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Navigation Header */}
      <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-lg">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                  Analytics Dashboard
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
                  Real-time insights
                </p>
              </div>
            </Link>

            <div className="flex items-center space-x-4">
              {/* Connection Status */}
              <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <div className="relative">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      isConnected ? "bg-green-500" : "bg-red-500"
                    }`}
                  />
                  {isConnected && (
                    <div className="absolute inset-0 w-2 h-2 rounded-full bg-green-500 animate-ping opacity-75" />
                  )}
                </div>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300 hidden sm:inline">
                  {isConnected ? "Live" : "Offline"}
                </span>
              </div>

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Settings Button */}
              <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <svg
                  className="w-5 h-5 text-gray-600 dark:text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Business Analytics
                <span className="block text-2xl sm:text-3xl font-normal text-gray-600 dark:text-gray-400 mt-1">
                  Real-time insights into your metrics
                </span>
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-2xl">
                Monitor performance, track trends, and make data-driven
                decisions with our advanced analytics platform.
              </p>
            </div>

            {/* Quick Stats */}
            <div className="flex flex-wrap gap-3">
              <div className="px-4 py-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg border border-gray-200/50 dark:border-gray-700/50">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Latency
                </div>
                <div className="text-lg font-bold text-gray-900 dark:text-white">
                  &lt;1s
                </div>
              </div>
              <div className="px-4 py-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg border border-gray-200/50 dark:border-gray-700/50">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Data Points
                </div>
                <div className="text-lg font-bold text-gray-900 dark:text-white">
                  1M+
                </div>
              </div>
              <div className="px-4 py-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg border border-gray-200/50 dark:border-gray-700/50">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Uptime
                </div>
                <div className="text-lg font-bold text-green-600 dark:text-green-400">
                  99.9%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-r-lg shadow-sm">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-red-500 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <h3 className="text-sm font-semibold text-red-800 dark:text-red-300">
                  Connection Error
                </h3>
                <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                  WebSocket server is not running. Please start the server to
                  enable real-time updates.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Dashboard Content */}
        <div className="mt-8">
          <Dashboard realTimeData={data} />
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-16 border-t border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © 2023 Analytics Dashboard. Built with Next.js, D3.js, and
              Chart.js
            </p>
            <div className="flex items-center space-x-4">
              <a
                href="#"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Documentation
              </a>
              <a
                href="#"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Support
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
