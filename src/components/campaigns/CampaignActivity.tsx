// /src/components/campaigns/CampaignActivity.tsx
import React from "react";
import { Campaign } from "./types";
import { formatDate } from "./utils";

interface CampaignActivityProps {
  campaign: Campaign;
}

const CampaignActivity: React.FC<CampaignActivityProps> = ({ campaign }) => {
  return (
    <div className="bg-white shadow-sm border border-gray-100 rounded-b-xl p-6">
      <h2 className="text-lg font-medium text-purple-900 mb-6 flex items-center">
        <svg
          className="h-5 w-5 mr-2 text-purple-500"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
            clipRule="evenodd"
          />
        </svg>
        Activity History
      </h2>
      <div className="relative p-4 bg-gradient-to-b from-purple-50 to-white rounded-xl border border-purple-100">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-0.5 h-full bg-purple-200 mx-auto"></div>
        </div>
        <div className="relative space-y-8">
          <div className="relative flex items-center group">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center ring-8 ring-white shadow-sm group-hover:shadow-md transition-all">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <div className="ml-6 min-w-0 flex-1 bg-white p-4 rounded-lg shadow-sm border border-gray-100 group-hover:shadow-md transition-all">
              <div className="text-sm font-medium text-gray-900">
                Campaign created
              </div>
              <div className="mt-1 text-sm text-gray-500">
                <span className="font-medium text-purple-600">Admin</span>
                <span className="mx-2 text-gray-300">•</span>
                <time className="text-gray-700">
                  {formatDate(campaign.startDate)}
                </time>
              </div>
            </div>
          </div>

          <div className="relative flex items-center group">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center ring-8 ring-white shadow-sm group-hover:shadow-md transition-all">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div className="ml-6 min-w-0 flex-1 bg-white p-4 rounded-lg shadow-sm border border-gray-100 group-hover:shadow-md transition-all">
              <div className="text-sm font-medium text-gray-900">
                Status updated to{" "}
                <span className="font-semibold text-emerald-600">
                  "{campaign.status}"
                </span>
              </div>
              <div className="mt-1 text-sm text-gray-500">
                <span className="font-medium text-purple-600">
                  {campaign.salesperson || "Admin"}
                </span>
                <span className="mx-2 text-gray-300">•</span>
                <time className="text-gray-700">
                  {formatDate(new Date().toISOString())}
                </time>
              </div>
            </div>
          </div>

          <div className="relative flex items-center group">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center ring-8 ring-white shadow-sm group-hover:shadow-md transition-all">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
            </div>
            <div className="ml-6 min-w-0 flex-1 bg-white p-4 rounded-lg shadow-sm border border-gray-100 group-hover:shadow-md transition-all">
              <div className="text-sm font-medium text-gray-900">
                Campaign details updated
              </div>
              <div className="mt-1 text-sm text-gray-500">
                <span className="font-medium text-purple-600">
                  {campaign.accountManager || "Account Manager"}
                </span>
                <span className="mx-2 text-gray-300">•</span>
                <time className="text-gray-700">
                  {formatDate(new Date().toISOString())}
                </time>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignActivity;
