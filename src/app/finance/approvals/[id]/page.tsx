"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useSidebar } from "@/contexts/SidebarContext";
import { useRouter, useParams } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Check,
  X,
  AlertCircle,
  ArrowLeft,
  FileText,
  Building,
  User,
  Mail,
  Globe,
  MapPin,
  DollarSign,
  FileCheck,
} from "lucide-react";

// Organization interface
interface Organization {
  id: string;
  name: string;
  type:
    | "Agency"
    | "Advertiser"
    | "Publisher"
    | "Holding Agency"
    | "Holding Advertiser";
  country: string;
  submittedDate: string;
  status: "Pending" | "Approved" | "Rejected";
  contactName?: string;
  contactEmail?: string;
  legalName: string;
  taxId?: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phone?: string;
  industry?: string;
  billingCurrency?: string;
  paymentTerms?: string;
  billingAddress?: string;
  missingInfo?: string[];
  rejectionReason?: string;
  documents?: {
    id: string;
    name: string;
    type: string;
    uploadDate: string;
    status: "Verified" | "Pending" | "Rejected";
  }[];
}

// Mock data for a single organization
const mockOrganization: Organization = {
  id: "org101",
  name: "MediaCom Argentina",
  type: "Agency",
  country: "Argentina",
  submittedDate: "2025-04-15",
  status: "Pending",
  contactName: "Carlos Mendez",
  contactEmail: "carlos.mendez@mediacom.com",
  legalName: "MediaCom Argentina S.A.",
  website: "https://www.mediacom.com/ar",
  address: "Av. del Libertador 6350",
  city: "Buenos Aires",
  state: "CABA",
  zipCode: "C1428ART",
  phone: "+54 11 4789 2000",
  industry: "Media Agency",
  billingCurrency: "USD",
  billingAddress: "Av. del Libertador 6350, Buenos Aires, Argentina",
  missingInfo: ["Tax ID", "Payment Terms"],
  documents: [
    {
      id: "doc1",
      name: "Company Registration",
      type: "PDF",
      uploadDate: "2025-04-14",
      status: "Verified",
    },
    {
      id: "doc2",
      name: "Bank Statement",
      type: "PDF",
      uploadDate: "2025-04-14",
      status: "Pending",
    },
    {
      id: "doc3",
      name: "Tax Certificate",
      type: "PDF",
      uploadDate: "2025-04-14",
      status: "Rejected",
    },
  ],
};

export default function OrganizationApprovalDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user, isLoading, isAuthenticated } = useAuth();
  const {} = useSidebar();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [activeTab, setActiveTab] = useState<
    "details" | "documents" | "financial"
  >("details");

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  // Fetch organization data
  useEffect(() => {
    // In a real app, this would be an API call
    // For now, we'll use the mock data
    setOrganization(mockOrganization);
  }, [params]);

  // Handle approve organization
  const handleApprove = () => {
    // In a real app, this would be an API call
    setOrganization((prev) => (prev ? { ...prev, status: "Approved" } : null));

    // Show success message and redirect after a delay
    setTimeout(() => {
      router.push("/finance/approvals");
    }, 1500);
  };

  // Handle reject organization
  const handleReject = () => {
    if (!rejectionReason.trim()) {
      alert("Please provide a reason for rejection");
      return;
    }

    // In a real app, this would be an API call
    setOrganization((prev) =>
      prev ? { ...prev, status: "Rejected", rejectionReason } : null
    );
    setShowRejectModal(false);

    // Show success message and redirect after a delay
    setTimeout(() => {
      router.push("/finance/approvals");
    }, 1500);
  };

  // Render loading state
  if (isLoading || !organization) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-amber-50 text-amber-700 border-amber-100";
      case "Approved":
        return "bg-green-50 text-green-700 border-green-100";
      case "Rejected":
        return "bg-red-50 text-red-700 border-red-100";
      case "Verified":
        return "bg-green-50 text-green-700 border-green-100";
      default:
        return "bg-gray-50 text-gray-700 border-gray-100";
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Approved":
        return <Check className="h-4 w-4 mr-1" />;
      case "Rejected":
        return <X className="h-4 w-4 mr-1" />;
      case "Pending":
        return <AlertCircle className="h-4 w-4 mr-1" />;
      default:
        return null;
    }
  };

  // Get document status icon
  const getDocumentStatusIcon = (status: string) => {
    switch (status) {
      case "Verified":
        return <Check className="h-5 w-5 text-green-500" />;
      case "Pending":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case "Rejected":
        return <X className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

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
          <div className="container mx-auto space-y-6">
            {/* Back button and header */}
            <div className="flex flex-col space-y-4">
              <Link
                href="/finance/approvals"
                className="flex items-center text-orange-600 hover:text-orange-800"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                <span>Back to Approvals</span>
              </Link>

              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {organization.name}
                  </h1>
                  <div className="flex items-center mt-2">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full flex items-center ${getStatusColor(
                        organization.status
                      )}`}
                    >
                      {getStatusIcon(organization.status)}
                      {organization.status}
                    </span>
                    <span className="ml-2 text-sm text-gray-500">
                      Submitted on{" "}
                      {new Date(
                        organization.submittedDate
                      ).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {organization.status === "Pending" && (
                  <div className="flex space-x-3 mt-4 md:mt-0">
                    <Button
                      variant="outline"
                      className="border-red-500 text-red-500 hover:bg-red-50"
                      onClick={() => setShowRejectModal(true)}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                    <Button
                      variant="default"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={handleApprove}
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Navigation tabs */}
            <div className="border-b border-gray-200 bg-white rounded-t-xl">
              <div className="px-6">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                  <button
                    onClick={() => setActiveTab("details")}
                    className={`
                      whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                      ${
                        activeTab === "details"
                          ? "border-orange-500 text-orange-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }
                    `}
                  >
                    Organization Details
                  </button>
                  <button
                    onClick={() => setActiveTab("documents")}
                    className={`
                      whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                      ${
                        activeTab === "documents"
                          ? "border-orange-500 text-orange-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }
                    `}
                  >
                    Documents
                  </button>
                  <button
                    onClick={() => setActiveTab("financial")}
                    className={`
                      whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                      ${
                        activeTab === "financial"
                          ? "border-orange-500 text-orange-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }
                    `}
                  >
                    Financial Information
                  </button>
                </nav>
              </div>
            </div>

            {/* Content based on active tab */}
            <div className="bg-white rounded-b-xl shadow-sm border border-gray-100 p-6">
              {/* Details Tab */}
              {activeTab === "details" && (
                <div className="space-y-6">
                  {organization.missingInfo &&
                    organization.missingInfo.length > 0 && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex">
                          <AlertCircle className="h-5 w-5 text-yellow-500 mr-3 flex-shrink-0" />
                          <div>
                            <h3 className="text-sm font-medium text-yellow-800">
                              Missing Information
                            </h3>
                            <ul className="mt-2 text-sm text-yellow-700 list-disc list-inside">
                              {organization.missingInfo.map((item, index) => (
                                <li key={index}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Organization Information
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <Building className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-gray-500">
                              Legal Name
                            </p>
                            <p className="text-base text-gray-900">
                              {organization.legalName}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <FileText className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-gray-500">
                              Tax ID
                            </p>
                            <p className="text-base text-gray-900">
                              {organization.taxId || "Not provided"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <Globe className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-gray-500">
                              Website
                            </p>
                            <p className="text-base text-gray-900">
                              {organization.website || "Not provided"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-gray-500">
                              Address
                            </p>
                            <p className="text-base text-gray-900">
                              {organization.address ? (
                                <>
                                  {organization.address}
                                  <br />
                                  {organization.city}, {organization.state}{" "}
                                  {organization.zipCode}
                                  <br />
                                  {organization.country}
                                </>
                              ) : (
                                "Not provided"
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Contact Information
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <User className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-gray-500">
                              Contact Name
                            </p>
                            <p className="text-base text-gray-900">
                              {organization.contactName || "Not provided"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <Mail className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-gray-500">
                              Contact Email
                            </p>
                            <p className="text-base text-gray-900">
                              {organization.contactEmail || "Not provided"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Documents Tab */}
              {activeTab === "documents" && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Submitted Documents
                  </h3>
                  {organization.documents &&
                  organization.documents.length > 0 ? (
                    <div className="space-y-4">
                      {organization.documents.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                        >
                          <div className="flex items-center">
                            <FileText className="h-6 w-6 text-gray-400 mr-3" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {doc.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {doc.type} • Uploaded on{" "}
                                {new Date(doc.uploadDate).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <span
                              className={`mr-3 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                                doc.status
                              )}`}
                            >
                              {doc.status}
                            </span>
                            {getDocumentStatusIcon(doc.status)}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">
                      No documents have been submitted.
                    </p>
                  )}
                </div>
              )}

              {/* Financial Information Tab */}
              {activeTab === "financial" && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Financial Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <DollarSign className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">
                            Billing Currency
                          </p>
                          <p className="text-base text-gray-900">
                            {organization.billingCurrency || "Not provided"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <FileCheck className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">
                            Payment Terms
                          </p>
                          <p className="text-base text-gray-900">
                            {organization.paymentTerms || "Not provided"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">
                            Billing Address
                          </p>
                          <p className="text-base text-gray-900">
                            {organization.billingAddress || "Not provided"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Rejection Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Reject Organization
            </h3>
            <p className="text-gray-500 mb-4">
              Please provide a reason for rejecting this organization.
            </p>
            <div className="mb-4">
              <textarea
                className="w-full border border-gray-300 rounded-md p-2 h-32"
                placeholder="Rejection reason..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              ></textarea>
            </div>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowRejectModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                className="bg-red-600 hover:bg-red-700"
                onClick={handleReject}
              >
                Reject
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
