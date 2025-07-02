import React, { useState, useEffect, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import TraffickerReportStats from "./TraffickerReportStats";
import TraffickerReportHistory from "./TraffickerReportHistory";
import TraffickerNewReport from "./TraffickerNewReport";
import { Campaign } from "@/components/campaigns/CampaignsTable";
import TraffickerSearchFilter from "@/components/adops/TraffickerSearchFilter";
import Link from "next/link";
import StatusBadge from "@/components/ui/StatusBadge";
import useTruncate from "@/hooks/useTruncate";
import { useSidebar } from "@/contexts/SidebarContext";

interface ReportLine {
  id: string;
  campaignId: string;
  lineItem: string;
  impressions: number;
  clicks: number;
  deliveredUnits: number;
  ctr?: number;
  viewability?: number;
}

const mockCampaigns: Campaign[] = [
  {
    id: "24147",
    name: "Samsung AO-SMB-SHOP_LinkedIn_Jul25",
    organizationName: "Starcom Argentina",
    campaignType: "IO-based",
    organizationType: "Agency",
    startDate: "2025-07-01",
    endDate: "2025-07-31",
    status: "Approved",
    units: 500000,
    budget: 150000,
    grossMargin: 15,
  },
  {
    id: "24146",
    name: "BBVA_Programa_Puntos_WETRANSFER_Animated_JUL_2025",
    organizationName: "GroupM México",
    campaignType: "Programmatic",
    organizationType: "Agency",
    startDate: "2025-07-01",
    endDate: "2025-07-31",
    status: "Materials & Creatives OK",
    units: 750000,
    budget: 225000,
    grossMargin: 18,
  },
  {
    id: "24144",
    name: "Banorte_125 Aniversario Pyme_LinkedIn_Mex_Julio25",
    organizationName: "Havas Media Mexico City",
    campaignType: "IO-based",
    organizationType: "Agency",
    startDate: "2025-07-01",
    endDate: "2025-07-31",
    status: "Implementation",
    units: 420000,
    budget: 95000,
    grossMargin: 20,
  },
  {
    id: "24143",
    name: "BHP_Chile_AON_Julio_2025_LinkedIn",
    organizationName: "OMD Chile - Santiago",
    campaignType: "IO-based",
    organizationType: "Agency",
    startDate: "2025-07-01",
    endDate: "2025-07-31",
    status: "Live",
    units: 600000,
    budget: 180000,
    grossMargin: 20,
  },
  {
    id: "24139",
    name: "Be Market_Chile_Maquinas_Junio_Julio_2025_LinkedIn",
    organizationName: "iProspect Chile",
    campaignType: "Programmatic",
    organizationType: "Agency",
    startDate: "2025-06-30",
    endDate: "2025-07-01",
    status: "Closed",
    units: 320000,
    budget: 75000,
    grossMargin: 18,
  },
  {
    id: "24137",
    name: "OMINT_PLAN B2B_CARAT_LinkedIn_Arg_Jul25",
    organizationName: "Carat Argentina",
    campaignType: "IO-based",
    organizationType: "Agency",
    startDate: "2025-07-01",
    endDate: "2025-07-31",
    status: "Approved",
    units: 380000,
    budget: 110000,
    grossMargin: 17,
  },
];

const mockReportLines: ReportLine[] = [
  {
    id: "1",
    campaignId: "24147",
    lineItem: "Samsung SMB - Sponsored Content",
    impressions: 1250000,
    clicks: 3200,
    deliveredUnits: 1250000,
    ctr: 0.26,
    viewability: 72.5,
  },
  {
    id: "2",
    campaignId: "24147",
    lineItem: "Samsung SMB - Message Ads",
    impressions: 450000,
    clicks: 1800,
    deliveredUnits: 450000,
    ctr: 0.4,
    viewability: 68.3,
  },
  {
    id: "3",
    campaignId: "24146",
    lineItem: "BBVA Puntos - Billboard",
    impressions: 2000000,
    clicks: 4500,
    deliveredUnits: 2000000,
    ctr: 0.23,
    viewability: 75.1,
  },
];

// Componente de tabla para campañas de trafficker
interface TraffickerCampaignsTableProps {
  campaigns: Campaign[];
  onCampaignClick?: (campaign: Campaign) => void;
}

const TraffickerCampaignsTable = ({
  campaigns,
  onCampaignClick,
}: TraffickerCampaignsTableProps) => {
  const { isCollapsed } = useSidebar();
  const [sortField, setSortField] = useState<string>("id");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Usar el hook personalizado para el truncamiento
  const nameTruncateLength = useTruncate(40, isCollapsed);

  // Función para manejar el ordenamiento
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Ordenar campañas
  const sortedCampaigns = useMemo(() => {
    return [...campaigns].sort((a, b) => {
      let aValue = a[sortField as keyof Campaign];
      let bValue = b[sortField as keyof Campaign];

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
  }, [campaigns, sortField, sortDirection]);

  // Funciones de formato
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US").format(num);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);
    return `${month}/${day}/${year}`;
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  // Estilos para tipos de organización
  const getOrganizationTypeStyles = (type: string) => {
    switch (type) {
      case "Agency":
        return "bg-blue-50 text-blue-700 border border-blue-100 px-2 py-1 rounded-md text-xs shadow-sm";
      case "Advertiser":
        return "bg-purple-50 text-purple-700 border border-purple-100 px-2 py-1 rounded-md text-xs shadow-sm";
      case "Publisher":
        return "bg-amber-50 text-amber-700 border border-amber-100 px-2 py-1 rounded-md text-xs shadow-sm";
      case "Holding Agency":
        return "bg-orange-50 text-orange-700 border border-orange-100 px-2 py-1 rounded-md text-xs shadow-sm";
      case "Direct":
        return "bg-yellow-50 text-yellow-700 border border-yellow-100 px-2 py-1 rounded-md text-xs shadow-sm";
      case "Holding Advertiser":
        return "bg-rose-50 text-rose-700 border border-rose-100 px-2 py-1 rounded-md text-xs shadow-sm";
      default:
        return "bg-gray-50 text-gray-700 border border-gray-100 px-2 py-1 rounded-md text-xs shadow-sm";
    }
  };

  // Estilos para tipos de campaña
  const getCampaignTypeStyles = (type: string) => {
    switch (type) {
      case "IO-based":
        return "bg-blue-100 text-blue-800 border border-blue-200 px-2 py-1 rounded-md text-xs shadow-sm";
      case "Programmatic":
        return "bg-purple-100 text-purple-800 border border-purple-200 px-2 py-1 rounded-md text-xs shadow-sm";
      default:
        return "bg-gray-50 text-gray-700 border border-gray-100 px-2 py-1 rounded-md text-xs shadow-sm";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 ease-in-out">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 transition-all duration-300 ease-in-out table-fixed">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-orange-700 transition-colors w-20"
                onClick={() => handleSort("id")}
              >
                <div className="whitespace-nowrap flex items-center">
                  ID
                  {sortField === "id" && (
                    <span className="ml-1">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-orange-700 transition-colors w-48"
                onClick={() => handleSort("name")}
              >
                <div className="whitespace-nowrap flex items-center">
                  Campaign
                  {sortField === "name" && (
                    <span className="ml-1">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-orange-700 transition-colors w-44"
                onClick={() => handleSort("organizationName")}
              >
                <div className="whitespace-nowrap flex items-center">
                  Organization
                  {sortField === "organizationName" && (
                    <span className="ml-1">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-orange-700 transition-colors w-28"
                onClick={() => handleSort("campaignType")}
              >
                <div className="whitespace-nowrap flex items-center">
                  Campaign Type
                  {sortField === "campaignType" && (
                    <span className="ml-1">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-orange-700 transition-colors w-28"
                onClick={() => handleSort("organizationType")}
              >
                <div className="whitespace-nowrap flex items-center">
                  Type
                  {sortField === "organizationType" && (
                    <span className="ml-1">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-orange-700 transition-colors w-28"
                onClick={() => handleSort("startDate")}
              >
                <div className="whitespace-nowrap flex items-center">
                  Start Date
                  {sortField === "startDate" && (
                    <span className="ml-1">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-orange-700 transition-colors w-24"
                onClick={() => handleSort("endDate")}
              >
                <div className="whitespace-nowrap flex items-center">
                  End Date
                  {sortField === "endDate" && (
                    <span className="ml-1">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-orange-700 transition-colors w-24"
                onClick={() => handleSort("units")}
              >
                <div className="whitespace-nowrap flex items-center">
                  Units
                  {sortField === "units" && (
                    <span className="ml-1">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-orange-700 transition-colors w-24"
                onClick={() => handleSort("budget")}
              >
                <div className="whitespace-nowrap flex items-center">
                  Budget
                  {sortField === "budget" && (
                    <span className="ml-1">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-orange-700 transition-colors w-20"
                onClick={() => handleSort("grossMargin")}
              >
                <div className="whitespace-nowrap flex items-center">
                  % GM
                  {sortField === "grossMargin" && (
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
                className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-24"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedCampaigns.length === 0 ? (
              <tr>
                <td
                  colSpan={12}
                  className="px-6 py-4 text-center text-gray-500"
                >
                  No campaigns found
                </td>
              </tr>
            ) : (
              sortedCampaigns.map((campaign) => (
                <tr
                  key={campaign.id}
                  className="hover:bg-gray-50 transition-colors"
                  style={{ cursor: "default" }}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                    <Link
                      href={`/campaigns/${campaign.id}`}
                      className="text-gray-500 hover:text-orange-700"
                    >
                      {campaign.id}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-orange-600 hover:text-orange-800 max-w-[12rem] overflow-hidden transition-all duration-300 ease-in-out">
                    <Link
                      href={`/campaigns/${campaign.id}`}
                      className="hover:underline"
                      title={campaign.name}
                    >
                      {truncateText(campaign.name, nameTruncateLength)}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {campaign.organizationName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={getCampaignTypeStyles(campaign.campaignType)}
                    >
                      {campaign.campaignType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={getOrganizationTypeStyles(
                        campaign.organizationType
                      )}
                    >
                      {campaign.organizationType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(campaign.startDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(campaign.endDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatNumber(campaign.units)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(campaign.budget)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {campaign.grossMargin}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={campaign.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => onCampaignClick?.(campaign)}
                      className="text-orange-600 hover:text-orange-900 text-sm font-medium"
                    >
                      Create Report
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const TraffickerReport = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(
    null
  );
  const [reportLines, setReportLines] = useState<ReportLine[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isCreatingReport, setIsCreatingReport] = useState(false);
  const [isEditingLine, setIsEditingLine] = useState<string | null>(null);
  const [currentLine, setCurrentLine] = useState<ReportLine | null>(null);
  const [reportStats, setReportStats] = useState({
    impressions: 0,
    clicks: 0,
    deliveredUnits: 0,
    ctr: 0,
    viewability: 0,
  });
  const [activeTab, setActiveTab] = useState<
    "campaigns" | "new-report" | "history"
  >("campaigns");

  // Estados para filtros
  const [selectedOrganization, setSelectedOrganization] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");
  const [selectedOwner, setSelectedOwner] = useState("");

  // Filtrar campañas - solo mostrar las que están en estados apropiados para traffickers
  const allowedStatuses = useMemo(
    () => [
      "Approved",
      "Materials & Creatives OK",
      "Implementation",
      "Live",
      "Closed",
    ],
    []
  );

  const filteredCampaigns = useMemo(() => {
    return mockCampaigns.filter((campaign) => {
      // Filtro por estado permitido
      if (!allowedStatuses.includes(campaign.status)) {
        return false;
      }

      // Filtro por término de búsqueda
      const matchesSearch =
        searchTerm === "" ||
        campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.organizationName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        campaign.id.includes(searchTerm);

      // Filtro por organización
      const matchesOrganization =
        selectedOrganization === "" ||
        campaign.organizationName === selectedOrganization;

      // Filtro por estado
      const matchesStatus =
        selectedStatus.length === 0 || selectedStatus.includes(campaign.status);

      // Filtro por fecha de inicio
      const matchesStartDate =
        startDateFilter === "" ||
        new Date(campaign.startDate) >= new Date(startDateFilter);

      // Filtro por fecha de fin
      const matchesEndDate =
        endDateFilter === "" ||
        new Date(campaign.endDate) <= new Date(endDateFilter);

      return (
        matchesSearch &&
        matchesOrganization &&
        matchesStatus &&
        matchesStartDate &&
        matchesEndDate
      );
    });
  }, [
    searchTerm,
    selectedOrganization,
    selectedStatus,
    startDateFilter,
    endDateFilter,
    allowedStatuses,
  ]);

  // Calcular estadísticas del reporte
  useEffect(() => {
    if (reportLines.length === 0) {
      setReportStats({
        impressions: 0,
        clicks: 0,
        deliveredUnits: 0,
        ctr: 0,
        viewability: 0,
      });
      return;
    }

    const totalImpressions = reportLines.reduce(
      (sum, line) => sum + line.impressions,
      0
    );
    const totalClicks = reportLines.reduce((sum, line) => sum + line.clicks, 0);
    const totalDeliveredUnits = reportLines.reduce(
      (sum, line) => sum + line.deliveredUnits,
      0
    );

    // Calcular CTR promedio
    const avgCtr =
      totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;

    // Calcular viewability promedio
    const totalViewability = reportLines.reduce(
      (sum, line) => sum + (line.viewability || 0),
      0
    );
    const avgViewability =
      reportLines.length > 0 ? totalViewability / reportLines.length : 0;

    setReportStats({
      impressions: totalImpressions,
      clicks: totalClicks,
      deliveredUnits: totalDeliveredUnits,
      ctr: avgCtr,
      viewability: avgViewability,
    });
  }, [reportLines]);

  // Cargar líneas de reporte para una campaña seleccionada
  const loadReportItems = () => {
    if (!selectedCampaign || !startDate || !endDate) {
      alert("Por favor selecciona una campaña y fechas de inicio/fin");
      return;
    }

    // En un caso real, aquí haríamos una llamada a la API
    // Por ahora, usamos datos mock filtrados por campaignId
    const lines = mockReportLines.filter(
      (line) => line.campaignId === selectedCampaign.id
    );
    setReportLines(lines);
  };

  // Iniciar la edición de una línea
  const handleEditLine = (line: ReportLine) => {
    setIsEditingLine(line.id);
    setCurrentLine(line);
  };

  // Guardar cambios en una línea
  const handleSaveLine = () => {
    if (!currentLine) return;

    // Actualizar la línea en el estado
    setReportLines(
      reportLines.map((line) =>
        line.id === currentLine.id ? currentLine : line
      )
    );
    setIsEditingLine(null);
    setCurrentLine(null);
  };

  // Actualizar valores de la línea actual
  const handleLineChange = (field: keyof ReportLine, value: unknown) => {
    if (!currentLine) return;
    setCurrentLine({
      ...currentLine,
      [field]: field === "lineItem" ? value : Number(value),
    });
  };

  // Guardar el reporte completo
  const handleSaveReport = () => {
    alert("Reporte guardado exitosamente");
    setIsCreatingReport(false);
    setSelectedCampaign(null);
    setReportLines([]);
    setStartDate("");
    setEndDate("");
  };

  // Manejar el clic en una campaña para crear reporte
  const handleCampaignClick = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setStartDate(campaign.startDate);
    setEndDate(campaign.endDate);
    setIsCreatingReport(true);
  };

  // Exportar reporte a Excel
  const handleExportReport = () => {
    if (reportLines.length === 0) {
      alert("No hay datos para exportar");
      return;
    }

    // En una implementación real, esto generaría un archivo Excel
    // Por ahora, solo mostramos un mensaje
    alert(
      `Exportando reporte para ${selectedCampaign?.name} (${reportLines.length} líneas)`
    );
  };

  // Manejar la visualización de un reporte existente
  const handleViewReport = (reportId: string) => {
    // En una implementación real, cargaríamos el reporte desde la API
    // Por ahora, simulamos cargar un reporte
    const campaign = mockCampaigns.find((c) => c.id === "24147");
    if (campaign) {
      setSelectedCampaign(campaign);
      setStartDate("2025-07-01");
      setEndDate("2025-07-31");
      setReportLines(
        mockReportLines.filter((line) => line.campaignId === "24147")
      );
      setIsCreatingReport(true);
    }
  };

  // Vista principal - lista de campañas o historial
  if (!isCreatingReport) {
    return (
      <div className="w-full">
        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`py-2 px-4 font-medium text-sm ${
              activeTab === "campaigns"
                ? "border-b-2 border-orange-500 text-orange-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("campaigns")}
          >
            Campaigns
          </button>
          <button
            className={`py-2 px-4 font-medium text-sm ${
              activeTab === "new-report"
                ? "border-b-2 border-orange-500 text-orange-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("new-report")}
          >
            New Report
          </button>
          <button
            className={`py-2 px-4 font-medium text-sm ${
              activeTab === "history"
                ? "border-b-2 border-orange-500 text-orange-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("history")}
          >
            Report History
          </button>
        </div>

        {activeTab === "campaigns" ? (
          <>
            {/* Search Filters */}
            <TraffickerSearchFilter
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedOrganization={selectedOrganization}
              onOrganizationChange={setSelectedOrganization}
              selectedStatus={selectedStatus}
              onStatusChange={setSelectedStatus}
              campaigns={mockCampaigns}
              startDateFilter={startDateFilter}
              endDateFilter={endDateFilter}
              onStartDateChange={setStartDateFilter}
              onEndDateChange={setEndDateFilter}
              selectedOwner={selectedOwner}
              onOwnerChange={setSelectedOwner}
            />

            {/* Campaigns Table */}
            <div className="mt-6">
              <TraffickerCampaignsTable
                campaigns={filteredCampaigns}
                onCampaignClick={handleCampaignClick}
              />
            </div>
          </>
        ) : activeTab === "new-report" ? (
          <TraffickerNewReport />
        ) : (
          <TraffickerReportHistory onViewReport={handleViewReport} />
        )}
      </div>
    );
  }

  // Vista de creación/edición de reporte
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {selectedCampaign ? `Report: ${selectedCampaign.name}` : "New Report"}
        </h2>
        <div className="flex items-center space-x-2">
          {reportLines.length > 0 && (
            <Button
              variant="outline"
              onClick={handleExportReport}
              className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Export to Excel
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => setIsCreatingReport(false)}
            className="border-orange-500 text-orange-600 hover:bg-orange-50"
          >
            Back to Reports
          </Button>
        </div>
      </div>

      {reportLines.length > 0 && (
        <>
          <TraffickerReportStats {...reportStats} />

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="whitespace-nowrap font-semibold">
                      Line Item
                    </TableHead>
                    <TableHead className="whitespace-nowrap font-semibold">
                      Impressions
                    </TableHead>
                    <TableHead className="whitespace-nowrap font-semibold">
                      Clicks
                    </TableHead>
                    <TableHead className="whitespace-nowrap font-semibold">
                      CTR
                    </TableHead>
                    <TableHead className="whitespace-nowrap font-semibold">
                      Viewability
                    </TableHead>
                    <TableHead className="whitespace-nowrap font-semibold">
                      Delivered Units
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reportLines.map((line) => (
                    <TableRow key={line.id} className="hover:bg-gray-50">
                      {isEditingLine === line.id ? (
                        <>
                          <TableCell>
                            <Input
                              value={currentLine?.lineItem || ""}
                              onChange={(e) =>
                                handleLineChange("lineItem", e.target.value)
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              value={currentLine?.impressions || 0}
                              onChange={(e) =>
                                handleLineChange("impressions", e.target.value)
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              value={currentLine?.clicks || 0}
                              onChange={(e) =>
                                handleLineChange("clicks", e.target.value)
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              step="0.01"
                              value={currentLine?.ctr || 0}
                              onChange={(e) =>
                                handleLineChange("ctr", e.target.value)
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              step="0.1"
                              value={currentLine?.viewability || 0}
                              onChange={(e) =>
                                handleLineChange("viewability", e.target.value)
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              value={currentLine?.deliveredUnits || 0}
                              onChange={(e) =>
                                handleLineChange(
                                  "deliveredUnits",
                                  e.target.value
                                )
                              }
                            />
                          </TableCell>
                        </>
                      ) : (
                        <>
                          <TableCell className="whitespace-nowrap">
                            {line.lineItem}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {line.impressions.toLocaleString()}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {line.clicks.toLocaleString()}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {line.ctr ? `${line.ctr}%` : "-"}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {line.viewability ? `${line.viewability}%` : "-"}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {line.deliveredUnits.toLocaleString()}
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TraffickerReport;
