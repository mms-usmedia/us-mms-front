import React, { useState } from "react";
import { HURStatus } from "./mockData";

interface SearchFilterProps {
  onSearch: (query: string) => void;
  onStatusFilter: (status: HURStatus[] | "All") => void;
  onMediaTypeFilter: (mediaType: string[] | "All") => void;
  onBillingOfficeFilter: (office: string[] | "All") => void;
}

const SearchFilter: React.FC<SearchFilterProps> = ({
  onSearch,
  onStatusFilter,
  onMediaTypeFilter,
  onBillingOfficeFilter,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<HURStatus[]>([]);
  const [selectedMediaTypes, setSelectedMediaTypes] = useState<string[]>([]);
  const [selectedBillingOffices, setSelectedBillingOffices] = useState<
    string[]
  >([]);
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch(searchQuery);
    }
  };

  const handleStatusChange = (status: HURStatus) => {
    let newSelectedStatuses;
    if (selectedStatuses.includes(status)) {
      newSelectedStatuses = selectedStatuses.filter((s) => s !== status);
    } else {
      newSelectedStatuses = [...selectedStatuses, status];
    }
    setSelectedStatuses(newSelectedStatuses);
    onStatusFilter(
      newSelectedStatuses.length > 0 ? newSelectedStatuses : "All"
    );
  };

  const handleMediaTypeChange = (mediaType: string) => {
    let newSelectedMediaTypes;
    if (selectedMediaTypes.includes(mediaType)) {
      newSelectedMediaTypes = selectedMediaTypes.filter((m) => m !== mediaType);
    } else {
      newSelectedMediaTypes = [...selectedMediaTypes, mediaType];
    }
    setSelectedMediaTypes(newSelectedMediaTypes);
    onMediaTypeFilter(
      newSelectedMediaTypes.length > 0 ? newSelectedMediaTypes : "All"
    );
  };

  const handleBillingOfficeChange = (office: string) => {
    let newSelectedBillingOffices;
    if (selectedBillingOffices.includes(office)) {
      newSelectedBillingOffices = selectedBillingOffices.filter(
        (o) => o !== office
      );
    } else {
      newSelectedBillingOffices = [...selectedBillingOffices, office];
    }
    setSelectedBillingOffices(newSelectedBillingOffices);
    onBillingOfficeFilter(
      newSelectedBillingOffices.length > 0 ? newSelectedBillingOffices : "All"
    );
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedStatuses([]);
    setSelectedMediaTypes([]);
    setSelectedBillingOffices([]);
    onSearch("");
    onStatusFilter("All");
    onMediaTypeFilter("All");
    onBillingOfficeFilter("All");
  };

  const statuses: HURStatus[] = [
    "Review",
    "More Info",
    "Approved",
    "Remove Invoice",
    "Re-open Campaign",
    "Editing",
    "Close Campaign",
    "Close Invoice Period",
    "Not Approved",
    "Completed",
  ];

  const mediaTypes = ["Online", "Print", "Broadcast", "Out of Home"];
  const billingOffices = ["Miami", "Mexico"];

  // Check if there are any active filters
  const hasActiveFilters =
    searchQuery ||
    selectedStatuses.length > 0 ||
    selectedMediaTypes.length > 0 ||
    selectedBillingOffices.length > 0;

  // Get color for status badge
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Review":
        return "bg-amber-50 text-amber-700 border-amber-100";
      case "More Info":
        return "bg-blue-50 text-blue-700 border-blue-100";
      case "Approved":
        return "bg-green-50 text-green-700 border-green-100";
      case "Remove Invoice":
        return "bg-teal-50 text-teal-700 border-teal-100";
      case "Re-open Campaign":
        return "bg-cyan-50 text-cyan-700 border-cyan-100";
      case "Editing":
        return "bg-violet-50 text-violet-700 border-violet-100";
      case "Close Campaign":
        return "bg-gray-50 text-gray-700 border-gray-100";
      case "Close Invoice Period":
        return "bg-rose-50 text-rose-700 border-rose-100";
      case "Not Approved":
        return "bg-red-50 text-red-700 border-red-100";
      case "Completed":
        return "bg-purple-50 text-purple-700 border-purple-100";
      default:
        return "bg-gray-50 text-gray-700 border-gray-100";
    }
  };

  // Get color for media type badge
  const getMediaTypeColor = (mediaType: string) => {
    switch (mediaType) {
      case "Online":
        return "bg-blue-50 text-blue-700 border-blue-100";
      case "Print":
        return "bg-purple-50 text-purple-700 border-purple-100";
      case "Broadcast":
        return "bg-pink-50 text-pink-700 border-pink-100";
      case "Out of Home":
        return "bg-amber-50 text-amber-700 border-amber-100";
      default:
        return "bg-gray-50 text-gray-700 border-gray-100";
    }
  };

  // Get color for billing office badge
  const getBillingOfficeColor = (office: string) => {
    switch (office) {
      case "Miami":
        return "bg-orange-50 text-orange-700 border-orange-100";
      case "Mexico":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      default:
        return "bg-gray-50 text-gray-700 border-gray-100";
    }
  };

  // Calculate total active filters
  const totalActiveFilters =
    (searchQuery ? 1 : 0) +
    selectedStatuses.length +
    selectedMediaTypes.length +
    selectedBillingOffices.length;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
      <div className="flex flex-col space-y-4">
        {/* Main search bar and filters button */}
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm text-gray-900 placeholder-gray-500 bg-gray-50"
              placeholder="Search by campaign name, ID, or requester..."
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center px-3 py-2.5 rounded-lg shadow-sm border ${
              showFilters
                ? "bg-orange-50 text-orange-700 border-orange-200"
                : "bg-white text-orange-600 border-gray-200 hover:bg-gray-50"
            }`}
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
                {totalActiveFilters}
              </span>
            )}
          </button>

          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              type="button"
              className="flex items-center px-3 py-2.5 rounded-lg border border-gray-200 shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
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

        {/* Advanced filters (hidden by default) */}
        {showFilters && (
          <div className="grid grid-cols-1 gap-4 pt-4 border-t border-gray-100 mt-2">
            {/* Status filter */}
            <div>
              <label
                htmlFor="status-filter"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Status
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {statuses.map((status) => (
                  <div
                    key={status}
                    className={`cursor-pointer rounded-md px-3 py-1.5 text-sm border ${
                      selectedStatuses.includes(status)
                        ? getStatusColor(status)
                        : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                    onClick={() => handleStatusChange(status)}
                  >
                    {status}
                    {selectedStatuses.includes(status) && (
                      <span className="ml-1.5 inline-block">✓</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Media Type filter */}
            <div>
              <label
                htmlFor="media-type-filter"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Media Type
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {mediaTypes.map((mediaType) => (
                  <div
                    key={mediaType}
                    className={`cursor-pointer rounded-md px-3 py-1.5 text-sm border ${
                      selectedMediaTypes.includes(mediaType)
                        ? getMediaTypeColor(mediaType)
                        : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                    onClick={() => handleMediaTypeChange(mediaType)}
                  >
                    {mediaType}
                    {selectedMediaTypes.includes(mediaType) && (
                      <span className="ml-1.5 inline-block">✓</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Billing Office filter */}
            <div>
              <label
                htmlFor="billing-office-filter"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Billing Office
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {billingOffices.map((office) => (
                  <div
                    key={office}
                    className={`cursor-pointer rounded-md px-3 py-1.5 text-sm border ${
                      selectedBillingOffices.includes(office)
                        ? getBillingOfficeColor(office)
                        : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                    onClick={() => handleBillingOfficeChange(office)}
                  >
                    {office}
                    {selectedBillingOffices.includes(office) && (
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
  );
};

export default SearchFilter;
