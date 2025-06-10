"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useSidebar } from "@/contexts/SidebarContext";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import StatusBadge from "@/components/ui/StatusBadge";
import Link from "next/link";

// Import components
import OrganizationDetails from "@/components/organizations/OrganizationDetails";
import OrganizationContacts from "@/components/organizations/OrganizationContacts";
import OrganizationRates from "@/components/organizations/OrganizationRates";
import OrganizationCampaigns from "@/components/organizations/OrganizationCampaigns";

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
  isHolding: boolean;
  holdingName?: string;
  isBigSix: boolean;
  legalName: string;
  taxId: string;
  website?: string;
  contactName?: string;
  contactEmail?: string;
  status: "Active" | "Inactive";
  // Additional fields for detailed view
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phone?: string;
  industry?: string;
  foundedYear?: number;
  description?: string;
  billingCurrency?: string;
  paymentTerms?: string;
  billingAddress?: string;
}

// Import mock data
const getMockOrganizationById = (id: string): Organization | null => {
  const mockOrganizations: Organization[] = [
    {
      id: "org001",
      name: "OMD Mexico",
      type: "Agency",
      country: "Mexico",
      isHolding: false,
      holdingName: "Omnicom Media Group",
      isBigSix: true,
      legalName: "OMD Mexico S.A. de C.V.",
      taxId: "OMD981231ABC",
      website: "https://www.omd.com/mexico",
      contactName: "Maria González",
      contactEmail: "maria.gonzalez@omd.com",
      status: "Active",
      address: "Av. Paseo de la Reforma 222, Piso 14",
      city: "Ciudad de México",
      state: "CDMX",
      zipCode: "06600",
      phone: "+52 55 5555 1234",
      industry: "Media Agency",
      foundedYear: 1998,
      description:
        "OMD México es una agencia de medios líder en el mercado mexicano, parte del grupo Omnicom Media Group.",
      billingCurrency: "MXN",
      paymentTerms: "Net 30",
      billingAddress:
        "Av. Paseo de la Reforma 222, Piso 14, Col. Juárez, Ciudad de México, CDMX, 06600",
    },
    {
      id: "org002",
      name: "Live Nation Brasil Entretenimento LTDA",
      type: "Advertiser",
      country: "Brazil",
      isHolding: false,
      holdingName: "",
      isBigSix: false,
      legalName: "Live Nation Brasil Entretenimento LTDA",
      taxId: "LN123456BR",
      website: "https://www.livenation.com.br",
      contactName: "João Silva",
      contactEmail: "joao.silva@livenation.com",
      status: "Active",
      address: "Av. Brigadeiro Faria Lima 3900",
      city: "São Paulo",
      state: "SP",
      zipCode: "04538-132",
      phone: "+55 11 5555 9876",
      industry: "Entertainment",
      foundedYear: 2010,
      description:
        "Live Nation Brasil es una subsidiaria de Live Nation Entertainment, dedicada a la producción y promoción de conciertos y eventos en Brasil.",
      billingCurrency: "BRL",
      paymentTerms: "Net 45",
      billingAddress:
        "Av. Brigadeiro Faria Lima 3900, São Paulo, SP, 04538-132",
    },
    {
      id: "org003",
      name: "Vevo LLC",
      type: "Publisher",
      country: "United States",
      isHolding: false,
      holdingName: "",
      isBigSix: false,
      legalName: "Vevo LLC",
      taxId: "V789012US",
      website: "https://www.vevo.com",
      contactName: "John Smith",
      contactEmail: "john.smith@vevo.com",
      status: "Active",
      address: "4 Times Square",
      city: "New York",
      state: "NY",
      zipCode: "10036",
      phone: "+1 212 555 7890",
      industry: "Digital Media",
      foundedYear: 2009,
      description:
        "Vevo es una plataforma de videos musicales premium, que ofrece contenido oficial de artistas y sellos discográficos.",
      billingCurrency: "USD",
      paymentTerms: "Net 60",
      billingAddress: "4 Times Square, New York, NY, 10036",
    },
    {
      id: "org004",
      name: "Omnicom Media Group",
      type: "Holding Agency",
      country: "United States",
      isHolding: true,
      isBigSix: true,
      legalName: "Omnicom Media Group, Inc.",
      taxId: "OMG345678US",
      website: "https://www.omnicommediagroup.com",
      contactName: "Sarah Johnson",
      contactEmail: "sarah.johnson@omnicomgroup.com",
      status: "Active",
      address: "195 Broadway",
      city: "New York",
      state: "NY",
      zipCode: "10007",
      phone: "+1 212 415 3600",
      industry: "Media Agency",
      foundedYear: 1986,
      description:
        "Uno de los grupos de agencias de medios más grandes del mundo.",
      billingCurrency: "USD",
      paymentTerms: "Net 60",
      billingAddress: "195 Broadway, New York, NY, 10007",
    },
    {
      id: "org005",
      name: "WPP",
      type: "Holding Agency",
      country: "United Kingdom",
      isHolding: true,
      isBigSix: true,
      legalName: "WPP plc",
      taxId: "WPP123456UK",
      website: "https://www.wpp.com",
      contactName: "David Williams",
      contactEmail: "david.williams@wpp.com",
      status: "Active",
      address: "Sea Containers, 18 Upper Ground",
      city: "London",
      state: "",
      zipCode: "SE1 9GL",
      phone: "+44 20 7282 4600",
      industry: "Media Agency",
      foundedYear: 1971,
      description:
        "El mayor grupo de publicidad y relaciones públicas del mundo por ingresos.",
      billingCurrency: "GBP",
      paymentTerms: "Net 45",
      billingAddress: "Sea Containers, 18 Upper Ground, London, SE1 9GL",
    },
    {
      id: "org006",
      name: "Havas Media Colombia",
      type: "Agency",
      country: "Colombia",
      isHolding: false,
      holdingName: "Havas Group",
      isBigSix: true,
      legalName: "Havas Media Colombia S.A.S.",
      taxId: "HMC567890CO",
      website: "https://www.havasmedia.com/colombia",
      contactName: "Carlos Jiménez",
      contactEmail: "carlos.jimenez@havas.com",
      status: "Active",
      address: "Calle 72 No. 5-83",
      city: "Bogotá",
      state: "D.C.",
      zipCode: "110231",
      phone: "+57 1 744 0880",
      industry: "Media Agency",
      foundedYear: 2000,
      description:
        "Agencia de medios líder en Colombia, parte del grupo Havas.",
      billingCurrency: "COP",
      paymentTerms: "Net 30",
      billingAddress: "Calle 72 No. 5-83, Bogotá, D.C., 110231",
    },
    {
      id: "org007",
      name: "Havas Group",
      type: "Holding Agency",
      country: "France",
      isHolding: true,
      isBigSix: true,
      legalName: "Havas S.A.",
      taxId: "HAV456789FR",
      website: "https://www.havasgroup.com",
      contactName: "Sophie Dupont",
      contactEmail: "sophie.dupont@havas.com",
      status: "Active",
      address: "29-30 quai de Dion Bouton",
      city: "Puteaux",
      state: "",
      zipCode: "92800",
      phone: "+33 1 58 47 80 00",
      industry: "Media Agency",
      foundedYear: 1835,
      description:
        "Uno de los grupos de comunicación más antiguos y grandes del mundo.",
      billingCurrency: "EUR",
      paymentTerms: "Net 45",
      billingAddress: "29-30 quai de Dion Bouton, Puteaux, 92800, France",
    },
    {
      id: "org008",
      name: "Coca-Cola Latin America",
      type: "Holding Advertiser",
      country: "United States",
      isHolding: true,
      isBigSix: false,
      legalName: "The Coca-Cola Company",
      taxId: "CC123987US",
      website: "https://www.coca-colalatinamerica.com",
      contactName: "Miguel Rodríguez",
      contactEmail: "miguel.rodriguez@coca-cola.com",
      status: "Active",
      address: "One Coca-Cola Plaza",
      city: "Atlanta",
      state: "GA",
      zipCode: "30313",
      phone: "+1 404 676 2121",
      industry: "Food & Beverage",
      foundedYear: 1892,
      description: "Líder mundial en la industria de bebidas no alcohólicas.",
      billingCurrency: "USD",
      paymentTerms: "Net 60",
      billingAddress: "One Coca-Cola Plaza, Atlanta, GA, 30313",
    },
    {
      id: "org009",
      name: "Fandom",
      type: "Publisher",
      country: "United States",
      isHolding: false,
      holdingName: "",
      isBigSix: false,
      legalName: "Fandom, Inc.",
      taxId: "FAN234567US",
      website: "https://www.fandom.com",
      contactName: "Lisa Brown",
      contactEmail: "lisa.brown@fandom.com",
      status: "Active",
      address: "149 New Montgomery Street",
      city: "San Francisco",
      state: "CA",
      zipCode: "94105",
      phone: "+1 415 856 3021",
      industry: "Digital Media",
      foundedYear: 2004,
      description: "La mayor plataforma de fans y comunidades del mundo.",
      billingCurrency: "USD",
      paymentTerms: "Net 30",
      billingAddress: "149 New Montgomery Street, San Francisco, CA, 94105",
    },
    {
      id: "org010",
      name: "CALIA Y2 PROPAGANDA E MARKETING LTDA",
      type: "Agency",
      country: "Brazil",
      isHolding: false,
      holdingName: "",
      isBigSix: false,
      legalName: "CALIA Y2 PROPAGANDA E MARKETING LTDA",
      taxId: "CAL876543BR",
      website: "https://www.caliay2.com.br",
      contactName: "Ana Oliveira",
      contactEmail: "ana.oliveira@caliay2.com.br",
      status: "Active",
      address: "Rua Funchal, 375",
      city: "São Paulo",
      state: "SP",
      zipCode: "04551-060",
      phone: "+55 11 3846 8700",
      industry: "Advertising",
      foundedYear: 1995,
      description:
        "Agencia de publicidad independiente con enfoque en innovación.",
      billingCurrency: "BRL",
      paymentTerms: "Net 30",
      billingAddress:
        "Rua Funchal, 375, Vila Olímpia, São Paulo, SP, 04551-060",
    },
    {
      id: "org011",
      name: "EJE PUBLICITARIA SOCIEDAD ANONIMA",
      type: "Advertiser",
      country: "Argentina",
      isHolding: false,
      holdingName: "",
      isBigSix: false,
      legalName: "EJE PUBLICITARIA S.A.",
      taxId: "EJE345678AR",
      website: "https://www.ejepublicitaria.com.ar",
      contactName: "Roberto Fernández",
      contactEmail: "roberto.fernandez@ejepublicitaria.com.ar",
      status: "Active",
      address: "Av. del Libertador 6680",
      city: "Buenos Aires",
      state: "CABA",
      zipCode: "C1428ARW",
      phone: "+54 11 4789 1200",
      industry: "Advertising",
      foundedYear: 1988,
      description: "Agencia publicitaria líder en el mercado argentino.",
      billingCurrency: "ARS",
      paymentTerms: "Net 30",
      billingAddress: "Av. del Libertador 6680, Buenos Aires, CABA, C1428ARW",
    },
    {
      id: "org012",
      name: "Omnet Chile",
      type: "Agency",
      country: "Chile",
      isHolding: false,
      holdingName: "Omnet Latin America LLC",
      isBigSix: false,
      legalName: "Omnet Chile Ltda.",
      taxId: "OMC123456CL",
      website: "https://www.omnet.cl",
      contactName: "Patricia Gómez",
      contactEmail: "patricia.gomez@omnet.cl",
      status: "Active",
      address: "Av. Apoquindo 4700",
      city: "Santiago",
      state: "RM",
      zipCode: "7550000",
      phone: "+56 2 2928 3000",
      industry: "Media Agency",
      foundedYear: 2005,
      description:
        "Agencia de medios especializada en planificación estratégica y compra de medios.",
      billingCurrency: "CLP",
      paymentTerms: "Net 45",
      billingAddress: "Av. Apoquindo 4700, Las Condes, Santiago, RM, 7550000",
    },
  ];

  return mockOrganizations.find((org) => org.id === id) || null;
};

// Define un tipo para la propiedad global
interface WindowWithGlobalFunction extends Window {
  __addContactFunction?: () => void;
}

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
      default:
        return null;
    }
  };

  const styleClasses = getStatusStyle(status);
  const icon = getStatusIcon(status);

  return (
    <span
      className={`inline-flex items-center px-4 py-2 rounded-full text-base font-medium border-2 shadow-sm ${styleClasses}`}
    >
      {icon}
      {status}
    </span>
  );
};

export default function OrganizationDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user, isLoading, isAuthenticated } = useAuth();
  const {} = useSidebar();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "details" | "contacts" | "rates" | "campaigns"
  >("details");
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [showAddContactForm, setShowAddContactForm] = useState(false);
  const [showAddRateForm, setShowAddRateForm] = useState(false);

  // Función global para agregar contacto, disponible para todos los componentes
  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as WindowWithGlobalFunction).__addContactFunction = () => {
        console.log("Función global para agregar contacto llamada");
        const contactsElement = document.getElementById(
          "organization-contacts"
        );
        if (contactsElement) {
          const event = new CustomEvent("add-contact");
          contactsElement.dispatchEvent(event);
        }
      };
    }

    return () => {
      if (typeof window !== "undefined") {
        // Usar el mismo tipo
        delete (window as WindowWithGlobalFunction).__addContactFunction;
      }
    };
  }, []);

  // Get organization ID from URL parameters
  const organizationId = Array.isArray(params.id) ? params.id[0] : params.id;

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  // Load organization data
  useEffect(() => {
    if (organizationId) {
      // Here we would load real data from API
      // For now using example data
      const organizationData = getMockOrganizationById(organizationId);
      setOrganization(organizationData || null);
      setIsDataLoading(false);

      // Cambiar automáticamente de pestaña si rates está seleccionado pero no es Publisher
      if (
        organizationData &&
        organizationData.type !== "Publisher" &&
        activeTab === "rates"
      ) {
        setActiveTab("details");
      }
    }
  }, [organizationId, activeTab]);

  // Efecto para cambiar de pestaña si se selecciona rates en una organización no-Publisher
  useEffect(() => {
    if (
      organization &&
      organization.type !== "Publisher" &&
      activeTab === "rates"
    ) {
      setActiveTab("details");
    }
  }, [activeTab, organization]);

  // Render loading while data loads
  if (isDataLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700">
            Organization not found
          </h2>
          <p className="mt-2 text-gray-500">
            The organization you are looking for does not exist or has been
            deleted.
          </p>
          <Link
            href="/organizations"
            className="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Back to Organizations
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
            {/* Organization header information */}
            <div className="mb-6">
              <Link
                href="/organizations"
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
                Back to Organizations
              </Link>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-800">
                      {organization.name}
                    </h1>
                  </div>
                  <div className="flex items-center space-x-3 mt-4 md:mt-0">
                    <div className="flex items-center">
                      <StatusBadgeLarge
                        status={
                          organization.status === "Active" ? "Live" : "Closed"
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation tabs */}
            <div className="border-b border-gray-200 bg-white rounded-t-xl">
              <div className="px-6 flex justify-between items-center">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                  {[
                    { id: "details", name: "Details" },
                    { id: "contacts", name: "Contacts" },
                    ...(organization.type === "Publisher"
                      ? [{ id: "rates", name: "Rates" }]
                      : []),
                    { id: "campaigns", name: "Campaigns" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() =>
                        setActiveTab(
                          tab.id as
                            | "details"
                            | "contacts"
                            | "rates"
                            | "campaigns"
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

                {/* Action buttons based on active tab */}
                <div>
                  {activeTab === "details" && !isEditingDetails ? (
                    <button
                      onClick={() => setIsEditingDetails(true)}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium flex items-center gap-2 shadow-sm"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                      Edit Details
                    </button>
                  ) : activeTab === "details" && isEditingDetails ? (
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => {
                          // Cuando se hace clic en Guardar, simplemente desactivamos el modo edición
                          // El componente se encargará de guardar los cambios a través del prop onSave
                          setIsEditingDetails(false);
                        }}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-sm font-medium flex items-center gap-2 shadow-sm"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
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
                        Save Changes
                      </button>
                      <button
                        onClick={() => {
                          // Al cancelar, simplemente desactivamos el modo edición
                          // El componente descartará los cambios cuando cambie de editMode=true a false
                          setIsEditingDetails(false);
                        }}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm font-medium flex items-center gap-2 shadow-sm"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                        Cancel
                      </button>
                    </div>
                  ) : null}
                  {activeTab === "contacts" && (
                    <button
                      id="main-add-contact-button"
                      onClick={() => {
                        console.log("Botón Add Contact clickeado");
                        setShowAddContactForm(true);
                      }}
                      className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-md text-sm font-medium flex items-center gap-2 shadow-sm"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                        />
                      </svg>
                      Add Contact
                    </button>
                  )}
                  {activeTab === "rates" && organization.type === "Publisher" && (
                    <button
                      onClick={() => {
                        console.log("Botón Add Rate clickeado");
                        setShowAddRateForm(true);
                      }}
                      className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-indigo-700 hover:from-indigo-600 hover:to-indigo-800 text-white rounded-md text-sm font-medium flex items-center gap-2 shadow-sm"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      Add Rate
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Main content */}
            <div className="mt-6">
              {activeTab === "details" && (
                <div id="organization-details">
                  <OrganizationDetails
                    organization={organization}
                    onSave={(updatedOrg) => setOrganization(updatedOrg)}
                    hideActionButtons={true}
                    editMode={isEditingDetails}
                    setIsEditing={setIsEditingDetails}
                  />
                </div>
              )}
              {activeTab === "contacts" && (
                <div id="organization-contacts">
                  <OrganizationContacts
                    organization={organization}
                    hideActionButtons={true}
                    showAddContactForm={showAddContactForm}
                    onFormDisplay={() => setShowAddContactForm(false)}
                  />
                </div>
              )}
              {activeTab === "rates" && organization.type === "Publisher" && (
                <div id="organization-rates">
                  <OrganizationRates
                    organization={organization}
                    hideActionButtons={true}
                    showAddRateForm={showAddRateForm}
                    onFormDisplay={() => setShowAddRateForm(false)}
                  />
                </div>
              )}
              {activeTab === "campaigns" && (
                <OrganizationCampaigns organizationId={organization.id} />
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
