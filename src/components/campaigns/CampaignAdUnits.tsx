// /src/components/campaigns/CampaignAdUnits.tsx
import React, { useState } from "react";
import { AdUnit, Campaign } from "./types";
import { formatCurrency, formatNumber, truncateText } from "./utils";
import AdUnitDeleteModal from "./AdUnitDeleteModal";
import AdUnitForm from "./AdUnitForm";
import {
  marketOptions,
  channelOptions,
  formatOptions,
  sizeOptions,
  modelOptions,
} from "./types";

interface CampaignAdUnitsProps {
  campaign: Campaign;
  onSaveAdUnit: (adUnit: AdUnit) => void;
  onDeleteAdUnit: (adUnitId: string) => void;
}

const CampaignAdUnits: React.FC<CampaignAdUnitsProps> = ({
  campaign,
  onSaveAdUnit,
  onDeleteAdUnit,
}) => {
  const [editingAdUnit, setEditingAdUnit] = useState<string | null>(null);
  const [editedAdUnit, setEditedAdUnit] = useState<AdUnit | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [adUnitToDelete, setAdUnitToDelete] = useState<string | null>(null);
  const [showAdUnitForm, setShowAdUnitForm] = useState(false);
  const [selectedAdUnit, setSelectedAdUnit] = useState<AdUnit | null>(null);

  // Función para calcular valores dependientes cuando cambia la inversión o las unidades
  const calculateDependentValues = (field: string, value: number) => {
    if (!editedAdUnit) return;

    const updatedUnit = { ...editedAdUnit };

    if (field === "units") {
      // Si cambian las units, recalculamos unit cost
      if (updatedUnit.customerInvestment && value) {
        const unitCost = (updatedUnit.customerInvestment / value) * 1000;
        updatedUnit.unitCost = parseFloat(unitCost.toFixed(2));
      }
    } else if (field === "customerInvestment") {
      // Si cambia la inversión, recalculamos unit cost
      if (updatedUnit.units && value) {
        const unitCost = (value / updatedUnit.units) * 1000;
        updatedUnit.unitCost = parseFloat(unitCost.toFixed(2));
      }
    }

    // Calculamos el margen y Customer Net Rate
    updatedUnit.margin = "29.6%"; // Ejemplo

    // Customer Net Rate calculado a partir del Unit Cost y margen
    updatedUnit.customerNetRate = updatedUnit.unitCost
      ? updatedUnit.unitCost * 1.5
      : 0;

    setEditedAdUnit(updatedUnit);
  };

  // Función para manejar cambios en los campos editables
  const handleAdUnitChange = (field: keyof AdUnit, value: string | number) => {
    if (editedAdUnit) {
      const updatedAdUnit = {
        ...editedAdUnit,
        [field]: value,
      };

      setEditedAdUnit(updatedAdUnit);

      // Si cambia units o investment, recalcular los valores dependientes
      if (
        (field === "units" || field === "customerInvestment") &&
        typeof value === "number"
      ) {
        calculateDependentValues(field, value);
      }
    }
  };

  // Función para guardar los cambios
  const handleSaveAdUnit = () => {
    if (editedAdUnit) {
      onSaveAdUnit(editedAdUnit);
      setEditingAdUnit(null);
      setEditedAdUnit(null);
    }
  };

  // Función para cancelar la edición
  const handleCancelEdit = () => {
    setEditingAdUnit(null);
    setEditedAdUnit(null);
  };

  // Función para mostrar el modal de confirmación de eliminación
  const handleDeleteAdUnit = (adUnitId: string) => {
    setAdUnitToDelete(adUnitId);
    setShowDeleteModal(true);
  };

  // Función para confirmar la eliminación
  const confirmDeleteAdUnit = () => {
    if (adUnitToDelete) {
      onDeleteAdUnit(adUnitToDelete);
      setShowDeleteModal(false);
      setAdUnitToDelete(null);
    }
  };

  // Función para cancelar la eliminación
  const cancelDeleteAdUnit = () => {
    setShowDeleteModal(false);
    setAdUnitToDelete(null);
  };

  // Función para mostrar el formulario de nueva/editar ad unit
  const handleNewAdUnit = () => {
    setSelectedAdUnit(null);
    setShowAdUnitForm(true);
  };

  // Función para manejar el inicio de edición
  const handleEditAdUnit = (adUnit: AdUnit) => {
    setSelectedAdUnit(adUnit);
    setShowAdUnitForm(true);
  };

  // Función para guardar desde el formulario
  const handleSaveFromForm = (adUnit: AdUnit) => {
    onSaveAdUnit(adUnit);
    setShowAdUnitForm(false);
    setSelectedAdUnit(null);
  };

  // Función para cancelar el formulario
  const handleCancelForm = () => {
    setShowAdUnitForm(false);
    setSelectedAdUnit(null);
  };

  // Si estamos mostrando el formulario, lo renderizamos
  if (showAdUnitForm) {
    return (
      <AdUnitForm
        adUnit={selectedAdUnit || undefined}
        _campaignId={campaign.id}
        existingLines={campaign.adUnits?.length || 0}
        onSave={handleSaveFromForm}
        onCancel={handleCancelForm}
      />
    );
  }

  // Si no, mostramos la tabla de ad units
  return (
    <div className="bg-white shadow-sm border border-gray-100 rounded-b-xl overflow-hidden">
      <div className="flex justify-between items-center p-5 border-b border-gray-200 bg-orange-50">
        <h2 className="text-lg font-medium text-orange-600 flex items-center">
          <svg
            className="h-5 w-5 mr-2 text-orange-500"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          Ad Units
        </h2>
        <button
          onClick={handleNewAdUnit}
          className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-md shadow-sm text-sm font-medium transition-colors flex items-center gap-1"
        >
          <svg
            className="h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          New Ad Unit
        </button>
      </div>
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
                Publisher Final Rate
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Customer Final Negotiated Rate
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Customer Net Rate
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
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {campaign.adUnits &&
              campaign.adUnits.map((unit) => (
                <tr
                  key={unit.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleEditAdUnit(unit)}
                >
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {/* Line no es editable */}
                    {unit.line}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {/* Publisher no es editable */}
                    {unit.publisher}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {editingAdUnit === unit.id ? (
                      <select
                        className="w-full p-1 border rounded text-sm bg-white text-gray-900"
                        value={editedAdUnit?.market || ""}
                        onChange={(e) =>
                          handleAdUnitChange("market", e.target.value)
                        }
                        onClick={(e) => e.stopPropagation()}
                      >
                        {marketOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : (
                      unit.market
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {editingAdUnit === unit.id ? (
                      <select
                        className="w-full p-1 border rounded text-sm bg-white text-gray-900"
                        value={editedAdUnit?.channel || ""}
                        onChange={(e) =>
                          handleAdUnitChange("channel", e.target.value)
                        }
                        onClick={(e) => e.stopPropagation()}
                      >
                        {channelOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : (
                      truncateText(unit.channel, 20)
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {editingAdUnit === unit.id ? (
                      <select
                        className="w-full p-1 border rounded text-sm bg-white text-gray-900"
                        value={editedAdUnit?.format || ""}
                        onChange={(e) =>
                          handleAdUnitChange("format", e.target.value)
                        }
                        onClick={(e) => e.stopPropagation()}
                      >
                        {formatOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : (
                      unit.format
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {editingAdUnit === unit.id ? (
                      <select
                        className="w-full p-1 border rounded text-sm bg-white text-gray-900"
                        value={editedAdUnit?.size || ""}
                        onChange={(e) =>
                          handleAdUnitChange("size", e.target.value)
                        }
                        onClick={(e) => e.stopPropagation()}
                      >
                        {sizeOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : (
                      unit.size
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {editingAdUnit === unit.id ? (
                      <input
                        type="number"
                        className="w-full p-1 border rounded text-sm"
                        value={editedAdUnit?.units || 0}
                        onChange={(e) =>
                          handleAdUnitChange("units", parseInt(e.target.value))
                        }
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      formatNumber(unit.units)
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {editingAdUnit === unit.id ? (
                      <select
                        className="w-full p-1 border rounded text-sm bg-white text-gray-900"
                        value={editedAdUnit?.model || ""}
                        onChange={(e) =>
                          handleAdUnitChange("model", e.target.value)
                        }
                        onClick={(e) => e.stopPropagation()}
                      >
                        {modelOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : (
                      unit.model
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {/* Margin no es editable - calculado automáticamente */}
                    {editingAdUnit === unit.id ? (
                      <div className="w-full p-1 border border-gray-200 rounded text-sm bg-gray-50">
                        {editedAdUnit?.margin}
                      </div>
                    ) : (
                      unit.margin
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {/* Publisher Final Rate no es editable - calculado automáticamente */}
                    {editingAdUnit === unit.id ? (
                      <div className="w-full p-1 border border-gray-200 rounded text-sm bg-gray-50">
                        ${editedAdUnit?.unitCost?.toFixed(2)}
                      </div>
                    ) : (
                      `$${unit.unitCost.toFixed(2)}`
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {/* Customer Final Negotiated Rate no es editable - calculado automáticamente */}
                    {editingAdUnit === unit.id ? (
                      <div className="w-full p-1 border border-gray-200 rounded text-sm bg-gray-50">
                        $
                        {(editedAdUnit?.customerNetRate
                          ? editedAdUnit.customerNetRate * 0.85
                          : 0
                        ).toFixed(2)}
                      </div>
                    ) : (
                      `$${(unit.customerNetRate * 0.85).toFixed(2)}`
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {/* Customer Investment no es editable - calculado automáticamente */}
                    {editingAdUnit === unit.id ? (
                      <div className="w-full p-1 border border-gray-200 rounded text-sm bg-gray-50">
                        ${editedAdUnit?.customerNetRate?.toFixed(2)}
                      </div>
                    ) : (
                      `$${unit.customerNetRate.toFixed(2)}`
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {editingAdUnit === unit.id ? (
                      <input
                        type="number"
                        className="w-full p-1 border rounded text-sm"
                        value={editedAdUnit?.customerInvestment || 0}
                        onChange={(e) =>
                          handleAdUnitChange(
                            "customerInvestment",
                            parseFloat(e.target.value)
                          )
                        }
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      formatCurrency(unit.customerInvestment)
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    {editingAdUnit === unit.id ? (
                      <select
                        className="w-full p-1 border rounded text-sm bg-white text-gray-900"
                        value={editedAdUnit?.status || ""}
                        onChange={(e) =>
                          handleAdUnitChange("status", e.target.value)
                        }
                        onClick={(e) => e.stopPropagation()}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Live">Live</option>
                        <option value="Implementation">Implementation</option>
                        <option value="Closed">Closed</option>
                      </select>
                    ) : (
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          unit.status === "Approved"
                            ? "bg-green-100 text-green-800"
                            : unit.status === "Pending"
                            ? "bg-amber-100 text-amber-800"
                            : unit.status === "Live"
                            ? "bg-violet-100 text-violet-800"
                            : unit.status === "Implementation"
                            ? "bg-cyan-100 text-cyan-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {unit.status}
                      </span>
                    )}
                  </td>
                  <td
                    className="px-4 py-3 whitespace-nowrap text-sm text-gray-500"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {editingAdUnit === unit.id ? (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={handleSaveAdUnit}
                          className="text-green-600 hover:text-green-800 bg-green-50 p-1 rounded-full"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="text-red-600 hover:text-red-800 bg-red-50 p-1 rounded-full"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditAdUnit(unit);
                          }}
                          className="text-orange-600 hover:text-orange-800"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteAdUnit(unit.id);
                          }}
                          className="text-red-600 hover:text-red-800"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <AdUnitDeleteModal
        isOpen={showDeleteModal}
        onConfirm={confirmDeleteAdUnit}
        onCancel={cancelDeleteAdUnit}
      />
    </div>
  );
};

export default CampaignAdUnits;
