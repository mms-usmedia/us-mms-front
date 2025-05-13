// src/app/campaigns/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import StatusBadge from "@/components/ui/StatusBadge";
import SearchFilter from "@/components/campaigns/SearchFilter";
import Link from "next/link";

// Tipos para las campañas
interface Campaign {
  id: string;
  name: string;
  organizationName: string;
  organizationType:
    | "Agencia"
    | "Advertiser"
    | "Publisher"
    | "Holding Agency"
    | "Holding Advertiser";
  startDate: string;
  endDate: string;
  status:
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
  units: number;
  budget: number;
  grossMargin: number;
}

// Datos de ejemplo hardcodeados para campañas con estados más variados
const mockCampaigns: Campaign[] = [
  {
    id: "23810",
    name: "LiveNation_Brasil_Bad Bunny_Vevo_MaioJunho25",
    organizationName: "Live Nation Brasil Entretenimento LTDA",
    organizationType: "Advertiser",
    startDate: "2025-05-13",
    endDate: "2025-06-11",
    status: "Approved",
    units: 150000,
    budget: 75000,
    grossMargin: 28.5,
  },
  {
    id: "23809",
    name: "Alpura_Deslactosada_Podcast ads_Mex_Jun25",
    organizationName: "Havas Media Mexico City",
    organizationType: "Agencia",
    startDate: "2025-06-01",
    endDate: "2025-06-30",
    status: "Live",
    units: 85000,
    budget: 32000,
    grossMargin: 22.7,
  },
  {
    id: "23808",
    name: "Embratur_Americas_August_2025_Sojem",
    organizationName: "CALIA Y2 PROPAGANDA E MARKETING LTDA",
    organizationType: "Agencia",
    startDate: "2025-08-01",
    endDate: "2025-08-31",
    status: "Pending",
    units: 210000,
    budget: 95000,
    grossMargin: 31.2,
  },
  {
    id: "23807",
    name: "Embratur_Americas_July_2025_Sojem",
    organizationName: "CALIA Y2 PROPAGANDA E MARKETING LTDA",
    organizationType: "Agencia",
    startDate: "2025-07-01",
    endDate: "2025-07-31",
    status: "Negotiating",
    units: 195000,
    budget: 87500,
    grossMargin: 29.8,
  },
  {
    id: "23806",
    name: "Embratur_Americas_June_2025_Sojem",
    organizationName: "CALIA Y2 PROPAGANDA E MARKETING LTDA",
    organizationType: "Agencia",
    startDate: "2025-06-01",
    endDate: "2025-06-30",
    status: "Won",
    units: 180000,
    budget: 82000,
    grossMargin: 27.5,
  },
  {
    id: "23805",
    name: "Banco_Itau_Chile_Personal_Bank_Mayo_2025_LinkedIn",
    organizationName: "Omnet Chile",
    organizationType: "Agencia",
    startDate: "2025-05-09",
    endDate: "2025-05-31",
    status: "Invoiced",
    units: 45000,
    budget: 22000,
    grossMargin: 18.9,
  },
  {
    id: "23804",
    name: "Nintendo_Hardware focus CGI_Q1_Platforms & FITO_Bra_Chi_Mex_Col_Per_Vevo_May24_June25",
    organizationName: "Omnet Latin America LLC",
    organizationType: "Agencia",
    startDate: "2025-05-12",
    endDate: "2025-06-30",
    status: "Materials & Creatives OK",
    units: 320000,
    budget: 175000,
    grossMargin: 32.4,
  },
  {
    id: "23802",
    name: "MB_MODEL LinkedIn_Mex_Mayo 25",
    organizationName: "OMD Mexico",
    organizationType: "Agencia",
    startDate: "2025-05-09",
    endDate: "2025-05-31",
    status: "Implementation",
    units: 38000,
    budget: 20000,
    grossMargin: 25.0,
  },
  {
    id: "23801",
    name: "Claro_Colombia_EquiposPost_Pinterest_mayo_2025",
    organizationName: "Havas Media Colombia",
    organizationType: "Agencia",
    startDate: "2025-05-09",
    endDate: "2025-05-31",
    status: "Closed",
    units: 56000,
    budget: 29500,
    grossMargin: 24.2,
  },
  {
    id: "23800",
    name: "Vevo_Falabella_Tienda Americanino_Chile_May25",
    organizationName: "Vevo LLC",
    organizationType: "Publisher",
    startDate: "2025-05-14",
    endDate: "2025-05-27",
    status: "HUR",
    units: 42000,
    budget: 18500,
    grossMargin: 21.8,
  },
  {
    id: "23799",
    name: "Prototype_Dia del Padre_TikTok_Arg_MayJune25",
    organizationName: "EJE PUBLICITARIA SOCIEDAD ANONIMA",
    organizationType: "Advertiser",
    startDate: "2025-05-24",
    endDate: "2025-06-15",
    status: "Pending",
    units: 75000,
    budget: 38000,
    grossMargin: 26.3,
  },
  {
    id: "23797",
    name: "Renault_CO_Brand_Everyone_Mayo_25_Vevo",
    organizationName: "OMD Colombia - Bogota",
    organizationType: "Agencia",
    startDate: "2025-05-08",
    endDate: "2025-05-31",
    status: "Live",
    units: 68000,
    budget: 35000,
    grossMargin: 27.2,
  },
  {
    id: "23796",
    name: "FANDOM | MAX (ARG) | FINAL | Mayo 25",
    organizationName: "Fandom",
    organizationType: "Publisher",
    startDate: "2025-05-19",
    endDate: "2025-06-25",
    status: "Implementation",
    units: 110000,
    budget: 52000,
    grossMargin: 29.6,
  },
  {
    id: "23795",
    name: "Banorte_Nomina_LinkedIn_Mex_Mayo25",
    organizationName: "Havas Media Mexico City",
    organizationType: "Agencia",
    startDate: "2025-05-07",
    endDate: "2025-05-31",
    status: "Negotiating",
    units: 65000,
    budget: 31000,
    grossMargin: 23.8,
  },
  {
    id: "23794",
    name: "Mercedes Benz_GLE 400 EQ TECH_CONSIDER_LinkedIn_Mex_Mayo25",
    organizationName: "OMD Mexico",
    organizationType: "Holding Agency",
    startDate: "2025-05-07",
    endDate: "2025-05-31",
    status: "Pending",
    units: 125000,
    budget: 67000,
    grossMargin: 33.5,
  },
];

export default function CampaignsListPage() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useAuth();
  const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns);
  const [filteredCampaigns, setFilteredCampaigns] =
    useState<Campaign[]>(mockCampaigns);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrganization, setSelectedOrganization] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [sortField, setSortField] = useState<string>("startDate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Redirección si no está autenticado
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  // Función para aplicar filtros
  const applyFilters = () => {
    let filtered = [...campaigns];

    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(
        (campaign) =>
          campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          campaign.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          campaign.organizationName
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por organización
    if (selectedOrganization) {
      filtered = filtered.filter(
        (campaign) => campaign.organizationName === selectedOrganization
      );
    }

    // Filtrar por estado
    if (selectedStatus) {
      filtered = filtered.filter(
        (campaign) => campaign.status === selectedStatus
      );
    }

    // Ordenar los resultados
    filtered.sort((a, b) => {
      let comparison = 0;

      if (sortField === "startDate") {
        comparison =
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
      } else if (sortField === "endDate") {
        comparison =
          new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
      } else if (sortField === "budget") {
        comparison = a.budget - b.budget;
      } else if (sortField === "units") {
        comparison = a.units - b.units;
      } else if (sortField === "grossMargin") {
        comparison = a.grossMargin - b.grossMargin;
      } else {
        // Ordenar por nombre por defecto
        comparison = a.name.localeCompare(b.name);
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });

    setFilteredCampaigns(filtered);
  };

  // Aplicar filtros cuando cambian los criterios
  useEffect(() => {
    applyFilters();
  }, [
    searchTerm,
    selectedOrganization,
    selectedStatus,
    sortField,
    sortDirection,
  ]);

  // Manejador para cambiar el campo de ordenación
  const handleSort = (field: string) => {
    if (sortField === field) {
      // Si ya estamos ordenando por este campo, cambiamos la dirección
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Si ordenamos por un nuevo campo, establecemos ese campo y dirección descendente por defecto
      setSortField(field);
      setSortDirection("desc");
    }
  };

  // Función para formatear montos
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Función para formatear números
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("es-MX").format(num);
  };

  // Función para formatear fechas
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("es-MX", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  // Función para truncar texto con ellipsis
  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  // Función para obtener el color de fondo según el tipo de organización
  const getOrganizationTypeStyles = (type: string) => {
    switch (type) {
      case "Agencia":
        return "bg-blue-50 text-blue-700 border border-blue-100 px-2 py-1 rounded-md text-xs shadow-sm";
      case "Advertiser":
        return "bg-purple-50 text-purple-700 border border-purple-100 px-2 py-1 rounded-md text-xs shadow-sm";
      case "Publisher":
        return "bg-amber-50 text-amber-700 border border-amber-100 px-2 py-1 rounded-md text-xs shadow-sm";
      case "Holding Agency":
        return "bg-indigo-50 text-indigo-700 border border-indigo-100 px-2 py-1 rounded-md text-xs shadow-sm";
      case "Holding Advertiser":
        return "bg-rose-50 text-rose-700 border border-rose-100 px-2 py-1 rounded-md text-xs shadow-sm";
      default:
        return "bg-gray-50 text-gray-700 border border-gray-100 px-2 py-1 rounded-md text-xs shadow-sm";
    }
  };

  // Renderizar loading mientras se carga la autenticación
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header userName={user?.name || "Usuario"} />

        {/* Contenedor principal */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <div className="container mx-auto">
            <div className="mb-8 flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  Campañas
                </h1>
                <p className="text-gray-600">
                  Gestiona todas tus campañas publicitarias en un solo lugar
                </p>
              </div>

              {/* Botón de nueva campaña (ahora en la vista principal) */}
              <Link
                href="/campaigns/new"
                className="flex items-center px-4 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors shadow-md"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Nueva Campaña
              </Link>
            </div>

            {/* Filtros de búsqueda */}
            <SearchFilter
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedOrganization={selectedOrganization}
              onOrganizationChange={setSelectedOrganization}
              selectedStatus={selectedStatus}
              onStatusChange={setSelectedStatus}
              campaigns={campaigns}
            />

            {/* Tabla de campañas */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-indigo-700 transition-colors"
                        onClick={() => handleSort("id")}
                      >
                        ID
                        {sortField === "id" && (
                          <span className="ml-1">
                            {sortDirection === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-indigo-700 transition-colors w-48"
                        onClick={() => handleSort("name")}
                      >
                        Campaña
                        {sortField === "name" && (
                          <span className="ml-1">
                            {sortDirection === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-indigo-700 transition-colors w-56"
                        onClick={() => handleSort("organizationName")}
                      >
                        Organización
                        {sortField === "organizationName" && (
                          <span className="ml-1">
                            {sortDirection === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-indigo-700 transition-colors"
                        onClick={() => handleSort("organizationType")}
                      >
                        Tipo
                        {sortField === "organizationType" && (
                          <span className="ml-1">
                            {sortDirection === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-indigo-700 transition-colors"
                        onClick={() => handleSort("startDate")}
                      >
                        Fecha Inicio
                        {sortField === "startDate" && (
                          <span className="ml-1">
                            {sortDirection === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-indigo-700 transition-colors"
                        onClick={() => handleSort("endDate")}
                      >
                        Fecha Fin
                        {sortField === "endDate" && (
                          <span className="ml-1">
                            {sortDirection === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-indigo-700 transition-colors"
                        onClick={() => handleSort("units")}
                      >
                        Units
                        {sortField === "units" && (
                          <span className="ml-1">
                            {sortDirection === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-indigo-700 transition-colors"
                        onClick={() => handleSort("budget")}
                      >
                        Budget
                        {sortField === "budget" && (
                          <span className="ml-1">
                            {sortDirection === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-indigo-700 transition-colors"
                        onClick={() => handleSort("grossMargin")}
                      >
                        % GM
                        {sortField === "grossMargin" && (
                          <span className="ml-1">
                            {sortDirection === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-indigo-700 transition-colors"
                        onClick={() => handleSort("status")}
                      >
                        Estado
                        {sortField === "status" && (
                          <span className="ml-1">
                            {sortDirection === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {filteredCampaigns.map((campaign, index) => (
                      <tr
                        key={campaign.id}
                        className="hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                          {campaign.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600 hover:text-indigo-800 max-w-[12rem] overflow-hidden">
                          <span
                            title={campaign.name}
                            className="hover:underline"
                          >
                            {truncateText(campaign.name, 25)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 max-w-[14rem] overflow-hidden">
                          <span title={campaign.organizationName}>
                            {truncateText(campaign.organizationName, 22)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={getOrganizationTypeStyles(
                              campaign.organizationType
                            )}
                          >
                            {campaign.organizationType}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {formatDate(campaign.startDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {formatDate(campaign.endDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {formatNumber(campaign.units)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                          {formatCurrency(campaign.budget)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {campaign.grossMargin.toFixed(1)}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={campaign.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Paginación */}
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    Anterior
                  </button>
                  <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    Siguiente
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Mostrando <span className="font-medium">1</span> a{" "}
                      <span className="font-medium">
                        {filteredCampaigns.length}
                      </span>{" "}
                      de{" "}
                      <span className="font-medium">
                        {filteredCampaigns.length}
                      </span>{" "}
                      resultados
                    </p>
                  </div>
                  <div>
                    <nav
                      className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                      aria-label="Pagination"
                    >
                      <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                        <span className="sr-only">Anterior</span>
                        &laquo;
                      </button>
                      <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-indigo-600 hover:bg-indigo-50">
                        1
                      </button>
                      <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                        <span className="sr-only">Siguiente</span>
                        &raquo;
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
