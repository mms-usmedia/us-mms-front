import React, { useState, useEffect } from "react";
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
import { Card, CardContent } from "@/components/ui/card";
import StatusBadge from "@/components/ui/StatusBadge";
import useTruncate from "@/hooks/useTruncate";
import { useSidebar } from "@/contexts/SidebarContext";
import { Campaign } from "@/components/campaigns/CampaignsTable";
import TraffickerReportFilter from "@/components/adops/TraffickerReportFilter";
import TraffickerReportDetails from "@/components/adops/TraffickerReportDetails";

// Interfaces
interface AdUnit {
  id: string;
  line: string;
  publisher: string;
  market: string;
  channel: string;
  format: string;
  size: string;
  units: number;
  model: string;
  margin: string;
  unitCost: number;
  customerInvestment: number;
  customerNetRate: number;
  startDate: string;
  endDate: string;
  status: string;
  // Campos adicionales para el reporte
  impressions?: number;
  clicks?: number;
  ctr?: number;
  viewability?: number;
  qtyDelivered?: number;
}

interface ReportPeriod {
  startDate: string;
  endDate: string;
  invoicePeriod: string;
}

// Mock data
const mockClosedCampaigns: Campaign[] = [
  {
    id: "24139",
    name: "Be Market_Chile_Maquinas_Junio_Julio_2025_LinkedIn",
    organizationName: "iProspect Chile",
    campaignType: "Programmatic",
    organizationType: "Agency",
    startDate: "2025-06-30",
    endDate: "2025-07-01",
    status: "Delivery",
    units: 320000,
    budget: 75000,
    grossMargin: 18,
  },
  {
    id: "24138",
    name: "Nintendo_Display Digital Fandom_Q2_IAB Star",
    organizationName: "Omnet Latin America LLC",
    campaignType: "IO-based",
    organizationType: "Agency",
    startDate: "2025-04-01",
    endDate: "2025-06-30",
    status: "Delivery",
    units: 450000,
    budget: 125000,
    grossMargin: 22,
  },
  {
    id: "24135",
    name: "Samsung_Galaxy S25_Display_LATAM_Q2",
    organizationName: "Starcom Argentina",
    campaignType: "IO-based",
    organizationType: "Agency",
    startDate: "2025-04-15",
    endDate: "2025-06-15",
    status: "Delivery",
    units: 680000,
    budget: 200000,
    grossMargin: 20,
  },
];

// Mock ad units for a campaign
const mockAdUnits: AdUnit[] = [
  {
    id: "1",
    line: "Line 1",
    publisher: "Fandom",
    market: "Mexico",
    channel: "standar banners",
    format: "Display",
    size: "300x250, 728x90, 300x600",
    model: "CPM",
    margin: "20%",
    unitCost: 3.5,
    customerInvestment: 4245.0,
    customerNetRate: 4.2,
    startDate: "2025-07-03",
    endDate: "2025-07-31",
    status: "Delivery",
    units: 1212909,
    impressions: 1212909,
    clicks: 3245,
    ctr: 0.27,
    viewability: 72.5,
    qtyDelivered: 1212909,
  },
  {
    id: "2",
    line: "Line 2",
    publisher: "Fandom",
    market: "Mexico",
    channel: "standar banners",
    format: "Display",
    size: "300x250, 728x90, 300x600",
    model: "CPM",
    margin: "18%",
    unitCost: 3.2,
    customerInvestment: 1897.0,
    customerNetRate: 3.8,
    startDate: "2025-08-01",
    endDate: "2025-08-31",
    status: "Delivery",
    units: 592794,
    impressions: 592794,
    clicks: 1850,
    ctr: 0.31,
    viewability: 68.3,
    qtyDelivered: 592794,
  },
  {
    id: "3",
    line: "Line 3",
    publisher: "Fandom",
    market: "Colombia",
    channel: "standar banners",
    format: "Display",
    size: "300x250, 728x90, 300x600",
    model: "CPM",
    margin: "22%",
    unitCost: 3.8,
    customerInvestment: 1029.0,
    customerNetRate: 4.5,
    startDate: "2025-07-03",
    endDate: "2025-07-31",
    status: "Delivery",
    units: 270874,
    impressions: 270874,
    clicks: 980,
    ctr: 0.36,
    viewability: 74.2,
    qtyDelivered: 270874,
  },
  {
    id: "4",
    line: "Line 4",
    publisher: "Fandom",
    market: "Colombia",
    channel: "standar banners",
    format: "Display",
    size: "300x250, 728x90, 300x600",
    model: "CPM",
    margin: "19%",
    unitCost: 3.4,
    customerInvestment: 380.0,
    customerNetRate: 4.0,
    startDate: "2025-08-02",
    endDate: "2025-08-31",
    status: "Delivery",
    units: 111775,
    impressions: 111775,
    clicks: 420,
    ctr: 0.38,
    viewability: 71.8,
    qtyDelivered: 111775,
  },
  {
    id: "5",
    line: "Line 5",
    publisher: "Fandom",
    market: "Chile",
    channel: "standar banners",
    format: "Display",
    size: "300x250, 728x90, 300x600",
    model: "CPM",
    margin: "21%",
    unitCost: 3.6,
    customerInvestment: 975.0,
    customerNetRate: 4.3,
    startDate: "2025-07-03",
    endDate: "2025-07-31",
    status: "Delivery",
    units: 270874,
    impressions: 270874,
    clicks: 950,
    ctr: 0.35,
    viewability: 73.5,
    qtyDelivered: 270874,
  },
];

const TraffickerNewReport = () => {
  const { isCollapsed } = useSidebar();
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(
    null
  );
  const [adUnits, setAdUnits] = useState<AdUnit[]>([]);
  const [reportPeriod, setReportPeriod] = useState<ReportPeriod>({
    startDate: "",
    endDate: "",
    invoicePeriod: "",
  });
  const [reportNumber, setReportNumber] = useState<string>("");
  const [isEditingAdUnits, setIsEditingAdUnits] = useState<boolean>(false);
  const [publisherInfo, setPublisherInfo] = useState({
    id: "P0000023515",
    name: "Fandom",
    website: "www.fandom.com",
    creative: "",
  });
  const [advertiserInfo, setAdvertiserInfo] = useState({
    name: "Nintendo",
    account: "Omnet Latin America LLC",
  });

  // Estados para filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrganization, setSelectedOrganization] = useState("");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");
  const [selectedOwner, setSelectedOwner] = useState("");

  // Filtrar campañas cerradas
  const filteredCampaigns = mockClosedCampaigns.filter((campaign) => {
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

    // Filtro por fecha de inicio
    const matchesStartDate =
      startDateFilter === "" ||
      new Date(campaign.startDate) >= new Date(startDateFilter);

    // Filtro por fecha de fin
    const matchesEndDate =
      endDateFilter === "" ||
      new Date(campaign.endDate) <= new Date(endDateFilter);

    return (
      matchesSearch && matchesOrganization && matchesStartDate && matchesEndDate
    );
  });

  // Usar el hook personalizado para el truncamiento
  const nameTruncateLength = useTruncate(40, isCollapsed);

  // Función para seleccionar una campaña
  const handleCampaignSelect = (campaign: Campaign) => {
    setSelectedCampaign(campaign);

    // Automáticamente establecer las fechas del reporte basadas en la campaña
    setReportPeriod({
      startDate: campaign.startDate,
      endDate: campaign.endDate,
      invoicePeriod: getNextMonthPeriod(),
    });

    // Cargar las ad units de la campaña (mock)
    setAdUnits(mockAdUnits);
  };

  // Función para cargar los items del reporte
  const handleLoadItems = () => {
    // Establecer las fechas del reporte basadas en la campaña seleccionada
    if (selectedCampaign) {
      setReportPeriod({
        startDate: selectedCampaign.startDate,
        endDate: selectedCampaign.endDate,
        invoicePeriod: getNextMonthPeriod(),
      });
    }
    setIsEditingAdUnits(true);
  };

  // Función para cancelar el reporte
  const handleCancelReport = () => {
    setIsEditingAdUnits(false);
  };

  // Función para guardar el reporte
  const handleSaveReport = () => {
    // Aquí iría la lógica para guardar el reporte
    alert("Reporte guardado exitosamente");

    // Resetear el estado
    setSelectedCampaign(null);
    setAdUnits([]);
    setIsEditingAdUnits(false);
    setReportPeriod({
      startDate: "",
      endDate: "",
      invoicePeriod: "",
    });
  };

  // Función para actualizar una ad unit
  const handleUpdateAdUnit = (
    id: string,
    field: keyof AdUnit,
    value: unknown
  ) => {
    setAdUnits(
      adUnits.map((unit) =>
        unit.id === id ? { ...unit, [field]: value } : unit
      )
    );
  };

  // Función para obtener el próximo período de facturación (mes siguiente)
  const getNextMonthPeriod = () => {
    const today = new Date();
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 15);
    return nextMonth.toISOString().split("T")[0];
  };

  // Formatear fecha
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  // Formatear número con separadores de miles
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  return (
    <div className="w-full">
      {!selectedCampaign ? (
        <>
          {/* Filtros de búsqueda */}
          <TraffickerReportFilter
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedOrganization={selectedOrganization}
            onOrganizationChange={setSelectedOrganization}
            campaigns={mockClosedCampaigns}
            startDateFilter={startDateFilter}
            endDateFilter={endDateFilter}
            onStartDateChange={setStartDateFilter}
            onEndDateChange={setEndDateFilter}
            selectedOwner={selectedOwner}
            onOwnerChange={setSelectedOwner}
          />

          {/* Lista de campañas cerradas */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 ease-in-out">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 transition-all duration-300 ease-in-out table-fixed">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-20"
                    >
                      <div className="whitespace-nowrap flex items-center">
                        ID
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-48"
                    >
                      <div className="whitespace-nowrap flex items-center">
                        Campaign
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-44"
                    >
                      <div className="whitespace-nowrap flex items-center">
                        Organization
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-28"
                    >
                      <div className="whitespace-nowrap flex items-center">
                        Start Date
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-28"
                    >
                      <div className="whitespace-nowrap flex items-center">
                        End Date
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-28"
                    >
                      <div className="whitespace-nowrap flex items-center">
                        Status
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider w-24"
                    >
                      <div className="whitespace-nowrap flex items-center justify-end">
                        Actions
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCampaigns.map((campaign) => (
                    <tr
                      key={campaign.id}
                      className="hover:bg-gray-50 transition-colors duration-150 ease-in-out"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                        {campaign.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-orange-600 hover:text-orange-800 transition-all duration-300 ease-in-out max-w-xs truncate">
                          <span
                            title={campaign.name}
                            className="hover:underline cursor-pointer"
                          >
                            {campaign.name.length > nameTruncateLength
                              ? `${campaign.name.substring(
                                  0,
                                  nameTruncateLength
                                )}...`
                              : campaign.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {campaign.organizationName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {formatDate(campaign.startDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {formatDate(campaign.endDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={campaign.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCampaignSelect(campaign)}
                          className="text-blue-600 hover:text-blue-800 border-blue-200 hover:border-blue-400 transition-colors"
                        >
                          Select
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : !isEditingAdUnits ? (
        // Formulario de reporte
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b">
            <h3 className="text-lg font-semibold text-gray-800">
              Online Delivery Report
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Columna 1 */}
              <div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Report Number
                  </label>
                  <Input
                    type="text"
                    value={reportNumber}
                    onChange={(e) => setReportNumber(e.target.value)}
                    placeholder="Report Number"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Publisher IO
                  </label>
                  <Input type="text" value={publisherInfo.id} readOnly />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Advertiser
                  </label>
                  <Input type="text" value={advertiserInfo.name} readOnly />
                </div>
              </div>

              {/* Columna 2 */}
              <div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Publisher Name
                  </label>
                  <Input type="text" value={publisherInfo.name} readOnly />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Website
                  </label>
                  <Input type="text" value={publisherInfo.website} readOnly />
                </div>
              </div>

              {/* Columna 3 */}
              <div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Campaign Name
                  </label>
                  <Input type="text" value={selectedCampaign.name} readOnly />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Account
                  </label>
                  <Input type="text" value={advertiserInfo.account} readOnly />
                </div>
                <div className="mt-6 flex justify-end space-x-2">
                  <Button
                    onClick={() => {
                      // Establecer las fechas del reporte basadas en la campaña seleccionada
                      setReportPeriod({
                        startDate: selectedCampaign.startDate,
                        endDate: selectedCampaign.endDate,
                        invoicePeriod: getNextMonthPeriod(),
                      });
                      // Activar la vista de edición de unidades de anuncio
                      setIsEditingAdUnits(true);
                    }}
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    New Report
                  </Button>
                </div>
              </div>
            </div>

            {/* Tabla de Ad Units */}
            <div className="mt-8 border-t pt-6">
              <h4 className="text-lg font-semibold text-gray-700 mb-4">
                Campaign Ad Units
              </h4>
              <div className="bg-white shadow-sm border border-gray-100 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Line
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Publisher
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Market
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Channel
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Format
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Size
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Units
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Model
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Margin
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Impressions
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Clicks
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          CTR
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Investment
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {adUnits.map((unit) => (
                        <tr key={unit.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            {unit.line}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            {unit.publisher}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            {unit.market}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            {unit.channel}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            {unit.format}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            {unit.size}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            {formatNumber(unit.units)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            {unit.model}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            {unit.margin}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            {formatNumber(unit.impressions || 0)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            {formatNumber(unit.clicks || 0)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            {unit.ctr?.toFixed(2)}%
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            ${unit.customerInvestment.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                unit.status === "Delivery"
                                  ? "bg-cyan-100 text-cyan-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {unit.status === "Closed"
                                ? "Delivery"
                                : unit.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Vista de detalles del reporte y edición de unidades de anuncio
        <TraffickerReportDetails
          campaignId={selectedCampaign.id}
          campaignName={selectedCampaign.name}
          publisherInfo={publisherInfo}
          advertiserInfo={advertiserInfo}
          reportPeriod={reportPeriod}
          reportNumber={reportNumber}
          onSave={handleSaveReport}
          onCancel={handleCancelReport}
        />
      )}
    </div>
  );
};

export default TraffickerNewReport;
