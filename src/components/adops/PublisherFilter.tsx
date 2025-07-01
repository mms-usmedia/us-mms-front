import React from "react";
import MultiSelectFilter from "./MultiSelectFilter";

interface PublisherFilterProps {
  selectedPublishers: string[];
  setSelectedPublishers: (publishers: string[]) => void;
}

const PublisherFilter: React.FC<PublisherFilterProps> = ({
  selectedPublishers,
  setSelectedPublishers,
}) => {
  // Publisher options
  const publisherOptions = [
    { value: "Facebook", label: "Facebook" },
    { value: "YouTube", label: "YouTube" },
    { value: "Google Ads", label: "Google Ads" },
    { value: "Instagram", label: "Instagram" },
    { value: "TikTok", label: "TikTok" },
    { value: "Spotify", label: "Spotify" },
  ];

  // Get publisher tag styles
  const getPublisherStyles = (publisher: string) => {
    switch (publisher.toLowerCase()) {
      case "facebook":
        return "bg-blue-50 text-blue-700 border-blue-100";
      case "youtube":
        return "bg-red-50 text-red-700 border-red-100";
      case "google ads":
        return "bg-yellow-50 text-yellow-700 border-yellow-100";
      case "instagram":
        return "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-100";
      case "tiktok":
        return "bg-slate-100 text-slate-800 border-slate-200";
      case "spotify":
        return "bg-green-50 text-green-700 border-green-100";
      default:
        return "bg-purple-50 text-purple-700 border-purple-100";
    }
  };

  return (
    <MultiSelectFilter
      options={publisherOptions}
      selectedValues={selectedPublishers}
      onChange={setSelectedPublishers}
      placeholder="Select publishers..."
      label="Publisher/Platform"
      getOptionStyle={getPublisherStyles}
    />
  );
};

export default PublisherFilter;
