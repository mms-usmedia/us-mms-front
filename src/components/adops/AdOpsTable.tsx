import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AdOpsItem } from "./mockData";
import StatusBadge from "@/components/ui/StatusBadge";

interface AdOpsTableProps {
  data: AdOpsItem[];
}

const AdOpsTable = ({ data }: AdOpsTableProps) => {
  // Format currency
  const formatCurrency = (amount: number) => {
    if (amount === undefined || amount === null) return "-";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Format large numbers with commas
  const formatNumber = (num: number) => {
    if (num === undefined || num === null) return "-";
    return new Intl.NumberFormat("en-US").format(num);
  };

  // Format percentage
  const formatPercentage = (value: number | undefined | null) => {
    if (value === undefined || value === null) return "-";
    return `${value.toFixed(2)}%`;
  };

  // Get product type tag styles
  const getProductTypeStyles = (productType: string) => {
    switch (productType) {
      case "PAS":
        return "bg-blue-50 text-blue-700 border-blue-100";
      case "Fandom":
        return "bg-purple-50 text-purple-700 border-purple-100";
      case "Sojern":
        return "bg-pink-50 text-pink-700 border-pink-100";
      case "WeTransfer":
        return "bg-amber-50 text-amber-700 border-amber-100";
      case "Tinder":
        return "bg-red-50 text-red-700 border-red-100";
      case "Vevo":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "Magnite":
        return "bg-indigo-50 text-indigo-700 border-indigo-100";
      case "OneFootball":
        return "bg-cyan-50 text-cyan-700 border-cyan-100";
      default:
        return "bg-gray-50 text-gray-700 border-gray-100";
    }
  };

  // Get final report tag styles
  const getFinalReportStyles = (finalReport: boolean) => {
    return finalReport
      ? "bg-green-50 text-green-700 border-green-100"
      : "bg-amber-50 text-amber-700 border-amber-100";
  };

  // Get campaign type tag styles
  const getCampaignTypeStyles = (campaignType: string) => {
    switch (campaignType) {
      case "Branding":
        return "bg-blue-50 text-blue-700 border-blue-100";
      case "Performance":
        return "bg-purple-50 text-purple-700 border-purple-100";
      case "Promotional":
        return "bg-pink-50 text-pink-700 border-pink-100";
      case "Awareness":
        return "bg-amber-50 text-amber-700 border-amber-100";
      case "Engagement":
        return "bg-red-50 text-red-700 border-red-100";
      case "Seasonal":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "Launch":
        return "bg-indigo-50 text-indigo-700 border-indigo-100";
      default:
        return "bg-gray-50 text-gray-700 border-gray-100";
    }
  };

  // Get purchase type tag styles
  const getPurchaseTypeStyles = (purchaseType: string) => {
    switch (purchaseType) {
      case "CPM":
        return "bg-blue-50 text-blue-700 border-blue-100";
      case "CPV":
        return "bg-purple-50 text-purple-700 border-purple-100";
      case "CPE":
        return "bg-pink-50 text-pink-700 border-pink-100";
      case "CPL":
        return "bg-amber-50 text-amber-700 border-amber-100";
      default:
        return "bg-gray-50 text-gray-700 border-gray-100";
    }
  };

  // Get currency symbol
  const getCurrencySymbol = (currency: string) => {
    switch (currency) {
      case "USD":
        return "$";
      case "EUR":
        return "€";
      case "GBP":
        return "£";
      case "JPY":
        return "¥";
      case "MXN":
        return "$";
      default:
        return currency;
    }
  };

  // Get trafficker tag styles
  const getTraffickerStyles = (trafficker: string) => {
    // Asignar colores según el nombre del trafficker
    const firstLetter = trafficker.charAt(0).toLowerCase();
    if (firstLetter >= "a" && firstLetter <= "e") {
      return "bg-teal-50 text-teal-700 border-teal-100";
    } else if (firstLetter >= "f" && firstLetter <= "j") {
      return "bg-orange-50 text-orange-700 border-orange-100";
    } else if (firstLetter >= "k" && firstLetter <= "o") {
      return "bg-indigo-50 text-indigo-700 border-indigo-100";
    } else if (firstLetter >= "p" && firstLetter <= "t") {
      return "bg-rose-50 text-rose-700 border-rose-100";
    } else {
      return "bg-cyan-50 text-cyan-700 border-cyan-100";
    }
  };

  // Get advertiser tag styles
  const getAdvertiserStyles = (advertiser: string) => {
    // Asignar colores según el nombre del advertiser
    const firstLetter = advertiser.charAt(0).toLowerCase();
    if (firstLetter >= "a" && firstLetter <= "e") {
      return "bg-blue-50 text-blue-700 border-blue-100";
    } else if (firstLetter >= "f" && firstLetter <= "j") {
      return "bg-violet-50 text-violet-700 border-violet-100";
    } else if (firstLetter >= "k" && firstLetter <= "o") {
      return "bg-emerald-50 text-emerald-700 border-emerald-100";
    } else if (firstLetter >= "p" && firstLetter <= "t") {
      return "bg-amber-50 text-amber-700 border-amber-100";
    } else {
      return "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-100";
    }
  };

  // Get publisher tag styles
  const getPublisherStyles = (publisher: string) => {
    // Asignar colores según el nombre del publisher
    switch (publisher.toLowerCase()) {
      case "facebook":
        return "bg-blue-50 text-blue-700 border-blue-100";
      case "youtube":
        return "bg-red-50 text-red-700 border-red-100";
      case "google ads":
        return "bg-yellow-50 text-yellow-700 border-yellow-100";
      case "instagram":
        return "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-100";
      case "tiktok":
        return "bg-slate-100 text-slate-800 border-slate-200";
      case "spotify":
        return "bg-green-50 text-green-700 border-green-100";
      default:
        return "bg-purple-50 text-purple-700 border-purple-100";
    }
  };

  return (
    <div className="w-full">
      <table className="min-w-full divide-y divide-gray-200 transition-all duration-300 ease-in-out">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
              Product Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
              Month
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
              Sales Person
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
              Drive Link
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
              Final Report
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
              Notes
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
              Trafficker
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
              Advertiser
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
              MMS ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
              MMS Line
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
              Boostr/GAM ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
              Start Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
              End Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
              Market
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
              Publisher/Platform
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
              Campaign Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
              Purchase Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
              Platform Currency
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
              Exchange Rate
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
              Campaign
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
              Format
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
              Campaign Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
              USMC Rate
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
              Publisher Unit Cost
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
              Total Investment USD
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
              Total Investment Publisher Currency
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
              Contracted Units
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
              Delivered Units
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
              Clicks
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
              Remaining Units
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
              Estimated Daily Delivery
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
              Effective Delivery Cost
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
              Daily Spend
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
              Delivery %
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
              Pacing
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
              Actual Platform Spend Local Currency
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
              Remaining Investment
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
              Actual Platform Spend USD
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
              Remaining Investment %
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
              Consumed Investment %
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
              Final Unit Cost Publisher Currency
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
              Final Unit Cost USD
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
              CTR
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
              VTR/VCR
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
              Viewability %
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
              Boostr Closure
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
              Total Campaign Days
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
              Total Elapsed Days
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
              Remaining Days
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
              Elapsed %
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.length > 0 ? (
            data.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${getProductTypeStyles(
                      item.productType
                    )}`}
                  >
                    {item.productType}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                  {item.month}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                  {item.salesPerson}
                </td>
                <td className="px-6 py-4 text-sm whitespace-nowrap">
                  <a
                    href={item.driveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-600 hover:underline"
                  >
                    Link
                  </a>
                </td>
                <td className="px-6 py-4 text-sm whitespace-nowrap">
                  <StatusBadge status={item.status} />
                </td>
                <td className="px-6 py-4 text-sm whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${getFinalReportStyles(
                      item.finalReport
                    )}`}
                  >
                    {item.finalReport ? "Yes" : "No"}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                  {item.notes}
                </td>
                <td className="px-6 py-4 text-sm whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${getTraffickerStyles(
                      item.trafficker
                    )}`}
                  >
                    {item.trafficker}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${getAdvertiserStyles(
                      item.advertiser
                    )}`}
                  >
                    {item.advertiser}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                  {item.mmsId}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                  {item.mmsLine}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                  {item.boostrGamId}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                  {new Date(item.startDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                  {new Date(item.endDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                  {item.market}
                </td>
                <td className="px-6 py-4 text-sm whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${getPublisherStyles(
                      item.publisher
                    )}`}
                  >
                    {item.publisher}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${getCampaignTypeStyles(
                      item.campaignType
                    )}`}
                  >
                    {item.campaignType}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${getPurchaseTypeStyles(
                      item.purchaseType
                    )}`}
                  >
                    {item.purchaseType}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-green-50 text-green-800">
                    {getCurrencySymbol(item.platformCurrency)}{" "}
                    {item.platformCurrency}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                  {item.exchangeRate}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                  {item.campaign}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                  {item.format}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                  {item.campaignName}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                  {item.usmcRate}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                  {item.publisherUnitCost}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                  {formatCurrency(item.totalInvestmentUsd)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                  {formatCurrency(item.totalInvestmentPublisherCurrency)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                  {formatNumber(item.contractedUnits)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                  {formatNumber(item.deliveredUnits)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                  {formatNumber(item.clicks)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                  {formatNumber(item.remainingUnits)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                  {formatNumber(item.estimatedDailyDelivery)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                  {item.effectiveDeliveryCost}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                  {formatCurrency(item.dailySpend)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                  {formatPercentage(item.deliveryPercentage)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                  {item.pacing}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                  {formatCurrency(item.actualPlatformSpendLocalCurrency)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                  {formatCurrency(item.remainingInvestment)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                  {formatCurrency(item.actualPlatformSpendUsd)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                  {formatPercentage(item.remainingInvestmentPercentage)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                  {formatPercentage(item.consumedInvestmentPercentage)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                  {item.finalUnitCostPublisherCurrency}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                  {item.finalUnitCostUsd}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                  {formatPercentage(item.ctr)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                  {formatPercentage(item.vtr)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                  {formatPercentage(item.viewabilityPercentage)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                  {item.boostrClosure}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                  {item.totalCampaignDays}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                  {item.totalElapsedDays}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                  {item.remainingDays}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                  {formatPercentage(item.elapsedPercentage)}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={45}
                className="px-6 py-10 text-center text-gray-500 text-sm"
              >
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdOpsTable;
