import React, { useState, useEffect, useRef } from "react";
import TrafficTable from "./TrafficTable";
import TrafficStatsCards from "./TrafficStatsCards";
import SearchFilter from "./SearchFilter";
import CampaignDetailsModal from "./CampaignDetailsModal";
import { TrafficCampaign, mockTrafficCampaigns } from "./mockData";
import MultiSelectFilter from "@/components/adops/MultiSelectFilter";
import StatusFilter from "./StatusFilter";

const TrafficManagement: React.FC = () => {
  const [campaigns, setCampaigns] =
    useState<TrafficCampaign[]>(mockTrafficCampaigns);
  const [filteredCampaigns, setFilteredCampaigns] =
    useState<TrafficCampaign[]>(mockTrafficCampaigns);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedCampaign, setSelectedCampaign] =
    useState<TrafficCampaign | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);
  const [selectedPublishers, setSelectedPublishers] = useState<string[]>([]);
  const [publisherSearchTerm, setPublisherSearchTerm] = useState("");
  const [showPublisherDropdown, setShowPublisherDropdown] = useState(false);
  const publisherDropdownRef = useRef<HTMLDivElement>(null);

  // Filter campaigns based on search term and selected statuses
  useEffect(() => {
    let result = campaigns;

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (campaign) =>
          campaign.name.toLowerCase().includes(term) ||
          campaign.campaignId.toLowerCase().includes(term) ||
          campaign.publisher.name.toLowerCase().includes(term) ||
          campaign.advertiser.name.toLowerCase().includes(term)
      );
    }

    // Filter by status
    if (selectedStatuses.length > 0) {
      result = result.filter((campaign) =>
        selectedStatuses.includes(campaign.status)
      );
    }

    // Filter by priority
    if (selectedPriorities.length > 0) {
      result = result.filter((campaign) =>
        selectedPriorities.includes(campaign.priority)
      );
    }

    // Filter by publisher
    if (selectedPublishers.length > 0) {
      result = result.filter((campaign) =>
        selectedPublishers.includes(campaign.publisher.name)
      );
    }

    setFilteredCampaigns(result);
  }, [
    campaigns,
    searchTerm,
    selectedStatuses,
    selectedPriorities,
    selectedPublishers,
  ]);

  // Handle search change
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  // Handle filter button click
  const handleFilterClick = () => {
    setShowFilters(!showFilters);
  };

  // Handle priority filter change
  const handlePriorityChange = (priority: string) => {
    if (selectedPriorities.includes(priority)) {
      setSelectedPriorities(selectedPriorities.filter((p) => p !== priority));
    } else {
      setSelectedPriorities([...selectedPriorities, priority]);
    }
  };

  // Handle status filter change
  const handleStatusChange = (statuses: string[]) => {
    setSelectedStatuses(statuses);
  };

  // Handle publisher filter change
  const handlePublisherChange = (publishers: string[]) => {
    setSelectedPublishers(publishers);
  };

  // Handle clear filters
  const handleClearFilters = () => {
    setSelectedPriorities([]);
    setSelectedPublishers([]);
    setSelectedStatuses([]);
    setSearchTerm("");
  };

  // Handle view campaign details
  const handleViewCampaign = (campaign: TrafficCampaign) => {
    setSelectedCampaign(campaign);
  };

  // Handle close campaign details modal
  const handleCloseModal = () => {
    setSelectedCampaign(null);
  };

  // Handle campaign status change
  const handleCampaignStatusChange = (
    campaignId: string,
    newStatus: string
  ) => {
    const updatedCampaigns = campaigns.map((campaign) => {
      if (campaign.id === campaignId) {
        return {
          ...campaign,
          status: newStatus as TrafficCampaign["status"],
        };
      }
      return campaign;
    });

    setCampaigns(updatedCampaigns);
    setSelectedCampaign(null);
  };

  // Create status options for StatusFilter (ordered)
  const statusOptions = [
    { value: "Materials Send", label: "Materials Send" },
    { value: "Material Received", label: "Material Received" },
    { value: "Implementing", label: "Implementing" },
    { value: "Live", label: "Live" },
    { value: "Delivery", label: "Delivery" },
    { value: "Closed", label: "Closed" },
  ];

  // Extract unique publishers
  const uniquePublishers = Array.from(
    new Set(campaigns.map((campaign) => campaign.publisher.name))
  ).sort();

  // Create publisher options for MultiSelectFilter
  const publisherOptions = uniquePublishers.map((publisher) => ({
    value: publisher,
    label: publisher,
  }));

  // Check if there are active filters
  const hasActiveFilters =
    searchTerm ||
    selectedPriorities.length > 0 ||
    selectedPublishers.length > 0 ||
    selectedStatuses.length > 0;

  // Count active filters
  const activeFiltersCount =
    (searchTerm ? 1 : 0) +
    selectedPriorities.length +
    selectedPublishers.length +
    selectedStatuses.length;

  // Get priority badge style
  const getPriorityBadgeStyle = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-50 text-red-700 border-red-100";
      case "Medium":
        return "bg-orange-50 text-orange-700 border-orange-100";
      case "Low":
        return "bg-green-50 text-green-700 border-green-100";
      default:
        return "bg-gray-50 text-gray-700 border-gray-100";
    }
  };

  return (
    <div>
      {/* Stats Cards */}
      <TrafficStatsCards data={campaigns} />

      {/* Search and Filters */}
      <div className="mb-6">
        <SearchFilter
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          onFilterClick={handleFilterClick}
          showFilters={showFilters}
          activeFiltersCount={activeFiltersCount}
          onClearFilters={hasActiveFilters ? handleClearFilters : undefined}
        />

        {/* Advanced filters (hidden by default) */}
        {showFilters && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mt-4">
            <div className="grid grid-cols-1 gap-4 pt-2">
              {/* Status filter */}
              <div>
                <StatusFilter
                  options={statusOptions}
                  selectedValues={selectedStatuses}
                  onChange={handleStatusChange}
                  label="Status"
                />
              </div>

              {/* Priority filter */}
              <div>
                <label
                  htmlFor="priority-filter"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Priority
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {["High", "Medium", "Low"].map((priority) => (
                    <div
                      key={priority}
                      className={`cursor-pointer rounded-md px-3 py-1.5 text-sm border ${
                        selectedPriorities.includes(priority)
                          ? getPriorityBadgeStyle(priority)
                          : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                      onClick={() => handlePriorityChange(priority)}
                    >
                      {priority}
                      {selectedPriorities.includes(priority) && (
                        <span className="ml-1.5 inline-block">✓</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Publisher filter */}
              <div>
                <MultiSelectFilter
                  options={publisherOptions}
                  selectedValues={selectedPublishers}
                  onChange={handlePublisherChange}
                  placeholder="Select publishers"
                  label="Publisher"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Campaign Table */}
      <div className="mb-6">
        <TrafficTable
          data={filteredCampaigns}
          onViewCampaign={handleViewCampaign}
        />
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-gray-500">
          Showing 1 to {filteredCampaigns.length} of {filteredCampaigns.length}{" "}
          results
        </div>
        <div className="flex space-x-2">
          <button className="px-3 py-1 border border-gray-200 rounded-md text-sm text-gray-600 hover:bg-gray-50">
            Previous
          </button>
          <button className="px-3 py-1 border border-gray-200 rounded-md text-sm text-gray-600 hover:bg-gray-50">
            Next
          </button>
        </div>
      </div>

      {/* Campaign Details Modal */}
      {selectedCampaign && (
        <CampaignDetailsModal
          campaign={selectedCampaign}
          onClose={handleCloseModal}
          onStatusChange={handleCampaignStatusChange}
        />
      )}
    </div>
  );
};

export default TrafficManagement;
