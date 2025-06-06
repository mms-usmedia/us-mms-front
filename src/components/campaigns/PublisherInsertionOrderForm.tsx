// /src/components/campaigns/PublisherInsertionOrderForm.tsx
import React, { useState, useEffect } from "react";
import {
  BillingServerType,
  PublisherInsertionOrder,
  AdUnit,
  billingServerNotes,
} from "./types";

interface PublisherInsertionOrderFormProps {
  campaignId: string;
  campaignName: string;
  adUnits: AdUnit[];
  onSave?: (pio: PublisherInsertionOrder) => void;
  onCancel?: () => void;
}

const PublisherInsertionOrderForm: React.FC<
  PublisherInsertionOrderFormProps
> = ({ campaignId, campaignName, adUnits, onSave, onCancel }) => {
  const today = new Date().toISOString().split("T")[0]; // Formato YYYY-MM-DD

  // Estado inicial para la PIO
  const [pio, setPio] = useState<PublisherInsertionOrder>({
    id: `P${Date.now().toString().slice(-10)}`, // Generar un ID único
    campaignId,
    publisherId: "",
    publisherName: "",
    publishingHouse: "",
    advertiser: "",
    billingServer: BillingServerType.PUBLISHER_AD_SERVER, // Valor por defecto
    notes: billingServerNotes[BillingServerType.PUBLISHER_AD_SERVER],
    dateSent: today,
    sendBy: "",
    investment: adUnits.reduce((total, unit) => total + unit.investment, 0),
    market: adUnits.length > 0 ? adUnits[0].market : "",
    adUnits: adUnits,
    internalNotes: "",
  });

  // Actualizar las notas cuando cambia el tipo de servidor de facturación
  useEffect(() => {
    setPio((prev) => ({
      ...prev,
      notes: billingServerNotes[prev.billingServer],
    }));
  }, [pio.billingServer]);

  // Manejar cambios en los campos
  const handleChange = (
    field: keyof PublisherInsertionOrder,
    value: string | number | BillingServerType
  ) => {
    setPio((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Manejar el guardado del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSave) {
      onSave(pio);
    }
  };

  // Descargar la PIO (simulación)
  const handleDownload = () => {
    console.log("Descargando PIO...", pio);
    // Aquí iría la lógica para generar el PDF o descargar la PIO
    alert("La funcionalidad de descarga se implementará con el backend");
  };

  return (
    <div className="bg-white shadow-sm border border-gray-100 rounded-b-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Publisher Insertion Order (PIO)
          </h2>
          <p className="text-sm text-gray-500">
            Campaign: <span className="font-medium">{campaignName}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 hover:!bg-blue-900 text-white rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 shadow-sm active:bg-blue-900"
            style={{ transition: "background-color 0.3s ease" }}
          >
            Save PIO
          </button>
          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-green-500 hover:!bg-green-900 text-white rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 shadow-sm active:bg-green-900"
            style={{ transition: "background-color 0.3s ease" }}
          >
            Download PIO
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Información del Publisher */}
          <div className="bg-gradient-to-br from-white to-blue-50 shadow-sm border border-blue-100 rounded-xl p-6">
            <h3 className="text-lg font-medium text-blue-900 mb-4">
              Publisher Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-blue-600">
                  Publisher Name
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full border-2 border-blue-100 focus:border-blue-300 rounded p-2 text-gray-900 bg-white transition-colors focus:ring-0"
                  value={pio.publisherName}
                  onChange={(e) =>
                    handleChange("publisherName", e.target.value)
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-600">
                  Publishing House
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full border-2 border-blue-100 focus:border-blue-300 rounded p-2 text-gray-900 bg-white transition-colors focus:ring-0"
                  value={pio.publishingHouse}
                  onChange={(e) =>
                    handleChange("publishingHouse", e.target.value)
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-600">
                  Advertiser
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full border-2 border-blue-100 focus:border-blue-300 rounded p-2 text-gray-900 bg-white transition-colors focus:ring-0"
                  value={pio.advertiser}
                  onChange={(e) => handleChange("advertiser", e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-600">
                  Market
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full border-2 border-blue-100 focus:border-blue-300 rounded p-2 text-gray-900 bg-white transition-colors focus:ring-0"
                  value={pio.market}
                  onChange={(e) => handleChange("market", e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Información de Facturación */}
          <div className="bg-gradient-to-br from-white to-amber-50 shadow-sm border border-amber-100 rounded-xl p-6">
            <h3 className="text-lg font-medium text-amber-900 mb-4">
              Billing Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-amber-600">
                  PIO ID
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full border-2 border-amber-100 rounded p-2 text-gray-900 bg-amber-50 transition-colors"
                  value={pio.id}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-amber-600">
                  Date Sent
                </label>
                <input
                  type="date"
                  className="mt-1 block w-full border-2 border-amber-100 focus:border-amber-300 rounded p-2 text-gray-900 bg-white transition-colors focus:ring-0"
                  value={pio.dateSent}
                  onChange={(e) => handleChange("dateSent", e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-amber-600">
                  Send By
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full border-2 border-amber-100 focus:border-amber-300 rounded p-2 text-gray-900 bg-white transition-colors focus:ring-0"
                  value={pio.sendBy}
                  onChange={(e) => handleChange("sendBy", e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-amber-600">
                  Investment
                </label>
                <input
                  type="number"
                  className="mt-1 block w-full border-2 border-amber-100 rounded p-2 text-gray-900 bg-amber-50 transition-colors"
                  value={pio.investment}
                  readOnly
                />
              </div>
            </div>
          </div>
        </div>

        {/* Billing Server y Notas */}
        <div className="bg-gradient-to-br from-white to-emerald-50 shadow-sm border border-emerald-100 rounded-xl p-6">
          <h3 className="text-lg font-medium text-emerald-900 mb-4">
            Billing Server & Notes
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-emerald-600">
                Billing Server
              </label>
              <select
                className="mt-1 block w-full border-2 border-emerald-100 focus:border-emerald-300 rounded p-2 text-gray-900 bg-white transition-colors focus:ring-0"
                value={pio.billingServer}
                onChange={(e) => handleChange("billingServer", e.target.value)}
                required
              >
                <option value={BillingServerType.CUSTOMER_AD_SERVER}>
                Customer Ad Server
                </option>
                <option value={BillingServerType.PUBLISHER_AD_SERVER}>
                  Publisher Ad Server
                </option>
                <option value={BillingServerType.SUBJECT_TO_DISCREPANCY}>
                  Subject To Discrepancy
                </option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-emerald-600">
                Notes
              </label>
              <textarea
                className="mt-1 block w-full border-2 border-emerald-100 focus:border-emerald-300 rounded p-2 text-gray-900 bg-white transition-colors focus:ring-0 min-h-[120px]"
                value={pio.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-emerald-600">
                Internal Notes (Optional)
              </label>
              <textarea
                className="mt-1 block w-full border-2 border-emerald-100 focus:border-emerald-300 rounded p-2 text-gray-900 bg-white transition-colors focus:ring-0 min-h-[80px]"
                value={pio.internalNotes || ""}
                onChange={(e) => handleChange("internalNotes", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Tabla de Ad Units */}
        <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-x-auto">
          <h3 className="text-lg font-medium text-gray-900 p-4 border-b">
            Ad Units
          </h3>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Line
                </th>
                <th
                  scope="col"
                  className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Market
                </th>
                <th
                  scope="col"
                  className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Channel
                </th>
                <th
                  scope="col"
                  className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Format
                </th>
                <th
                  scope="col"
                  className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Size
                </th>
                <th
                  scope="col"
                  className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Model
                </th>
                <th
                  scope="col"
                  className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Units
                </th>
                <th
                  scope="col"
                  className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Unit Cost
                </th>
                <th
                  scope="col"
                  className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Total
                </th>
                <th
                  scope="col"
                  className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Start Date
                </th>
                <th
                  scope="col"
                  className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  End Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {adUnits.map((unit, index) => (
                <tr
                  key={unit.id}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                    {unit.line}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700">
                    {unit.market}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700">
                    {unit.channel}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700">
                    {unit.format}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700">
                    {unit.size}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700">
                    {unit.model}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700">
                    {unit.units.toLocaleString()}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700">
                    ${unit.unitCost.toFixed(2)}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700">
                    ${unit.investment.toLocaleString()}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700">
                    {unit.startDate}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700">
                    {unit.endDate}
                  </td>
                </tr>
              ))}
              {/* Fila de total */}
              <tr className="bg-blue-50">
                <td
                  colSpan={8}
                  className="px-3 py-2 text-right text-sm font-medium text-blue-900"
                >
                  Total Investment:
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-sm font-bold text-blue-900">
                  ${pio.investment.toLocaleString()}
                </td>
                <td colSpan={2}></td>
              </tr>
            </tbody>
          </table>
        </div>
      </form>
    </div>
  );
};

export default PublisherInsertionOrderForm;
