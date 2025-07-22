import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, X } from "lucide-react";

interface SearchFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onFilterClick: () => void;
  showFilters?: boolean;
  activeFiltersCount?: number;
  onClearFilters?: () => void;
}

const SearchFilter: React.FC<SearchFilterProps> = ({
  searchTerm,
  onSearchChange,
  onFilterClick,
  showFilters = false,
  activeFiltersCount = 0,
  onClearFilters,
}) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
      <div className="flex flex-col space-y-4">
        <div className="flex space-x-2">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search campaigns by name, publisher, advertiser or ID..."
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm text-gray-900 placeholder-gray-500 bg-gray-50 h-[42px]"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          <button
            onClick={onFilterClick}
            className={`flex items-center px-3 py-2.5 rounded-lg shadow-sm border h-[42px] ${
              showFilters
                ? "bg-orange-50 text-orange-700 border-orange-200"
                : "bg-white text-orange-600 border-gray-200 hover:bg-gray-50"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1 text-orange-600"
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
            {activeFiltersCount > 0 && (
              <span className="ml-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-orange-100 text-xs font-medium text-orange-800">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {activeFiltersCount > 0 && onClearFilters && (
            <button
              onClick={onClearFilters}
              type="button"
              className="flex items-center px-3 py-2.5 rounded-lg border border-gray-200 shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 h-[42px]"
            >
              <X className="h-4 w-4 mr-1" />
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchFilter;
