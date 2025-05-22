import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";

// Define the interface for a Publisher Rate
interface PublisherRate {
  id?: string;
  publisher: string;
  channel: string;
  format: string;
  size: string;
  commercialModel: string;
  openRate: number;
  isActive: boolean;
}

interface PublisherRateFormProps {
  onSave: (rate: PublisherRate) => void;
  onCancel: () => void;
  initialData?: PublisherRate;
  publisherName?: string;
}

const PublisherRateForm: React.FC<PublisherRateFormProps> = ({
  onSave,
  onCancel,
  initialData,
  publisherName,
}) => {
  const [formData, setFormData] = useState<PublisherRate>(
    initialData || {
      publisher: publisherName || "",
      channel: "",
      format: "",
      size: "",
      commercialModel: "",
      openRate: 0,
      isActive: true,
    }
  );

  // Estado para mostrar el input de nuevo canal
  const [showNewChannelInput, setShowNewChannelInput] = useState(false);
  const [newChannel, setNewChannel] = useState("");

  // Listas de opciones para los diferentes campos
  const [channelOptions, setChannelOptions] = useState([
    "Display",
    "Video",
    "Audio",
    "Social",
    "Search",
    "Email",
  ]);

  const formatOptions = [
    "Banner",
    "Native",
    "Interstitial",
    "Overlay",
    "Preroll",
    "Midroll",
    "Postroll",
    "Sponsored Content",
  ];

  const sizeOptions = [
    // Display sizes (estándar IAB)
    "300x250",
    "336x280",
    "728x90",
    "970x90",
    "970x250",
    "300x600",
    "320x50",
    "320x100",
    // Video durations
    "15s",
    "30s",
    "60s",
    "6s",
    // Audio durations
    "Audio 15s",
    "Audio 30s",
    "Audio 60s",
    // Otros
    "Custom",
  ];

  const commercialModelOptions = [
    "CPM",
    "CPC",
    "CPV",
    "CPCV",
    "CPL",
    "CPA",
    "Flat Fee",
  ];

  const handleChange = (
    field: keyof PublisherRate,
    value: string | number | boolean
  ) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleAddNewChannel = () => {
    if (newChannel.trim() !== "" && !channelOptions.includes(newChannel)) {
      const updatedChannels = [...channelOptions, newChannel];
      setChannelOptions(updatedChannels);
      handleChange("channel", newChannel);
      setNewChannel("");
      setShowNewChannelInput(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Formulario de PublisherRate enviado", formData);

    // Si no hay un ID, genera uno
    if (!formData.id) {
      const newRate = {
        ...formData,
        id: `rate-${Date.now()}`,
        isActive: true,
      };
      onSave(newRate);
    } else {
      onSave(formData);
    }
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden border border-indigo-100">
      <div className="bg-gradient-to-r from-indigo-500 to-indigo-700 p-4 text-white">
        <h2 className="text-xl font-medium">Add New Rate</h2>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Channel field */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Channel<span className="text-red-500">*</span>
            </label>

            {showNewChannelInput ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newChannel}
                  onChange={(e) => setNewChannel(e.target.value)}
                  placeholder="Enter new channel name"
                  className="w-full px-3 py-2 border-2 border-indigo-100 focus:border-indigo-300 rounded-md focus:outline-none focus:ring-0 text-black bg-white"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={handleAddNewChannel}
                  className="px-3 py-2 bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white rounded-md text-sm font-medium transition-colors shadow-sm"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewChannelInput(false)}
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <select
                  value={formData.channel}
                  onChange={(e) => handleChange("channel", e.target.value)}
                  className="w-full px-3 py-2 border-2 border-indigo-100 focus:border-indigo-300 rounded-md focus:outline-none focus:ring-0 text-black bg-white"
                  required
                >
                  <option value="" className="text-black">
                    Select Channel
                  </option>
                  {channelOptions.map((option) => (
                    <option key={option} value={option} className="text-black">
                      {option}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowNewChannelInput(true)}
                  className="px-2 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-md text-sm font-medium transition-colors inline-flex items-center"
                  title="Add new channel"
                >
                  <FaPlus className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* Format field */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Format<span className="text-red-500">*</span>
            </label>
            <select
              value={formData.format}
              onChange={(e) => handleChange("format", e.target.value)}
              className="w-full px-3 py-2 border-2 border-indigo-100 focus:border-indigo-300 rounded-md focus:outline-none focus:ring-0 text-black bg-white"
              required
            >
              <option value="" className="text-black">
                Select Format
              </option>
              {formatOptions.map((option) => (
                <option key={option} value={option} className="text-black">
                  {option}
                </option>
              ))}
            </select>
          </div>

          {/* Size field */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Size<span className="text-red-500">*</span>
            </label>
            <select
              value={formData.size}
              onChange={(e) => handleChange("size", e.target.value)}
              className="w-full px-3 py-2 border-2 border-indigo-100 focus:border-indigo-300 rounded-md focus:outline-none focus:ring-0 text-black bg-white"
              required
            >
              <option value="" className="text-black">
                Select Size
              </option>
              {sizeOptions.map((option) => (
                <option key={option} value={option} className="text-black">
                  {option}
                </option>
              ))}
            </select>
            {formData.size === "Custom" && (
              <input
                type="text"
                placeholder="Enter custom size (e.g., 240x400, 120s)"
                className="mt-2 w-full px-3 py-2 border-2 border-indigo-100 focus:border-indigo-300 rounded-md focus:outline-none focus:ring-0 text-black bg-white"
                onChange={(e) => handleChange("size", e.target.value)}
              />
            )}
          </div>

          {/* Commercial Model field */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Commercial Model<span className="text-red-500">*</span>
            </label>
            <select
              value={formData.commercialModel}
              onChange={(e) => handleChange("commercialModel", e.target.value)}
              className="w-full px-3 py-2 border-2 border-indigo-100 focus:border-indigo-300 rounded-md focus:outline-none focus:ring-0 text-black bg-white"
              required
            >
              <option value="" className="text-black">
                Select Commercial Model
              </option>
              {commercialModelOptions.map((option) => (
                <option key={option} value={option} className="text-black">
                  {option}
                </option>
              ))}
            </select>
          </div>

          {/* Open Rate field */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Open Rate<span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.openRate}
              onChange={(e) =>
                handleChange("openRate", parseFloat(e.target.value) || 0)
              }
              className="w-full px-3 py-2 border-2 border-indigo-100 focus:border-indigo-300 rounded-md focus:outline-none focus:ring-0 text-black bg-white"
              required
            />
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-end gap-4 mt-8 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-indigo-700 hover:from-indigo-600 hover:to-indigo-800 text-white rounded-md text-sm font-medium transition-colors shadow-sm"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default PublisherRateForm;
