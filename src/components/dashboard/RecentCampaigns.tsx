import React from "react";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import StatusBadge from "@/components/ui/StatusBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Campaign {
  id: string;
  name: string;
  client: string;
  dates: string;
  budget: number;
  status: "Active" | "Pending" | "Completed";
}

interface RecentCampaignsProps {
  className?: string;
}

export const RecentCampaigns: React.FC<RecentCampaignsProps> = ({
  className = "",
}) => {
  // Datos simulados de campañas recientes
  const campaigns: Campaign[] = [
    {
      id: "23584",
      name: "Fandom - Mercado Libre - Meliplay (MEX) - abr25",
      client: "Mercado Libre",
      dates: "4/6/2025 - 5/10/2025",
      budget: 37500,
      status: "Active",
    },
    {
      id: "23593",
      name: "Fandom - Carl's JR - Thunderbolts (MEX) - Abr25",
      client: "Carl's Jr",
      dates: "4/7/2025 - 4/27/2025",
      budget: 42800,
      status: "Pending",
    },
    {
      id: "23572",
      name: "Penafiel PAM_PENCOCO_WETRANSFER_MX_ABRIL_2025",
      client: "Penafiel",
      dates: "4/2/2025 - 4/29/2025",
      budget: 25400,
      status: "Completed",
    },
  ];

  // Función para formatear moneda
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card className={`p-5 ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Recent Campaigns</h3>
        <Link
          href="/campaigns"
          className="text-sm text-orange-600 hover:text-orange-800 font-medium flex items-center"
        >
          View All
          <svg
            className="w-4 h-4 ml-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 ease-in-out">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 transition-all duration-300 ease-in-out table-fixed">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-orange-700 transition-colors w-48"
                >
                  <div className="whitespace-nowrap flex items-center">
                    CAMPAIGN
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-orange-700 transition-colors"
                >
                  <div className="whitespace-nowrap flex items-center">
                    CLIENT
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-orange-700 transition-colors"
                >
                  <div className="whitespace-nowrap flex items-center">
                    DATES
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-orange-700 transition-colors"
                >
                  <div className="whitespace-nowrap flex items-center">
                    BUDGET
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                >
                  <div className="whitespace-nowrap flex items-center">
                    STATUS
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {campaigns.map((campaign) => (
                <tr
                  key={campaign.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-800">
                        #{campaign.id}
                      </span>
                      <Link
                        href={`/campaigns/${campaign.id}`}
                        className="text-orange-600 hover:text-orange-900 hover:underline text-sm"
                      >
                        {campaign.name}
                      </Link>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {campaign.client}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {campaign.dates}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(campaign.budget)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={campaign.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  );
};
