"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  FaBox,
  FaCheckCircle,
  FaUndo,
  FaTimesCircle,
  FaDollarSign,
  FaProductHunt,
  FaFilter,
} from "react-icons/fa";

const metricCards = [
  {
    key: "totalProducts",
    label: "Total Products",
    color: "bg-indigo-50 text-indigo-700",
    icon: <FaProductHunt size={24} className="text-indigo-500" />,
  },
  {
    key: "totalOrders",
    label: "Total Orders",
    color: "bg-sky-50 text-sky-700",
    icon: <FaBox size={24} className="text-indigo-500" />,
  },
  {
    key: "deliveredOrders",
    label: "Delivered Orders",
    color: "bg-emerald-50 text-emerald-700",
    icon: <FaCheckCircle size={24} className="text-green-500" />,
  },
  {
    key: "refundOrders",
    label: "Refund Orders",
    color: "bg-amber-50 text-amber-700",
    icon: <FaUndo size={24} className="text-orange-500" />,
  },
  {
    key: "cancelOrders",
    label: "Cancel Orders",
    color: "bg-rose-50 text-rose-700",
    icon: <FaTimesCircle size={24} className="text-red-500" />,
  },
  {
    key: "totalSell",
    label: "Total Sell",
    color: "bg-fuchsia-50 text-fuchsia-700",
    icon: <FaDollarSign size={24} className="text-purple-500" />,
  },
];

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [metrics, setMetrics] = React.useState({});
  const [orders, setOrders] = React.useState([]);
  const [chartData, setChartData] = React.useState({
    sales24h: [],
    sales7d: [],
    paymentData: [],
  });

  React.useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setIsLoading(true);
        const res = await fetch("/api/admin/dashboard", {
          cache: "no-store",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const json = await res.json();
        if (!cancelled && json?.success) {
          setMetrics(json.data?.metrics || {});
          setOrders(json.data?.recentOrders || []);
          setChartData(
            json.data?.chartData || {
              sales24h: [],
              sales7d: [],
              paymentData: [],
            }
          );
        } else if (!cancelled) {
          console.error("API returned error:", json.message);
        }
      } catch (e) {
        console.error("Failed to load dashboard data", e);
        // Set fallback data on error
        if (!cancelled) {
          setMetrics({});
          setOrders([]);
          setChartData({ sales24h: [], sales7d: [], paymentData: [] });
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-6 ">
      <div className="border-gray-200">
        <div>
          <p className="text-2xl lg:text-3xl text-primary font-bold text-center  sm:text-left  mb-2">
            Dashboard Overview
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {metricCards.map((m) => (
            <div
              key={m.key}
              className={`${m.color} rounded-xl border border-gray-200 p-12 shadow-sm `}
            >
              <div className="flex items-center justify-between">
                <div className="flex flex-col items-center gap-3">
                  <div className="text-2xl">{m.icon}</div>
                  <div className="font-medium">{m.label}</div>
                </div>
                <div className="text-2xl font-bold tabular-nums">
                  {isLoading ? "…" : metrics[m.key] ?? 0}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Sales Statistics Chart */}
        <Card className="border-gray-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold">
                Sales Statistics
              </CardTitle>
              <FaFilter className="text-gray-400 cursor-pointer hover:text-gray-600" />
            </div>
          </CardHeader>
          <CardContent>
            <SalesChart
              data24h={chartData.sales24h}
              data7d={chartData.sales7d}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>

        {/* Payment Method Chart */}
        <Card className="border-gray-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold">
                Payment Statistics by Gateway
              </CardTitle>
              <FaFilter className="text-gray-400 cursor-pointer hover:text-gray-600" />
            </div>
          </CardHeader>
          <CardContent>
            <PaymentChart data={chartData.paymentData} isLoading={isLoading} />
          </CardContent>
        </Card>
      </div>

      <Card className="border-gray-200 mb-14">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Recent Orders</CardTitle>
            <Badge className="bg-gray-100 text-gray-700">Last 8 hours</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SL</TableHead>
                <TableHead>User Name</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Total Price</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-8 text-center text-gray-500"
                  >
                    Loading…
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && orders.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-8 text-center text-gray-500"
                  >
                    No orders in the last 8 hours
                  </TableCell>
                </TableRow>
              )}
              {orders.map((o, idx) => (
                <TableRow key={o.id}>
                  <TableCell>{idx + 1}</TableCell>
                  <TableCell>{o.userName}</TableCell>
                  <TableCell>{o.productLabel}</TableCell>
                  <TableCell>
                    ৳ {Number(o.totalPrice).toLocaleString()}
                  </TableCell>
                  <TableCell className="capitalize">
                    {o.paymentMethod}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={o.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

// Sales Chart Component
function SalesChart({ data24h, data7d, isLoading }) {
  if (isLoading) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const [activeTab, setActiveTab] = React.useState("24h");

  const currentData = activeTab === "24h" ? data24h : data7d;
  const maxSales = Math.max(...currentData.map((d) => d.sales), 1);
  const maxIncome = Math.max(...currentData.map((d) => d.income), 1);

  // Create SVG path for line chart
  const createPath = (data, valueKey, maxValue) => {
    if (data.length === 0) return "";

    const width = 400;
    const height = 200;
    const padding = 20;

    const stepX = (width - 2 * padding) / (data.length - 1);

    let path = "";
    data.forEach((point, index) => {
      const x = padding + index * stepX;
      const y =
        height -
        padding -
        (point[valueKey] / maxValue) * (height - 2 * padding);

      if (index === 0) {
        path += `M ${x} ${y}`;
      } else {
        path += ` L ${x} ${y}`;
      }
    });

    return path;
  };

  const salesPath = createPath(currentData, "sales", maxSales);
  const incomePath = createPath(currentData, "income", maxIncome);

  return (
    <div className="h-80">
      {/* Tab Selector */}
      <div className="flex mb-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("24h")}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === "24h"
              ? "text-primary border-b-2 border-primary"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Last 24 Hours
        </button>
        <button
          onClick={() => setActiveTab("7d")}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === "7d"
              ? "text-primary border-b-2 border-primary"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Last 7 Days
        </button>
      </div>

      {/* Chart */}
      <div className="relative h-64">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 400 200"
          className="overflow-visible"
        >
          {/* Grid lines */}
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="#f3f4f6"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Sales line */}
          <path
            d={salesPath}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Income line */}
          <path
            d={incomePath}
            fill="none"
            stroke="#10b981"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points */}
          {currentData.map((point, index) => {
            const x = 20 + index * (360 / (currentData.length - 1));
            const salesY = 180 - (point.sales / maxSales) * 160;
            const incomeY = 180 - (point.income / maxIncome) * 160;

            return (
              <g key={index}>
                {/* Sales point */}
                <circle
                  cx={x}
                  cy={salesY}
                  r="4"
                  fill="#3b82f6"
                  className="hover:r-6 transition-all"
                />
                {/* Income point */}
                <circle
                  cx={x}
                  cy={incomeY}
                  r="4"
                  fill="#10b981"
                  className="hover:r-6 transition-all"
                />
              </g>
            );
          })}
        </svg>

        {/* X-axis labels */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between px-5 text-xs text-gray-500">
          {currentData.map((item, index) => (
            <span key={index} className="text-center">
              {item.time}
            </span>
          ))}
        </div>

        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-500 px-2">
          <span>{maxSales}</span>
          <span>{Math.round(maxSales * 0.8)}</span>
          <span>{Math.round(maxSales * 0.6)}</span>
          <span>{Math.round(maxSales * 0.4)}</span>
          <span>{Math.round(maxSales * 0.2)}</span>
          <span>0</span>
        </div>

        <div className="absolute right-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-500 px-2">
          <span>৳{maxIncome.toLocaleString()}</span>
          <span>৳{Math.round(maxIncome * 0.8).toLocaleString()}</span>
          <span>৳{Math.round(maxIncome * 0.6).toLocaleString()}</span>
          <span>৳{Math.round(maxIncome * 0.4).toLocaleString()}</span>
          <span>৳{Math.round(maxIncome * 0.2).toLocaleString()}</span>
          <span>৳0</span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center space-x-6 mt-4 text-xs">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span className="text-gray-700">Sales Count</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-gray-700">Income (৳)</span>
        </div>
      </div>
    </div>
  );
}

// Payment Chart Component
function PaymentChart({ data, isLoading }) {
  if (isLoading) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Filter and format payment gateway data
  const gatewayColors = {
    bkash: "#ec4899",
    nagad: "#ED1C24",
    rocket: "#89288F",
    uddoktapay: "#009DFA",
    "refund-balance": "#7925C7",
  };

  const gatewayNames = {
    bkash: "Bkash",
    nagad: "Nagad",
    rocket: "Rocket",
    uddoktapay: "UddoktaPay",
    "refund-balance": "Refund Balance",
  };

  const sampleData =
    data.length > 0
      ? data.map((item) => ({
          name: gatewayNames[item.name?.toLowerCase()] || item.name,
          value: parseFloat(item.value),
          color: gatewayColors[item.name?.toLowerCase()] || "#6b7280",
        }))
      : [
          { name: "Bkash", value: 0, color: "#ec4899" },
          { name: "Nagad", value: 0, color: "#3b82f6" },
          { name: "Rocket", value: 0, color: "#10b981" },
          { name: "UddoktaPay", value: 0, color: "#f59e0b" },
          { name: "Refund Balance", value: 0, color: "#8b5cf6" },
        ];

  const total = sampleData.reduce(
    (sum, item) => sum + parseFloat(item.value),
    0
  );
  let cumulativePercentage = 0;

  // Filter out zero values for cleaner display
  const filteredData = sampleData.filter((item) => item.value > 0);
  const displayTotal = filteredData.reduce((sum, item) => sum + item.value, 0);

  if (filteredData.length === 0) {
    return (
      <div className="h-80 flex flex-col items-center justify-center">
        <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <span className="text-gray-400 text-sm">No Data</span>
        </div>
        <p className="text-gray-500 text-sm">No payment data available</p>
      </div>
    );
  }

  return (
    <div className="h-80 flex flex-col lg:flex-row items-center justify-center gap-6">
      {/* Pie Chart */}
      <div className="relative w-48 h-48">
        <svg
          className="w-full h-full transform -rotate-90"
          viewBox="0 0 100 100"
        >
          {filteredData.map((item, index) => {
            const percentage = (item.value / displayTotal) * 100;
            const circumference = 2 * Math.PI * 40; // radius = 40
            const strokeDasharray = `${
              (percentage / 100) * circumference
            } ${circumference}`;
            const strokeDashoffset = -(
              (cumulativePercentage / 100) *
              circumference
            );

            cumulativePercentage += percentage;

            return (
              <circle
                key={index}
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke={item.color}
                strokeWidth="8"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-300 hover:stroke-width-12 cursor-pointer"
                style={{
                  filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
                }}
              />
            );
          })}
        </svg>

        {/* Center Text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-700">
              {displayTotal.toFixed(1)}%
            </div>
            <div className="text-xs text-gray-500">Total</div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-3 min-w-[200px]">
        {filteredData.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div
                className="w-4 h-4 rounded-full shadow-sm"
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-sm font-medium text-gray-700">
                {item.name}
              </span>
            </div>
            <div className="text-sm font-semibold text-gray-600">
              {item.value.toFixed(1)}%
            </div>
          </div>
        ))}

        {/* Summary */}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    pending: "bg-amber-100 text-amber-800",
    delivered: "bg-emerald-100 text-emerald-800",
    refunded: "bg-sky-100 text-sky-800",
    cancelled: "bg-rose-100 text-rose-800",
  };
  const cls = map[status] || "bg-gray-100 text-gray-700";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${cls}`}
    >
      {status}
    </span>
  );
}
