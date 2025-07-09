import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Download,
  Eye,
  Star,
  StarOff,
  MoreHorizontal,
  Trash2,
  Search,
  FileType,
  FileText,
  FileJson,
  SlidersHorizontal,
  ChevronDown,
  BarChart3,
  PieChart,
  LineChart,
  Layers,
  BarChart2,
  Activity,
  TrendingUp,
  FileBarChart,
  FileSpreadsheet,
  Wallet,
  Users,
  Briefcase,
  Building,
  Landmark,
  CircleDollarSign,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Interfaces
export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  module: "campaigns" | "finance" | "adops" | "hur" | "organizations";
  isFavorite: boolean;
  createdAt: string;
  createdBy: string;
  filters?: Record<string, unknown>;
  icon?: string;
  color?: string;
}

interface ReportTemplatesProps {
  templates: ReportTemplate[];
  onPreview: (template: ReportTemplate) => void;
  onExport: (template: ReportTemplate, format: string) => void;
  onToggleFavorite: (templateId: string) => void;
  onDelete: (templateId: string) => void;
  onConfirmDelete?: (templateId: string) => void;
}

interface DeleteModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center"
      onClick={onCancel}
    >
      <div className="fixed inset-0 bg-black opacity-30"></div>
      <div
        className="relative bg-white rounded-lg shadow-lg max-w-md w-full p-6 z-50"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center">
          <svg
            className="mx-auto mb-4 w-14 h-14 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <h3 className="mb-5 text-lg font-medium text-gray-900">
            Are you sure you want to delete this template?
          </h3>
          <p className="mb-5 text-sm text-gray-500">
            This action cannot be undone. This will permanently delete the
            template.
          </p>
          <div className="flex justify-center space-x-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 focus:outline-none"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none"
            >
              Yes, delete it
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ReportTemplates: React.FC<ReportTemplatesProps> = ({
  templates,
  onPreview,
  onExport,
  onToggleFavorite,
  onDelete,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedModule, setSelectedModule] = useState<string>("");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<string | null>(null);

  // Función para obtener el icono según el módulo o el icono personalizado
  const getTemplateIcon = (template: ReportTemplate) => {
    // Si el template tiene un icono personalizado, usarlo
    if (template.icon) {
      const iconColor = template.color
        ? `text-${template.color}-500`
        : "text-orange-500";

      switch (template.icon) {
        case "BarChart3":
          return <BarChart3 className={`h-5 w-5 ${iconColor}`} />;
        case "PieChart":
          return <PieChart className={`h-5 w-5 ${iconColor}`} />;
        case "LineChart":
          return <LineChart className={`h-5 w-5 ${iconColor}`} />;
        case "Layers":
          return <Layers className={`h-5 w-5 ${iconColor}`} />;
        case "BarChart2":
          return <BarChart2 className={`h-5 w-5 ${iconColor}`} />;
        case "Activity":
          return <Activity className={`h-5 w-5 ${iconColor}`} />;
        case "TrendingUp":
          return <TrendingUp className={`h-5 w-5 ${iconColor}`} />;
        case "FileBarChart":
          return <FileBarChart className={`h-5 w-5 ${iconColor}`} />;
        case "FileText":
          return <FileText className={`h-5 w-5 ${iconColor}`} />;
        case "FileSpreadsheet":
          return <FileSpreadsheet className={`h-5 w-5 ${iconColor}`} />;
        case "Wallet":
          return <Wallet className={`h-5 w-5 ${iconColor}`} />;
        case "Users":
          return <Users className={`h-5 w-5 ${iconColor}`} />;
        case "Briefcase":
          return <Briefcase className={`h-5 w-5 ${iconColor}`} />;
        case "Building":
          return <Building className={`h-5 w-5 ${iconColor}`} />;
        case "Landmark":
          return <Landmark className={`h-5 w-5 ${iconColor}`} />;
        case "CircleDollarSign":
          return <CircleDollarSign className={`h-5 w-5 ${iconColor}`} />;
        default:
          return <BarChart3 className={`h-5 w-5 ${iconColor}`} />;
      }
    }

    // Si no tiene icono personalizado, usar el icono según el módulo
    switch (template.module) {
      case "campaigns":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-orange-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
          </svg>
        );
      case "finance":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-green-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "adops":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-blue-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H9.229l-.946.371a1 1 0 00-.023.02l-.476.476-.224.224H5v-1h3.771zM5 14a1 1 0 100 2h10a1 1 0 100-2H5z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "hur":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-amber-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "organizations":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-purple-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
          </svg>
        );
      default:
        return getModuleIcon(template.module);
    }
  };

  // Función para obtener el icono según el módulo
  const getModuleIcon = (module: string) => {
    switch (module) {
      case "campaigns":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-orange-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
          </svg>
        );
      case "finance":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-green-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "adops":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-blue-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H9.229l-.946.371a1 1 0 00-.023.02l-.476.476-.224.224H5v-1h3.771zM5 14a1 1 0 100 2h10a1 1 0 100-2H5z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "hur":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-amber-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "organizations":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-purple-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
          </svg>
        );
      default:
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm2 10a1 1 0 10-2 0v3a1 1 0 102 0v-3zm2-3a1 1 0 011 1v5a1 1 0 11-2 0v-5a1 1 0 011-1zm4-1a1 1 0 10-2 0v7a1 1 0 102 0V8z"
              clipRule="evenodd"
            />
          </svg>
        );
    }
  };

  // Formatear fecha
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  // Filtrar y ordenar templates
  const filteredTemplates = templates
    .filter((template) => {
      // Filtro por búsqueda
      const matchesSearch =
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description.toLowerCase().includes(searchTerm.toLowerCase());

      // Filtro por módulo
      const matchesModule = selectedModule
        ? template.module === selectedModule
        : true;

      // Filtro por favoritos
      const matchesFavorite = showFavoritesOnly ? template.isFavorite : true;

      return matchesSearch && matchesModule && matchesFavorite;
    })
    .sort((a, b) => {
      // Primero ordenar por favoritos si está activado
      if (showFavoritesOnly) {
        if (a.isFavorite && !b.isFavorite) return -1;
        if (!a.isFavorite && b.isFavorite) return 1;
      }

      // Luego ordenar por nombre
      if (sortOrder === "asc") {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });

  // Manejar eliminación de template
  const handleDeleteClick = (templateId: string) => {
    setTemplateToDelete(templateId);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (templateToDelete) {
      onDelete(templateToDelete);
      setTemplateToDelete(null);
      setDeleteModalOpen(false);
    }
  };

  const handleCancelDelete = () => {
    setTemplateToDelete(null);
    setDeleteModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Barra de búsqueda y filtros */}
      <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Button
            variant="outline"
            size="sm"
            className={`flex items-center gap-1 ${
              showFilters ? "bg-gray-100" : ""
            }`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            <ChevronDown className="h-3 w-3 ml-1" />
          </Button>

          <Button
            variant={showFavoritesOnly ? "default" : "outline"}
            size="sm"
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className="flex items-center gap-1"
          >
            <Star
              className={`h-4 w-4 ${showFavoritesOnly ? "fill-white" : ""}`}
            />
            Favorites
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="flex items-center gap-1"
          >
            {sortOrder === "asc" ? "A-Z" : "Z-A"}
          </Button>
        </div>

        {/* Filtros avanzados (condicional) */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <h3 className="font-medium text-sm text-gray-700 mb-2">
              Filter by module
            </h3>
            <div className="flex flex-wrap gap-2">
              <div
                className={`cursor-pointer rounded-md px-3 py-1.5 text-sm border ${
                  selectedModule === ""
                    ? "border-orange-100 bg-orange-50 text-orange-700"
                    : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                }`}
                onClick={() => setSelectedModule("")}
              >
                All
                {selectedModule === "" && (
                  <span className="ml-1.5 inline-block">✓</span>
                )}
              </div>
              <div
                className={`cursor-pointer rounded-md px-3 py-1.5 text-sm border ${
                  selectedModule === "campaigns"
                    ? "border-orange-100 bg-orange-50 text-orange-700"
                    : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                }`}
                onClick={() =>
                  setSelectedModule(
                    selectedModule === "campaigns" ? "" : "campaigns"
                  )
                }
              >
                Campaigns
                {selectedModule === "campaigns" && (
                  <span className="ml-1.5 inline-block">✓</span>
                )}
              </div>
              <div
                className={`cursor-pointer rounded-md px-3 py-1.5 text-sm border ${
                  selectedModule === "finance"
                    ? "border-orange-100 bg-orange-50 text-orange-700"
                    : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                }`}
                onClick={() =>
                  setSelectedModule(
                    selectedModule === "finance" ? "" : "finance"
                  )
                }
              >
                Finance
                {selectedModule === "finance" && (
                  <span className="ml-1.5 inline-block">✓</span>
                )}
              </div>
              <div
                className={`cursor-pointer rounded-md px-3 py-1.5 text-sm border ${
                  selectedModule === "adops"
                    ? "border-orange-100 bg-orange-50 text-orange-700"
                    : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                }`}
                onClick={() =>
                  setSelectedModule(selectedModule === "adops" ? "" : "adops")
                }
              >
                AdOps
                {selectedModule === "adops" && (
                  <span className="ml-1.5 inline-block">✓</span>
                )}
              </div>
              <div
                className={`cursor-pointer rounded-md px-3 py-1.5 text-sm border ${
                  selectedModule === "hur"
                    ? "border-orange-100 bg-orange-50 text-orange-700"
                    : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                }`}
                onClick={() =>
                  setSelectedModule(selectedModule === "hur" ? "" : "hur")
                }
              >
                HUR
                {selectedModule === "hur" && (
                  <span className="ml-1.5 inline-block">✓</span>
                )}
              </div>
              <div
                className={`cursor-pointer rounded-md px-3 py-1.5 text-sm border ${
                  selectedModule === "organizations"
                    ? "border-orange-100 bg-orange-50 text-orange-700"
                    : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                }`}
                onClick={() =>
                  setSelectedModule(
                    selectedModule === "organizations" ? "" : "organizations"
                  )
                }
              >
                Organizations
                {selectedModule === "organizations" && (
                  <span className="ml-1.5 inline-block">✓</span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mensaje si no hay resultados */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-100 shadow-sm">
          <p className="text-gray-500">
            No templates found matching your criteria.
          </p>
        </div>
      )}

      {/* Templates grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            onClick={(e) => {
              // Only trigger if not clicking on buttons or dropdown
              if (
                !(e.target as Element).closest("button") &&
                !(e.target as Element).closest('[role="menuitem"]')
              ) {
                onPreview(template);
              }
            }}
          >
            <Card className="overflow-hidden border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer">
              <CardHeader className="bg-white pb-2 pt-4 px-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div
                      className={`p-2 rounded-lg ${
                        template.color
                          ? `bg-${template.color}-50`
                          : "bg-gray-50"
                      }`}
                    >
                      {getTemplateIcon(template)}
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold text-gray-800">
                        {template.name}
                      </CardTitle>
                      <p className="text-sm text-gray-500 mt-1">
                        {template.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(template.id);
                      }}
                      title={
                        template.isFavorite
                          ? "Remove from favorites"
                          : "Add to favorites"
                      }
                    >
                      {template.isFavorite ? (
                        <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                      ) : (
                        <StarOff className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          className="text-red-600 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(template.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-4 pt-2">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <div>Created by: {template.createdBy}</div>
                  <div>{formatDate(template.createdAt)}</div>
                </div>

                <div className="flex items-center justify-between mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-gray-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      onPreview(template);
                    }}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Preview
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-orange-600 border-orange-200 hover:bg-orange-50 hover:text-orange-700"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Export
                        <ChevronDown className="h-3 w-3 ml-1" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          onExport(template, "excel");
                        }}
                        className="cursor-pointer"
                      >
                        <FileSpreadsheet className="h-4 w-4 mr-2 text-green-600" />
                        Excel (.xlsx)
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          onExport(template, "pdf");
                        }}
                        className="cursor-pointer"
                      >
                        <FileText className="h-4 w-4 mr-2 text-red-600" />
                        PDF (.pdf)
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          onExport(template, "csv");
                        }}
                        className="cursor-pointer"
                      >
                        <FileText className="h-4 w-4 mr-2 text-blue-600" />
                        CSV (.csv)
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* Delete confirmation modal */}
      <DeleteModal
        isOpen={deleteModalOpen}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};

export default ReportTemplates;
