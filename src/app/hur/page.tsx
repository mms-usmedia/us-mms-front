"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import SearchFilter from "@/components/hur/SearchFilter";
import HURTable from "@/components/hur/HURTable";
import HURStatsCards from "@/components/hur/HURStatsCards";
import {
  mockHURRequests,
  HURRequest,
  HURStatus,
} from "@/components/hur/mockData";

export default function HURPage() {
  const { user } = useAuth();
  const [filteredData, setFilteredData] =
    useState<HURRequest[]>(mockHURRequests);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilters, setStatusFilters] = useState<HURStatus[] | "All">(
    "All"
  );
  const [mediaTypeFilters, setMediaTypeFilters] = useState<string[] | "All">(
    "All"
  );
  const [billingOfficeFilters, setBillingOfficeFilters] = useState<
    string[] | "All"
  >("All");

  useEffect(() => {
    let result = [...mockHURRequests];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.campaignName.toLowerCase().includes(query) ||
          item.id.toLowerCase().includes(query) ||
          item.campaignId.toLowerCase().includes(query) ||
          item.requester.toLowerCase().includes(query)
      );
    }

    // Apply status filters
    if (statusFilters !== "All" && statusFilters.length > 0) {
      result = result.filter((item) => statusFilters.includes(item.status));
    }

    // Apply media type filters
    if (mediaTypeFilters !== "All" && mediaTypeFilters.length > 0) {
      result = result.filter((item) =>
        mediaTypeFilters.includes(item.mediaType)
      );
    }

    // Apply billing office filters
    if (billingOfficeFilters !== "All" && billingOfficeFilters.length > 0) {
      result = result.filter((item) =>
        billingOfficeFilters.includes(item.billingOffice)
      );
    }

    setFilteredData(result);
  }, [searchQuery, statusFilters, mediaTypeFilters, billingOfficeFilters]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleStatusFilter = (status: HURStatus[] | "All") => {
    setStatusFilters(status);
  };

  const handleMediaTypeFilter = (mediaType: string[] | "All") => {
    setMediaTypeFilters(mediaType);
  };

  const handleBillingOfficeFilter = (office: string[] | "All") => {
    setBillingOfficeFilters(office);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header userName={user?.name || "User"} />

        {/* Main Container */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <div className="container mx-auto">
            {/* Page header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                HUR Management
              </h1>
              <p className="mt-1 text-base text-gray-500">
                Manage Historical Update Requests for closed campaigns
              </p>
            </div>

            {/* Stats Cards */}
            <HURStatsCards data={mockHURRequests} />

            {/* Filters */}
            <SearchFilter
              onSearch={handleSearch}
              onStatusFilter={handleStatusFilter}
              onMediaTypeFilter={handleMediaTypeFilter}
              onBillingOfficeFilter={handleBillingOfficeFilter}
            />

            {/* HUR Table */}
            <HURTable data={filteredData} />
          </div>
        </main>
      </div>
    </div>
  );
}
