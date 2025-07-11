import React from "react";
import { Card } from "@/components/ui/card";
import Link from "next/link";

interface Client {
  id: string;
  name: string;
  campaigns: number;
  value: number;
  initial: string;
  color: string;
}

interface TopClientsProps {
  className?: string;
}

export const TopClients: React.FC<TopClientsProps> = ({ className = "" }) => {
  // Datos simulados de clientes
  const clients: Client[] = [
    {
      id: "1",
      name: "Mercado Libre",
      campaigns: 3,
      value: 89500,
      initial: "M",
      color: "bg-indigo-100 text-indigo-800",
    },
    {
      id: "2",
      name: "Coca-Cola",
      campaigns: 2,
      value: 67200,
      initial: "C",
      color: "bg-red-100 text-red-800",
    },
    {
      id: "3",
      name: "Samsung",
      campaigns: 1,
      value: 45300,
      initial: "S",
      color: "bg-blue-100 text-blue-800",
    },
    {
      id: "4",
      name: "Fandom",
      campaigns: 1,
      value: 38700,
      initial: "F",
      color: "bg-purple-100 text-purple-800",
    },
  ];

  return (
    <Card className={`p-5 ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Top Clients</h3>
        <Link
          href="/organizations"
          className="text-sm text-orange-600 hover:text-orange-800 font-medium"
        >
          View All
        </Link>
      </div>

      <div className="space-y-4">
        {clients.map((client) => (
          <div key={client.id} className="flex items-center justify-between">
            <div className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${client.color}`}
              >
                <span className="font-medium">{client.initial}</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  {client.name}
                </p>
                <p className="text-xs text-gray-500">
                  {client.campaigns} campaigns
                </p>
              </div>
            </div>
            <span className="font-medium text-gray-900">
              ${client.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
};
