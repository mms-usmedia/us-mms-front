import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { FaBuilding } from "react-icons/fa";
import StatusBadge from "@/components/ui/StatusBadge";

// Define props for the component
interface Organization {
  id: string;
  name: string;
  type:
    | "Agency"
    | "Advertiser"
    | "Publisher"
    | "Holding Agency"
    | "Holding Advertiser";
  country: string;
  isHolding: boolean;
  holdingName?: string;
  isBigSix: boolean;
  legalName: string;
  taxId: string;
  website?: string;
  contactName?: string;
  contactEmail?: string;
  status: "Active" | "Inactive" | "In Review";
}

interface SubOrganization extends Organization {
  holdingId: string;
}

interface OrganizationSubOrgsProps {
  organization: Organization;
  hideActionButtons?: boolean;
}

const OrganizationSubOrgs: React.FC<OrganizationSubOrgsProps> = ({
  organization,
  hideActionButtons = false,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [countrySearchTerm, setCountrySearchTerm] = useState<string>("");
  const [showCountryDropdown, setShowCountryDropdown] =
    useState<boolean>(false);
  const [filteredCountries, setFilteredCountries] = useState<string[]>([]);
  const countryDropdownRef = useRef<HTMLDivElement>(null);

  // Status options
  const statusOptions = ["Active", "Inactive", "In Review"];

  // Mock data for sub-organizations
  const mockSubOrganizations: SubOrganization[] = [
    {
      id: "sub001",
      name: "Havas Media-Mexico- Havas",
      type: "Agency",
      country: "Mexico",
      isHolding: false,
      holdingName: "Havas",
      holdingId: "org003", // ID de la organización holding (Havas)
      isBigSix: true,
      isPartOfHolding: true,
      legalName: "XXXX SA",
      taxId: "HMM123456MX",
      website: "www.xyz.com",
      contactName: "Miguel Hernández",
      contactEmail: "miguel.hernandez@havas.com",
      status: "Active",
    },
    {
      id: "sub002",
      name: "UM - Mexico - IPG",
      type: "Agency",
      country: "Mexico",
      isHolding: false,
      holdingName: "Interpublic",
      holdingId: "org004", // ID de la organización holding (Interpublic)
      isBigSix: true,
      isPartOfHolding: true,
      legalName: "XXXX SA",
      taxId: "UMM123456MX",
      website: "www.xyz.com",
      contactName: "Roberto Sánchez",
      contactEmail: "roberto.sanchez@umww.com",
      status: "Active",
    },
    {
      id: "sub003",
      name: "MUV-Brasil-WPP",
      type: "Agency",
      country: "Brasil",
      isHolding: false,
      holdingName: "WPP",
      holdingId: "org005", // ID de la organización holding (WPP)
      isBigSix: true,
      isPartOfHolding: true,
      legalName: "XXXX SA",
      taxId: "MUV123456BR",
      website: "www.xyz.com",
      contactName: "Paulo Oliveira",
      contactEmail: "paulo.oliveira@muv.com",
      status: "Active",
    },
    {
      id: "sub004",
      name: "Omnet-United States-OMG",
      type: "Agency",
      country: "United States",
      isHolding: false,
      holdingName: "OMG",
      holdingId: "org006", // ID de la organización holding (OMG)
      isBigSix: true,
      isPartOfHolding: true,
      legalName: "XXXX SA",
      taxId: "OMN123456US",
      website: "www.xyz.com",
      contactName: "Sarah Johnson",
      contactEmail: "sarah.johnson@omnet.com",
      status: "Active",
    },
    {
      id: "sub005",
      name: "Carat-Argentina-Dentsu",
      type: "Agency",
      country: "Argentina",
      isHolding: false,
      holdingName: "Dentsu",
      holdingId: "org007", // ID de la organización holding (Dentsu)
      isBigSix: true,
      isPartOfHolding: true,
      legalName: "XXXX SA",
      taxId: "CAR123456AR",
      website: "www.xyz.com",
      contactName: "Luciana Rodríguez",
      contactEmail: "luciana.rodriguez@carat.com",
      status: "Active",
    },
    {
      id: "sub006",
      name: "Starcom-Mexico-Publicis",
      type: "Agency",
      country: "México",
      isHolding: false,
      holdingName: "Publicis",
      holdingId: "org011", // ID de la organización holding (Publicis)
      isBigSix: true,
      isPartOfHolding: true,
      legalName: "XXXX SA",
      taxId: "STC123456MX",
      website: "www.xyz.com",
      contactName: "Alejandro Torres",
      contactEmail: "alejandro.torres@starcom.com",
      status: "Active",
    },
    {
      id: "sub007",
      name: "OMD-Argentina-OMG",
      type: "Agency",
      country: "Argentina",
      isHolding: false,
      holdingName: "OMG",
      holdingId: "org006", // ID de la organización holding (OMG)
      isBigSix: true,
      isPartOfHolding: true,
      legalName: "XXXX SA",
      taxId: "OMA123456AR",
      website: "www.xyz.com",
      contactName: "Martín González",
      contactEmail: "martin.gonzalez@omd.com",
      status: "Active",
    },
  ];

  // Filter sub-organizations based on the current organization
  const filteredSubOrgs = mockSubOrganizations.filter(
    (subOrg) => subOrg.holdingId === organization.id
  );

  // Get unique countries for filter
  const countries = Array.from(
    new Set(filteredSubOrgs.map((subOrg) => subOrg.country))
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

  // Apply search and filters
  const displayedSubOrgs = filteredSubOrgs.filter((subOrg) => {
    const matchesSearch =
      searchTerm === "" ||
      subOrg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subOrg.legalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subOrg.taxId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCountry =
      selectedCountries.length === 0 ||
      selectedCountries.includes(subOrg.country);

    const matchesStatus =
      selectedStatus.length === 0 || selectedStatus.includes(subOrg.status);

    return matchesSearch && matchesCountry && matchesStatus;
  });

  // Function to clear all filters
  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedCountries([]);
    setSelectedStatus([]);
    setCountrySearchTerm("");
  };

  // Check if there are any active filters
  const hasActiveFilters =
    searchTerm || selectedCountries.length > 0 || selectedStatus.length > 0;

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
    <div className="bg-white shadow-sm border border-gray-100 rounded-b-xl">
      {!hideActionButtons && (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 p-6">
          <div>
            <h2 className="text-xl font-semibold text-orange-600">
              Sub-Organizations
            </h2>
          </div>
        </div>
      )}

      <div className="p-6">
        {/* Search and filters */}
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
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm text-gray-900 placeholder-gray-500 bg-gray-50"
                  placeholder="Search sub-organizations by name, legal name, or tax ID..."
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
                      (selectedCountries.length > 0 ? 1 : 0) +
                      (selectedStatus.length > 0 ? 1 : 0)}
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
                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <div className="grid grid-cols-3 gap-2">
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

                {/* Country Filter */}
                {countries.length > 0 && (
                  <div className="relative" ref={countryDropdownRef}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country
                    </label>
                    <div
                      className="flex flex-wrap gap-2 min-h-10 p-2 border border-gray-200 rounded-lg shadow-sm cursor-pointer bg-gray-50"
                      onClick={() =>
                        setShowCountryDropdown(!showCountryDropdown)
                      }
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
                            onChange={(e) =>
                              setCountrySearchTerm(e.target.value)
                            }
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
                )}
              </div>
            )}
          </div>
        </div>

        {displayedSubOrgs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Type
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Country
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Contact
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">View</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {displayedSubOrgs.map((subOrg) => (
                  <tr
                    key={subOrg.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-orange-100 rounded-full">
                          <FaBuilding className="h-5 w-5 text-orange-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {subOrg.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {subOrg.legalName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{subOrg.type}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {subOrg.country}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={subOrg.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {subOrg.contactName || "-"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {subOrg.contactEmail || "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={`/organizations/${subOrg.id}`}
                        className="text-orange-600 hover:text-orange-900"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-10">
            <FaBuilding className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No sub-organizations found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {hasActiveFilters
                ? "Try changing your search or filter criteria"
                : "This holding company doesn't have any sub-organizations registered yet"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizationSubOrgs;
