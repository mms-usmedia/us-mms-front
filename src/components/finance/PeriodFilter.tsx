import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Calendar } from "lucide-react";

interface PeriodFilterProps {
  onPeriodChange: (period: string) => void;
}

const PeriodFilter: React.FC<PeriodFilterProps> = ({ onPeriodChange }) => {
  const [selectedMonth, setSelectedMonth] = useState("April");
  const [selectedYear, setSelectedYear] = useState("2025");

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const years = ["2023", "2024", "2025", "2026"];

  const handleMonthSelect = (month: string) => {
    setSelectedMonth(month);
    onPeriodChange(`${month} ${selectedYear}`);
  };

  const handleYearSelect = (year: string) => {
    setSelectedYear(year);
    onPeriodChange(`${selectedMonth} ${year}`);
  };

  return (
    <div className="w-full">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="w-full flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>
                {selectedMonth} {selectedYear}
              </span>
            </div>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="grid grid-cols-2 gap-2 p-2">
            <div>
              <h3 className="mb-2 font-medium text-sm">Month</h3>
              <div className="space-y-1">
                {months.map((month) => (
                  <Button
                    key={month}
                    variant={month === selectedMonth ? "default" : "ghost"}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => handleMonthSelect(month)}
                  >
                    {month}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="mb-2 font-medium text-sm">Year</h3>
              <div className="space-y-1">
                {years.map((year) => (
                  <Button
                    key={year}
                    variant={year === selectedYear ? "default" : "ghost"}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => handleYearSelect(year)}
                  >
                    {year}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default PeriodFilter;
