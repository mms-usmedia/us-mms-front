// /src/components/campaigns/AdUnitForm.tsx
import React, { useState, useEffect } from "react";
import { AdUnit, samplePublishers, Publisher } from "./types";
import {
  marketOptions,
  channelOptions,
  formatOptions,
  sizeOptions,
  modelOptions,
} from "./types";
import { formatCurrency } from "./utils";

interface AdUnitFormProps {
  adUnit?: AdUnit; // Si es null, estamos creando una nueva ad unit
  _campaignId: string; // Cambiado a _campaignId para indicar que no se usa
  existingLines: number; // Número de líneas existentes para asignar automáticamente
  onSave: (adUnit: AdUnit) => void;
  onCancel: () => void;
}

const AdUnitForm: React.FC<AdUnitFormProps> = ({
  adUnit,
  _campaignId,
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

  // Estados para controlar el desbloqueo secuencial de campos
  const [fieldsEnabled, setFieldsEnabled] = useState({
    market: false,
    channel: false,
    format: false,
    model: false,
    size: false,
  });

  // Estado para guardar el precio unitario automático
  const [_autoUnitPrice, setAutoUnitPrice] = useState<number | null>(null);

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
      customerNetRate: 0,
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
        setFieldsEnabled((prev) => ({ ...prev, market: true }));
      }
    }
  }, [adUnit, isEditing]);

  // Efecto para simular auto-relleno de precios cuando se selecciona el tamaño
  useEffect(() => {
    if (
      formData.publisher &&
      formData.market &&
      formData.channel &&
      formData.format &&
      formData.model &&
      formData.size
    ) {
      // Aquí simularíamos una llamada al backend para obtener el precio
      // Por ahora, generamos un valor aleatorio para demostrar la funcionalidad
      const mockPublisherPrice = parseFloat((Math.random() * 5 + 3).toFixed(2));

      // Actualizamos los valores automáticos
      setAutoUnitPrice(mockPublisherPrice);

      // Actualizamos el formulario con los valores predeterminados
      setFormData((prev) => {
        const updated = {
          ...prev,
          publisherOpenRate: mockPublisherPrice,
          // Establecemos un margen bruto predeterminado del 30%
          grossMargin: 30,
        };

        // Calculamos la tarifa del customer basada en el margen
        const marginPercentage = updated.grossMargin / 100;
        updated.customerNetRate = parseFloat(
          (mockPublisherPrice / (1 - marginPercentage)).toFixed(2)
        );

        return calculateFinancials(updated);
      });
    }
  }, [
    formData.publisher,
    formData.market,
    formData.channel,
    formData.format,
    formData.model,
    formData.size,
  ]);

  // Efecto para actualizar los impuestos según el mercado seleccionado
  useEffect(() => {
    if (formData.market) {
      let taxRate = 0;

      // Asignar tasa de impuesto según el mercado
      if (formData.market === "Mexico" || formData.market === "México") {
        taxRate = 16;
      } else if (formData.market === "Colombia") {
        taxRate = 19;
      } else if (formData.market === "Argentina") {
        taxRate = 21;
      } else if (formData.market === "Chile") {
        taxRate = 19;
      }

      // Actualizar el estado con la tasa de impuesto correspondiente
      setFormData((prev) => {
        const updated = {
          ...prev,
          localTaxes: taxRate,
        };

        return calculateFinancials(updated);
      });
    }
  }, [formData.market]);

  // Filtrar publishers basado en el término de búsqueda
  const filteredPublishers = samplePublishers.filter((publisher) =>
    publisher.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Función principal para calcular todos los valores financieros
  const calculateFinancials = (data: AdUnit): AdUnit => {
    const updated = { ...data };

    // Si tenemos unidades y una tarifa del publisher, calculamos el costo
    if (updated.units && updated.publisherOpenRate) {
      // Calcular el costo neto del publisher (lo que le pagamos al medio)
      updated.publisherNetCost = parseFloat(
        ((updated.publisherOpenRate * updated.units) / 1000).toFixed(2)
      );

      // Calcular la inversión total si tenemos unidades y costo neto
      if (!updated.investment) {
        updated.investment = updated.publisherNetCost;
      }
    }

    // Si tenemos tarifa de publisher pero no tarifa de customer o margen bruto, establecemos valores predeterminados
    if (
      updated.publisherOpenRate &&
      !updated.customerNetRate &&
      !updated.grossMargin
    ) {
      // Establecer un margen bruto predeterminado del 30%
      updated.grossMargin = 30;

      // Calcular la tarifa del customer basada en el margen deseado
      const marginPercentage = updated.grossMargin / 100;
      updated.customerNetRate = parseFloat(
        (updated.publisherOpenRate / (1 - marginPercentage)).toFixed(2)
      );
    }

    // Si tenemos tarifa del customer, calculamos la tarifa USMC (lo que recibimos)
    if (updated.customerNetRate) {
      updated.usmcRate = parseFloat((updated.customerNetRate * 0.8).toFixed(2));
    }

    // Si tenemos tarifa del customer y tarifa del publisher, calculamos el margen bruto
    if (
      updated.customerNetRate &&
      updated.publisherOpenRate &&
      !updated.grossMargin
    ) {
      const marginValue =
        1 - updated.publisherOpenRate / updated.customerNetRate;
      updated.grossMargin = parseFloat((marginValue * 100).toFixed(2));
    }

    // Si tenemos margen bruto y tarifa del publisher, calculamos la tarifa del customer
    if (
      updated.grossMargin &&
      updated.publisherOpenRate &&
      !updated.customerNetRate
    ) {
      const marginPercentage = updated.grossMargin / 100;
      updated.customerNetRate = parseFloat(
        (updated.publisherOpenRate / (1 - marginPercentage)).toFixed(2)
      );
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

    // Desbloquear el campo de mercado después de seleccionar publisher
    setFieldsEnabled((prev) => ({ ...prev, market: true }));
    setShowPublisherDropdown(false);
    setSearchTerm("");
  };

  // Función para manejar cambios en los campos del formulario
  const handleChange = (
    field: keyof AdUnit,
    value: string | number | boolean
  ) => {
    setFormData((prev) => {
      const updated = {
        ...prev,
        [field]: value,
      };

      // Desbloquear campos secuencialmente según la selección
      if (field === "market" && value) {
        setFieldsEnabled((prev) => ({ ...prev, channel: true }));
      } else if (field === "channel" && value) {
        setFieldsEnabled((prev) => ({ ...prev, format: true }));
      } else if (field === "format" && value) {
        setFieldsEnabled((prev) => ({ ...prev, model: true }));
      } else if (field === "model" && value) {
        setFieldsEnabled((prev) => ({ ...prev, size: true }));
      }

      // Cálculos relacionados con el margen bruto y tarifa del customer
      if (field === "grossMargin" && value !== undefined) {
        const marginPercentage = Number(value) / 100;

        // Solo calcular si tenemos una tarifa del publisher válida
        if (updated.publisherOpenRate && updated.publisherOpenRate > 0) {
          // Calcular la tarifa del customer basada en el margen deseado
          // Fórmula: customerRate = publisherRate / (1 - margin)
          const calculatedCustomerRate =
            updated.publisherOpenRate / (1 - marginPercentage);
          updated.customerNetRate = parseFloat(
            calculatedCustomerRate.toFixed(2)
          );
        }
      } else if (field === "customerNetRate" && value !== undefined) {
        // Solo calcular si tenemos una tarifa del publisher válida
        if (
          updated.publisherOpenRate &&
          updated.publisherOpenRate > 0 &&
          Number(value) > 0
        ) {
          // Calcular el margen basado en la tarifa del customer
          // Fórmula: margin = 1 - (publisherRate / customerRate)
          const marginValue = 1 - updated.publisherOpenRate / Number(value);
          updated.grossMargin = parseFloat((marginValue * 100).toFixed(2));
        }
      }

      // Recalcular valores dependientes
      if (
        field === "units" ||
        field === "investment" ||
        field === "localTaxes" ||
        field === "publisherOpenRate" ||
        field === "publisherCommission" ||
        field === "customerNetRate" ||
        field === "grossMargin"
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
      <div className="p-5 border-b border-gray-200 bg-white flex justify-between items-center">
        <h2 className="text-xl font-semibold text-orange-600 flex items-center">
          <svg
            className="h-6 w-6 mr-2 text-orange-500"
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
            className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={(e) => handleSubmit((e as unknown) as React.FormEvent)}
            className="px-3 py-1 border border-orange-500 bg-orange-500 rounded-md text-sm font-medium text-white hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-colors"
          >
            {isEditing ? "Save Changes" : "Create"}
          </button>
        </div>
      </div>

      {/* Guía de pasos a seguir */}
      <div className="bg-gray-50 border-b border-gray-200 px-5 py-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-orange-500 text-white font-medium flex items-center justify-center shadow-sm">
              1
            </div>
            <span className="ml-2 text-sm font-medium text-orange-600">
              General Information
            </span>
            <svg
              className="h-5 w-5 text-orange-400 mx-2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-orange-400 text-white font-medium flex items-center justify-center shadow-sm">
              2
            </div>
            <span className="ml-2 text-sm font-medium text-orange-600">
              Configure Product
            </span>
            <svg
              className="h-5 w-5 text-orange-400 mx-2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-orange-300 text-white font-medium flex items-center justify-center shadow-sm">
              3
            </div>
            <span className="ml-2 text-sm font-medium text-orange-600">
              Financial Data
            </span>
            <svg
              className="h-5 w-5 text-orange-400 mx-2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-orange-200 text-orange-700 font-medium flex items-center justify-center shadow-sm">
              4
            </div>
            <span className="ml-2 text-sm font-medium text-orange-600">
              Additional Notes
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sección de información principal */}
          <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-5 md:col-span-1">
            <h3 className="text-lg font-medium text-orange-600 mb-4 flex items-center">
              <svg
                className="h-6 w-6 mr-2 text-orange-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
              <span className="text-orange-600">General Information</span>
            </h3>

            <div className="space-y-4">
              <div className="bg-white rounded-lg border-2 border-gray-200 p-4 shadow-sm">
                <h4 className="text-orange-700 font-semibold mb-3 flex items-center">
                  <div className="h-6 w-6 rounded-full bg-orange-700 text-white font-medium flex items-center justify-center text-xs mr-2">
                    1
                  </div>
                  Campaign and Publisher Information
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Line
                    </label>
                    <div className="mt-1 block w-full border-2 border-gray-200 rounded-md p-2 bg-gray-50 text-gray-700">
                      {formData.line}{" "}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      className="mt-1 block w-full border-2 border-gray-200 focus:border-gray-400 rounded-md p-2 text-gray-900 focus:ring-0 transition-colors"
                      value={formData.startDate}
                      onChange={(e) =>
                        handleChange("startDate", e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      className="mt-1 block w-full border-2 border-gray-200 focus:border-gray-400 rounded-md p-2 text-gray-900 focus:ring-0 transition-colors"
                      value={formData.endDate}
                      onChange={(e) => handleChange("endDate", e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Publisher
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        className="mt-1 block w-full border-2 border-gray-200 focus:border-gray-400 rounded-md p-2 text-gray-900 focus:ring-0 transition-colors"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search publishers..."
                        onFocus={() => setShowPublisherDropdown(true)}
                      />
                      {selectedPublisher && (
                        <div className="mt-2 p-2 border border-gray-200 rounded-md bg-gray-50 flex items-center">
                          <div className="flex-1">
                            <p className="font-medium text-gray-800">
                              {selectedPublisher.name}
                            </p>
                            <p className="text-xs text-gray-600">
                              {selectedPublisher.website}
                            </p>
                          </div>
                          <span className="px-2 py-1 bg-gray-200 text-gray-800 text-xs font-medium rounded-md">
                            Selected
                          </span>
                        </div>
                      )}
                      {showPublisherDropdown && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                          {filteredPublishers.length > 0 ? (
                            filteredPublishers.map((publisher) => (
                              <div
                                key={publisher.id}
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => selectPublisher(publisher)}
                              >
                                <div className="font-medium">
                                  {publisher.name}
                                </div>
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
                </div>
              </div>
            </div>
          </div>

          {/* Sección de Producto */}
          <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-5 md:col-span-2">
            <h3 className="text-lg font-medium text-orange-600 mb-4 flex items-center">
              <svg
                className="h-6 w-6 mr-2 text-orange-500"
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
              <span className="text-orange-600">Product Information</span>
              <span className="ml-2 px-2 py-1 bg-orange-600 text-white text-xs rounded-full">
                Important
              </span>
            </h3>

            <div className="bg-white rounded-lg border-2 border-gray-200 p-4 shadow-sm">
              <h4 className="text-orange-700 font-medium mb-4 flex items-center">
                <div className="h-6 w-6 rounded-full bg-orange-400 text-white font-medium flex items-center justify-center text-xs mr-2 shadow-sm">
                  2
                </div>
                <span className="text-orange-700 font-semibold">
                  Configure Product
                </span>
              </h4>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Market
                  </label>
                  <select
                    className={`mt-1 block w-full border-2 ${
                      fieldsEnabled.market
                        ? "border-gray-200 focus:border-gray-400 bg-white"
                        : "border-gray-200 bg-gray-100 cursor-not-allowed"
                    } rounded-md p-2 text-gray-900 focus:ring-0 transition-colors`}
                    value={formData.market}
                    onChange={(e) => handleChange("market", e.target.value)}
                    disabled={!fieldsEnabled.market}
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
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Channels
                  </label>
                  <select
                    className={`mt-1 block w-full border-2 ${
                      fieldsEnabled.channel
                        ? "border-gray-200 focus:border-gray-400 bg-white"
                        : "border-gray-200 bg-gray-100 cursor-not-allowed"
                    } rounded-md p-2 text-gray-900 focus:ring-0 transition-colors`}
                    value={formData.channel}
                    onChange={(e) => handleChange("channel", e.target.value)}
                    disabled={!fieldsEnabled.channel}
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
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Format
                  </label>
                  <select
                    className={`mt-1 block w-full border-2 ${
                      fieldsEnabled.format
                        ? "border-gray-200 focus:border-gray-400 bg-white"
                        : "border-gray-200 bg-gray-100 cursor-not-allowed"
                    } rounded-md p-2 text-gray-900 focus:ring-0 transition-colors`}
                    value={formData.format}
                    onChange={(e) => handleChange("format", e.target.value)}
                    disabled={!fieldsEnabled.format}
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
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Model
                  </label>
                  <select
                    className={`mt-1 block w-full border-2 ${
                      fieldsEnabled.model
                        ? "border-gray-200 focus:border-gray-400 bg-white"
                        : "border-gray-200 bg-gray-100 cursor-not-allowed"
                    } rounded-md p-2 text-gray-900 focus:ring-0 transition-colors`}
                    value={formData.model}
                    onChange={(e) => handleChange("model", e.target.value)}
                    disabled={!fieldsEnabled.model}
                  >
                    {modelOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Size
                  </label>
                  <select
                    className={`mt-1 block w-full border-2 ${
                      fieldsEnabled.size
                        ? "border-gray-200 focus:border-gray-400 bg-white"
                        : "border-gray-200 bg-gray-100 cursor-not-allowed"
                    } rounded-md p-2 text-gray-900 focus:ring-0 transition-colors`}
                    value={formData.size}
                    onChange={(e) => handleChange("size", e.target.value)}
                    disabled={!fieldsEnabled.size}
                  >
                    <option value="">Select Size</option>
                    {sizeOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-600 mb-1">
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
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md cursor-pointer text-sm font-medium transition-colors"
                    >
                      Choose File
                    </label>
                    <span className="ml-3 text-sm text-gray-600">
                      {fileUploaded ? fileUploaded.name : "No file selected"}
                    </span>
                  </div>
                </div>

                <div className="col-span-2">
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
            </div>
          </div>

          {/* Sección de Financiera */}
          <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-5 md:col-span-3">
            <h3 className="text-lg font-medium text-orange-600 mb-4 flex items-center">
              <svg
                className="h-6 w-6 mr-2 text-orange-500"
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
              <span className="text-orange-600">Financial Information</span>
              <div className="h-6 w-6 rounded-full bg-orange-300 text-white font-medium flex items-center justify-center text-xs ml-2 shadow-sm">
                3
              </div>
            </h3>

            <div className="grid grid-cols-1 gap-6">
              {/* Nuevo diseño de la sección financiera */}
              <div className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-200">
                {/* Encabezado con explicación */}

                {/* Contenido en tres columnas */}
                <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* COLUMNA 1: Datos principales que el usuario debe ingresar */}
                  <div className="space-y-4 border-r border-gray-200 pr-4">
                    <h5 className="font-medium text-orange-600 pb-2 border-b border-gray-200 flex items-center">
                      <span className="inline-block w-5 h-5 bg-white border-2 border-orange-500 rounded-full mr-2"></span>
                      Data to Complete
                    </h5>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Units
                      </label>
                      <input
                        type="number"
                        className="mt-1 block w-full border-2 border-gray-200 focus:border-gray-400 rounded-md p-2 text-gray-900 focus:ring-0 transition-colors font-medium"
                        value={formData.units}
                        onChange={(e) =>
                          handleChange("units", Number(e.target.value))
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Publisher Open Rate
                      </label>
                      <div className="flex items-center">
                        <span className="text-gray-500 font-medium mr-2">
                          $
                        </span>
                        <div className="flex-1 block border-2 border-gray-200 rounded-md p-2 bg-gray-50 text-gray-900 font-medium">
                          {formData.publisherOpenRate
                            ? formData.publisherOpenRate.toFixed(2)
                            : "0.00"}
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Automatically calculated from the system
                      </p>
                    </div>

                    <div className="relative pt-5 pb-3">
                      <div
                        className="absolute inset-0 flex items-center"
                        aria-hidden="true"
                      >
                        <div className="w-full border-t border-gray-200"></div>
                      </div>
                      <div className="relative flex justify-center">
                        <span className="px-2 bg-white text-sm text-gray-600 font-medium">
                          Choose one of the two fields
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Desired Gross Margin (%)
                      </label>
                      <div className="flex items-center">
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="100"
                          className="mt-1 block w-full border-2 border-gray-200 focus:border-gray-400 rounded-md p-2 text-gray-900 focus:ring-0 transition-colors font-bold"
                          value={formData.grossMargin || ""}
                          onChange={(e) =>
                            handleChange("grossMargin", Number(e.target.value))
                          }
                          placeholder="Ex: 30"
                        />
                        <span className="ml-2 text-gray-600">%</span>
                        {formData.grossMargin !== undefined &&
                          formData.grossMargin > 0 && (
                            <span
                              className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                                formData.grossMargin >= 25
                                  ? "bg-green-100 text-green-800"
                                  : formData.grossMargin >= 15
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {formData.grossMargin >= 25
                                ? "Excellent"
                                : formData.grossMargin >= 15
                                ? "Acceptable"
                                : "Low"}
                            </span>
                          )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Automatically affects the customer rate
                      </p>
                    </div>

                    <div className="flex items-center justify-center my-2">
                      <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-medium">
                        or
                      </span>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Customer Rate
                      </label>
                      <div className="flex items-center">
                        <span className="text-gray-500 font-medium mr-2">
                          $
                        </span>
                        <input
                          type="number"
                          step="0.01"
                          className="mt-1 block w-full border-2 border-gray-200 focus:border-gray-400 rounded-md p-2 text-gray-900 focus:ring-0 transition-colors font-bold"
                          value={formData.customerNetRate || ""}
                          onChange={(e) =>
                            handleChange(
                              "customerNetRate",
                              Number(e.target.value)
                            )
                          }
                          placeholder="0.00"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Automatically affects the gross margin
                      </p>
                    </div>
                  </div>

                  {/* COLUMNA 2: Costos adicionales e impuestos */}
                  <div className="space-y-4 border-r border-gray-200 pr-4">
                    <h5 className="font-medium text-orange-600 pb-2 border-b border-gray-200 flex items-center">
                      <span className="inline-block w-5 h-5 bg-gray-50 border-2 border-orange-500 rounded-full mr-2"></span>
                      Commissions and Taxes - Advertisers
                    </h5>

                    <div>
                      <label className="flex justify-between text-sm font-medium text-gray-600 mb-1">
                        <span>Agency Commission (AVBs)</span>
                        <span className="text-gray-500">
                          {formData.agencyCommission}%
                        </span>
                      </label>
                      <div className="mt-1 block w-full border-2 border-gray-200 rounded-md p-2 bg-gray-50 text-gray-900 font-medium">
                        {formatCurrency(
                          (formData.investment *
                            (formData.agencyCommission || 0)) /
                            100
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Automatically obtained from the Publisher
                      </p>
                    </div>

                    <div>
                      <label className="flex justify-between text-sm font-medium text-gray-600 mb-1">
                        <span>Local Taxes</span>
                        <span>
                          {formData.market === "Mexico" ||
                          formData.market === "México"
                            ? "16%"
                            : formData.market === "Colombia"
                            ? "19%"
                            : "0%"}
                        </span>
                      </label>
                      <div className="flex-1 block border-2 border-gray-200 rounded-md p-2 bg-gray-50 text-gray-900 font-medium">
                        {formatCurrency(
                          (formData.investment * (formData.localTaxes || 0)) /
                            100
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Based on the selected market
                      </p>
                    </div>

                    <div className="py-3">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>

                    <h5 className="font-medium text-orange-600 pb-2 border-b border-gray-200 flex items-center">
                      <span className="inline-block w-5 h-5 bg-gray-50 border-2 border-orange-500 rounded-full mr-2"></span>
                      Commissions and Taxes - Customers
                    </h5>

                    <div>
                      <label className="flex justify-between text-sm font-medium text-gray-600 mb-1">
                        <span>Customer Commission</span>
                        <span className="text-gray-500">0%</span>
                      </label>
                      <div className="mt-1 block w-full border-2 border-gray-200 rounded-md p-2 bg-gray-50 text-gray-900 font-medium">
                        {formatCurrency(0)}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Commission applied to customer
                      </p>
                    </div>

                    <div>
                      <label className="flex justify-between text-sm font-medium text-gray-600 mb-1">
                        <span>Customer Tax</span>
                        <span className="text-gray-500">0%</span>
                      </label>
                      <div className="mt-1 block w-full border-2 border-gray-200 rounded-md p-2 bg-gray-50 text-gray-900 font-medium">
                        {formatCurrency(0)}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Tax applied to customer
                      </p>
                    </div>
                  </div>

                  {/* COLUMNA 3: Resultados finales */}
                  <div className="space-y-4">
                    <h5 className="font-medium text-orange-600 pb-2 border-b border-gray-200 flex items-center">
                      <span className="inline-block w-5 h-5 bg-orange-100 border-2 border-orange-500 rounded-full mr-2"></span>
                      Calculated Rates
                    </h5>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Unit Price
                      </label>
                      <div className="mt-1 block w-full border-2 border-gray-200 rounded-md p-2 bg-gray-50 text-gray-900 font-medium">
                        {formData.unitCost
                          ? `$${formData.unitCost.toFixed(4)}`
                          : "$0.0000"}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Automatically calculated
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        USMC Rate
                      </label>
                      <div className="mt-1 block w-full border-2 border-gray-200 rounded-md p-2 bg-gray-50 text-gray-900 font-medium">
                        {formData.usmcRate
                          ? `$${formData.usmcRate.toFixed(2)}`
                          : "$0.00"}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        80% of the customer rate
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Customer Rate
                      </label>
                      <div className="mt-1 block w-full border-2 border-gray-200 rounded-md p-2 bg-gray-50 text-gray-900 font-medium">
                        {formData.customerNetRate
                          ? `$${formData.customerNetRate.toFixed(2)}`
                          : "$0.00"}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        What we charge the customer
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sección de Notas */}
          <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-5 md:col-span-3">
            <h3 className="text-lg font-medium text-orange-600 mb-4 flex items-center">
              <svg
                className="h-5 w-5 mr-2 text-orange-500"
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

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h4 className="text-orange-700 font-medium mb-3 flex items-center">
                <div className="h-6 w-6 rounded-full bg-orange-200 text-orange-700 font-medium flex items-center justify-center text-xs mr-2 shadow-sm">
                  4
                </div>
                Additional Information
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Note for Customer IO
                  </label>
                  <textarea
                    className="mt-1 block w-full border-2 border-gray-200 focus:border-gray-400 rounded-md p-2 text-gray-900 focus:ring-0 transition-colors min-h-[80px]"
                    placeholder="Information that will appear on the customer order"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Note for Publisher IO
                  </label>
                  <textarea
                    className="mt-1 block w-full border-2 border-gray-200 focus:border-gray-400 rounded-md p-2 text-gray-900 focus:ring-0 transition-colors min-h-[80px]"
                    placeholder="Information that will appear on the publisher order"
                  ></textarea>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Edit Log Note
                  </label>
                  <textarea
                    className="mt-1 block w-full border-2 border-gray-200 focus:border-gray-400 rounded-md p-2 text-gray-900 focus:ring-0 transition-colors min-h-[80px]"
                    placeholder="Internal comments or notes about changes"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Botones de acción en la parte inferior */}
        <div className="mt-6 bg-gray-50 rounded-xl border border-gray-200 p-4 flex justify-between items-center">
          <div className="flex items-center">
            <svg
              className="h-5 w-5 text-orange-400 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm text-gray-600">
              {isEditing
                ? "Changes will be saved to the current campaign."
                : "The new unit will be added to the current campaign."}
            </span>
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors flex items-center"
            >
              <svg
                className="h-4 w-4 mr-1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              {isEditing ? "Save Changes" : "Create Ad Unit"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdUnitForm;
