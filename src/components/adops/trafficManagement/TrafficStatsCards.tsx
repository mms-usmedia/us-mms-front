import React from "react";
import { Card } from "@/components/ui/card";
import { TrafficCampaign } from "./mockData";
import { Clock, CheckCircle2, AlertCircle, FileCheck } from "lucide-react";

interface TrafficStatsCardsProps {
  data: TrafficCampaign[];
}

const TrafficStatsCards: React.FC<TrafficStatsCardsProps> = ({ data }) => {
  // Count campaigns by status
  const pendingCount = data.filter(
    (campaign) => campaign.status === "Materials & Creatives OK"
  ).length;

  const implementationCount = data.filter(
    (campaign) => campaign.status === "Implementation"
  ).length;

  const liveCount = data.filter(
    (campaign) => campaign.status === "Live"
  ).length;

  const issuesCount = data.filter(
    (campaign) =>
      campaign.status === "Materials & Creatives OK" &&
      !campaign.documents.creativeAssets
  ).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card className="bg-white border-gray-100 shadow-sm p-4 flex items-center">
        <div className="rounded-full bg-blue-50 p-3 mr-4">
          <Clock className="h-6 w-6 text-blue-500" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Pending</p>
          <h3 className="text-2xl font-bold text-gray-900">{pendingCount}</h3>
        </div>
      </Card>

      <Card className="bg-white border-gray-100 shadow-sm p-4 flex items-center">
        <div className="rounded-full bg-amber-50 p-3 mr-4">
          <FileCheck className="h-6 w-6 text-amber-500" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Implementation</p>
          <h3 className="text-2xl font-bold text-gray-900">
            {implementationCount}
          </h3>
        </div>
      </Card>

      <Card className="bg-white border-gray-100 shadow-sm p-4 flex items-center">
        <div className="rounded-full bg-green-50 p-3 mr-4">
          <CheckCircle2 className="h-6 w-6 text-green-500" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Live</p>
          <h3 className="text-2xl font-bold text-gray-900">{liveCount}</h3>
        </div>
      </Card>

      <Card className="bg-white border-gray-100 shadow-sm p-4 flex items-center">
        <div className="rounded-full bg-red-50 p-3 mr-4">
          <AlertCircle className="h-6 w-6 text-red-500" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Issues</p>
          <h3 className="text-2xl font-bold text-gray-900">{issuesCount}</h3>
        </div>
      </Card>
    </div>
  );
};

export default TrafficStatsCards;
