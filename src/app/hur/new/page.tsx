"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { mockCampaigns } from "@/components/campaigns/mockData";
import { Campaign, AdUnit } from "@/components/campaigns/types";

// Componente interno que usa useSearchParams
function HURRequestContent() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const campaignId = searchParams.get("campaignId");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(
    null
  );
  const [selectedAdUnits, setSelectedAdUnits] = useState<string[]>([]);
  const [adUnitPrices, setAdUnitPrices] = useState<{ [key: string]: number }>(
    {}
  );
  const [justification, setJustification] = useState("");

  // Load campaign data when component mounts
  useEffect(() => {
    if (campaignId) {
      const campaign = mockCampaigns.find((c) => c.id === campaignId);
      if (campaign) {
        setSelectedCampaign(campaign);

        // Inicializar los precios actuales de las ad units
        if (campaign.adUnits) {
          const initialPrices: { [key: string]: number } = {};
          campaign.adUnits.forEach((unit) => {
            initialPrices[unit.id] = unit.customerInvestment;
          });
          setAdUnitPrices(initialPrices);
        }
      } else {
        // Si no se encuentra la campaña, redirigir a la lista de campañas
        router.push("/campaigns");
      }
    } else {
      // Si no hay ID de campaña en la URL, redirigir a la lista de campañas
      router.push("/campaigns");
    }
  }, [campaignId, router]);

  // Handle ad unit selection
  const handleAdUnitToggle = (adUnitId: string) => {
    setSelectedAdUnits((prev) => {
      if (prev.includes(adUnitId)) {
        return prev.filter((id) => id !== adUnitId);
      } else {
        return [...prev, adUnitId];
      }
    });
  };

  // Handle select all ad units
  const handleSelectAllAdUnits = () => {
    if (selectedCampaign && selectedCampaign.adUnits) {
      if (selectedAdUnits.length === selectedCampaign.adUnits.length) {
        // If all are selected, deselect all
        setSelectedAdUnits([]);
      } else {
        // Select all
        setSelectedAdUnits(selectedCampaign.adUnits.map((unit) => unit.id));
      }
    }
  };

  // Handle ad unit price change
  const handlePriceChange = (adUnitId: string, newPrice: number) => {
    setAdUnitPrices((prev) => ({
      ...prev,
      [adUnitId]: newPrice,
    }));
  };

  // Calculate totals
  const calculateTotals = () => {
    if (!selectedCampaign || !selectedCampaign.adUnits)
      return { current: 0, new: 0 };

    let currentTotal = 0;
    let newTotal = 0;

    selectedCampaign.adUnits.forEach((unit) => {
      if (selectedAdUnits.includes(unit.id)) {
        currentTotal += unit.customerInvestment;
        newTotal += adUnitPrices[unit.id] || unit.customerInvestment;
      }
    });

    return { current: currentTotal, new: newTotal };
  };

  const totals = calculateTotals();

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Preparar los datos de líneas seleccionadas
    const selectedLines =
      selectedCampaign?.adUnits
        ?.filter((unit) => selectedAdUnits.includes(unit.id))
        .map((unit) => unit.line) || [];

    // Preparar los datos de publishers IO numbers
    const publisherIOs = new Set<string>();
    selectedCampaign?.adUnits
      ?.filter((unit) => selectedAdUnits.includes(unit.id))
      .forEach((unit) => {
        publisherIOs.add(unit.publisher);
      });

    // En una aplicación real, esto haría una llamada a la API para crear la solicitud HUR
    // Por ahora, simularemos una presentación exitosa
    setTimeout(() => {
      setIsSubmitting(false);
      // Navegar de vuelta a la página de la campaña
      router.push(`/campaigns/${campaignId}`);
    }, 1500);
  };

  // Formatear moneda
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  if (!selectedCampaign) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700">Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header userName={user?.name || "User"} />

        {/* Main Container */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <div className="container mx-auto">
            {/* Page header */}
            <div className="mb-8">
              <Link
                href={`/campaigns/${campaignId}`}
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
                Back to Campaign
              </Link>
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    New HUR Request
                  </h1>
                  <p className="text-gray-500 mt-1">
                    Create a new Historical Update Request for{" "}
                    {selectedCampaign.name}
                  </p>
                </div>
              </div>
            </div>

            {/* HUR Request Form */}
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left column - Campaign Information */}
                <div className="lg:col-span-2 space-y-6">
                  <Card className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-100">
                    <div className="bg-orange-50 border-b border-orange-100 px-4 py-3">
                      <h2 className="text-base font-medium text-orange-600 flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2 text-orange-500"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Campaign Information
                      </h2>
                    </div>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm font-medium text-gray-500 mb-1">
                            Campaign ID
                          </p>
                          <p className="text-base font-medium text-gray-900">
                            {selectedCampaign.id}
                          </p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm font-medium text-gray-500 mb-1">
                            Campaign Name
                          </p>
                          <p className="text-base font-medium text-gray-900">
                            {selectedCampaign.name}
                          </p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm font-medium text-gray-500 mb-1">
                            Billing Office
                          </p>
                          <p className="text-base font-medium text-gray-900">
                            {selectedCampaign.billingOffice}
                          </p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm font-medium text-gray-500 mb-1">
                            Status
                          </p>
                          <p className="text-base font-medium text-gray-900">
                            {selectedCampaign.status}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* HUR Justification */}
                  <Card className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-100">
                    <div className="bg-orange-50 border-b border-orange-100 px-4 py-3">
                      <h2 className="text-base font-medium text-orange-600 flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2 text-orange-500"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                        HUR Justification
                      </h2>
                    </div>
                    <CardContent className="p-6">
                      <div>
                        <label
                          htmlFor="justification"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Justification *
                        </label>
                        <textarea
                          id="justification"
                          rows={4}
                          value={justification}
                          onChange={(e) => setJustification(e.target.value)}
                          placeholder="Explain clearly what, why and what for you are requesting this HUR (change)."
                          className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                          required
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Ad Unit Selection */}
                  {selectedCampaign.adUnits && (
                    <Card className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-100">
                      <div className="bg-orange-50 border-b border-orange-100 px-4 py-3">
                        <h2 className="text-base font-medium text-orange-600 flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-2 text-orange-500"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
                          </svg>
                          Select Ad Units to Modify
                        </h2>
                      </div>
                      <CardContent className="p-6">
                        <div className="mb-4 flex justify-between items-center">
                          <Button
                            type="button"
                            onClick={handleSelectAllAdUnits}
                            variant="outline"
                            className="text-orange-600 border-orange-300 hover:bg-orange-50"
                          >
                            {selectedAdUnits.length ===
                            selectedCampaign.adUnits.length
                              ? "Deselect All Ad Units"
                              : "Select All Ad Units"}
                          </Button>
                          <div className="text-sm text-gray-500">
                            {selectedAdUnits.length} of{" "}
                            {selectedCampaign.adUnits.length} ad units selected
                          </div>
                        </div>

                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  Select
                                </th>
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  Line
                                </th>
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  Publisher
                                </th>
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  Format
                                </th>
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  Current Amount
                                </th>
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  New Amount
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {selectedCampaign.adUnits.map((adUnit) => (
                                <tr
                                  key={adUnit.id}
                                  onClick={(e) => {
                                    // Solo activar el toggle si no se hizo clic en el input o en el checkbox
                                    if (
                                      e.target instanceof HTMLInputElement ||
                                      e.target instanceof HTMLButtonElement
                                    ) {
                                      return;
                                    }
                                    handleAdUnitToggle(adUnit.id);
                                  }}
                                  className={`cursor-pointer hover:bg-gray-50 ${
                                    selectedAdUnits.includes(adUnit.id)
                                      ? "bg-orange-50"
                                      : ""
                                  }`}
                                >
                                  <td
                                    className="px-6 py-4 whitespace-nowrap"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={selectedAdUnits.includes(
                                        adUnit.id
                                      )}
                                      onChange={() =>
                                        handleAdUnitToggle(adUnit.id)
                                      }
                                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                                    />
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {adUnit.line}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {adUnit.publisher}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {adUnit.format} - {adUnit.size}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {formatCurrency(adUnit.customerInvestment)}
                                  </td>
                                  <td
                                    className="px-6 py-4 whitespace-nowrap"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <Input
                                      type="number"
                                      value={
                                        adUnitPrices[adUnit.id] ||
                                        adUnit.customerInvestment
                                      }
                                      onChange={(e) =>
                                        handlePriceChange(
                                          adUnit.id,
                                          parseFloat(e.target.value)
                                        )
                                      }
                                      disabled={
                                        !selectedAdUnits.includes(adUnit.id)
                                      }
                                      className="w-32"
                                    />
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {/* Totals */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm font-medium text-gray-500 mb-1">
                              Current Total Amount
                            </p>
                            <p className="text-lg font-semibold text-gray-900">
                              {formatCurrency(totals.current)}
                            </p>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm font-medium text-gray-500 mb-1">
                              New Total Amount
                            </p>
                            <p className="text-lg font-semibold text-green-600">
                              {formatCurrency(totals.new)}
                            </p>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm font-medium text-gray-500 mb-1">
                              Difference
                            </p>
                            <p
                              className={`text-lg font-semibold ${
                                totals.new - totals.current > 0
                                  ? "text-green-600"
                                  : totals.new - totals.current < 0
                                  ? "text-red-600"
                                  : "text-gray-900"
                              }`}
                            >
                              {formatCurrency(totals.new - totals.current)}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Right column - Submit */}
                <div className="space-y-6">
                  <Card className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-100">
                    <div className="bg-orange-50 border-b border-orange-100 px-4 py-3">
                      <h2 className="text-base font-medium text-orange-600 flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2 text-orange-500"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Submit Request
                      </h2>
                    </div>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <p className="text-gray-600 text-sm">
                          Please review all information before submitting your
                          HUR request. Once submitted, the request will be sent
                          to the approval board for review.
                        </p>
                        <Button
                          type="submit"
                          className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                          disabled={
                            isSubmitting ||
                            !justification ||
                            selectedAdUnits.length === 0
                          }
                        >
                          {isSubmitting
                            ? "Submitting..."
                            : "Submit HUR Request"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-100">
                    <div className="bg-orange-50 border-b border-orange-100 px-4 py-3">
                      <h2 className="text-base font-medium text-orange-600 flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2 text-orange-500"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                            clipRule="evenodd"
                          />
                        </svg>
                        HUR Process Information
                      </h2>
                    </div>
                    <CardContent className="p-6">
                      <div className="space-y-4 text-sm text-gray-600">
                        <div>
                          <h3 className="font-medium text-gray-800 mb-1">
                            When can I request a HUR?
                          </h3>
                          <p>
                            HUR must be requested from the 11th day of each
                            month (or the next business day) until the last
                            business day of the month.
                          </p>
                        </div>

                        <div>
                          <h3 className="font-medium text-gray-800 mb-1">
                            Approval process:
                          </h3>
                          <p>
                            The Board Team has 3 business days to approve or
                            reject the request.
                          </p>
                        </div>

                        <div>
                          <h3 className="font-medium text-gray-800 mb-1">
                            After approval:
                          </h3>
                          <p>
                            The AdOps Leader will open the billing period so the
                            campaign can be edited.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}

// Componente principal que envuelve el contenido en un Suspense
export default function NewHURRequestPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <HURRequestContent />
    </Suspense>
  );
}
