import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { HURRequest } from "./mockData";
import HURStatusBadge from "./HURStatusBadge";
import Link from "next/link";
import { useSidebar } from "@/contexts/SidebarContext";
import useTruncate from "@/hooks/useTruncate";
import { useRouter } from "next/navigation";

interface HURTableProps {
  data: HURRequest[];
}

const HURTable: React.FC<HURTableProps> = ({ data }) => {
  const { isCollapsed } = useSidebar();
  const truncateLength = useTruncate(30, isCollapsed);
  const router = useRouter();

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

  // Format date
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  // Get media type tag styles
  const getMediaTypeStyles = (mediaType: string) => {
    switch (mediaType) {
      case "Online":
        return "bg-blue-50 text-blue-700 border-blue-100";
      case "Print":
        return "bg-purple-50 text-purple-700 border-purple-100";
      case "Broadcast":
        return "bg-pink-50 text-pink-700 border-pink-100";
      case "Out of Home":
        return "bg-amber-50 text-amber-700 border-amber-100";
      default:
        return "bg-gray-50 text-gray-700 border-gray-100";
    }
  };

  // Truncate text
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  // Handle row click to navigate to HUR detail
  const handleRowClick = (hurId: string) => {
    router.push(`/hur/${hurId}`);
  };

  return (
    <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-x-auto">
      <div className="min-w-[1200px]">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="w-[100px] text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                ID
              </TableHead>
              <TableHead className="w-[280px] text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Campaign
              </TableHead>
              <TableHead className="w-[120px] text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Media Type
              </TableHead>
              <TableHead className="w-[100px] text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Period
              </TableHead>
              <TableHead className="w-[150px] text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Billing Office
              </TableHead>
              <TableHead className="w-[150px] text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Request Date
              </TableHead>
              <TableHead className="w-[150px] text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Requester
              </TableHead>
              <TableHead className="w-[150px] text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Current Amount
              </TableHead>
              <TableHead className="w-[150px] text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                New Amount
              </TableHead>
              <TableHead className="w-[150px] text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Difference
              </TableHead>
              <TableHead className="w-[150px] text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((request) => (
              <TableRow
                key={request.id}
                className="hover:bg-orange-50 cursor-pointer transition-colors"
                onClick={() => handleRowClick(request.id)}
              >
                <TableCell className="font-medium whitespace-nowrap">
                  {request.id}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <span
                    className="text-orange-600 font-medium truncate max-w-[260px]"
                    title={request.campaignName}
                  >
                    {truncateText(request.campaignName, truncateLength)}
                  </span>
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getMediaTypeStyles(
                      request.mediaType
                    )}`}
                  >
                    {request.mediaType}
                  </span>
                </TableCell>
                <TableCell>
                  {request.month}/{request.year}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {request.billingOffice}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {formatDate(request.requestDate)}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {request.requester}
                </TableCell>
                <TableCell>{formatCurrency(request.currentAmount)}</TableCell>
                <TableCell>{formatCurrency(request.newAmount)}</TableCell>
                <TableCell>
                  <span
                    className={
                      request.newAmount - request.currentAmount > 0
                        ? "text-green-600"
                        : request.newAmount - request.currentAmount < 0
                        ? "text-red-600"
                        : ""
                    }
                  >
                    {formatCurrency(request.newAmount - request.currentAmount)}
                  </span>
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <HURStatusBadge status={request.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default HURTable;
