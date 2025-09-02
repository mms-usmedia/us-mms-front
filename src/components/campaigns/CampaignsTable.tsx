import React, { useState, useMemo } from "react";
import Link from "next/link";
import StatusBadge from "@/components/ui/StatusBadge";
import useTruncate from "@/hooks/useTruncate";
import { useSidebar } from "@/contexts/SidebarContext";

// Types for campaigns
export interface Campaign {
  id: string;
  name: string;
  organizationName: string;
  campaignType: "IO-based" | "Programmatic";
  organizationType:
    | "Agency"
    | "Advertiser"
    | "Publisher"
    | "Holding Agency"
    | "Direct"
    | "Holding Advertiser";
  startDate: string;
  endDate: string;
  status:
    | "Pending"
    | "Pending Organization Approval"
    | "Negotiating"
    | "Won"
    | "Approved"
    | "Materials & Creatives OK"
    | "Implementation"
    | "Delivery"
    | "Live"
    | "Closed"
    | "HUR"
    | "Invoiced";
  units: number;
  budget: number;
  grossMargin: number;
}

interface CampaignsTableProps {
  campaigns: Campaign[];
  onCampaignClick?: (campaign: Campaign) => void;
  showCreateReport?: boolean;
}

const CampaignsTable = ({
  campaigns,
  onCampaignClick,
  showCreateReport = false,
}: CampaignsTableProps) => {
  const { isCollapsed } = useSidebar();
  const [sortField, setSortField] = useState<string>("id");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Usar el hook personalizado para el truncamiento
  const nameTruncateLength = useTruncate(40, isCollapsed);

  // Función para manejar el ordenamiento
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Ordenar campañas
  const sortedCampaigns = useMemo(() => {
    return [...campaigns].sort((a, b) => {
      let aValue = a[sortField as keyof Campaign];
      let bValue = b[sortField as keyof Campaign];

      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
      }
      if (typeof bValue === "string") {
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [campaigns, sortField, sortDirection]);

  // Funciones de formato
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US").format(num);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);
    return `${month}/${day}/${year}`;
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  // Estilos para tipos de organización
  const getOrganizationTypeStyles = (type: string) => {
    switch (type) {
      case "Agency":
        return "bg-blue-50 text-blue-700 border-blue-100";
      case "Advertiser":
        return "bg-green-50 text-green-700 border-green-100";
      case "Publisher":
        return "bg-purple-50 text-purple-700 border-purple-100";
      case "Holding Agency":
        return "bg-indigo-50 text-indigo-700 border-indigo-100";
      case "Direct":
        return "bg-yellow-50 text-yellow-700 border-yellow-100";
      case "Holding Advertiser":
        return "bg-pink-50 text-pink-700 border-pink-100";
      default:
        return "bg-gray-50 text-gray-700 border-gray-100";
    }
  };

  // Estilos para tipos de campaña
  const getCampaignTypeStyles = (type: string) => {
    switch (type) {
      case "IO-based":
        return "bg-orange-50 text-orange-700 border-orange-100";
      case "Programmatic":
        return "bg-teal-50 text-teal-700 border-teal-100";
      default:
        return "bg-gray-50 text-gray-700 border-gray-100";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 ease-in-out">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 transition-all duration-300 ease-in-out table-fixed">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-orange-700 transition-colors w-20"
                onClick={() => handleSort("id")}
              >
                <div className="whitespace-nowrap flex items-center">
                  ID
                  {sortField === "id" && (
                    <span className="ml-1">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-orange-700 transition-colors w-48"
                onClick={() => handleSort("name")}
              >
                <div className="whitespace-nowrap flex items-center">
                  Campaign
                  {sortField === "name" && (
                    <span className="ml-1">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-orange-700 transition-colors w-44"
                onClick={() => handleSort("organizationName")}
              >
                <div className="whitespace-nowrap flex items-center">
                  Organization
                  {sortField === "organizationName" && (
                    <span className="ml-1">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-orange-700 transition-colors w-28"
                onClick={() => handleSort("campaignType")}
              >
                <div className="whitespace-nowrap flex items-center">
                  Campaign Type
                  {sortField === "campaignType" && (
                    <span className="ml-1">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-orange-700 transition-colors w-28"
                onClick={() => handleSort("organizationType")}
              >
                <div className="whitespace-nowrap flex items-center">
                  Type
                  {sortField === "organizationType" && (
                    <span className="ml-1">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-orange-700 transition-colors w-28"
                onClick={() => handleSort("startDate")}
              >
                <div className="whitespace-nowrap flex items-center">
                  Start Date
                  {sortField === "startDate" && (
                    <span className="ml-1">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-orange-700 transition-colors w-24"
                onClick={() => handleSort("endDate")}
              >
                <div className="whitespace-nowrap flex items-center">
                  End Date
                  {sortField === "endDate" && (
                    <span className="ml-1">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-orange-700 transition-colors w-24"
                onClick={() => handleSort("units")}
              >
                <div className="whitespace-nowrap flex items-center">
                  Units
                  {sortField === "units" && (
                    <span className="ml-1">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-orange-700 transition-colors w-24"
                onClick={() => handleSort("budget")}
              >
                <div className="whitespace-nowrap flex items-center">
                  Budget
                  {sortField === "budget" && (
                    <span className="ml-1">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-orange-700 transition-colors w-20"
                onClick={() => handleSort("grossMargin")}
              >
                <div className="whitespace-nowrap flex items-center">
                  % GM
                  {sortField === "grossMargin" && (
                    <span className="ml-1">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-24"
              >
                Status
              </th>
              {showCreateReport && (
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-24"
                >
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedCampaigns.length === 0 ? (
              <tr>
                <td
                  colSpan={showCreateReport ? 12 : 11}
                  className="px-6 py-4 text-center text-gray-500"
                >
                  No campaigns found
                </td>
              </tr>
            ) : (
              sortedCampaigns.map((campaign) => (
                <tr
                  key={campaign.id}
                  className="hover:bg-gray-50 transition-colors"
                  style={{ cursor: "default" }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      href={`/campaigns/${campaign.id}`}
                      className="text-orange-600 hover:text-orange-900 font-medium hover:underline transition-colors"
                    >
                      {campaign.id}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {truncateText(campaign.name, nameTruncateLength)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {campaign.organizationName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getCampaignTypeStyles(
                        campaign.campaignType
                      )}`}
                    >
                      {campaign.campaignType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getOrganizationTypeStyles(
                        campaign.organizationType
                      )}`}
                    >
                      {campaign.organizationType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(campaign.startDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(campaign.endDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatNumber(campaign.units)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(campaign.budget)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {campaign.grossMargin}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={campaign.status} />
                  </td>
                  {showCreateReport && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => onCampaignClick?.(campaign)}
                        className="text-orange-600 hover:text-orange-900 text-sm font-medium"
                      >
                        Create Report
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CampaignsTable;
