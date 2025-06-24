import React, { useState, useEffect, useRef } from "react";
import { TradeIncentive } from "@/data/mockTradeData";

// Define incentive types with color classes
const incentiveTypeColors = {
  Fixed: "bg-orange-50 text-orange-700 border-orange-100",
  Volume: "bg-orange-100 text-orange-800 border-orange-200",
  Scale: "bg-amber-50 text-amber-700 border-amber-100",
  OnTop: "bg-orange-200 text-orange-900 border-orange-300",
};

interface TradeIncentiveFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCountry: string;
  onCountryChange: (value: string) => void;
  selectedProductType: string;
  onProductTypeChange: (value: string) => void;
  selectedIncentiveTypes: string[];
  onIncentiveTypesChange: (value: string[]) => void;
  incentives: TradeIncentive[];
}

const TradeIncentiveFilters: React.FC<TradeIncentiveFiltersProps> = ({
  searchTerm,
  onSearchChange,
  selectedCountry,
  onCountryChange,
  selectedProductType,
  onProductTypeChange,
  selectedIncentiveTypes,
  onIncentiveTypesChange,
  incentives,
}) => {
  const [countries, setCountries] = useState<string[]>([]);
  const [countrySearchTerm, setCountrySearchTerm] = useState<string>("");
  const [showCountryDropdown, setShowCountryDropdown] =
    useState<boolean>(false);
  const [filteredCountries, setFilteredCountries] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const countryDropdownRef = useRef<HTMLDivElement>(null);

  // Product type options
  const productTypeOptions = [
    { value: "All", label: "All products" },
    { value: "EAP", label: "EAP (Exclusive Ad Partner)" },
    { value: "PAS", label: "PAS (Premium Ad Solutions)" },
    { value: "Specific", label: "Specific Product" },
  ];

  // Incentive type options
  const incentiveTypeOptions = [
    { value: "Fixed", label: "Fixed" },
    { value: "Volume", label: "Volume" },
    { value: "Scale", label: "Scale" },
    { value: "OnTop", label: "On Top" },
  ];

  // Initialize countries when component mounts or incentives change
  useEffect(() => {
    // Get unique countries
    const uniqueCountries = Array.from(
      new Set(incentives.map((incentive) => incentive.country))
    ).sort();

    // Add "All" as the first option
    setCountries(["All", ...uniqueCountries]);
    setFilteredCountries(["All", ...uniqueCountries]);
  }, [incentives]);

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

  // Close dropdown when clicking outside
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

  // Function to toggle incentive type selection
  const toggleIncentiveType = (type: string) => {
    if (selectedIncentiveTypes.includes(type)) {
      onIncentiveTypesChange(selectedIncentiveTypes.filter((t) => t !== type));
    } else {
      onIncentiveTypesChange([...selectedIncentiveTypes, type]);
    }
  };

  // Function to clear all filters
  const handleClearFilters = () => {
    onSearchChange("");
    onCountryChange("All");
    onProductTypeChange("All");
    onIncentiveTypesChange([]);
    setCountrySearchTerm("");
  };

  // Check if there are any active filters
  const hasActiveFilters =
    searchTerm ||
    selectedCountry !== "All" ||
    selectedProductType !== "All" ||
    selectedIncentiveTypes.length > 0;

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
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm text-gray-900 placeholder-gray-500 bg-gray-50"
              placeholder="Search by description, country or percentage..."
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
                  (selectedCountry !== "All" ? 1 : 0) +
                  (selectedProductType !== "All" ? 1 : 0) +
                  (selectedIncentiveTypes.length > 0 ? 1 : 0)}
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
            {/* Top row filters: Country, Product Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Filter by country */}
              <div className="relative" ref={countryDropdownRef}>
                <label
                  htmlFor="country-search"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Country
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="country-search"
                    className="block w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm text-gray-900 bg-gray-50"
                    placeholder="Select or search country"
                    value={countrySearchTerm}
                    onChange={(e) => setCountrySearchTerm(e.target.value)}
                    onFocus={() => setShowCountryDropdown(true)}
                    readOnly={selectedCountry !== "All"}
                  />
                  {selectedCountry !== "All" && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <button
                        type="button"
                        onClick={() => {
                          onCountryChange("All");
                          setCountrySearchTerm("");
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

                {/* Countries dropdown */}
                {showCountryDropdown && selectedCountry === "All" && (
                  <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm border border-gray-200">
                    <div className="px-2 py-1 bg-gray-50 text-xs font-medium text-gray-500">
                      {filteredCountries.length} countries found
                    </div>
                    {filteredCountries.length === 0 ? (
                      <div className="text-gray-500 text-sm px-4 py-2">
                        No countries found
                      </div>
                    ) : (
                      filteredCountries.map((country) => (
                        <div
                          key={country}
                          className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-50 text-gray-900 text-sm"
                          onClick={() => {
                            onCountryChange(country);
                            setCountrySearchTerm(country);
                            setShowCountryDropdown(false);
                          }}
                        >
                          {country}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Filter by product type */}
              <div>
                <label
                  htmlFor="product-type"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Product Type
                </label>
                <select
                  id="product-type"
                  className="block w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm text-gray-900 bg-gray-50"
                  value={selectedProductType}
                  onChange={(e) => onProductTypeChange(e.target.value)}
                >
                  {productTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Filter by incentive type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Incentive Type
              </label>
              <div className="flex flex-wrap gap-2">
                {incentiveTypeOptions.map((type) => {
                  const isSelected = selectedIncentiveTypes.includes(
                    type.value
                  );
                  return (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => toggleIncentiveType(type.value)}
                      className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border ${
                        isSelected
                          ? incentiveTypeColors[
                              type.value as keyof typeof incentiveTypeColors
                            ]
                          : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      {isSelected && (
                        <svg
                          className="mr-1.5 h-3 w-3"
                          viewBox="0 0 12 12"
                          fill="currentColor"
                        >
                          <path d="M3.707 5.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4a1 1 0 00-1.414-1.414L5 6.586 3.707 5.293z" />
                        </svg>
                      )}
                      {type.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TradeIncentiveFilters;
