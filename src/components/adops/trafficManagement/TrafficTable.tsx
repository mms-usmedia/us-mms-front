import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TrafficCampaign } from "./mockData";
import { Eye, FileText, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TrafficTableProps {
  data: TrafficCampaign[];
  onViewCampaign: (campaign: TrafficCampaign) => void;
}

const TrafficTable: React.FC<TrafficTableProps> = ({
  data,
  onViewCampaign,
}) => {
  // Format date to display in a readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-MX", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    });
  };

  // Get status badge styles
  const getStatusBadgeStyles = (status: string) => {
    switch (status) {
      case "Materials Send":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Material Received":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "Implementing":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "Live":
        return "bg-green-100 text-green-800 border-green-200";
      case "Delivery":
        return "bg-cyan-100 text-cyan-800 border-cyan-200";
      case "Closed":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Get priority badge styles
  const getPriorityBadgeStyles = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-50 text-red-700 border-red-100";
      case "Medium":
        return "bg-orange-50 text-orange-700 border-orange-100";
      case "Low":
        return "bg-green-50 text-green-700 border-green-100";
      default:
        return "bg-gray-50 text-gray-700 border-gray-100";
    }
  };

  // Get document status badge
  const getDocumentStatusBadge = (isReady: boolean) => {
    return isReady ? (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-50 text-green-700 border border-green-100">
        ✓
      </span>
    ) : (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-50 text-gray-400 border border-gray-100">
        -
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Campaign
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Publisher
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Advertiser
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Dates
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Priority
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Documents
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.length > 0 ? (
              data.map((campaign) => (
                <tr
                  key={campaign.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900">
                        {campaign.campaignId}
                      </span>
                      <span className="text-sm text-gray-700">
                        {campaign.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {campaign.format}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {campaign.publisher.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      ID: {campaign.publisher.id}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {campaign.advertiser.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDate(campaign.startDate)}
                    </div>
                    <div className="text-sm text-gray-900">
                      {formatDate(campaign.endDate)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {campaign.duration} días
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border ${getStatusBadgeStyles(
                        campaign.status
                      )}`}
                    >
                      {campaign.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border ${getPriorityBadgeStyles(
                        campaign.priority
                      )}`}
                    >
                      {campaign.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <div className="flex flex-col items-center">
                        <span className="text-xs text-gray-500">Client IO</span>
                        {getDocumentStatusBadge(campaign.documents.clientIO)}
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-xs text-gray-500">Pub IO</span>
                        {getDocumentStatusBadge(campaign.documents.publisherIO)}
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-xs text-gray-500">Creatives</span>
                        {getDocumentStatusBadge(
                          campaign.documents.creativeAssets
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onViewCampaign(campaign)}
                        className="hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={8}
                  className="px-6 py-10 text-center text-gray-500 text-sm"
                >
                  No hay campañas disponibles
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TrafficTable;
