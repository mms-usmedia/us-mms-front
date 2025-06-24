"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useSidebar } from "@/contexts/SidebarContext";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import RevenueCard from "@/components/finance/RevenueCard";
import RevenueTable from "@/components/finance/RevenueTable";
import ExportButton from "@/components/finance/ExportButton";
import SearchFilter from "@/components/finance/SearchFilter";
import { mockRevenueData, revenueMetrics } from "@/components/finance/mockData";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function FinancePage() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useAuth();
  const {} = useSidebar();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDivisions, setSelectedDivisions] = useState<string[]>([]);
  const [selectedServiceTypes, setSelectedServiceTypes] = useState<string[]>(
    []
  );
  const [selectedPurchaseTypes, setSelectedPurchaseTypes] = useState<string[]>(
    []
  );
  const [filteredData, setFilteredData] = useState(mockRevenueData);
  const [currentPeriod, setCurrentPeriod] = useState("April 2025");

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  // Apply filters when criteria change
  useEffect(() => {
    let filtered = [...mockRevenueData];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.account.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.advertiser.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.publisher.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.campaignId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by division
    if (selectedDivisions.length > 0) {
      filtered = filtered.filter((item) =>
        selectedDivisions.includes(item.division)
      );
    }

    // Filter by service type
    if (selectedServiceTypes.length > 0) {
      filtered = filtered.filter((item) =>
        selectedServiceTypes.includes(item.serviceType)
      );
    }

    // Filter by purchase type
    if (selectedPurchaseTypes.length > 0) {
      filtered = filtered.filter((item) =>
        selectedPurchaseTypes.includes(item.purchaseType)
      );
    }

    setFilteredData(filtered);
  }, [
    searchTerm,
    selectedDivisions,
    selectedServiceTypes,
    selectedPurchaseTypes,
  ]);

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
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Revenue Report
                </h1>
                <p className="text-gray-500">
                  Comprehensive revenue report with detailed financial metrics
                  across all divisions
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Link href="/finance/approvals">
                  <Button variant="outline" className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    <span>Organization Approvals</span>
                    <span className="inline-flex items-center justify-center w-5 h-5 ml-1 text-xs font-semibold text-white bg-orange-500 rounded-full">
                      3
                    </span>
                  </Button>
                </Link>
                <ExportButton
                  data={filteredData}
                  filename={`revenue-report-${currentPeriod
                    .toLowerCase()
                    .replace(" ", "-")}`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <RevenueCard
                title="Gross Revenue"
                value={revenueMetrics.grossRevenue.value}
                change={revenueMetrics.grossRevenue.change}
                isPositive={revenueMetrics.grossRevenue.isPositive}
              />
              <RevenueCard
                title="Publisher Cost"
                value={revenueMetrics.publisherCost.value}
                change={revenueMetrics.publisherCost.change}
                isPositive={revenueMetrics.publisherCost.isPositive}
              />
              <RevenueCard
                title="Net Revenue"
                value={revenueMetrics.netRevenue.value}
                change={revenueMetrics.netRevenue.change}
                isPositive={revenueMetrics.netRevenue.isPositive}
              />
              <RevenueCard
                title="Average Margin"
                value={revenueMetrics.averageMargin.value}
                change={revenueMetrics.averageMargin.change}
                isPositive={revenueMetrics.averageMargin.isPositive}
              />
            </div>

            <SearchFilter
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedDivisions={selectedDivisions}
              onDivisionsChange={setSelectedDivisions}
              selectedServiceTypes={selectedServiceTypes}
              onServiceTypesChange={setSelectedServiceTypes}
              selectedPurchaseTypes={selectedPurchaseTypes}
              onPurchaseTypesChange={setSelectedPurchaseTypes}
              data={mockRevenueData}
              onPeriodChange={(period) => {
                setCurrentPeriod(period);
                console.log("Period changed:", period);
              }}
            />

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <RevenueTable data={filteredData} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
