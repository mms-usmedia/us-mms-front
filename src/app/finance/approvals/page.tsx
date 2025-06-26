"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useSidebar } from "@/contexts/SidebarContext";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import Link from "next/link";
import StatusBadge, { StatusType } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";
import ApprovalFilters from "@/components/finance/ApprovalFilters";

// Organization interface
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
  submittedDate: string;
  status: "Pending" | "Approved" | "Rejected";
  contactName?: string;
  contactEmail?: string;
  missingInfo?: string[];
}

// Mock data for pending organizations
const mockPendingOrganizations: Organization[] = [];

export default function FinanceApprovalsPage() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useAuth();
  const {} = useSidebar();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>(
    mockPendingOrganizations
  );

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  // Filter organizations based on search term and filters
  const filteredOrganizations = organizations
    .filter((org) => org.status === "Pending" || org.status === "Rejected") // Only show Pending and Rejected
    .filter((org) => {
      // Filter by search term
      const matchesSearch =
        searchTerm === "" ||
        org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.contactName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.contactEmail?.toLowerCase().includes(searchTerm.toLowerCase());

      // Filter by status
      const matchesStatus =
        selectedStatus.length === 0 || selectedStatus.includes(org.status);

      // Filter by type
      const matchesType =
        selectedTypes.length === 0 || selectedTypes.includes(org.type);

      return matchesSearch && matchesStatus && matchesType;
    });

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Get type styles
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
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header userName={user?.name || "User"} />

        {/* Main Container */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <div className="container mx-auto space-y-6">
            <div className="mb-6">
              <Link
                href="/finance"
                className="text-orange-600 hover:text-orange-800 text-sm flex items-center mb-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Back to Finance
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">
                Organization Approvals
              </h1>
              <p className="text-gray-500">
                Review and approve new organizations before they can be used in
                the system
              </p>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-medium text-gray-900">
                  Pending Approvals
                </h3>
                <p className="text-3xl font-bold text-orange-600 mt-2">
                  {
                    organizations.filter((org) => org.status === "Pending")
                      .length
                  }
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-medium text-gray-900">Approved</h3>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {
                    organizations.filter((org) => org.status === "Approved")
                      .length
                  }
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-medium text-gray-900">Rejected</h3>
                <p className="text-3xl font-bold text-red-600 mt-2">
                  {
                    organizations.filter((org) => org.status === "Rejected")
                      .length
                  }
                </p>
              </div>
            </div>

            {/* Search and filters */}
            <ApprovalFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedStatus={selectedStatus}
              onStatusChange={setSelectedStatus}
              selectedTypes={selectedTypes}
              onTypesChange={setSelectedTypes}
            />

            {/* Organizations list */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Organization
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
                        Submitted Date
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
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredOrganizations.length > 0 ? (
                      filteredOrganizations.map((org) => (
                        <tr key={org.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {org.name}
                                </div>
                                {org.missingInfo &&
                                  org.missingInfo.length > 0 && (
                                    <div className="text-xs text-red-500 mt-1">
                                      Missing: {org.missingInfo.join(", ")}
                                    </div>
                                  )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-block px-2.5 py-1 text-xs font-medium rounded-md border ${getTypeStyles(
                                org.type
                              )}`}
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
                              {new Date(org.submittedDate).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <StatusBadge status={org.status as StatusType} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {org.contactName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {org.contactEmail}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Link href={`/finance/approvals/${org.id}`}>
                              <Button variant="outline" size="sm">
                                Review
                              </Button>
                            </Link>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={7}
                          className="px-6 py-4 text-center text-gray-500"
                        >
                          No organizations found matching your filters
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
