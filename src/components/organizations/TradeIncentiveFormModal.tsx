import React, { useEffect, useRef } from "react";
import { TradeIncentive } from "@/data/mockTradeData";

interface TradeIncentiveFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: Partial<TradeIncentive>) => void;
  currentIncentive: TradeIncentive | null;
  isEditing: boolean;
  countries: string[];
}

const TradeIncentiveFormModal: React.FC<TradeIncentiveFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currentIncentive,
  isEditing,
  countries,
}) => {
  // Use a ref to access the modal container
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle clicking outside to close only if clicking on the backdrop
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && e.target === e.currentTarget) {
      onClose();
    }
  };

  // Close on escape key
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscapeKey);
    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Define incentive types with their display names and colors
  const incentiveTypes = [
    { value: "Fixed", label: "Fixed", color: "bg-blue-500" },
    { value: "Volume", label: "Volume", color: "bg-emerald-500" },
    { value: "Scale", label: "Scale", color: "bg-amber-500" },
    { value: "OnTop", label: "On Top", color: "bg-purple-500" },
  ];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    // Get selected incentive type
    const selectedType = form.querySelector(
      'input[name="incentiveType"]:checked'
    ) as HTMLInputElement;
    const incentiveType = selectedType?.value as
      | "Fixed"
      | "Volume"
      | "Scale"
      | "OnTop";

    const formData: Partial<TradeIncentive> = {
      country: (form.elements.namedItem("country") as HTMLSelectElement).value,
      productType: (form.elements.namedItem("productType") as HTMLSelectElement)
        .value as "EAP" | "PAS" | "All",
      incentiveType,
      percentage: parseFloat(
        (form.elements.namedItem("percentage") as HTMLInputElement).value
      ),
      description: (
        form.elements.namedItem("description") as HTMLTextAreaElement
      ).value,
      startDate: (form.elements.namedItem("startDate") as HTMLInputElement)
        .value,
      endDate:
        (form.elements.namedItem("endDate") as HTMLInputElement).value ||
        undefined,
    };

    // Handle optional number fields
    const minVolumeInput = (
      form.elements.namedItem("minVolume") as HTMLInputElement
    ).value;
    if (minVolumeInput) {
      formData.minVolume = parseFloat(minVolumeInput);
    }

    const maxVolumeInput = (
      form.elements.namedItem("maxVolume") as HTMLInputElement
    ).value;
    if (maxVolumeInput) {
      formData.maxVolume = parseFloat(maxVolumeInput);
    }

    onSave(formData);
  };

  return (
    <div
      className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div className="fixed inset-0 bg-black/30 transition-opacity"></div>
      <div
        ref={modalRef}
        className="relative bg-white rounded-lg shadow-2xl max-w-2xl w-full p-6 z-50 max-h-[90vh] overflow-y-auto mx-4 transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEditing ? "Edit Incentive" : "Add New Incentive"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <svg
              className="h-6 w-6"
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

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="country"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Country
              </label>
              <select
                id="country"
                name="country"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                defaultValue={currentIncentive?.country || ""}
                required
              >
                <option value="" disabled>
                  Select a country
                </option>
                {countries
                  .filter((c) => c !== "All" && c !== "Global")
                  .map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                <option value="Global">Global</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="productType"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Product Type
              </label>
              <select
                id="productType"
                name="productType"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                defaultValue={currentIncentive?.productType || "All"}
                required
              >
                <option value="All">All products</option>
                <option value="EAP">EAP (Exclusive Ad Partner)</option>
                <option value="PAS">PAS (Premium Ad Solutions)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Incentive Type
              </label>
              <div className="mt-1 grid grid-cols-2 gap-3">
                {incentiveTypes.map((type) => (
                  <label
                    key={type.value}
                    className={`flex items-center p-3 border rounded-md cursor-pointer transition-colors ${
                      currentIncentive?.incentiveType === type.value
                        ? `border-${type.color.replace(
                            "bg-",
                            ""
                          )} bg-${type.color.replace("bg-", "")}/10`
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="incentiveType"
                      value={type.value}
                      defaultChecked={
                        currentIncentive
                          ? currentIncentive.incentiveType === type.value
                          : type.value === "Fixed"
                      }
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                      required
                    />
                    <span className="ml-2 flex items-center">
                      <span
                        className={`inline-block w-3 h-3 rounded-full ${type.color} mr-2`}
                      ></span>
                      <span className="text-sm font-medium text-gray-900">
                        {type.label}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label
                htmlFor="percentage"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Percentage (%)
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="number"
                  id="percentage"
                  name="percentage"
                  step="0.01"
                  min="0"
                  max="100"
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm pr-12"
                  defaultValue={currentIncentive?.percentage || ""}
                  required
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">%</span>
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                defaultValue={currentIncentive?.description || ""}
                required
              />
            </div>

            <div>
              <label
                htmlFor="startDate"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                defaultValue={
                  currentIncentive?.startDate ||
                  new Date().toISOString().split("T")[0]
                }
                required
              />
            </div>

            <div>
              <label
                htmlFor="endDate"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                End Date (optional)
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                defaultValue={currentIncentive?.endDate || ""}
              />
            </div>

            <div>
              <label
                htmlFor="minVolume"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Minimum Volume (optional)
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  id="minVolume"
                  name="minVolume"
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm pl-7"
                  defaultValue={currentIncentive?.minVolume || ""}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="maxVolume"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Maximum Volume (optional)
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  id="maxVolume"
                  name="maxVolume"
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm pl-7"
                  defaultValue={currentIncentive?.maxVolume || ""}
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 border border-transparent text-white rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isEditing ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TradeIncentiveFormModal;
