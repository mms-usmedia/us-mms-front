import React, { useState, useEffect } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import {
  TradeIncentive,
  getTradeIncentivesByOrganizationId,
  getAllCountries,
} from "@/data/mockTradeData";
import TradeIncentiveFilters from "./TradeIncentiveFilters";
import TradeIncentiveFormModal from "./TradeIncentiveFormModal";
import TradeIncentiveDeleteModal from "./TradeIncentiveDeleteModal";

interface Organization {
  id: string;
  name: string;
  type:
    | "Agency"
    | "Advertiser"
    | "Publisher"
    | "Holding Agency"
    | "Holding Advertiser";
  // Other organization fields
}

interface OrganizationTradeProps {
  organization: Organization;
  hideActionButtons?: boolean;
  showAddIncentiveForm?: boolean;
  onFormDisplay?: () => void;
}

const OrganizationTrade: React.FC<OrganizationTradeProps> = ({
  organization,
  hideActionButtons = false,
  showAddIncentiveForm = false,
  onFormDisplay,
}) => {
  const [incentives, setIncentives] = useState<TradeIncentive[]>([]);
  const [filteredIncentives, setFilteredIncentives] = useState<
    TradeIncentive[]
  >([]);
  const [isAddingIncentive, setIsAddingIncentive] =
    useState(showAddIncentiveForm);
  const [isEditingIncentive, setIsEditingIncentive] = useState(false);
  const [currentIncentive, setCurrentIncentive] =
    useState<TradeIncentive | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [incentiveToDelete, setIncentiveToDelete] = useState<string | null>(
    null
  );

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("All");
  const [selectedProductType, setSelectedProductType] = useState("All");
  const [selectedIncentiveTypes, setSelectedIncentiveTypes] = useState<
    string[]
  >([]);

  // Get the available countries from mock data
  const countries = getAllCountries();

  // Incentive type colors for badges
  const incentiveTypeColors = {
    Fixed: "bg-blue-100 text-blue-800 border-blue-200",
    Volume: "bg-emerald-100 text-emerald-800 border-emerald-200",
    Scale: "bg-amber-100 text-amber-800 border-amber-200",
    OnTop: "bg-purple-100 text-purple-800 border-purple-200",
  };

  // Load incentives from mock data
  useEffect(() => {
    const orgIncentives = getTradeIncentivesByOrganizationId(organization.id);
    setIncentives(orgIncentives);
    setFilteredIncentives(orgIncentives);
  }, [organization.id]);

  // Update form state when prop changes
  useEffect(() => {
    if (showAddIncentiveForm) {
      setIsAddingIncentive(true);
    }
  }, [showAddIncentiveForm]);

  // Notify parent component when form is closed
  useEffect(() => {
    if (isAddingIncentive === false && onFormDisplay) {
      onFormDisplay();
    }
  }, [isAddingIncentive, onFormDisplay]);

  // Apply filters
  useEffect(() => {
    let result = incentives;

    // Apply search filter
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      result = result.filter(
        (inc) =>
          inc.description.toLowerCase().includes(lowerSearchTerm) ||
          inc.country.toLowerCase().includes(lowerSearchTerm) ||
          inc.percentage.toString().includes(lowerSearchTerm)
      );
    }

    // Apply country filter
    if (selectedCountry !== "All") {
      result = result.filter((inc) => inc.country === selectedCountry);
    }

    // Apply product type filter
    if (selectedProductType !== "All") {
      result = result.filter((inc) => inc.productType === selectedProductType);
    }

    // Apply incentive type filters
    if (selectedIncentiveTypes.length > 0) {
      result = result.filter((inc) =>
        selectedIncentiveTypes.includes(inc.incentiveType)
      );
    }

    setFilteredIncentives(result);
  }, [
    incentives,
    searchTerm,
    selectedCountry,
    selectedProductType,
    selectedIncentiveTypes,
  ]);

  // Group incentives by country and product type
  const groupedIncentives = filteredIncentives.reduce((acc, incentive) => {
    const key = `${incentive.country}-${incentive.productType}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(incentive);
    return acc;
  }, {} as Record<string, TradeIncentive[]>);

  // Form handling
  const handleAddIncentive = () => {
    setCurrentIncentive(null);
    setIsAddingIncentive(true);
    setIsEditingIncentive(false);
  };

  const handleEditIncentive = (incentive: TradeIncentive) => {
    setCurrentIncentive(incentive);
    setIsAddingIncentive(true);
    setIsEditingIncentive(true);
  };

  const handleDeleteIncentive = (id: string) => {
    setIncentiveToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDeleteIncentive = () => {
    if (incentiveToDelete) {
      // In a real app, this would be an API call
      setIncentives(incentives.filter((inc) => inc.id !== incentiveToDelete));
      setShowDeleteModal(false);
      setIncentiveToDelete(null);
    }
  };

  const handleSaveIncentive = (formData: Partial<TradeIncentive>) => {
    if (isEditingIncentive && currentIncentive) {
      // Update existing incentive
      const updatedIncentives = incentives.map((inc) =>
        inc.id === currentIncentive.id
          ? { ...inc, ...formData, updatedAt: new Date().toISOString() }
          : inc
      );
      setIncentives(updatedIncentives);
    } else {
      // Create new incentive
      const newIncentive: TradeIncentive = {
        id: `inc${Math.random().toString(36).substr(2, 9)}`,
        organizationId: organization.id,
        country: formData.country || "",
        productType: formData.productType || "All",
        incentiveType: formData.incentiveType || "Fixed",
        percentage: formData.percentage || 0,
        description: formData.description || "",
        startDate: formData.startDate || new Date().toISOString().split("T")[0],
        endDate: formData.endDate,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: true,
      };

      // Agregar campos específicos según el tipo de incentivo
      if (formData.incentiveType === "Volume") {
        newIncentive.minVolume = formData.minVolume;
        newIncentive.maxVolume = formData.maxVolume;
      } else if (formData.incentiveType === "Scale") {
        newIncentive.tiers = formData.tiers;
      } else if (formData.incentiveType === "OnTop") {
        newIncentive.additionalPercentage = formData.additionalPercentage;
        newIncentive.thresholdVolume = formData.thresholdVolume;
      }

      setIncentives([...incentives, newIncentive]);
    }

    setIsAddingIncentive(false);
    setIsEditingIncentive(false);
    setCurrentIncentive(null);
  };

  const handleCloseModal = () => {
    setIsAddingIncentive(false);
    setIsEditingIncentive(false);
    setCurrentIncentive(null);
  };

  return (
    <div className="bg-white rounded-b-xl shadow-sm">
      {/* Filters */}
      <TradeIncentiveFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCountry={selectedCountry}
        onCountryChange={setSelectedCountry}
        selectedProductType={selectedProductType}
        onProductTypeChange={setSelectedProductType}
        selectedIncentiveTypes={selectedIncentiveTypes}
        onIncentiveTypesChange={setSelectedIncentiveTypes}
        incentives={incentives}
      />

      {/* Add incentive button */}
      {!hideActionButtons && !isAddingIncentive && (
        <div className="px-6 pb-4 flex justify-end">
          <button
            onClick={handleAddIncentive}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-md text-sm font-medium flex items-center gap-2 shadow-sm"
          >
            <PlusIcon className="h-4 w-4" />
            Add Incentive
          </button>
        </div>
      )}

      {/* Incentives list */}
      <div className="px-6 pb-6">
        {Object.entries(groupedIncentives).length > 0 ? (
          <div className="space-y-6">
            {Object.entries(groupedIncentives).map(([key, groupIncentives]) => {
              const [country, productType] = key.split("-");
              return (
                <div
                  key={key}
                  className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900 flex items-center">
                      <span className="mr-2">{country}</span>
                      <span className="text-gray-400 mx-1">•</span>
                      <span className="text-indigo-700">
                        {productType === "EAP"
                          ? "Exclusive Ad Partner"
                          : productType === "PAS"
                          ? "Premium Ad Solutions"
                          : "All products"}
                      </span>
                    </h3>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {groupIncentives.map((incentive) => (
                      <div
                        key={incentive.id}
                        className="p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                        onClick={() => handleEditIncentive(incentive)}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <span className="text-2xl font-semibold text-gray-900">
                                {incentive.incentiveType === "Scale" &&
                                incentive.tiers &&
                                incentive.tiers.length > 0 ? (
                                  <span className="flex items-center">
                                    <span>
                                      {incentive.tiers[0].percentage}%
                                    </span>
                                    <span className="text-lg font-normal text-gray-600 ml-1">
                                      →{" "}
                                      {
                                        incentive.tiers[
                                          incentive.tiers.length - 1
                                        ].percentage
                                      }
                                      %
                                    </span>
                                  </span>
                                ) : (
                                  <>
                                    {incentive.percentage}%
                                    {incentive.incentiveType === "OnTop" &&
                                      incentive.additionalPercentage && (
                                        <span className="text-lg font-normal text-gray-600 ml-1">
                                          +{incentive.additionalPercentage}%
                                        </span>
                                      )}
                                  </>
                                )}
                              </span>
                              <span
                                className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                                  incentiveTypeColors[
                                    incentive.incentiveType as keyof typeof incentiveTypeColors
                                  ]
                                }`}
                              >
                                {incentive.incentiveType === "Fixed"
                                  ? "Fixed"
                                  : incentive.incentiveType === "Volume"
                                  ? "Volume"
                                  : incentive.incentiveType === "Scale"
                                  ? "Scale"
                                  : "On Top"}
                              </span>
                              {incentive.isActive ? (
                                <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 border border-green-200">
                                  Active
                                </span>
                              ) : (
                                <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 border border-red-200">
                                  Inactive
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-700 mb-3">
                              {incentive.description}
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-gray-500">
                              <p className="flex items-center">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-3.5 w-3.5 mr-1.5 text-gray-400"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                  />
                                </svg>
                                Valid:{" "}
                                {new Date(
                                  incentive.startDate
                                ).toLocaleDateString()}
                                {incentive.endDate
                                  ? ` - ${new Date(
                                      incentive.endDate
                                    ).toLocaleDateString()}`
                                  : " - No end date"}
                              </p>
                              {incentive.incentiveType === "Scale" &&
                                incentive.tiers && (
                                  <p className="flex items-center">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-3.5 w-3.5 mr-1.5 text-gray-400"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                      />
                                    </svg>
                                    Tiers: {incentive.tiers.length} levels
                                  </p>
                                )}
                              {incentive.incentiveType === "OnTop" &&
                                incentive.thresholdVolume && (
                                  <p className="flex items-center">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-3.5 w-3.5 mr-1.5 text-gray-400"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                      />
                                    </svg>
                                    Threshold: $
                                    {incentive.thresholdVolume.toLocaleString()}
                                  </p>
                                )}
                              {incentive.incentiveType === "Volume" &&
                                (incentive.minVolume !== undefined ||
                                  incentive.maxVolume !== undefined) && (
                                  <p className="flex items-center">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-3.5 w-3.5 mr-1.5 text-gray-400"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                      />
                                    </svg>
                                    Volume:
                                    {incentive.minVolume !== undefined
                                      ? ` Min $${incentive.minVolume.toLocaleString()}`
                                      : ""}
                                    {incentive.maxVolume !== undefined
                                      ? ` Max $${incentive.maxVolume.toLocaleString()}`
                                      : ""}
                                  </p>
                                )}
                            </div>
                          </div>
                          <div
                            className="flex space-x-3 ml-4"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditIncentive(incentive);
                              }}
                              className="text-orange-600 hover:text-orange-800 p-1.5 rounded-full hover:bg-orange-50 transition-colors"
                              title="Edit"
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
                                handleDeleteIncentive(incentive.id);
                              }}
                              className="text-red-600 hover:text-red-800 p-1.5 rounded-full hover:bg-red-50 transition-colors"
                              title="Delete"
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
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No incentives found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ||
              selectedCountry !== "All" ||
              selectedProductType !== "All" ||
              selectedIncentiveTypes.length > 0
                ? "Try adjusting your filters to see more results."
                : "Get started by creating a new trade incentive for this organization."}
            </p>
            {!hideActionButtons && !isAddingIncentive && (
              <div className="mt-6">
                <button
                  type="button"
                  onClick={handleAddIncentive}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                  Add incentive
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <TradeIncentiveFormModal
        isOpen={isAddingIncentive}
        onClose={handleCloseModal}
        onSave={handleSaveIncentive}
        currentIncentive={currentIncentive}
        isEditing={isEditingIncentive}
        countries={countries.filter((c) => c !== "All")}
      />

      <TradeIncentiveDeleteModal
        isOpen={showDeleteModal}
        onConfirm={confirmDeleteIncentive}
        onCancel={() => {
          setShowDeleteModal(false);
          setIncentiveToDelete(null);
        }}
      />
    </div>
  );
};

export default OrganizationTrade;
