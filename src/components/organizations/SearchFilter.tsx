import React, { useState, useEffect, useRef } from "react";

interface SearchFilterProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedTypes: string[];
  setSelectedTypes: (value: string[]) => void;
  selectedCountries: string[];
  setSelectedCountries: (value: string[]) => void;
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
  organizationTypes,
  countries,
}) => {
  const [countrySearchTerm, setCountrySearchTerm] = useState<string>("");
  const [showCountryDropdown, setShowCountryDropdown] =
    useState<boolean>(false);
  const [filteredCountries, setFilteredCountries] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const countryDropdownRef = useRef<HTMLDivElement>(null);

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
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Function to clear all filters
  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedTypes([]);
    setSelectedCountries([]);
    setCountrySearchTerm("");
  };

  // Check if there are any active filters
  const hasActiveFilters =
    searchTerm || selectedTypes.length > 0 || selectedCountries.length > 0;

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
                  (selectedCountries.length > 0 ? 1 : 0)}
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
          <div className="grid grid-cols-1 gap-4 pt-4 border-t border-gray-100 mt-2">
            {/* Organization Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Organization Type
              </label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
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

            {/* Country Filter */}
            <div className="relative" ref={countryDropdownRef}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
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
                        <span className="sr-only">Remove {country}</span>
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
              {showCountryDropdown && (
                <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-lg border border-gray-200 max-h-60 overflow-auto">
                  <div className="p-2 border-b border-gray-100">
                    <input
                      type="text"
                      className="w-full text-sm border border-gray-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Search countries..."
                      value={countrySearchTerm}
                      onChange={(e) => setCountrySearchTerm(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <div className="py-1">
                    {filteredCountries.map((country) => (
                      <div
                        key={country}
                        className={`flex items-center px-4 py-2 text-sm cursor-pointer ${
                          selectedCountries.includes(country)
                            ? "bg-orange-50"
                            : "hover:bg-gray-50"
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleCountrySelection(country);
                        }}
                      >
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500 mr-2"
                          checked={selectedCountries.includes(country)}
                          onChange={() => {}}
                        />
                        <span className="text-gray-900">{country}</span>
                      </div>
                    ))}
                    {filteredCountries.length === 0 && (
                      <div className="px-4 py-2 text-sm text-gray-500">
                        No matching countries
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchFilter;
