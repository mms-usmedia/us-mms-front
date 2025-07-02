"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import AdOpsTable from "@/components/adops/AdOpsTable";
import { mockAdOpsData } from "@/components/adops/mockData";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { useSidebar } from "@/contexts/SidebarContext";
import ProductTypeFilter from "@/components/adops/ProductTypeFilter";
import StatusFilter from "@/components/adops/StatusFilter";
import PublisherFilter from "@/components/adops/PublisherFilter";
import CampaignTypeFilter from "@/components/adops/CampaignTypeFilter";
import PurchaseTypeFilter from "@/components/adops/PurchaseTypeFilter";
import TraffickerFilter from "@/components/adops/TraffickerFilter";
import StatsCard from "@/components/adops/StatsCard";
import TraffickerReport from "@/components/adops/TraffickerReport";

export default function AdOpsPage() {
  const { isCollapsed } = useSidebar();
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState<"dashboard" | "trafficker">(
    "dashboard"
  );

  // Filter states
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedPublishers, setSelectedPublishers] = useState<string[]>([]);
  const [selectedCampaignTypes, setSelectedCampaignTypes] = useState<string[]>(
    []
  );
  const [selectedPurchaseTypes, setSelectedPurchaseTypes] = useState<string[]>(
    []
  );
  const [selectedTraffickers, setSelectedTraffickers] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [selectedMarket, setSelectedMarket] = useState<string>("");

  // Stats for the dashboard
  const [totalInvestment, setTotalInvestment] = useState(0);
  const [averageDeliveryPercentage, setAverageDeliveryPercentage] = useState(0);
  const [activeCampaigns, setActiveCampaigns] = useState(0);
  const [clickThroughRate, setClickThroughRate] = useState(0);

  // Calculate stats from data
  useEffect(() => {
    // Calculate total investment
    const investment = mockAdOpsData.reduce(
      (total, item) => total + item.totalInvestmentUsd,
      0
    );
    setTotalInvestment(investment);

    // Calculate average delivery percentage
    const avgDelivery =
      mockAdOpsData.reduce(
        (total, item) => total + item.deliveryPercentage,
        0
      ) / mockAdOpsData.length;
    setAverageDeliveryPercentage(avgDelivery);

    // Count active campaigns
    const active = mockAdOpsData.filter(
      (item) => item.status === "Active"
    ).length;
    setActiveCampaigns(active);

    // Calculate average CTR
    const avgCtr =
      mockAdOpsData.reduce((total, item) => total + item.ctr, 0) /
      mockAdOpsData.length;
    setClickThroughRate(avgCtr);
  }, []);

  // Filter data based on all filters
  const filteredData = mockAdOpsData.filter((item) => {
    // Search term filter
    const matchesSearch =
      searchTerm === "" ||
      Object.values(item).some(
        (value) =>
          value &&
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );

    // Product filter
    const matchesProduct =
      selectedProducts.length === 0 ||
      selectedProducts.includes(item.productType);

    // Status filter
    const matchesStatus =
      selectedStatuses.length === 0 || selectedStatuses.includes(item.status);

    // Publisher filter
    const matchesPublisher =
      selectedPublishers.length === 0 ||
      selectedPublishers.includes(item.publisher);

    // Campaign type filter
    const matchesCampaignType =
      selectedCampaignTypes.length === 0 ||
      selectedCampaignTypes.includes(item.campaignType);

    // Purchase type filter
    const matchesPurchaseType =
      selectedPurchaseTypes.length === 0 ||
      selectedPurchaseTypes.includes(item.purchaseType);

    // Trafficker filter
    const matchesTrafficker =
      selectedTraffickers.length === 0 ||
      selectedTraffickers.includes(item.trafficker);

    // Date range filter
    const itemStartDate = new Date(item.startDate);
    const itemEndDate = new Date(item.endDate);
    const filterStartDate = startDate ? new Date(startDate) : null;
    const filterEndDate = endDate ? new Date(endDate) : null;

    const matchesDateRange =
      (!filterStartDate || itemStartDate >= filterStartDate) &&
      (!filterEndDate || itemEndDate <= filterEndDate);

    // Market filter
    const matchesMarket =
      selectedMarket === "" || item.market === selectedMarket;

    return (
      matchesSearch &&
      matchesProduct &&
      matchesStatus &&
      matchesPublisher &&
      matchesCampaignType &&
      matchesPurchaseType &&
      matchesTrafficker &&
      matchesDateRange &&
      matchesMarket
    );
  });

  // Check if there are any active filters
  const hasActiveFilters =
    searchTerm ||
    selectedProducts.length > 0 ||
    selectedStatuses.length > 0 ||
    selectedPublishers.length > 0 ||
    selectedCampaignTypes.length > 0 ||
    selectedPurchaseTypes.length > 0 ||
    selectedTraffickers.length > 0 ||
    startDate ||
    endDate ||
    selectedMarket;

  // Clear all filters
  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedProducts([]);
    setSelectedStatuses([]);
    setSelectedPublishers([]);
    setSelectedCampaignTypes([]);
    setSelectedPurchaseTypes([]);
    setSelectedTraffickers([]);
    setStartDate("");
    setEndDate("");
    setSelectedMarket("");
  };

  // Market options
  const marketOptions = Array.from(
    new Set(mockAdOpsData.map((item) => item.market))
  ).sort();

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format percentage
  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="AdOps Dashboard" />

        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="container mx-auto px-6 py-6 max-w-full">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Campaign Management
              </h1>
              <p className="text-gray-600">
                Monitor and control all your campaign operations
              </p>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-6">
              <button
                className={`py-2 px-4 font-medium text-sm ${
                  activeTab === "dashboard"
                    ? "border-b-2 border-orange-500 text-orange-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("dashboard")}
              >
                AdOps Dashboard
              </button>
              <button
                className={`py-2 px-4 font-medium text-sm ${
                  activeTab === "trafficker"
                    ? "border-b-2 border-orange-500 text-orange-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("trafficker")}
              >
                Trafficker Reports
              </button>
            </div>

            {activeTab === "dashboard" ? (
              <>
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <StatsCard
                    title="Total Investment"
                    value={formatCurrency(totalInvestment)}
                    change="8.2%"
                    isPositive={true}
                  />

                  <StatsCard
                    title="Overall Delivery"
                    value={formatPercentage(averageDeliveryPercentage)}
                    change="2.5%"
                    isPositive={true}
                  />

                  <StatsCard
                    title="Active Campaigns"
                    value={activeCampaigns.toString()}
                    change="3"
                    isPositive={true}
                  />

                  <StatsCard
                    title="Average CTR"
                    value={formatPercentage(clickThroughRate)}
                    change="0.3%"
                    isPositive={false}
                  />
                </div>

                {/* Search and Filters */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex flex-col space-y-4">
                    <div className="flex space-x-2">
                      <div className="flex-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-gray-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <input
                          type="text"
                          className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm text-gray-900 placeholder-gray-500 bg-gray-50"
                          placeholder="Search campaigns, advertisers, publishers..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      <button
                        className={`flex items-center px-3 py-2.5 rounded-lg shadow-sm border ${
                          showFilters
                            ? "bg-orange-50 text-orange-700 border-orange-200"
                            : "bg-white text-orange-600 border-gray-200 hover:bg-gray-50"
                        }`}
                        onClick={() => setShowFilters(!showFilters)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-1"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Filters
                        {hasActiveFilters && (
                          <span className="ml-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-orange-100 text-xs font-medium text-orange-800">
                            {(searchTerm ? 1 : 0) +
                              (selectedProducts.length > 0 ? 1 : 0) +
                              (selectedStatuses.length > 0 ? 1 : 0) +
                              (selectedPublishers.length > 0 ? 1 : 0) +
                              (selectedCampaignTypes.length > 0 ? 1 : 0) +
                              (selectedPurchaseTypes.length > 0 ? 1 : 0) +
                              (selectedTraffickers.length > 0 ? 1 : 0) +
                              (startDate ? 1 : 0) +
                              (endDate ? 1 : 0) +
                              (selectedMarket ? 1 : 0)}
                          </span>
                        )}
                      </button>
                      {hasActiveFilters && (
                        <button
                          className="flex items-center px-3 py-2.5 rounded-lg border border-gray-200 shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                          onClick={clearAllFilters}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Clear
                        </button>
                      )}
                    </div>

                    {showFilters && (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
                        <div>
                          <ProductTypeFilter
                            selectedProducts={selectedProducts}
                            setSelectedProducts={setSelectedProducts}
                          />
                        </div>
                        <div>
                          <StatusFilter
                            selectedStatuses={selectedStatuses}
                            setSelectedStatuses={setSelectedStatuses}
                          />
                        </div>
                        <div>
                          <PublisherFilter
                            selectedPublishers={selectedPublishers}
                            setSelectedPublishers={setSelectedPublishers}
                          />
                        </div>
                        <div>
                          <CampaignTypeFilter
                            selectedCampaignTypes={selectedCampaignTypes}
                            setSelectedCampaignTypes={setSelectedCampaignTypes}
                          />
                        </div>
                        <div>
                          <PurchaseTypeFilter
                            selectedPurchaseTypes={selectedPurchaseTypes}
                            setSelectedPurchaseTypes={setSelectedPurchaseTypes}
                          />
                        </div>
                        <div>
                          <TraffickerFilter
                            selectedTraffickers={selectedTraffickers}
                            setSelectedTraffickers={setSelectedTraffickers}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Start Date
                          </label>
                          <input
                            type="date"
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm text-gray-900 bg-gray-50"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            End Date
                          </label>
                          <input
                            type="date"
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm text-gray-900 bg-gray-50"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Market
                          </label>
                          <select
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm text-gray-900 bg-gray-50"
                            value={selectedMarket}
                            onChange={(e) => setSelectedMarket(e.target.value)}
                          >
                            <option value="">All Markets</option>
                            {marketOptions.map((market) => (
                              <option key={market} value={market}>
                                {market}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Table */}
                <div className="mt-6">
                  <AdOpsTable data={filteredData} />
                </div>
              </>
            ) : (
              <TraffickerReport />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
