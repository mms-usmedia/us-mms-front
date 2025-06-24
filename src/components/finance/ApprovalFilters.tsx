import React, { useState, useRef, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  X,
  Calendar,
  ChevronDown,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ApprovalFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedStatus: string[];
  onStatusChange: (value: string[]) => void;
  selectedTypes: string[];
  onTypesChange: (value: string[]) => void;
}

const ApprovalFilters: React.FC<ApprovalFiltersProps> = ({
  searchTerm,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  selectedTypes,
  onTypesChange,
}) => {
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [countrySearchTerm, setCountrySearchTerm] = useState<string>("");
  const [filteredCountries, setFilteredCountries] = useState<string[]>([]);
  const [showCountryDropdown, setShowCountryDropdown] =
    useState<boolean>(false);
  const countryDropdownRef = useRef<HTMLDivElement>(null);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [hasMissingInfo, setHasMissingInfo] = useState<boolean | null>(null);
  const [hasCompleteInfo, setHasCompleteInfo] = useState<boolean | null>(null);

  // Available statuses
  const statuses = ["Pending", "Rejected"];

  // Available organization types
  const types = [
    "Agency",
    "Advertiser",
    "Publisher",
    "Holding Agency",
    "Holding Advertiser",
  ];

  // Available countries
  const countries = useMemo(
    () => [
      "Argentina",
      "Brazil",
      "Chile",
      "Colombia",
      "Mexico",
      "Peru",
      "United States",
      "Canada",
      "Spain",
      "France",
      "Germany",
      "United Kingdom",
      "Italy",
      "Portugal",
      "Netherlands",
      "Belgium",
      "Switzerland",
    ],
    []
  );

  // Initialize filtered countries
  useEffect(() => {
    setFilteredCountries(countries);
  }, [countries]);

  // Filter countries when typing in search field
  useEffect(() => {
    if (countrySearchTerm) {
      const filtered = countries.filter((country) =>
        country.toLowerCase().includes(countrySearchTerm.toLowerCase())
      );
      setFilteredCountries(filtered);
    } else {
      setFilteredCountries(countries);
    }
  }, [countrySearchTerm, countries]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        countryDropdownRef.current &&
        !countryDropdownRef.current.contains(event.target as Node)
      ) {
        setShowCountryDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Toggle status selection
  const toggleStatus = (status: string) => {
    if (selectedStatus.includes(status)) {
      onStatusChange(selectedStatus.filter((s) => s !== status));
    } else {
      onStatusChange([...selectedStatus, status]);
    }
  };

  // Toggle type selection
  const toggleType = (type: string) => {
    if (selectedTypes.includes(type)) {
      onTypesChange(selectedTypes.filter((t) => t !== type));
    } else {
      onTypesChange([...selectedTypes, type]);
    }
  };

  // Toggle country selection
  const toggleCountry = (country: string) => {
    if (selectedCountries.includes(country)) {
      setSelectedCountries(selectedCountries.filter((c) => c !== country));
    } else {
      setSelectedCountries([...selectedCountries, country]);
    }
  };

  // Toggle missing info filter
  const toggleMissingInfo = () => {
    setHasMissingInfo(!hasMissingInfo);
  };

  // Toggle complete info filter
  const toggleCompleteInfo = () => {
    setHasCompleteInfo(!hasCompleteInfo);
  };

  // Function to clear all filters
  const handleClearFilters = () => {
    onSearchChange("");
    onStatusChange([]);
    onTypesChange([]);
    setSelectedCountries([]);
    setStartDate("");
    setEndDate("");
    setHasMissingInfo(null);
    setHasCompleteInfo(null);
  };

  // Check if there are any active filters
  const hasActiveFilters =
    searchTerm ||
    selectedStatus.length > 0 ||
    selectedTypes.length > 0 ||
    selectedCountries.length > 0 ||
    startDate ||
    endDate ||
    hasMissingInfo !== null ||
    hasCompleteInfo !== null;

  // Get background styles for type badges
  const getTypeStyles = (type: string) => {
    switch (type) {
      case "Agency":
        return "bg-blue-50 text-blue-700 border-blue-100";
      case "Advertiser":
        return "bg-purple-50 text-purple-700 border-purple-100";
      case "Publisher":
        return "bg-amber-50 text-amber-700 border-amber-100";
      case "Holding Agency":
        return "bg-teal-50 text-teal-700 border-teal-100";
      case "Holding Advertiser":
        return "bg-rose-50 text-rose-700 border-rose-100";
      default:
        return "bg-gray-50 text-gray-700 border-gray-100";
    }
  };

  // Get background styles for status badges
  const getStatusStyles = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-amber-50 text-amber-700 border-amber-100";
      case "Approved":
        return "bg-green-50 text-green-700 border-green-100";
      case "Rejected":
        return "bg-red-50 text-red-700 border-red-100";
      default:
        return "bg-gray-50 text-gray-700 border-gray-100";
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Pending":
        return <Clock className="h-4 w-4 mr-1 inline-block" />;
      case "Approved":
        return <CheckCircle className="h-4 w-4 mr-1 inline-block" />;
      case "Rejected":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1 inline-block"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
      <div className="flex flex-col space-y-4">
        {/* Main search bar and filters button */}
        <div className="flex space-x-2">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm text-gray-900 placeholder-gray-500 bg-gray-50"
              placeholder="Search by name, country, contact..."
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
                {(searchTerm ? 1 : 0) +
                  (selectedStatus.length > 0 ? 1 : 0) +
                  (selectedTypes.length > 0 ? 1 : 0) +
                  (selectedCountries.length > 0 ? 1 : 0) +
                  (startDate || endDate ? 1 : 0) +
                  (hasMissingInfo !== null || hasCompleteInfo !== null ? 1 : 0)}
              </span>
            )}
          </button>

          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              type="button"
              className="flex items-center px-3 py-2.5 rounded-lg border border-gray-200 shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <X className="h-4 w-4 mr-1" />
              Clear
            </button>
          )}
        </div>

        {/* Expanded filters */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-gray-100 mt-2">
            {/* Column 1: Status and Type filters */}
            <div>
              {/* Status filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <div className="space-y-2">
                  {statuses.map((status) => (
                    <div
                      key={status}
                      className={`cursor-pointer rounded-md px-3 py-1.5 text-sm border ${
                        selectedStatus.includes(status)
                          ? getStatusStyles(status)
                          : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                      onClick={() => toggleStatus(status)}
                    >
                      {getStatusIcon(status)}
                      {status}
                      {selectedStatus.includes(status) && (
                        <span className="ml-1.5 inline-block">✓</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Type filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Organization Type
                </label>
                <div className="space-y-2">
                  {types.map((type) => (
                    <div
                      key={type}
                      className={`cursor-pointer rounded-md px-3 py-1.5 text-sm border ${
                        selectedTypes.includes(type)
                          ? getTypeStyles(type)
                          : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                      onClick={() => toggleType(type)}
                    >
                      {type}
                      {selectedTypes.includes(type) && (
                        <span className="ml-1.5 inline-block">✓</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Column 2: Country dropdown and Missing info */}
            <div>
              {/* Country filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <div ref={countryDropdownRef} className="relative">
                  <button
                    onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm text-left text-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  >
                    <div className="flex items-center justify-between">
                      <span>
                        {selectedCountries.length === 0
                          ? "Select countries"
                          : `${selectedCountries.length} selected`}
                      </span>
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    </div>
                  </button>

                  {showCountryDropdown && (
                    <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg max-h-60 overflow-auto border border-gray-200">
                      <div className="p-2 border-b border-gray-100">
                        <input
                          type="text"
                          value={countrySearchTerm}
                          onChange={(e) => setCountrySearchTerm(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-sm"
                          placeholder="Search countries..."
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      <div className="p-2">
                        {filteredCountries.length > 0 ? (
                          filteredCountries.map((country) => (
                            <div
                              key={country}
                              className={`px-3 py-2 text-sm cursor-pointer rounded-md ${
                                selectedCountries.includes(country)
                                  ? "bg-indigo-50 text-indigo-700"
                                  : "hover:bg-gray-100 text-gray-700"
                              }`}
                              onClick={() => toggleCountry(country)}
                            >
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={selectedCountries.includes(country)}
                                  onChange={() => {}}
                                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                                />
                                <span className="ml-2">{country}</span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="px-3 py-2 text-sm text-gray-500">
                            No countries found
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Missing info filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Information Status
                </label>
                <div className="space-y-2">
                  <div
                    className={`cursor-pointer rounded-md px-3 py-1.5 text-sm border ${
                      hasMissingInfo
                        ? "bg-red-50 text-red-700 border-red-100"
                        : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                    onClick={toggleMissingInfo}
                  >
                    Has missing info
                    {hasMissingInfo && (
                      <span className="ml-1.5 inline-block">✓</span>
                    )}
                  </div>
                  <div
                    className={`cursor-pointer rounded-md px-3 py-1.5 text-sm border ${
                      hasCompleteInfo
                        ? "bg-green-50 text-green-700 border-green-100"
                        : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                    onClick={toggleCompleteInfo}
                  >
                    Complete info
                    {hasCompleteInfo && (
                      <span className="ml-1.5 inline-block">✓</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Column 3: Date range selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Submission Period
              </label>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Start Date
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm text-gray-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    End Date
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm text-gray-900"
                    />
                  </div>
                </div>

                {(startDate || endDate) && (
                  <div className="pt-2">
                    <button
                      onClick={() => {
                        setStartDate("");
                        setEndDate("");
                      }}
                      className="text-xs text-orange-600 hover:text-orange-800 flex items-center"
                    >
                      <X className="h-3 w-3 mr-1" />
                      Clear dates
                    </button>
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

export default ApprovalFilters;
