import React, { useState, useEffect, useRef } from "react";

// Type for organizations
type OrganizationType =
  | "Agency"
  | "Advertiser"
  | "Publisher"
  | "Holding Agency"
  | "Holding Advertiser"
  | "Direct";

// Type for campaigns
interface Campaign {
  id: string;
  name: string;
  organizationName: string;
  organizationType: OrganizationType;
  startDate: string;
  endDate: string;
  status: string;
  units: number;
  budget: number;
  grossMargin: number;
  owner?: string; // Optional owner field
}

interface TraffickerReportFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedOrganization: string;
  onOrganizationChange: (value: string) => void;
  campaigns: Campaign[];
  startDateFilter?: string;
  endDateFilter?: string;
  onStartDateChange?: (value: string) => void;
  onEndDateChange?: (value: string) => void;
  selectedOwner?: string;
  onOwnerChange?: (value: string) => void;
}

const TraffickerReportFilter: React.FC<TraffickerReportFilterProps> = ({
  searchTerm,
  onSearchChange,
  selectedOrganization,
  onOrganizationChange,
  campaigns,
  startDateFilter = "",
  endDateFilter = "",
  onStartDateChange = () => {},
  onEndDateChange = () => {},
  selectedOwner = "",
  onOwnerChange = () => {},
}) => {
  // Extract unique organizations from campaigns
  const [organizations, setOrganizations] = useState<string[]>([]);
  const [orgSearchTerm, setOrgSearchTerm] = useState<string>("");
  const [showOrgDropdown, setShowOrgDropdown] = useState<boolean>(false);
  const [filteredOrganizations, setFilteredOrganizations] = useState<string[]>(
    []
  );
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Owner filter state
  const [owners, setOwners] = useState<string[]>([]);
  const [ownerSearchTerm, setOwnerSearchTerm] = useState<string>("");
  const [showOwnerDropdown, setShowOwnerDropdown] = useState<boolean>(false);
  const [filteredOwners, setFilteredOwners] = useState<string[]>([]);
  const ownerDropdownRef = useRef<HTMLDivElement>(null);

  // Initialize organizations and owners when component mounts or campaigns change
  useEffect(() => {
    // Sample campaign owners (en una app real, esto vendría de los datos)
    const sampleOwners = [
      "John Smith",
      "Maria Garcia",
      "David Johnson",
      "Sofia Rodriguez",
      "Michael Brown",
      "Emma Martinez",
      "James Wilson",
      "Isabella Lopez",
      "Robert Taylor",
      "Olivia Lee",
    ];

    // Get unique organization names
    const uniqueOrganizations = Array.from(
      new Set(campaigns.map((campaign) => campaign.organizationName))
    ).sort();

    setOrganizations(uniqueOrganizations);
    setFilteredOrganizations(uniqueOrganizations);

    // Set sample owners (in a real app, you would extract from campaigns)
    setOwners(sampleOwners);
    setFilteredOwners(sampleOwners);
  }, [campaigns]);

  // Filter organizations when typing in search field
  useEffect(() => {
    if (orgSearchTerm) {
      const filtered = organizations.filter((org) =>
        org.toLowerCase().includes(orgSearchTerm.toLowerCase())
      );
      setFilteredOrganizations(filtered);
    } else {
      setFilteredOrganizations(organizations);
    }
  }, [orgSearchTerm, organizations]);

  // Filter owners when typing in search field
  useEffect(() => {
    if (ownerSearchTerm) {
      const filtered = owners.filter((owner) =>
        owner.toLowerCase().includes(ownerSearchTerm.toLowerCase())
      );
      setFilteredOwners(filtered);
    } else {
      setFilteredOwners(owners);
    }
  }, [ownerSearchTerm, owners]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowOrgDropdown(false);
      }

      if (
        ownerDropdownRef.current &&
        !ownerDropdownRef.current.contains(event.target as Node)
      ) {
        setShowOwnerDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Function to clear all filters
  const handleClearFilters = () => {
    onSearchChange("");
    onOrganizationChange("");
    setOrgSearchTerm("");
    onStartDateChange("");
    onEndDateChange("");
    onOwnerChange("");
    setOwnerSearchTerm("");
  };

  // Check if there are any active filters
  const hasActiveFilters =
    searchTerm ||
    selectedOrganization ||
    startDateFilter ||
    endDateFilter ||
    selectedOwner;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
      <div className="flex flex-col space-y-4">
        {/* Search and Filter Toggle */}
        <div className="flex items-center space-x-2">
          {/* Search Input */}
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
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm text-gray-900 placeholder-gray-500 bg-gray-50"
              placeholder="Search campaigns by name, advertiser, ID..."
            />
          </div>

          {/* Filter Toggle Button */}
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
                {(searchTerm ? 1 : 0) +
                  (selectedOrganization ? 1 : 0) +
                  (startDateFilter || endDateFilter ? 1 : 0) +
                  (selectedOwner ? 1 : 0)}
              </span>
            )}
          </button>

          {/* Clear Filters Button */}
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

        {/* Expanded Filter Options */}
        {showFilters && (
          <div className="grid grid-cols-1 gap-4 pt-4 border-t border-gray-100 mt-2">
            {/* Top row filters: Organization, Date Range, Owner */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Filter by organization */}
              <div className="relative" ref={dropdownRef}>
                <label
                  htmlFor="organization-search"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Organization
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="organization-search"
                    className="block w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm text-gray-900 bg-gray-50"
                    placeholder="Select or search organization"
                    value={orgSearchTerm}
                    onChange={(e) => setOrgSearchTerm(e.target.value)}
                    onFocus={() => setShowOrgDropdown(true)}
                    readOnly={!!selectedOrganization}
                  />
                  {selectedOrganization && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <button
                        type="button"
                        onClick={() => {
                          onOrganizationChange("");
                          setOrgSearchTerm("");
                        }}
                        className="text-gray-400 hover:text-gray-500 focus:outline-none"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>

                {/* Organizations dropdown */}
                {showOrgDropdown && !selectedOrganization && (
                  <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm border border-gray-200">
                    <div className="px-2 py-1 bg-gray-50 text-xs font-medium text-gray-500">
                      {filteredOrganizations.length} organizations found
                    </div>
                    {filteredOrganizations.length === 0 ? (
                      <div className="text-gray-500 text-sm px-4 py-2">
                        No organizations found
                      </div>
                    ) : (
                      filteredOrganizations.map((org) => (
                        <div
                          key={org}
                          className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-50 text-gray-900 text-sm"
                          onClick={() => {
                            onOrganizationChange(org);
                            setOrgSearchTerm(org);
                            setShowOrgDropdown(false);
                          }}
                        >
                          {org}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Filter by date range */}
              <div>
                <label
                  htmlFor="date-filter"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Date Range
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label htmlFor="start-date" className="sr-only">
                      Start Date
                    </label>
                    <input
                      type="date"
                      id="start-date"
                      value={startDateFilter}
                      onChange={(e) => onStartDateChange(e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm text-gray-900 bg-gray-50"
                      placeholder="Start date"
                    />
                  </div>
                  <div>
                    <label htmlFor="end-date" className="sr-only">
                      End Date
                    </label>
                    <input
                      type="date"
                      id="end-date"
                      value={endDateFilter}
                      onChange={(e) => onEndDateChange(e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm text-gray-900 bg-gray-50"
                      placeholder="End date"
                    />
                  </div>
                </div>
              </div>

              {/* Filter by campaign owner */}
              <div className="relative" ref={ownerDropdownRef}>
                <label
                  htmlFor="owner-search"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Campaign Owner
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="owner-search"
                    className="block w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm text-gray-900 bg-gray-50"
                    placeholder="Select campaign owner"
                    value={ownerSearchTerm}
                    onChange={(e) => setOwnerSearchTerm(e.target.value)}
                    onFocus={() => setShowOwnerDropdown(true)}
                    readOnly={!!selectedOwner}
                  />
                  {selectedOwner && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <button
                        type="button"
                        onClick={() => {
                          onOwnerChange("");
                          setOwnerSearchTerm("");
                        }}
                        className="text-gray-400 hover:text-gray-500 focus:outline-none"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>

                {/* Owners dropdown */}
                {showOwnerDropdown && !selectedOwner && (
                  <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm border border-gray-200">
                    <div className="px-2 py-1 bg-gray-50 text-xs font-medium text-gray-500">
                      {filteredOwners.length} owners found
                    </div>
                    {filteredOwners.length === 0 ? (
                      <div className="text-gray-500 text-sm px-4 py-2">
                        No owners found
                      </div>
                    ) : (
                      filteredOwners.map((owner) => (
                        <div
                          key={owner}
                          className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-50 text-gray-900 text-sm"
                          onClick={() => {
                            onOwnerChange(owner);
                            setOwnerSearchTerm(owner);
                            setShowOwnerDropdown(false);
                          }}
                        >
                          {owner}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TraffickerReportFilter;
