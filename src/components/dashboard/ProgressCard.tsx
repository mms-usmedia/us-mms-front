import React from "react";
import { Card } from "@/components/ui/card";

interface ProgressCardProps {
  title: string;
  percentage: number;
  currentValue: string;
  targetValue: string;
  icon: React.ReactNode;
  className?: string;
  color?: "blue" | "green" | "purple" | "orange" | "indigo" | "teal" | "pink";
}

export const ProgressCard: React.FC<ProgressCardProps> = ({
  title,
  percentage,
  currentValue,
  targetValue,
  icon,
  className = "",
  color = "indigo",
}) => {
  // Asegurar que el porcentaje esté entre 0 y 100
  const safePercentage = Math.min(100, Math.max(0, percentage));

  // Mapa de colores para los diferentes elementos de la tarjeta
  const colorMap = {
    blue: {
      bg: "bg-blue-50",
      border: "border-blue-100",
      icon: "text-blue-500",
      light: "bg-blue-500/10",
      accent: "bg-blue-500",
      bar: "bg-blue-500",
    },
    green: {
      bg: "bg-green-50",
      border: "border-green-100",
      icon: "text-green-500",
      light: "bg-green-500/10",
      accent: "bg-green-500",
      bar: "bg-green-500",
    },
    purple: {
      bg: "bg-purple-50",
      border: "border-purple-100",
      icon: "text-purple-500",
      light: "bg-purple-500/10",
      accent: "bg-purple-500",
      bar: "bg-purple-500",
    },
    orange: {
      bg: "bg-orange-50",
      border: "border-orange-100",
      icon: "text-orange-500",
      light: "bg-orange-500/10",
      accent: "bg-orange-500",
      bar: "bg-orange-500",
    },
    indigo: {
      bg: "bg-indigo-50",
      border: "border-indigo-100",
      icon: "text-indigo-500",
      light: "bg-indigo-500/10",
      accent: "bg-indigo-500",
      bar: "bg-indigo-500",
    },
    teal: {
      bg: "bg-teal-50",
      border: "border-teal-100",
      icon: "text-teal-500",
      light: "bg-teal-500/10",
      accent: "bg-teal-500",
      bar: "bg-teal-500",
    },
    pink: {
      bg: "bg-pink-50",
      border: "border-pink-100",
      icon: "text-pink-500",
      light: "bg-pink-500/10",
      accent: "bg-pink-500",
      bar: "bg-pink-500",
    },
  };

  const colors = colorMap[color];

  return (
    <Card
      className={`p-0 overflow-hidden relative shadow-sm hover:shadow-md transition-shadow duration-300 ${className}`}
    >
      {/* Barra de acento superior */}
      <div className={`h-1 w-full ${colors.accent}`}></div>

      <div className="p-5">
        <div className="flex justify-between items-start">
          <div className="flex-grow">
            <h3 className="text-sm font-medium text-gray-500">{title}</h3>
            <div className="mt-2">
              <p className="text-2xl font-bold text-gray-900">
                {percentage.toFixed(1)}%
              </p>
              <p className="mt-1 text-xs text-gray-500">
                {currentValue} de {targetValue}
              </p>
            </div>
            <div className="mt-3 w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
              <div
                className={`${colors.bar} h-2.5 rounded-full transition-all duration-500 ease-in-out`}
                style={{ width: `${safePercentage}%` }}
              ></div>
            </div>
          </div>
          <div className={`rounded-full p-3 ${colors.light} ${colors.icon}`}>
            {icon}
          </div>
        </div>
      </div>
    </Card>
  );
};
