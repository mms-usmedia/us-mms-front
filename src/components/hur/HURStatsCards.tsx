import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { HURRequest } from "./mockData";

interface HURStatsCardsProps {
  data: HURRequest[];
}

const HURStatsCards: React.FC<HURStatsCardsProps> = ({ data }) => {
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Calculate total number of HUR requests
  const totalRequests = data.length;

  // Calculate number of pending HUR requests (Review, More Info, Approved, Remove Invoice, Re-open Campaign, Editing, Close Campaign, Close Invoice Period)
  const pendingRequests = data.filter(
    (request) =>
      request.status === "Review" ||
      request.status === "More Info" ||
      request.status === "Approved" ||
      request.status === "Remove Invoice" ||
      request.status === "Re-open Campaign" ||
      request.status === "Editing" ||
      request.status === "Close Campaign" ||
      request.status === "Close Invoice Period"
  ).length;

  // Calculate number of completed HUR requests
  const completedRequests = data.filter(
    (request) => request.status === "Completed"
  ).length;

  // Calculate number of rejected HUR requests
  const rejectedRequests = data.filter(
    (request) => request.status === "Not Approved"
  ).length;

  // Removed Total Adjusted per new HUR model (not all changes affect amounts)

  // Calculate percentages for visualization
  const pendingPercentage =
    Math.round((pendingRequests / totalRequests) * 100) || 0;
  const completedPercentage =
    Math.round((completedRequests / totalRequests) * 100) || 0;
  const rejectedPercentage =
    Math.round((rejectedRequests / totalRequests) * 100) || 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
        <CardContent className="p-0">
          <div className="p-6 relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-orange-500"></div>
            <div className="pl-4">
              <p className="text-sm font-medium text-gray-500 mb-1">
                Total Requests
              </p>
              <div className="flex items-baseline">
                <h2 className="text-3xl font-bold text-gray-900">
                  {totalRequests}
                </h2>
                <span className="ml-2 text-xs font-medium text-gray-500">
                  HURs
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
        <CardContent className="p-0">
          <div className="p-6 relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
            <div className="pl-4">
              <p className="text-sm font-medium text-gray-500 mb-1">Pending</p>
              <div className="flex items-baseline">
                <h2 className="text-3xl font-bold text-amber-600">
                  {pendingRequests}
                </h2>
                <span className="ml-2 text-xs font-medium text-gray-500">
                  HURs
                </span>
              </div>
              <p className="text-xs font-medium text-amber-600 mt-2">
                {pendingPercentage}% of total
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
        <CardContent className="p-0">
          <div className="p-6 relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
            <div className="pl-4">
              <p className="text-sm font-medium text-gray-500 mb-1">
                Completed
              </p>
              <div className="flex items-baseline">
                <h2 className="text-3xl font-bold text-green-600">
                  {completedRequests}
                </h2>
                <span className="ml-2 text-xs font-medium text-gray-500">
                  HURs
                </span>
              </div>
              <p className="text-xs font-medium text-green-600 mt-2">
                {completedPercentage}% of total
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
        <CardContent className="p-0">
          <div className="p-6 relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
            <div className="pl-4">
              <p className="text-sm font-medium text-gray-500 mb-1">Rejected</p>
              <div className="flex items-baseline">
                <h2 className="text-3xl font-bold text-red-600">
                  {rejectedRequests}
                </h2>
                <span className="ml-2 text-xs font-medium text-gray-500">
                  HURs
                </span>
              </div>
              <p className="text-xs font-medium text-red-600 mt-2">
                {rejectedPercentage}% of total
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Removed Total Adjusted card per new requirements */}
    </div>
  );
};

export default HURStatsCards;
