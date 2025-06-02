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
  campaignId: string;
  existingLines: number; // Número de líneas existentes para asignar automáticamente
  onSave: (adUnit: AdUnit) => void;
  onCancel: () => void;
}

const AdUnitForm: React.FC<AdUnitFormProps> = ({
  adUnit,
  campaignId,
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
    const updated = { ...data };

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
  const handleChange = (
    field: keyof AdUnit,
    value: string | number | boolean
  ) => {
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
          {isEditing ? "Editar Ad Unit" : "Crear Nueva Ad Unit"}
        </h2>

        {/* Botones de acción en la parte superior */}
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1 border border-white rounded-md text-sm font-medium text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={(e) => handleSubmit((e as unknown) as React.FormEvent)}
            className="px-3 py-1 border border-white bg-white rounded-md text-sm font-medium text-indigo-600 hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white/50 transition-colors"
          >
            {isEditing ? "Guardar Cambios" : "Crear"}
          </button>
        </div>
      </div>

      {/* Guía de pasos a seguir */}
      <div className="bg-gray-50 border-b border-gray-200 px-5 py-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-indigo-600 text-white font-medium flex items-center justify-center">
              1
            </div>
            <span className="ml-2 text-sm font-medium text-gray-700">
              Información General
            </span>
            <svg
              className="h-5 w-5 text-gray-400 mx-2"
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
            <div className="h-8 w-8 rounded-full bg-blue-600 text-white font-medium flex items-center justify-center">
              2
            </div>
            <span className="ml-2 text-sm font-medium text-gray-700">
              Configura Producto
            </span>
            <svg
              className="h-5 w-5 text-gray-400 mx-2"
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
            <div className="h-8 w-8 rounded-full bg-emerald-600 text-white font-medium flex items-center justify-center">
              3
            </div>
            <span className="ml-2 text-sm font-medium text-gray-700">
              Datos Financieros
            </span>
            <svg
              className="h-5 w-5 text-gray-400 mx-2"
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
            <div className="h-8 w-8 rounded-full bg-amber-600 text-white font-medium flex items-center justify-center">
              4
            </div>
            <span className="ml-2 text-sm font-medium text-gray-700">
              Notas Adicionales
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sección de información principal */}
          <div className="bg-gradient-to-br from-white to-indigo-50 shadow-sm border border-indigo-100 rounded-xl p-5 md:col-span-1">
            <h3 className="text-lg font-medium text-indigo-900 mb-4 flex items-center">
              <svg
                className="h-6 w-6 mr-2 text-indigo-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
              <span className="text-indigo-900">Información General</span>
            </h3>

            <div className="space-y-4">
              <div className="bg-white rounded-lg border-2 border-indigo-200 p-4 shadow-sm">
                <h4 className="text-indigo-800 font-semibold mb-3 flex items-center">
                  <div className="h-6 w-6 rounded-full bg-indigo-600 text-white font-medium flex items-center justify-center text-xs mr-2">
                    1
                  </div>
                  Información de Campaña y Publisher
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-indigo-600 mb-1">
                      Línea
                    </label>
                    <div className="mt-1 block w-full border-2 border-indigo-100 rounded-md p-2 bg-gray-50 text-gray-700">
                      {formData.line}{" "}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-indigo-600 mb-1">
                      Fecha de Inicio
                    </label>
                    <input
                      type="date"
                      className="mt-1 block w-full border-2 border-indigo-100 focus:border-indigo-300 rounded-md p-2 text-gray-900 focus:ring-0 transition-colors"
                      value={formData.startDate}
                      onChange={(e) =>
                        handleChange("startDate", e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-indigo-600 mb-1">
                      Fecha de Fin
                    </label>
                    <input
                      type="date"
                      className="mt-1 block w-full border-2 border-indigo-100 focus:border-indigo-300 rounded-md p-2 text-gray-900 focus:ring-0 transition-colors"
                      value={formData.endDate}
                      onChange={(e) => handleChange("endDate", e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-indigo-600 mb-1">
                      Publisher
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        className="mt-1 block w-full border-2 border-indigo-100 focus:border-indigo-300 rounded-md p-2 text-gray-900 focus:ring-0 transition-colors"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar publishers..."
                        onFocus={() => setShowPublisherDropdown(true)}
                      />
                      {selectedPublisher && (
                        <div className="mt-2 p-2 border border-indigo-100 rounded-md bg-indigo-50 flex items-center">
                          <div className="flex-1">
                            <p className="font-medium text-indigo-800">
                              {selectedPublisher.name}
                            </p>
                            <p className="text-xs text-indigo-600">
                              {selectedPublisher.website}
                            </p>
                          </div>
                          <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded-md">
                            Seleccionado
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
                              No se encontraron publishers
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
          <div className="bg-gradient-to-br from-white to-blue-50 shadow-sm border border-blue-100 rounded-xl p-5 md:col-span-2">
            <h3 className="text-lg font-medium text-blue-900 mb-4 flex items-center">
              <svg
                className="h-6 w-6 mr-2 text-blue-500"
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
              <span className="text-blue-900">Información del Producto</span>
              <span className="ml-2 px-2 py-1 bg-blue-500 text-white text-xs rounded-full">
                Importante
              </span>
            </h3>

            <div className="bg-white rounded-lg border-2 border-blue-200 p-4 shadow-sm">
              <h4 className="text-blue-800 font-medium mb-4 flex items-center">
                <div className="h-6 w-6 rounded-full bg-blue-600 text-white font-medium flex items-center justify-center text-xs mr-2">
                  2
                </div>
                <span className="text-blue-800 font-semibold">
                  Configura el Producto
                </span>
              </h4>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-blue-600 mb-1">
                    Mercado
                  </label>
                  <select
                    className="mt-1 block w-full border-2 border-blue-100 focus:border-blue-300 rounded-md p-2 bg-white text-gray-900 focus:ring-0 transition-colors"
                    value={formData.market}
                    onChange={(e) => handleChange("market", e.target.value)}
                  >
                    <option value="">Seleccionar Mercado</option>
                    {marketOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-600 mb-1">
                    Canales
                  </label>
                  <select
                    className="mt-1 block w-full border-2 border-blue-100 focus:border-blue-300 rounded-md p-2 bg-white text-gray-900 focus:ring-0 transition-colors"
                    value={formData.channel}
                    onChange={(e) => handleChange("channel", e.target.value)}
                  >
                    <option value="">Seleccionar Canal</option>
                    {channelOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-600 mb-1">
                    Formato
                  </label>
                  <select
                    className="mt-1 block w-full border-2 border-blue-100 focus:border-blue-300 rounded-md p-2 bg-white text-gray-900 focus:ring-0 transition-colors"
                    value={formData.format}
                    onChange={(e) => handleChange("format", e.target.value)}
                  >
                    <option value="">Seleccionar Formato</option>
                    {formatOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-600 mb-1">
                    Tamaño
                  </label>
                  <select
                    className="mt-1 block w-full border-2 border-blue-100 focus:border-blue-300 rounded-md p-2 bg-white text-gray-900 focus:ring-0 transition-colors"
                    value={formData.size}
                    onChange={(e) => handleChange("size", e.target.value)}
                  >
                    <option value="">Seleccionar Tamaño</option>
                    {sizeOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-blue-600 mb-1">
                    Creatividad
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
                      Elegir Archivo
                    </label>
                    <span className="ml-3 text-sm text-gray-600">
                      {fileUploaded
                        ? fileUploaded.name
                        : "Ningún archivo seleccionado"}
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
          <div className="bg-gradient-to-br from-white to-emerald-50 shadow-sm border border-emerald-100 rounded-xl p-5 md:col-span-3">
            <h3 className="text-lg font-medium text-emerald-900 mb-4 flex items-center">
              <svg
                className="h-6 w-6 mr-2 text-emerald-500"
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
              <span className="text-emerald-900">Información Financiera</span>
              <div className="h-6 w-6 rounded-full bg-emerald-600 text-white font-medium flex items-center justify-center text-xs ml-2">
                3
              </div>
            </h3>

            <div className="grid grid-cols-1 gap-6">
              {/* Nuevo diseño de la sección financiera */}
              <div className="bg-white shadow-md rounded-xl overflow-hidden border border-emerald-100">
                {/* Encabezado con explicación */}
                <div className="bg-emerald-50 p-4 border-b border-emerald-100">
                  <h4 className="text-emerald-800 font-medium">
                    ¿Cómo funciona?
                  </h4>
                  <p className="text-sm text-emerald-700 mt-1">
                    Esta sección calcula automáticamente valores financieros
                    basados en los datos que ingreses. Los campos editables
                    están en blanco, mientras que los campos calculados
                    automáticamente tienen un fondo verde claro.
                  </p>
                </div>

                {/* Contenido en tres columnas */}
                <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* COLUMNA 1: Datos principales que el usuario debe ingresar */}
                  <div className="space-y-4 border-r border-emerald-100 pr-4">
                    <h5 className="font-medium text-emerald-900 pb-2 border-b border-emerald-100 flex items-center">
                      <span className="inline-block w-5 h-5 bg-white border-2 border-emerald-300 rounded-full mr-2"></span>
                      Datos a completar
                    </h5>

                    <div>
                      <label className="block text-sm font-medium text-emerald-600 mb-1">
                        Cantidad (Units)
                      </label>
                      <input
                        type="number"
                        className="mt-1 block w-full border-2 border-emerald-200 focus:border-emerald-400 rounded-md p-2 text-gray-900 focus:ring-0 transition-colors font-medium"
                        value={formData.units}
                        onChange={(e) =>
                          handleChange("units", Number(e.target.value))
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-emerald-600 mb-1">
                        Modelo
                      </label>
                      <select
                        className="mt-1 block w-full border-2 border-emerald-200 focus:border-emerald-400 rounded-md p-2 bg-white text-gray-900 focus:ring-0 transition-colors font-medium"
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
                        Inversión Total
                      </label>
                      <input
                        type="number"
                        className="mt-1 block w-full border-2 border-emerald-200 focus:border-emerald-400 rounded-md p-2 text-gray-900 focus:ring-0 transition-colors font-bold"
                        value={formData.investment}
                        onChange={(e) =>
                          handleChange("investment", Number(e.target.value))
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-emerald-600 mb-1">
                        Tarifa del Publisher
                      </label>
                      <div className="flex items-center">
                        <span className="text-gray-500 font-medium mr-2">
                          $
                        </span>
                        <input
                          type="number"
                          step="0.01"
                          className="mt-1 block w-full border-2 border-emerald-200 focus:border-emerald-400 rounded-md p-2 text-gray-900 focus:ring-0 transition-colors font-medium"
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
                        Tarifa para el Cliente
                      </label>
                      <div className="flex items-center">
                        <span className="text-gray-500 font-medium mr-2">
                          $
                        </span>
                        <input
                          type="number"
                          step="0.01"
                          className="mt-1 block w-full border-2 border-emerald-200 focus:border-emerald-400 rounded-md p-2 text-gray-900 focus:ring-0 transition-colors font-bold"
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
                    </div>
                  </div>

                  {/* COLUMNA 2: Costos adicionales e impuestos */}
                  <div className="space-y-4 border-r border-emerald-100 pr-4">
                    <h5 className="font-medium text-emerald-900 pb-2 border-b border-emerald-100 flex items-center">
                      <span className="inline-block w-5 h-5 bg-emerald-50 border-2 border-emerald-300 rounded-full mr-2"></span>
                      Costos e Impuestos
                    </h5>

                    <div>
                      <label className="flex justify-between text-sm font-medium text-emerald-600 mb-1">
                        <span>Comisión de Agencia (AVBs)</span>
                        <span className="text-gray-500">
                          {formData.agencyCommission}%
                        </span>
                      </label>
                      <div className="mt-1 block w-full border-2 border-emerald-100 rounded-md p-2 bg-emerald-50 text-gray-900 font-medium">
                        {formatCurrency(
                          (formData.investment *
                            (formData.agencyCommission || 0)) /
                            100
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Obtenido automáticamente del Publisher
                      </p>
                    </div>

                    <div>
                      <label className="flex justify-between text-sm font-medium text-emerald-600 mb-1">
                        <span>Impuestos Locales</span>
                        <span>% del total</span>
                      </label>
                      <div className="flex items-center">
                        <input
                          type="number"
                          className="mt-1 block w-20 border-2 border-emerald-200 focus:border-emerald-400 rounded-md p-2 text-gray-900 focus:ring-0 transition-colors"
                          value={formData.localTaxes || ""}
                          onChange={(e) =>
                            handleChange("localTaxes", Number(e.target.value))
                          }
                          placeholder="0"
                        />
                        <span className="mx-2 text-gray-600">%</span>
                        <div className="flex-1 ml-2 block border-2 border-emerald-100 rounded-md p-2 bg-emerald-50 text-gray-900 font-medium">
                          {formatCurrency(
                            (formData.investment * (formData.localTaxes || 0)) /
                              100
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-emerald-600 mb-1">
                        Comisión del Publisher
                      </label>
                      <div className="flex items-center">
                        <input
                          type="number"
                          className="mt-1 block w-20 border-2 border-emerald-200 focus:border-emerald-400 rounded-md p-2 text-gray-900 focus:ring-0 transition-colors"
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
                        <div className="flex-1 ml-2 block border-2 border-emerald-100 rounded-md p-2 bg-emerald-50 text-gray-900 font-medium">
                          {formatCurrency(
                            ((formData.publisherNetCost || 0) *
                              (formData.publisherCommission || 0)) /
                              100
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Opcional - si el publisher cobra comisión adicional
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-emerald-600 mb-1">
                        Precio Unitario (CPM)
                      </label>
                      <div className="mt-1 block w-full border-2 border-emerald-100 rounded-md p-2 bg-emerald-50 text-gray-900 font-medium">
                        {formData.unitCost
                          ? `$${formData.unitCost.toFixed(4)}`
                          : "$0.0000"}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Calculado automáticamente
                      </p>
                    </div>
                  </div>

                  {/* COLUMNA 3: Resultados finales */}
                  <div className="space-y-4">
                    <h5 className="font-medium text-emerald-900 pb-2 border-b border-emerald-100 flex items-center">
                      <span className="inline-block w-5 h-5 bg-emerald-200 border-2 border-emerald-400 rounded-full mr-2"></span>
                      Resultados
                    </h5>

                    <div>
                      <label className="block text-sm font-medium text-emerald-600 mb-1">
                        Costo Neto para Publisher
                      </label>
                      <div className="mt-1 block w-full border-2 border-emerald-100 rounded-md p-2 bg-emerald-50 text-gray-900 font-medium">
                        {formatCurrency(formData.publisherNetCost || 0)}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Lo que le pagamos al Publisher
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-emerald-600 mb-1">
                        Tarifa USMC
                      </label>
                      <div className="mt-1 block w-full border-2 border-emerald-100 rounded-md p-2 bg-emerald-50 text-gray-900 font-medium">
                        {formData.usmcRate
                          ? `$${formData.usmcRate.toFixed(2)}`
                          : "$0.00"}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Lo que recibimos (80% de la tarifa del cliente)
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-emerald-600 mb-1">
                        Tarifa Neta del Cliente
                      </label>
                      <div className="mt-1 block w-full border-2 border-emerald-100 rounded-md p-2 bg-emerald-50 text-gray-900 font-medium">
                        {formData.clientNetRate
                          ? `$${formData.clientNetRate.toFixed(2)}`
                          : "$0.00"}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Lo que le cobramos al cliente
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-emerald-600 mb-1">
                        Margen Bruto
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
                      <p className="text-xs text-gray-500 mt-1">
                        {(formData.grossMargin || 0) >= 25
                          ? "Excelente margen"
                          : (formData.grossMargin || 0) >= 15
                          ? "Margen aceptable"
                          : "Margen bajo - revisar"}
                      </p>
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
              Notas
            </h3>

            <div className="bg-white rounded-lg border border-amber-100 p-4">
              <h4 className="text-amber-800 font-medium mb-3 flex items-center">
                <div className="h-6 w-6 rounded-full bg-amber-600 text-white font-medium flex items-center justify-center text-xs mr-2">
                  4
                </div>
                Información Adicional
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-amber-600 mb-1">
                    Nota para IO del Cliente
                  </label>
                  <textarea
                    className="mt-1 block w-full border-2 border-amber-100 focus:border-amber-300 rounded-md p-2 text-gray-900 focus:ring-0 transition-colors min-h-[80px]"
                    placeholder="Información que aparecerá en la orden del cliente"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-amber-600 mb-1">
                    Nota para IO del Publisher
                  </label>
                  <textarea
                    className="mt-1 block w-full border-2 border-amber-100 focus:border-amber-300 rounded-md p-2 text-gray-900 focus:ring-0 transition-colors min-h-[80px]"
                    placeholder="Información que aparecerá en la orden del publisher"
                  ></textarea>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-amber-600 mb-1">
                    Nota de Registro de Edición
                  </label>
                  <textarea
                    className="mt-1 block w-full border-2 border-amber-100 focus:border-amber-300 rounded-md p-2 text-gray-900 focus:ring-0 transition-colors min-h-[80px]"
                    placeholder="Comentarios o notas internas sobre los cambios"
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
              className="h-5 w-5 text-gray-400 mr-2"
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
                ? "Los cambios se guardarán en la campaña actual."
                : "La nueva unidad se agregará a la campaña actual."}
            </span>
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors flex items-center"
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
              {isEditing ? "Guardar Cambios" : "Crear Ad Unit"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdUnitForm;
