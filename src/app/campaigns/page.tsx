// /src/app/campaigns/page.tsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useSidebar } from "@/contexts/SidebarContext";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import StatusBadge from "@/components/ui/StatusBadge";
import SearchFilter from "@/components/campaigns/SearchFilter";
import Link from "next/link";

// Types for campaigns
interface Campaign {
  id: string;
  name: string;
  organizationName: string;
  organizationType:
    | "Agency"
    | "Advertiser"
    | "Publisher"
    | "Holding Agency"
    | "Direct"
    | "Holding Advertiser";
  startDate: string;
  endDate: string;
  status:
    | "Pending"
    | "Negotiating"
    | "Won"
    | "Approved"
    | "Materials & Creatives OK"
    | "Implementation"
    | "Live"
    | "Closed"
    | "HUR"
    | "Invoiced";
  units: number;
  budget: number;
  grossMargin: number;
}

// Hardcoded example data for campaigns with varied statuses
const mockCampaigns: Campaign[] = [
  {
    id: "22043",
    name:
      "Banorte_Banorte_Hotsale _Credito Pyme _Linkedin_Mex_Junio25_Linkedin_Jun_Mexico",
    organizationName: "Havas Media-Mexico",
    organizationType: "Agency",
    startDate: "2025-06-01",
    endDate: "2025-06-30",
    status: "Approved",
    units: 500000,
    budget: 150000,
    grossMargin: 15,
  },
  {
    id: "22044",
    name:
      "Nintendo_Nintendo_Display Digital_Wetransfer_Static_Bra_Mex_Chi_Col_Per_May_Jun_25_Wetransfer_Jun_Brazil,Chile,Colombia,Mexico,Peru",
    organizationName: "Omnet-United States-OMG",
    organizationType: "Agency",
    startDate: "2025-06-02",
    endDate: "2025-06-28",
    status: "Implementation",
    units: 750000,
    budget: 225000,
    grossMargin: 18,
  },
  {
    id: "22045",
    name: "Paramount+_De Férias Com o Ex__Jun_Brazil",
    organizationName: "Paramount",
    organizationType: "Direct",
    startDate: "2025-06-03",
    endDate: "2025-06-25",
    status: "Won",
    units: 350000,
    budget: 80000,
    grossMargin: 22,
  },
  {
    id: "22046",
    name: "Pernod Ricard_Buhero Negro - PG_OneFootball_Jun_Argentina",
    organizationName: "Carat-Argentina",
    organizationType: "Agency",
    startDate: "2025-06-04",
    endDate: "2025-06-30",
    status: "Materials & Creatives OK",
    units: 420000,
    budget: 95000,
    grossMargin: 20,
  },
  {
    id: "22047",
    name: "PUIG_PUIG BANDERAS_Wetransfer_Jun_Mexico",
    organizationName: "Starcom-Mexico",
    organizationType: "Agency",
    startDate: "2025-06-05",
    endDate: "2025-06-30",
    status: "Pending",
    units: 380000,
    budget: 110000,
    grossMargin: 17,
  },
  {
    id: "22048",
    name: "Red Hat_Connected Campaign_TikTok_Jun_Latam",
    organizationName: "OMD- Argentina",
    organizationType: "Agency",
    startDate: "2025-06-06",
    endDate: "2025-06-30",
    status: "Negotiating",
    units: 600000,
    budget: 180000,
    grossMargin: 20,
  },
  {
    id: "22049",
    name: "Yakult_Campana anual_Wetransfer_Jun_Mexico",
    organizationName: "Yakult",
    organizationType: "Direct",
    startDate: "2025-06-07",
    endDate: "2025-06-30",
    status: "Pending",
    units: 300000,
    budget: 90000,
    grossMargin: 25,
  },
  {
    id: "22050",
    name: "Spotify Brazil_Fan Life - Fase 2_Vevo_Jun_Brazil",
    organizationName: "Soko",
    organizationType: "Agency",
    startDate: "2025-06-08",
    endDate: "2025-06-28",
    status: "Won",
    units: 450000,
    budget: 120000,
    grossMargin: 22,
  },
  {
    id: "22051",
    name: "Muv_Mynt_MAP_Jun",
    organizationName: "MUV-Brasil-WPP",
    organizationType: "Agency",
    startDate: "2025-06-09",
    endDate: "2025-06-30",
    status: "Approved",
    units: 320000,
    budget: 75000,
    grossMargin: 18,
  },
  {
    id: "22052",
    name: "Levis_Levis Pride__Jun_Mexico",
    organizationName: "UM - Mexico - IPG",
    organizationType: "Agency",
    startDate: "2025-06-10",
    endDate: "2025-06-30",
    status: "Materials & Creatives OK",
    units: 280000,
    budget: 65000,
    grossMargin: 20,
  },
];

export default function CampaignsListPage() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useAuth();
  const { isCollapsed } = useSidebar();
  const [campaigns] = useState<Campaign[]>(mockCampaigns);
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>(
    mockCampaigns
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrganization, setSelectedOrganization] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [sortField, setSortField] = useState<string>("startDate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [startDateFilter, setStartDateFilter] = useState<string>("");
  const [endDateFilter, setEndDateFilter] = useState<string>("");
  const [selectedOwner, setSelectedOwner] = useState<string>("");

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  // Adjust truncation size based on sidebar state
  const nameTruncateLength = useMemo(() => (isCollapsed ? 30 : 25), [
    isCollapsed,
  ]);
  const orgTruncateLength = useMemo(() => (isCollapsed ? 28 : 22), [
    isCollapsed,
  ]);

  // Apply filters when criteria change
  useEffect(() => {
    const applyFilters = () => {
      let filtered = [...campaigns];

      // Filter by search term
      if (searchTerm) {
        filtered = filtered.filter(
          (campaign) =>
            campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            campaign.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            campaign.organizationName
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
        );
      }

      // Filter by organization
      if (selectedOrganization) {
        filtered = filtered.filter(
          (campaign) => campaign.organizationName === selectedOrganization
        );
      }

      // Filter by status (multiple selection)
      if (selectedStatus.length > 0) {
        filtered = filtered.filter((campaign) =>
          selectedStatus.includes(campaign.status)
        );
      }

      // Filter by start date
      if (startDateFilter) {
        filtered = filtered.filter(
          (campaign) =>
            new Date(campaign.startDate) >= new Date(startDateFilter)
        );
      }

      // Filter by end date
      if (endDateFilter) {
        filtered = filtered.filter(
          (campaign) => new Date(campaign.endDate) <= new Date(endDateFilter)
        );
      }

      // Filter by owner (in a real app, this would filter by the owner property)
      if (selectedOwner) {
        // For demo purposes we're just filtering random campaigns
        // In a real app you would do: campaign.owner === selectedOwner
        filtered = filtered.filter(
          (campaign) =>
            campaign.id.charCodeAt(0) % 10 === selectedOwner.charCodeAt(0) % 10
        );
      }

      // Sort results
      filtered.sort((a, b) => {
        let comparison = 0;

        if (sortField === "startDate") {
          comparison =
            new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        } else if (sortField === "endDate") {
          comparison =
            new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
        } else if (sortField === "budget") {
          comparison = a.budget - b.budget;
        } else if (sortField === "units") {
          comparison = a.units - b.units;
        } else if (sortField === "grossMargin") {
          comparison = a.grossMargin - b.grossMargin;
        } else {
          // Sort by name by default
          comparison = a.name.localeCompare(b.name);
        }

        return sortDirection === "asc" ? comparison : -comparison;
      });

      setFilteredCampaigns(filtered);
    };

    applyFilters();
  }, [
    searchTerm,
    selectedOrganization,
    selectedStatus,
    sortField,
    sortDirection,
    startDateFilter,
    endDateFilter,
    selectedOwner,
    campaigns,
  ]);

  // Handler to change sort field
  const handleSort = (field: string) => {
    if (sortField === field) {
      // If already sorting by this field, change direction
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // If sorting by a new field, set that field and default to descending
      setSortField(field);
      setSortDirection("desc");
    }
  };

  // Function to format currency amounts
  const formatCurrency = (amount: number) => {
    return (
      "$" +
      amount.toLocaleString("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })
    );
  };

  // Function to format numbers
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US").format(num);
  };

  // Function to format dates
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  // Function to truncate text with ellipsis
  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  // Function to get background color based on organization type
  const getOrganizationTypeStyles = (type: string) => {
    switch (type) {
      case "Agency":
        return "bg-blue-50 text-blue-700 border border-blue-100 px-2 py-1 rounded-md text-xs shadow-sm";
      case "Advertiser":
        return "bg-purple-50 text-purple-700 border border-purple-100 px-2 py-1 rounded-md text-xs shadow-sm";
      case "Publisher":
        return "bg-amber-50 text-amber-700 border border-amber-100 px-2 py-1 rounded-md text-xs shadow-sm";
      case "Holding Agency":
        return "bg-orange-50 text-orange-700 border border-orange-100 px-2 py-1 rounded-md text-xs shadow-sm";
      case "Holding Advertiser":
        return "bg-rose-50 text-rose-700 border border-rose-100 px-2 py-1 rounded-md text-xs shadow-sm";
      default:
        return "bg-gray-50 text-gray-700 border border-gray-100 px-2 py-1 rounded-md text-xs shadow-sm";
    }
  };

  // Render loading while authentication loads
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden transition-all duration-300 ease-in-out">
        {/* Header */}
        <Header userName={user?.name || "User"} />

        {/* Main Container */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <div className="container mx-auto transition-all duration-300 ease-in-out">
            <div className="mb-8 flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  Campaigns
                </h1>
                <p className="text-gray-600">
                  Manage all your advertising campaigns in one place
                </p>
              </div>

              {/* New Campaign Button (now in main view) */}
              <Link
                href="/campaigns/new"
                className="flex items-center px-4 py-2.5 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors shadow-md"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                New Campaign
              </Link>
            </div>

            {/* Search Filters */}
            <SearchFilter
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedOrganization={selectedOrganization}
              onOrganizationChange={setSelectedOrganization}
              selectedStatus={selectedStatus}
              onStatusChange={setSelectedStatus}
              campaigns={campaigns}
              startDateFilter={startDateFilter}
              endDateFilter={endDateFilter}
              onStartDateChange={setStartDateFilter}
              onEndDateChange={setEndDateFilter}
              selectedOwner={selectedOwner}
              onOwnerChange={setSelectedOwner}
            />

            {/* Campaigns table with smooth transition */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-6 transition-all duration-300 ease-in-out">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 transition-all duration-300 ease-in-out table-fixed">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-orange-700 transition-colors w-20"
                        onClick={() => handleSort("id")}
                      >
                        <div className="whitespace-nowrap flex items-center">
                          ID
                          {sortField === "id" && (
                            <span className="ml-1">
                              {sortDirection === "asc" ? "↑" : "↓"}
                            </span>
                          )}
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-orange-700 transition-colors w-48"
                        onClick={() => handleSort("name")}
                      >
                        <div className="whitespace-nowrap flex items-center">
                          Campaign
                          {sortField === "name" && (
                            <span className="ml-1">
                              {sortDirection === "asc" ? "↑" : "↓"}
                            </span>
                          )}
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-orange-700 transition-colors w-44"
                        onClick={() => handleSort("organizationName")}
                      >
                        <div className="whitespace-nowrap flex items-center">
                          Organization
                          {sortField === "organizationName" && (
                            <span className="ml-1">
                              {sortDirection === "asc" ? "↑" : "↓"}
                            </span>
                          )}
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-orange-700 transition-colors w-28"
                        onClick={() => handleSort("organizationType")}
                      >
                        <div className="whitespace-nowrap flex items-center">
                          Type
                          {sortField === "organizationType" && (
                            <span className="ml-1">
                              {sortDirection === "asc" ? "↑" : "↓"}
                            </span>
                          )}
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-orange-700 transition-colors w-28"
                        onClick={() => handleSort("startDate")}
                      >
                        <div className="whitespace-nowrap flex items-center">
                          Start Date
                          {sortField === "startDate" && (
                            <span className="ml-1">
                              {sortDirection === "asc" ? "↑" : "↓"}
                            </span>
                          )}
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-orange-700 transition-colors w-24"
                        onClick={() => handleSort("endDate")}
                      >
                        <div className="whitespace-nowrap flex items-center">
                          End Date
                          {sortField === "endDate" && (
                            <span className="ml-1">
                              {sortDirection === "asc" ? "↑" : "↓"}
                            </span>
                          )}
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-orange-700 transition-colors w-24"
                        onClick={() => handleSort("units")}
                      >
                        <div className="whitespace-nowrap flex items-center">
                          Units
                          {sortField === "units" && (
                            <span className="ml-1">
                              {sortDirection === "asc" ? "↑" : "↓"}
                            </span>
                          )}
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-orange-700 transition-colors w-24"
                        onClick={() => handleSort("budget")}
                      >
                        <div className="whitespace-nowrap flex items-center">
                          Budget
                          {sortField === "budget" && (
                            <span className="ml-1">
                              {sortDirection === "asc" ? "↑" : "↓"}
                            </span>
                          )}
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-orange-700 transition-colors w-20"
                        onClick={() => handleSort("grossMargin")}
                      >
                        <div className="whitespace-nowrap flex items-center">
                          % GM
                          {sortField === "grossMargin" && (
                            <span className="ml-1">
                              {sortDirection === "asc" ? "↑" : "↓"}
                            </span>
                          )}
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-orange-700 transition-colors w-28"
                        onClick={() => handleSort("status")}
                      >
                        <div className="whitespace-nowrap flex items-center">
                          Status
                          {sortField === "status" && (
                            <span className="ml-1">
                              {sortDirection === "asc" ? "↑" : "↓"}
                            </span>
                          )}
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {filteredCampaigns.map((campaign) => (
                      <tr
                        key={campaign.id}
                        className="hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => router.push(`/campaigns/${campaign.id}`)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                          {campaign.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-orange-600 hover:text-orange-800 max-w-[12rem] overflow-hidden transition-all duration-300 ease-in-out">
                          <span
                            title={campaign.name}
                            className="hover:underline"
                          >
                            {truncateText(campaign.name, nameTruncateLength)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 max-w-[14rem] overflow-hidden transition-all duration-300 ease-in-out">
                          <span title={campaign.organizationName}>
                            {truncateText(
                              campaign.organizationName,
                              orgTruncateLength
                            )}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={getOrganizationTypeStyles(
                              campaign.organizationType
                            )}
                          >
                            {campaign.organizationType}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {formatDate(campaign.startDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {formatDate(campaign.endDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {formatNumber(campaign.units)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                          {formatCurrency(campaign.budget)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {campaign.grossMargin.toFixed(1)}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={campaign.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 transition-all duration-300 ease-in-out">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    Previous
                  </button>
                  <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">1</span> to{" "}
                      <span className="font-medium">
                        {filteredCampaigns.length}
                      </span>{" "}
                      of{" "}
                      <span className="font-medium">
                        {filteredCampaigns.length}
                      </span>{" "}
                      results
                    </p>
                  </div>
                  <div>
                    <nav
                      className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                      aria-label="Pagination"
                    >
                      <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                        <span className="sr-only">Previous</span>
                        &laquo;
                      </button>
                      <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-orange-600 hover:bg-orange-50">
                        1
                      </button>
                      <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                        <span className="sr-only">Next</span>
                        &raquo;
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
