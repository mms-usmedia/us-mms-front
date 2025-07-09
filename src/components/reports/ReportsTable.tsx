import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Download,
  Search,
  ArrowUpDown,
  FileType,
  FileText,
  FileJson,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSidebar } from "@/contexts/SidebarContext";
import useTruncate from "@/hooks/useTruncate";
import StatusBadge, { StatusType } from "@/components/ui/StatusBadge";

// Interfaces
export interface ReportColumn {
  id: string;
  name: string;
  key: string;
  sortable?: boolean;
  type?: "text" | "number" | "currency" | "date" | "status";
}

export interface ReportData {
  [key: string]: string | number | boolean | null | undefined;
}

interface ReportsTableProps {
  columns: ReportColumn[];
  data: ReportData[];
  onExport?: (format: string) => void;
  searchComponent?: React.ReactNode;
}

const ReportsTable: React.FC<ReportsTableProps> = ({
  columns,
  data,
  onExport,
  searchComponent,
}) => {
  const { isCollapsed } = useSidebar();
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Usar el hook personalizado para el truncamiento
  const textTruncateLength = useTruncate(40, isCollapsed);

  // Manejar ordenamiento
  const handleSort = (columnId: string) => {
    if (sortColumn === columnId) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(columnId);
      setSortDirection("asc");
    }
  };

  // Filtrar datos por término de búsqueda
  const filteredData = data.filter((row) => {
    return Object.values(row).some((value) => {
      if (value === null || value === undefined) return false;
      return value.toString().toLowerCase().includes(searchTerm.toLowerCase());
    });
  });

  // Ordenar datos
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortColumn) return 0;

    const column = columns.find((col) => col.id === sortColumn);
    if (!column) return 0;

    const aValue = a[column.key];
    const bValue = b[column.key];

    if (aValue === bValue) return 0;
    if (aValue === null || aValue === undefined) return 1;
    if (bValue === null || bValue === undefined) return -1;

    if (sortDirection === "asc") {
      return aValue < bValue ? -1 : 1;
    } else {
      return aValue > bValue ? -1 : 1;
    }
  });

  // Paginación
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Formatear valores según el tipo de columna
  const formatValue = (
    value: string | number | boolean | null | undefined,
    column: ReportColumn
  ) => {
    if (value === null || value === undefined) return "-";

    switch (column.type) {
      case "currency":
        return formatCurrency(value as number | string);
      case "number":
        return (value as number).toLocaleString();
      case "date":
        return formatDate(value as string);
      case "status":
        return <StatusBadge status={value as StatusType} />;
      default:
        return value;
    }
  };

  // Formatear moneda
  const formatCurrency = (value: number | string) => {
    // Convertir a número si es string
    const numValue = typeof value === "string" ? parseFloat(value) : value;

    // Formatear con separadores de miles y decimales
    return `$${numValue.toLocaleString("es-ES", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // Formatear fecha
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("es-ES");
  };

  return (
    <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
      {/* Barra de búsqueda y exportación */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-grow">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search in results..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            {searchComponent && (
              <div className="flex-shrink-0">{searchComponent}</div>
            )}
          </div>

          {onExport && (
            <div className="flex-shrink-0">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="flex items-center gap-1">
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => onExport("excel")}
                    className="cursor-pointer"
                  >
                    <FileType className="h-4 w-4 mr-2 text-green-600" />
                    Excel
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onExport("pdf")}
                    className="cursor-pointer"
                  >
                    <FileText className="h-4 w-4 mr-2 text-red-600" />
                    PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onExport("csv")}
                    className="cursor-pointer"
                  >
                    <FileJson className="h-4 w-4 mr-2 text-blue-600" />
                    CSV
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.id}>
                  {column.sortable ? (
                    <button
                      className="flex items-center gap-1 hover:text-orange-500 transition-colors"
                      onClick={() => handleSort(column.id)}
                    >
                      {column.name}
                      {sortColumn === column.id && (
                        <ArrowUpDown className="h-4 w-4" />
                      )}
                    </button>
                  ) : (
                    column.name
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {columns.map((column) => (
                    <TableCell key={column.id}>
                      {formatValue(row[column.key], column)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-gray-500"
                >
                  No results found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-gray-100 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredData.length)} of{" "}
            {filteredData.length} results
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <div className="text-sm">
              Page {currentPage} of {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsTable;
