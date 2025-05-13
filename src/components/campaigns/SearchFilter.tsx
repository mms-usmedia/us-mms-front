// src/components/campaigns/SearchFilter.tsx
import React, { useState, useEffect, useRef } from "react";

// Tipo para los posibles estados de campaña
type StatusType =
  | "Pending"
  | "Negotiating"
  | "Won"
  | "Approved"
  | "Materials & Creatives OK"
  | "Implementation"
  | "Live"
  | "Closed"
  | "HUR"
  | "Invoiced";

// Tipo para las organizaciones
type OrganizationType =
  | "Agencia"
  | "Advertiser"
  | "Publisher"
  | "Holding Agency"
  | "Holding Advertiser";

// Tipo para las campañas
interface Campaign {
  id: string;
  name: string;
  organizationName: string;
  organizationType: OrganizationType;
  startDate: string;
  endDate: string;
  status: StatusType;
  units: number;
  budget: number;
  grossMargin: number;
}

interface SearchFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedOrganization: string;
  onOrganizationChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (value: string) => void;
  campaigns: Campaign[];
}

const SearchFilter: React.FC<SearchFilterProps> = ({
  searchTerm,
  onSearchChange,
  selectedOrganization,
  onOrganizationChange,
  selectedStatus,
  onStatusChange,
  campaigns,
}) => {
  // Extraer organizaciones únicas de las campañas
  const [organizations, setOrganizations] = useState<string[]>([]);
  const [orgSearchTerm, setOrgSearchTerm] = useState<string>("");
  const [showOrgDropdown, setShowOrgDropdown] = useState<boolean>(false);
  const [filteredOrganizations, setFilteredOrganizations] = useState<string[]>(
    []
  );
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Lista de estados posibles
  const statusOptions: StatusType[] = [
    "Pending",
    "Negotiating",
    "Won",
    "Approved",
    "Materials & Creatives OK",
    "Implementation",
    "Live",
    "Closed",
    "HUR",
    "Invoiced",
  ];

  // Extraer organizaciones únicas
  useEffect(() => {
    const uniqueOrganizations = Array.from(
      new Set(campaigns.map((campaign) => campaign.organizationName))
    ).sort();

    setOrganizations(uniqueOrganizations);
    setFilteredOrganizations(uniqueOrganizations);
  }, [campaigns]);

  // Filtrar organizaciones cuando se escribe en el campo de búsqueda
  useEffect(() => {
    if (orgSearchTerm) {
      const filtered = organizations.filter((org) =>
        org.toLowerCase().includes(orgSearchTerm.toLowerCase())
      );
      setFilteredOrganizations(filtered);
    } else {
      setFilteredOrganizations(organizations);
    }
  }, [orgSearchTerm, organizations]);

  // Cerrar el dropdown cuando se hace clic fuera de él
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowOrgDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Función para limpiar todos los filtros
  const handleClearFilters = () => {
    onSearchChange("");
    onOrganizationChange("");
    onStatusChange("");
    setOrgSearchTerm("");
  };

  // Verificar si hay algún filtro activo
  const hasActiveFilters = searchTerm || selectedOrganization || selectedStatus;

  // Obtener color para badge de estado
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-amber-50 text-amber-700 border-amber-100";
      case "Negotiating":
        return "bg-blue-50 text-blue-700 border-blue-100";
      case "Won":
        return "bg-indigo-50 text-indigo-700 border-indigo-100";
      case "Approved":
        return "bg-green-50 text-green-700 border-green-100";
      case "Materials & Creatives OK":
        return "bg-teal-50 text-teal-700 border-teal-100";
      case "Implementation":
        return "bg-cyan-50 text-cyan-700 border-cyan-100";
      case "Live":
        return "bg-violet-50 text-violet-700 border-violet-100";
      case "Closed":
        return "bg-gray-50 text-gray-700 border-gray-100";
      case "HUR":
        return "bg-rose-50 text-rose-700 border-rose-100";
      case "Invoiced":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      default:
        return "bg-gray-50 text-gray-700 border-gray-100";
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex flex-col space-y-4">
        {/* Barra de búsqueda principal y botón de filtros */}
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
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 placeholder-gray-500 bg-gray-50"
              placeholder="Buscar por nombre, ID o organización..."
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center px-3 py-2.5 rounded-lg shadow-sm border ${
              showFilters
                ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                clipRule="evenodd"
              />
            </svg>
            Filtros
            {hasActiveFilters && (
              <span className="ml-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 text-xs font-medium text-indigo-800">
                {(searchTerm ? 1 : 0) +
                  (selectedOrganization ? 1 : 0) +
                  (selectedStatus ? 1 : 0)}
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
              Limpiar
            </button>
          )}
        </div>

        {/* Filtros avanzados (ocultos por defecto) */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100 mt-2">
            {/* Filtro por organización */}
            <div className="relative" ref={dropdownRef}>
              <label
                htmlFor="organization-search"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Organización
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="organization-search"
                  value={orgSearchTerm}
                  onChange={(e) => {
                    setOrgSearchTerm(e.target.value);
                    setShowOrgDropdown(true);
                    if (e.target.value === "") {
                      onOrganizationChange("");
                    }
                  }}
                  onClick={() => setShowOrgDropdown(true)}
                  className="block w-full py-2.5 px-3 border border-gray-200 bg-gray-50 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 placeholder-gray-500"
                  placeholder="Buscar organización..."
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                  <button
                    type="button"
                    onClick={() => setShowOrgDropdown(!showOrgDropdown)}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Dropdown de organizaciones */}
              {showOrgDropdown && (
                <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-lg overflow-auto border border-gray-200">
                  <ul
                    tabIndex={-1}
                    role="listbox"
                    className="py-1 text-base leading-6 overflow-auto focus:outline-none sm:text-sm sm:leading-5"
                  >
                    {filteredOrganizations.length > 0 ? (
                      filteredOrganizations.map((org) => (
                        <li
                          key={org}
                          role="option"
                          onClick={() => {
                            onOrganizationChange(org);
                            setOrgSearchTerm(org);
                            setShowOrgDropdown(false);
                          }}
                          className={`cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-indigo-50 ${
                            selectedOrganization === org
                              ? "bg-indigo-50 text-indigo-700"
                              : "text-gray-900"
                          }`}
                        >
                          <span className="block truncate">{org}</span>
                          {selectedOrganization === org && (
                            <span className="absolute inset-y-0 right-0 flex items-center pr-4">
                              <svg
                                className="h-5 w-5 text-indigo-600"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </span>
                          )}
                        </li>
                      ))
                    ) : (
                      <li className="cursor-default select-none relative py-2 pl-3 pr-9 text-gray-700">
                        No se encontraron resultados
                      </li>
                    )}
                  </ul>
                </div>
              )}

              {/* Mostrar la organización seleccionada */}
              {selectedOrganization && (
                <div className="mt-2 flex">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-800 border border-indigo-100">
                    {selectedOrganization}
                    <button
                      type="button"
                      onClick={() => {
                        onOrganizationChange("");
                        setOrgSearchTerm("");
                      }}
                      className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-indigo-400 hover:text-indigo-600 focus:outline-none"
                    >
                      <svg
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
                  </span>
                </div>
              )}
            </div>

            {/* Filtro por estado */}
            <div>
              <label
                htmlFor="status-filter"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Estado
              </label>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {statusOptions.map((status) => (
                    <button
                      key={status}
                      onClick={() =>
                        onStatusChange(selectedStatus === status ? "" : status)
                      }
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium shadow-sm border ${
                        selectedStatus === status
                          ? getStatusColor(status)
                          : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                      }`}
                      type="button"
                    >
                      {status === "Materials & Creatives OK"
                        ? "Materials OK"
                        : status}
                    </button>
                  ))}
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
