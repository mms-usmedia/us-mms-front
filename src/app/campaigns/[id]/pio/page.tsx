// /src/app/campaigns/[id]/pio/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import PublisherInsertionOrderForm from "@/components/campaigns/PublisherInsertionOrderForm";
import { useAuth } from "@/contexts/AuthContext";
import { useSidebar } from "@/contexts/SidebarContext";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import Link from "next/link";
import { PublisherInsertionOrder } from "@/components/campaigns/types";
import { getMockCampaignById } from "@/components/campaigns/mockData";

// Importamos o definimos el tipo Campaign
import { Campaign } from "@/components/campaigns/types";

export default function PublisherInsertionOrderPage() {
  const router = useRouter();
  const params = useParams();
  const { user, isLoading, isAuthenticated } = useAuth();
  const {} = useSidebar();
  const [campaignData, setCampaignData] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Obtener el ID de la campaña de los parámetros de la URL
  const campaignId = Array.isArray(params.id) ? params.id[0] : params.id;

  // Redireccionar si no está autenticado
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    // Simulación de carga de datos
    // En una implementación real, aquí haría una llamada a la API
    if (campaignId) {
      setLoading(true);
      try {
        // Buscar la campaña en los datos de muestra
        const campaign = getMockCampaignById(campaignId);

        if (campaign) {
          setCampaignData(campaign);
        } else {
          setError("Campaign not found");
        }
      } catch (err) {
        setError("Error loading campaign data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  }, [campaignId]);

  const handleSavePIO = (pio: PublisherInsertionOrder) => {
    // Aquí se enviarían los datos al backend
    console.log("Saving PIO:", pio);

    // Navegar de vuelta a la página de detalles de la campaña
    router.push(`/campaigns/${campaignId}`);
  };

  const handleCancel = () => {
    // Volver a la página de detalles de la campaña
    router.push(`/campaigns/${campaignId}`);
  };

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

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700">{error}</h2>
          <p className="mt-2 text-gray-500">
            There was an error loading the campaign data.
          </p>
          <Link
            href={`/campaigns/${campaignId}`}
            className="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Return to Campaign
          </Link>
        </div>
      </div>
    );
  }

  if (!campaignData) {
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
          <div className="container mx-auto">
            {/* Encabezado con información de la campaña */}
            <div className="mb-8">
              <Link
                href={`/campaigns/${campaignId}`}
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
                Back to Campaign
              </Link>
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    Publisher Insertion Order
                  </h1>
                  <p className="text-gray-600">
                    Campaign: {campaignData.name} | ID: {campaignData.id}
                  </p>
                </div>
              </div>
            </div>

            {/* Formulario PIO */}
            <PublisherInsertionOrderForm
              campaignId={campaignData.id}
              campaignName={campaignData.name}
              adUnits={campaignData.adUnits || []}
              onSave={handleSavePIO}
              onCancel={handleCancel}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
