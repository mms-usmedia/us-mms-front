"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  mockHURRequests,
  HURRequest,
  HURStatus,
} from "@/components/hur/mockData";
import HURStatusBadge from "@/components/hur/HURStatusBadge";
import RequestMoreInfoModal from "@/components/hur/RequestMoreInfoModal";
import Link from "next/link";

export default function HURDetailPage() {
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const [hurRequest, setHurRequest] = useState<HURRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [nextStatus, setNextStatus] = useState<HURStatus | null>(null);
  const [isMoreInfoModalOpen, setIsMoreInfoModalOpen] = useState(false);

  useEffect(() => {
    // Find the HUR request with the matching ID
    const id = params.id as string;
    const request = mockHURRequests.find((req) => req.id === id);

    if (request) {
      setHurRequest(request);
      // Determine the next status based on the current status
      setNextStatus(getNextStatus(request.status));
    }

    setLoading(false);
  }, [params.id]);

  // Format currency
  const formatCurrency = (amount: number) => {
    if (amount === undefined || amount === null) return "-";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    }).format(date);
  };

  // Get the next status in the HUR workflow
  const getNextStatus = (currentStatus: HURStatus): HURStatus | null => {
    switch (currentStatus) {
      case "Review":
        return "Approved";
      case "More Info":
        return "Approved";
      case "Approved":
        return "Remove Invoice";
      case "Remove Invoice":
        return "Re-open Campaign";
      case "Re-open Campaign":
        return "Editing";
      case "Editing":
        return "Close Campaign";
      case "Close Campaign":
        return "Close Invoice Period";
      case "Close Invoice Period":
        return "Completed";
      default:
        return null;
    }
  };

  // Get button color based on the next status
  const getButtonColor = (status: HURStatus): string => {
    switch (status) {
      case "Approved":
        return "bg-emerald-500 hover:bg-emerald-600";
      case "Remove Invoice":
        return "bg-violet-500 hover:bg-violet-600";
      case "Re-open Campaign":
        return "bg-sky-500 hover:bg-sky-600";
      case "Editing":
        return "bg-amber-500 hover:bg-amber-600";
      case "Close Campaign":
        return "bg-rose-500 hover:bg-rose-600";
      case "Close Invoice Period":
        return "bg-indigo-500 hover:bg-indigo-600";
      case "Completed":
        return "bg-teal-500 hover:bg-teal-600";
      default:
        return "bg-orange-500 hover:bg-orange-600";
    }
  };

  // Handle advancing the HUR status
  const handleAdvanceStatus = () => {
    if (!hurRequest || !nextStatus) return;

    // In a real application, this would make an API call
    // For now, we'll just update the local state
    setHurRequest({
      ...hurRequest,
      status: nextStatus,
      approver: user?.name || "Current User",
      approvalDate: new Date().toISOString(),
    });

    // Update the next status
    setNextStatus(getNextStatus(nextStatus));
  };

  // Handle rejecting the HUR request
  const handleReject = () => {
    if (!hurRequest) return;

    // In a real application, this would make an API call
    // For now, we'll just update the local state
    setHurRequest({
      ...hurRequest,
      status: "Not Approved",
      approver: user?.name || "Current User",
      approvalDate: new Date().toISOString(),
      comments: "Request rejected by approver.",
    });

    setNextStatus(null);
  };

  // Handle requesting more information
  const handleRequestMoreInfo = (comments: string) => {
    if (!hurRequest) return;

    // Get current date and time with precise timestamp
    const currentDateTime = new Date().toISOString();

    // In a real application, this would make an API call
    // For now, we'll just update the local state
    setHurRequest({
      ...hurRequest,
      comments: comments,
      moreInfoRequestedBy: user?.name || "Current User",
      moreInfoRequestDate: currentDateTime,
      moreInfoRequestedByRole: user?.role || "User", // Add role if available
      moreInfoRequestedByEmail: user?.email || "user@example.com", // Add email if available
      // Note: We're not changing the status here, just adding the comment
    });

    setIsMoreInfoModalOpen(false);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700">Loading...</h2>
        </div>
      </div>
    );
  }

  if (!hurRequest) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700">
            HUR Request not found
          </h2>
          <p className="mt-2 text-gray-500">
            The HUR request you are looking for does not exist or has been
            deleted.
          </p>
          <Link
            href="/hur"
            className="mt-4 inline-block px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
          >
            Return to HUR Management
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

        {/* Request More Info Modal */}
        <RequestMoreInfoModal
          isOpen={isMoreInfoModalOpen}
          onConfirm={handleRequestMoreInfo}
          onCancel={() => setIsMoreInfoModalOpen(false)}
        />

        {/* Main Container */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <div className="container mx-auto transition-all duration-300 ease-in-out">
            {/* Page header */}
            <div className="mb-8">
              <Link
                href="/hur"
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
                Back to HUR Management
              </Link>
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    HUR Request: {hurRequest.id}
                  </h1>
                  <div className="flex items-center">
                    <HURStatusBadge status={hurRequest.status} />
                    <span className="ml-2 text-gray-500">
                      Requested on {formatDate(hurRequest.requestDate)}
                    </span>
                  </div>
                </div>
                <div className="mt-4 md:mt-0 flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                  {hurRequest.status !== "Not Approved" &&
                    hurRequest.status !== "Completed" && (
                      <>
                        {nextStatus && (
                          <Button
                            className={`${getButtonColor(
                              nextStatus
                            )} text-white font-medium shadow-sm`}
                            onClick={handleAdvanceStatus}
                          >
                            {`Advance to: ${nextStatus}`}
                          </Button>
                        )}
                        <Button
                          className="bg-orange-600 hover:bg-orange-700 text-white font-medium shadow-sm"
                          onClick={() => setIsMoreInfoModalOpen(true)}
                        >
                          Request More Info
                        </Button>
                      </>
                    )}
                  {hurRequest.status === "Review" && (
                    <Button
                      className="bg-red-500 hover:bg-red-600 text-white font-medium shadow-sm"
                      onClick={handleReject}
                    >
                      Reject
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* HUR Request Details */}
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
                          Campaign Name
                        </p>
                        <p className="text-base font-medium text-gray-900">
                          {hurRequest.campaignName}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm font-medium text-gray-500 mb-1">
                          Campaign ID
                        </p>
                        <p className="text-base font-medium text-gray-900">
                          {hurRequest.campaignId}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm font-medium text-gray-500 mb-1">
                          Media Type
                        </p>
                        <p className="text-base font-medium text-gray-900">
                          {hurRequest.mediaType}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm font-medium text-gray-500 mb-1">
                          Module
                        </p>
                        <p className="text-base font-medium text-gray-900">
                          {hurRequest.module}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm font-medium text-gray-500 mb-1">
                          Period
                        </p>
                        <p className="text-base font-medium text-gray-900">
                          {hurRequest.month}/{hurRequest.year}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm font-medium text-gray-500 mb-1">
                          Category
                        </p>
                        <p className="text-base font-medium text-gray-900">
                          {hurRequest.category || "—"}
                        </p>
                      </div>
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
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                      Change Details
                    </h2>
                  </div>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">
                          Category
                        </p>
                        <p className="text-base text-gray-900 mt-1 p-3 bg-gray-50 rounded-lg border border-gray-100">
                          {hurRequest.category || "—"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">
                          Justification
                        </p>
                        <p className="text-base text-gray-900 mt-1 p-4 bg-gray-50 rounded-lg border border-gray-100">
                          {hurRequest.justification}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <p className="text-sm font-medium text-gray-500 mb-1">
                            Line Numbers
                          </p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {hurRequest.lineNumbers.map((line) => (
                              <span
                                key={line}
                                className="px-3 py-1 bg-blue-50 text-blue-700 rounded-md text-sm border border-blue-100"
                              >
                                {line}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500 mb-1">
                            Publisher IO Numbers
                          </p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {hurRequest.publisherIONumbers.map((io) => (
                              <span
                                key={io}
                                className="px-3 py-1 bg-purple-50 text-purple-700 rounded-md text-sm border border-purple-100"
                              >
                                {io}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {typeof hurRequest.currentAmount === "number" &&
                        typeof hurRequest.newAmount === "number" && (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-gray-100">
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <p className="text-sm font-medium text-gray-500 mb-1">
                                Current Amount
                              </p>
                              <p className="text-lg font-semibold text-gray-900">
                                {formatCurrency(hurRequest.currentAmount)}
                              </p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <p className="text-sm font-medium text-gray-500 mb-1">
                                New Amount
                              </p>
                              <p className="text-lg font-semibold text-green-600">
                                {formatCurrency(hurRequest.newAmount)}
                              </p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <p className="text-sm font-medium text-gray-500 mb-1">
                                Difference
                              </p>
                              <p
                                className={`text-lg font-semibold ${
                                  (hurRequest.newAmount || 0) -
                                    (hurRequest.currentAmount || 0) >
                                  0
                                    ? "text-green-600"
                                    : (hurRequest.newAmount || 0) -
                                        (hurRequest.currentAmount || 0) <
                                      0
                                    ? "text-red-600"
                                    : "text-gray-900"
                                }`}
                              >
                                {formatCurrency(
                                  (hurRequest.newAmount || 0) -
                                    (hurRequest.currentAmount || 0)
                                )}
                              </p>
                            </div>
                          </div>
                        )}
                    </div>
                  </CardContent>
                </Card>

                {hurRequest.comments && (
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
                            d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {hurRequest.status === "More Info"
                          ? "Additional Information Requested"
                          : "Comments"}
                      </h2>
                    </div>
                    <CardContent className="p-6">
                      <div className="mb-4 p-3 bg-orange-50 rounded-lg border border-orange-100">
                        <p className="text-sm text-gray-800">
                          {hurRequest.comments}
                        </p>
                      </div>

                      {hurRequest.moreInfoRequestedBy &&
                        hurRequest.moreInfoRequestDate && (
                          <div className="flex items-start mt-4 bg-gray-50 p-3 rounded-lg">
                            <div className="h-8 w-8 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center mr-3 flex-shrink-0">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                            <div className="w-full">
                              <div className="flex justify-between items-center mb-1">
                                <p className="font-medium text-gray-900">
                                  {hurRequest.moreInfoRequestedBy}
                                </p>
                                <span className="text-xs text-orange-700 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100">
                                  {hurRequest.moreInfoRequestedByRole || "User"}
                                </span>
                              </div>

                              {hurRequest.moreInfoRequestedByEmail && (
                                <p className="text-xs text-gray-600 mb-2">
                                  <span className="text-orange-600">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-3 w-3 inline mr-1"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                    >
                                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                    </svg>
                                  </span>
                                  {hurRequest.moreInfoRequestedByEmail}
                                </p>
                              )}

                              {hurRequest.moreInfoRequestedByDepartment && (
                                <p className="text-xs text-gray-600 mb-2">
                                  <span className="text-orange-600">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-3 w-3 inline mr-1"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                    >
                                      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                                    </svg>
                                  </span>
                                  {hurRequest.moreInfoRequestedByDepartment}
                                </p>
                              )}

                              <p className="text-xs text-gray-500 mb-2">
                                Solicitó información adicional el:
                              </p>
                              <div className="flex items-center text-sm bg-orange-50 px-3 py-2 rounded-md border border-orange-100">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4 text-orange-600 mr-2"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                {formatDate(hurRequest.moreInfoRequestDate)}
                              </div>
                            </div>
                          </div>
                        )}
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Right column - Request Information */}
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
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Request Information
                    </h2>
                  </div>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <div className="h-8 w-8 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center mr-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">
                            Requester
                          </p>
                          <p className="text-base font-medium text-gray-900">
                            {hurRequest.requester}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <div className="h-8 w-8 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center mr-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">
                            Request Date
                          </p>
                          <p className="text-base text-gray-900">
                            {formatDate(hurRequest.requestDate)}
                          </p>
                        </div>
                      </div>
                      {hurRequest.approver && (
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <div className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mr-3">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">
                              Approver
                            </p>
                            <p className="text-base font-medium text-gray-900">
                              {hurRequest.approver}
                            </p>
                          </div>
                        </div>
                      )}
                      {hurRequest.approvalDate && (
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <div className="h-8 w-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mr-3">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">
                              Approval Date
                            </p>
                            <p className="text-base text-gray-900">
                              {formatDate(hurRequest.approvalDate)}
                            </p>
                          </div>
                        </div>
                      )}
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
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      HUR Process Status
                    </h2>
                  </div>
                  <CardContent className="p-6">
                    <div className="space-y-4 mt-2">
                      <div className="relative">
                        <div className="flex items-center mb-4">
                          <div
                            className={`h-8 w-8 rounded-full flex items-center justify-center shadow-sm ${
                              hurRequest.status !== "Not Approved"
                                ? "bg-emerald-500 text-white"
                                : "bg-gray-200 text-gray-500"
                            }`}
                          >
                            1
                          </div>
                          <div className="ml-4">
                            <p className="font-medium text-gray-900">Review</p>
                            <p className="text-sm text-gray-500">
                              Initial review of the request
                            </p>
                          </div>
                        </div>
                        <div className="absolute top-10 left-5 h-full w-0.5 bg-gray-200"></div>
                      </div>

                      <div className="relative">
                        <div className="flex items-center mb-4">
                          <div
                            className={`h-8 w-8 rounded-full flex items-center justify-center shadow-sm ${
                              hurRequest.status === "More Info" ||
                              hurRequest.status === "Approved" ||
                              hurRequest.status === "Remove Invoice" ||
                              hurRequest.status === "Re-open Campaign" ||
                              hurRequest.status === "Editing" ||
                              hurRequest.status === "Close Campaign" ||
                              hurRequest.status === "Close Invoice Period" ||
                              hurRequest.status === "Completed"
                                ? "bg-violet-500 text-white"
                                : "bg-gray-200 text-gray-500"
                            }`}
                          >
                            2
                          </div>
                          <div className="ml-4">
                            <p className="font-medium text-gray-900">
                              Approval
                            </p>
                            <p className="text-sm text-gray-500">
                              Board team approval
                            </p>
                          </div>
                        </div>
                        <div className="absolute top-10 left-5 h-full w-0.5 bg-gray-200"></div>
                      </div>

                      <div className="relative">
                        <div className="flex items-center mb-4">
                          <div
                            className={`h-8 w-8 rounded-full flex items-center justify-center shadow-sm ${
                              hurRequest.status === "Remove Invoice" ||
                              hurRequest.status === "Re-open Campaign" ||
                              hurRequest.status === "Editing" ||
                              hurRequest.status === "Close Campaign" ||
                              hurRequest.status === "Close Invoice Period" ||
                              hurRequest.status === "Completed"
                                ? "bg-sky-500 text-white"
                                : "bg-gray-200 text-gray-500"
                            }`}
                          >
                            3
                          </div>
                          <div className="ml-4">
                            <p className="font-medium text-gray-900">
                              Invoice Removal
                            </p>
                            <p className="text-sm text-gray-500">
                              Remove invoice if necessary
                            </p>
                          </div>
                        </div>
                        <div className="absolute top-10 left-5 h-full w-0.5 bg-gray-200"></div>
                      </div>

                      <div className="relative">
                        <div className="flex items-center mb-4">
                          <div
                            className={`h-8 w-8 rounded-full flex items-center justify-center shadow-sm ${
                              hurRequest.status === "Re-open Campaign" ||
                              hurRequest.status === "Editing" ||
                              hurRequest.status === "Close Campaign" ||
                              hurRequest.status === "Close Invoice Period" ||
                              hurRequest.status === "Completed"
                                ? "bg-amber-500 text-white"
                                : "bg-gray-200 text-gray-500"
                            }`}
                          >
                            4
                          </div>
                          <div className="ml-4">
                            <p className="font-medium text-gray-900">
                              Re-open Campaign
                            </p>
                            <p className="text-sm text-gray-500">
                              Open campaign for editing
                            </p>
                          </div>
                        </div>
                        <div className="absolute top-10 left-5 h-full w-0.5 bg-gray-200"></div>
                      </div>

                      <div className="relative">
                        <div className="flex items-center mb-4">
                          <div
                            className={`h-8 w-8 rounded-full flex items-center justify-center shadow-sm ${
                              hurRequest.status === "Editing" ||
                              hurRequest.status === "Close Campaign" ||
                              hurRequest.status === "Close Invoice Period" ||
                              hurRequest.status === "Completed"
                                ? "bg-rose-500 text-white"
                                : "bg-gray-200 text-gray-500"
                            }`}
                          >
                            5
                          </div>
                          <div className="ml-4">
                            <p className="font-medium text-gray-900">Editing</p>
                            <p className="text-sm text-gray-500">
                              Make necessary changes
                            </p>
                          </div>
                        </div>
                        <div className="absolute top-10 left-5 h-full w-0.5 bg-gray-200"></div>
                      </div>

                      <div className="relative">
                        <div className="flex items-center mb-4">
                          <div
                            className={`h-8 w-8 rounded-full flex items-center justify-center shadow-sm ${
                              hurRequest.status === "Close Campaign" ||
                              hurRequest.status === "Close Invoice Period" ||
                              hurRequest.status === "Completed"
                                ? "bg-indigo-500 text-white"
                                : "bg-gray-200 text-gray-500"
                            }`}
                          >
                            6
                          </div>
                          <div className="ml-4">
                            <p className="font-medium text-gray-900">
                              Close Campaign
                            </p>
                            <p className="text-sm text-gray-500">
                              Re-close the campaign
                            </p>
                          </div>
                        </div>
                        <div className="absolute top-10 left-5 h-full w-0.5 bg-gray-200"></div>
                      </div>

                      <div className="relative">
                        <div className="flex items-center">
                          <div
                            className={`h-8 w-8 rounded-full flex items-center justify-center shadow-sm ${
                              hurRequest.status === "Close Invoice Period" ||
                              hurRequest.status === "Completed"
                                ? "bg-teal-500 text-white"
                                : "bg-gray-200 text-gray-500"
                            }`}
                          >
                            7
                          </div>
                          <div className="ml-4">
                            <p className="font-medium text-gray-900">
                              Close Invoice Period
                            </p>
                            <p className="text-sm text-gray-500">
                              Finalize the HUR process
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
