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
                  <p className="text-gray-600">
                    ID: {campaign.id} | Organization:{" "}
                    {campaign.organizationType}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <StatusBadge status={campaign.status} size="lg" />
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
