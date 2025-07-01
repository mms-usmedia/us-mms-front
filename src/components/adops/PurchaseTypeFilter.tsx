import React from "react";
import MultiSelectFilter from "./MultiSelectFilter";

interface PurchaseTypeFilterProps {
  selectedPurchaseTypes: string[];
  setSelectedPurchaseTypes: (types: string[]) => void;
}

const PurchaseTypeFilter: React.FC<PurchaseTypeFilterProps> = ({
  selectedPurchaseTypes,
  setSelectedPurchaseTypes,
}) => {
  // Purchase type options
  const purchaseTypeOptions = [
    { value: "CPM", label: "CPM" },
    { value: "CPV", label: "CPV" },
    { value: "CPE", label: "CPE" },
    { value: "CPL", label: "CPL" },
  ];

  // Get purchase type tag styles
  const getPurchaseTypeStyles = (purchaseType: string) => {
    switch (purchaseType) {
      case "CPM":
        return "bg-blue-50 text-blue-700 border-blue-100";
      case "CPV":
        return "bg-purple-50 text-purple-700 border-purple-100";
      case "CPE":
        return "bg-pink-50 text-pink-700 border-pink-100";
      case "CPL":
        return "bg-amber-50 text-amber-700 border-amber-100";
      default:
        return "bg-gray-50 text-gray-700 border-gray-100";
    }
  };

  return (
    <MultiSelectFilter
      options={purchaseTypeOptions}
      selectedValues={selectedPurchaseTypes}
      onChange={setSelectedPurchaseTypes}
      placeholder="Select purchase types..."
      label="Purchase Type"
      getOptionStyle={getPurchaseTypeStyles}
    />
  );
};

export default PurchaseTypeFilter;
