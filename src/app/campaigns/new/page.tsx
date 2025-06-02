"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import Link from "next/link";

export default function NewCampaignTypePage() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useAuth();

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  // Show loading while verifying authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden transition-all duration-300 ease-in-out">
        {/* Header */}
        <Header userName={user?.name || "Usuario"} />

        {/* Main Container */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <div className="container mx-auto max-w-4xl transition-all duration-300 ease-in-out">
            <div className="mb-8">
              <div className="flex items-center mb-6">
                <Link
                  href="/campaigns"
                  className="text-indigo-600 hover:text-indigo-800 mr-3"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
                <h1 className="text-2xl font-bold text-gray-800">
                  Select Campaign Type
                </h1>
              </div>

              <div className="bg-white rounded-xl shadow-md p-8">
                <h2 className="text-xl font-semibold text-gray-700 mb-6">
                  What type of campaign would you like to create?
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* IO-Based Campaign Card */}
                  <div
                    className="border rounded-lg hover:shadow-lg transition-all duration-200 cursor-pointer bg-white overflow-hidden group"
                    onClick={() => router.push("/campaigns/new/io-based")}
                  >
                    <div className="border-b border-gray-100 bg-blue-50 p-4">
                      <h3 className="text-lg font-medium text-gray-800 group-hover:text-indigo-700 transition-colors">
                        IO-Based Campaign (Traditional)
                      </h3>
                    </div>
                    <div className="p-5">
                      <p className="text-gray-600 mb-4">
                        Traditional campaigns where US Media manages the entire
                        process from negotiation to implementation.
                      </p>
                      <ul className="text-sm text-gray-600 space-y-2">
                        <li className="flex items-start">
                          <svg
                            className="h-5 w-5 text-green-500 mr-2 flex-shrink-0"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span>US Media handles media buying</span>
                        </li>
                        <li className="flex items-start">
                          <svg
                            className="h-5 w-5 text-green-500 mr-2 flex-shrink-0"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span>
                            Traffic and implementation managed by our team
                          </span>
                        </li>
                        <li className="flex items-start">
                          <svg
                            className="h-5 w-5 text-green-500 mr-2 flex-shrink-0"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span>Client pays US Media</span>
                        </li>
                      </ul>
                    </div>
                    <div className="bg-gray-50 px-5 py-3 text-right">
                      <button className="text-indigo-600 font-medium text-sm hover:text-indigo-800 transition-colors inline-flex items-center">
                        Create IO-Based Campaign
                        <svg
                          className="ml-1 h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Programmatic Campaign Card */}
                  <div
                    className="border rounded-lg hover:shadow-lg transition-all duration-200 cursor-pointer bg-white overflow-hidden group"
                    onClick={() => router.push("/campaigns/new/programmatic")}
                  >
                    <div className="border-b border-gray-100 bg-purple-50 p-4">
                      <h3 className="text-lg font-medium text-gray-800 group-hover:text-indigo-700 transition-colors">
                        Programmatic Campaign
                      </h3>
                    </div>
                    <div className="p-5">
                      <p className="text-gray-600 mb-4">
                        Campaigns where the client manages buying directly
                        through a DSP, generating commissions for US Media.
                      </p>
                      <ul className="text-sm text-gray-600 space-y-2">
                        <li className="flex items-start">
                          <svg
                            className="h-5 w-5 text-green-500 mr-2 flex-shrink-0"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span>Client accesses DSP directly</span>
                        </li>
                        <li className="flex items-start">
                          <svg
                            className="h-5 w-5 text-green-500 mr-2 flex-shrink-0"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span>Commissions received from Publishers</span>
                        </li>
                        <li className="flex items-start">
                          <svg
                            className="h-5 w-5 text-green-500 mr-2 flex-shrink-0"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span>Exclusive targeting as an EAP</span>
                        </li>
                      </ul>
                    </div>
                    <div className="bg-gray-50 px-5 py-3 text-right">
                      <button className="text-indigo-600 font-medium text-sm hover:text-indigo-800 transition-colors inline-flex items-center">
                        Create Programmatic Campaign
                        <svg
                          className="ml-1 h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
