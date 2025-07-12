import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatsCard } from "./StatsCard";
import { ProgressCard } from "./ProgressCard";
import { SalesByFormat } from "./SalesByFormat";
import { TopClients } from "./TopClients";
import { SalesPerformanceChart } from "./SalesPerformanceChart";
import { TasksAlerts } from "./TasksAlerts";
import { RecentCampaigns } from "./RecentCampaigns";
import DateRangePicker from "./DateRangePicker";
import { Calendar } from "lucide-react";

interface ExecutiveDashboardProps {
  onToggleDashboard: () => void;
}

export const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({
  onToggleDashboard,
}) => {
  const [activeTimeFilter, setActiveTimeFilter] = useState<string>("30D");
  const [selectedDateRange, setSelectedDateRange] = useState<{
    start: Date | null;
    end: Date | null;
  }>({ start: null, end: null });
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const customButtonRef = React.useRef<HTMLButtonElement>(null);

  // Íconos para las tarjetas
  const revenueIcon = (
    <svg
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
  const profitIcon = (
    <svg
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
  const accountsIcon = (
    <svg
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
      />
    </svg>
  );
  const targetIcon = (
    <svg
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
      />
    </svg>
  );

  const handleTimeFilterChange = (filter: string) => {
    setActiveTimeFilter(filter);
    if (filter !== "Custom") {
      setSelectedDateRange({ start: null, end: null });
    }
  };

  const handleDateRangeChange = (
    startDate: Date | null,
    endDate: Date | null
  ) => {
    if (startDate && endDate) {
      setSelectedDateRange({ start: startDate, end: endDate });
      setActiveTimeFilter("Custom");
      setIsDatePickerOpen(false);
    }
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getCustomButtonText = () => {
    if (selectedDateRange.start && selectedDateRange.end) {
      return `${formatDate(selectedDateRange.start)} - ${formatDate(
        selectedDateRange.end
      )}`;
    }
    return "Custom";
  };

  return (
    <div className="p-6 space-y-6">
      {/* Filtros de tiempo */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-2 items-center">
          {["7D", "30D", "90D", "YTD"].map((filter) => (
            <Button
              key={filter}
              variant={activeTimeFilter === filter ? "secondary" : "outline"}
              size="sm"
              className={`text-sm ${
                activeTimeFilter === filter
                  ? "bg-orange-100 border-orange-200 text-orange-700"
                  : ""
              }`}
              onClick={() => handleTimeFilterChange(filter)}
            >
              {filter}
            </Button>
          ))}
          <Button
            ref={customButtonRef}
            className={`text-sm flex items-center space-x-1 ${
              activeTimeFilter === "Custom"
                ? "bg-orange-100 border-orange-200 text-orange-700"
                : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
            size="sm"
            onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
          >
            <span>{getCustomButtonText()}</span>
            <Calendar className="h-4 w-4" />
          </Button>
          <DateRangePicker
            isOpen={isDatePickerOpen}
            onClose={() => setIsDatePickerOpen(false)}
            onDateRangeChange={handleDateRangeChange}
            triggerRef={customButtonRef as React.RefObject<HTMLElement>}
            backgroundColor="#ffffff"
            selectedDayColor="#f97316"
            rangeDayColor="#fed7aa"
            textColor="#000000"
            headerColor="#6b7280"
          />
        </div>
        <div className="flex space-x-2">
          <Button
            variant="default"
            className="bg-orange-600 hover:bg-orange-700"
            onClick={onToggleDashboard}
          >
            View Sales Dashboard
          </Button>
        </div>
      </div>

      {/* KPIs principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Revenue"
          value="$5.8M"
          icon={revenueIcon}
          trend={{ value: "14% vs. last quarter", positive: true }}
          color="blue"
        />
        <StatsCard
          title="Total Profit"
          value="$2.7M"
          icon={profitIcon}
          trend={{ value: "46% margin", positive: true }}
          color="green"
        />
        <StatsCard
          title="Active Accounts"
          value="87"
          icon={accountsIcon}
          subtitle="$67.1K avg. deal size"
          color="purple"
        />
        <ProgressCard
          title="Q2 Target Progress"
          percentage={68.7}
          currentValue="$5.8M"
          targetValue="$8.5M"
          icon={targetIcon}
          color="indigo"
        />
      </div>

      {/* KPIs secundarios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatsCard
          title="Active Campaigns"
          value="134"
          icon={accountsIcon}
          color="orange"
        />
        <StatsCard
          title="Sales Growth YTD"
          value="12.7%"
          icon={targetIcon}
          trend={{ value: "", positive: true }}
          color="green"
        />
        <StatsCard
          title="Market Share"
          value="23.5%"
          icon={targetIcon}
          color="blue"
        />
        <StatsCard
          title="Conversion Rate"
          value="32.4%"
          icon={targetIcon}
          color="purple"
        />
        <StatsCard
          title="YTD Performance"
          value={"+11.5%"}
          icon={targetIcon}
          trend={{ value: "+11.5%", positive: true }}
          color="green"
        />
      </div>

      {/* Performance Overview */}
      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Performance Overview
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <StatsCard
            title="Monthly"
            value="$2.0M"
            icon={revenueIcon}
            trend={{ value: "+6.8%", positive: true }}
            color="green"
            subtitle="vs. $1.9M last month"
          />
          <StatsCard
            title="Quarterly"
            value="$5.8M"
            icon={revenueIcon}
            trend={{ value: "+14%", positive: true }}
            color="blue"
            subtitle="vs. $5.1M last quarter"
          />
          <StatsCard
            title="Year to Date"
            value="$16.5M"
            icon={revenueIcon}
            trend={{ value: "+11.5%", positive: true }}
            color="indigo"
            subtitle="vs. $14.8M last YTD"
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SalesPerformanceChart />
          <div className="grid grid-cols-1 gap-6">
            <SalesByFormat />
            <TopClients />
          </div>
        </div>
      </Card>

      {/* Active Campaigns and KPI targets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentCampaigns />
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Quarterly KPI Targets
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-700">Q1 2025</span>
                <span className="text-sm text-green-600 font-medium">+10%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5 mb-2">
                <div
                  className="bg-green-500 h-2.5 rounded-full"
                  style={{ width: "100%" }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Target: $4.0M</span>
                <span>Actual: $4.4M</span>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-700">Q2 2025</span>
                <span className="text-sm text-red-600 font-medium">-31.3%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5 mb-2">
                <div
                  className="bg-red-500 h-2.5 rounded-full"
                  style={{ width: "68.7%" }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Target: $8.5M</span>
                <span>Actual: $5.8M</span>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-700">Q3 2025</span>
                <span className="text-sm text-gray-500 font-medium">+0%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5 mb-2">
                <div
                  className="bg-gray-300 h-2.5 rounded-full"
                  style={{ width: "0%" }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Target: $4.5M</span>
                <span>Actual: $0</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Tasks & Alerts and Key Publishers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TasksAlerts />
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Key Publishers
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-bold mr-3">
                  F
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    Fandom
                  </div>
                  <div className="text-xs text-gray-500">Display, Video</div>
                </div>
              </div>
              <span className="text-sm font-medium text-gray-900">
                $875.0K <span className="text-green-600">+18.7%</span>
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-bold mr-3">
                  W
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    WeTransfer
                  </div>
                  <div className="text-xs text-gray-500">Display, Takeover</div>
                </div>
              </div>
              <span className="text-sm font-medium text-gray-900">
                $520.0K <span className="text-green-600">+12.5%</span>
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 font-bold mr-3">
                  A
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    Amazon Advertising
                  </div>
                  <div className="text-xs text-gray-500">Display, Video</div>
                </div>
              </div>
              <span className="text-sm font-medium text-gray-900">
                $455.0K <span className="text-green-600">+25.3%</span>
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-800 font-bold mr-3">
                  C
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    CRP Radios
                  </div>
                  <div className="text-xs text-gray-500">Audio</div>
                </div>
              </div>
              <span className="text-sm font-medium text-gray-900">
                $350.0K <span className="text-green-600">+8.2%</span>
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-800 font-bold mr-3">
                  J
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    JCDecaux
                  </div>
                  <div className="text-xs text-gray-500">OOH</div>
                </div>
              </div>
              <span className="text-sm font-medium text-gray-900">
                $275.0K <span className="text-red-600">-2.8%</span>
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
