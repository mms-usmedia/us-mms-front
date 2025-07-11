import React, { useState, useRef } from "react";
import { StatsCard } from "./StatsCard";
import { ProgressCard } from "./ProgressCard";
import { SalesPerformanceChart } from "./SalesPerformanceChart";
import { TopClients } from "./TopClients";
import { TasksAlerts } from "./TasksAlerts";
import { SalesByFormat } from "./SalesByFormat";
import { RecentCampaigns } from "./RecentCampaigns";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import DateRangePicker from "./DateRangePicker";
import {
  DateValue,
  getLocalTimeZone,
  parseDate,
  today,
} from "@internationalized/date";

interface SalesDashboardProps {
  onToggleDashboard: () => void;
}

export const SalesDashboard: React.FC<SalesDashboardProps> = ({
  onToggleDashboard,
}) => {
  // Estado para el filtro de tiempo activo
  const [activeTimeFilter, setActiveTimeFilter] = useState<string>("7D");
  // Estado para almacenar el rango de fechas seleccionado
  const [selectedDateRange, setSelectedDateRange] = useState<{
    start: Date | null;
    end: Date | null;
  }>({ start: null, end: null });
  // Estado para controlar la apertura del DateRangePicker
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  // Referencia al botón Custom para posicionar el DateRangePicker
  const customButtonRef = useRef<HTMLButtonElement>(null);

  // Íconos modernos para las tarjetas de estadísticas
  const moneyIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );

  const campaignIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
      />
    </svg>
  );

  const clientIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
      />
    </svg>
  );

  const targetIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
      />
    </svg>
  );

  // Función para manejar el cambio de filtro de tiempo
  const handleTimeFilterChange = (filter: string) => {
    setActiveTimeFilter(filter);

    // Si no es Custom, resetear el rango de fechas personalizado
    if (filter !== "Custom") {
      setSelectedDateRange({ start: null, end: null });
      // Aquí se implementaría la lógica para actualizar los datos según el filtro seleccionado
      console.log(`Filtro cambiado a: ${filter}`);
    }
  };

  // Función para manejar el cambio de rango de fechas
  const handleDateRangeChange = (
    startDate: Date | null,
    endDate: Date | null
  ) => {
    if (startDate && endDate) {
      setSelectedDateRange({ start: startDate, end: endDate });
      setActiveTimeFilter("Custom");
      setIsDatePickerOpen(false);

      // Aquí se implementaría la lógica para actualizar los datos según el rango seleccionado
      console.log(
        `Rango de fechas seleccionado: ${formatDate(startDate)} - ${formatDate(
          endDate
        )}`
      );
    }
  };

  // Función para formatear una fecha en formato DD/MM/YYYY
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Función para obtener el texto a mostrar en el botón Custom
  const getCustomButtonText = () => {
    if (selectedDateRange.start && selectedDateRange.end) {
      return `${formatDate(selectedDateRange.start)} - ${formatDate(
        selectedDateRange.end
      )}`;
    }
    return "Custom";
  };

  return (
    <div className="p-6 space-y-6 relative">
      {/* Filtros de tiempo */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-2 items-center">
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
            ref={customButtonRef}
            className={`text-sm flex items-center space-x-1 ${
              activeTimeFilter === "Custom"
                ? "bg-orange-100 border-orange-200 text-orange-700"
                : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
            size="sm"
            onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
          >
            <span>{getCustomButtonText()}</span>
            <Calendar className="h-4 w-4" />
          </Button>

          {/* DateRangePicker */}
          <DateRangePicker
            isOpen={isDatePickerOpen}
            onClose={() => setIsDatePickerOpen(false)}
            onDateRangeChange={handleDateRangeChange}
            triggerRef={customButtonRef as React.RefObject<HTMLElement>}
            backgroundColor="#ffffff"
            selectedDayColor="#f97316"
            rangeDayColor="#fed7aa"
            textColor="#000000"
            headerColor="#6b7280"
          />
        </div>

        <div className="flex space-x-2">
          <Button
            variant="default"
            onClick={onToggleDashboard}
            className="shadow-sm"
          >
            View Executive Dashboard
          </Button>
        </div>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Sales This Month"
          value="$125,000"
          icon={moneyIcon}
          trend={{ value: "8.7% vs. last month", positive: true }}
          color="green"
        />
        <StatsCard
          title="Active Campaigns"
          value="8"
          icon={campaignIcon}
          subtitle="3 pending, 15 completed"
          color="orange"
        />
        <StatsCard
          title="Active Clients"
          value="6"
          icon={clientIcon}
          subtitle="$45,312.5 avg. deal size"
          color="purple"
        />
        <ProgressCard
          title="Sales Target Progress"
          percentage={72.5}
          currentValue="$362,500"
          targetValue="$500,000"
          icon={targetIcon}
          color="indigo"
        />
      </div>

      {/* Gráficos y tablas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SalesPerformanceChart />
        </div>
        <div>
          <TopClients />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentCampaigns />
        </div>
        <div className="space-y-6">
          <SalesByFormat />
          <TasksAlerts />
        </div>
      </div>
    </div>
  );
};
