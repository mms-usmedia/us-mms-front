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
  isPartOfHolding: boolean;
  legalName: string;
  taxId: string;
  website?: string;
  contactName?: string;
  contactEmail?: string;
  status: "Active" | "Inactive" | "In Review";
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
  avbActive?: boolean;
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
    <div className="bg-white shadow-sm border border-gray-100 rounded-b-xl">
      {!hideActionButtons && (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 p-6">
          <div>
            <h2 className="text-xl font-semibold text-orange-600">
              Organization Details
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
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-md text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
              >
                <FaEdit className="h-4 w-4" />
                Edit Details
              </button>
            )}
          </div>
        </div>
      )}

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-6">
            <h2 className="text-lg font-medium text-orange-600 mb-4 flex items-center">
              <FaBuilding className="h-5 w-5 mr-2 text-orange-500" />
              <span className="text-orange-600">Basic Information</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <p className="text-sm font-medium text-gray-700">Name</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedOrganization.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className="mt-1 text-sm w-full border-2 border-orange-100 focus:border-orange-300 rounded p-2 bg-white text-gray-900 transition-colors focus:ring-0"
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900 font-medium">
                    {organization.name}
                  </p>
                )}
              </div>

              {/* Legal Name */}
              <div>
                <p className="text-sm font-medium text-gray-700">Legal Name</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedOrganization.legalName}
                    onChange={(e) => handleChange("legalName", e.target.value)}
                    className="mt-1 text-sm w-full border-2 border-orange-100 focus:border-orange-300 rounded p-2 bg-white text-gray-900 transition-colors focus:ring-0"
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900 font-medium">
                    {organization.legalName}
                  </p>
                )}
              </div>

              {/* Type */}
              <div>
                <p className="text-sm font-medium text-gray-700">Type</p>
                {isEditing ? (
                  <div className="relative">
                    <select
                      value={editedOrganization.type}
                      onChange={(e) => handleChange("type", e.target.value)}
                      className="mt-1 text-sm w-full border-2 border-orange-100 focus:border-orange-300 rounded p-2 bg-white text-gray-900 pr-8 appearance-none cursor-pointer transition-colors focus:ring-0"
                    >
                      {organizationTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none mt-1">
                      <svg
                        className="h-5 w-5 text-orange-500"
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
                        organization.type === "Agency"
                          ? "bg-orange-100 text-orange-800"
                          : organization.type === "Advertiser"
                          ? "bg-orange-50 text-orange-700"
                          : organization.type === "Publisher"
                          ? "bg-orange-200 text-orange-900"
                          : organization.type === "Holding Agency"
                          ? "bg-orange-300 text-orange-900"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {organization.type}
                    </span>
                  </p>
                )}
              </div>

              {/* Tax ID */}
              <div>
                <p className="text-sm font-medium text-gray-700">Tax ID</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedOrganization.taxId}
                    onChange={(e) => handleChange("taxId", e.target.value)}
                    className="mt-1 text-sm w-full border-2 border-orange-100 focus:border-orange-300 rounded p-2 bg-white text-gray-900 transition-colors focus:ring-0"
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900 font-mono font-medium">
                    {organization.taxId}
                  </p>
                )}
              </div>

              {/* Address */}
              <div className="col-span-2">
                <p className="text-sm font-medium text-gray-700">Address</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedOrganization.address || ""}
                    onChange={(e) => handleChange("address", e.target.value)}
                    className="mt-1 text-sm w-full border-2 border-orange-100 focus:border-orange-300 rounded p-2 bg-white text-gray-900 transition-colors focus:ring-0"
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900 font-medium">
                    {organization.address || (
                      <span className="text-gray-500 italic">
                        Not specified
                      </span>
                    )}
                  </p>
                )}
              </div>

              {/* City */}
              <div>
                <p className="text-sm font-medium text-gray-700">City</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedOrganization.city || ""}
                    onChange={(e) => handleChange("city", e.target.value)}
                    className="mt-1 text-sm w-full border-2 border-orange-100 focus:border-orange-300 rounded p-2 bg-white text-gray-900 transition-colors focus:ring-0"
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900 font-medium">
                    {organization.city || (
                      <span className="text-gray-500 italic">
                        Not specified
                      </span>
                    )}
                  </p>
                )}
              </div>

              {/* State/Province */}
              <div>
                <p className="text-sm font-medium text-gray-700">
                  State/Province
                </p>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedOrganization.state || ""}
                    onChange={(e) => handleChange("state", e.target.value)}
                    className="mt-1 text-sm w-full border-2 border-orange-100 focus:border-orange-300 rounded p-2 bg-white text-gray-900 transition-colors focus:ring-0"
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900 font-medium">
                    {organization.state || (
                      <span className="text-gray-500 italic">
                        Not specified
                      </span>
                    )}
                  </p>
                )}
              </div>

              {/* Zip Code */}
              <div>
                <p className="text-sm font-medium text-gray-700">Zip Code</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedOrganization.zipCode || ""}
                    onChange={(e) => handleChange("zipCode", e.target.value)}
                    className="mt-1 text-sm w-full border-2 border-orange-100 focus:border-orange-300 rounded p-2 bg-white text-gray-900 transition-colors focus:ring-0"
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900 font-medium">
                    {organization.zipCode || (
                      <span className="text-gray-500 italic">
                        Not specified
                      </span>
                    )}
                  </p>
                )}
              </div>

              {/* Country */}
              <div>
                <p className="text-sm font-medium text-gray-700">Country</p>
                {isEditing ? (
                  <div className="relative">
                    <select
                      value={editedOrganization.country}
                      onChange={(e) => handleChange("country", e.target.value)}
                      className="mt-1 text-sm w-full border-2 border-orange-100 focus:border-orange-300 rounded p-2 bg-white text-gray-900 pr-8 appearance-none cursor-pointer transition-colors focus:ring-0"
                    >
                      {countries.map((country) => (
                        <option key={country} value={country}>
                          {country}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none mt-1">
                      <svg
                        className="h-5 w-5 text-orange-500"
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
                  <p className="mt-1 text-sm text-gray-900 font-medium">
                    {organization.country}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Phone Number
                </p>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedOrganization.phone || ""}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    className="mt-1 text-sm w-full border-2 border-orange-100 focus:border-orange-300 rounded p-2 bg-white text-gray-900 transition-colors focus:ring-0"
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900 font-medium">
                    {organization.phone || (
                      <span className="text-gray-500 italic">
                        Not specified
                      </span>
                    )}
                  </p>
                )}
              </div>

              {/* Website */}
              <div>
                <p className="text-sm font-medium text-gray-700">Website</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedOrganization.website || ""}
                    onChange={(e) => handleChange("website", e.target.value)}
                    className="mt-1 text-sm w-full border-2 border-orange-100 focus:border-orange-300 rounded p-2 bg-white text-gray-900 transition-colors focus:ring-0"
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900">
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
              <div>
                <p className="text-sm font-medium text-gray-700">
                  {!editedOrganization.isHolding ? "Holding Name" : "Holding"}
                </p>
                {isEditing ? (
                  !editedOrganization.isHolding ? (
                    <input
                      type="text"
                      value={editedOrganization.holdingName || ""}
                      onChange={(e) =>
                        handleChange("holdingName", e.target.value)
                      }
                      className="mt-1 text-sm w-full border-2 border-orange-100 focus:border-orange-300 rounded p-2 bg-white text-gray-900 transition-colors focus:ring-0"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900 font-medium">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800 border border-orange-200">
                        <FaBuilding className="mr-1" /> Holding Company
                      </span>
                    </p>
                  )
                ) : (
                  <p className="mt-1 text-sm text-gray-900 font-medium">
                    {organization.isHolding ? (
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800 border border-orange-200">
                        <FaBuilding className="mr-1" /> Holding Company
                      </span>
                    ) : organization.holdingName ? (
                      organization.holdingName
                    ) : (
                      <span className="text-gray-500 italic">
                        Not specified
                      </span>
                    )}
                  </p>
                )}
              </div>

              {/* TAGS placeholder */}
              <div>
                <div className="mt-1 flex flex-wrap gap-1">
                  {organization.isBigSix && (
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-50 text-orange-700 border border-orange-100">
                      Big Six Group
                    </span>
                  )}
                  {/* Aquí se pueden agregar más tags en el futuro */}
                </div>
              </div>
            </div>

            {/* Holding Information - Solo checkboxes en modo edición */}
            {isEditing && (
              <div className="space-y-3 mt-5">
                {/* Is Holding */}
                <div className="flex items-center p-2 bg-orange-50 rounded-md border border-orange-100">
                  <input
                    type="checkbox"
                    id="isHolding"
                    checked={editedOrganization.isHolding}
                    onChange={(e) =>
                      handleChange("isHolding", e.target.checked)
                    }
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-orange-300 rounded"
                  />
                  <label
                    htmlFor="isHolding"
                    className="ml-2 text-sm font-medium text-gray-700"
                  >
                    Holding Company
                  </label>
                </div>

                {/* Is Big Six */}
                <div className="flex items-center p-2 bg-orange-50 rounded-md border border-orange-100">
                  <input
                    type="checkbox"
                    id="isBigSix"
                    checked={editedOrganization.isBigSix}
                    onChange={(e) => handleChange("isBigSix", e.target.checked)}
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-orange-300 rounded"
                  />
                  <label
                    htmlFor="isBigSix"
                    className="ml-2 text-sm font-medium text-gray-700"
                  >
                    Big Six Group
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Billing Information */}
          <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-6">
            <h2 className="text-lg font-medium text-orange-600 mb-4 flex items-center">
              <FaIdCard className="h-5 w-5 mr-2 text-orange-500" />
              <span className="text-orange-600">Billing Information</span>
            </h2>
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
                    AVB %
                  </label>
                  {isEditing ? (
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="avbActive"
                        checked={editedOrganization.avbActive || false}
                        onChange={(e) =>
                          handleChange("avbActive", e.target.checked)
                        }
                        className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-orange-300 rounded"
                      />
                      <label
                        htmlFor="avbActive"
                        className="ml-2 text-sm font-medium text-gray-700"
                      >
                        Active
                      </label>
                    </div>
                  ) : (
                    <p className="mt-1">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          organization.avbActive
                            ? "bg-green-100 text-green-800 border border-green-200"
                            : "bg-red-100 text-red-800 border border-red-200"
                        }`}
                      >
                        {organization.avbActive ? "Active" : "False"}
                      </span>
                    </p>
                  )}
                </div>
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
          </div>

          {/* Description - ocupando todo el ancho */}
          <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-6 col-span-1 md:col-span-2">
            <h2 className="text-lg font-medium text-orange-600 mb-4 flex items-center">
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
              <span className="text-orange-600">Description</span>
            </h2>
            {isEditing ? (
              <textarea
                value={editedOrganization.description || ""}
                onChange={(e) => handleChange("description", e.target.value)}
                rows={3}
                className="mt-1 text-sm w-full p-3 border-2 border-orange-100 focus:border-orange-300 rounded p-2 bg-white min-h-[120px] text-gray-900 transition-colors focus:ring-0"
                placeholder="Agregar descripción de la organización..."
              />
            ) : (
              <div className="mt-1 text-sm text-gray-900 p-3 bg-orange-50 border border-orange-100 rounded min-h-[120px] shadow-inner">
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
