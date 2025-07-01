import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string;
  change?: string;
  isPositive?: boolean;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  isPositive = true,
}) => {
  return (
    <Card className="bg-white border border-gray-100 shadow-sm">
      <CardContent className="pt-6">
        <div className="space-y-2">
          <p className="text-sm text-gray-500">{title}</p>
          <h2 className="text-3xl font-bold text-gray-900">{value}</h2>
          {change && (
            <p
              className={`text-sm ${
                isPositive ? "text-green-500" : "text-red-500"
              }`}
            >
              {change} vs. last month
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
