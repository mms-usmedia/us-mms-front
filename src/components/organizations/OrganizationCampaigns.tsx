// /src/components/organizations/OrganizationCampaigns.tsx

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FaSearch,
  FaCalendarAlt,
  FaFilter,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaTimes,
} from "react-icons/fa";
import StatusBadge from "@/components/ui/StatusBadge";

// Define Campaign interface
interface Campaign {
  id: string;
  name: string;
  organizationId: string;
  organizationName: string;
  organizationType: string;
  budget: number;
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
  grossMargin: number;
}

interface OrganizationCampaignsProps {
  organizationId: string;
}

// Example campaigns for the organization
const getMockCampaigns = (organizationId: string): Campaign[] => {
  return [
    {
      id: "23808",
      name: "Summer Promotional Campaign 2025",
      organizationId,
      organizationName: "OMD Mexico",
      organizationType: "Agency",
      budget: 120000,
      startDate: "2025-06-01",
      endDate: "2025-08-31",
      status: "Live",
      units: 15000,
      grossMargin: 25,
    },
    {
      id: "23807",
      name: "Website Retargeting Q1 2025",
      organizationId,
      organizationName: "OMD Mexico",
      organizationType: "Agency",
      budget: 45000,
      startDate: "2025-01-15",
      endDate: "2025-03-31",
      status: "Closed",
      units: 8000,
      grossMargin: 22,
    },
    {
      id: "23809",
      name: "Holiday Season Special 2024",
      organizationId,
      organizationName: "OMD Mexico",
      organizationType: "Agency",
      budget: 85000,
      startDate: "2024-11-20",
      endDate: "2024-12-31",
      status: "Invoiced",
      units: 12000,
      grossMargin: 30,
    },
    {
      id: "23800",
      name: "Brand Awareness 2025",
      organizationId,
      organizationName: "OMD Mexico",
      organizationType: "Agency",
      budget: 200000,
      startDate: "2025-02-01",
      endDate: "2025-12-31",
      status: "Approved",
      units: 24000,
      grossMargin: 18,
    },
    {
      id: "23801",
      name: "New Product Launch Campaign",
      organizationId,
      organizationName: "OMD Mexico",
      organizationType: "Agency",
      budget: 150000,
      startDate: "2025-04-15",
      endDate: "2025-07-15",
      status: "Implementation",
      units: 18000,
      grossMargin: 28,
    },
  ];
};

const OrganizationCampaigns: React.FC<OrganizationCampaignsProps> = ({
  organizationId,
}) => {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");
  const [sortField, setSortField] = useState<keyof Campaign>("startDate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [showFilters, setShowFilters] = useState<boolean>(false);

  // Load campaigns
  useEffect(() => {
    // In a real scenario, this would fetch data from an API
    const mockCampaigns = getMockCampaigns(organizationId);
    setCampaigns(mockCampaigns);
  }, [organizationId]);

  // Handle search and filtering
  const filteredCampaigns = campaigns
    .filter(
      (campaign) =>
        campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.id.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((campaign) =>
      selectedStatus.length > 0
        ? selectedStatus.includes(campaign.status)
        : true
    )
    .filter((campaign) =>
      startDateFilter ? campaign.startDate >= startDateFilter : true
    )
    .filter((campaign) =>
      endDateFilter ? campaign.endDate <= endDateFilter : true
    )
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      // Handle different types of values
      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }

      // Fallback to string comparison
      return sortDirection === "asc"
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });

  // Handle sort toggle
  const handleSort = (field: keyof Campaign) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return (
      "$" +
      amount.toLocaleString("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })
    );
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  // Format number
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US").format(num);
  };

  // Status options for filter
  const statusOptions = [
    "Pending",
    "Negotiating",
    "Won",
    "Approved",
    "Materials & Creatives OK",
    "Implementation",
    "Live",
    "Closed",
    "HUR",
    "Invoiced",
  ];

  // Function to get sort icon
  const getSortIcon = (field: keyof Campaign) => {
    if (sortField !== field)
      return <FaSort className="h-3 w-3 text-gray-400" />;
    if (sortDirection === "asc") return <FaSortUp className="h-3 w-3" />;
    return <FaSortDown className="h-3 w-3" />;
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedStatus([]);
    setStartDateFilter("");
    setEndDateFilter("");
  };

  // Check if there are any active filters
  const hasActiveFilters =
    searchTerm || selectedStatus.length > 0 || startDateFilter || endDateFilter;

  // Get color for status badge
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-amber-50 text-amber-700 border-amber-100";
      case "Negotiating":
        return "bg-blue-50 text-blue-700 border-blue-100";
      case "Won":
        return "bg-indigo-50 text-indigo-700 border-indigo-100";
      case "Approved":
        return "bg-green-50 text-green-700 border-green-100";
      case "Materials & Creatives OK":
        return "bg-teal-50 text-teal-700 border-teal-100";
      case "Implementation":
        return "bg-cyan-50 text-cyan-700 border-cyan-100";
      case "Live":
        return "bg-violet-50 text-violet-700 border-violet-100";
      case "Closed":
        return "bg-gray-50 text-gray-700 border-gray-100";
      case "HUR":
        return "bg-rose-50 text-rose-700 border-rose-100";
      case "Invoiced":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      default:
        return "bg-gray-50 text-gray-700 border-gray-100";
    }
  };

  return (
    <div className="bg-white shadow-sm rounded-lg">
      {/* Filter section - new modern style */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col space-y-4">
          {/* Main search bar and filters button */}
          <div className="flex space-x-2">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 placeholder-gray-500 bg-gray-50"
                placeholder="Search by name or ID..."
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center px-3 py-2.5 rounded-lg shadow-sm border ${
                showFilters
                  ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
              }`}
            >
              <FaFilter className="h-5 w-5 mr-1" />
              Filters
              {hasActiveFilters && (
                <span className="ml-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 text-xs font-medium text-indigo-800">
                  {(searchTerm ? 1 : 0) +
                    (selectedStatus.length > 0 ? 1 : 0) +
                    (startDateFilter ? 1 : 0) +
                    (endDateFilter ? 1 : 0)}
                </span>
              )}
            </button>

            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                type="button"
                className="flex items-center px-3 py-2.5 rounded-lg border border-gray-200 shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <FaTimes className="h-4 w-4 mr-1" />
                Clear
              </button>
            )}
          </div>

          {/* Advanced filters (hidden by default) */}
          {showFilters && (
            <div className="grid grid-cols-1 gap-4 pt-4 border-t border-gray-100 mt-2">
              {/* Date filters */}
              <div>
                <label
                  htmlFor="date-filter"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Date Range
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaCalendarAlt className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="date"
                      id="start-date"
                      value={startDateFilter}
                      onChange={(e) => setStartDateFilter(e.target.value)}
                      className="block w-full pl-10 px-3 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 bg-gray-50"
                      placeholder="Start date"
                    />
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaCalendarAlt className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="date"
                      id="end-date"
                      value={endDateFilter}
                      onChange={(e) => setEndDateFilter(e.target.value)}
                      className="block w-full pl-10 px-3 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 bg-gray-50"
                      placeholder="End date"
                    />
                  </div>
                </div>
              </div>

              {/* Filter by campaign status */}
              <div>
                <label
                  htmlFor="status-filter"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Status
                </label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  {statusOptions.map((status) => (
                    <div
                      key={status}
                      className={`cursor-pointer rounded-md px-3 py-1.5 text-sm border ${
                        selectedStatus.includes(status)
                          ? getStatusColor(status)
                          : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                      onClick={() => {
                        if (selectedStatus.includes(status)) {
                          setSelectedStatus(
                            selectedStatus.filter((s) => s !== status)
                          );
                        } else {
                          setSelectedStatus([...selectedStatus, status]);
                        }
                      }}
                    >
                      {status}
                      {selectedStatus.includes(status) && (
                        <span className="ml-1.5 inline-block">✓</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Campaigns table */}
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
                  ID {getSortIcon("id")}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-indigo-700 transition-colors w-48"
                onClick={() => handleSort("name")}
              >
                <div className="whitespace-nowrap flex items-center">
                  Campaign {getSortIcon("name")}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-indigo-700 transition-colors w-28"
                onClick={() => handleSort("startDate")}
              >
                <div className="whitespace-nowrap flex items-center">
                  Start Date {getSortIcon("startDate")}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-indigo-700 transition-colors w-24"
                onClick={() => handleSort("endDate")}
              >
                <div className="whitespace-nowrap flex items-center">
                  End Date {getSortIcon("endDate")}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-indigo-700 transition-colors w-24"
                onClick={() => handleSort("units")}
              >
                <div className="whitespace-nowrap flex items-center">
                  Units {getSortIcon("units")}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-indigo-700 transition-colors w-24"
                onClick={() => handleSort("budget")}
              >
                <div className="whitespace-nowrap flex items-center">
                  Budget {getSortIcon("budget")}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-indigo-700 transition-colors w-20"
                onClick={() => handleSort("grossMargin")}
              >
                <div className="whitespace-nowrap flex items-center">
                  % GM {getSortIcon("grossMargin")}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-indigo-700 transition-colors w-28"
                onClick={() => handleSort("status")}
              >
                <div className="whitespace-nowrap flex items-center">
                  Status {getSortIcon("status")}
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {filteredCampaigns.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-6 py-8 text-sm text-gray-500 text-center"
                >
                  No campaigns found for this organization with the selected
                  filters.
                </td>
              </tr>
            ) : (
              filteredCampaigns.map((campaign) => (
                <tr
                  key={campaign.id}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => router.push(`/campaigns/${campaign.id}`)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                    {campaign.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600 hover:text-indigo-800">
                    {campaign.name}
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
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrganizationCampaigns;
