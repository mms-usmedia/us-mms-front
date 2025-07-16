"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import Link from "next/link";

// Importar interfaces y tipos
import { Campaign, AdUnit, Document } from "@/components/campaigns/types";

// Importar componentes
import CampaignDetails from "@/components/campaigns/CampaignDetails";
import CampaignAdUnits from "@/components/campaigns/CampaignAdUnits";
import CampaignDocuments from "@/components/campaigns/CampaignDocuments";
import CampaignActivityEmpty from "@/components/campaigns/CampaignActivityEmpty";

export default function NewProgrammaticCampaignPage() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<
    "details" | "adUnits" | "documents" | "activity"
  >("details");
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [campaign, setCampaign] = useState<Campaign>({
    id: "new", // Temporal ID para nueva campaña
    name: "",
    campaignType: "Programmatic", // Añadido el tipo de campaña requerido
    organizationType: "Publisher", // Las campañas programáticas siempre son con Publishers
    startDate: "",
    endDate: "",
    status: "Pending",
    units: 0,
    budget: 0,
    grossMargin: 0, // Margen inicial para programática
    // Campos específicos para programática
    salesperson: "",
    trafficker: "",
    customer: "", // El advertiser que comprará directamente en el DSP
    notes: "",
    internalNotes: "",
    billingParty: "", // Publisher que pagará la comisión
    billingOffice: "Miami", // Siempre Miami para programática
    accountManager: "",
    adOpsLeader: "",
    industry: "",
    adUnits: [],
    commissionRate: 15, // Nueva propiedad para programática: tasa de comisión
    dspUsed: "DV 360", // Nueva propiedad para programática: DSP utilizado
    programmaticType: "Standard", // Nueva propiedad: Standard, PMP, o PG
  });

  // Redireccionar si no está autenticado
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  // Función para guardar cambios en la campaña
  const handleSaveCampaign = (updatedCampaign: Campaign) => {
    setCampaign(updatedCampaign);
    // Aquí se guardaría en el backend
    console.log("Saving campaign:", updatedCampaign);
  };

  // Función para guardar cambios en unidades publicitarias
  const handleSaveAdUnit = (adUnit: AdUnit) => {
    if (campaign) {
      // Si la unidad ya existe, actualizarla
      if (
        campaign.adUnits &&
        campaign.adUnits.some((unit) => unit.id === adUnit.id)
      ) {
        const updatedAdUnits = campaign.adUnits.map((unit) =>
          unit.id === adUnit.id ? adUnit : unit
        );

        setCampaign({
          ...campaign,
          adUnits: updatedAdUnits,
        });
      }
      // Si es nueva, agregarla
      else {
        setCampaign({
          ...campaign,
          adUnits: [...(campaign.adUnits || []), adUnit],
        });
      }
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
    if (files.length > 0) {
      setIsUploading(true);
      setUploadProgress(30);

      // Simular progreso
      setTimeout(() => {
        setUploadProgress(60);

        setTimeout(() => {
          setUploadProgress(100);

          // Crear nuevos documentos
          const newDocuments = Array.from(files).map((file) => ({
            id: Math.random().toString(36).substring(2, 9),
            name: file.name,
            type: file.type,
            size: file.size,
            uploadDate: new Date().toISOString(),
            uploadedBy: user?.name || "Usuario",
          }));

          setDocuments([...documents, ...newDocuments]);

          // Finalizar subida
          setTimeout(() => {
            setIsUploading(false);
            setUploadProgress(0);
          }, 500);
        }, 500);
      }, 500);
    }
  };

  // Función para eliminar un documento
  const handleDeleteDocument = (documentId: string) => {
    setDocuments(documents.filter((doc) => doc.id !== documentId));
  };

  // Función para guardar la campaña completa
  const _handleSubmitCampaign = async () => {
    try {
      // Aquí se enviarían los datos al backend
      // Incluir unidades y documentos
      const completeData = {
        ...campaign,
        documents: documents,
      };

      console.log("Submitting complete campaign:", completeData);

      // Simulamos una espera
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Redireccionar a la lista de campañas
      router.push("/campaigns");
    } catch (error) {
      console.error("Error al crear la campaña:", error);
    }
  };

  // Mostrar carga mientras se verifica autenticación
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
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
          <div className="container mx-auto transition-all duration-300 ease-in-out">
            {/* Encabezado con información de la campaña */}
            <div className="mb-8">
              <Link
                href="/campaigns/new"
                className="text-orange-600 hover:text-orange-800 text-sm flex items-center mb-2"
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
                    New Programmatic Campaign
                  </h1>
                  <p className="text-gray-600">
                    Create a campaign where the customer accesses the DSP
                    directly and US Media receives commissions
                  </p>
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
                            ? "border-gray-700 text-gray-800"
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
                  onSave={handleSaveCampaign}
                  editMode={true} // Siempre en modo edición
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

              {/* Pestaña de Actividad - Vacía para nuevas campañas */}
              {activeTab === "activity" && <CampaignActivityEmpty />}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
