import React, { useState, useRef, useEffect } from "react";

interface Option {
  value: string;
  label: string;
  color?: string;
}

interface MultiSelectFilterProps {
  options: Option[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  placeholder: string;
  label: string;
  getOptionStyle?: (value: string) => string;
}

const MultiSelectFilter: React.FC<MultiSelectFilterProps> = ({
  options,
  selectedValues,
  onChange,
  placeholder,
  label,
  getOptionStyle,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleOption = (value: string) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter((v) => v !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  const getDefaultStyle = (value: string) => {
    return selectedValues.includes(value)
      ? "bg-orange-50 text-orange-700 border-orange-100"
      : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50";
  };

  const getStyleForOption = (value: string) => {
    if (!selectedValues.includes(value)) {
      return "bg-white text-gray-700 border-gray-200 hover:bg-gray-50";
    }
    return getOptionStyle ? getOptionStyle(value) : getDefaultStyle(value);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div
        className="flex justify-between items-center px-3 py-2 border border-gray-200 rounded-lg shadow-sm cursor-pointer bg-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex-1 text-sm text-gray-700 truncate">
          {selectedValues.length > 0
            ? `${selectedValues.length} selected`
            : placeholder}
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-5 w-5 text-gray-400 transition-transform ${
            isOpen ? "transform rotate-180" : ""
          }`}
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

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
          <div className="p-2 space-y-1">
            {options.map((option) => (
              <div
                key={option.value}
                onClick={() => toggleOption(option.value)}
                className={`cursor-pointer rounded-md px-3 py-2 text-sm border flex justify-between items-center ${getStyleForOption(
                  option.value
                )}`}
              >
                <span>{option.label}</span>
                {selectedValues.includes(option.value) && (
                  <span className="text-sm">✓</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedValues.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {selectedValues.map((value) => {
            const option = options.find((o) => o.value === value);
            return (
              <div
                key={value}
                className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                  getOptionStyle
                    ? getOptionStyle(value)
                    : getDefaultStyle(value)
                }`}
              >
                {option?.label}
                <button
                  type="button"
                  className="ml-1 focus:outline-none"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleOption(value);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3"
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
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MultiSelectFilter;
