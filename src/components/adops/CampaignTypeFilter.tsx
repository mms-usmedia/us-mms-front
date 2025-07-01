import React from "react";
import MultiSelectFilter from "./MultiSelectFilter";

interface CampaignTypeFilterProps {
  selectedCampaignTypes: string[];
  setSelectedCampaignTypes: (types: string[]) => void;
}

const CampaignTypeFilter: React.FC<CampaignTypeFilterProps> = ({
  selectedCampaignTypes,
  setSelectedCampaignTypes,
}) => {
  // Campaign type options
  const campaignTypeOptions = [
    { value: "Branding", label: "Branding" },
    { value: "Performance", label: "Performance" },
    { value: "Promotional", label: "Promotional" },
    { value: "Awareness", label: "Awareness" },
    { value: "Engagement", label: "Engagement" },
    { value: "Seasonal", label: "Seasonal" },
    { value: "Launch", label: "Launch" },
  ];

  // Get campaign type tag styles
  const getCampaignTypeStyles = (campaignType: string) => {
    switch (campaignType) {
      case "Branding":
        return "bg-blue-50 text-blue-700 border-blue-100";
      case "Performance":
        return "bg-purple-50 text-purple-700 border-purple-100";
      case "Promotional":
        return "bg-pink-50 text-pink-700 border-pink-100";
      case "Awareness":
        return "bg-amber-50 text-amber-700 border-amber-100";
      case "Engagement":
        return "bg-red-50 text-red-700 border-red-100";
      case "Seasonal":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "Launch":
        return "bg-indigo-50 text-indigo-700 border-indigo-100";
      default:
        return "bg-gray-50 text-gray-700 border-gray-100";
    }
  };

  return (
    <MultiSelectFilter
      options={campaignTypeOptions}
      selectedValues={selectedCampaignTypes}
      onChange={setSelectedCampaignTypes}
      placeholder="Select campaign types..."
      label="Campaign Type"
      getOptionStyle={getCampaignTypeStyles}
    />
  );
};

export default CampaignTypeFilter;
