// src/app/dashboard/page.tsx
"use client";

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function DashboardPage() {
  const { user, logout, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header de la aplicación */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-blue-600 rounded-md flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-800">MMS 2.0</h1>
          </div>
          
          <div className="flex items-center">
            <span className="mr-4 text-sm text-gray-600">
              Welcome, {user?.name || 'User'}
            </span>
            <button
              onClick={() => logout()}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-md transition duration-150 ease-in-out"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Módulos cards */}
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
              <div className="flex items-center mb-4">
                <div className="bg-blue-500 rounded-md p-2 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg text-gray-800">Online</h3>
              </div>
              <p className="text-gray-600 text-sm">Manage your online campaigns and digital ad spaces.</p>
              <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-md transition duration-150 ease-in-out w-full">
                Access Module
              </button>
            </div>

            <div className="bg-purple-50 rounded-lg p-6 border border-purple-100">
              <div className="flex items-center mb-4">
                <div className="bg-purple-500 rounded-md p-2 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg text-gray-800">Offline</h3>
              </div>
              <p className="text-gray-600 text-sm">Manage your offline media campaigns like TV and radio.</p>
              <button className="mt-4 bg-purple-600 hover:bg-purple-700 text-white text-sm px-4 py-2 rounded-md transition duration-150 ease-in-out w-full">
                Coming Soon
              </button>
            </div>

            <div className="bg-green-50 rounded-lg p-6 border border-green-100">
              <div className="flex items-center mb-4">
                <div className="bg-green-500 rounded-md p-2 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg text-gray-800">Out of Home</h3>
              </div>
              <p className="text-gray-600 text-sm">Manage your outdoor advertising and billboards.</p>
              <button className="mt-4 bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-md transition duration-150 ease-in-out w-full">
                Coming Soon
              </button>
            </div>

            <div className="bg-red-50 rounded-lg p-6 border border-red-100">
              <div className="flex items-center mb-4">
                <div className="bg-red-500 rounded-md p-2 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg text-gray-800">Broadcast</h3>
              </div>
              <p className="text-gray-600 text-sm">Manage your broadcast media and streaming campaigns.</p>
              <button className="mt-4 bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded-md transition duration-150 ease-in-out w-full">
                Coming Soon
              </button>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Activities</h3>
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <p className="text-gray-600 text-center">No recent activities to display.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
