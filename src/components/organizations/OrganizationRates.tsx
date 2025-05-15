// /src/components/organizations/OrganizationRates.tsx

import React, { useState } from "react";
import {
  FaPlus,
  FaSave,
  FaTimes,
  FaPencilAlt,
  FaTrash,
  FaCoins,
  FaCalendarAlt,
  FaTag,
} from "react-icons/fa";

// Define rate interface
interface Rate {
  id: string;
  name: string;
  format: string;
  pricePerUnit: number;
  currency: string;
  effectiveDate: string;
  expirationDate?: string;
  notes?: string;
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
}

const OrganizationRates: React.FC<OrganizationRatesProps> = ({
  organization,
  hideActionButtons = false,
}) => {
  // Example data
  const initialRates: Rate[] = [
    {
      id: "rate1",
      name: "Display Banner 300x250",
      format: "Banner",
      pricePerUnit: 5.0,
      currency: "USD",
      effectiveDate: "2025-01-01",
      expirationDate: "2025-12-31",
      notes: "Standard rate for medium sized banners",
    },
    {
      id: "rate2",
      name: "Video Preroll 15s",
      format: "Video",
      pricePerUnit: 12.5,
      currency: "USD",
      effectiveDate: "2025-01-01",
      expirationDate: "2025-12-31",
      notes: "Rate for short preroll videos",
    },
    {
      id: "rate3",
      name: "Native Sponsored Content",
      format: "Native",
      pricePerUnit: 1500,
      currency: "USD",
      effectiveDate: "2025-01-01",
      expirationDate: "2025-12-31",
      notes: "Rate per sponsored article",
    },
  ];

  const [rates, setRates] = useState<Rate[]>(initialRates);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null); // ID of the rate being edited
  const [newRate, setNewRate] = useState<Omit<Rate, "id">>({
    name: "",
    format: "Banner",
    pricePerUnit: 0,
    currency: "USD",
    effectiveDate: new Date().toISOString().split("T")[0],
  });

  // Available formats
  const formats = ["Banner", "Video", "Native", "Audio", "Social", "Email"];
  const currencies = ["USD", "MXN", "BRL", "ARS", "CLP", "COP", "EUR"];

  // Handle adding new rate
  const handleAddRate = () => {
    setIsAdding(true);
    setIsEditing(null);
    setNewRate({
      name: "",
      format: "Banner",
      pricePerUnit: 0,
      currency: "USD",
      effectiveDate: new Date().toISOString().split("T")[0],
    });
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
      };
      setRates([...rates, rate]);
      setIsAdding(false);
    }
  };

  // Cancel adding rate
  const handleCancelAdd = () => {
    setIsAdding(false);
  };

  // Start editing a rate
  const handleEditRate = (id: string) => {
    setIsEditing(id);
    setIsAdding(false);
  };

  // Handle changes to edited rate
  const handleEditRateChange = (
    id: string,
    field: keyof Rate,
    value: string | number
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

  // Delete rate
  const handleDeleteRate = (id: string) => {
    if (window.confirm("Are you sure you want to delete this rate?")) {
      setRates(rates.filter((rate) => rate.id !== id));
      if (isEditing === id) {
        setIsEditing(null);
      }
    }
  };

  // Format currency
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(amount);
  };

  return (
    <div className="bg-white shadow-sm rounded-lg">
      {!hideActionButtons && (
        <div className="flex justify-end items-center p-4">
          <button
            onClick={handleAddRate}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-md text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
            aria-label={`Add rate for ${organization.name}`}
          >
            <FaPlus className="h-4 w-4" />
            Add Rate
          </button>
        </div>
      )}

      {/* Form to add new rate */}
      {isAdding && (
        <div className="p-6 border-b border-gray-200 bg-gradient-to-b from-teal-50 to-white">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-teal-800">Add New Rate</h3>
            <div className="flex gap-2">
              <button
                onClick={handleSaveNewRate}
                className="px-3 py-1 bg-teal-600 hover:bg-teal-700 text-white rounded-md text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
              >
                <FaSave className="h-4 w-4" />
                Save
              </button>
              <button
                onClick={handleCancelAdd}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {formats.map((format) => (
                  <option key={format} value={format}>
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
                  className="w-2/3 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
                <select
                  value={newRate.currency}
                  onChange={(e) =>
                    handleNewRateChange("currency", e.target.value)
                  }
                  className="w-1/3 px-3 py-2 border border-l-0 border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  {currencies.map((currency) => (
                    <option key={currency} value={currency}>
                      {currency}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Effective date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Effective Date
              </label>
              <input
                type="date"
                value={newRate.effectiveDate}
                onChange={(e) =>
                  handleNewRateChange("effectiveDate", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* Expiration date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expiration Date
              </label>
              <input
                type="date"
                value={newRate.expirationDate || ""}
                onChange={(e) =>
                  handleNewRateChange("expirationDate", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
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
              className="px-4 py-2 bg-teal-100 hover:bg-teal-200 text-teal-700 rounded-md text-sm font-medium transition-colors inline-flex items-center justify-center gap-2 shadow-sm mx-auto"
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
                  Effective Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Expiration Date
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
                      ? "bg-teal-50"
                      : "hover:bg-teal-50 transition-colors"
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
                        className="w-full px-2 py-1 border border-teal-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                      />
                    ) : (
                      <div className="text-sm font-medium text-gray-900 flex items-center">
                        <FaTag className="h-4 w-4 mr-2 text-teal-500" />
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
                        className="w-full px-2 py-1 border border-teal-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                      >
                        {formats.map((format) => (
                          <option key={format} value={format}>
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
                          className="w-24 px-2 py-1 border border-teal-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
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
                          className="ml-2 px-2 py-1 border border-teal-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                        >
                          {currencies.map((currency) => (
                            <option key={currency} value={currency}>
                              {currency}
                            </option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-900 font-medium flex items-center">
                        <FaCoins className="h-3.5 w-3.5 mr-1.5 text-amber-500" />
                        {formatCurrency(rate.pricePerUnit, rate.currency)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {isEditing === rate.id ? (
                      <input
                        type="date"
                        value={rate.effectiveDate}
                        onChange={(e) =>
                          handleEditRateChange(
                            rate.id,
                            "effectiveDate",
                            e.target.value
                          )
                        }
                        className="w-full px-2 py-1 border border-teal-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                      />
                    ) : (
                      <div className="text-sm text-gray-500 flex items-center">
                        <FaCalendarAlt className="h-3.5 w-3.5 mr-1.5 text-teal-500" />
                        {new Date(rate.effectiveDate).toLocaleDateString()}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {isEditing === rate.id ? (
                      <input
                        type="date"
                        value={rate.expirationDate || ""}
                        onChange={(e) =>
                          handleEditRateChange(
                            rate.id,
                            "expirationDate",
                            e.target.value
                          )
                        }
                        className="w-full px-2 py-1 border border-teal-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                      />
                    ) : (
                      <div className="text-sm text-gray-500">
                        {rate.expirationDate
                          ? new Date(rate.expirationDate).toLocaleDateString()
                          : "-"}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {isEditing === rate.id ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={handleSaveEdit}
                          className="text-teal-600 hover:text-teal-900 transition-colors"
                        >
                          <FaSave className="h-4 w-4" />
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="text-gray-500 hover:text-gray-700 transition-colors"
                        >
                          <FaTimes className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditRate(rate.id)}
                          className="text-indigo-600 hover:text-indigo-900 transition-colors"
                        >
                          <FaPencilAlt className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteRate(rate.id)}
                          className="text-red-600 hover:text-red-900 transition-colors"
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
