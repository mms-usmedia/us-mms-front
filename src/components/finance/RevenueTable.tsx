import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Filter, Download, ChevronDown } from "lucide-react";
import { useSidebar } from "@/contexts/SidebarContext";
import useTruncate from "@/hooks/useTruncate";

// Types for the revenue data
export interface RevenueData {
  id: number;
  division: string;
  campaignId: string;
  month: string;
  year: string;
  account: string;
  partOfHolding: string;
  holdingName: string;
  advertiser: string;
  product: string;
  publisher: string;
  publisherProduct: string;
  serviceType: string;
  purchaseType: string;
  salesPerson: string;
  billingOffice: string;
  billingCountry: string;
  market?: string;
  currency: string;
  exchangeRate: string;
  fxCorporate?: string;
  fxMonthlyAverage?: string;
  grossRevenue: string;
  avb?: string;
  tax?: string;
  avbThirdParty?: string;
  publisherCost: string;
  hiddenCosts: string;
  netRevenue: string;
  margin: string;
  campaignDescription: string;
  internalNotes: string;
  hasHUR?: boolean;
  revenueLocal?: string;
  publisherCostLocal?: string;
  avbProvisionLocal?: string;
  taxAmountLocal?: string;
  otherProvisionThirdPartyLocal?: string;
}

interface RevenueTableProps {
  data: RevenueData[];
}

export const RevenueTable: React.FC<RevenueTableProps> = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState<RevenueData[]>(data);
  const { isCollapsed } = useSidebar();
  const maxLength = useTruncate(50, isCollapsed);

  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(
    {
      division: true,
      campaignId: true,
      month: true,
      year: true,
      account: true,
      partOfHolding: true,
      holdingName: true,
      advertiser: true,
      product: true,
      publisher: true,
      publisherProduct: true,
      serviceType: true,
      purchaseType: true,
      salesPerson: true,
      billingOffice: true,
      billingCountry: true,
      currency: true,
      exchangeRate: true,
      grossRevenue: true,
      publisherCost: true,
      hiddenCosts: true,
      netRevenue: true,
      margin: true,
      campaignDescription: true,
      internalNotes: true,
    }
  );

  // Filter data based on search term
  React.useEffect(() => {
    const filtered = data.filter((item) => {
      return (
        item.account.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.advertiser.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.publisher.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.campaignId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    setFilteredData(filtered);
  }, [searchTerm, data]);

  // Toggle column visibility
  const toggleColumn = (columnName: string) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [columnName]: !prev[columnName],
    }));
  };

  // Helper function to get division color
  const getDivisionColor = (division: string) => {
    switch (division) {
      case "Online":
        return "bg-blue-100 text-blue-800";
      case "OOH":
        return "bg-yellow-100 text-yellow-800";
      case "Broadcast":
        return "bg-green-100 text-green-800";
      case "Print":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Helper function to get service type color
  const getServiceTypeColor = (serviceType: string) => {
    switch (serviceType) {
      case "Representación Comercial":
        return "bg-blue-100 text-blue-800";
      case "Servicio de Medios (IMB)":
        return "bg-indigo-100 text-indigo-800";
      case "Prefered Ad Services (PAS)":
        return "bg-purple-100 text-purple-800";
      case "Clearing House":
        return "bg-green-100 text-green-800";
      case "Mobile Performance":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Helper function to get purchase type color
  const getPurchaseTypeColor = (purchaseType: string) => {
    switch (purchaseType) {
      case "IO-Based":
        return "bg-blue-100 text-blue-800";
      case "Programmatic":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Helper function to truncate text
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return `${text.substring(0, maxLength)}...`;
  };

  return (
    <table className="min-w-full divide-y divide-gray-200 table-fixed">
      <thead className="bg-gray-50">
        <tr>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
          >
            Billing Country
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
          >
            Month
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
          >
            Year
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
          >
            Division
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
          >
            Market
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
          >
            Salesman
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
          >
            Account
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
          >
            Part of a Holding
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
          >
            Holding Name
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
          >
            Campaign ID
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
          >
            HUR
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
          >
            Publisher Name
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
          >
            Product
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
          >
            Advertiser
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
          >
            Publisher Product
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
          >
            Service Type
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
          >
            Purchase Type
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
          >
            Currency
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
          >
            FX Corporate
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
          >
            FX Montly Average
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider"
          >
            To Invoice / Revenue
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider"
          >
            AVB
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider"
          >
            Tax
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider"
          >
            AVB 3rd Party
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider"
          >
            Publisher Cost
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider"
          >
            Net Revenue / Margin
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider"
          >
            Margin%
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
          >
            Campaign Description
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
          >
            Internal Notes
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider"
          >
            Revenue in Local Currency
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider"
          >
            Publisher Cost in Local Currency
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider"
          >
            AVB Provision in Local Currency
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider"
          >
            Tax Amount in Local Currency
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider"
          >
            Amount Other provision 3rd Party in local Currency
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {filteredData.map((row) => (
          <tr key={row.id} className="hover:bg-gray-50 transition-colors">
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
              {row.billingCountry}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
              {row.month}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
              {row.year}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getDivisionColor(
                  row.division
                )}`}
              >
                {row.division}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
              {row.market || "-"}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
              {row.salesPerson}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {row.account}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
              {row.partOfHolding}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
              {row.holdingName}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
              {row.campaignId}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm">
              {row.hasHUR ? (
                <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-rose-100 text-rose-800 border border-rose-200">
                  Yes
                </span>
              ) : (
                <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                  No
                </span>
              )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {row.publisher}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {row.product}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {row.advertiser}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
              {row.publisherProduct}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getServiceTypeColor(
                  row.serviceType
                )}`}
              >
                {row.serviceType}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getPurchaseTypeColor(
                  row.purchaseType
                )}`}
              >
                {row.purchaseType}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
              {row.currency}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
              {row.fxCorporate || row.exchangeRate}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
              {row.fxMonthlyAverage || row.exchangeRate}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-right font-medium">
              {row.grossRevenue}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-right font-medium">
              {row.avb ?? row.hiddenCosts}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-right font-medium">
              {row.tax ?? "$0.00"}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-right font-medium">
              {row.avbThirdParty ?? "$0.00"}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-right font-medium">
              {row.publisherCost}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-right font-medium">
              {row.netRevenue}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-right font-medium">
              {row.margin}
            </td>
            <td
              className="px-6 py-4 whitespace-nowrap text-sm text-gray-700"
              title={row.campaignDescription}
            >
              {truncateText(row.campaignDescription, maxLength)}
            </td>
            <td
              className="px-6 py-4 whitespace-nowrap text-sm text-gray-700"
              title={row.internalNotes}
            >
              {truncateText(row.internalNotes, maxLength)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-right font-medium">
              {row.revenueLocal || "-"}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-right font-medium">
              {row.publisherCostLocal || "-"}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-right font-medium">
              {row.avbProvisionLocal || "-"}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-right font-medium">
              {row.taxAmountLocal || "-"}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-right font-medium">
              {row.otherProvisionThirdPartyLocal || "-"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default RevenueTable;
