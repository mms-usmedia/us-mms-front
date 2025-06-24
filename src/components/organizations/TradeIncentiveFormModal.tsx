import React, { useEffect, useRef, useState } from "react";
import {
  TradeIncentive,
  VolumeTier,
  getAllProducts,
} from "@/data/mockTradeData";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";

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

  // Track the selected incentive type
  const [selectedIncentiveType, setSelectedIncentiveType] = useState<string>(
    currentIncentive?.incentiveType || "Fixed"
  );

  // Track the selected product type
  const [selectedProductType, setSelectedProductType] = useState<string>(
    currentIncentive?.productType || "All"
  );

  // Estados para el dropdown de productos específicos
  const [productSearchTerm, setProductSearchTerm] = useState<string>("");
  const [showProductDropdown, setShowProductDropdown] =
    useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<{
    id: string;
    name: string;
  } | null>(currentIncentive?.specificProduct || null);
  const [filteredProducts, setFilteredProducts] = useState<
    { id: string; name: string }[]
  >([]);
  const productDropdownRef = useRef<HTMLDivElement>(null);

  // Track volume tiers for Scale incentives
  const [tiers, setTiers] = useState<VolumeTier[]>([
    { minVolume: 0, percentage: 15 },
  ]);

  // Update selected type and tiers when currentIncentive changes
  useEffect(() => {
    if (currentIncentive) {
      setSelectedIncentiveType(currentIncentive.incentiveType);
      setSelectedProductType(currentIncentive.productType);
      setSelectedProduct(currentIncentive.specificProduct || null);

      if (currentIncentive.specificProduct) {
        setProductSearchTerm(currentIncentive.specificProduct.name);
      } else {
        setProductSearchTerm("");
      }

      // Initialize tiers if this is a Scale incentive
      if (
        currentIncentive.incentiveType === "Scale" &&
        currentIncentive.tiers &&
        currentIncentive.tiers.length > 0
      ) {
        setTiers(currentIncentive.tiers);
      } else {
        // Default tier
        setTiers([
          { minVolume: 0, percentage: currentIncentive.percentage || 15 },
        ]);
      }
    } else {
      setSelectedIncentiveType("Fixed");
      setSelectedProductType("All");
      setSelectedProduct(null);
      setProductSearchTerm("");
      setTiers([{ minVolume: 0, percentage: 15 }]);
    }
  }, [currentIncentive]);

  // Get all available products
  const products = getAllProducts();

  // Filtrar productos cuando se escribe en el campo de búsqueda
  useEffect(() => {
    if (productSearchTerm) {
      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(productSearchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [productSearchTerm, products]);

  // Cerrar dropdown cuando se hace clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        productDropdownRef.current &&
        !productDropdownRef.current.contains(event.target as Node)
      ) {
        setShowProductDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle clicking outside to close only if clicking on the backdrop
  const handleBackdropClick = (e: React.MouseEvent) => {
    // Si el clic fue directamente en el div contenedor y no en sus hijos
    if (e.target === e.currentTarget) {
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

  // Add a new tier
  const addTier = () => {
    const lastTier = tiers[tiers.length - 1];
    const newMinVolume = lastTier.maxVolume
      ? lastTier.maxVolume + 1
      : lastTier.minVolume + 1;

    setTiers([
      ...tiers,
      {
        minVolume: newMinVolume,
        percentage: lastTier.percentage,
      },
    ]);
  };

  // Remove a tier
  const removeTier = (index: number) => {
    if (tiers.length > 1) {
      setTiers(tiers.filter((_, i) => i !== index));
    }
  };

  // Update a tier
  const updateTier = (
    index: number,
    field: keyof VolumeTier,
    value: string
  ) => {
    const newTiers = [...tiers];
    const numValue = parseFloat(value);

    if (!isNaN(numValue)) {
      newTiers[index] = {
        ...newTiers[index],
        [field]: numValue,
      };

      setTiers(newTiers);
    }
  };

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
        .value as "EAP" | "PAS" | "All" | "Specific",
      incentiveType,
      description: (
        form.elements.namedItem("description") as HTMLTextAreaElement
      ).value,
      startDate: (form.elements.namedItem("startDate") as HTMLInputElement)
        .value,
      endDate:
        (form.elements.namedItem("endDate") as HTMLInputElement).value ||
        undefined,
    };

    // Si el tipo de producto es "Specific", agregar el producto específico
    if (formData.productType === "Specific") {
      if (selectedProduct) {
        formData.specificProduct = selectedProduct;
      } else {
        // Si no hay un producto seleccionado, pero hay un término de búsqueda,
        // intentamos encontrar el producto por nombre
        const productName = productSearchTerm.trim();
        const product = products.find(
          (p) => p.name.toLowerCase() === productName.toLowerCase()
        );

        if (product) {
          formData.specificProduct = product;
        } else {
          // Si no se encuentra el producto, mostramos un error
          alert("Please select a valid product");
          return;
        }
      }
    }

    // Campos específicos según el tipo de incentivo
    if (incentiveType === "Fixed") {
      formData.percentage = parseFloat(
        (form.elements.namedItem("percentage") as HTMLInputElement).value
      );
    } else if (incentiveType === "Volume") {
      formData.percentage = parseFloat(
        (form.elements.namedItem("percentage") as HTMLInputElement).value
      );

      const minVolumeInput = (
        form.elements.namedItem("minVolume") as HTMLInputElement
      )?.value;
      if (minVolumeInput) {
        formData.minVolume = parseFloat(minVolumeInput);
      }

      const maxVolumeInput = (
        form.elements.namedItem("maxVolume") as HTMLInputElement
      )?.value;
      if (maxVolumeInput) {
        formData.maxVolume = parseFloat(maxVolumeInput);
      }
    } else if (incentiveType === "Scale") {
      // Para incentivos de escala, guardamos los tiers
      formData.tiers = tiers;
      // Mantenemos el porcentaje para compatibilidad
      formData.percentage = tiers[0]?.percentage || 0;
    } else if (incentiveType === "OnTop") {
      // Para incentivos OnTop
      formData.percentage = parseFloat(
        (form.elements.namedItem("percentage") as HTMLInputElement).value
      );

      const additionalPercentageInput = (
        form.elements.namedItem("additionalPercentage") as HTMLInputElement
      )?.value;
      if (additionalPercentageInput) {
        formData.additionalPercentage = parseFloat(additionalPercentageInput);
      }

      const thresholdVolumeInput = (
        form.elements.namedItem("thresholdVolume") as HTMLInputElement
      )?.value;
      if (thresholdVolumeInput) {
        formData.thresholdVolume = parseFloat(thresholdVolumeInput);
      }
    } else if (incentiveType === "Specific") {
      // Buscar el producto seleccionado para obtener tanto el id como el nombre
      const productId = (
        form.elements.namedItem("specificProduct") as HTMLSelectElement
      ).value;
      const product = products.find((p) => p.id === productId);

      if (product) {
        formData.specificProduct = {
          id: product.id,
          name: product.name,
        };
      }
    }

    onSave(formData);
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center bg-black/30"
          onClick={handleBackdropClick}
        >
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
                    value={selectedProductType}
                    onChange={(e) => setSelectedProductType(e.target.value)}
                    required
                  >
                    <option value="All">All products</option>
                    <option value="EAP">EAP (Exclusive Ad Partner)</option>
                    <option value="PAS">PAS (Premium Ad Solutions)</option>
                    <option value="Specific">Specific Product</option>
                  </select>
                </div>

                {/* Selector de producto específico */}
                {selectedProductType === "Specific" && (
                  <div ref={productDropdownRef}>
                    <label
                      htmlFor="specificProduct"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Product
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="specificProduct-search"
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm text-gray-900 bg-white"
                        placeholder="Search for a product"
                        value={productSearchTerm}
                        onChange={(e) => setProductSearchTerm(e.target.value)}
                        onFocus={() => setShowProductDropdown(true)}
                        readOnly={!!selectedProduct}
                      />
                      {selectedProduct && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedProduct(null);
                              setProductSearchTerm("");
                            }}
                            className="text-gray-400 hover:text-gray-500 focus:outline-none"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>
                      )}

                      {/* Hidden input para enviar el valor seleccionado */}
                      <input
                        type="hidden"
                        name="specificProduct"
                        value={selectedProduct?.id || ""}
                      />
                    </div>

                    {/* Dropdown de productos */}
                    {showProductDropdown && !selectedProduct && (
                      <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm border border-gray-200">
                        <div className="px-2 py-1 bg-gray-50 text-xs font-medium text-gray-500">
                          {filteredProducts.length} products found
                        </div>
                        {filteredProducts.length === 0 ? (
                          <div className="text-gray-500 text-sm px-4 py-2">
                            No products found
                          </div>
                        ) : (
                          filteredProducts.map((product) => (
                            <div
                              key={product.id}
                              className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-50 text-gray-900 text-sm"
                              onClick={() => {
                                setSelectedProduct(product);
                                setProductSearchTerm(product.name);
                                setShowProductDropdown(false);
                              }}
                            >
                              {product.name}
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Incentive Type
                  </label>
                  <div className="mt-1 grid grid-cols-2 gap-3">
                    {incentiveTypes.map((type) => (
                      <label
                        key={type.value}
                        className={`flex items-center p-3 border rounded-md cursor-pointer transition-colors ${
                          selectedIncentiveType === type.value
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
                          defaultChecked={selectedIncentiveType === type.value}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                          required
                          onChange={() => setSelectedIncentiveType(type.value)}
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

                {/* Campos específicos según el tipo de incentivo */}
                {selectedIncentiveType === "Fixed" && (
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
                )}

                {selectedIncentiveType === "Volume" && (
                  <>
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
                    <div>
                      <label
                        htmlFor="minVolume"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Minimum Volume
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
                          required
                        />
                      </div>
                    </div>
                    <div className="md:col-span-2">
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
                  </>
                )}

                {selectedIncentiveType === "OnTop" && (
                  <>
                    <div>
                      <label
                        htmlFor="percentage"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Base Percentage (%)
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
                    <div>
                      <label
                        htmlFor="thresholdVolume"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Threshold Volume
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">$</span>
                        </div>
                        <input
                          type="number"
                          id="thresholdVolume"
                          name="thresholdVolume"
                          className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm pl-7"
                          defaultValue={
                            currentIncentive?.thresholdVolume ||
                            currentIncentive?.minVolume ||
                            ""
                          }
                          placeholder="0.00"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="additionalPercentage"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Additional Percentage for Excess (%)
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <input
                          type="number"
                          id="additionalPercentage"
                          name="additionalPercentage"
                          step="0.01"
                          min="0"
                          max="100"
                          className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm pr-12"
                          defaultValue={
                            currentIncentive?.additionalPercentage || ""
                          }
                          required
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">%</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {selectedIncentiveType === "Scale" && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Threshold Tiers
                    </label>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-3">
                      <p className="text-sm text-gray-600 mb-3">
                        Add investment thresholds and corresponding commission
                        rates for Volume/Scale based incentives.
                      </p>

                      {tiers.map((tier, index) => (
                        <div
                          key={index}
                          className="grid grid-cols-12 gap-3 mb-3"
                        >
                          <div className="col-span-5">
                            <label className="block text-xs font-medium text-gray-500 mb-1">
                              From
                            </label>
                            <div className="relative rounded-md shadow-sm">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-gray-500 sm:text-sm">
                                  $
                                </span>
                              </div>
                              <input
                                type="number"
                                value={tier.minVolume}
                                onChange={(e) =>
                                  updateTier(index, "minVolume", e.target.value)
                                }
                                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm pl-7"
                                disabled={index > 0} // Solo el primer tier puede tener minVolume editable
                                required
                              />
                            </div>
                          </div>
                          <div className="col-span-5">
                            <label className="block text-xs font-medium text-gray-500 mb-1">
                              To
                            </label>
                            <div className="relative rounded-md shadow-sm">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-gray-500 sm:text-sm">
                                  $
                                </span>
                              </div>
                              <input
                                type="number"
                                value={tier.maxVolume || ""}
                                onChange={(e) =>
                                  updateTier(index, "maxVolume", e.target.value)
                                }
                                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm pl-7"
                                placeholder={
                                  index === tiers.length - 1 ? "No limit" : ""
                                }
                                disabled={index === tiers.length - 1} // El último tier no tiene maxVolume
                              />
                            </div>
                          </div>
                          <div className="col-span-2">
                            <label className="block text-xs font-medium text-gray-500 mb-1">
                              Rate (%)
                            </label>
                            <div className="flex items-center">
                              <input
                                type="number"
                                value={tier.percentage}
                                onChange={(e) =>
                                  updateTier(
                                    index,
                                    "percentage",
                                    e.target.value
                                  )
                                }
                                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                min="0"
                                max="100"
                                step="0.01"
                                required
                              />
                              {tiers.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeTier(index)}
                                  className="ml-2 text-red-600 hover:text-red-800"
                                >
                                  <TrashIcon className="h-5 w-5" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={addTier}
                        className="mt-2 inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <PlusIcon className="h-4 w-4 mr-1" />
                        Add Tier
                      </button>
                    </div>
                  </div>
                )}

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
      )}
    </>
  );
};

export default TradeIncentiveFormModal;
