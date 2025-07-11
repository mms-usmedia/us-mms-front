import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ExecutiveDashboardProps {
  onToggleDashboard: () => void;
}

export const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({
  onToggleDashboard,
}) => {
  // Estado para el filtro de tiempo activo
  const [activeTimeFilter, setActiveTimeFilter] = useState<string>("7D");

  // Función para manejar el cambio de filtro de tiempo
  const handleTimeFilterChange = (filter: string) => {
    setActiveTimeFilter(filter);
    // Aquí se implementaría la lógica para actualizar los datos según el filtro seleccionado
    console.log(`Filtro cambiado a: ${filter}`);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Filtros de tiempo */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <Button
            variant={activeTimeFilter === "7D" ? "secondary" : "outline"}
            size="sm"
            className={`text-sm ${
              activeTimeFilter === "7D"
                ? "bg-orange-100 border-orange-200 text-orange-700"
                : ""
            }`}
            onClick={() => handleTimeFilterChange("7D")}
          >
            7D
          </Button>
          <Button
            variant={activeTimeFilter === "30D" ? "secondary" : "outline"}
            size="sm"
            className={`text-sm ${
              activeTimeFilter === "30D"
                ? "bg-orange-100 border-orange-200 text-orange-700"
                : ""
            }`}
            onClick={() => handleTimeFilterChange("30D")}
          >
            30D
          </Button>
          <Button
            variant={activeTimeFilter === "90D" ? "secondary" : "outline"}
            size="sm"
            className={`text-sm ${
              activeTimeFilter === "90D"
                ? "bg-orange-100 border-orange-200 text-orange-700"
                : ""
            }`}
            onClick={() => handleTimeFilterChange("90D")}
          >
            90D
          </Button>
          <Button
            variant={activeTimeFilter === "YTD" ? "secondary" : "outline"}
            size="sm"
            className={`text-sm ${
              activeTimeFilter === "YTD"
                ? "bg-orange-100 border-orange-200 text-orange-700"
                : ""
            }`}
            onClick={() => handleTimeFilterChange("YTD")}
          >
            YTD
          </Button>
          <Button
            className="text-sm bg-orange-100 border-orange-200 text-orange-700"
            size="sm"
          >
            Custom
          </Button>
        </div>

        <div className="flex space-x-2">
          <Button
            variant="default"
            onClick={onToggleDashboard}
            className="shadow-sm"
          >
            Ver Dashboard de Ventas
          </Button>
          <Button variant="outline" className="shadow-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            Filtros
          </Button>
          <Button variant="outline" className="shadow-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Exportar
          </Button>
          <Button
            variant="default"
            className="bg-orange-600 hover:bg-orange-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Actualizar
          </Button>
        </div>
      </div>

      {/* Contenido del dashboard ejecutivo (placeholder) */}
      <Card className="p-8 text-center">
        <h2 className="text-xl font-medium text-gray-700 mb-4">
          Dashboard Ejecutivo Próximamente
        </h2>
        <p className="text-gray-500 mb-6">
          Este dashboard proporcionará información empresarial de alto nivel,
          previsiones de ingresos y métricas estratégicas para la toma de
          decisiones ejecutivas.
        </p>
        <Button onClick={onToggleDashboard}>Ver Dashboard de Ventas</Button>
      </Card>
    </div>
  );
};
