// /src/components/organizations/OrganizationRates.tsx

import React, { useState, useEffect } from "react";
import {
  FaPlus,
  FaSave,
  FaTimes,
  FaPencilAlt,
  FaTrash,
  FaCoins,
} from "react-icons/fa";
import PublisherRateForm from "./PublisherRateForm";

// Define rate interface
interface Rate {
  id: string;
  name: string;
  format: string;
  pricePerUnit: number;
  currency: string;
  notes?: string;
  isActive: boolean;
}

// Interfaz para la tarifa del publisher
interface PublisherRate {
  id?: string;
  publisher: string;
  channel: string;
  format: string;
  size: string;
  commercialModel: string;
  openRate: number;
  isActive: boolean;
}

// Organization interface for props
interface Organization {
  id: string;
  name: string;
  type: string;
}

// Props for the component
interface OrganizationRatesProps {
  organization: Organization;
  hideActionButtons?: boolean;
  showAddRateForm?: boolean;
  onFormDisplay?: () => void;
}

const OrganizationRates: React.FC<OrganizationRatesProps> = ({
  organization,
  hideActionButtons = false,
  showAddRateForm = false,
  onFormDisplay,
}) => {
  // Example data
  const initialRates: Rate[] = [
    {
      id: "rate1",
      name: "Display Banner 300x250",
      format: "Banner",
      pricePerUnit: 5.0,
      currency: "USD",
      notes: "Standard rate for medium sized banners",
      isActive: true,
    },
    {
      id: "rate2",
      name: "Video Preroll 15s",
      format: "Video",
      pricePerUnit: 12.5,
      currency: "USD",
      notes: "Rate for short preroll videos",
      isActive: true,
    },
    {
      id: "rate3",
      name: "Native Sponsored Content",
      format: "Native",
      pricePerUnit: 1500,
      currency: "USD",
      notes: "Rate per sponsored article",
      isActive: false,
    },
  ];

  const [rates, setRates] = useState<Rate[]>(initialRates);
  const [isAdding, setIsAdding] = useState(false);
  const [isAddingPublisherRate, setIsAddingPublisherRate] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null); // ID of the rate being edited
  const [newRate, setNewRate] = useState<Omit<Rate, "id">>({
    name: "",
    format: "Banner",
    pricePerUnit: 0,
    currency: "USD",
    notes: "",
    isActive: true,
  });

  // Available formats
  const formats = ["Banner", "Video", "Native", "Audio", "Social", "Email"];
  const currencies = ["USD", "MXN", "BRL", "ARS", "CLP", "COP", "EUR"];

  // Estado para el modal de confirmación de eliminación
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [rateToDelete, setRateToDelete] = useState<string | null>(null);

  // Efecto para detectar cuando se debe mostrar el formulario desde la prop showAddRateForm
  useEffect(() => {
    if (showAddRateForm && !isAddingPublisherRate) {
      console.log("showAddRateForm es true, mostrando formulario de rate");
      setIsAddingPublisherRate(true);
      setIsAdding(false);
      setIsEditing(null);
      if (onFormDisplay) {
        onFormDisplay();
      }
    }
  }, [showAddRateForm, onFormDisplay, isAddingPublisherRate]);

  // Handle adding new rate
  const handleAddRate = () => {
    setIsAddingPublisherRate(true);
    setIsAdding(false);
    setIsEditing(null);
  };

  // Handle changes to new rate
  const handleNewRateChange = (
    field: keyof Omit<Rate, "id">,
    value: string | number
  ) => {
    setNewRate({
      ...newRate,
      [field]: value,
    });
  };

  // Save new rate
  const handleSaveNewRate = () => {
    if (newRate.name && newRate.pricePerUnit > 0) {
      const rate: Rate = {
        id: `rate${Date.now()}`,
        ...newRate,
        isActive: true, // Por defecto activo
      };
      setRates([...rates, rate]);
      setIsAdding(false);
    }
  };

  // Save new publisher rate
  const handleSavePublisherRate = (publisherRate: PublisherRate) => {
    console.log("Publisher Rate guardado:", publisherRate);

    // Convertir PublisherRate a Rate para mantener compatibilidad
    const rate: Rate = {
      id: publisherRate.id || `rate${Date.now()}`,
      name: `${publisherRate.channel} ${publisherRate.format} ${publisherRate.size}`,
      format: publisherRate.format,
      pricePerUnit: publisherRate.openRate,
      currency: "USD", // Asumimos USD por defecto
      notes: `Channel: ${publisherRate.channel}, Commercial Model: ${publisherRate.commercialModel}`,
      isActive: publisherRate.isActive,
    };

    console.log("Rate convertido para la tabla:", rate);
    setRates([...rates, rate]);
    setIsAddingPublisherRate(false);
  };

  // Cancel adding rate
  const handleCancelAdd = () => {
    console.log("Cancelando agregar rate");
    setIsAdding(false);
    setIsAddingPublisherRate(false);
  };

  // Start editing a rate
  const handleEditRate = (id: string) => {
    setIsEditing(id);
    setIsAdding(false);
    setIsAddingPublisherRate(false);
  };

  // Handle changes to edited rate
  const handleEditRateChange = (
    id: string,
    field: keyof Rate,
    value: string | number | boolean
  ) => {
    setRates(
      rates.map((rate) =>
        rate.id === id
          ? {
              ...rate,
              [field]: value,
            }
          : rate
      )
    );
  };

  // Save edited rate
  const handleSaveEdit = () => {
    setIsEditing(null);
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setIsEditing(null);
  };

  // Modificar para mostrar el modal de confirmación
  const handleDeleteRate = (id: string) => {
    setRateToDelete(id);
    setShowDeleteModal(true);
  };

  // Confirmar eliminación del rate
  const confirmDeleteRate = () => {
    if (rateToDelete) {
      setRates(rates.filter((rate) => rate.id !== rateToDelete));
      if (isEditing === rateToDelete) {
        setIsEditing(null);
      }
      setShowDeleteModal(false);
      setRateToDelete(null);
    }
  };

  // Cancelar eliminación del rate
  const cancelDeleteRate = () => {
    setShowDeleteModal(false);
    setRateToDelete(null);
  };

  // Format currency
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(amount);
  };

  // Agregar función para alternar el estado activo/inactivo
  const handleToggleActive = (id: string) => {
    setRates(
      rates.map((rate) =>
        rate.id === id
          ? {
              ...rate,
              isActive: !rate.isActive,
            }
          : rate
      )
    );
  };

  return (
    <div className="bg-white shadow-sm rounded-lg">
      {!hideActionButtons && (
        <div className="flex justify-end items-center p-4">
          <button
            id="organization-add-rate-button"
            onClick={handleAddRate}
            className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-indigo-700 hover:from-indigo-600 hover:to-indigo-800 text-white rounded-md text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
            aria-label={`Add rate for ${organization.name}`}
          >
            <FaPlus className="h-4 w-4" />
            Add Rate
          </button>
        </div>
      )}

      {/* Publisher Rate Form */}
      {isAddingPublisherRate && (
        <div className="p-6 border-b border-gray-200">
          <PublisherRateForm
            onSave={handleSavePublisherRate}
            onCancel={handleCancelAdd}
            publisherName={organization.name}
          />
        </div>
      )}

      {/* Form to add legacy rate */}
      {isAdding && (
        <div className="p-6 border-b border-gray-200 bg-gradient-to-b from-indigo-50 to-white">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-indigo-800">
              Add New Rate
            </h3>
            <div className="flex gap-2">
              <button
                onClick={handleSaveNewRate}
                className="px-3 py-1.5 bg-gradient-to-r from-indigo-500 to-indigo-700 hover:from-indigo-600 hover:to-indigo-800 text-white rounded-md text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
              >
                <FaSave className="h-4 w-4" />
                Save
              </button>
              <button
                onClick={handleCancelAdd}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
              >
                <FaTimes className="h-4 w-4" />
                Cancel
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <input
                type="text"
                value={newRate.name}
                onChange={(e) => handleNewRateChange("name", e.target.value)}
                className="w-full px-3 py-2 border-2 border-indigo-100 focus:border-indigo-300 rounded-md focus:outline-none focus:ring-0 text-gray-900 bg-white"
                required
              />
            </div>

            {/* Format */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Format
              </label>
              <select
                value={newRate.format}
                onChange={(e) => handleNewRateChange("format", e.target.value)}
                className="w-full px-3 py-2 border-2 border-indigo-100 focus:border-indigo-300 rounded-md focus:outline-none focus:ring-0 text-gray-900 bg-white"
              >
                {formats.map((format) => (
                  <option key={format} value={format} className="text-gray-900">
                    {format}
                  </option>
                ))}
              </select>
            </div>

            {/* Price per unit */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price per Unit *
              </label>
              <div className="flex">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={newRate.pricePerUnit}
                  onChange={(e) =>
                    handleNewRateChange(
                      "pricePerUnit",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  className="w-2/3 px-3 py-2 border-2 border-indigo-100 focus:border-indigo-300 rounded-l-md focus:outline-none focus:ring-0 text-gray-900 bg-white"
                  required
                />
                <select
                  value={newRate.currency}
                  onChange={(e) =>
                    handleNewRateChange("currency", e.target.value)
                  }
                  className="w-1/3 px-3 py-2 border-2 border-l-0 border-indigo-100 focus:border-indigo-300 rounded-r-md focus:outline-none focus:ring-0 text-gray-900 bg-white"
                >
                  {currencies.map((currency) => (
                    <option
                      key={currency}
                      value={currency}
                      className="text-gray-900"
                    >
                      {currency}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Notes */}
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                value={newRate.notes || ""}
                onChange={(e) => handleNewRateChange("notes", e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border-2 border-indigo-100 focus:border-indigo-300 rounded-md focus:outline-none focus:ring-0 text-gray-900 bg-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* Rates table */}
      <div className="overflow-x-auto">
        {rates.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            <FaCoins className="mx-auto h-10 w-10 text-gray-300 mb-3" />
            <p className="text-lg mb-1">No rates defined yet</p>
            <p className="text-sm mb-3">
              Add a rate to define pricing for this organization
            </p>
            <button
              onClick={handleAddRate}
              className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-indigo-700 hover:from-indigo-600 hover:to-indigo-800 text-white rounded-md text-sm font-medium transition-colors inline-flex items-center justify-center gap-2 shadow-sm mx-auto"
            >
              <FaPlus className="h-4 w-4" />
              Add Your First Rate
            </button>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Format
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Price
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rates.map((rate) => (
                <tr
                  key={rate.id}
                  className={
                    isEditing === rate.id
                      ? "bg-indigo-50"
                      : "hover:bg-indigo-50 transition-colors"
                  }
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    {isEditing === rate.id ? (
                      <input
                        type="text"
                        value={rate.name}
                        onChange={(e) =>
                          handleEditRateChange(rate.id, "name", e.target.value)
                        }
                        className="w-full px-2 py-1 border-2 border-indigo-100 focus:border-indigo-300 rounded-md focus:outline-none focus:ring-0 text-gray-900 bg-white text-sm"
                      />
                    ) : (
                      <div className="text-sm font-medium text-gray-900">
                        {rate.name}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {isEditing === rate.id ? (
                      <select
                        value={rate.format}
                        onChange={(e) =>
                          handleEditRateChange(
                            rate.id,
                            "format",
                            e.target.value
                          )
                        }
                        className="w-full px-2 py-1 border-2 border-indigo-100 focus:border-indigo-300 rounded-md focus:outline-none focus:ring-0 text-gray-900 bg-white text-sm"
                      >
                        {formats.map((format) => (
                          <option
                            key={format}
                            value={format}
                            className="text-gray-900"
                          >
                            {format}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getFormatBadgeClass(
                          rate.format
                        )}`}
                      >
                        {rate.format}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {isEditing === rate.id ? (
                      <div className="flex items-center">
                        <input
                          type="number"
                          value={rate.pricePerUnit}
                          onChange={(e) =>
                            handleEditRateChange(
                              rate.id,
                              "pricePerUnit",
                              parseFloat(e.target.value)
                            )
                          }
                          className="w-24 px-2 py-1 border-2 border-indigo-100 focus:border-indigo-300 rounded-md focus:outline-none focus:ring-0 text-gray-900 bg-white text-sm"
                        />
                        <select
                          value={rate.currency}
                          onChange={(e) =>
                            handleEditRateChange(
                              rate.id,
                              "currency",
                              e.target.value
                            )
                          }
                          className="ml-2 px-2 py-1 border-2 border-indigo-100 focus:border-indigo-300 rounded-md focus:outline-none focus:ring-0 text-gray-900 bg-white text-sm"
                        >
                          {currencies.map((currency) => (
                            <option
                              key={currency}
                              value={currency}
                              className="text-gray-900"
                            >
                              {currency}
                            </option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-900 font-medium">
                        {formatCurrency(rate.pricePerUnit, rate.currency)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {isEditing === rate.id ? (
                      <select
                        value={rate.isActive.toString()}
                        onChange={(e) =>
                          handleEditRateChange(
                            rate.id,
                            "isActive",
                            e.target.value === "true"
                          )
                        }
                        className="w-full px-2 py-1 border-2 border-indigo-100 focus:border-indigo-300 rounded-md focus:outline-none focus:ring-0 text-gray-900 bg-white text-sm"
                      >
                        <option value="true" className="text-gray-900">
                          Active
                        </option>
                        <option value="false" className="text-gray-900">
                          Inactive
                        </option>
                      </select>
                    ) : (
                      <div className="flex items-center">
                        <button
                          onClick={() => handleToggleActive(rate.id)}
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full items-center ${
                            rate.isActive
                              ? "bg-green-100 text-green-800 border border-green-200 hover:bg-green-200"
                              : "bg-red-100 text-red-800 border border-red-200 hover:bg-red-200"
                          }`}
                        >
                          <span
                            className={`h-2 w-2 rounded-full mr-1.5 ${
                              rate.isActive ? "bg-green-600" : "bg-red-600"
                            }`}
                          ></span>
                          {rate.isActive ? "Active" : "Inactive"}
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {isEditing === rate.id ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={handleSaveEdit}
                          className="text-indigo-600 hover:text-indigo-900 transition-colors bg-indigo-50 hover:bg-indigo-100 rounded-full p-1"
                        >
                          <FaSave className="h-4 w-4" />
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="text-gray-500 hover:text-gray-700 transition-colors bg-gray-50 hover:bg-gray-100 rounded-full p-1"
                        >
                          <FaTimes className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditRate(rate.id)}
                          className="text-indigo-600 hover:text-indigo-900 transition-colors bg-indigo-50 hover:bg-indigo-100 rounded-full p-1"
                        >
                          <FaPencilAlt className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteRate(rate.id)}
                          className="text-red-600 hover:text-red-900 transition-colors bg-red-50 hover:bg-red-100 rounded-full p-1"
                        >
                          <FaTrash className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal de confirmación para eliminación */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 z-50 overflow-auto bg-black/30 backdrop-blur-sm flex justify-center items-center transition-all duration-300"
          onClick={cancelDeleteRate}
        >
          <div
            className="bg-white rounded-lg max-w-md w-full mx-4 shadow-xl transform transition-all"
            style={{ animation: "fadeInUp 0.3s ease-out forwards" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="mb-4 flex items-center">
                <div className="bg-gradient-to-r from-red-500 to-red-600 p-2 rounded-full mr-3 shadow-sm">
                  <FaTrash className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">
                  Confirmar eliminación
                </h3>
              </div>

              <div className="border-b border-gray-200 mt-2 mb-5"></div>

              <p className="text-gray-600 mb-6">
                ¿Estás seguro que deseas eliminar esta tarifa?
                <br />
                <span className="text-red-500 font-medium mt-1 block">
                  Esta acción no se puede deshacer.
                </span>
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={cancelDeleteRate}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm font-medium transition-colors flex items-center justify-center shadow-sm"
                >
                  <FaTimes className="h-3.5 w-3.5 mr-2" />
                  Cancelar
                </button>
                <button
                  onClick={confirmDeleteRate}
                  className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white rounded-md text-sm font-medium transition-colors flex items-center justify-center shadow-sm"
                >
                  <FaTrash className="h-3.5 w-3.5 mr-2" />
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Estilos para las animaciones */}
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

// Function to return a color class based on format
const getFormatBadgeClass = (format: string) => {
  switch (format) {
    case "Banner":
      return "bg-blue-100 text-blue-800 border border-blue-200";
    case "Video":
      return "bg-indigo-100 text-indigo-800 border border-indigo-200";
    case "Native":
      return "bg-green-100 text-green-800 border border-green-200";
    case "Audio":
      return "bg-amber-100 text-amber-800 border border-amber-200";
    case "Social":
      return "bg-pink-100 text-pink-800 border border-pink-200";
    case "Email":
      return "bg-violet-100 text-violet-800 border border-violet-200";
    default:
      return "bg-gray-100 text-gray-800 border border-gray-200";
  }
};

export default OrganizationRates;
