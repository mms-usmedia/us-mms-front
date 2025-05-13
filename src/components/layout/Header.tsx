// src/components/layout/Header.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

interface HeaderProps {
  userName: string;
}

const Header: React.FC<HeaderProps> = ({ userName }) => {
  const { logout } = useAuth();
  const [openProfile, setOpenProfile] = useState(false);
  const [openNotifications, setOpenNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Example notifications
  const notifications = [
    {
      id: 1,
      content: 'Campaign "LiveNation_Brasil_Bad Bunny" has been approved',
      time: "10 min",
      read: false,
    },
    {
      id: 2,
      content: 'Expires today: "Mercedes Benz_GLE 400 EQ TECH"',
      time: "30 min",
      read: false,
    },
    {
      id: 3,
      content: 'New campaign created: "Coca Cola_Panama_Share a Coke"',
      time: "2 h",
      read: true,
    },
    {
      id: 4,
      content: 'Budget limit "Embratur_Americas" is at 90%',
      time: "5 h",
      read: true,
    },
  ];

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenProfile(false);
      }

      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setOpenNotifications(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement global search in the future
    console.log("Searching:", searchQuery);
  };

  return (
    <header className="bg-white border-b border-gray-100 shadow-sm z-10">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Space to balance design - logo and text removed */}
        <div className="w-10"></div>

        {/* Global search bar */}
        <div className="flex-1 mx-8">
          <form onSubmit={handleSearch} className="w-full">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-full bg-gray-50 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm !text-gray-900 placeholder-gray-500"
                placeholder="Search across the application..."
                style={{ color: "#1f2937" }}
              />
            </div>
          </form>
        </div>

        {/* User controls */}
        <div className="flex items-center">
          {/* Notifications button */}
          <div className="relative mr-4" ref={notificationRef}>
            <button
              onClick={() => {
                setOpenNotifications(!openNotifications);
                setOpenProfile(false);
              }}
              className="relative p-1 text-gray-600 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-full"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
            </button>

            {/* Notifications menu */}
            {openNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-20">
                <div className="py-2 px-4 bg-gradient-to-r from-indigo-700 to-indigo-500 rounded-t-md">
                  <h3 className="text-sm font-medium text-white">
                    Notifications
                  </h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length > 0 ? (
                    <div className="py-2">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`px-4 py-3 hover:bg-gray-50 transition-colors ${
                            !notification.read
                              ? "border-l-4 border-indigo-500"
                              : ""
                          }`}
                        >
                          <p className="text-sm text-gray-700">
                            {notification.content}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {notification.time} ago
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-4 px-4 text-sm text-gray-700 text-center">
                      You have no notifications
                    </div>
                  )}
                </div>
                <div className="py-2 px-4 bg-gray-50 rounded-b-md border-t border-gray-100">
                  <Link
                    href="/notifications"
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    View all notifications
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Profile button */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => {
                setOpenProfile(!openProfile);
                setOpenNotifications(false);
              }}
              className="flex items-center text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-full"
            >
              <div className="h-9 w-9 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 flex items-center justify-center text-white font-medium shadow-md">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="ml-2 hidden md:block">
                <div className="text-sm font-medium text-gray-800">
                  {userName}
                </div>
                <div className="text-xs text-gray-500">Administrator</div>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-1 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {/* Profile dropdown menu */}
            {openProfile && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-20">
                <div className="py-1">
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                  >
                    My Profile
                  </Link>
                  <Link
                    href="/settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                  >
                    Settings
                  </Link>
                  <div className="border-t border-gray-100 my-1"></div>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                  >
                    Log Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
