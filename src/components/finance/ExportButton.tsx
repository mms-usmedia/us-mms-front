import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Download,
  FileSpreadsheet,
  FileText,
  File,
  LayoutGrid,
  Layers,
} from "lucide-react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { RevenueData } from "./RevenueTable";

interface ExportButtonProps {
  data: RevenueData[];
  filename?: string;
}

const ExportButton: React.FC<ExportButtonProps> = ({
  data,
  filename = "revenue-report",
}) => {
  const exportToCSV = (groupBy?: string) => {
    // Convert data to CSV format
    const headers = Object.keys(data[0]).join(",");
    const csvRows = data.map((row) => Object.values(row).join(","));
    const csvString = [headers, ...csvRows].join("\n");

    // Create blob and download
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const exportFilename = groupBy
      ? `${filename}-by-${groupBy.toLowerCase()}.csv`
      : `${filename}.csv`;
    saveAs(blob, exportFilename);
  };

  const exportToExcel = (groupBy?: string) => {
    // Create workbook and worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Revenue");

    // Generate Excel file and download
    const exportFilename = groupBy
      ? `${filename}-by-${groupBy.toLowerCase()}.xlsx`
      : `${filename}.xlsx`;
    XLSX.writeFile(workbook, exportFilename);
  };

  const exportToPDF = (groupBy?: string) => {
    const doc = new jsPDF();

    // @ts-expect-error - jsPDF-autotable types are not properly recognized
    doc.autoTable({
      head: [Object.keys(data[0])],
      body: data.map(Object.values),
      theme: "striped",
      headStyles: { fillColor: [245, 124, 0] }, // Orange color
    });

    const exportFilename = groupBy
      ? `${filename}-by-${groupBy.toLowerCase()}.pdf`
      : `${filename}.pdf`;
    doc.save(exportFilename);
  };

  const handleExportByFormat = (format: string) => {
    switch (format) {
      case "excel":
        exportToExcel();
        break;
      case "csv":
        exportToCSV();
        break;
      case "pdf":
        exportToPDF();
        break;
      default:
        break;
    }
  };

  const handleExportByGroup = (format: string, groupBy: string) => {
    switch (format) {
      case "excel":
        exportToExcel(groupBy);
        break;
      case "csv":
        exportToCSV(groupBy);
        break;
      case "pdf":
        exportToPDF(groupBy);
        break;
      default:
        break;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          <span>Export</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Format</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => handleExportByFormat("excel")}
          className="cursor-pointer"
        >
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          <span>Excel (.xlsx)</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleExportByFormat("csv")}
          className="cursor-pointer"
        >
          <FileText className="h-4 w-4 mr-2" />
          <span>CSV</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleExportByFormat("pdf")}
          className="cursor-pointer"
        >
          <File className="h-4 w-4 mr-2" />
          <span>PDF</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuLabel>Grouping Options</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => handleExportByGroup("excel", "Campaign")}
          className="cursor-pointer"
        >
          <LayoutGrid className="h-4 w-4 mr-2" />
          <span>Export by Campaign</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleExportByGroup("excel", "AdUnit")}
          className="cursor-pointer"
        >
          <Layers className="h-4 w-4 mr-2" />
          <span>Export by Ad Unit</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExportButton;
