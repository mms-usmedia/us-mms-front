import React from "react";
import MultiSelectFilter from "./MultiSelectFilter";

interface ProductTypeFilterProps {
  selectedProducts: string[];
  setSelectedProducts: (products: string[]) => void;
}

const ProductTypeFilter: React.FC<ProductTypeFilterProps> = ({
  selectedProducts,
  setSelectedProducts,
}) => {
  // Product options
  const productOptions = [
    { value: "PAS", label: "PAS" },
    { value: "Fandom", label: "Fandom" },
    { value: "Sojern", label: "Sojern" },
    { value: "WeTransfer", label: "WeTransfer" },
    { value: "Tinder", label: "Tinder" },
    { value: "Vevo", label: "Vevo" },
    { value: "Magnite", label: "Magnite" },
    { value: "OneFootball", label: "OneFootball" },
  ];

  // Get product type tag styles
  const getProductStyles = (product: string) => {
    switch (product) {
      case "PAS":
        return "bg-blue-50 text-blue-700 border-blue-100";
      case "Fandom":
        return "bg-purple-50 text-purple-700 border-purple-100";
      case "Sojern":
        return "bg-pink-50 text-pink-700 border-pink-100";
      case "WeTransfer":
        return "bg-amber-50 text-amber-700 border-amber-100";
      case "Tinder":
        return "bg-red-50 text-red-700 border-red-100";
      case "Vevo":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "Magnite":
        return "bg-indigo-50 text-indigo-700 border-indigo-100";
      case "OneFootball":
        return "bg-cyan-50 text-cyan-700 border-cyan-100";
      default:
        return "bg-gray-50 text-gray-700 border-gray-100";
    }
  };

  return (
    <MultiSelectFilter
      options={productOptions}
      selectedValues={selectedProducts}
      onChange={setSelectedProducts}
      placeholder="Select products..."
      label="Product Type"
      getOptionStyle={getProductStyles}
    />
  );
};

export default ProductTypeFilter;
