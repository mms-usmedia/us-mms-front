// /src/app/campaigns/[id]/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useSidebar } from "@/contexts/SidebarContext";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import StatusBadge from "@/components/ui/StatusBadge";
import Link from "next/link";

// Importar interfaces y tipos
import { Campaign, AdUnit, Document } from "@/components/campaigns/types";

// Importar componentes
import CampaignDetails from "@/components/campaigns/CampaignDetails";
import CampaignAdUnits from "@/components/campaigns/CampaignAdUnits";
import CampaignDocuments from "@/components/campaigns/CampaignDocuments";
import CampaignActivity from "@/components/campaigns/CampaignActivity";

// Importar datos mock
import { getMockCampaignById } from "@/components/campaigns/mockData";

// Componente personalizado para mostrar un badge de estado más grande en el header
const StatusBadgeLarge = ({ status }: { status: string }) => {
  // Función para obtener los estilos según el estado
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-amber-50 text-amber-700 border-amber-200 shadow-amber-100";
      case "Negotiating":
        return "bg-blue-50 text-blue-700 border-blue-200 shadow-blue-100";
      case "Won":
        return "bg-indigo-50 text-indigo-700 border-indigo-200 shadow-indigo-100";
      case "Approved":
        return "bg-green-50 text-green-700 border-green-200 shadow-green-100";
      case "Materials & Creatives OK":
        return "bg-teal-50 text-teal-700 border-teal-200 shadow-teal-100";
      case "Implementation":
        return "bg-cyan-50 text-cyan-700 border-cyan-200 shadow-cyan-100";
      case "Live":
        return "bg-violet-50 text-violet-700 border-violet-200 shadow-violet-100";
      case "Closed":
        return "bg-gray-50 text-gray-700 border-gray-200 shadow-gray-100";
      case "HUR":
        return "bg-rose-50 text-rose-700 border-rose-200 shadow-rose-100";
      case "Invoiced":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 shadow-emerald-100";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200 shadow-gray-100";
    }
  };

  // Obtener un ícono para el estado
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Pending":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "Negotiating":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9 3a1 1 0 012 0v5.5a.5.5 0 001 0V4a1 1 0 112 0v7a7 7 0 11-14 0V8a1 1 0 112 0v2.5a.5.5 0 001 0V4a1 1 0 012 0v4.5a.5.5 0 001 0V3z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "Won":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "Approved":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "Materials & Creatives OK":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z" />
            <path d="M9 13h2v5a1 1 0 11-2 0v-5z" />
          </svg>
        );
      case "Implementation":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "Live":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.05 3.636a1 1 0 010 1.414 7 7 0 000 9.9 1 1 0 11-1.414 1.414 9 9 0 010-12.728 1 1 0 011.414 0zm9.9 0a1 1 0 011.414 0 9 9 0 010 12.728 1 1 0 11-1.414-1.414 7 7 0 000-9.9 1 1 0 010-1.414zM7.879 6.464a1 1 0 010 1.414 3 3 0 000 4.243 1 1 0 11-1.415 1.414 5 5 0 010-7.07 1 1 0 011.415 0zm4.242 0a1 1 0 011.415 0 5 5 0 010 7.072 1 1 0 01-1.415-1.415 3 3 0 000-4.242 1 1 0 010-1.415zM10 9a1 1 0 011 1v.01a1 1 0 11-2 0V10a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "Closed":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "HUR":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "Invoiced":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
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
      default:
        return null;
    }
  };

  // Para los estados con nombres largos, usamos nombres más cortos
  const getDisplayName = (status: string) => {
    switch (status) {
      case "Materials & Creatives OK":
        return "Materials OK";
      default:
        return status;
    }
  };

  const styleClasses = getStatusStyle(status);
  const icon = getStatusIcon(status);

  return (
    <span
      className={`inline-flex items-center px-4 py-2 rounded-full text-base font-medium border-2 shadow-sm ${styleClasses}`}
    >
      {icon}
      {getDisplayName(status)}
    </span>
  );
};

export default function CampaignDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user, isLoading, isAuthenticated } = useAuth();
  const {} = useSidebar();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "details" | "adUnits" | "documents" | "activity"
  >("details");
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Obtener el ID de la campaña de los parámetros de la URL
  const campaignId = Array.isArray(params.id) ? params.id[0] : params.id;

  // Redireccionar si no está autenticado
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  // Cargar datos de la campaña
  useEffect(() => {
    if (campaignId) {
      // Aquí se cargarían los datos reales desde la API
      // Por ahora usamos datos de ejemplo
      const campaignData = getMockCampaignById(campaignId);
      setCampaign(campaignData || null);
      setLoading(false);

      // Cargar documentos de ejemplo
      if (campaignData) {
        setDocuments([
          {
            id: "doc1",
            name: "Campaign_Brief_2025.pdf",
            type: "application/pdf",
            size: 1024 * 1024 * 2.3, // 2.3 MB
            uploadDate: "2025-01-15T10:30:00Z",
            uploadedBy: "Luciana Egurrola",
          },
          {
            id: "doc2",
            name: "Media_Plan_Q2_2025.xlsx",
            type:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            size: 1024 * 1024 * 1.5, // 1.5 MB
            uploadDate: "2025-01-20T14:45:00Z",
            uploadedBy: "Ana Sobreyra",
          },
          {
            id: "doc3",
            name: "Creative_Assets_Final.zip",
            type: "application/zip",
            size: 1024 * 1024 * 8.7, // 8.7 MB
            uploadDate: "2025-02-05T09:15:00Z",
            uploadedBy: "Octavio Martínez",
          },
        ]);
      }
    }
  }, [campaignId]);

  // Función para guardar cambios en unidades publicitarias
  const handleSaveAdUnit = (adUnit: AdUnit) => {
    if (campaign && campaign.adUnits) {
      const updatedAdUnits = campaign.adUnits.map((unit) =>
        unit.id === adUnit.id ? adUnit : unit
      );

      setCampaign({
        ...campaign,
        adUnits: updatedAdUnits,
      });
    }
  };

  // Función para eliminar unidades publicitarias
  const handleDeleteAdUnit = (adUnitId: string) => {
    if (campaign && campaign.adUnits) {
      const updatedAdUnits = campaign.adUnits.filter(
        (unit) => unit.id !== adUnitId
      );

      setCampaign({
        ...campaign,
        adUnits: updatedAdUnits,
      });
    }
  };

  // Función para manejar la subida de documentos
  const handleFileUpload = (files: FileList) => {
    // Mostrar el estado de carga solo si hay archivos para cargar
    if (files.length > 0) {
      setIsUploading(true);
      setUploadProgress(100); // Establecer progreso al 100% inmediatamente

      // Crear los nuevos documentos sin demora
      const newDocuments = Array.from(files).map((file) => ({
        id: Math.random()
          .toString(36)
          .substring(2, 9),
        name: file.name,
        type: file.type,
        size: file.size,
        uploadDate: new Date().toISOString(),
        uploadedBy: user?.name || "User",
      }));

      // Actualizar los documentos inmediatamente
      setDocuments([...documents, ...newDocuments]);

      // Simular una breve finalización y ocultar el indicador de carga
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 300);
    }
  };

  // Función para eliminar un documento
  const handleDeleteDocument = (documentId: string) => {
    setDocuments(documents.filter((doc) => doc.id !== documentId));
  };

  // Render loading while data loads
  if (loading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700">
            Campaign not found
          </h2>
          <p className="mt-2 text-gray-500">
            The campaign you are looking for does not exist or has been deleted.
          </p>
          <Link
            href="/campaigns"
            className="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Return to Campaigns
          </Link>
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
        <Header userName={user?.name || "User"} />

        {/* Main Container */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <div className="container mx-auto transition-all duration-300 ease-in-out">
            {/* Encabezado con información de la campaña */}
            <div className="mb-8">
              <Link
                href="/campaigns"
                className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center mb-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Back to Campaigns
              </Link>
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    {campaign.name}
                  </h1>
                  <p className="text-gray-600">ID: {campaign.id}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <StatusBadgeLarge status={campaign.status} />
                  <div className="flex space-x-2">
                    <a
                      href={`https://usmedia.pipedrive.com/deal/${campaign.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-[#1aaa55] text-white rounded shadow hover:bg-[#26292c] text-sm font-medium flex items-center transition-colors"
                    >
                      Pipedrive
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 ml-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs de Navegación */}
            <div className="border-b border-gray-200 bg-white rounded-t-xl">
              <div className="px-6">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                  {[
                    { id: "details", name: "Details" },
                    { id: "adUnits", name: "Ad Units" },
                    { id: "documents", name: "Documents" },
                    { id: "activity", name: "Activity" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() =>
                        setActiveTab(
                          tab.id as
                            | "details"
                            | "adUnits"
                            | "documents"
                            | "activity"
                        )
                      }
                      className={`
                        whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                        ${
                          activeTab === tab.id
                            ? "border-indigo-500 text-indigo-600"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }
                      `}
                    >
                      {tab.name}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Contenido principal */}
            <div className="mt-6">
              {/* Pestaña de Detalles */}
              {activeTab === "details" && (
                <CampaignDetails
                  campaign={campaign}
                  onSave={(updatedCampaign) => {
                    setCampaign(updatedCampaign);
                    // Aquí iría la lógica para guardar en una API real
                    console.log("Saving campaign:", updatedCampaign);
                  }}
                />
              )}

              {/* Pestaña de Unidades Publicitarias */}
              {activeTab === "adUnits" && (
                <CampaignAdUnits
                  campaign={campaign}
                  onSaveAdUnit={handleSaveAdUnit}
                  onDeleteAdUnit={handleDeleteAdUnit}
                />
              )}

              {/* Pestaña de Documentos */}
              {activeTab === "documents" && (
                <CampaignDocuments
                  documents={documents}
                  onUpload={handleFileUpload}
                  onDelete={handleDeleteDocument}
                  isUploading={isUploading}
                  uploadProgress={uploadProgress}
                />
              )}

              {/* Pestaña de Actividad */}
              {activeTab === "activity" && (
                <CampaignActivity campaign={campaign} />
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
