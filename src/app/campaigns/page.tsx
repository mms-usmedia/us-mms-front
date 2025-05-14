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
    | "Agencia"
    | "Advertiser"
    | "Publisher"
    | "Holding Agency"
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
    id: "23810",
    name: "LiveNation_Brasil_Bad Bunny_Vevo_MaioJunho25",
    organizationName: "Live Nation Brasil Entretenimento LTDA",
    organizationType: "Advertiser",
    startDate: "2025-05-13",
    endDate: "2025-06-11",
    status: "Approved",
    units: 150000,
    budget: 75000,
    grossMargin: 28.5,
  },
  {
    id: "23809",
    name: "Alpura_Deslactosada_Podcast ads_Mex_Jun25",
    organizationName: "Havas Media Mexico City",
    organizationType: "Agencia",
    startDate: "2025-06-01",
    endDate: "2025-06-30",
    status: "Live",
    units: 85000,
    budget: 32000,
    grossMargin: 22.7,
  },
  {
    id: "23808",
    name: "Embratur_Americas_August_2025_Sojem",
    organizationName: "CALIA Y2 PROPAGANDA E MARKETING LTDA",
    organizationType: "Agencia",
    startDate: "2025-08-01",
    endDate: "2025-08-31",
    status: "Pending",
    units: 210000,
    budget: 95000,
    grossMargin: 31.2,
  },
  {
    id: "23807",
    name: "Embratur_Americas_July_2025_Sojem",
    organizationName: "CALIA Y2 PROPAGANDA E MARKETING LTDA",
    organizationType: "Agencia",
    startDate: "2025-07-01",
    endDate: "2025-07-31",
    status: "Negotiating",
    units: 195000,
    budget: 87500,
    grossMargin: 29.8,
  },
  {
    id: "23806",
    name: "Embratur_Americas_June_2025_Sojem",
    organizationName: "CALIA Y2 PROPAGANDA E MARKETING LTDA",
    organizationType: "Agencia",
    startDate: "2025-06-01",
    endDate: "2025-06-30",
    status: "Won",
    units: 180000,
    budget: 82000,
    grossMargin: 27.5,
  },
  {
    id: "23805",
    name: "Banco_Itau_Chile_Personal_Bank_Mayo_2025_LinkedIn",
    organizationName: "Omnet Chile",
    organizationType: "Agencia",
    startDate: "2025-05-09",
    endDate: "2025-05-31",
    status: "Invoiced",
    units: 45000,
    budget: 22000,
    grossMargin: 18.9,
  },
  {
    id: "23804",
    name: "Nintendo_Hardware focus CGI_Q1_Platforms & FITO_Bra_Chi_Mex_Col_Per_Vevo_May24_June25",
    organizationName: "Omnet Latin America LLC",
    organizationType: "Agencia",
    startDate: "2025-05-12",
    endDate: "2025-06-30",
    status: "Materials & Creatives OK",
    units: 320000,
    budget: 175000,
    grossMargin: 32.4,
  },
  {
    id: "23802",
    name: "MB_MODEL LinkedIn_Mex_Mayo 25",
    organizationName: "OMD Mexico",
    organizationType: "Agencia",
    startDate: "2025-05-09",
    endDate: "2025-05-31",
    status: "Implementation",
    units: 38000,
    budget: 20000,
    grossMargin: 25.0,
  },
  {
    id: "23801",
    name: "Claro_Colombia_EquiposPost_Pinterest_mayo_2025",
    organizationName: "Havas Media Colombia",
    organizationType: "Agencia",
    startDate: "2025-05-09",
    endDate: "2025-05-31",
    status: "Closed",
    units: 56000,
    budget: 29500,
    grossMargin: 24.2,
  },
  {
    id: "23800",
    name: "Vevo_Falabella_Tienda Americanino_Chile_May25",
    organizationName: "Vevo LLC",
    organizationType: "Publisher",
    startDate: "2025-05-14",
    endDate: "2025-05-27",
    status: "HUR",
    units: 42000,
    budget: 18500,
    grossMargin: 21.8,
  },
  {
    id: "23799",
    name: "Prototype_Dia del Padre_TikTok_Arg_MayJune25",
    organizationName: "EJE PUBLICITARIA SOCIEDAD ANONIMA",
    organizationType: "Advertiser",
    startDate: "2025-05-24",
    endDate: "2025-06-15",
    status: "Pending",
    units: 75000,
    budget: 38000,
    grossMargin: 26.3,
  },
  {
    id: "23797",
    name: "Renault_CO_Brand_Everyone_Mayo_25_Vevo",
    organizationName: "OMD Colombia - Bogota",
    organizationType: "Agencia",
    startDate: "2025-05-08",
    endDate: "2025-05-31",
    status: "Live",
    units: 68000,
    budget: 35000,
    grossMargin: 27.2,
  },
  {
    id: "23796",
    name: "FANDOM | MAX (ARG) | FINAL | Mayo 25",
    organizationName: "Fandom",
    organizationType: "Publisher",
    startDate: "2025-05-19",
    endDate: "2025-06-25",
    status: "Implementation",
    units: 110000,
    budget: 52000,
    grossMargin: 29.6,
  },
  {
    id: "23795",
    name: "Banorte_Nomina_LinkedIn_Mex_Mayo25",
    organizationName: "Havas Media Mexico City",
    organizationType: "Agencia",
    startDate: "2025-05-07",
    endDate: "2025-05-31",
    status: "Negotiating",
    units: 65000,
    budget: 31000,
    grossMargin: 23.8,
  },
  {
    id: "23794",
    name: "Mercedes Benz_GLE 400 EQ TECH_CONSIDER_LinkedIn_Mex_Mayo25",
    organizationName: "OMD Mexico",
    organizationType: "Holding Agency",
    startDate: "2025-05-07",
    endDate: "2025-05-31",
    status: "Pending",
    units: 125000,
    budget: 67000,
    grossMargin: 33.5,
  },
];

export default function CampaignsListPage() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useAuth();
  const { isCollapsed } = useSidebar();
  const [campaigns] = useState<Campaign[]>(mockCampaigns);
  const [filteredCampaigns, setFilteredCampaigns] =
    useState<Campaign[]>(mockCampaigns);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrganization, setSelectedOrganization] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
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
  const nameTruncateLength = useMemo(
    () => (isCollapsed ? 30 : 25),
    [isCollapsed]
  );
  const orgTruncateLength = useMemo(
    () => (isCollapsed ? 28 : 22),
    [isCollapsed]
  );

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

      // Filter by status
      if (selectedStatus) {
        filtered = filtered.filter(
          (campaign) => campaign.status === selectedStatus
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
      case "Agencia":
        return "bg-blue-50 text-blue-700 border border-blue-100 px-2 py-1 rounded-md text-xs shadow-sm";
      case "Advertiser":
        return "bg-purple-50 text-purple-700 border border-purple-100 px-2 py-1 rounded-md text-xs shadow-sm";
      case "Publisher":
        return "bg-amber-50 text-amber-700 border border-amber-100 px-2 py-1 rounded-md text-xs shadow-sm";
      case "Holding Agency":
        return "bg-indigo-50 text-indigo-700 border border-indigo-100 px-2 py-1 rounded-md text-xs shadow-sm";
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
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
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
                className="flex items-center px-4 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors shadow-md"
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
                        className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-indigo-700 transition-colors w-20"
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
                        className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-indigo-700 transition-colors w-48"
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
                        className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-indigo-700 transition-colors w-44"
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
                        className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-indigo-700 transition-colors w-28"
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
                        className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-indigo-700 transition-colors w-28"
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
                        className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-indigo-700 transition-colors w-24"
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
                        className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-indigo-700 transition-colors w-24"
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
                        className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-indigo-700 transition-colors w-24"
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
                        className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-indigo-700 transition-colors w-20"
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
                        className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-indigo-700 transition-colors w-28"
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600 hover:text-indigo-800 max-w-[12rem] overflow-hidden transition-all duration-300 ease-in-out">
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
                      <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-indigo-600 hover:bg-indigo-50">
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
