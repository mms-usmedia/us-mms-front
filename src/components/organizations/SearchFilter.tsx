import React, { useState, useEffect, useRef } from "react";

interface SearchFilterProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedTypes: string[];
  setSelectedTypes: (value: string[]) => void;
  selectedCountries: string[];
  setSelectedCountries: (value: string[]) => void;
  selectedStatus: string[];
  setSelectedStatus: (value: string[]) => void;
  isHoldingFilter: boolean | null;
  setIsHoldingFilter: (value: boolean | null) => void;
  isBigSixFilter: boolean | null;
  setIsBigSixFilter: (value: boolean | null) => void;
  isPartOfHoldingFilter: boolean | null;
  setIsPartOfHoldingFilter: (value: boolean | null) => void;
  organizationTypes: string[];
  countries: string[];
}

const SearchFilter: React.FC<SearchFilterProps> = ({
  searchTerm,
  setSearchTerm,
  selectedTypes,
  setSelectedTypes,
  selectedCountries,
  setSelectedCountries,
  selectedStatus,
  setSelectedStatus,
  isHoldingFilter,
  setIsHoldingFilter,
  isBigSixFilter,
  setIsBigSixFilter,
  isPartOfHoldingFilter,
  setIsPartOfHoldingFilter,
  organizationTypes,
  countries,
}) => {
  const [countrySearchTerm, setCountrySearchTerm] = useState<string>("");
  const [showCountryDropdown, setShowCountryDropdown] =
    useState<boolean>(false);
  const [filteredCountries, setFilteredCountries] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const countryDropdownRef = useRef<HTMLDivElement>(null);
  const [showPartOfHoldingDropdown, setShowPartOfHoldingDropdown] =
    useState<boolean>(false);
  const partOfHoldingDropdownRef = useRef<HTMLDivElement>(null);

  // Status options
  const statusOptions = ["Active", "Inactive", "In Review"];

  // Initialize filtered values
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

      if (
        partOfHoldingDropdownRef.current &&
        !partOfHoldingDropdownRef.current.contains(event.target as Node)
      ) {
        setShowPartOfHoldingDropdown(false);
      }
    }

    // Add event listener only if any dropdown is open
    if (showCountryDropdown || showPartOfHoldingDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCountryDropdown, showPartOfHoldingDropdown]);

  // Function to clear all filters
  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedTypes([]);
    setSelectedCountries([]);
    setSelectedStatus([]);
    setIsHoldingFilter(null);
    setIsBigSixFilter(null);
    setIsPartOfHoldingFilter(null);
    setCountrySearchTerm("");
  };

  // Check if there are any active filters
  const hasActiveFilters =
    searchTerm ||
    selectedTypes.length > 0 ||
    selectedCountries.length > 0 ||
    selectedStatus.length > 0 ||
    isHoldingFilter !== null ||
    isBigSixFilter !== null ||
    isPartOfHoldingFilter !== null;

  // Function to toggle type selection
  const toggleTypeSelection = (type: string) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter((t) => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  // Function to toggle country selection
  const toggleCountrySelection = (country: string) => {
    if (selectedCountries.includes(country)) {
      setSelectedCountries(selectedCountries.filter((c) => c !== country));
    } else {
      setSelectedCountries([...selectedCountries, country]);
    }
  };

  // Function to toggle status selection
  const toggleStatusSelection = (status: string) => {
    if (selectedStatus.includes(status)) {
      setSelectedStatus(selectedStatus.filter((s) => s !== status));
    } else {
      setSelectedStatus([...selectedStatus, status]);
    }
  };

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
      case "Active":
        return "bg-green-50 text-green-700 border-green-100";
      case "Inactive":
        return "bg-gray-50 text-gray-700 border-gray-100";
      case "In Review":
        return "bg-amber-50 text-amber-700 border-amber-100";
      default:
        return "bg-gray-50 text-gray-700 border-gray-100";
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm text-gray-900 placeholder-gray-500 bg-gray-50"
              placeholder="Search organizations by name, legal name, or tax ID..."
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
                  (selectedTypes.length > 0 ? 1 : 0) +
                  (selectedCountries.length > 0 ? 1 : 0) +
                  (selectedStatus.length > 0 ? 1 : 0) +
                  (isHoldingFilter !== null ? 1 : 0) +
                  (isBigSixFilter !== null ? 1 : 0) +
                  (isPartOfHoldingFilter !== null ? 1 : 0)}
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

        {/* Expanded filter options */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-gray-100 mt-2">
            {/* Column 1: Organization Type and Status */}
            <div>
              {/* Organization Type Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Organization Type
                </label>
                <div className="space-y-2">
                  {organizationTypes.map((type) => (
                    <div
                      key={type}
                      className={`cursor-pointer rounded-md px-3 py-1.5 text-sm border ${
                        selectedTypes.includes(type)
                          ? getTypeStyles(type)
                          : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                      onClick={() => toggleTypeSelection(type)}
                    >
                      {type}
                      {selectedTypes.includes(type) && (
                        <span className="ml-1.5 inline-block">✓</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <div className="space-y-2">
                  {statusOptions.map((status) => (
                    <div
                      key={status}
                      className={`cursor-pointer rounded-md px-3 py-1.5 text-sm border ${
                        selectedStatus.includes(status)
                          ? getStatusStyles(status)
                          : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                      onClick={() => toggleStatusSelection(status)}
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

            {/* Column 2: Tags */}
            <div>
              {/* Holding Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Holding
                </label>
                <div
                  className={`cursor-pointer rounded-md px-3 py-1.5 text-sm border ${
                    isHoldingFilter === true
                      ? "bg-indigo-50 text-indigo-700 border-indigo-100"
                      : isHoldingFilter === false
                      ? "bg-red-50 text-red-700 border-red-100"
                      : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => {
                    if (isHoldingFilter === null) {
                      setIsHoldingFilter(true);
                    } else if (isHoldingFilter === true) {
                      setIsHoldingFilter(false);
                    } else {
                      setIsHoldingFilter(null);
                    }
                  }}
                >
                  {isHoldingFilter === null
                    ? "Is Holding"
                    : isHoldingFilter === true
                    ? "Is Holding: Yes"
                    : "Is Holding: No"}
                  {isHoldingFilter !== null && (
                    <span className="ml-1.5 inline-block">✓</span>
                  )}
                </div>
              </div>

              {/* Big Six Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Big 6
                </label>
                <div
                  className={`cursor-pointer rounded-md px-3 py-1.5 text-sm border ${
                    isBigSixFilter === true
                      ? "bg-indigo-50 text-indigo-700 border-indigo-100"
                      : isBigSixFilter === false
                      ? "bg-red-50 text-red-700 border-red-100"
                      : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => {
                    if (isBigSixFilter === null) {
                      setIsBigSixFilter(true);
                    } else if (isBigSixFilter === true) {
                      setIsBigSixFilter(false);
                    } else {
                      setIsBigSixFilter(null);
                    }
                  }}
                >
                  {isBigSixFilter === null
                    ? "Is Big 6"
                    : isBigSixFilter === true
                    ? "Is Big 6: Yes"
                    : "Is Big 6: No"}
                  {isBigSixFilter !== null && (
                    <span className="ml-1.5 inline-block">✓</span>
                  )}
                </div>
              </div>

              {/* Part of Holding Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Part of Holding
                </label>
                <div className="relative" ref={partOfHoldingDropdownRef}>
                  <div
                    className="flex items-center justify-between cursor-pointer rounded-md px-3 py-2 text-sm border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                    onClick={() =>
                      setShowPartOfHoldingDropdown(!showPartOfHoldingDropdown)
                    }
                  >
                    <span>
                      {isPartOfHoldingFilter === null
                        ? "Select option"
                        : isPartOfHoldingFilter === true
                        ? "Yes"
                        : "No"}
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-4 w-4 text-gray-500 transition-transform ${
                        showPartOfHoldingDropdown ? "transform rotate-180" : ""
                      }`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>

                  {showPartOfHoldingDropdown && (
                    <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg overflow-hidden border border-gray-200">
                      <div
                        className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-50 ${
                          isPartOfHoldingFilter === true
                            ? "bg-orange-50 text-orange-700"
                            : "text-gray-700"
                        }`}
                        onClick={() => {
                          if (isPartOfHoldingFilter === true) {
                            setIsPartOfHoldingFilter(null);
                          } else {
                            setIsPartOfHoldingFilter(true);
                          }
                          setShowPartOfHoldingDropdown(false);
                        }}
                      >
                        <div className="flex items-center justify-between">
                          Yes
                          {isPartOfHoldingFilter === true && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 text-orange-600"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </div>
                      </div>
                      <div
                        className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-50 ${
                          isPartOfHoldingFilter === false
                            ? "bg-orange-50 text-orange-700"
                            : "text-gray-700"
                        }`}
                        onClick={() => {
                          if (isPartOfHoldingFilter === false) {
                            setIsPartOfHoldingFilter(null);
                          } else {
                            setIsPartOfHoldingFilter(false);
                          }
                          setShowPartOfHoldingDropdown(false);
                        }}
                      >
                        <div className="flex items-center justify-between">
                          No
                          {isPartOfHoldingFilter === false && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 text-orange-600"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Column 3: Country Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country
              </label>
              <div className="relative" ref={countryDropdownRef}>
                <div
                  className="flex flex-wrap gap-2 min-h-10 p-2 border border-gray-200 rounded-lg shadow-sm cursor-pointer bg-gray-50"
                  onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                >
                  {selectedCountries.length === 0 ? (
                    <div className="text-gray-500 text-sm my-auto">
                      All Countries
                    </div>
                  ) : (
                    selectedCountries.map((country) => (
                      <span
                        key={country}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border bg-gray-50 text-gray-700 border-gray-100"
                      >
                        {country}
                        <button
                          type="button"
                          className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-500 focus:outline-none"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleCountrySelection(country);
                          }}
                        >
                          <svg
                            className="h-2.5 w-2.5"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 8 8"
                          >
                            <path
                              strokeLinecap="round"
                              strokeWidth="1.5"
                              d="M1 1l6 6m0-6L1 7"
                            />
                          </svg>
                        </button>
                      </span>
                    ))
                  )}
                </div>

                {/* Country dropdown */}
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
                                ? "bg-orange-50 text-orange-700"
                                : "hover:bg-gray-50 text-gray-700"
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleCountrySelection(country);
                            }}
                          >
                            <div className="flex items-center justify-between">
                              {country}
                              {selectedCountries.includes(country) && (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4 text-orange-600"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              )}
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
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchFilter;
