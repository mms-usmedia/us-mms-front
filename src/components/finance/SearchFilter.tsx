import React, { useState, useEffect, useRef } from "react";
import { Filter, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import PeriodFilter from "./PeriodFilter";
import { RevenueData } from "./RevenueTable";

// Posibles divisiones
type DivisionType = "Online" | "OOH" | "Broadcast" | "Print";

// Posibles tipos de servicio
type ServiceType =
  | "Representación Comercial"
  | "Servicio de Medios (IMB)"
  | "Prefered Ad Services (PAS)"
  | "Clearing House"
  | "Mobile Performance";

// Posibles tipos de compra
type PurchaseType = "IO-Based" | "Programmatic";

interface SearchFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedDivisions: string[];
  onDivisionsChange: (value: string[]) => void;
  selectedServiceTypes: string[];
  onServiceTypesChange: (value: string[]) => void;
  selectedPurchaseTypes: string[];
  onPurchaseTypesChange: (value: string[]) => void;
  data: RevenueData[];
  onPeriodChange: (period: string) => void;
  modifiedAdUnits: boolean;
  onModifiedAdUnitsChange: (value: boolean) => void;
}

const SearchFilter: React.FC<SearchFilterProps> = ({
  searchTerm,
  onSearchChange,
  selectedDivisions,
  onDivisionsChange,
  selectedServiceTypes,
  onServiceTypesChange,
  selectedPurchaseTypes,
  onPurchaseTypesChange,
  data,
  onPeriodChange,
  modifiedAdUnits,
  onModifiedAdUnitsChange,
}) => {
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [selectedAccount, setSelectedAccount] = useState<string>("");
  const [selectedAdvertiser, setSelectedAdvertiser] = useState<string>("");
  const [selectedPublisher, setSelectedPublisher] = useState<string>("");

  // Extract unique values from data
  const [accounts, setAccounts] = useState<string[]>([]);
  const [advertisers, setAdvertisers] = useState<string[]>([]);
  const [publishers, setPublishers] = useState<string[]>([]);

  // Estados para la búsqueda en dropdowns
  const [filteredAccounts, setFilteredAccounts] = useState<string[]>([]);
  const [filteredAdvertisers, setFilteredAdvertisers] = useState<string[]>([]);
  const [filteredPublishers, setFilteredPublishers] = useState<string[]>([]);

  // Initialize unique values when component mounts or data changes
  useEffect(() => {
    // Get unique values
    const uniqueAccounts = Array.from(
      new Set(data.map((item) => item.account))
    ).sort();

    const uniqueAdvertisers = Array.from(
      new Set(data.map((item) => item.advertiser))
    ).sort();

    const uniquePublishers = Array.from(
      new Set(data.map((item) => item.publisher))
    ).sort();

    setAccounts(uniqueAccounts);
    setFilteredAccounts(uniqueAccounts);
    setAdvertisers(uniqueAdvertisers);
    setFilteredAdvertisers(uniqueAdvertisers);
    setPublishers(uniquePublishers);
    setFilteredPublishers(uniquePublishers);
  }, [data]);

  // Division options
  const divisionOptions: DivisionType[] = [
    "Online",
    "OOH",
    "Broadcast",
    "Print",
  ];

  // Service type options
  const serviceTypeOptions: ServiceType[] = [
    "Representación Comercial",
    "Servicio de Medios (IMB)",
    "Prefered Ad Services (PAS)",
    "Clearing House",
    "Mobile Performance",
  ];

  // Purchase type options
  const purchaseTypeOptions: PurchaseType[] = ["IO-Based", "Programmatic"];

  // Function to toggle division selection
  const toggleDivision = (division: DivisionType) => {
    if (selectedDivisions.includes(division)) {
      onDivisionsChange(selectedDivisions.filter((d) => d !== division));
    } else {
      onDivisionsChange([...selectedDivisions, division]);
    }
  };

  // Function to toggle service type selection
  const toggleServiceType = (serviceType: ServiceType) => {
    if (selectedServiceTypes.includes(serviceType)) {
      onServiceTypesChange(
        selectedServiceTypes.filter((s) => s !== serviceType)
      );
    } else {
      onServiceTypesChange([...selectedServiceTypes, serviceType]);
    }
  };

  // Function to toggle purchase type selection
  const togglePurchaseType = (purchaseType: PurchaseType) => {
    if (selectedPurchaseTypes.includes(purchaseType)) {
      onPurchaseTypesChange(
        selectedPurchaseTypes.filter((p) => p !== purchaseType)
      );
    } else {
      onPurchaseTypesChange([...selectedPurchaseTypes, purchaseType]);
    }
  };

  // Function to clear all filters
  const handleClearFilters = () => {
    onSearchChange("");
    onDivisionsChange([]);
    onServiceTypesChange([]);
    onPurchaseTypesChange([]);
    setSelectedAccount("");
    setSelectedAdvertiser("");
    setSelectedPublisher("");
    onModifiedAdUnitsChange(false);
  };

  // Check if there are any active filters
  const hasActiveFilters =
    searchTerm ||
    selectedDivisions.length > 0 ||
    selectedServiceTypes.length > 0 ||
    selectedPurchaseTypes.length > 0 ||
    selectedAccount ||
    selectedAdvertiser ||
    selectedPublisher ||
    modifiedAdUnits;

  // Get color for division badge
  const getDivisionColor = (division: string) => {
    switch (division) {
      case "Online":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "OOH":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Broadcast":
        return "bg-green-100 text-green-800 border-green-200";
      case "Print":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Get color for service type badge
  const getServiceTypeColor = (serviceType: string) => {
    switch (serviceType) {
      case "Representación Comercial":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Servicio de Medios (IMB)":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "Prefered Ad Services (PAS)":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Clearing House":
        return "bg-green-100 text-green-800 border-green-200";
      case "Mobile Performance":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Get color for purchase type badge
  const getPurchaseTypeColor = (purchaseType: string) => {
    switch (purchaseType) {
      case "IO-Based":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Programmatic":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
      <div className="flex flex-col space-y-4">
        {/* Main search bar and filters button */}
        <div className="flex space-x-2">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm text-gray-900 placeholder-gray-500 bg-gray-50"
              placeholder="Search by campaign, account, advertiser, publisher..."
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center px-3 py-2.5 rounded-lg shadow-sm border ${
              showFilters
                ? "bg-orange-50 text-orange-700 border-orange-200"
                : "bg-white text-orange-600 border-gray-200 hover:bg-gray-50"
            }`}
          >
            <Filter className="h-5 w-5 mr-1" fill="currentColor" />
            Filters
            {hasActiveFilters && (
              <span className="ml-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-orange-100 text-xs font-medium text-orange-800">
                {(searchTerm ? 1 : 0) +
                  (selectedDivisions.length > 0 ? 1 : 0) +
                  (selectedServiceTypes.length > 0 ? 1 : 0) +
                  (selectedPurchaseTypes.length > 0 ? 1 : 0) +
                  (selectedAccount ? 1 : 0) +
                  (selectedAdvertiser ? 1 : 0) +
                  (selectedPublisher ? 1 : 0) +
                  (modifiedAdUnits ? 1 : 0)}
              </span>
            )}
          </button>

          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              type="button"
              className="flex items-center px-3 py-2.5 rounded-lg border border-gray-200 shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Clear
            </button>
          )}
        </div>

        {/* Advanced filters (hidden by default) */}
        {showFilters && (
          <div className="pt-4 border-t border-gray-100 mt-2">
            {/* Tres columnas principales para todos los filtros */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Columna 1: Filtros básicos */}
              <div className="space-y-4">
                {/* Period filter */}
                <div>
                  <label
                    htmlFor="period-filter"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Period
                  </label>
                  <PeriodFilter onPeriodChange={onPeriodChange} />
                </div>

                {/* Filter by account */}
                <div className="relative">
                  <label
                    htmlFor="account-filter"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Account
                  </label>
                  <div className="relative">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-between"
                        >
                          {selectedAccount || "All Accounts"}
                          <ChevronDown className="h-4 w-4 opacity-50" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        className="w-full"
                        style={{
                          width: "var(--radix-dropdown-menu-trigger-width)",
                        }}
                      >
                        <div className="p-2">
                          <Input
                            placeholder="Search accounts..."
                            className="mb-2"
                            onChange={(e) => {
                              const searchValue = e.target.value.toLowerCase();
                              setFilteredAccounts(
                                accounts.filter((account) =>
                                  account.toLowerCase().includes(searchValue)
                                )
                              );
                            }}
                          />
                          <div className="max-h-[200px] overflow-y-auto">
                            <DropdownMenuItem
                              onSelect={() => setSelectedAccount("")}
                            >
                              All Accounts
                            </DropdownMenuItem>
                            {filteredAccounts.map((account) => (
                              <DropdownMenuItem
                                key={account}
                                onSelect={() => setSelectedAccount(account)}
                              >
                                {account}
                              </DropdownMenuItem>
                            ))}
                          </div>
                        </div>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Filter by purchase type */}
                <div>
                  <label
                    htmlFor="purchase-type-filter"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Purchase Type
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {purchaseTypeOptions.map((purchaseType) => (
                      <div
                        key={purchaseType}
                        className={`cursor-pointer rounded-md px-3 py-1.5 text-sm border ${
                          selectedPurchaseTypes.includes(purchaseType)
                            ? getPurchaseTypeColor(purchaseType)
                            : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                        }`}
                        onClick={() => togglePurchaseType(purchaseType)}
                      >
                        {purchaseType}
                        {selectedPurchaseTypes.includes(purchaseType) && (
                          <span className="ml-1.5 inline-block">✓</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Flags */}
                <div>
                  <label
                    htmlFor="modified-ad-units"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Flags
                  </label>
                  <div className="flex items-center">
                    <input
                      id="modified-ad-units"
                      type="checkbox"
                      checked={modifiedAdUnits}
                      onChange={(e) =>
                        onModifiedAdUnitsChange(e.target.checked)
                      }
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="modified-ad-units"
                      className="ml-2 text-sm text-gray-700"
                    >
                      Modified Ad Units
                    </label>
                  </div>
                </div>
              </div>

              {/* Columna 2: Filtros intermedios */}
              <div className="space-y-4">
                {/* Filter by advertiser */}
                <div className="relative">
                  <label
                    htmlFor="advertiser-filter"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Advertiser
                  </label>
                  <div className="relative">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-between"
                        >
                          {selectedAdvertiser || "All Advertisers"}
                          <ChevronDown className="h-4 w-4 opacity-50" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        className="w-full"
                        style={{
                          width: "var(--radix-dropdown-menu-trigger-width)",
                        }}
                      >
                        <div className="p-2">
                          <Input
                            placeholder="Search advertisers..."
                            className="mb-2"
                            onChange={(e) => {
                              const searchValue = e.target.value.toLowerCase();
                              setFilteredAdvertisers(
                                advertisers.filter((advertiser) =>
                                  advertiser.toLowerCase().includes(searchValue)
                                )
                              );
                            }}
                          />
                          <div className="max-h-[200px] overflow-y-auto">
                            <DropdownMenuItem
                              onSelect={() => setSelectedAdvertiser("")}
                            >
                              All Advertisers
                            </DropdownMenuItem>
                            {filteredAdvertisers.map((advertiser) => (
                              <DropdownMenuItem
                                key={advertiser}
                                onSelect={() =>
                                  setSelectedAdvertiser(advertiser)
                                }
                              >
                                {advertiser}
                              </DropdownMenuItem>
                            ))}
                          </div>
                        </div>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Filter by division */}
                <div>
                  <label
                    htmlFor="division-filter"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Division
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {divisionOptions.map((division) => (
                      <div
                        key={division}
                        className={`cursor-pointer rounded-md px-3 py-1.5 text-sm border ${
                          selectedDivisions.includes(division)
                            ? getDivisionColor(division)
                            : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                        }`}
                        onClick={() => toggleDivision(division)}
                      >
                        {division}
                        {selectedDivisions.includes(division) && (
                          <span className="ml-1.5 inline-block">✓</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Columna 3: Filtros adicionales */}
              <div className="space-y-4">
                {/* Filter by publisher */}
                <div className="relative">
                  <label
                    htmlFor="publisher-filter"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Publisher
                  </label>
                  <div className="relative">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-between"
                        >
                          {selectedPublisher || "All Publishers"}
                          <ChevronDown className="h-4 w-4 opacity-50" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        className="w-full"
                        style={{
                          width: "var(--radix-dropdown-menu-trigger-width)",
                        }}
                      >
                        <div className="p-2">
                          <Input
                            placeholder="Search publishers..."
                            className="mb-2"
                            onChange={(e) => {
                              const searchValue = e.target.value.toLowerCase();
                              setFilteredPublishers(
                                publishers.filter((publisher) =>
                                  publisher.toLowerCase().includes(searchValue)
                                )
                              );
                            }}
                          />
                          <div className="max-h-[200px] overflow-y-auto">
                            <DropdownMenuItem
                              onSelect={() => setSelectedPublisher("")}
                            >
                              All Publishers
                            </DropdownMenuItem>
                            {filteredPublishers.map((publisher) => (
                              <DropdownMenuItem
                                key={publisher}
                                onSelect={() => setSelectedPublisher(publisher)}
                              >
                                {publisher}
                              </DropdownMenuItem>
                            ))}
                          </div>
                        </div>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Filter by service type */}
                <div>
                  <label
                    htmlFor="service-type-filter"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Service Type
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {serviceTypeOptions.map((serviceType) => (
                      <div
                        key={serviceType}
                        className={`cursor-pointer rounded-md px-3 py-1.5 text-sm border ${
                          selectedServiceTypes.includes(serviceType)
                            ? getServiceTypeColor(serviceType)
                            : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                        }`}
                        onClick={() => toggleServiceType(serviceType)}
                      >
                        {serviceType}
                        {selectedServiceTypes.includes(serviceType) && (
                          <span className="ml-1.5 inline-block">✓</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchFilter;
