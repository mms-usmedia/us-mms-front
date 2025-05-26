// /src/components/layout/Sidebar.tsx
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/contexts/SidebarContext";

// Custom SVG icons
const ModuleIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
  </svg>
);

const CampaignIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
  </svg>
);

const OrganizationIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
  </svg>
);

const ReportIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm2 10a1 1 0 10-2 0v3a1 1 0 102 0v-3zm2-3a1 1 0 011 1v5a1 1 0 11-2 0v-5a1 1 0 011-1zm4-1a1 1 0 10-2 0v7a1 1 0 102 0V8z"
      clipRule="evenodd"
    />
  </svg>
);

const SettingsIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
      clipRule="evenodd"
    />
  </svg>
);

const AccountingIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
      clipRule="evenodd"
    />
  </svg>
);

const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { isCollapsed, toggleSidebar } = useSidebar();

  // Main sections
  const mainNavigation = [
    { name: "Dashboard", href: "/dashboard", icon: ModuleIcon },
    { name: "Campaigns", href: "/campaigns", icon: CampaignIcon },
    { name: "Organizations", href: "/organizations", icon: OrganizationIcon },
    { name: "Reports", href: "/reports", icon: ReportIcon },
    { name: "Billing", href: "/accounting", icon: AccountingIcon },
    { name: "Settings", href: "/settings", icon: SettingsIcon },
  ];

  return (
    <aside
      className={`bg-white border-r border-gray-100 text-gray-900 transition-all duration-300 ease-in-out shadow-sm relative ${
        isCollapsed ? "w-24" : "w-72"
      }`}
    >
      <div className="h-full flex flex-col">
        {/* Logo and system name */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center min-w-0">
            <div
              className={`bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl p-2.5 flex items-center justify-center shadow-md flex-shrink-0 ${
                isCollapsed ? "mx-auto" : "mr-3"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
              </svg>
            </div>
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
              }`}
            >
              <h1 className="text-2xl font-bold tracking-tight whitespace-nowrap">
                MMS <span className="text-indigo-600">2.0</span>
              </h1>
            </div>
          </div>
        </div>

        {/* Navigation sections */}
        <nav className="flex-1 overflow-y-auto py-6">
          <div className={`space-y-2 ${isCollapsed ? "px-3" : "px-5"}`}>
            <div
              className={`overflow-hidden transition-opacity duration-300 ease-in-out ${
                isCollapsed ? "opacity-0 h-0 mb-0" : "opacity-100 h-auto mb-4"
              }`}
            >
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider pl-3">
                Main
              </h2>
            </div>

            {mainNavigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center rounded-xl text-base font-medium transition-all duration-300 ease-in-out ${
                  isCollapsed ? "justify-center py-3.5" : "px-4 py-3"
                } ${
                  pathname === item.href
                    ? "bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-sm"
                    : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                }`}
              >
                <item.icon
                  className={`${
                    isCollapsed ? "w-7 h-7" : "w-6 h-6 mr-3.5"
                  } transition-all duration-300 ease-in-out ${
                    pathname === item.href ? "text-indigo-500" : "text-gray-500"
                  }`}
                />
                <span
                  className={`whitespace-nowrap transition-all duration-300 ease-in-out ${
                    isCollapsed
                      ? "w-0 opacity-0 absolute"
                      : "w-auto opacity-100 relative"
                  }`}
                >
                  {item.name}
                </span>
              </Link>
            ))}
          </div>
        </nav>

        {/* System version */}
        <div className="p-4 text-sm text-gray-400 text-center transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden">
          {isCollapsed ? "v2.0" : "Media Management System v2.0"}
        </div>

        {/* Button to expand/collapse (always visible) */}
        <button
          onClick={toggleSidebar}
          className="absolute -right-4 top-1/2 transform -translate-y-1/2 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md border border-gray-200 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 transition-colors z-10"
          aria-label={isCollapsed ? "Expand menu" : "Collapse menu"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-6 w-6 transition-transform duration-300 ${
              isCollapsed ? "" : "transform rotate-180"
            }`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
