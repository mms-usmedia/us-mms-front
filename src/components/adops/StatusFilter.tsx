import React from "react";
import MultiSelectFilter from "./MultiSelectFilter";

interface StatusFilterProps {
  selectedStatuses: string[];
  setSelectedStatuses: (statuses: string[]) => void;
}

const StatusFilter: React.FC<StatusFilterProps> = ({
  selectedStatuses,
  setSelectedStatuses,
}) => {
  // Status options
  const statusOptions = [
    { value: "Active", label: "Active" },
    { value: "Paused", label: "Paused" },
    { value: "Completed", label: "Completed" },
    { value: "Draft", label: "Draft" },
  ];

  // Get status tag styles
  const getStatusStyles = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-50 text-green-700 border-green-100";
      case "Paused":
        return "bg-purple-50 text-purple-700 border-purple-100";
      case "Completed":
        return "bg-blue-50 text-blue-700 border-blue-100";
      case "Draft":
        return "bg-gray-50 text-gray-700 border-gray-100";
      default:
        return "bg-gray-50 text-gray-700 border-gray-100";
    }
  };

  return (
    <MultiSelectFilter
      options={statusOptions}
      selectedValues={selectedStatuses}
      onChange={setSelectedStatuses}
      placeholder="Select statuses..."
      label="Campaign Status"
      getOptionStyle={getStatusStyles}
    />
  );
};

export default StatusFilter;
