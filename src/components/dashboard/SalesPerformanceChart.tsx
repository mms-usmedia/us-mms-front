import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  ReferenceLine,
  TooltipProps,
} from "recharts";
import { Button } from "@/components/ui/button";

interface SalesPerformanceChartProps {
  className?: string;
}

// Sample sales performance data
const salesData = [
  { month: "Jan", sales: 65000, target: 60000, lastYear: 55000 },
  { month: "Feb", sales: 80000, target: 62000, lastYear: 58000 },
  { month: "Mar", sales: 72000, target: 65000, lastYear: 62000 },
  { month: "Apr", sales: 90000, target: 68000, lastYear: 65000 },
  { month: "May", sales: 85000, target: 70000, lastYear: 68000 },
  { month: "Jun", sales: 95000, target: 72000, lastYear: 70000 },
  { month: "Jul", sales: 70000, target: 75000, lastYear: 72000 },
  { month: "Aug", sales: 75000, target: 78000, lastYear: 68000 },
  { month: "Sep", sales: 88000, target: 80000, lastYear: 75000 },
  { month: "Oct", sales: 92000, target: 82000, lastYear: 78000 },
  { month: "Nov", sales: 78000, target: 85000, lastYear: 80000 },
  { month: "Dec", sales: 82000, target: 88000, lastYear: 82000 },
];

// Custom tooltip component
const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 shadow-lg rounded-md">
        <p className="font-medium text-gray-900">{`${label}`}</p>
        <p className="text-orange-600">{`Sales: $${payload[0]?.value?.toLocaleString()}`}</p>
        <p className="text-indigo-600">{`Target: $${payload[1]?.value?.toLocaleString()}`}</p>
        {payload[2] && (
          <p className="text-emerald-600">{`Last Year: $${payload[2]?.value?.toLocaleString()}`}</p>
        )}
        <p className="text-sm text-gray-500 mt-1">
          {payload[0]?.value && payload[1]?.value
            ? `${(
                (Number(payload[0].value) / Number(payload[1].value) - 1) *
                100
              ).toFixed(1)}% vs target`
            : ""}
        </p>
      </div>
    );
  }
  return null;
};

// Chart type icons
const AreaChartIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 3v18h18" />
    <path d="M3 12h4l3-6 4 12 3-6h4" />
  </svg>
);

const BarChartIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 3v18h18" />
    <rect x="7" y="8" width="3" height="9" />
    <rect x="14" y="4" width="3" height="13" />
  </svg>
);

export const SalesPerformanceChart: React.FC<SalesPerformanceChartProps> = ({
  className = "",
}) => {
  // State to toggle between area and bar chart
  const [chartType, setChartType] = useState<"area" | "bar">("area");
  // State to toggle last year data visibility
  const [showLastYear, setShowLastYear] = useState<boolean>(true);

  // Colors for the chart
  const colors = {
    sales: "#f59e0b", // amber-500
    target: "#6366f1", // indigo-500
    lastYear: "#10b981", // emerald-500
  };

  return (
    <Card className={`p-5 ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Sales Performance</h3>
        <div className="flex items-center space-x-6">
          <div className="flex space-x-4 text-sm">
            <div className="flex items-center">
              <span
                className="w-3 h-3 rounded-full mr-1"
                style={{ backgroundColor: colors.sales }}
              ></span>
              <span>Sales</span>
            </div>
            <div className="flex items-center">
              <span
                className="w-3 h-3 rounded-full mr-1"
                style={{ backgroundColor: colors.target }}
              ></span>
              <span>Target</span>
            </div>
            {showLastYear && (
              <div className="flex items-center">
                <span
                  className="w-3 h-3 rounded-full mr-1"
                  style={{ backgroundColor: colors.lastYear }}
                ></span>
                <span>Last Year</span>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-4">
            {/* Toggle for Last Year data */}
            <div className="flex items-center space-x-2">
              <span className="text-sm">Last Year</span>
              <div
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-500 ${
                  showLastYear ? "bg-orange-600" : "bg-gray-200"
                }`}
                onClick={() => setShowLastYear(!showLastYear)}
                role="switch"
                aria-checked={showLastYear}
                tabIndex={0}
              >
                <span
                  className={`${
                    showLastYear ? "translate-x-6" : "translate-x-1"
                  } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                />
              </div>
            </div>

            {/* Chart type toggle */}
            <div className="flex space-x-2">
              <Button
                variant={chartType === "area" ? "default" : "outline"}
                size="sm"
                onClick={() => setChartType("area")}
                className={`p-2 ${
                  chartType === "area"
                    ? "bg-orange-600 hover:bg-orange-700"
                    : ""
                }`}
                aria-label="Area Chart"
              >
                <AreaChartIcon />
              </Button>
              <Button
                variant={chartType === "bar" ? "default" : "outline"}
                size="sm"
                onClick={() => setChartType("bar")}
                className={`p-2 ${
                  chartType === "bar" ? "bg-orange-600 hover:bg-orange-700" : ""
                }`}
                aria-label="Bar Chart"
              >
                <BarChartIcon />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 relative h-80">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "area" ? (
            <AreaChart
              data={salesData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={colors.sales}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={colors.sales}
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={colors.target}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={colors.target}
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="colorLastYear" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={colors.lastYear}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={colors.lastYear}
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                opacity={0.3}
              />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6b7280", fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6b7280", fontSize: 12 }}
                tickFormatter={(value) => `$${value / 1000}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              {showLastYear && (
                <Area
                  type="monotone"
                  dataKey="lastYear"
                  stroke={colors.lastYear}
                  strokeWidth={2}
                  fillOpacity={0.3}
                  fill="url(#colorLastYear)"
                  activeDot={{ r: 6 }}
                />
              )}
              <Area
                type="monotone"
                dataKey="target"
                stroke={colors.target}
                strokeWidth={2}
                fillOpacity={0.3}
                fill="url(#colorTarget)"
                activeDot={{ r: 6 }}
              />
              <Area
                type="monotone"
                dataKey="sales"
                stroke={colors.sales}
                strokeWidth={3}
                fillOpacity={0.5}
                fill="url(#colorSales)"
                activeDot={{
                  r: 8,
                  stroke: colors.sales,
                  strokeWidth: 2,
                  fill: "#fff",
                }}
              />
            </AreaChart>
          ) : (
            <BarChart
              data={salesData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                opacity={0.3}
              />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6b7280", fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6b7280", fontSize: 12 }}
                tickFormatter={(value) => `$${value / 1000}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={0} stroke="#000" />
              {showLastYear && (
                <Bar
                  dataKey="lastYear"
                  fill={colors.lastYear}
                  radius={[4, 4, 0, 0]}
                  barSize={8}
                />
              )}
              <Bar
                dataKey="target"
                fill={colors.target}
                radius={[4, 4, 0, 0]}
                barSize={8}
              />
              <Bar
                dataKey="sales"
                fill={colors.sales}
                radius={[4, 4, 0, 0]}
                barSize={8}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      <div className="mt-4 border-t border-gray-100 pt-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Total Sales YTD</p>
            <p
              className="text-xl font-semibold"
              style={{ color: colors.sales }}
            >
              $972,000
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Annual Target</p>
            <p
              className="text-xl font-semibold"
              style={{ color: colors.target }}
            >
              $1,200,000
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Projection</p>
            <p className="text-xl font-semibold text-green-600">$1,250,000</p>
          </div>
        </div>
      </div>
    </Card>
  );
};
