import React from "react";
import { X, Calendar, User, Building, Tag, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TrafficCampaign } from "./mockData";

interface CampaignDetailsModalProps {
  campaign: TrafficCampaign | null;
  onClose: () => void;
  onStatusChange: (campaignId: string, newStatus: string) => void;
}

const CampaignDetailsModal: React.FC<CampaignDetailsModalProps> = ({
  campaign,
  onClose,
  onStatusChange,
}) => {
  if (!campaign) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
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

  // Get document status badge
  const getDocumentStatusBadge = (isReady: boolean, label: string) => {
    return (
      <div className="flex items-center space-x-2 mb-2">
        <div
          className={`w-3 h-3 rounded-full ${
            isReady ? "bg-green-500" : "bg-gray-300"
          }`}
        ></div>
        <span className="text-sm text-gray-700">{label}</span>
        <span
          className={`ml-auto text-xs font-medium ${
            isReady ? "text-green-600" : "text-gray-500"
          }`}
        >
          {isReady ? "Received" : "Pending"}
        </span>
      </div>
    );
  };

  // Determine which status buttons to show based on current status
  const renderStatusButtons = () => {
    switch (campaign.status) {
      case "Materials Send":
        return (
          <Button
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
            onClick={() => onStatusChange(campaign.id, "Material Received")}
          >
            Mark Material Received
          </Button>
        );
      case "Material Received":
        return (
          <Button
            className="bg-amber-600 hover:bg-amber-700 text-white"
            onClick={() => onStatusChange(campaign.id, "Implementing")}
          >
            Start Implementing
          </Button>
        );
      case "Implementing":
        return (
          <Button
            className="bg-green-600 hover:bg-green-700 text-white"
            onClick={() => onStatusChange(campaign.id, "Live")}
          >
            Mark as Live
          </Button>
        );
      case "Live":
        return (
          <Button
            className="bg-cyan-600 hover:bg-cyan-700 text-white"
            onClick={() => onStatusChange(campaign.id, "Delivery")}
          >
            Move to Delivery
          </Button>
        );
      case "Delivery":
        return (
          <Button
            className="bg-gray-600 hover:bg-gray-700 text-white"
            onClick={() => onStatusChange(campaign.id, "Closed")}
          >
            Close Campaign
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div className="fixed inset-0 bg-black opacity-30"></div>
      <div
        className="relative bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto z-50"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Campaign Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Basic Information
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Campaign ID:</p>
                  <p className="text-base font-medium text-gray-900">
                    {campaign.campaignId}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Name:</p>
                  <p className="text-base font-medium text-gray-900">
                    {campaign.name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Format:</p>
                  <p className="text-base font-medium text-gray-900">
                    {campaign.format}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status:</p>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border ${getStatusBadgeStyles(
                      campaign.status
                    )}`}
                  >
                    {campaign.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Priority:</p>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border ${
                      campaign.priority === "High"
                        ? "bg-red-50 text-red-700 border-red-100"
                        : campaign.priority === "Medium"
                        ? "bg-orange-50 text-orange-700 border-orange-100"
                        : "bg-green-50 text-green-700 border-green-100"
                    }`}
                  >
                    {campaign.priority}
                  </span>
                </div>
              </div>
            </div>

            {/* Campaign Timing */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Campaign Timing
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Start Date:</p>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                    <p className="text-base font-medium text-gray-900">
                      {formatDate(campaign.startDate)}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">End Date:</p>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                    <p className="text-base font-medium text-gray-900">
                      {formatDate(campaign.endDate)}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Duration:</p>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-gray-400 mr-2" />
                    <p className="text-base font-medium text-gray-900">
                      {campaign.duration} days
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Trafficker:</p>
                  <div className="flex items-center">
                    <User className="h-4 w-4 text-gray-400 mr-2" />
                    <p className="text-base font-medium text-gray-900">
                      {campaign.trafficker}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            {/* Parties Involved */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Involved Parties
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Publisher:</p>
                  <div className="flex items-center">
                    <Building className="h-4 w-4 text-gray-400 mr-2" />
                    <p className="text-base font-medium text-gray-900">
                      {campaign.publisher.name}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500">
                    ID: {campaign.publisher.id}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Advertiser:</p>
                  <div className="flex items-center">
                    <Tag className="h-4 w-4 text-gray-400 mr-2" />
                    <p className="text-base font-medium text-gray-900">
                      {campaign.advertiser.name}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500">
                    ID: {campaign.advertiser.id}
                  </p>
                </div>
              </div>
            </div>

            {/* Documents Status */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Documents Status
              </h3>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                {getDocumentStatusBadge(
                  campaign.documents.clientIO,
                  "Client IO"
                )}
                {getDocumentStatusBadge(
                  campaign.documents.publisherIO,
                  "Publisher IO"
                )}
                {getDocumentStatusBadge(
                  campaign.documents.creativeAssets,
                  "Creative Assets"
                )}
              </div>
            </div>
          </div>

          {/* Notes */}
          {campaign.notes && (
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Notes</h3>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-sm text-gray-700">{campaign.notes}</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-8 flex justify-end space-x-4">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button
              variant="outline"
              className="border-orange-200 text-orange-600 hover:bg-orange-50"
            >
              View Full Campaign
            </Button>
            {renderStatusButtons()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetailsModal;
