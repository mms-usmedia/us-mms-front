import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import useTruncate from "@/hooks/useTruncate";

interface AdUnit {
  id: string;
  item: number;
  market: string;
  channel: string;
  format: string;
  size: string;
  model: string;
  qtySold: number;
  qtyDelivered: number;
  qtyPending: number;
  startDate: string;
  endDate: string;
  impressions: number;
  clicks: number;
  leads: number;
  preDelivered: number;
  thisReport: number;
  courtesy: number;
  publisherFNR: number;
  customerFNR: number;
  trafficFNR: number;
}

interface TraffickerReportDetailsProps {
  campaignId: string;
  campaignName: string;
  publisherInfo: {
    id: string;
    name: string;
    website: string;
    creative: string;
  };
  advertiserInfo: {
    name: string;
    account: string;
  };
  reportPeriod: {
    startDate: string;
    endDate: string;
    invoicePeriod: string;
  };
  reportNumber: string;
  onSave: () => void;
  onCancel: () => void;
}

const TraffickerReportDetails: React.FC<TraffickerReportDetailsProps> = ({
  campaignId,
  campaignName,
  publisherInfo,
  advertiserInfo,
  reportPeriod,
  reportNumber,
  onSave,
  onCancel,
}) => {
  const router = useRouter();
  const [adUnits, setAdUnits] = useState<AdUnit[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [itemsLoaded, setItemsLoaded] = useState(false);
  const [campaignDates, setCampaignDates] = useState({
    startDate: "07/03/2025",
    endDate: "09/30/2025",
  });
  const [localReportPeriod, setLocalReportPeriod] = useState({
    startDate: reportPeriod.startDate,
    endDate: reportPeriod.endDate,
    invoicePeriod: reportPeriod.invoicePeriod,
  });

  // Datos totales del reporte
  const [reportTotals, setReportTotals] = useState({
    impressions: 0,
    clicks: 0,
    leads: 0,
    delivered: 0,
    courtesy: 0,
    trafficFNR: 0,
  });

  // Opciones para el dropdown de períodos de facturación
  const invoicePeriodOptions = [
    "01/11/2025",
    "02/11/2025",
    "03/11/2025",
    "04/11/2025",
    "05/11/2025",
    "06/11/2025",
  ];

  // Hook para truncar texto
  const maxLength = useTruncate(30);

  // Función para truncar texto
  const truncateText = (text: string, maxChars: number) => {
    if (!text) return "";
    return text.length > maxChars ? `${text.substring(0, maxChars)}...` : text;
  };

  // Mock data for ad units
  const mockAdUnits = useMemo(
    () => [
      {
        id: "1",
        item: 3,
        market: "Mexico",
        channel: "standar banners",
        format: "Display",
        size: "300x250, 728x90, 300x600",
        model: "CPM",
        qtySold: 1212909,
        qtyDelivered: 0,
        qtyPending: 1212909,
        startDate: "07-03-2025",
        endDate: "07-31-2025",
        impressions: 0,
        clicks: 0,
        leads: 0,
        preDelivered: 154759,
        thisReport: 0,
        courtesy: 0,
        publisherFNR: 7.41,
        customerFNR: 11.0,
        trafficFNR: 0.0,
      },
      {
        id: "2",
        item: 4,
        market: "Mexico",
        channel: "standar banners",
        format: "Display",
        size: "300x250, 728x90, 300x600",
        model: "CPM",
        qtySold: 592794,
        qtyDelivered: 0,
        qtyPending: 592794,
        startDate: "08-01-2025",
        endDate: "08-31-2025",
        impressions: 0,
        clicks: 0,
        leads: 0,
        preDelivered: 0,
        thisReport: 0,
        courtesy: 0,
        publisherFNR: 7.41,
        customerFNR: 11.0,
        trafficFNR: 0.0,
      },
      {
        id: "3",
        item: 5,
        market: "Colombia",
        channel: "standar banners",
        format: "Display",
        size: "300x250, 728x90, 300x600",
        model: "CPM",
        qtySold: 270874,
        qtyDelivered: 0,
        qtyPending: 270874,
        startDate: "07-03-2025",
        endDate: "07-31-2025",
        impressions: 0,
        clicks: 0,
        leads: 0,
        preDelivered: 0,
        thisReport: 0,
        courtesy: 0,
        publisherFNR: 7.41,
        customerFNR: 11.0,
        trafficFNR: 0.0,
      },
    ],
    []
  );

  useEffect(() => {
    // Simular carga de datos
    setIsLoading(true);
    setTimeout(() => {
      setAdUnits(mockAdUnits);
      setIsLoading(false);
    }, 500);
  }, [mockAdUnits]);

  const handleLoadItems = () => {
    // En una aplicación real, aquí cargaríamos los datos desde el servidor
    setIsLoading(true);
    setTimeout(() => {
      setItemsLoaded(true);
      setIsLoading(false);
    }, 500);
  };

  const handleUpdateTotals = (
    field: keyof typeof reportTotals,
    value: unknown
  ) => {
    setReportTotals({
      ...reportTotals,
      [field]: value,
    });
  };

  const handleCampaignDateChange = (field: string, value: string) => {
    setCampaignDates({
      ...campaignDates,
      [field]: value,
    });
  };

  const handleReportPeriodChange = (field: string, value: string) => {
    setLocalReportPeriod({
      ...localReportPeriod,
      [field]: value,
    });
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      return `${parts[1]}/${parts[2]}/${parts[0]}`;
    }
    return dateStr;
  };

  const formatNumber = (num: number | undefined) => {
    if (num === undefined) return "";
    return new Intl.NumberFormat().format(num);
  };

  // Calcular totales de unidades vendidas
  const totalQtySold = adUnits.reduce((sum, unit) => sum + unit.qtySold, 0);
  const totalPreDelivered = adUnits.reduce(
    (sum, unit) => sum + unit.preDelivered,
    0
  );
  const totalPending = adUnits.reduce((sum, unit) => sum + unit.qtyPending, 0);

  // Renderiza la vista inicial o la vista de edición de ítems
  if (!itemsLoaded) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Online Delivery Report
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Card className="border border-gray-200">
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold mb-4">Campaign Dates</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Date
                      </label>
                      <Input
                        type="text"
                        value={campaignDates.startDate}
                        onChange={(e) =>
                          handleCampaignDateChange("startDate", e.target.value)
                        }
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        End Date
                      </label>
                      <Input
                        type="text"
                        value={campaignDates.endDate}
                        onChange={(e) =>
                          handleCampaignDateChange("endDate", e.target.value)
                        }
                        className="w-full"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-200">
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold mb-4">Report Period</h3>
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <Input
                      type="text"
                      value={formatDate(localReportPeriod.startDate)}
                      onChange={(e) =>
                        handleReportPeriodChange("startDate", e.target.value)
                      }
                      className="w-full"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <Input
                      type="text"
                      value={formatDate(localReportPeriod.endDate)}
                      onChange={(e) =>
                        handleReportPeriodChange("endDate", e.target.value)
                      }
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Invoice Period
                    </label>
                    <select
                      value={localReportPeriod.invoicePeriod}
                      onChange={(e) =>
                        handleReportPeriodChange(
                          "invoicePeriod",
                          e.target.value
                        )
                      }
                      className="block w-full px-3 py-2 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                    >
                      {invoicePeriodOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  Campaign Ad Units
                </h3>
                <Button onClick={handleLoadItems} variant="default">
                  Load Items
                </Button>
              </div>

              <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Item
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Market
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Channel
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Format
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Size
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          CModel
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          QtySold
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          QtyDelivered
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          QtyPending
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Start Date
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          End date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {adUnits.map((unit) => (
                        <tr key={unit.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            {unit.item}
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
                            {unit.model}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            {formatNumber(unit.qtySold)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            {formatNumber(unit.qtyDelivered)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            {formatNumber(unit.qtyPending)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            {unit.startDate}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            {unit.endDate}
                          </td>
                        </tr>
                      ))}
                      {adUnits.length === 0 && (
                        <tr>
                          <td
                            colSpan={11}
                            className="px-4 py-6 text-center text-sm text-gray-500"
                          >
                            No ad units available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={onCancel}
                variant="outline"
                className="border-orange-500 text-orange-500 hover:bg-orange-50"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Vista de edición del reporte (después de cargar ítems)
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Traffic Report Details
          </h2>

          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Card className="border border-gray-200">
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold mb-4">
                    Campaign Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Campaign Name
                      </label>
                      <div
                        className="p-2 bg-gray-50 border border-gray-200 rounded text-sm overflow-hidden text-ellipsis"
                        title={campaignName}
                      >
                        {truncateText(campaignName, maxLength)}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Publisher
                      </label>
                      <div
                        className="p-2 bg-gray-50 border border-gray-200 rounded text-sm overflow-hidden text-ellipsis"
                        title={publisherInfo.name}
                      >
                        {truncateText(publisherInfo.name, maxLength)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-200">
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold mb-4">Report Period</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Date
                      </label>
                      <div className="p-2 bg-gray-50 border border-gray-200 rounded text-sm">
                        {formatDate(localReportPeriod.startDate)}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        End Date
                      </label>
                      <div className="p-2 bg-gray-50 border border-gray-200 rounded text-sm">
                        {formatDate(localReportPeriod.endDate)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Campaign Ad Units Summary
              </h3>
              <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm mb-4">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total Units
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total Sold
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Pre-Delivered
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Pending
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          {adUnits.length}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatNumber(totalQtySold)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatNumber(totalPreDelivered)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatNumber(totalPending)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">
                Report Totals
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Impressions
                  </label>
                  <Input
                    type="number"
                    value={reportTotals.impressions}
                    onChange={(e) =>
                      handleUpdateTotals(
                        "impressions",
                        parseInt(e.target.value) || 0
                      )
                    }
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Clicks
                  </label>
                  <Input
                    type="number"
                    value={reportTotals.clicks}
                    onChange={(e) =>
                      handleUpdateTotals(
                        "clicks",
                        parseInt(e.target.value) || 0
                      )
                    }
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Leads
                  </label>
                  <Input
                    type="number"
                    value={reportTotals.leads}
                    onChange={(e) =>
                      handleUpdateTotals("leads", parseInt(e.target.value) || 0)
                    }
                    className="w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivered
                  </label>
                  <Input
                    type="number"
                    value={reportTotals.delivered}
                    onChange={(e) =>
                      handleUpdateTotals(
                        "delivered",
                        parseInt(e.target.value) || 0
                      )
                    }
                    className="w-full border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Courtesy
                  </label>
                  <Input
                    type="number"
                    value={reportTotals.courtesy}
                    onChange={(e) =>
                      handleUpdateTotals(
                        "courtesy",
                        parseInt(e.target.value) || 0
                      )
                    }
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Traffic FNR
                  </label>
                  <Input
                    type="number"
                    value={reportTotals.trafficFNR}
                    onChange={(e) =>
                      handleUpdateTotals(
                        "trafficFNR",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    className="w-full"
                    step="0.0001"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                onClick={onCancel}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                onClick={onSave}
                variant="default"
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                Save Report
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TraffickerReportDetails;
