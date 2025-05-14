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

  // Redireccionar si no está autenticado
  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  // Mostrar carga mientras se verifica autenticación
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
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
                  Seleccionar Tipo de Campaña
                </h1>
              </div>

              <div className="bg-white rounded-xl shadow-md p-8">
                <h2 className="text-xl font-semibold text-gray-700 mb-6">
                  ¿Qué tipo de campaña deseas crear?
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* IO-Based Campaign Card */}
                  <div
                    className="border rounded-lg hover:shadow-lg transition-all duration-200 cursor-pointer bg-white overflow-hidden group"
                    onClick={() => router.push("/campaigns/new/io-based")}
                  >
                    <div className="border-b border-gray-100 bg-blue-50 p-4">
                      <h3 className="text-lg font-medium text-gray-800 group-hover:text-indigo-700 transition-colors">
                        Campaña IO-Based (Tradicional)
                      </h3>
                    </div>
                    <div className="p-5">
                      <p className="text-gray-600 mb-4">
                        Campañas tradicionales donde US Media gestiona todo el
                        proceso desde la negociación hasta la implementación.
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
                          <span>US Media maneja la compra de medios</span>
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
                            Tráfico e implementación gestionados por nuestro
                            equipo
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
                          <span>El cliente paga a US Media</span>
                        </li>
                      </ul>
                    </div>
                    <div className="bg-gray-50 px-5 py-3 text-right">
                      <button className="text-indigo-600 font-medium text-sm hover:text-indigo-800 transition-colors inline-flex items-center">
                        Crear Campaña IO-Based
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
                        Campaña Programática
                      </h3>
                    </div>
                    <div className="p-5">
                      <p className="text-gray-600 mb-4">
                        Campañas donde el cliente gestiona la compra
                        directamente en un DSP, generando comisiones para US
                        Media.
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
                          <span>El cliente accede directamente al DSP</span>
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
                          <span>Comisiones recibidas de los Publishers</span>
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
                          <span>Segmentación exclusiva por ser EAP</span>
                        </li>
                      </ul>
                    </div>
                    <div className="bg-gray-50 px-5 py-3 text-right">
                      <button className="text-indigo-600 font-medium text-sm hover:text-indigo-800 transition-colors inline-flex items-center">
                        Crear Campaña Programática
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
