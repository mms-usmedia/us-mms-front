import React from "react";
import { Card } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  subtitle?: string;
  trend?: {
    value: string;
    positive: boolean;
  };
  className?: string;
  color?: "blue" | "green" | "purple" | "orange" | "indigo" | "teal" | "pink";
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  subtitle,
  trend,
  className = "",
  color = "blue",
}) => {
  // Mapa de colores para los diferentes elementos de la tarjeta
  const colorMap = {
    blue: {
      bg: "bg-blue-50",
      border: "border-blue-100",
      icon: "text-blue-500",
      light: "bg-blue-500/10",
      accent: "bg-blue-500",
    },
    green: {
      bg: "bg-green-50",
      border: "border-green-100",
      icon: "text-green-500",
      light: "bg-green-500/10",
      accent: "bg-green-500",
    },
    purple: {
      bg: "bg-purple-50",
      border: "border-purple-100",
      icon: "text-purple-500",
      light: "bg-purple-500/10",
      accent: "bg-purple-500",
    },
    orange: {
      bg: "bg-orange-50",
      border: "border-orange-100",
      icon: "text-orange-500",
      light: "bg-orange-500/10",
      accent: "bg-orange-500",
    },
    indigo: {
      bg: "bg-indigo-50",
      border: "border-indigo-100",
      icon: "text-indigo-500",
      light: "bg-indigo-500/10",
      accent: "bg-indigo-500",
    },
    teal: {
      bg: "bg-teal-50",
      border: "border-teal-100",
      icon: "text-teal-500",
      light: "bg-teal-500/10",
      accent: "bg-teal-500",
    },
    pink: {
      bg: "bg-pink-50",
      border: "border-pink-100",
      icon: "text-pink-500",
      light: "bg-pink-500/10",
      accent: "bg-pink-500",
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
          <div>
            <h3 className="text-sm font-medium text-gray-500">{title}</h3>
            <div className="mt-2 flex items-baseline">
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              {trend && (
                <span
                  className={`ml-2 flex items-center text-sm font-medium ${
                    trend.positive ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {trend.positive ? (
                    <svg
                      className="self-center flex-shrink-0 h-4 w-4 text-green-500 mr-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 10l7-7m0 0l7 7m-7-7v18"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="self-center flex-shrink-0 h-4 w-4 text-red-500 mr-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                      />
                    </svg>
                  )}
                  {trend.value}
                </span>
              )}
            </div>
            {subtitle && (
              <p className="mt-1 text-xs text-gray-500">{subtitle}</p>
            )}
          </div>
          <div className={`rounded-full p-3 ${colors.light} ${colors.icon}`}>
            {icon}
          </div>
        </div>
      </div>
    </Card>
  );
};
