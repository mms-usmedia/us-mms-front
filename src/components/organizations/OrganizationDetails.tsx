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
  const [editedOrganization, setEditedOrganization] = useState<Organization>(
    organization
  );

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
        <div className="flex justify-end items-center p-4">
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
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
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
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
          <div className="space-y-6 bg-gradient-to-b from-indigo-50 to-white p-4 rounded-lg shadow-sm border border-indigo-100">
            <h3 className="text-lg font-medium text-indigo-800 border-b border-indigo-200 pb-2">
              <FaBuilding className="inline mr-2 text-indigo-500" /> Basic
              Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedOrganization.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className="w-full px-3 py-2 border-2 border-indigo-100 focus:border-indigo-300 rounded-md focus:outline-none focus:ring-0 text-gray-900 bg-white"
                  />
                ) : (
                  <p className="text-gray-800">{organization.name}</p>
                )}
              </div>

              {/* Legal Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Legal Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedOrganization.legalName}
                    onChange={(e) => handleChange("legalName", e.target.value)}
                    className="w-full px-3 py-2 border-2 border-indigo-100 focus:border-indigo-300 rounded-md focus:outline-none focus:ring-0 text-gray-900 bg-white"
                  />
                ) : (
                  <p className="text-gray-800">{organization.legalName}</p>
                )}
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                {isEditing ? (
                  <select
                    value={editedOrganization.type}
                    onChange={(e) => handleChange("type", e.target.value)}
                    className="w-full px-3 py-2 border-2 border-indigo-100 focus:border-indigo-300 rounded-md focus:outline-none focus:ring-0 text-gray-900 bg-white"
                  >
                    {organizationTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-gray-800">{organization.type}</p>
                )}
              </div>

              {/* Country */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                {isEditing ? (
                  <select
                    value={editedOrganization.country}
                    onChange={(e) => handleChange("country", e.target.value)}
                    className="w-full px-3 py-2 border-2 border-indigo-100 focus:border-indigo-300 rounded-md focus:outline-none focus:ring-0 text-gray-900 bg-white"
                  >
                    {countries.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-gray-800">{organization.country}</p>
                )}
              </div>

              {/* Tax ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tax ID
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedOrganization.taxId}
                    onChange={(e) => handleChange("taxId", e.target.value)}
                    className="w-full px-3 py-2 border-2 border-indigo-100 focus:border-indigo-300 rounded-md focus:outline-none focus:ring-0 text-gray-900 bg-white"
                  />
                ) : (
                  <p className="text-gray-800 font-mono">
                    {organization.taxId}
                  </p>
                )}
              </div>

              {/* Industry */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Industry
                </label>
                {isEditing ? (
                  <select
                    value={editedOrganization.industry || ""}
                    onChange={(e) => handleChange("industry", e.target.value)}
                    className="w-full px-3 py-2 border-2 border-indigo-100 focus:border-indigo-300 rounded-md focus:outline-none focus:ring-0 text-gray-900 bg-white"
                  >
                    <option value="">Select industry</option>
                    {industries.map((industry) => (
                      <option key={industry} value={industry}>
                        {industry}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-gray-800">
                    {organization.industry || "N/A"}
                  </p>
                )}
              </div>

              {/* Website */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Website
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedOrganization.website || ""}
                    onChange={(e) => handleChange("website", e.target.value)}
                    className="w-full px-3 py-2 border-2 border-indigo-100 focus:border-indigo-300 rounded-md focus:outline-none focus:ring-0 text-gray-900 bg-white"
                  />
                ) : (
                  <p className="text-gray-800">
                    {organization.website ? (
                      <a
                        href={organization.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-800 flex items-center"
                      >
                        <FaGlobe className="mr-1" />
                        {organization.website}
                      </a>
                    ) : (
                      "N/A"
                    )}
                  </p>
                )}
              </div>
            </div>

            {/* Holding Information */}
            <div className="space-y-3 mt-3">
              {/* Is Holding y Big Six cuando no está en modo edición */}
              {!isEditing && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {organization.isHolding && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">
                      Holding Company
                    </span>
                  )}
                  {organization.isBigSix && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
                      Big Six Group
                    </span>
                  )}
                </div>
              )}

              {/* Is Holding */}
              <div>
                {isEditing ? (
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isHolding"
                      checked={editedOrganization.isHolding}
                      onChange={(e) =>
                        handleChange("isHolding", e.target.checked)
                      }
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="isHolding"
                      className="ml-2 text-sm text-gray-700"
                    >
                      Holding Company
                    </label>
                  </div>
                ) : null}
              </div>

              {/* Is Big Six */}
              <div>
                {isEditing ? (
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isBigSix"
                      checked={editedOrganization.isBigSix}
                      onChange={(e) =>
                        handleChange("isBigSix", e.target.checked)
                      }
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="isBigSix"
                      className="ml-2 text-sm text-gray-700"
                    >
                      Big Six Group
                    </label>
                  </div>
                ) : null}
              </div>

              {/* Holding Name (only if not a holding) */}
              {!editedOrganization.isHolding && (
                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Holding Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedOrganization.holdingName || ""}
                      onChange={(e) =>
                        handleChange("holdingName", e.target.value)
                      }
                      className="w-full px-3 py-2 border-2 border-indigo-100 focus:border-indigo-300 rounded-md focus:outline-none focus:ring-0 text-gray-900 bg-white"
                    />
                  ) : (
                    <p className="text-gray-800">
                      {organization.holdingName || "N/A"}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-6 bg-gradient-to-b from-blue-50 to-white p-4 rounded-lg shadow-sm border border-blue-100">
            <h3 className="text-lg font-medium text-blue-800 border-b border-blue-200 pb-2">
              <FaMapMarkerAlt className="inline mr-2 text-blue-500" /> Contact
              Information
            </h3>
            <div className="space-y-4">
              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedOrganization.address || ""}
                    onChange={(e) => handleChange("address", e.target.value)}
                    className="w-full px-3 py-2 border-2 border-indigo-100 focus:border-indigo-300 rounded-md focus:outline-none focus:ring-0 text-gray-900 bg-white"
                  />
                ) : (
                  <p className="text-gray-800">
                    {organization.address || "N/A"}
                  </p>
                )}
              </div>

              {/* City, State, Zip in one row */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedOrganization.city || ""}
                      onChange={(e) => handleChange("city", e.target.value)}
                      className="w-full px-3 py-2 border-2 border-indigo-100 focus:border-indigo-300 rounded-md focus:outline-none focus:ring-0 text-gray-900 bg-white"
                    />
                  ) : (
                    <p className="text-gray-800">
                      {organization.city || "N/A"}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State/Province
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedOrganization.state || ""}
                      onChange={(e) => handleChange("state", e.target.value)}
                      className="w-full px-3 py-2 border-2 border-indigo-100 focus:border-indigo-300 rounded-md focus:outline-none focus:ring-0 text-gray-900 bg-white"
                    />
                  ) : (
                    <p className="text-gray-800">
                      {organization.state || "N/A"}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Zip/Postal Code
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedOrganization.zipCode || ""}
                      onChange={(e) => handleChange("zipCode", e.target.value)}
                      className="w-full px-3 py-2 border-2 border-indigo-100 focus:border-indigo-300 rounded-md focus:outline-none focus:ring-0 text-gray-900 bg-white"
                    />
                  ) : (
                    <p className="text-gray-800">
                      {organization.zipCode || "N/A"}
                    </p>
                  )}
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedOrganization.phone || ""}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    className="w-full px-3 py-2 border-2 border-indigo-100 focus:border-indigo-300 rounded-md focus:outline-none focus:ring-0 text-gray-900 bg-white"
                  />
                ) : (
                  <p className="text-gray-800">{organization.phone || "N/A"}</p>
                )}
              </div>

              {/* Primary Contact Information */}
              <div className="border-t pt-4 mt-4">
                <h4 className="text-md font-medium text-gray-700 mb-3">
                  Primary Contact
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedOrganization.contactName || ""}
                        onChange={(e) =>
                          handleChange("contactName", e.target.value)
                        }
                        className="w-full px-3 py-2 border-2 border-indigo-100 focus:border-indigo-300 rounded-md focus:outline-none focus:ring-0 text-gray-900 bg-white"
                      />
                    ) : (
                      <p className="text-gray-800">
                        {organization.contactName || "N/A"}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Email
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={editedOrganization.contactEmail || ""}
                        onChange={(e) =>
                          handleChange("contactEmail", e.target.value)
                        }
                        className="w-full px-3 py-2 border-2 border-indigo-100 focus:border-indigo-300 rounded-md focus:outline-none focus:ring-0 text-gray-900 bg-white"
                      />
                    ) : (
                      <p className="text-gray-800">
                        {organization.contactEmail ? (
                          <a
                            href={`mailto:${organization.contactEmail}`}
                            className="text-indigo-600 hover:text-indigo-800"
                          >
                            {organization.contactEmail}
                          </a>
                        ) : (
                          "N/A"
                        )}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Billing Information */}
          <div className="space-y-6 bg-gradient-to-b from-purple-50 to-white p-4 rounded-lg shadow-sm border border-purple-100">
            <h3 className="text-lg font-medium text-purple-800 border-b border-purple-200 pb-2">
              <FaIdCard className="inline mr-2 text-purple-500" /> Billing
              Information
            </h3>
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Currency
                  </label>
                  {isEditing ? (
                    <select
                      value={editedOrganization.billingCurrency || ""}
                      onChange={(e) =>
                        handleChange("billingCurrency", e.target.value)
                      }
                      className="w-full px-3 py-2 border-2 border-indigo-100 focus:border-indigo-300 rounded-md focus:outline-none focus:ring-0 text-gray-900 bg-white"
                    >
                      <option value="">Select currency</option>
                      {currencies.map((currency) => (
                        <option key={currency} value={currency}>
                          {currency}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-gray-800">
                      {organization.billingCurrency || "N/A"}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Terms
                  </label>
                  {isEditing ? (
                    <select
                      value={editedOrganization.paymentTerms || ""}
                      onChange={(e) =>
                        handleChange("paymentTerms", e.target.value)
                      }
                      className="w-full px-3 py-2 border-2 border-indigo-100 focus:border-indigo-300 rounded-md focus:outline-none focus:ring-0 text-gray-900 bg-white"
                    >
                      <option value="">Select terms</option>
                      {paymentTermsOptions.map((term) => (
                        <option key={term} value={term}>
                          {term}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-gray-800">
                      {organization.paymentTerms || "N/A"}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Billing Address
                </label>
                {isEditing ? (
                  <textarea
                    value={editedOrganization.billingAddress || ""}
                    onChange={(e) =>
                      handleChange("billingAddress", e.target.value)
                    }
                    rows={2}
                    className="w-full px-3 py-2 border-2 border-indigo-100 focus:border-indigo-300 rounded-md focus:outline-none focus:ring-0 text-gray-900 bg-white"
                  />
                ) : (
                  <p className="text-gray-800">
                    {organization.billingAddress || "Same as physical address"}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-6 bg-gradient-to-b from-emerald-50 to-white p-4 rounded-lg shadow-sm border border-emerald-100">
            <h3 className="text-lg font-medium text-emerald-800 border-b border-emerald-200 pb-2">
              Description
            </h3>
            {isEditing ? (
              <textarea
                value={editedOrganization.description || ""}
                onChange={(e) => handleChange("description", e.target.value)}
                rows={3}
                className="mt-1 text-sm w-full p-3 border-2 border-emerald-100 focus:border-emerald-300 rounded bg-white min-h-[100px] text-gray-900 focus:ring-0 transition-colors"
                placeholder="Agregar descripción de la organización..."
              />
            ) : (
              <div className="mt-1 text-sm text-gray-900 p-3 border border-emerald-100 rounded bg-white min-h-[100px] shadow-inner">
                {organization.description || "No description available."}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationDetails;
