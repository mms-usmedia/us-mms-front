"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useSidebar } from "@/contexts/SidebarContext";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import SearchFilter from "@/components/organizations/SearchFilter";
import Link from "next/link";

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
  status: "Active" | "Inactive" | "In Review";
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
    status: "Inactive",
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
    status: "In Review",
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
    status: "Inactive",
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
    status: "In Review",
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
    status: "Inactive",
  },
];

// OrganizationCard component
const OrganizationCard: React.FC<{ organization: Organization }> = ({
  organization,
}) => {
  const router = useRouter();

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

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border shadow-sm bg-green-50 text-green-700 border-green-100">
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
      case "Inactive":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border shadow-sm bg-gray-50 text-gray-700 border-gray-100">
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
      case "In Review":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border shadow-sm bg-amber-50 text-amber-700 border-amber-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clipRule="evenodd"
              />
            </svg>
            In Review
          </span>
        );
      default:
        return null;
    }
  };

  // Truncate name if status is "In Review" to prevent layout issues
  const getDisplayName = (name: string, status: string) => {
    if (status === "In Review" && name.length > 25) {
      return name.substring(0, 22) + "...";
    }
    return name;
  };

  return (
    <div
      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => router.push(`/organizations/${organization.id}`)}
    >
      <div className="p-5">
        <div className="flex justify-between items-start">
          <h3
            className="text-lg font-semibold text-gray-900 mb-1 truncate"
            title={organization.name}
          >
            {getDisplayName(organization.name, organization.status)}
          </h3>
          <div className="ml-2 flex-shrink-0">
            {getStatusBadge(organization.status)}
          </div>
        </div>

        <div className="mb-3">
          <span
            className={`inline-block px-2.5 py-1 text-xs font-medium rounded-md border ${getTypeStyles(
              organization.type
            )}`}
          >
            {organization.type}
          </span>
        </div>

        <div className="text-sm text-gray-500 mb-4">
          <div className="flex items-center mb-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1.5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            {organization.country}
          </div>

          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1.5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            {organization.holdingName || "Independent"}
          </div>
        </div>

        <div className="flex space-x-2 mt-3">
          {organization.isBigSix && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-50 text-orange-700 border border-orange-100">
              Big Six
            </span>
          )}
          {organization.isHolding && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
              Holding
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default function OrganizationsPage() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useAuth();
  const {} = useSidebar();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [isHoldingFilter, setIsHoldingFilter] = useState<boolean | null>(null);
  const [isBigSixFilter, setIsBigSixFilter] = useState<boolean | null>(null);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<"grid" | "table">("table");
  const [sortField, setSortField] = useState<string>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  // Load organizations data
  useEffect(() => {
    // In a real scenario, this would fetch data from an API
    setOrganizations(mockOrganizations);
    setIsDataLoading(false);
  }, []);

  // Filter organizations based on search term and selected filters
  const filteredOrganizations = organizations
    .filter((org) => {
      // Search term filter
      const matchesSearchTerm =
        searchTerm.trim() === "" ||
        org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.legalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.taxId.toLowerCase().includes(searchTerm.toLowerCase());

      // Type filter
      const matchesType =
        selectedTypes.length === 0 || selectedTypes.includes(org.type);

      // Country filter
      const matchesCountry =
        selectedCountries.length === 0 ||
        selectedCountries.includes(org.country);

      // Status filter
      const matchesStatus =
        selectedStatus.length === 0 || selectedStatus.includes(org.status);

      // Holding filter
      const matchesHolding =
        isHoldingFilter === null || org.isHolding === isHoldingFilter;

      // Big Six filter
      const matchesBigSix =
        isBigSixFilter === null || org.isBigSix === isBigSixFilter;

      return (
        matchesSearchTerm &&
        matchesType &&
        matchesCountry &&
        matchesStatus &&
        matchesHolding &&
        matchesBigSix
      );
    })
    .sort((a, b) => {
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
      } else if (sortField === "status") {
        comparison = a.status.localeCompare(b.status);
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });

  // Pagination logic
  const totalPages = Math.ceil(filteredOrganizations.length / itemsPerPage);
  const paginatedOrganizations = filteredOrganizations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchTerm,
    selectedTypes,
    selectedCountries,
    selectedStatus,
    isHoldingFilter,
    isBigSixFilter,
  ]);

  // Get unique organization types and countries for filters
  const organizationTypes = Array.from(
    new Set(organizations.map((org) => org.type))
  );

  const countries = Array.from(
    new Set(organizations.map((org) => org.country))
  ).sort();

  // Function to handle sorting in table view
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Helper function to truncate text
  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  // Generate pagination buttons
  const renderPaginationButtons = () => {
    const buttons = [];

    // Previous button
    buttons.push(
      <button
        key="prev"
        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className={`relative inline-flex items-center px-2 py-2 rounded-l-md border ${
          currentPage === 1
            ? "border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed"
            : "border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
        }`}
      >
        <span className="sr-only">Previous</span>
        &laquo;
      </button>
    );

    // Page number buttons
    const maxButtonsToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxButtonsToShow / 2));
    const endPage = Math.min(totalPages, startPage + maxButtonsToShow - 1);

    if (endPage - startPage + 1 < maxButtonsToShow && startPage > 1) {
      startPage = Math.max(1, endPage - maxButtonsToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`relative inline-flex items-center px-4 py-2 border ${
            currentPage === i
              ? "bg-orange-50 border-orange-200 text-orange-600 z-10"
              : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"
          }`}
        >
          {i}
        </button>
      );
    }

    // Next button
    buttons.push(
      <button
        key="next"
        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages || totalPages === 0}
        className={`relative inline-flex items-center px-2 py-2 rounded-r-md border ${
          currentPage === totalPages || totalPages === 0
            ? "border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed"
            : "border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
        }`}
      >
        <span className="sr-only">Next</span>
        &raquo;
      </button>
    );

    return buttons;
  };

  // Render loading state
  if (isDataLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header userName={user?.name || "User"} />

        {/* Main Container */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <div className="container mx-auto">
            {/* Page header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Organizations
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  Manage all your organizations in one place
                </p>
              </div>
              <div className="mt-4 md:mt-0 flex items-center gap-3">
                {/* View toggle buttons */}
                <div className="flex border border-gray-200 rounded-md shadow-sm overflow-hidden">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`px-3 py-2 text-sm font-medium flex items-center ${
                      viewMode === "grid"
                        ? "bg-orange-50 text-orange-600 border-r border-gray-200"
                        : "bg-white text-gray-600 hover:bg-gray-50 border-r border-gray-200"
                    }`}
                    title="Grid View"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode("table")}
                    className={`px-3 py-2 text-sm font-medium flex items-center ${
                      viewMode === "table"
                        ? "bg-orange-50 text-orange-600"
                        : "bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                    title="Table View"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Search and filters */}
            <div className="mb-6">
              <SearchFilter
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedTypes={selectedTypes}
                setSelectedTypes={setSelectedTypes}
                selectedCountries={selectedCountries}
                setSelectedCountries={setSelectedCountries}
                selectedStatus={selectedStatus}
                setSelectedStatus={setSelectedStatus}
                isHoldingFilter={isHoldingFilter}
                setIsHoldingFilter={setIsHoldingFilter}
                isBigSixFilter={isBigSixFilter}
                setIsBigSixFilter={setIsBigSixFilter}
                organizationTypes={organizationTypes}
                countries={countries}
              />
            </div>

            {/* Results count */}
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-gray-600">
                Showing{" "}
                <span className="font-semibold">
                  {filteredOrganizations.length > 0
                    ? `${(currentPage - 1) * itemsPerPage + 1}-${Math.min(
                        currentPage * itemsPerPage,
                        filteredOrganizations.length
                      )} of ${filteredOrganizations.length}`
                    : "0"}
                </span>{" "}
                {filteredOrganizations.length === 1
                  ? "organization"
                  : "organizations"}
              </p>
            </div>

            {/* Grid View */}
            {viewMode === "grid" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedOrganizations.map((org) => (
                  <OrganizationCard key={org.id} organization={org} />
                ))}
              </div>
            )}

            {/* Table View */}
            {viewMode === "table" && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 table-fixed">
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
                        <th
                          className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-orange-700 transition-colors"
                          onClick={() => handleSort("status")}
                        >
                          <div className="whitespace-nowrap flex items-center">
                            Status
                            {sortField === "status" && (
                              <span className="ml-1">
                                {sortDirection === "asc" ? "↑" : "↓"}
                              </span>
                            )}
                          </div>
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Features
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {paginatedOrganizations.map((org) => (
                        <tr
                          key={org.id}
                          className="hover:bg-gray-50 transition-colors cursor-pointer"
                          onClick={() => {
                            router.push(`/organizations/${org.id}`);
                          }}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-orange-600 hover:text-orange-800">
                              {truncateText(org.name, 30)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-block px-2.5 py-1 text-xs font-medium rounded-md border ${
                                org.type === "Agency"
                                  ? "bg-blue-50 text-blue-700 border-blue-100"
                                  : org.type === "Advertiser"
                                  ? "bg-purple-50 text-purple-700 border-purple-100"
                                  : org.type === "Publisher"
                                  ? "bg-amber-50 text-amber-700 border-amber-100"
                                  : org.type === "Holding Agency"
                                  ? "bg-teal-50 text-teal-700 border-teal-100"
                                  : "bg-rose-50 text-rose-700 border-rose-100"
                              }`}
                            >
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
                            {org.status === "Active" ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border shadow-sm bg-green-50 text-green-700 border-green-100">
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
                            ) : org.status === "Inactive" ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border shadow-sm bg-gray-50 text-gray-700 border-gray-100">
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
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border shadow-sm bg-amber-50 text-amber-700 border-amber-100">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-3.5 w-3.5 mr-1"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                In Review
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex space-x-2">
                              {org.isBigSix && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-50 text-orange-700 border border-orange-100">
                                  Big Six
                                </span>
                              )}
                              {org.isHolding && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
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
                {filteredOrganizations.length > 0 && (
                  <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-700">
                          Showing{" "}
                          <span className="font-medium">
                            {(currentPage - 1) * itemsPerPage + 1}
                          </span>{" "}
                          to{" "}
                          <span className="font-medium">
                            {Math.min(
                              currentPage * itemsPerPage,
                              filteredOrganizations.length
                            )}
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
                          {renderPaginationButtons()}
                        </nav>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Pagination for grid view */}
            {viewMode === "grid" &&
              filteredOrganizations.length > itemsPerPage && (
                <div className="mt-6 flex justify-center">
                  <nav
                    className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                    aria-label="Pagination"
                  >
                    {renderPaginationButtons()}
                  </nav>
                </div>
              )}

            {/* No results message */}
            {filteredOrganizations.length === 0 && (
              <div className="text-center py-12">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 mx-auto text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  No organizations found
                </h3>
                <p className="mt-1 text-gray-500">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
