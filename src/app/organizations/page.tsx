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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Agency":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1 text-blue-600"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "Advertiser":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1 text-purple-600"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
        );
      case "Publisher":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1 text-amber-600"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "Holding Agency":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1 text-indigo-600"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10.496 2.132a1 1 0 00-.992 0l-7 4A1 1 0 003 8v7a1 1 0 100 2h14a1 1 0 100-2V8a1 1 0 00.496-1.868l-7-4zM6 9a1 1 0 00-1 1v3a1 1 0 102 0v-3a1 1 0 00-1-1zm3 1a1 1 0 012 0v3a1 1 0 11-2 0v-3zm5-1a1 1 0 00-1 1v3a1 1 0 102 0v-3a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "Holding Advertiser":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1 text-rose-600"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
          </svg>
        );
      default:
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1 text-gray-600"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 4h3a3 3 0 006 0h3a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm2.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm2.45 4a2.5 2.5 0 10-4.9 0h4.9zM12 9a1 1 0 100 2h3a1 1 0 100-2h-3zm-1 4a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z"
              clipRule="evenodd"
            />
          </svg>
        );
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

  const nameTruncateLength = useMemo(() => (isCollapsed ? 30 : 25), [
    isCollapsed,
  ]);

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
                        className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-indigo-700 transition-colors"
                        onClick={() => handleSort("name")}
                      >
                        <div className="whitespace-nowrap flex items-center">
                          Organization
                          {sortField === "name" && (
                            <span className="ml-1">
                              {sortDirection === "asc" ? "↑" : "↓"}
                            </span>
                          )}
                        </div>
                      </th>
                      <th
                        className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-indigo-700 transition-colors"
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
                        className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-indigo-700 transition-colors"
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
                        className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-indigo-700 transition-colors"
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
                          <div className="flex items-center text-sm">
                            <div className="flex-shrink-0">
                              {getTypeIcon(org.type)}
                            </div>
                            <div className="ml-1 font-medium text-indigo-600 hover:text-indigo-900">
                              {truncateText(org.name, nameTruncateLength)}
                            </div>
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
                              className="text-indigo-600 hover:text-indigo-900 text-sm"
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
                                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100"
                                title="Big Six Agency Group"
                              >
                                Big Six
                              </span>
                            )}
                            {org.isHolding && (
                              <span
                                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100"
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
                      <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-indigo-600 hover:bg-indigo-50">
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
