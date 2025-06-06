// /src/components/campaigns/CampaignDetails.tsx

import React, { useState, useEffect } from "react";
import StatusBadge from "@/components/ui/StatusBadge";
import { Campaign } from "./types";
import { formatCurrency, formatDate, formatNumber } from "./utils";
// Importar marketOptions desde types
import { marketOptions } from "./types";
// Importaciones para gráficos
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
// Importaciones para iconos
import {
  FaEdit,
  FaSave,
  FaTimes,
  FaChartPie,
  FaFilePdf,
  FaSearch,
} from "react-icons/fa";

interface CampaignDetailsProps {
  campaign: Campaign;
  onSave?: (updatedCampaign: Campaign) => void;
  editMode?: boolean; // Prop para controlar si comienza en modo edición
}

const CampaignDetails: React.FC<CampaignDetailsProps> = ({
  campaign,
  onSave = () => {}, // Valor predeterminado para evitar errores
  editMode = false, // Por defecto no está en modo edición
}) => {
  const [isEditing, setIsEditing] = useState(editMode); // Inicializar según prop
  const [editedCampaign, setEditedCampaign] = useState<Campaign>(campaign);
  const [activeTab, setActiveTab] = useState<"info" | "charts">("info");

  // Estados para los dropdowns de búsqueda
  const [customerSearch, setCustomerSearch] = useState("");
  const [industrySearch, setIndustrySearch] = useState("");
  const [billingPartySearch, setBillingPartySearch] = useState("");

  // Datos para los dropdowns
  const customers = [
    "Apple",
    "Microsoft",
    "Google",
    "Amazon",
    "Samsung",
    "Ford",
    "Toyota",
    "IBM",
    "Coca-Cola",
    "Nike",
  ];
  const industries = [
    "Technology",
    "Automotive",
    "Entertainment",
    "Food & Beverage",
    "Retail",
    "Healthcare",
    "Financial Services",
    "Travel",
    "Telecommunications",
    "Education",
  ];
  const billingParties = [
    "Media Agency",
    "Creative Agency",
    "Direct Customer",
    "PR Agency",
    "Digital Agency",
    "Full Service Agency",
  ];
  const billingOffices = [
    "Miami",
    "New York",
    "Chicago",
    "Los Angeles",
    "Dallas",
    "San Francisco",
    "Atlanta",
    "Boston",
    "Seattle",
    "Houston",
  ];

  // Listas filtradas basadas en búsqueda
  const filteredCustomers = customers.filter((customer) =>
    customer.toLowerCase().includes(customerSearch.toLowerCase())
  );
  const filteredIndustries = industries.filter((industry) =>
    industry.toLowerCase().includes(industrySearch.toLowerCase())
  );
  const filteredBillingParties = billingParties.filter((party) =>
    party.toLowerCase().includes(billingPartySearch.toLowerCase())
  );

  // Actualizar isEditing cuando cambia editMode
  useEffect(() => {
    setIsEditing(editMode);
  }, [editMode]);

  // Actualizar el estado local cuando cambia la campaña
  useEffect(() => {
    setEditedCampaign(campaign);
  }, [campaign]);

  // Función para manejar cambios en los campos editables
  const handleChange = (
    field: keyof Campaign,
    value: string | number | boolean
  ) => {
    setEditedCampaign((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Función para guardar los cambios
  const handleSave = () => {
    onSave(editedCampaign);
    // Solo cambiar el modo de edición si no estamos forzando el modo edición con editMode
    if (!editMode) {
      setIsEditing(false);
    }
  };

  // Función para cancelar la edición
  const handleCancel = () => {
    setEditedCampaign(campaign);
    // Solo cambiar el modo de edición si no estamos forzando el modo edición con editMode
    if (!editMode) {
      setIsEditing(false);
    }
  };

  // Función para generar el CIO (Customer Insertion Order)
  const handleGenerateCIO = () => {
    // Esta función se conectaría con el backend para generar y descargar el PDF
    console.log("Generando CIO para la campaña:", campaign.id);
    // Aquí iría la llamada al backend
  };

  // Función para redirigir a la página de creación de la PIO (Publisher Insertion Order)
  const handleGeneratePIO = () => {
    // Esta función redirigiría a una nueva vista para crear la PIO
    console.log("Redirigiendo a crear PIO para la campaña:", campaign.id);
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

  // Colores para el gráfico circular
  const COLORS = ["#6366F1", "#10B981", "#F59E0B"];

  return (
    <div className="bg-white shadow-sm border border-gray-100 rounded-b-xl p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
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
              {!editMode && (
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
                >
                  <FaTimes className="h-4 w-4" />
                  Cancel
                </button>
              )}
            </>
          ) : (
            <>
              {campaign.id !== "new" && (
                <>
                  <button
                    onClick={handleGeneratePIO}
                    className="px-4 py-2 bg-blue-500 hover:!bg-blue-900 text-white rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 shadow-sm active:bg-blue-900"
                    style={{ transition: "background-color 0.3s ease" }}
                  >
                    <FaFilePdf className="h-4 w-4" />
                    Generate PIO
                  </button>
                  <button
                    onClick={handleGenerateCIO}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-md text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
                  >
                    <FaFilePdf className="h-4 w-4" />
                    Generate CIO
                  </button>
                </>
              )}
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
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
                ? "border-b-2 border-indigo-500 text-indigo-600 font-medium"
                : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Campaign Information
          </button>
          <button
            onClick={() => setActiveTab("charts")}
            className={`py-3 px-1 flex items-center gap-2 focus:outline-none ${
              activeTab === "charts"
                ? "border-b-2 border-indigo-500 text-indigo-600 font-medium"
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
          <div className="bg-gradient-to-br from-white to-indigo-50 shadow-sm border border-indigo-100 rounded-xl p-6">
            <h2 className="text-lg font-medium text-indigo-900 mb-4 flex items-center">
              <svg
                className="h-5 w-5 mr-2 text-indigo-500"
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
              Campaign Information
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-indigo-600">
                  Organization Type
                </p>
                {isEditing ? (
                  <div className="relative">
                    <select
                      className="mt-1 text-sm w-full border-2 border-indigo-100 focus:border-indigo-300 rounded p-2 bg-white text-gray-900 pr-8 appearance-none cursor-pointer transition-colors focus:ring-0"
                      value={editedCampaign.organizationType}
                      onChange={(e) =>
                        handleChange("organizationType", e.target.value)
                      }
                    >
                      <option value="Agency">Agency</option>
                      <option value="Advertiser">Advertiser</option>
                      <option value="Publisher">Publisher</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none mt-1">
                      <svg
                        className="h-5 w-5 text-indigo-500"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                ) : (
                  <p className="mt-1 text-sm text-gray-900">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        campaign.organizationType === "Agency"
                          ? "bg-amber-100 text-amber-800"
                          : campaign.organizationType === "Advertiser"
                          ? "bg-green-100 text-green-800"
                          : campaign.organizationType === "Publisher"
                          ? "bg-blue-100 text-blue-800"
                          : campaign.organizationType === "Holding Agency"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {campaign.organizationType}
                    </span>
                  </p>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-indigo-600">Customer</p>
                {isEditing ? (
                  <div className="relative mt-1">
                    <div className="flex items-center border-2 border-indigo-100 focus-within:border-indigo-300 rounded bg-white">
                      <input
                        type="text"
                        className="text-sm w-full p-2 bg-white rounded text-gray-900 focus:ring-0 border-0 focus:outline-none"
                        value={customerSearch}
                        onChange={(e) => setCustomerSearch(e.target.value)}
                        placeholder="Search customer"
                      />
                      <FaSearch className="mr-2 text-gray-400" />
                    </div>
                    {customerSearch && (
                      <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                        {filteredCustomers.map((customer) => (
                          <div
                            key={customer}
                            className="px-4 py-2 hover:bg-indigo-50 cursor-pointer text-sm"
                            onClick={() => {
                              handleChange("customer", customer);
                              setCustomerSearch("");
                            }}
                          >
                            {customer}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="mt-1 text-sm text-gray-900 font-medium">
                    {campaign.customer || "-"}
                  </p>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-indigo-600">
                  Brand Advertiser
                </p>
                {isEditing ? (
                  <input
                    type="text"
                    className="mt-1 text-sm w-full border-2 border-indigo-100 focus:border-indigo-300 rounded p-2 bg-white text-gray-900 transition-colors focus:ring-0"
                    value={editedCampaign.advertiser || ""}
                    onChange={(e) => handleChange("advertiser", e.target.value)}
                    placeholder="Name of the advertiser"
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900 font-medium">
                    {campaign.advertiser || "-"}
                  </p>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-indigo-600">Industry</p>
                {isEditing ? (
                  <div className="relative mt-1">
                    <div className="flex items-center border-2 border-indigo-100 focus-within:border-indigo-300 rounded bg-white">
                      <input
                        type="text"
                        className="text-sm w-full p-2 bg-white rounded text-gray-900 focus:ring-0 border-0 focus:outline-none"
                        value={industrySearch}
                        onChange={(e) => setIndustrySearch(e.target.value)}
                        placeholder="Search industry"
                      />
                      <FaSearch className="mr-2 text-gray-400" />
                    </div>
                    {industrySearch && (
                      <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                        {filteredIndustries.map((industry) => (
                          <div
                            key={industry}
                            className="px-4 py-2 hover:bg-indigo-50 cursor-pointer text-sm"
                            onClick={() => {
                              handleChange("industry", industry);
                              setIndustrySearch("");
                            }}
                          >
                            {industry}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="mt-1 text-sm text-gray-900">
                    {campaign.industry}
                  </p>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-indigo-600">
                  Start Date
                </p>
                {isEditing ? (
                  <input
                    type="date"
                    className="mt-1 text-sm w-full border-2 border-indigo-100 focus:border-indigo-300 rounded p-2 text-gray-900 bg-white transition-colors focus:ring-0"
                    value={editedCampaign.startDate}
                    onChange={(e) => handleChange("startDate", e.target.value)}
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900 bg-blue-50 border border-blue-100 rounded-md px-2 py-1 inline-block">
                    {formatDate(campaign.startDate)}
                  </p>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-indigo-600">End Date</p>
                {isEditing ? (
                  <input
                    type="date"
                    className="mt-1 text-sm w-full border-2 border-indigo-100 focus:border-indigo-300 rounded p-2 text-gray-900 bg-white transition-colors focus:ring-0"
                    value={editedCampaign.endDate}
                    onChange={(e) => handleChange("endDate", e.target.value)}
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900 bg-blue-50 border border-blue-100 rounded-md px-2 py-1 inline-block">
                    {formatDate(campaign.endDate)}
                  </p>
                )}
              </div>
              {campaign.organizationType === "Publisher" && (
                <div>
                  <p className="text-sm font-medium text-indigo-600">
                    Organization Publisher
                  </p>
                  {isEditing ? (
                    <input
                      type="text"
                      className="mt-1 text-sm w-full border-2 border-indigo-100 focus:border-indigo-300 rounded p-2 bg-white text-gray-900 transition-colors focus:ring-0"
                      value={editedCampaign.organizationPublisher || ""}
                      onChange={(e) =>
                        handleChange("organizationPublisher", e.target.value)
                      }
                      placeholder="Organization Publisher"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900 font-medium">
                      {campaign.organizationPublisher || "-"}
                    </p>
                  )}
                </div>
              )}
              {campaign.organizationType !== "Publisher" && (
                <div>
                  <p className="text-sm font-medium text-indigo-600">Market</p>
                  {isEditing ? (
                    <div className="relative mt-1">
                      <select
                        className="text-sm w-full border-2 border-indigo-100 focus:border-indigo-300 rounded p-2 bg-white text-gray-900 pr-8 appearance-none cursor-pointer transition-colors focus:ring-0"
                        value={editedCampaign.targetMarket || ""}
                        onChange={(e) =>
                          handleChange("targetMarket", e.target.value)
                        }
                      >
                        <option value="">Seleccionar mercado...</option>
                        {marketOptions.map((market) => (
                          <option key={market} value={market}>
                            {market}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <svg
                          className="h-5 w-5 text-indigo-500"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">
                      {campaign.targetMarket || "-"}
                    </p>
                  )}
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-indigo-600">
                  US Media Billing Party
                </p>
                {isEditing ? (
                  <div className="relative mt-1">
                    <div className="flex items-center border-2 border-indigo-100 focus-within:border-indigo-300 rounded bg-white">
                      <input
                        type="text"
                        className="text-sm w-full p-2 bg-white rounded text-gray-900 focus:ring-0 border-0 focus:outline-none"
                        value={billingPartySearch}
                        onChange={(e) => setBillingPartySearch(e.target.value)}
                        placeholder="Search billing party"
                      />
                      <FaSearch className="mr-2 text-gray-400" />
                    </div>
                    {billingPartySearch && (
                      <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                        {filteredBillingParties.map((party) => (
                          <div
                            key={party}
                            className="px-4 py-2 hover:bg-indigo-50 cursor-pointer text-sm"
                            onClick={() => {
                              handleChange("billingParty", party);
                              setBillingPartySearch("");
                            }}
                          >
                            {party}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="mt-1 text-sm text-gray-900">
                    {campaign.billingParty}
                  </p>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-indigo-600">
                  Customer Billing Party
                </p>
                {isEditing ? (
                  <input
                    type="text"
                    className="mt-1 text-sm w-full border-2 border-indigo-100 focus:border-indigo-300 rounded p-2 bg-white text-gray-900 transition-colors focus:ring-0"
                    value={editedCampaign.customerBillingParty || ""}
                    onChange={(e) =>
                      handleChange("customerBillingParty", e.target.value)
                    }
                    placeholder="Customer Billing Party"
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900 font-medium">
                    {campaign.customerBillingParty || "-"}
                  </p>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-indigo-600">
                  Agency Contact
                </p>
                {isEditing ? (
                  <input
                    type="text"
                    className="mt-1 text-sm w-full border-2 border-indigo-100 focus:border-indigo-300 rounded p-2 bg-white text-gray-900 transition-colors focus:ring-0"
                    value={editedCampaign.agencyContact || ""}
                    onChange={(e) =>
                      handleChange("agencyContact", e.target.value)
                    }
                    placeholder="Agency Contact"
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900 font-medium">
                    {campaign.agencyContact || "-"}
                  </p>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-indigo-600">
                  Billing Contact
                </p>
                {isEditing ? (
                  <input
                    type="text"
                    className="mt-1 text-sm w-full border-2 border-indigo-100 focus:border-indigo-300 rounded p-2 bg-white text-gray-900 transition-colors focus:ring-0"
                    value={editedCampaign.billingContact || ""}
                    onChange={(e) =>
                      handleChange("billingContact", e.target.value)
                    }
                    placeholder="Billing Contact"
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900 font-medium">
                    {campaign.billingContact || "-"}
                  </p>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-indigo-600">CIO Owner</p>
                {isEditing ? (
                  <div className="relative">
                    <select
                      className="mt-1 text-sm w-full border-2 border-indigo-100 focus:border-indigo-300 rounded p-2 bg-white text-gray-900 pr-8 appearance-none cursor-pointer transition-colors focus:ring-0"
                      value={editedCampaign.cioOwner || ""}
                      onChange={(e) => handleChange("cioOwner", e.target.value)}
                    >
                      <option value="">Seleccionar propietario...</option>
                      <option value="Customer">Customer</option>
                      <option value="USMC">USMC</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none mt-1">
                      <svg
                        className="h-5 w-5 text-indigo-500"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                ) : (
                  <p className="mt-1 text-sm text-gray-900">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        campaign.cioOwner === "Customer"
                          ? "bg-purple-100 text-purple-800"
                          : campaign.cioOwner === "USMC"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {campaign.cioOwner || "-"}
                    </span>
                  </p>
                )}
              </div>

              {/* Campos específicos para campañas programáticas */}
              {campaign.organizationType === "Publisher" && (
                <>
                  <div>
                    <p className="text-sm font-medium text-indigo-600">
                      Commission Rate (%)
                    </p>
                    {isEditing ? (
                      <input
                        type="number"
                        className="mt-1 text-sm w-full border-2 border-indigo-100 focus:border-indigo-300 rounded p-2 bg-white text-gray-900 transition-colors focus:ring-0"
                        value={editedCampaign.commissionRate || 15}
                        onChange={(e) =>
                          handleChange("commissionRate", Number(e.target.value))
                        }
                        min="0"
                        max="100"
                        step="0.5"
                      />
                    ) : (
                      <p className="mt-1 text-sm text-gray-900 font-medium">
                        {campaign.commissionRate || 15}%
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-indigo-600">
                      DSP Used
                    </p>
                    {isEditing ? (
                      <div className="relative mt-1">
                        <select
                          className="text-sm w-full border-2 border-indigo-100 focus:border-indigo-300 rounded p-2 bg-white text-gray-900 pr-8 appearance-none cursor-pointer transition-colors focus:ring-0"
                          value={editedCampaign.dspUsed || ""}
                          onChange={(e) =>
                            handleChange("dspUsed", e.target.value)
                          }
                        >
                          <option value="">Seleccionar DSP...</option>
                          <option value="DV360">DV360</option>
                          <option value="The Trade Desk">The Trade Desk</option>
                          <option value="MediaMath">MediaMath</option>
                          <option value="Amazon DSP">Amazon DSP</option>
                          <option value="Xandr">Xandr</option>
                          <option value="Verizon Media">Verizon Media</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                          <svg
                            className="h-5 w-5 text-indigo-500"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                    ) : (
                      <p className="mt-1 text-sm text-gray-900">
                        {campaign.dspUsed || "-"}
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-indigo-600">
                      Programmatic Type
                    </p>
                    {isEditing ? (
                      <div className="relative mt-1">
                        <select
                          className="text-sm w-full border-2 border-indigo-100 focus:border-indigo-300 rounded p-2 bg-white text-gray-900 pr-8 appearance-none cursor-pointer transition-colors focus:ring-0"
                          value={editedCampaign.programmaticType || "Standard"}
                          onChange={(e) =>
                            handleChange("programmaticType", e.target.value)
                          }
                        >
                          <option value="Standard">Standard</option>
                          <option value="PMP">PMP (Private Marketplace)</option>
                          <option value="PG">
                            PG (Programmatic Guaranteed)
                          </option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                          <svg
                            className="h-5 w-5 text-indigo-500"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                    ) : (
                      <p className="mt-1 text-sm text-gray-900">
                        {campaign.programmaticType || "Standard"}
                      </p>
                    )}
                  </div>
                </>
              )}

              {/* Campos específicos para campañas IO-based (cuando no es Publisher) */}
              {campaign.organizationType !== "Publisher" && (
                <>
                  <div>
                    <p className="text-sm font-medium text-indigo-600">
                      Market
                    </p>
                    {isEditing ? (
                      <div className="relative mt-1">
                        <select
                          className="text-sm w-full border-2 border-indigo-100 focus:border-indigo-300 rounded p-2 bg-white text-gray-900 pr-8 appearance-none cursor-pointer transition-colors focus:ring-0"
                          value={editedCampaign.targetMarket || ""}
                          onChange={(e) =>
                            handleChange("targetMarket", e.target.value)
                          }
                        >
                          <option value="">Seleccionar mercado...</option>
                          {marketOptions.map((market) => (
                            <option key={market} value={market}>
                              {market}
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                          <svg
                            className="h-5 w-5 text-indigo-500"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                    ) : (
                      <p className="mt-1 text-sm text-gray-900">
                        {campaign.targetMarket || "-"}
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Resumen Financiero */}
          <div className="bg-gradient-to-br from-white to-emerald-50 shadow-sm border border-emerald-100 rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-emerald-900 flex items-center">
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
                Campaign Summary
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-emerald-600">
                  Investment
                </p>
                <p className="mt-1 text-base text-gray-900 font-semibold">
                  {formatCurrency(campaign.budget)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-emerald-600">
                  Total Units
                </p>
                <p className="mt-1 text-base text-gray-900 font-semibold">
                  {formatNumber(campaign.units)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-emerald-600">
                  % Gross Margin
                </p>
                <p className="mt-1 text-base text-gray-900">
                  <span className="font-semibold">{campaign.grossMargin}%</span>
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-emerald-600">
                  $ Gross Margin
                </p>
                <p className="mt-1 text-base text-gray-900 font-semibold">
                  {formatCurrency(
                    (campaign.budget * campaign.grossMargin) / 100
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-emerald-600">
                  Payment Terms
                </p>
                <p className="mt-1 text-base text-gray-900 font-semibold">
                  30 days
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-emerald-600">
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

          {/* Contactos */}
          <div className="bg-gradient-to-br from-white to-violet-50 shadow-sm border border-violet-100 rounded-xl p-6">
            <h2 className="text-lg font-medium text-violet-900 mb-4 flex items-center">
              <svg
                className="h-5 w-5 mr-2 text-violet-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
              US Media Contacts
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-violet-600">
                  Salesperson
                </p>
                {isEditing ? (
                  <div className="relative">
                    <select
                      className="mt-1 text-sm w-full border-2 border-violet-100 focus:border-violet-300 rounded p-2 bg-white text-gray-900 pr-8 appearance-none cursor-pointer transition-colors focus:ring-0"
                      value={editedCampaign.salesperson || ""}
                      onChange={(e) =>
                        handleChange("salesperson", e.target.value)
                      }
                    >
                      <option value="">Seleccionar...</option>
                      <option value="Luciana Egurrola">Luciana Egurrola</option>
                      <option value="Ana Sobreyra">Ana Sobreyra</option>
                      <option value="Octavio Martínez">Octavio Martínez</option>
                      <option value="Gabriel Hernandez">
                        Gabriel Hernandez
                      </option>
                      <option value="Natalia Vazquez">Natalia Vazquez</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none mt-1">
                      <svg
                        className="h-5 w-5 text-violet-500"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                ) : (
                  <p className="mt-1 text-sm text-gray-900 font-medium bg-violet-50 px-2 py-1 rounded-md inline-block border border-violet-100">
                    {campaign.salesperson || "-"}
                  </p>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-violet-600">
                  Trafficker
                </p>
                {isEditing ? (
                  <div className="relative">
                    <select
                      className="mt-1 text-sm w-full border-2 border-violet-100 focus:border-violet-300 rounded p-2 bg-white text-gray-900 pr-8 appearance-none cursor-pointer transition-colors focus:ring-0"
                      value={editedCampaign.trafficker || ""}
                      onChange={(e) =>
                        handleChange("trafficker", e.target.value)
                      }
                    >
                      <option value="">Seleccionar...</option>
                      <option value="Octavio Martínez">Octavio Martínez</option>
                      <option value="Ana Sobreyra">Ana Sobreyra</option>
                      <option value="Luciana Egurrola">Luciana Egurrola</option>
                      <option value="Carlos Rodriguez">Carlos Rodriguez</option>
                      <option value="Maria Fernandez">Maria Fernandez</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none mt-1">
                      <svg
                        className="h-5 w-5 text-violet-500"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                ) : (
                  <p className="mt-1 text-sm text-gray-900 font-medium bg-violet-50 px-2 py-1 rounded-md inline-block border border-violet-100">
                    {campaign.trafficker || "-"}
                  </p>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-violet-600">
                  Account Manager
                </p>
                {isEditing ? (
                  <div className="relative">
                    <select
                      className="mt-1 text-sm w-full border-2 border-violet-100 focus:border-violet-300 rounded p-2 bg-white text-gray-900 pr-8 appearance-none cursor-pointer transition-colors focus:ring-0"
                      value={editedCampaign.accountManager || ""}
                      onChange={(e) =>
                        handleChange("accountManager", e.target.value)
                      }
                    >
                      <option value="">Seleccionar...</option>
                      <option value="Octavio Martinez">Octavio Martinez</option>
                      <option value="Ana Sobreyra">Ana Sobreyra</option>
                      <option value="Luciana Egurrola">Luciana Egurrola</option>
                      <option value="Juan Pérez">Juan Pérez</option>
                      <option value="Daniela Gómez">Daniela Gómez</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none mt-1">
                      <svg
                        className="h-5 w-5 text-violet-500"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                ) : (
                  <p className="mt-1 text-sm text-gray-900 font-medium bg-violet-50 px-2 py-1 rounded-md inline-block border border-violet-100">
                    {campaign.accountManager || "-"}
                  </p>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-violet-600">
                  AdOps Leader
                </p>
                {isEditing ? (
                  <div className="relative">
                    <select
                      className="mt-1 text-sm w-full border-2 border-violet-100 focus:border-violet-300 rounded p-2 bg-white text-gray-900 pr-8 appearance-none cursor-pointer transition-colors focus:ring-0"
                      value={editedCampaign.adOpsLeader || ""}
                      onChange={(e) =>
                        handleChange("adOpsLeader", e.target.value)
                      }
                    >
                      <option value="">Seleccionar...</option>
                      <option value="Ana Sobreyra">Ana Sobreyra</option>
                      <option value="Octavio Martinez">Octavio Martinez</option>
                      <option value="Luciana Egurrola">Luciana Egurrola</option>
                      <option value="Ricardo Torres">Ricardo Torres</option>
                      <option value="Sofia Vega">Sofia Vega</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none mt-1">
                      <svg
                        className="h-5 w-5 text-violet-500"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                ) : (
                  <p className="mt-1 text-sm text-gray-900 font-medium bg-violet-50 px-2 py-1 rounded-md inline-block border border-violet-100">
                    {campaign.adOpsLeader || "-"}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Notas */}
          <div className="bg-gradient-to-br from-white to-amber-50 shadow-sm border border-amber-100 rounded-xl p-6">
            <h2 className="text-lg font-medium text-amber-900 mb-4 flex items-center">
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
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-amber-600 flex items-center">
                  <svg
                    className="h-4 w-4 mr-1 text-amber-500"
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
                    className="mt-1 text-sm w-full p-3 border-2 border-amber-100 focus:border-amber-300 rounded bg-white min-h-[100px] text-gray-900 focus:ring-0 transition-colors"
                    value={editedCampaign.internalNotes || ""}
                    onChange={(e) =>
                      handleChange("internalNotes", e.target.value)
                    }
                    placeholder="Add internal notes..."
                  />
                ) : (
                  <div className="mt-1 text-sm text-gray-900 p-3 border border-amber-100 rounded bg-white min-h-[100px] shadow-inner">
                    {campaign.internalNotes || "No internal notes"}
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-amber-600 flex items-center">
                  <svg
                    className="h-4 w-4 mr-1 text-amber-500"
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
                    className="mt-1 text-sm w-full p-3 border-2 border-amber-100 focus:border-amber-300 rounded bg-white min-h-[100px] text-gray-900 focus:ring-0 transition-colors"
                    value={editedCampaign.notes || ""}
                    onChange={(e) => handleChange("notes", e.target.value)}
                    placeholder="Add customer notes..."
                  />
                ) : (
                  <div className="mt-1 text-sm text-gray-900 p-3 border border-amber-100 rounded bg-white min-h-[100px] shadow-inner">
                    {campaign.notes || "No customer notes"}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Vista de gráficos cuando activeTab es "charts" */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Gráfico circular de distribución de inversión */}
          <div className="bg-white shadow-sm border border-gray-100 rounded-xl p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-5 flex items-center">
              <FaChartPie className="h-5 w-5 mr-2 text-indigo-500" />
              Investment Distribution
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
            <h2 className="text-lg font-medium text-gray-900 mb-5 flex items-center">
              <svg
                className="h-5 w-5 mr-2 text-indigo-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
              </svg>
              Campaign Info
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
                <p className="text-xs font-medium text-indigo-500 uppercase">
                  Total Investment
                </p>
                <p className="text-2xl font-bold text-indigo-700 mt-1">
                  {formatCurrency(campaign.budget)}
                </p>
                <div className="flex items-center mt-2">
                  <span className="text-green-500 text-xs font-medium">
                    ↑ 12%{" "}
                  </span>
                  <span className="text-xs text-gray-500 ml-1">vs. target</span>
                </div>
              </div>

              <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-100">
                <p className="text-xs font-medium text-emerald-500 uppercase">
                  Total Units
                </p>
                <p className="text-2xl font-bold text-emerald-700 mt-1">
                  {formatNumber(campaign.units)}
                </p>
                <div className="flex items-center mt-2">
                  <span className="text-green-500 text-xs font-medium">
                    ↑ 8%{" "}
                  </span>
                  <span className="text-xs text-gray-500 ml-1">vs. target</span>
                </div>
              </div>

              <div className="bg-violet-50 rounded-lg p-4 border border-violet-100">
                <p className="text-xs font-medium text-violet-500 uppercase">
                  CPM
                </p>
                <p className="text-2xl font-bold text-violet-700 mt-1">
                  ${((campaign.budget / campaign.units) * 1000).toFixed(2)}
                </p>
                <div className="flex items-center mt-2">
                  <span className="text-red-500 text-xs font-medium">
                    ↓ 5%{" "}
                  </span>
                  <span className="text-xs text-gray-500 ml-1">vs. target</span>
                </div>
              </div>

              <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
                <p className="text-xs font-medium text-amber-500 uppercase">
                  Gross Margin
                </p>
                <p className="text-2xl font-bold text-amber-700 mt-1">
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

export default CampaignDetails;
