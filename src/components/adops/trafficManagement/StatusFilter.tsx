import React from "react";

interface StatusOption {
  value: string;
  label: string;
}

interface StatusFilterProps {
  options: StatusOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  label?: string;
}

const StatusFilter: React.FC<StatusFilterProps> = ({
  options,
  selectedValues,
  onChange,
  label = "Status",
}) => {
  const toggleOption = (value: string) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter((v) => v !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  // Get status badge styles
  const getStatusBadgeStyles = (status: string, isSelected: boolean) => {
    if (!isSelected) {
      return "border-gray-200 bg-white text-gray-700 hover:bg-gray-50";
    }

    switch (status) {
      case "Materials Send":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Material Received":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "Implementing":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "Live":
        return "bg-green-100 text-green-800 border-green-200";
      case "Delivery":
        return "bg-cyan-100 text-cyan-800 border-cyan-200";
      case "Closed":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {options.map((option) => (
          <div
            key={option.value}
            className={`cursor-pointer rounded-md px-3 py-1.5 text-sm border ${getStatusBadgeStyles(
              option.value,
              selectedValues.includes(option.value)
            )}`}
            onClick={() => toggleOption(option.value)}
          >
            {option.label}
            {selectedValues.includes(option.value) && (
              <span className="ml-1.5 inline-block">✓</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatusFilter;
