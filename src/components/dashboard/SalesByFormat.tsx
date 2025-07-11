import React from "react";
import { Card } from "@/components/ui/card";

interface FormatSales {
  format: string;
  percentage: number;
  color: string;
  textColor: string;
  bgColor: string;
}

interface SalesByFormatProps {
  className?: string;
}

export const SalesByFormat: React.FC<SalesByFormatProps> = ({
  className = "",
}) => {
  // Datos simulados de ventas por formato con colores pasteles que combinan con la aplicación
  const formatData: FormatSales[] = [
    {
      format: "Display",
      percentage: 40.2,
      color: "bg-orange-400",
      textColor: "text-orange-700",
      bgColor: "bg-orange-50",
    },
    {
      format: "Video",
      percentage: 24.1,
      color: "bg-teal-400",
      textColor: "text-teal-700",
      bgColor: "bg-teal-50",
    },
    {
      format: "Social",
      percentage: 16.1,
      color: "bg-sky-400",
      textColor: "text-sky-700",
      bgColor: "bg-sky-50",
    },
    {
      format: "Rich Media",
      percentage: 11.7,
      color: "bg-rose-400",
      textColor: "text-rose-700",
      bgColor: "bg-rose-50",
    },
    {
      format: "Takeover",
      percentage: 7.9,
      color: "bg-violet-400",
      textColor: "text-violet-700",
      bgColor: "bg-violet-50",
    },
  ];

  return (
    <Card className={`p-5 overflow-hidden shadow-sm ${className}`}>
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Sales by Format
      </h3>

      <div className="space-y-4">
        {formatData.map((item) => (
          <div key={item.format}>
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center">
                <span
                  className={`inline-block w-2 h-2 rounded-full ${item.color} mr-2`}
                ></span>
                <span className="text-sm font-medium text-gray-700">
                  {item.format}
                </span>
              </div>
              <span
                className={`text-sm font-medium ${item.textColor} px-2 py-0.5 rounded-full ${item.bgColor}`}
              >
                {item.percentage}%
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
              <div
                className={`${item.color} h-2.5 rounded-full transition-all duration-500 ease-in-out`}
                style={{ width: `${item.percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
