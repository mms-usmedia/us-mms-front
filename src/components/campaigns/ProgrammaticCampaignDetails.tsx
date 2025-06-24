import React, { useState } from "react";
import { Campaign } from "./types";
// Importaciones para gráficos
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
// Importaciones para iconos
import { FaEdit, FaSave, FaTimes, FaChartPie, FaFilePdf } from "react-icons/fa";

// Utilidades para formateo
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString("en-US", options);
};

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

interface ProgrammaticCampaignDetailsProps {
  campaign: Campaign;
  onSave: (campaign: Campaign) => void;
}

const ProgrammaticCampaignDetails: React.FC<
  ProgrammaticCampaignDetailsProps
> = ({ campaign, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedCampaign, setEditedCampaign] = useState<Campaign>({
    ...campaign,
  });
  const [activeTab, setActiveTab] = useState<"info" | "charts">("info");

  const handleChange = (
    field: keyof Campaign,
    value: string | number | boolean | undefined
  ) => {
    setEditedCampaign({
      ...editedCampaign,
      [field]: value,
    });
  };

  const handleSave = () => {
    onSave(editedCampaign);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedCampaign({ ...campaign });
    setIsEditing(false);
  };

  // Función para generar el CIO (Customer Insertion Order)
  const handleGenerateCIO = () => {
    // Esta función se conectaría con el backend para generar y descargar el PDF
    console.log("Generating CIO for campaign:", campaign.id);
    // Aquí iría la llamada al backend
  };

  // Función para redirigir a la página de creación de la PIO (Publisher Insertion Order)
  const handleGeneratePIO = () => {
    // Esta función redirigiría a una nueva vista para crear la PIO
    console.log("Redirecting to create PIO for campaign:", campaign.id);
    // Redirigir a la página de creación de PIO usando window.location
    window.location.href = `/campaigns/${campaign.id}/pio`;
  };

  // Datos para el gráfico circular de distribución de inversión
  const generatePieChartData = () => {
    const total = campaign.budget;
    const mediaSpend = total * 0.85; // Simulación: 85% en media
    const fees = total * 0.12; // Simulación: 12% en honorarios
    const other = total * 0.03; // Simulación: 3% en otros

    return [
      { name: "Media Spend", value: mediaSpend },
      { name: "Fees", value: fees },
      { name: "Other", value: other },
    ];
  };

  // Colores para el gráfico circular - paleta de colores pasteles
  const COLORS = ["#4BC0C0", "#9966FF", "#FF9F40"];

  return (
    <div className="bg-white shadow-sm border border-gray-100 rounded-b-xl p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-xl font-semibold text-orange-600">
            Campaign Details
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
              >
                <FaSave className="h-4 w-4" />
                Save Changes
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
              >
                <FaTimes className="h-4 w-4" />
                Cancel
              </button>
            </>
          ) : (
            <>
              {campaign.id !== "new" && (
                <>
                  <button
                    onClick={handleGeneratePIO}
                    className="px-4 py-2 bg-orange-400 hover:bg-orange-500 text-white rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 shadow-sm active:bg-orange-600"
                    style={{ transition: "background-color 0.3s ease" }}
                  >
                    <FaFilePdf className="h-4 w-4" />
                    Generate PIO
                  </button>
                  <button
                    onClick={handleGenerateCIO}
                    className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
                  >
                    <FaFilePdf className="h-4 w-4" />
                    Generate CIO
                  </button>
                </>
              )}
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-md text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
              >
                <FaEdit className="h-4 w-4" />
                Edit Details
              </button>
            </>
          )}
        </div>
      </div>

      {/* Tabs para información y gráficos */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab("info")}
            className={`py-3 px-1 focus:outline-none ${
              activeTab === "info"
                ? "border-b-2 border-orange-500 text-orange-600 font-medium"
                : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Campaign Information
          </button>
          <button
            onClick={() => setActiveTab("charts")}
            className={`py-3 px-1 flex items-center gap-2 focus:outline-none ${
              activeTab === "charts"
                ? "border-b-2 border-orange-500 text-orange-600 font-medium"
                : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <FaChartPie className="h-4 w-4" /> Performance Charts
          </button>
        </div>
      </div>

      {/* Contenido condicional según la pestaña activa */}
      {activeTab === "info" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Información de la Campaña */}
          <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-6">
            <h2 className="text-lg font-medium text-orange-600 mb-4 flex items-center">
              <svg
                className="h-5 w-5 mr-2 text-orange-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path
                  fillRule="evenodd"
                  d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-orange-600">Campaign Information</span>
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Organization Type
                </p>
                {isEditing ? (
                  <select
                    className="mt-1 text-sm w-full border-2 border-orange-100 focus:border-orange-300 rounded p-2 bg-white text-gray-900 transition-colors focus:ring-0"
                    value={editedCampaign.organizationType}
                    onChange={(e) =>
                      handleChange("organizationType", e.target.value)
                    }
                  >
                    <option value="Agency">Agency</option>
                    <option value="Advertiser">Advertiser</option>
                    <option value="Publisher">Publisher</option>
                    <option value="Holding Agency">Holding Agency</option>
                    <option value="Holding Advertiser">
                      Holding Advertiser
                    </option>
                    <option value="Direct">Direct</option>
                  </select>
                ) : (
                  <p className="mt-1 text-sm text-gray-900">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        campaign.organizationType === "Agency"
                          ? "bg-orange-100 text-orange-800"
                          : campaign.organizationType === "Advertiser"
                          ? "bg-orange-50 text-orange-700"
                          : campaign.organizationType === "Publisher"
                          ? "bg-orange-200 text-orange-900"
                          : campaign.organizationType === "Holding Agency"
                          ? "bg-orange-300 text-orange-900"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {campaign.organizationType}
                    </span>
                  </p>
                )}
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700">DSP Used</p>
                {isEditing ? (
                  <input
                    type="text"
                    className="mt-1 text-sm w-full border-2 border-orange-100 focus:border-orange-300 rounded p-2 bg-white text-gray-900 transition-colors focus:ring-0"
                    value={editedCampaign.dspUsed || ""}
                    onChange={(e) => handleChange("dspUsed", e.target.value)}
                    placeholder="Name of DSP"
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900 font-medium">
                    {campaign.dspUsed || "-"}
                  </p>
                )}
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700">
                  Brand Advertiser
                </p>
                {isEditing ? (
                  <input
                    type="text"
                    className="mt-1 text-sm w-full border-2 border-orange-100 focus:border-orange-300 rounded p-2 bg-white text-gray-900 transition-colors focus:ring-0"
                    value={editedCampaign.advertiser || ""}
                    onChange={(e) => handleChange("advertiser", e.target.value)}
                    placeholder="Name of advertiser"
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900 font-medium">
                    {campaign.advertiser || "-"}
                  </p>
                )}
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700">
                  Publisher (Who pays us)
                </p>
                {isEditing ? (
                  <input
                    type="text"
                    className="mt-1 text-sm w-full border-2 border-orange-100 focus:border-orange-300 rounded p-2 bg-white text-gray-900 transition-colors focus:ring-0"
                    value={editedCampaign.organizationPublisher || ""}
                    onChange={(e) =>
                      handleChange("organizationPublisher", e.target.value)
                    }
                    placeholder="Publisher name"
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900 font-medium">
                    {campaign.organizationPublisher || "-"}
                  </p>
                )}
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700">Start Date</p>
                {isEditing ? (
                  <input
                    type="date"
                    className="mt-1 text-sm w-full border-2 border-orange-100 focus:border-orange-300 rounded p-2 text-gray-900 bg-white transition-colors focus:ring-0"
                    value={editedCampaign.startDate}
                    onChange={(e) => handleChange("startDate", e.target.value)}
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900 bg-orange-50 border border-orange-100 rounded-md px-2 py-1 inline-block">
                    {formatDate(campaign.startDate)}
                  </p>
                )}
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700">End Date</p>
                {isEditing ? (
                  <input
                    type="date"
                    className="mt-1 text-sm w-full border-2 border-orange-100 focus:border-orange-300 rounded p-2 text-gray-900 bg-white transition-colors focus:ring-0"
                    value={editedCampaign.endDate}
                    onChange={(e) => handleChange("endDate", e.target.value)}
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900 bg-orange-50 border border-orange-100 rounded-md px-2 py-1 inline-block">
                    {formatDate(campaign.endDate)}
                  </p>
                )}
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700">
                  Customer Main Contact
                </p>
                {isEditing ? (
                  <input
                    type="text"
                    className="mt-1 text-sm w-full border-2 border-orange-100 focus:border-orange-300 rounded p-2 bg-white text-gray-900 transition-colors focus:ring-0"
                    value={editedCampaign.agencyContact || ""}
                    onChange={(e) =>
                      handleChange("agencyContact", e.target.value)
                    }
                    placeholder="Main contact"
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900 font-medium">
                    {campaign.agencyContact || "-"}
                  </p>
                )}
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700">
                  Customer Billing Contact
                </p>
                {isEditing ? (
                  <input
                    type="text"
                    className="mt-1 text-sm w-full border-2 border-orange-100 focus:border-orange-300 rounded p-2 bg-white text-gray-900 transition-colors focus:ring-0"
                    value={editedCampaign.billingContact || ""}
                    onChange={(e) =>
                      handleChange("billingContact", e.target.value)
                    }
                    placeholder="Billing contact"
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900 font-medium">
                    {campaign.billingContact || "-"}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Resumen financiero */}
          <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-orange-600 flex items-center">
                <svg
                  className="h-5 w-5 mr-2 text-orange-500"
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
                <span className="text-orange-600">Campaign Summary</span>
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-700">Investment</p>
                <p className="mt-1 text-base text-gray-900 font-semibold">
                  {formatCurrency(campaign.budget)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Total Units</p>
                <p className="mt-1 text-base text-gray-900 font-semibold">
                  {formatNumber(campaign.units)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">
                  % Gross Margin
                </p>
                <p className="mt-1 text-base text-gray-900">
                  <span className="font-semibold">{campaign.grossMargin}%</span>
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">
                  $ Gross Margin
                </p>
                <p className="mt-1 text-base text-gray-900 font-semibold">
                  {formatCurrency(
                    (campaign.budget * campaign.grossMargin) / 100
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Payment Terms
                </p>
                <p className="mt-1 text-base text-gray-900 font-semibold">
                  30 days
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Campaign Duration
                </p>
                <p className="mt-1 text-base text-gray-900 font-semibold">
                  {Math.round(
                    (new Date(campaign.endDate).getTime() -
                      new Date(campaign.startDate).getTime()) /
                      (1000 * 60 * 60 * 24)
                  )}{" "}
                  days
                </p>
              </div>
            </div>
          </div>

          {/* US Media Information */}
          <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-6">
            <h2 className="text-lg font-medium text-orange-600 mb-4 flex items-center">
              <svg
                className="h-5 w-5 mr-2 text-orange-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
              <span className="text-orange-600">US Media Information</span>
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-700">Salesperson</p>
                {isEditing ? (
                  <input
                    type="text"
                    className="mt-1 text-sm w-full border-2 border-orange-100 focus:border-orange-300 rounded p-2 bg-white text-gray-900 transition-colors focus:ring-0"
                    value={editedCampaign.salesperson || ""}
                    onChange={(e) =>
                      handleChange("salesperson", e.target.value)
                    }
                    placeholder="Salesperson name"
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900 font-medium bg-orange-50 px-2 py-1 rounded-md inline-block border border-orange-100">
                    {campaign.salesperson || "-"}
                  </p>
                )}
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700">
                  Account Manager
                </p>
                {isEditing ? (
                  <input
                    type="text"
                    className="mt-1 text-sm w-full border-2 border-orange-100 focus:border-orange-300 rounded p-2 bg-white text-gray-900 transition-colors focus:ring-0"
                    value={editedCampaign.accountManager || ""}
                    onChange={(e) =>
                      handleChange("accountManager", e.target.value)
                    }
                    placeholder="Account manager name"
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900 font-medium bg-orange-50 px-2 py-1 rounded-md inline-block border border-orange-100">
                    {campaign.accountManager || "-"}
                  </p>
                )}
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700">
                  AdOps Leader
                </p>
                {isEditing ? (
                  <input
                    type="text"
                    className="mt-1 text-sm w-full border-2 border-orange-100 focus:border-orange-300 rounded p-2 bg-white text-gray-900 transition-colors focus:ring-0"
                    value={editedCampaign.adOpsLeader || ""}
                    onChange={(e) =>
                      handleChange("adOpsLeader", e.target.value)
                    }
                    placeholder="AdOps Leader name"
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900 font-medium bg-orange-50 px-2 py-1 rounded-md inline-block border border-orange-100">
                    {campaign.adOpsLeader || "-"}
                  </p>
                )}
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700">CIO Owner</p>
                {isEditing ? (
                  <select
                    className="mt-1 text-sm w-full border-2 border-orange-100 focus:border-orange-300 rounded p-2 bg-white text-gray-900 transition-colors focus:ring-0"
                    value={editedCampaign.cioOwner || "Customer"}
                    onChange={(e) => handleChange("cioOwner", e.target.value)}
                  >
                    <option value="Customer">Customer</option>
                    <option value="USMC">USMC</option>
                  </select>
                ) : (
                  <p className="mt-1 text-sm text-gray-900">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        campaign.cioOwner === "Customer"
                          ? "bg-orange-100 text-orange-800"
                          : campaign.cioOwner === "USMC"
                          ? "bg-orange-200 text-orange-900"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {campaign.cioOwner || "Customer"}
                    </span>
                  </p>
                )}
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700">
                  US Media Billing Party
                </p>
                {isEditing ? (
                  <input
                    type="text"
                    className="mt-1 text-sm w-full border-2 border-orange-100 focus:border-orange-300 rounded p-2 bg-white text-gray-900 transition-colors focus:ring-0"
                    value={editedCampaign.billingParty || ""}
                    onChange={(e) =>
                      handleChange("billingParty", e.target.value)
                    }
                    placeholder="Billing party"
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900 font-medium bg-orange-50 px-2 py-1 rounded-md inline-block border border-orange-100">
                    {campaign.billingParty || "-"}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-6">
            <h2 className="text-lg font-medium text-orange-600 mb-4 flex items-center">
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
              <span className="text-orange-600">Notes</span>
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700 flex items-center">
                  <svg
                    className="h-4 w-4 mr-1 text-orange-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Internal Notes
                </p>
                {isEditing ? (
                  <textarea
                    className="mt-1 text-sm w-full p-3 border-2 border-gray-200 focus:border-gray-400 rounded bg-white min-h-[100px] text-gray-900 focus:ring-0 transition-colors"
                    value={editedCampaign.internalNotes || ""}
                    onChange={(e) =>
                      handleChange("internalNotes", e.target.value)
                    }
                    placeholder="Add internal notes..."
                  />
                ) : (
                  <div className="mt-1 text-sm text-gray-900 p-3 border border-orange-100 rounded bg-orange-50 min-h-[100px] shadow-inner">
                    {campaign.internalNotes || "No internal notes"}
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 flex items-center">
                  <svg
                    className="h-4 w-4 mr-1 text-orange-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.276A1 1 0 0018 15V3z" />
                  </svg>
                  Customer Notes
                </p>
                {isEditing ? (
                  <textarea
                    className="mt-1 text-sm w-full p-3 border-2 border-gray-200 focus:border-gray-400 rounded bg-white min-h-[100px] text-gray-900 focus:ring-0 transition-colors"
                    value={editedCampaign.notes || ""}
                    onChange={(e) => handleChange("notes", e.target.value)}
                    placeholder="Add customer notes..."
                  />
                ) : (
                  <div className="mt-1 text-sm text-gray-900 p-3 border border-orange-100 rounded bg-orange-50 min-h-[100px] shadow-inner">
                    {campaign.notes || "No customer notes"}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Pestaña de gráficos
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Gráfico circular de distribución de inversión */}
          <div className="bg-white shadow-sm border border-gray-100 rounded-xl p-6">
            <h2 className="text-lg font-medium text-orange-600 mb-5 flex items-center">
              <FaChartPie className="h-5 w-5 mr-2 text-orange-500" />
              <span className="text-orange-600">Investment Distribution</span>
            </h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={generatePieChartData()}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={40}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                  >
                    {generatePieChartData().map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => formatCurrency(Number(value))}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {generatePieChartData().map((entry, index) => (
                <div key={`legend-${index}`} className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <span className="text-xs text-gray-700">{entry.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tarjetas KPI */}
          <div className="bg-white shadow-sm border border-gray-100 rounded-xl p-6">
            <h2 className="text-lg font-medium text-orange-600 mb-5 flex items-center">
              <svg
                className="h-5 w-5 mr-2 text-orange-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
              </svg>
              <span className="text-orange-600">Campaign Info</span>
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-orange-50 rounded-lg p-4 border border-orange-100">
                <p className="text-xs font-medium text-gray-700 uppercase">
                  Total Investment
                </p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {formatCurrency(campaign.budget)}
                </p>
                <div className="flex items-center mt-2">
                  <span className="text-green-500 text-xs font-medium">
                    ↑ 12%{" "}
                  </span>
                  <span className="text-xs text-gray-500 ml-1">vs. target</span>
                </div>
              </div>

              <div className="bg-orange-50 rounded-lg p-4 border border-orange-100">
                <p className="text-xs font-medium text-gray-700 uppercase">
                  Total Units
                </p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {formatNumber(campaign.units)}
                </p>
                <div className="flex items-center mt-2">
                  <span className="text-green-500 text-xs font-medium">
                    ↑ 8%{" "}
                  </span>
                  <span className="text-xs text-gray-500 ml-1">vs. target</span>
                </div>
              </div>

              <div className="bg-orange-50 rounded-lg p-4 border border-orange-100">
                <p className="text-xs font-medium text-gray-700 uppercase">
                  CPM
                </p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  ${((campaign.budget / campaign.units) * 1000).toFixed(2)}
                </p>
                <div className="flex items-center mt-2">
                  <span className="text-red-500 text-xs font-medium">
                    ↓ 5%{" "}
                  </span>
                  <span className="text-xs text-gray-500 ml-1">vs. target</span>
                </div>
              </div>

              <div className="bg-orange-50 rounded-lg p-4 border border-orange-100">
                <p className="text-xs font-medium text-gray-700 uppercase">
                  Gross Margin
                </p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {campaign.grossMargin}%
                </p>
                <div className="flex items-center mt-2">
                  <span className="text-green-500 text-xs font-medium">
                    ↑ 2%{" "}
                  </span>
                  <span className="text-xs text-gray-500 ml-1">vs. target</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgrammaticCampaignDetails;
