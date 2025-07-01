import React from "react";
import MultiSelectFilter from "./MultiSelectFilter";

interface TraffickerFilterProps {
  selectedTraffickers: string[];
  setSelectedTraffickers: (traffickers: string[]) => void;
}

const TraffickerFilter: React.FC<TraffickerFilterProps> = ({
  selectedTraffickers,
  setSelectedTraffickers,
}) => {
  // Trafficker options - estos serían dinámicos en una implementación real
  const traffickerOptions = [
    { value: "Ana García", label: "Ana García" },
    { value: "Roberto Sánchez", label: "Roberto Sánchez" },
    { value: "Pedro Gómez", label: "Pedro Gómez" },
    { value: "Laura Martínez", label: "Laura Martínez" },
    { value: "Carlos Rodríguez", label: "Carlos Rodríguez" },
  ];

  // Get trafficker tag styles - basado en la primera letra
  const getTraffickerStyles = (trafficker: string) => {
    const firstLetter = trafficker.charAt(0).toLowerCase();

    switch (true) {
      case /[a-c]/.test(firstLetter):
        return "bg-blue-50 text-blue-700 border-blue-100";
      case /[d-g]/.test(firstLetter):
        return "bg-purple-50 text-purple-700 border-purple-100";
      case /[h-l]/.test(firstLetter):
        return "bg-pink-50 text-pink-700 border-pink-100";
      case /[m-p]/.test(firstLetter):
        return "bg-amber-50 text-amber-700 border-amber-100";
      case /[q-t]/.test(firstLetter):
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case /[u-z]/.test(firstLetter):
        return "bg-indigo-50 text-indigo-700 border-indigo-100";
      default:
        return "bg-gray-50 text-gray-700 border-gray-100";
    }
  };

  return (
    <MultiSelectFilter
      options={traffickerOptions}
      selectedValues={selectedTraffickers}
      onChange={setSelectedTraffickers}
      placeholder="Select traffickers..."
      label="Trafficker"
      getOptionStyle={getTraffickerStyles}
    />
  );
};

export default TraffickerFilter;
