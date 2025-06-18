"use client";

import React, { useState, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useSidebar } from "@/contexts/SidebarContext";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import SearchFilter from "@/components/organizations/SearchFilter";

// Types for organizations
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
  status: "Active" | "Inactive";
}

// Hardcoded example data for organizations
const mockOrganizations: Organization[] = [
  {
    id: "org001",
    name: "OMD Mexico",
    type: "Agency",
    country: "Mexico",
    isHolding: false,
    holdingName: "Omnicom Media Group",
    isBigSix: true,
    legalName: "OMD Mexico S.A. de C.V.",
    taxId: "OMD981231ABC",
    website: "https://www.omd.com/mexico",
    contactName: "Maria González",
    contactEmail: "maria.gonzalez@omd.com",
    status: "Active",
  },
  {
    id: "org002",
    name: "Live Nation Brasil Entretenimento LTDA",
    type: "Advertiser",
    country: "Brazil",
    isHolding: false,
    holdingName: "",
    isBigSix: false,
    legalName: "Live Nation Brasil Entretenimento LTDA",
    taxId: "LN123456BR",
    website: "https://www.livenation.com.br",
    contactName: "João Silva",
    contactEmail: "joao.silva@livenation.com",
    status: "Active",
  },
  {
    id: "org003",
    name: "Vevo LLC",
    type: "Publisher",
    country: "United States",
    isHolding: false,
    holdingName: "",
    isBigSix: false,
    legalName: "Vevo LLC",
    taxId: "V789012US",
    website: "https://www.vevo.com",
    contactName: "John Smith",
    contactEmail: "john.smith@vevo.com",
    status: "Active",
  },
  {
    id: "org004",
    name: "Omnicom Media Group",
    type: "Holding Agency",
    country: "United States",
    isHolding: true,
    isBigSix: true,
    legalName: "Omnicom Media Group, Inc.",
    taxId: "OMG345678US",
    website: "https://www.omnicommediagroup.com",
    contactName: "Sarah Johnson",
    contactEmail: "sarah.johnson@omnicomgroup.com",
    status: "Active",
  },
  {
    id: "org005",
    name: "WPP",
    type: "Holding Agency",
    country: "United Kingdom",
    isHolding: true,
    isBigSix: true,
    legalName: "WPP plc",
    taxId: "WPP123456UK",
    website: "https://www.wpp.com",
    contactName: "David Williams",
    contactEmail: "david.williams@wpp.com",
    status: "Active",
  },
  {
    id: "org006",
    name: "Havas Media Colombia",
    type: "Agency",
    country: "Colombia",
    isHolding: false,
    holdingName: "Havas Group",
    isBigSix: true,
    legalName: "Havas Media Colombia S.A.S.",
    taxId: "HMC567890CO",
    website: "https://www.havasmedia.com/colombia",
    contactName: "Carlos Jiménez",
    contactEmail: "carlos.jimenez@havas.com",
    status: "Active",
  },
  {
    id: "org007",
    name: "Havas Group",
    type: "Holding Agency",
    country: "France",
    isHolding: true,
    isBigSix: true,
    legalName: "Havas S.A.",
    taxId: "HAV456789FR",
    website: "https://www.havasgroup.com",
    contactName: "Sophie Dupont",
    contactEmail: "sophie.dupont@havas.com",
    status: "Active",
  },
  {
    id: "org008",
    name: "Coca-Cola Latin America",
    type: "Holding Advertiser",
    country: "United States",
    isHolding: true,
    isBigSix: false,
    legalName: "The Coca-Cola Company",
    taxId: "CC123987US",
    website: "https://www.coca-colalatinamerica.com",
    contactName: "Miguel Rodríguez",
    contactEmail: "miguel.rodriguez@coca-cola.com",
    status: "Active",
  },
  {
    id: "org009",
    name: "Fandom",
    type: "Publisher",
    country: "United States",
    isHolding: false,
    holdingName: "",
    isBigSix: false,
    legalName: "Fandom, Inc.",
    taxId: "FAN234567US",
    website: "https://www.fandom.com",
    contactName: "Lisa Brown",
    contactEmail: "lisa.brown@fandom.com",
    status: "Active",
  },
  {
    id: "org010",
    name: "CALIA Y2 PROPAGANDA E MARKETING LTDA",
    type: "Agency",
    country: "Brazil",
    isHolding: false,
    holdingName: "",
    isBigSix: false,
    legalName: "CALIA Y2 PROPAGANDA E MARKETING LTDA",
    taxId: "CAL876543BR",
    website: "https://www.caliay2.com.br",
    contactName: "Ana Oliveira",
    contactEmail: "ana.oliveira@caliay2.com.br",
    status: "Active",
  },
  {
    id: "org011",
    name: "EJE PUBLICITARIA SOCIEDAD ANONIMA",
    type: "Advertiser",
    country: "Argentina",
    isHolding: false,
    holdingName: "",
    isBigSix: false,
    legalName: "EJE PUBLICITARIA S.A.",
    taxId: "EJE345678AR",
    website: "https://www.ejepublicitaria.com.ar",
    contactName: "Roberto Fernández",
    contactEmail: "roberto.fernandez@ejepublicitaria.com.ar",
    status: "Active",
  },
  {
    id: "org012",
    name: "Omnet Chile",
    type: "Agency",
    country: "Chile",
    isHolding: false,
    holdingName: "Omnet Latin America LLC",
    isBigSix: false,
    legalName: "Omnet Chile Ltda.",
    taxId: "OMC123456CL",
    website: "https://www.omnet.cl",
    contactName: "Patricia Gómez",
    contactEmail: "patricia.gomez@omnet.cl",
    status: "Active",
  },
];

export default function OrganizationsListPage() {
  const { user } = useAuth();
  const { isCollapsed } = useSidebar();
  const router = useRouter();

  // State for search and filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [sortField, setSortField] = useState<string>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Filtered organizations
  const filteredOrganizations = useMemo(() => {
    let filtered = [...mockOrganizations];

    // Apply search term filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (org) =>
          org.name.toLowerCase().includes(searchLower) ||
          org.legalName.toLowerCase().includes(searchLower) ||
          org.taxId.toLowerCase().includes(searchLower)
      );
    }

    // Apply type filter
    if (selectedTypes.length > 0) {
      filtered = filtered.filter((org) => selectedTypes.includes(org.type));
    }

    // Apply country filter
    if (selectedCountries.length > 0) {
      filtered = filtered.filter((org) =>
        selectedCountries.includes(org.country)
      );
    }

    // Sort results
    filtered.sort((a, b) => {
      let comparison = 0;

      if (sortField === "name") {
        comparison = a.name.localeCompare(b.name);
      } else if (sortField === "type") {
        comparison = a.type.localeCompare(b.type);
      } else if (sortField === "country") {
        comparison = a.country.localeCompare(b.country);
      } else if (sortField === "holdingName") {
        const holdingA = a.holdingName || "";
        const holdingB = b.holdingName || "";
        comparison = holdingA.localeCompare(holdingB);
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [searchTerm, selectedTypes, selectedCountries, sortField, sortDirection]);

  // Unique countries for filters
  const countries = useMemo(() => {
    const countrySet = new Set<string>();
    mockOrganizations.forEach((org) => countrySet.add(org.country));
    return Array.from(countrySet).sort();
  }, []);

  // Organization types for filters
  const organizationTypes = [
    "Agency",
    "Advertiser",
    "Publisher",
    "Holding Agency",
    "Holding Advertiser",
  ];

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getTypeStyles = (type: string) => {
    switch (type) {
      case "Agency":
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

  const getStatusBadge = (status: string) => {
    if (status === "Active") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border shadow-sm bg-green-50 text-green-700 border-green-200">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3.5 w-3.5 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          Active
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border shadow-sm bg-red-50 text-red-700 border-red-200">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3.5 w-3.5 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          Inactive
        </span>
      );
    }
  };

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  const nameTruncateLength = useMemo(
    () => (isCollapsed ? 30 : 25),
    [isCollapsed]
  );

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden transition-all duration-300 ease-in-out">
        <Header userName={user?.name || "User"} />

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <div className="container mx-auto transition-all duration-300 ease-in-out">
            <div className="mb-8 flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  Organizations
                </h1>
                <p className="text-gray-600">
                  Manage all your agencies, advertisers and publishers
                </p>
              </div>
            </div>

            <SearchFilter
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedTypes={selectedTypes}
              setSelectedTypes={setSelectedTypes}
              selectedCountries={selectedCountries}
              setSelectedCountries={setSelectedCountries}
              organizationTypes={organizationTypes}
              countries={countries}
            />

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-6 transition-all duration-300 ease-in-out">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 transition-all duration-300 ease-in-out table-fixed">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-orange-700 transition-colors"
                        onClick={() => handleSort("name")}
                      >
                        <div className="whitespace-nowrap flex items-center">
                          Name
                          {sortField === "name" && (
                            <span className="ml-1">
                              {sortDirection === "asc" ? "↑" : "↓"}
                            </span>
                          )}
                        </div>
                      </th>
                      <th
                        className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-orange-700 transition-colors"
                        onClick={() => handleSort("type")}
                      >
                        <div className="whitespace-nowrap flex items-center">
                          Type
                          {sortField === "type" && (
                            <span className="ml-1">
                              {sortDirection === "asc" ? "↑" : "↓"}
                            </span>
                          )}
                        </div>
                      </th>
                      <th
                        className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-orange-700 transition-colors"
                        onClick={() => handleSort("country")}
                      >
                        <div className="whitespace-nowrap flex items-center">
                          Country
                          {sortField === "country" && (
                            <span className="ml-1">
                              {sortDirection === "asc" ? "↑" : "↓"}
                            </span>
                          )}
                        </div>
                      </th>
                      <th
                        className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-orange-700 transition-colors"
                        onClick={() => handleSort("holdingName")}
                      >
                        <div className="whitespace-nowrap flex items-center">
                          Holding Name
                          {sortField === "holdingName" && (
                            <span className="ml-1">
                              {sortDirection === "asc" ? "↑" : "↓"}
                            </span>
                          )}
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Legal Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Tax ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Website
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Features
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {filteredOrganizations.map((org) => (
                      <tr
                        key={org.id}
                        className="hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => {
                          router.push(`/organizations/${org.id}`);
                        }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-orange-600 hover:text-orange-800">
                            {truncateText(org.name, nameTruncateLength)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={getTypeStyles(org.type)}>
                            {org.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {org.country}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {org.holdingName || "-"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div
                            className="text-sm text-gray-900"
                            title={org.legalName}
                          >
                            {truncateText(org.legalName, 30)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 font-mono">
                            {org.taxId}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {org.website ? (
                            <a
                              href={org.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-orange-600 hover:text-orange-800 text-sm"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {truncateText(
                                org.website.replace(/(^\w+:|^)\/\//, ""),
                                20
                              )}
                            </a>
                          ) : (
                            <span className="text-sm text-gray-500">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(org.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-2">
                            {org.isBigSix && (
                              <span
                                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-50 text-orange-700 border border-orange-100"
                                title="Big Six Agency Group"
                              >
                                Big Six
                              </span>
                            )}
                            {org.isHolding && (
                              <span
                                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100"
                                title="Holding Company"
                              >
                                Holding
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredOrganizations.length === 0 && (
                <div className="py-8 text-center text-gray-500">
                  No organizations found with the current filters.
                </div>
              )}

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
                        {filteredOrganizations.length}
                      </span>{" "}
                      of{" "}
                      <span className="font-medium">
                        {filteredOrganizations.length}
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
                      <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-orange-600 hover:bg-orange-50">
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
