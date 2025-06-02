import React from "react";

const CampaignActivityEmpty: React.FC = () => {
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
      <div className="text-center py-10 px-6 bg-purple-50 rounded-xl border border-purple-100">
        <svg
          className="mx-auto h-12 w-12 text-purple-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <h3 className="mt-2 text-lg font-medium text-gray-900">
          No activity yet
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          The activity history will be generated once the campaign is created.
        </p>
      </div>
    </div>
  );
};

export default CampaignActivityEmpty;
