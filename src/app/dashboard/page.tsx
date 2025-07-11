"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useSidebar } from "@/contexts/SidebarContext";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { SalesDashboard } from "@/components/dashboard/SalesDashboard";
import { ExecutiveDashboard } from "@/components/dashboard/ExecutiveDashboard";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useAuth();
  const { isCollapsed } = useSidebar();
  const [dashboardType, setDashboardType] = useState<"sales" | "executive">(
    "sales"
  );

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  const toggleDashboard = () => {
    setDashboardType(dashboardType === "sales" ? "executive" : "sales");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header
          title={
            dashboardType === "sales"
              ? "Sales Dashboard"
              : "Executive Dashboard"
          }
        />
        <main className="flex-1 overflow-y-auto">
          {dashboardType === "sales" ? (
            <SalesDashboard onToggleDashboard={toggleDashboard} />
          ) : (
            <ExecutiveDashboard onToggleDashboard={toggleDashboard} />
          )}
        </main>
      </div>
    </div>
  );
}
