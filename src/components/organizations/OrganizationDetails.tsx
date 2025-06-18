import React, { useState, useEffect } from "react";
import StatusBadge from "@/components/ui/StatusBadge";
import {
  FaEdit,
  FaSave,
  FaTimes,
  FaGlobe,
  FaMapMarkerAlt,
  FaBuilding,
  FaIdCard,
} from "react-icons/fa";

// Define props for the component
interface Organization {
  id: string;
  name: string;
  type:
    | "Agency"
    | "Advertiser"
    | "Publisher"
    | "Holding Agency"
    | "Holding Advertiser";
  country: string;
  isHolding: boolean;
  holdingName?: string;
  isBigSix: boolean;
  legalName: string;
  taxId: string;
  website?: string;
  contactName?: string;
  contactEmail?: string;
  status: "Active" | "Inactive";
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phone?: string;
  industry?: string;
  foundedYear?: number;
  description?: string;
  billingCurrency?: string;
  paymentTerms?: string;
  billingAddress?: string;
}

interface OrganizationDetailsProps {
  organization: Organization;
  onSave?: (updatedOrganization: Organization) => void;
  editMode?: boolean;
  hideActionButtons?: boolean;
  setIsEditing?: (value: boolean) => void;
}

const OrganizationDetails: React.FC<OrganizationDetailsProps> = ({
  organization,
  onSave = () => {},
  editMode = false,
  hideActionButtons = false,
  setIsEditing: externalSetIsEditing,
}) => {
  const [isEditing, setIsEditing] = useState(editMode);
  const [editedOrganization, setEditedOrganization] =
    useState<Organization>(organization);

  // Update isEditing when editMode changes
  useEffect(() => {
    setIsEditing(editMode);

    // Si cambia a no editable, restauramos los datos originales
    if (!editMode) {
      setEditedOrganization(organization);
    }
  }, [editMode, organization]);

  // Expose isEditing state to parent component if needed
  useEffect(() => {
    if (externalSetIsEditing) {
      externalSetIsEditing(isEditing);
    }
  }, [isEditing, externalSetIsEditing]);

  // Update local state when organization changes
  useEffect(() => {
    setEditedOrganization(organization);
  }, [organization]);

  // Handle changes in editable fields
  const handleChange = (
    field: keyof Organization,
    value: string | number | boolean
  ) => {
    setEditedOrganization((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Save changes
  const handleSave = () => {
    onSave(editedOrganization);
    setIsEditing(false);
  };

  // Cancel editing
  const handleCancel = () => {
    setEditedOrganization(organization);
    setIsEditing(false);
  };

  // Organization types for selector
  const organizationTypes = [
    "Agency",
    "Advertiser",
    "Publisher",
    "Holding Agency",
    "Holding Advertiser",
  ];

  // Countries for selector
  const countries = [
    "Argentina",
    "Brazil",
    "Chile",
    "Colombia",
    "Mexico",
    "Peru",
    "United States",
    "United Kingdom",
    "France",
    "Spain",
    "Germany",
    "Canada",
  ];

  // Industries for selector
  const industries = [
    "Advertising",
    "Automotive",
    "Banking & Finance",
    "Consumer Goods",
    "Digital Media",
    "E-commerce",
    "Education",
    "Entertainment",
    "Food & Beverage",
    "Healthcare",
    "Insurance",
    "Media Agency",
    "Real Estate",
    "Retail",
    "Technology",
    "Telecommunications",
    "Travel & Tourism",
  ];

  // Currencies for selector
  const currencies = [
    "USD",
    "MXN",
    "BRL",
    "ARS",
    "CLP",
    "COP",
    "PEN",
    "EUR",
    "GBP",
  ];

  // Payment terms for selector
  const paymentTermsOptions = [
    "Net 15",
    "Net 30",
    "Net 45",
    "Net 60",
    "Net 90",
  ];

  return (
    <div className="bg-white shadow-sm rounded-lg">
      {!hideActionButtons && (
        <div className="flex justify-end items-center p-4 bg-white border-b border-gray-200">
          <div className="flex items-center gap-3">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
                >
                  <FaSave className="h-4 w-4" />
                  Save changes
                </button>
                {!editMode && (
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2.5 bg-white hover:bg-gray-100 text-gray-700 rounded-md text-sm font-medium transition-colors flex items-center gap-2 shadow-sm border border-gray-300"
                  >
                    <FaTimes className="h-4 w-4" />
                    Cancel
                  </button>
                )}
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-md text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
              >
                <FaEdit className="h-4 w-4" />
                Edit Details
              </button>
            )}
          </div>
        </div>
      )}

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Basic Information */}
          <div className="space-y-6 bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-3 flex items-center">
              <FaBuilding className="mr-2 text-orange-500" />
              <span>Basic Information</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="block text-xs uppercase tracking-wide font-semibold text-gray-600 mb-1">
                  Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedOrganization.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 focus:border-orange-500 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 text-gray-900 bg-white"
                  />
                ) : (
                  <p className="text-gray-800 font-medium">
                    {organization.name}
                  </p>
                )}
              </div>

              {/* Legal Name */}
              <div>
                <label className="block text-xs uppercase tracking-wide font-semibold text-gray-600 mb-1">
                  Legal Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedOrganization.legalName}
                    onChange={(e) => handleChange("legalName", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 focus:border-orange-500 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 text-gray-900 bg-white"
                  />
                ) : (
                  <p className="text-gray-800 font-medium">
                    {organization.legalName}
                  </p>
                )}
              </div>

              {/* Type */}
              <div>
                <label className="block text-xs uppercase tracking-wide font-semibold text-gray-600 mb-1">
                  Type
                </label>
                {isEditing ? (
                  <select
                    value={editedOrganization.type}
                    onChange={(e) => handleChange("type", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 focus:border-orange-500 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 text-gray-900 bg-white"
                  >
                    {organizationTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div>
                    {organization.type === "Agency" && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-sm font-medium bg-blue-100 text-blue-800">
                        {organization.type}
                      </span>
                    )}
                    {organization.type === "Advertiser" && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-sm font-medium bg-purple-100 text-purple-800">
                        {organization.type}
                      </span>
                    )}
                    {organization.type === "Publisher" && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-sm font-medium bg-amber-100 text-amber-800">
                        {organization.type}
                      </span>
                    )}
                    {organization.type === "Holding Agency" && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-sm font-medium bg-teal-100 text-teal-800">
                        {organization.type}
                      </span>
                    )}
                    {organization.type === "Holding Advertiser" && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-sm font-medium bg-rose-100 text-rose-800">
                        {organization.type}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Country */}
              <div>
                <label className="block text-xs uppercase tracking-wide font-semibold text-gray-600 mb-1">
                  Country
                </label>
                {isEditing ? (
                  <select
                    value={editedOrganization.country}
                    onChange={(e) => handleChange("country", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 focus:border-orange-500 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 text-gray-900 bg-white"
                  >
                    {countries.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-gray-800 font-medium">
                    {organization.country}
                  </p>
                )}
              </div>

              {/* Tax ID */}
              <div>
                <label className="block text-xs uppercase tracking-wide font-semibold text-gray-600 mb-1">
                  Tax ID
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedOrganization.taxId}
                    onChange={(e) => handleChange("taxId", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 focus:border-orange-500 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 text-gray-900 bg-white"
                  />
                ) : (
                  <p className="text-gray-800 font-mono font-medium">
                    {organization.taxId}
                  </p>
                )}
              </div>

              {/* Industry */}
              <div>
                <label className="block text-xs uppercase tracking-wide font-semibold text-gray-600 mb-1">
                  Industry
                </label>
                {isEditing ? (
                  <select
                    value={editedOrganization.industry || ""}
                    onChange={(e) => handleChange("industry", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 focus:border-orange-500 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 text-gray-900 bg-white"
                  >
                    <option value="">Seleccionar industria</option>
                    {industries.map((industry) => (
                      <option key={industry} value={industry}>
                        {industry}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-gray-800 font-medium">
                    {organization.industry || (
                      <span className="text-gray-500 italic">
                        No especificado
                      </span>
                    )}
                  </p>
                )}
              </div>

              {/* Website */}
              <div>
                <label className="block text-xs uppercase tracking-wide font-semibold text-gray-600 mb-1">
                  Website
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedOrganization.website || ""}
                    onChange={(e) => handleChange("website", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 focus:border-orange-500 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 text-gray-900 bg-white"
                  />
                ) : (
                  <p className="text-gray-800">
                    {organization.website ? (
                      <a
                        href={organization.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-600 hover:text-orange-800 flex items-center font-medium"
                      >
                        <FaGlobe className="mr-1" />
                        {organization.website}
                      </a>
                    ) : (
                      <span className="text-gray-500 italic">
                        Not specified
                      </span>
                    )}
                  </p>
                )}
              </div>

              {/* Holding Name (only if not a holding) */}
              {!editedOrganization.isHolding && (
                <div>
                  <label className="block text-xs uppercase tracking-wide font-semibold text-gray-600 mb-1">
                    Holding Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedOrganization.holdingName || ""}
                      onChange={(e) =>
                        handleChange("holdingName", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 focus:border-orange-500 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 text-gray-900 bg-white"
                    />
                  ) : (
                    <p className="text-gray-800 font-medium">
                      {organization.holdingName || (
                        <span className="text-gray-500 italic">
                          Not specified
                        </span>
                      )}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Holding Information */}
            <div className="space-y-3 mt-5">
              {/* Is Holding y Big Six cuando no está en modo edición */}
              {!isEditing && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {organization.isHolding && (
                    <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-orange-100 text-orange-800 border border-orange-200">
                      <FaBuilding className="mr-1" /> Holding Company
                    </span>
                  )}
                  {organization.isBigSix && (
                    <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-amber-100 text-amber-800 border border-amber-200">
                      Big Six Group
                    </span>
                  )}
                </div>
              )}

              {/* Is Holding */}
              <div>
                {isEditing ? (
                  <div className="flex items-center p-2 bg-gray-50 rounded-md">
                    <input
                      type="checkbox"
                      id="isHolding"
                      checked={editedOrganization.isHolding}
                      onChange={(e) =>
                        handleChange("isHolding", e.target.checked)
                      }
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="isHolding"
                      className="ml-2 text-sm font-medium text-gray-700"
                    >
                      Holding Company
                    </label>
                  </div>
                ) : null}
              </div>

              {/* Is Big Six */}
              <div>
                {isEditing ? (
                  <div className="flex items-center p-2 bg-gray-50 rounded-md">
                    <input
                      type="checkbox"
                      id="isBigSix"
                      checked={editedOrganization.isBigSix}
                      onChange={(e) =>
                        handleChange("isBigSix", e.target.checked)
                      }
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="isBigSix"
                      className="ml-2 text-sm font-medium text-gray-700"
                    >
                      Big Six Group
                    </label>
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-6 bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-3 flex items-center">
              <FaMapMarkerAlt className="mr-2 text-orange-500" />
              <span>Contact Information</span>
            </h3>
            <div className="space-y-4">
              {/* Address */}
              <div>
                <label className="block text-xs uppercase tracking-wide font-semibold text-gray-600 mb-1">
                  Address
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedOrganization.address || ""}
                    onChange={(e) => handleChange("address", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 focus:border-orange-500 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 text-gray-900 bg-white"
                  />
                ) : (
                  <p className="text-gray-800 font-medium">
                    {organization.address || (
                      <span className="text-gray-500 italic">
                        Not specified
                      </span>
                    )}
                  </p>
                )}
              </div>

              {/* City, State, Zip in one row */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wide font-semibold text-gray-600 mb-1">
                    City
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedOrganization.city || ""}
                      onChange={(e) => handleChange("city", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 focus:border-orange-500 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 text-gray-900 bg-white"
                    />
                  ) : (
                    <p className="text-gray-800 font-medium">
                      {organization.city || (
                        <span className="text-gray-500 italic">
                          Not specified
                        </span>
                      )}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wide font-semibold text-gray-600 mb-1">
                    State/Province
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedOrganization.state || ""}
                      onChange={(e) => handleChange("state", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 focus:border-orange-500 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 text-gray-900 bg-white"
                    />
                  ) : (
                    <p className="text-gray-800 font-medium">
                      {organization.state || (
                        <span className="text-gray-500 italic">
                          Not specified
                        </span>
                      )}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wide font-semibold text-gray-600 mb-1">
                    Zip Code
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedOrganization.zipCode || ""}
                      onChange={(e) => handleChange("zipCode", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 focus:border-orange-500 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 text-gray-900 bg-white"
                    />
                  ) : (
                    <p className="text-gray-800 font-medium">
                      {organization.zipCode || (
                        <span className="text-gray-500 italic">
                          Not specified
                        </span>
                      )}
                    </p>
                  )}
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs uppercase tracking-wide font-semibold text-gray-600 mb-1">
                  Phone
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedOrganization.phone || ""}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 focus:border-orange-500 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 text-gray-900 bg-white"
                  />
                ) : (
                  <p className="text-gray-800 font-medium">
                    {organization.phone || (
                      <span className="text-gray-500 italic">
                        Not specified
                      </span>
                    )}
                  </p>
                )}
              </div>

              {/* Primary Contact Information */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                <h4 className="text-md font-semibold text-gray-800 mb-3 flex items-center">
                  <FaIdCard className="mr-2 text-orange-500" />
                  Primary Contact
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wide font-semibold text-gray-600 mb-1">
                      Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedOrganization.contactName || ""}
                        onChange={(e) =>
                          handleChange("contactName", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 focus:border-orange-500 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 text-gray-900 bg-white"
                      />
                    ) : (
                      <p className="text-gray-800 font-medium">
                        {organization.contactName || (
                          <span className="text-gray-500 italic">
                            Not specified
                          </span>
                        )}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide font-semibold text-gray-600 mb-1">
                      Email
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={editedOrganization.contactEmail || ""}
                        onChange={(e) =>
                          handleChange("contactEmail", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 focus:border-orange-500 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 text-gray-900 bg-white"
                      />
                    ) : (
                      <p className="text-gray-800">
                        {organization.contactEmail ? (
                          <a
                            href={`mailto:${organization.contactEmail}`}
                            className="text-orange-600 hover:text-orange-800 font-medium flex items-center"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 mr-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                              />
                            </svg>
                            {organization.contactEmail}
                          </a>
                        ) : (
                          <span className="text-gray-500 italic">
                            Not specified
                          </span>
                        )}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Billing Information */}
          <div className="space-y-6 bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-3 flex items-center">
              <FaIdCard className="mr-2 text-orange-500" />
              <span>Billing Information</span>
            </h3>
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wide font-semibold text-gray-600 mb-1">
                    Currency
                  </label>
                  {isEditing ? (
                    <select
                      value={editedOrganization.billingCurrency || ""}
                      onChange={(e) =>
                        handleChange("billingCurrency", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 focus:border-orange-500 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 text-gray-900 bg-white"
                    >
                      <option value="">Seleccionar moneda</option>
                      {currencies.map((currency) => (
                        <option key={currency} value={currency}>
                          {currency}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-gray-800 font-medium">
                      {organization.billingCurrency || (
                        <span className="text-gray-500 italic">
                          Not specified
                        </span>
                      )}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wide font-semibold text-gray-600 mb-1">
                    Payment Terms
                  </label>
                  {isEditing ? (
                    <select
                      value={editedOrganization.paymentTerms || ""}
                      onChange={(e) =>
                        handleChange("paymentTerms", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 focus:border-orange-500 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 text-gray-900 bg-white"
                    >
                      <option value="">Select payment terms</option>
                      {paymentTermsOptions.map((term) => (
                        <option key={term} value={term}>
                          {term}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-gray-800 font-medium">
                      {organization.paymentTerms || (
                        <span className="text-gray-500 italic">
                          Not specified
                        </span>
                      )}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide font-semibold text-gray-600 mb-1">
                  Billing Address
                </label>
                {isEditing ? (
                  <textarea
                    value={editedOrganization.billingAddress || ""}
                    onChange={(e) =>
                      handleChange("billingAddress", e.target.value)
                    }
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 focus:border-orange-500 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 text-gray-900 bg-white"
                  />
                ) : (
                  <p className="text-gray-800 font-medium">
                    {organization.billingAddress || (
                      <span className="text-gray-500 italic">
                        Same as physical address
                      </span>
                    )}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-6 bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-3 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-orange-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span>Description</span>
            </h3>
            {isEditing ? (
              <textarea
                value={editedOrganization.description || ""}
                onChange={(e) => handleChange("description", e.target.value)}
                rows={3}
                className="mt-1 text-sm w-full p-3 border border-gray-300 focus:border-orange-500 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 bg-white min-h-[120px] text-gray-900 transition-colors"
                placeholder="Agregar descripción de la organización..."
              />
            ) : (
              <div className="mt-1 text-gray-800 font-medium p-3 bg-orange-50 border border-orange-100 rounded-md min-h-[120px] shadow-inner">
                {organization.description || (
                  <span className="text-gray-500 italic">
                    No description available.
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationDetails;
