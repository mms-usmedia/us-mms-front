import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/ui/StatusBadge";
import useTruncate from "@/hooks/useTruncate";
import { useSidebar } from "@/contexts/SidebarContext";

interface ReportHistoryItem {
  id: string;
  campaignId: string;
  campaign: string;
  publisher: string;
  advertiser: string;
  createdDate: string;
  createdBy: string;
  status: "Delivery";
}

interface TraffickerReportHistoryProps {
  onViewReport: (reportId: string) => void;
}

const mockReportHistory: ReportHistoryItem[] = [
  {
    id: "1",
    campaignId: "24147",
    campaign: "Samsung AO-SMB-SHOP_LinkedIn_Jul25",
    publisher: "LinkedIn",
    advertiser: "Samsung",
    createdDate: "2023-07-15",
    createdBy: "Ana García",
    status: "Delivery",
  },
  {
    id: "2",
    campaignId: "24146",
    campaign: "BBVA_Programa_Puntos_WETRANSFER_Animated_JUL_2025",
    publisher: "WeTransfer",
    advertiser: "BBVA",
    createdDate: "2023-07-10",
    createdBy: "Ana García",
    status: "Delivery",
  },
  {
    id: "3",
    campaignId: "24144",
    campaign: "Banorte_125 Aniversario Pyme_LinkedIn_Mex_Julio25",
    publisher: "LinkedIn",
    advertiser: "Banorte",
    createdDate: "2023-07-05",
    createdBy: "Roberto Sánchez",
    status: "Delivery",
  },
];

// Componente personalizado para el status badge con color para Delivery
const CompletedStatusBadge: React.FC<{ status: string }> = ({ status }) => {
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border shadow-sm bg-cyan-50 text-cyan-700 border-cyan-100 shadow-cyan-100 flex-shrink-0">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-3.5 w-3.5 mr-1"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clipRule="evenodd"
        />
      </svg>
      {status}
    </span>
  );
};

const TraffickerReportHistory = ({
  onViewReport,
}: TraffickerReportHistoryProps) => {
  const { isCollapsed } = useSidebar();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPublisher, setSelectedPublisher] = useState("");
  const [selectedAdvertiser, setSelectedAdvertiser] = useState("");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortField, setSortField] = useState<string>("campaignId");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Usar el hook personalizado para el truncamiento
  const campaignTruncateLength = useTruncate(40, isCollapsed);

  // Extraer publishers y advertisers únicos para los filtros
  const publishers = Array.from(
    new Set(mockReportHistory.map((report) => report.publisher))
  ).sort();

  const advertisers = Array.from(
    new Set(mockReportHistory.map((report) => report.advertiser))
  ).sort();

  // Función para manejar el ordenamiento
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Filtrar reportes
  const filteredReports = mockReportHistory.filter((report) => {
    const matchesSearch =
      report.campaign.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.campaignId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.publisher.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.advertiser.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPublisher = selectedPublisher
      ? report.publisher === selectedPublisher
      : true;
    const matchesAdvertiser = selectedAdvertiser
      ? report.advertiser === selectedAdvertiser
      : true;

    const reportDate = new Date(report.createdDate);
    const matchesStartDate = startDateFilter
      ? reportDate >= new Date(startDateFilter)
      : true;
    const matchesEndDate = endDateFilter
      ? reportDate <= new Date(endDateFilter)
      : true;

    return (
      matchesSearch &&
      matchesPublisher &&
      matchesAdvertiser &&
      matchesStartDate &&
      matchesEndDate
    );
  });

  // Ordenar reportes
  const sortedReports = [...filteredReports].sort((a, b) => {
    let aValue = a[sortField as keyof ReportHistoryItem];
    let bValue = b[sortField as keyof ReportHistoryItem];

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

  // Función para truncar texto
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  // Función para limpiar todos los filtros
  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedPublisher("");
    setSelectedAdvertiser("");
    setStartDateFilter("");
    setEndDateFilter("");
  };

  // Verificar si hay filtros activos
  const hasActiveFilters =
    searchTerm ||
    selectedPublisher ||
    selectedAdvertiser ||
    startDateFilter ||
    endDateFilter;

  return (
    <div className="w-full">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="flex flex-col space-y-4">
          {/* Search and Filter Toggle */}
          <div className="flex items-center space-x-2">
            {/* Search Input */}
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm text-gray-900 placeholder-gray-500 bg-gray-50"
                placeholder="Buscar reportes por campaña, ID, publisher..."
              />
            </div>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center px-3 py-2.5 rounded-lg shadow-sm border ${
                showFilters
                  ? "bg-orange-50 text-orange-700 border-orange-200"
                  : "bg-white text-orange-600 border-gray-200 hover:bg-gray-50"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                  clipRule="evenodd"
                />
              </svg>
              Filtros
              {hasActiveFilters && (
                <span className="ml-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-orange-100 text-xs font-medium text-orange-800">
                  {(searchTerm ? 1 : 0) +
                    (selectedPublisher ? 1 : 0) +
                    (selectedAdvertiser ? 1 : 0) +
                    (startDateFilter || endDateFilter ? 1 : 0)}
                </span>
              )}
            </button>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                type="button"
                className="flex items-center px-3 py-2.5 rounded-lg border border-gray-200 shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Limpiar
              </button>
            )}
          </div>

          {/* Expanded Filter Options */}
          {showFilters && (
            <div className="grid grid-cols-1 gap-4 pt-4 border-t border-gray-100 mt-2">
              {/* Top row filters: Publisher, Advertiser, Date Range */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Filter by Publisher */}
                <div className="relative">
                  <label
                    htmlFor="publisher-filter"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Publisher
                  </label>
                  <select
                    id="publisher-filter"
                    value={selectedPublisher}
                    onChange={(e) => setSelectedPublisher(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm text-gray-900 bg-gray-50"
                  >
                    <option value="">Todos los publishers</option>
                    {publishers.map((publisher) => (
                      <option key={publisher} value={publisher}>
                        {publisher}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Filter by Advertiser */}
                <div className="relative">
                  <label
                    htmlFor="advertiser-filter"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Advertiser
                  </label>
                  <select
                    id="advertiser-filter"
                    value={selectedAdvertiser}
                    onChange={(e) => setSelectedAdvertiser(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm text-gray-900 bg-gray-50"
                  >
                    <option value="">Todos los advertisers</option>
                    {advertisers.map((advertiser) => (
                      <option key={advertiser} value={advertiser}>
                        {advertiser}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Filter by date range */}
                <div>
                  <label
                    htmlFor="date-filter"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Rango de Fechas
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label htmlFor="start-date" className="sr-only">
                        Fecha Inicio
                      </label>
                      <input
                        type="date"
                        id="start-date"
                        value={startDateFilter}
                        onChange={(e) => setStartDateFilter(e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm text-gray-900 bg-gray-50"
                        placeholder="Fecha inicio"
                      />
                    </div>
                    <div>
                      <label htmlFor="end-date" className="sr-only">
                        Fecha Fin
                      </label>
                      <input
                        type="date"
                        id="end-date"
                        value={endDateFilter}
                        onChange={(e) => setEndDateFilter(e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm text-gray-900 bg-gray-50"
                        placeholder="Fecha fin"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 ease-in-out">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 transition-all duration-300 ease-in-out table-fixed">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-orange-700 transition-colors w-20"
                  onClick={() => handleSort("campaignId")}
                >
                  <div className="whitespace-nowrap flex items-center">
                    ID
                    {sortField === "campaignId" && (
                      <span className="ml-1">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-orange-700 transition-colors w-48"
                  onClick={() => handleSort("campaign")}
                >
                  <div className="whitespace-nowrap flex items-center">
                    Campaign
                    {sortField === "campaign" && (
                      <span className="ml-1">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-orange-700 transition-colors w-32"
                  onClick={() => handleSort("publisher")}
                >
                  <div className="whitespace-nowrap flex items-center">
                    Publisher
                    {sortField === "publisher" && (
                      <span className="ml-1">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-orange-700 transition-colors w-32"
                  onClick={() => handleSort("advertiser")}
                >
                  <div className="whitespace-nowrap flex items-center">
                    Advertiser
                    {sortField === "advertiser" && (
                      <span className="ml-1">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-orange-700 transition-colors w-28"
                  onClick={() => handleSort("createdDate")}
                >
                  <div className="whitespace-nowrap flex items-center">
                    Created Date
                    {sortField === "createdDate" && (
                      <span className="ml-1">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-orange-700 transition-colors w-28"
                  onClick={() => handleSort("createdBy")}
                >
                  <div className="whitespace-nowrap flex items-center">
                    Created By
                    {sortField === "createdBy" && (
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
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider w-24"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedReports.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No se encontraron reportes
                  </td>
                </tr>
              ) : (
                sortedReports.map((report) => (
                  <tr
                    key={report.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-500 font-mono">
                        {report.campaignId}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-orange-600 hover:text-orange-800">
                        <span
                          title={report.campaign}
                          className="hover:underline cursor-pointer block truncate"
                        >
                          {truncateText(
                            report.campaign,
                            campaignTruncateLength
                          )}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {report.publisher}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {report.advertiser}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {report.createdDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {report.createdBy}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <CompletedStatusBadge status={report.status} />
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewReport(report.id)}
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TraffickerReportHistory;
