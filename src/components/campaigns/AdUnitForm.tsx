import React, { useState, useEffect } from "react";
import { AdUnit, Campaign, samplePublishers, Publisher } from "./types";
import {
  marketOptions,
  channelOptions,
  formatOptions,
  sizeOptions,
  modelOptions,
} from "./types";
import { formatCurrency, formatNumber } from "./utils";

interface AdUnitFormProps {
  adUnit?: AdUnit; // Si es null, estamos creando una nueva ad unit
  campaignId: string;
  campaignName: string;
  existingLines: number; // Número de líneas existentes para asignar automáticamente
  onSave: (adUnit: AdUnit) => void;
  onCancel: () => void;
}

const AdUnitForm: React.FC<AdUnitFormProps> = ({
  adUnit,
  campaignId,
  campaignName,
  existingLines,
  onSave,
  onCancel,
}) => {
  const isEditing = !!adUnit;
  const [selectedPublisher, setSelectedPublisher] = useState<Publisher | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [showPublisherDropdown, setShowPublisherDropdown] = useState(false);
  const [fileUploaded, setFileUploaded] = useState<File | null>(null);

  // Estado inicial para una nueva AdUnit o los valores existentes
  const [formData, setFormData] = useState<AdUnit>(
    adUnit || {
      id: "",
      line: (existingLines + 1).toString(), // Asignar automáticamente el número de línea
      publisher: "",
      market: "",
      channel: "",
      format: "",
      size: "",
      units: 0,
      model: "CPM",
      margin: "29.6%",
      unitCost: 0,
      investment: 0,
      usmcRate: 0,
      clientNetRate: 0,
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 1))
        .toISOString()
        .split("T")[0],
      status: "Pending",
      agencyCommission: 0,
      localTaxes: 0,
      grossMargin: 0,
      publisherNetCost: 0,
      publisherOpenRate: 0,
      publisherCommission: 0,
    }
  );

  // Buscar el publisher si estamos editando
  useEffect(() => {
    if (isEditing && adUnit && adUnit.publisher) {
      const foundPublisher = samplePublishers.find(
        (pub) => pub.name === adUnit.publisher
      );
      if (foundPublisher) {
        setSelectedPublisher(foundPublisher);
      }
    }
  }, [adUnit, isEditing]);

  // Filtrar publishers basado en el término de búsqueda
  const filteredPublishers = samplePublishers.filter((publisher) =>
    publisher.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Función principal para calcular todos los valores financieros
  const calculateFinancials = (data: AdUnit): AdUnit => {
    let updated = { ...data };

    // Si tenemos una tarifa abierta para el publisher, calculamos el costo neto del publisher
    if (updated.publisherOpenRate && updated.units) {
      updated.publisherNetCost = parseFloat(
        ((updated.publisherOpenRate * updated.units) / 1000).toFixed(2)
      );
    }
    // Si no, calculamos basado en el costo unitario
    else if (updated.units && updated.investment) {
      // 1. Calcular el costo unitario (unitCost) si tenemos unidades e inversión
      updated.unitCost = parseFloat(
        ((updated.investment / updated.units) * 1000).toFixed(4)
      );

      // 2. Calcular el costo neto del publisher (lo que le pagamos al medio)
      updated.publisherNetCost = parseFloat(
        ((updated.unitCost * updated.units) / 1000).toFixed(2)
      );
    }

    // 3. Aplicar comisiones de agencia (AVBs)
    const commissionAmount = updated.agencyCommission
      ? updated.investment * (updated.agencyCommission / 100)
      : 0;

    // 4. Aplicar comisión del publisher, si existe
    const publisherCommissionAmount =
      updated.publisherCommission && updated.publisherNetCost
        ? updated.publisherNetCost * (updated.publisherCommission / 100)
        : 0;

    // 5. Aplicar impuestos locales
    const taxAmount = updated.localTaxes
      ? updated.investment * (updated.localTaxes / 100)
      : 0;

    // 6. Calcular USMC Rate (lo que cobramos)
    // Si no existe un valor para clientNetRate, calculamos en base al unitCost
    if (!updated.clientNetRate && updated.unitCost) {
      updated.usmcRate = parseFloat((updated.unitCost * 0.8).toFixed(2));
      updated.clientNetRate = updated.unitCost;
    }
    // Si existe un clientNetRate, esto es lo que le cobramos al cliente
    else if (updated.clientNetRate) {
      updated.usmcRate = parseFloat((updated.clientNetRate * 0.8).toFixed(2));
    }

    // 7. Calcular el margen bruto (grossMargin)
    // El margen bruto es la diferencia entre lo que cobramos y lo que pagamos, dividido por lo que cobramos
    if (updated.investment && updated.publisherNetCost) {
      // Añadir la comisión del publisher al costo total si existe
      const totalPublisherCost =
        updated.publisherNetCost + publisherCommissionAmount;

      const grossProfit =
        updated.investment - totalPublisherCost - commissionAmount - taxAmount;
      updated.grossMargin = parseFloat(
        ((grossProfit / updated.investment) * 100).toFixed(2)
      );
    } else {
      updated.grossMargin = 0;
    }

    return updated;
  };

  // Seleccionar un publisher
  const selectPublisher = (publisher: Publisher) => {
    setSelectedPublisher(publisher);
    setFormData((prev) => {
      const updated = {
        ...prev,
        publisher: publisher.name,
        agencyCommission: publisher.agencyCommission,
      };

      // Recalcular valores financieros con el nuevo publisher
      return calculateFinancials(updated);
    });

    setShowPublisherDropdown(false);
    setSearchTerm("");
  };

  // Función para manejar cambios en los campos del formulario
  const handleChange = (field: keyof AdUnit, value: any) => {
    setFormData((prev) => {
      const updated = {
        ...prev,
        [field]: value,
      };

      // Recalcular valores dependientes si cambian units, investment, o impuestos
      if (
        field === "units" ||
        field === "investment" ||
        field === "localTaxes" ||
        field === "publisherOpenRate" ||
        field === "publisherCommission" ||
        field === "clientNetRate"
      ) {
        return calculateFinancials(updated);
      }

      return updated;
    });
  };

  // Manejar la carga de archivos
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileUploaded(e.target.files[0]);
    }
  };

  // Función para manejar el envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Asegurarse de que los cálculos financieros estén actualizados
    const finalData = calculateFinancials({
      ...formData,
      id: formData.id || `adunit-${Date.now()}`,
    });

    onSave(finalData);
  };

  return (
    <div className="bg-white shadow-lg border border-gray-200 rounded-xl overflow-hidden">
      <div className="p-5 border-b border-gray-200 bg-gradient-to-r from-indigo-600 to-blue-500 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white flex items-center">
          <svg
            className="h-6 w-6 mr-2"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          {isEditing ? "Edit Ad Unit" : "Create New Ad Unit"}
        </h2>

        {/* Botones de acción en la parte superior */}
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1 border border-white rounded-md text-sm font-medium text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={(e) => handleSubmit(e as unknown as React.FormEvent)}
            className="px-3 py-1 border border-white bg-white rounded-md text-sm font-medium text-indigo-600 hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white/50 transition-colors"
          >
            {isEditing ? "Save Changes" : "Create"}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sección de información principal */}
          <div className="bg-gradient-to-br from-white to-indigo-50 shadow-sm border border-indigo-100 rounded-xl p-5 md:col-span-2">
            <h3 className="text-lg font-medium text-indigo-900 mb-4 flex items-center">
              <svg
                className="h-5 w-5 mr-2 text-indigo-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
              Campaign & Publisher Information
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-indigo-600 mb-1">
                  Status
                </label>
                <select
                  className="mt-1 block w-full border-2 border-indigo-100 focus:border-indigo-300 rounded-md p-2 bg-white text-gray-900 focus:ring-0 transition-colors"
                  value={formData.status}
                  onChange={(e) => handleChange("status", e.target.value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Live">Live</option>
                  <option value="Implementation">Implementation</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-indigo-600 mb-1">
                  Line
                </label>
                <div className="mt-1 block w-full border-2 border-indigo-100 rounded-md p-2 bg-gray-50 text-gray-700">
                  {formData.line} {/* Line number is not editable */}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-indigo-600 mb-1">
                  Proposal
                </label>
                <div className="mt-1 block w-full border-2 border-indigo-100 rounded-md p-2 bg-gray-50 text-gray-700">
                  {campaignId} {/* Campaign ID is not editable */}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-indigo-600 mb-1">
                  Billing Line
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full border-2 border-indigo-100 focus:border-indigo-300 rounded-md p-2 text-gray-900 focus:ring-0 transition-colors"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-indigo-600 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  className="mt-1 block w-full border-2 border-indigo-100 focus:border-indigo-300 rounded-md p-2 text-gray-900 focus:ring-0 transition-colors"
                  value={formData.startDate}
                  onChange={(e) => handleChange("startDate", e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-indigo-600 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  className="mt-1 block w-full border-2 border-indigo-100 focus:border-indigo-300 rounded-md p-2 text-gray-900 focus:ring-0 transition-colors"
                  value={formData.endDate}
                  onChange={(e) => handleChange("endDate", e.target.value)}
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-indigo-600 mb-1">
                  Publisher
                </label>
                <div className="relative">
                  <input
                    type="text"
                    className="mt-1 block w-full border-2 border-indigo-100 focus:border-indigo-300 rounded-md p-2 text-gray-900 focus:ring-0 transition-colors"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search publishers..."
                    onFocus={() => setShowPublisherDropdown(true)}
                  />
                  {selectedPublisher && (
                    <div className="mt-1 flex items-center">
                      <span className="text-sm text-gray-600">Selected: </span>
                      <span className="ml-1 text-sm font-medium text-indigo-600">
                        {selectedPublisher.name}
                      </span>
                    </div>
                  )}
                  {showPublisherDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                      {filteredPublishers.length > 0 ? (
                        filteredPublishers.map((publisher) => (
                          <div
                            key={publisher.id}
                            className="px-4 py-2 hover:bg-indigo-50 cursor-pointer"
                            onClick={() => selectPublisher(publisher)}
                          >
                            <div className="font-medium">{publisher.name}</div>
                            <div className="text-xs text-gray-500">
                              {publisher.website}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-sm text-gray-500">
                          No publishers found
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-indigo-600 mb-1">
                  Website
                </label>
                <div className="mt-1 block w-full border-2 border-indigo-100 rounded-md p-2 bg-gray-50 text-gray-700">
                  {selectedPublisher ? selectedPublisher.website : "N/A"}
                  {/* Website is derived from publisher */}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-indigo-600 mb-1">
                  Publisher I/O
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full border-2 border-indigo-100 focus:border-indigo-300 rounded-md p-2 text-gray-900 focus:ring-0 transition-colors"
                  placeholder="e.g. 22996"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-indigo-600 mb-1">
                  PO Line
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full border-2 border-indigo-100 focus:border-indigo-300 rounded-md p-2 text-gray-900 focus:ring-0 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Sección de Producto */}
          <div className="bg-gradient-to-br from-white to-blue-50 shadow-sm border border-blue-100 rounded-xl p-5">
            <h3 className="text-lg font-medium text-blue-900 mb-4 flex items-center">
              <svg
                className="h-5 w-5 mr-2 text-blue-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 110 4h-5V9a1 1 0 10-2 0v1H4a2 2 0 110-4h1.17C5.06 5.687 5 5.35 5 5zm4 1V5a1 1 0 10-1 1h1zm3 0a1 1 0 10-1-1v1h1z"
                  clipRule="evenodd"
                />
                <path d="M9 11H3v5a2 2 0 002 2h4v-7zm2 7h4a2 2 0 002-2v-5h-6v7z" />
              </svg>
              Product Information
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-blue-600 mb-1">
                  Market
                </label>
                <select
                  className="mt-1 block w-full border-2 border-blue-100 focus:border-blue-300 rounded-md p-2 bg-white text-gray-900 focus:ring-0 transition-colors"
                  value={formData.market}
                  onChange={(e) => handleChange("market", e.target.value)}
                >
                  <option value="">Select Market</option>
                  {marketOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-600 mb-1">
                  Channels
                </label>
                <select
                  className="mt-1 block w-full border-2 border-blue-100 focus:border-blue-300 rounded-md p-2 bg-white text-gray-900 focus:ring-0 transition-colors"
                  value={formData.channel}
                  onChange={(e) => handleChange("channel", e.target.value)}
                >
                  <option value="">Select Channel</option>
                  {channelOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-600 mb-1">
                  Format
                </label>
                <select
                  className="mt-1 block w-full border-2 border-blue-100 focus:border-blue-300 rounded-md p-2 bg-white text-gray-900 focus:ring-0 transition-colors"
                  value={formData.format}
                  onChange={(e) => handleChange("format", e.target.value)}
                >
                  <option value="">Select Format</option>
                  {formatOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-600 mb-1">
                  Size
                </label>
                <select
                  className="mt-1 block w-full border-2 border-blue-100 focus:border-blue-300 rounded-md p-2 bg-white text-gray-900 focus:ring-0 transition-colors"
                  value={formData.size}
                  onChange={(e) => handleChange("size", e.target.value)}
                >
                  <option value="">Select Size</option>
                  {sizeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-600 mb-1">
                  Creative
                </label>
                <div className="mt-1 flex items-center">
                  <input
                    type="file"
                    id="creative-file"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  <label
                    htmlFor="creative-file"
                    className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md cursor-pointer text-sm font-medium transition-colors"
                  >
                    Choose File
                  </label>
                  <span className="ml-3 text-sm text-gray-600">
                    {fileUploaded ? fileUploaded.name : "No file chosen"}
                  </span>
                </div>
              </div>

              <div className="flex items-center mt-2">
                <input
                  id="v-ad"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 border-blue-300 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor="v-ad"
                  className="ml-2 block text-sm text-gray-700"
                >
                  V-Ad
                </label>
              </div>
            </div>
          </div>

          {/* Sección de Financiera */}
          <div className="bg-gradient-to-br from-white to-emerald-50 shadow-sm border border-emerald-100 rounded-xl p-5 md:col-span-3">
            <h3 className="text-lg font-medium text-emerald-900 mb-4 flex items-center">
              <svg
                className="h-5 w-5 mr-2 text-emerald-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              Financial Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Campos editables y principales */}
              <div className="bg-white shadow-sm border border-emerald-100 rounded-xl p-4">
                <h4 className="text-md font-medium text-emerald-800 mb-4">
                  Main Financial Inputs
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-emerald-600 mb-1">
                      Quantity
                    </label>
                    <input
                      type="number"
                      className="mt-1 block w-full border-2 border-emerald-100 focus:border-emerald-300 rounded-md p-2 text-gray-900 focus:ring-0 transition-colors"
                      value={formData.units}
                      onChange={(e) =>
                        handleChange("units", Number(e.target.value))
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-emerald-600 mb-1">
                      Model
                    </label>
                    <select
                      className="mt-1 block w-full border-2 border-emerald-100 focus:border-emerald-300 rounded-md p-2 bg-white text-gray-900 focus:ring-0 transition-colors"
                      value={formData.model}
                      onChange={(e) => handleChange("model", e.target.value)}
                    >
                      {modelOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-emerald-600 mb-1">
                      Investment
                    </label>
                    <input
                      type="number"
                      className="mt-1 block w-full border-2 border-emerald-100 focus:border-emerald-300 rounded-md p-2 text-gray-900 font-bold focus:ring-0 transition-colors"
                      value={formData.investment}
                      onChange={(e) =>
                        handleChange("investment", Number(e.target.value))
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-emerald-600 mb-1">
                      Click Through Rate
                    </label>
                    <input
                      type="text"
                      className="mt-1 block w-full border-2 border-emerald-100 focus:border-emerald-300 rounded-md p-2 text-gray-900 focus:ring-0 transition-colors"
                      placeholder="0.05"
                    />
                  </div>
                </div>

                {/* Sección de costos ocultos */}
                <div className="mt-6">
                  <h4 className="text-md font-medium text-emerald-800 mb-4">
                    Hidden Costs
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label className="flex justify-between text-sm font-medium text-emerald-600 mb-1">
                        <span>Agency Commission (AVBs)</span>
                        <span className="text-gray-500">
                          {formData.agencyCommission}%
                        </span>
                      </label>
                      <div className="mt-1 block w-full border-2 border-emerald-100 rounded-md p-2 bg-gray-50 text-gray-900 font-medium">
                        {formatCurrency(
                          (formData.investment *
                            (formData.agencyCommission || 0)) /
                            100
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="flex justify-between text-sm font-medium text-emerald-600 mb-1">
                        <span>Local Taxes</span>
                        <span>% of total</span>
                      </label>
                      <div className="flex items-center">
                        <input
                          type="number"
                          className="mt-1 block w-20 border-2 border-emerald-100 focus:border-emerald-300 rounded-md p-2 text-gray-900 focus:ring-0 transition-colors"
                          value={formData.localTaxes || ""}
                          onChange={(e) =>
                            handleChange("localTaxes", Number(e.target.value))
                          }
                          placeholder="0"
                        />
                        <span className="mx-2 text-gray-600">%</span>
                        <div className="flex-1 ml-2 block border-2 border-emerald-100 rounded-md p-2 bg-gray-50 text-gray-900 font-medium">
                          {formatCurrency(
                            (formData.investment * (formData.localTaxes || 0)) /
                              100
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sección de tarifas para Publisher */}
                <div className="mt-6">
                  <h4 className="text-md font-medium text-emerald-800 mb-4">
                    Publisher Rates
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-emerald-600 mb-1">
                        Open Rate (Publisher Payment)
                      </label>
                      <div className="flex items-center">
                        <span className="text-gray-500 font-medium mr-2">
                          $
                        </span>
                        <input
                          type="number"
                          step="0.01"
                          className="mt-1 block w-full border-2 border-emerald-100 focus:border-emerald-300 rounded-md p-2 text-gray-900 focus:ring-0 transition-colors"
                          placeholder="0.00"
                          value={formData.publisherOpenRate || ""}
                          onChange={(e) =>
                            handleChange(
                              "publisherOpenRate",
                              Number(e.target.value)
                            )
                          }
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-emerald-600 mb-1">
                        Publisher Commission (Optional)
                      </label>
                      <div className="flex items-center">
                        <input
                          type="number"
                          className="mt-1 block w-20 border-2 border-emerald-100 focus:border-emerald-300 rounded-md p-2 text-gray-900 focus:ring-0 transition-colors"
                          placeholder="0"
                          value={formData.publisherCommission || ""}
                          onChange={(e) =>
                            handleChange(
                              "publisherCommission",
                              Number(e.target.value)
                            )
                          }
                        />
                        <span className="mx-2 text-gray-600">%</span>
                        <div className="flex-1 ml-2 block border-2 border-emerald-100 rounded-md p-2 bg-gray-50 text-gray-900 font-medium">
                          {formatCurrency(
                            ((formData.publisherNetCost || 0) *
                              (formData.publisherCommission || 0)) /
                              100
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sección de tarifas para Customer */}
                <div className="mt-6">
                  <h4 className="text-md font-medium text-emerald-800 mb-4">
                    Customer Rates
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-emerald-600 mb-1">
                        Rate (Customer Charge)
                      </label>
                      <div className="flex items-center">
                        <span className="text-gray-500 font-medium mr-2">
                          $
                        </span>
                        <input
                          type="number"
                          step="0.01"
                          className="mt-1 block w-full border-2 border-emerald-100 focus:border-emerald-300 rounded-md p-2 text-gray-900 font-bold focus:ring-0 transition-colors"
                          value={formData.clientNetRate || ""}
                          onChange={(e) =>
                            handleChange(
                              "clientNetRate",
                              Number(e.target.value)
                            )
                          }
                          placeholder="0.00"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        This will modify the rate we charge to the customer.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Resumen financiero y valores calculados */}
              <div className="bg-white shadow-sm border border-emerald-100 rounded-xl p-4">
                <div className="mb-6">
                  <h4 className="text-md font-medium text-emerald-800 mb-4">
                    Publisher Cost
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-emerald-600 mb-1">
                        Unit Price
                      </label>
                      <div className="mt-1 block w-full border-2 border-emerald-100 rounded-md p-2 bg-emerald-50 text-gray-900 font-medium">
                        {formData.unitCost
                          ? `$${formData.unitCost.toFixed(4)}`
                          : "$0.0000"}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-emerald-600 mb-1">
                        Publisher Net Cost
                      </label>
                      <div className="mt-1 block w-full border-2 border-emerald-100 rounded-md p-2 bg-emerald-50 text-gray-900 font-medium">
                        {formatCurrency(formData.publisherNetCost || 0)}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-emerald-600 mb-1">
                        Deliv.Pub Server
                      </label>
                      <input
                        type="text"
                        className="mt-1 block w-full border-2 border-emerald-100 focus:border-emerald-300 rounded-md p-2 text-gray-900 focus:ring-0 transition-colors"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-medium text-emerald-800 mb-4">
                    Customer Results
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-emerald-600 mb-1">
                        USMC Rate
                      </label>
                      <div className="mt-1 block w-full border-2 border-emerald-100 rounded-md p-2 bg-emerald-50 text-gray-900 font-medium">
                        {formData.usmcRate
                          ? `$${formData.usmcRate.toFixed(2)}`
                          : "$0.00"}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-emerald-600 mb-1">
                        Client Net Rate
                      </label>
                      <div className="mt-1 block w-full border-2 border-emerald-100 rounded-md p-2 bg-emerald-50 text-gray-900 font-medium">
                        {formData.clientNetRate
                          ? `$${formData.clientNetRate.toFixed(2)}`
                          : "$0.00"}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-emerald-600 mb-1">
                        Deliv.Cust Server
                      </label>
                      <input
                        type="text"
                        className="mt-1 block w-full border-2 border-emerald-100 focus:border-emerald-300 rounded-md p-2 text-gray-900 focus:ring-0 transition-colors"
                        placeholder="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-emerald-600 mb-1">
                        Gross Margin
                      </label>
                      <div
                        className={`mt-1 block w-full border-2 ${
                          (formData.grossMargin || 0) >= 25
                            ? "border-green-200 bg-green-50"
                            : (formData.grossMargin || 0) >= 15
                            ? "border-yellow-200 bg-yellow-50"
                            : "border-red-200 bg-red-50"
                        } rounded-md p-2 text-gray-900 font-bold`}
                      >
                        {(formData.grossMargin || 0).toFixed(2)}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sección de Notas */}
          <div className="bg-gradient-to-br from-white to-amber-50 shadow-sm border border-amber-100 rounded-xl p-5 md:col-span-3">
            <h3 className="text-lg font-medium text-amber-900 mb-4 flex items-center">
              <svg
                className="h-5 w-5 mr-2 text-amber-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z"
                  clipRule="evenodd"
                />
              </svg>
              Notes
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-amber-600 mb-1">
                  Customer IO Note
                </label>
                <textarea className="mt-1 block w-full border-2 border-amber-100 focus:border-amber-300 rounded-md p-2 text-gray-900 focus:ring-0 transition-colors min-h-[80px]"></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-amber-600 mb-1">
                  Publisher IO Note
                </label>
                <textarea className="mt-1 block w-full border-2 border-amber-100 focus:border-amber-300 rounded-md p-2 text-gray-900 focus:ring-0 transition-colors min-h-[80px]"></textarea>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-amber-600 mb-1">
                  Edit Log Note
                </label>
                <textarea className="mt-1 block w-full border-2 border-amber-100 focus:border-amber-300 rounded-md p-2 text-gray-900 focus:ring-0 transition-colors min-h-[80px]"></textarea>
              </div>
            </div>
          </div>
        </div>

        {/* Botones de acción en la parte inferior */}
        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            {isEditing ? "Save Changes" : "Create Ad Unit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdUnitForm;
