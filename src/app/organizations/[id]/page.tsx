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
import OrganizationTrade from "@/components/organizations/OrganizationTrade";
import OrganizationSubOrgs from "@/components/organizations/OrganizationSubOrgs";

// Componente separado para el botón de regreso
const BackToOrganizationsButton = () => {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("BackToOrganizationsButton clicked");

    // Usar setTimeout para asegurar que la navegación ocurra después de que se complete el ciclo de eventos actual
    setTimeout(() => {
      window.location.href = "/organizations";
    }, 0);
  };

  return (
    <button
      onClick={handleClick}
      className="text-orange-600 hover:text-orange-800 text-sm flex items-center mb-2 bg-transparent border-none cursor-pointer relative z-50"
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
    </button>
  );
};

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
  isPartOfHolding: boolean;
  legalName: string;
  taxId: string;
  website?: string;
  contactName?: string;
  contactEmail?: string;
  status: "Active" | "Inactive" | "In Review";
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
const getMockOrganizationById = (id: string): Organization | undefined => {
  const mockOrganizations: Organization[] = [
    {
      id: "org001",
      name: "Havas Media-Mexico- Havas",
      type: "Agency",
      country: "Mexico",
      isHolding: false,
      holdingName: "Havas",
      isBigSix: true,
      isPartOfHolding: true,
      legalName: "XXXX SA",
      taxId: "HMM123456MX",
      website: "www.xyz.com",
      contactName: "Miguel Hernández",
      contactEmail: "miguel.hernandez@havas.com",
      status: "Active",
      address: "Av. de los Ingenieros 957",
      city: "Lima",
      state: "",
      zipCode: "33225",
      phone: "+52 55 1234 5678",
      industry: "Advertising",
      foundedYear: 2005,
      description: "Agencia de medios líder en México, parte del grupo Havas.",
      billingCurrency: "USD",
      paymentTerms: "Up front",
      billingAddress: "Av. de los Ingenieros 957, Lima, Peru",
    },
    {
      id: "org002",
      name: "Yakult",
      type: "Direct",
      country: "Mexico",
      isHolding: false,
      holdingName: "",
      isBigSix: false,
      isPartOfHolding: false,
      legalName: "XXXX SA",
      taxId: "YKT123456MX",
      website: "www.xyz.com",
      contactName: "Carlos Ramírez",
      contactEmail: "carlos.ramirez@yakult.com",
      status: "Active",
      address: "Av. de los Ingenieros 957",
      city: "Lima",
      state: "",
      zipCode: "33225",
      phone: "+52 55 5678 1234",
      industry: "Food Production",
      foundedYear: 1995,
      description: "Empresa líder en la producción de bebidas probióticas.",
      billingCurrency: "USD",
      paymentTerms: "Up front",
      billingAddress: "Av. de los Ingenieros 957, Lima, Peru",
    },
    {
      id: "org003",
      name: "Havas",
      type: "Holding Agency",
      country: "Global",
      isHolding: true,
      holdingName: "",
      isBigSix: true,
      isPartOfHolding: false,
      legalName: "XXXX SA",
      taxId: "HAV123456GL",
      website: "www.xyz.com",
      contactName: "Sophie Dupont",
      contactEmail: "sophie.dupont@havas.com",
      status: "Active",
      address: "Av. de los Ingenieros 957",
      city: "Lima",
      state: "",
      zipCode: "33225",
      phone: "+33 1 4562 7890",
      industry: "Advertising",
      foundedYear: 1968,
      description: "Uno de los principales grupos de comunicación globales.",
      billingCurrency: "USD",
      paymentTerms: "Up front",
      billingAddress: "Av. de los Ingenieros 957, Lima, Peru",
    },
    {
      id: "org004",
      name: "Interpublic",
      type: "Holding Agency",
      country: "Global",
      isHolding: true,
      holdingName: "",
      isBigSix: true,
      isPartOfHolding: false,
      legalName: "XXXX SA",
      taxId: "IPG123456GL",
      website: "www.xyz.com",
      contactName: "John Smith",
      contactEmail: "john.smith@interpublic.com",
      status: "Active",
      address: "Av. de los Ingenieros 957",
      city: "Lima",
      state: "",
      zipCode: "33225",
      phone: "+1 212 704 1200",
      industry: "Advertising",
      foundedYear: 1960,
      description:
        "Uno de los mayores grupos de agencias de publicidad y marketing del mundo.",
      billingCurrency: "USD",
      paymentTerms: "Up front",
      billingAddress: "Av. de los Ingenieros 957, Lima, Peru",
    },
    {
      id: "org005",
      name: "WPP",
      type: "Holding Agency",
      country: "Global",
      isHolding: true,
      holdingName: "",
      isBigSix: true,
      isPartOfHolding: false,
      legalName: "XXXX SA",
      taxId: "WPP123456GL",
      website: "www.xyz.com",
      contactName: "Mark Read",
      contactEmail: "mark.read@wpp.com",
      status: "Active",
      address: "Av. de los Ingenieros 957",
      city: "Lima",
      state: "",
      zipCode: "33225",
      phone: "+44 20 7408 2204",
      industry: "Advertising",
      foundedYear: 1971,
      description:
        "El mayor grupo de publicidad y relaciones públicas del mundo por ingresos.",
      billingCurrency: "USD",
      paymentTerms: "Up front",
      billingAddress: "Av. de los Ingenieros 957, Lima, Peru",
    },
    {
      id: "org006",
      name: "OMG",
      type: "Holding Agency",
      country: "Global",
      isHolding: true,
      holdingName: "",
      isBigSix: true,
      isPartOfHolding: false,
      legalName: "XXXX SA",
      taxId: "OMG123456GL",
      website: "www.xyz.com",
      contactName: "John Wren",
      contactEmail: "john.wren@omg.com",
      status: "Active",
      address: "Av. de los Ingenieros 957",
      city: "Lima",
      state: "",
      zipCode: "33225",
      phone: "+1 212 415 3600",
      industry: "Advertising",
      foundedYear: 1986,
      description:
        "Uno de los grupos de agencias de medios más grandes del mundo.",
      billingCurrency: "USD",
      paymentTerms: "Up front",
      billingAddress: "Av. de los Ingenieros 957, Lima, Peru",
    },
    {
      id: "org007",
      name: "Dentsu",
      type: "Holding Agency",
      country: "Japón",
      isHolding: true,
      holdingName: "",
      isBigSix: true,
      isPartOfHolding: false,
      legalName: "XXXX SA",
      taxId: "DNT123456JP",
      website: "www.xyz.com",
      contactName: "Hiroshi Igarashi",
      contactEmail: "hiroshi.igarashi@dentsu.com",
      status: "Active",
      address: "Av. de los Ingenieros 957",
      city: "Lima",
      state: "",
      zipCode: "33225",
      phone: "+81 3 6217 6600",
      industry: "Advertising",
      foundedYear: 1901,
      description:
        "La mayor agencia de publicidad en Japón y una de las más grandes del mundo.",
      billingCurrency: "USD",
      paymentTerms: "Up front",
      billingAddress: "Av. de los Ingenieros 957, Lima, Peru",
    },
    {
      id: "org008",
      name: "UM - Mexico - IPG",
      type: "Agency",
      country: "Mexico",
      isHolding: false,
      holdingName: "Interpublic",
      isBigSix: true,
      isPartOfHolding: true,
      legalName: "XXXX SA",
      taxId: "UMM123456MX",
      website: "www.xyz.com",
      contactName: "Roberto Sánchez",
      contactEmail: "roberto.sanchez@umww.com",
      status: "Active",
      address: "Av. de los Ingenieros 957",
      city: "Lima",
      state: "",
      zipCode: "33225",
      phone: "+52 55 2345 6789",
      industry: "Advertising",
      foundedYear: 2002,
      description:
        "Agencia de medios líder en México, parte del grupo Interpublic.",
      billingCurrency: "USD",
      paymentTerms: "Up front",
      billingAddress: "Av. de los Ingenieros 957, Lima, Peru",
    },
    {
      id: "org009",
      name: "MUV-Brasil-WPP",
      type: "Agency",
      country: "Brasil",
      isHolding: false,
      holdingName: "WPP",
      isBigSix: true,
      isPartOfHolding: true,
      legalName: "XXXX SA",
      taxId: "MUV123456BR",
      website: "www.xyz.com",
      contactName: "Paulo Oliveira",
      contactEmail: "paulo.oliveira@muv.com",
      status: "Active",
      address: "Av. de los Ingenieros 957",
      city: "Lima",
      state: "",
      zipCode: "33225",
      phone: "+55 11 3456 7890",
      industry: "Advertising",
      foundedYear: 2008,
      description: "Agencia de medios líder en Brasil, parte del grupo WPP.",
      billingCurrency: "USD",
      paymentTerms: "Up front",
      billingAddress: "Av. de los Ingenieros 957, Lima, Peru",
    },
    {
      id: "org010",
      name: "Omnet-United States-OMG",
      type: "Agency",
      country: "United States",
      isHolding: false,
      holdingName: "OMG",
      isBigSix: true,
      isPartOfHolding: true,
      legalName: "XXXX SA",
      taxId: "OMN123456US",
      website: "www.xyz.com",
      contactName: "Sarah Johnson",
      contactEmail: "sarah.johnson@omnet.com",
      status: "Active",
      address: "Av. de los Ingenieros 957",
      city: "Lima",
      state: "",
      zipCode: "33225",
      phone: "+1 212 567 8901",
      industry: "Advertising",
      foundedYear: 2010,
      description:
        "Agencia de medios líder en Estados Unidos, parte del grupo OMG.",
      billingCurrency: "USD",
      paymentTerms: "Up front",
      billingAddress: "Av. de los Ingenieros 957, Lima, Peru",
    },
    {
      id: "org011",
      name: "Publicis",
      type: "Holding Agency",
      country: "Global",
      isHolding: true,
      holdingName: "",
      isBigSix: true,
      isPartOfHolding: false,
      legalName: "XXXX SA",
      taxId: "PUB123456GL",
      website: "www.xyz.com",
      contactName: "Arthur Sadoun",
      contactEmail: "arthur.sadoun@publicis.com",
      status: "Active",
      address: "Av. de los Ingenieros 957",
      city: "Lima",
      state: "",
      zipCode: "33225",
      phone: "+33 1 44 43 70 00",
      industry: "Advertising",
      foundedYear: 1926,
      description:
        "Uno de los grupos de comunicación y publicidad más grandes del mundo.",
      billingCurrency: "USD",
      paymentTerms: "Up front",
      billingAddress: "Av. de los Ingenieros 957, Lima, Peru",
    },
    {
      id: "org012",
      name: "Paramount",
      type: "Direct",
      country: "United States",
      isHolding: false,
      holdingName: "",
      isBigSix: false,
      isPartOfHolding: false,
      legalName: "XXXX SA",
      taxId: "PAR123456US",
      website: "www.xyz.com",
      contactName: "Robert Bakish",
      contactEmail: "robert.bakish@paramount.com",
      status: "Active",
      address: "Av. de los Ingenieros 957",
      city: "Lima",
      state: "",
      zipCode: "33225",
      phone: "+1 212 258 6000",
      industry: "Media",
      foundedYear: 1912,
      description:
        "Compañía global de medios y entretenimiento con una cartera de marcas de televisión, películas y plataformas de streaming.",
      billingCurrency: "USD",
      paymentTerms: "Up front",
      billingAddress: "Av. de los Ingenieros 957, Lima, Peru",
    },
    {
      id: "org013",
      name: "Carat-Argentina-Dentsu",
      type: "Agency",
      country: "Argentina",
      isHolding: false,
      holdingName: "Dentsu",
      isBigSix: true,
      isPartOfHolding: true,
      legalName: "XXXX SA",
      taxId: "CAR123456AR",
      website: "www.xyz.com",
      contactName: "Luciana Rodríguez",
      contactEmail: "luciana.rodriguez@carat.com",
      status: "Active",
      address: "Av. de los Ingenieros 957",
      city: "Lima",
      state: "",
      zipCode: "33225",
      phone: "+54 11 4789 2000",
      industry: "Advertising",
      foundedYear: 2003,
      description:
        "Agencia de medios líder en Argentina, parte del grupo Dentsu.",
      billingCurrency: "USD",
      paymentTerms: "Up front",
      billingAddress: "Av. de los Ingenieros 957, Lima, Peru",
    },
    {
      id: "org014",
      name: "Starcom-Mexico-Publicis",
      type: "Agency",
      country: "México",
      isHolding: false,
      holdingName: "Publicis",
      isBigSix: true,
      isPartOfHolding: true,
      legalName: "XXXX SA",
      taxId: "STC123456MX",
      website: "www.xyz.com",
      contactName: "Alejandro Torres",
      contactEmail: "alejandro.torres@starcom.com",
      status: "Active",
      address: "Av. de los Ingenieros 957",
      city: "Lima",
      state: "",
      zipCode: "33225",
      phone: "+52 55 5281 4100",
      industry: "Advertising",
      foundedYear: 2000,
      description:
        "Agencia de medios líder en México, parte del grupo Publicis.",
      billingCurrency: "USD",
      paymentTerms: "Up front",
      billingAddress: "Av. de los Ingenieros 957, Lima, Peru",
    },
    {
      id: "org015",
      name: "OMD-Argentina-OMG",
      type: "Agency",
      country: "Argentina",
      isHolding: false,
      holdingName: "OMG",
      isBigSix: true,
      isPartOfHolding: true,
      legalName: "XXXX SA",
      taxId: "OMA123456AR",
      website: "www.xyz.com",
      contactName: "Martín González",
      contactEmail: "martin.gonzalez@omd.com",
      status: "Active",
      address: "Av. de los Ingenieros 957",
      city: "Lima",
      state: "",
      zipCode: "33225",
      phone: "+54 11 4322 8000",
      industry: "Advertising",
      foundedYear: 1999,
      description: "Agencia de medios líder en Argentina, parte del grupo OMG.",
      billingCurrency: "USD",
      paymentTerms: "Up front",
      billingAddress: "Av. de los Ingenieros 957, Lima, Peru",
    },
    {
      id: "org016",
      name: "Soko",
      type: "Agency",
      country: "Mexico",
      isHolding: false,
      holdingName: "",
      isBigSix: false,
      isPartOfHolding: false,
      legalName: "XXXX SA",
      taxId: "SOK123456MX",
      website: "www.xyz.com",
      contactName: "Ana López",
      contactEmail: "ana.lopez@soko.com",
      status: "Active",
      address: "Av. de los Ingenieros 957",
      city: "Lima",
      state: "",
      zipCode: "33225",
      phone: "+52 55 1234 5678",
      industry: "Food Production",
      foundedYear: 2015,
      description:
        "Agencia independiente especializada en marketing para la industria alimentaria.",
      billingCurrency: "USD",
      paymentTerms: "Up front",
      billingAddress: "Av. de los Ingenieros 957, Lima, Peru",
    },
  ];

  return mockOrganizations.find((org) => org.id === id);
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
      case "Active":
        return "bg-green-50 text-green-700 border-green-200 shadow-green-100";
      case "Inactive":
        return "bg-gray-50 text-gray-700 border-gray-200 shadow-gray-100";
      case "In Review":
        return "bg-amber-50 text-amber-700 border-amber-200 shadow-amber-100";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200 shadow-gray-100";
    }
  };

  // Obtener un ícono para el estado
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Pending":
      case "In Review":
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
      case "Active":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "Closed":
      case "Inactive":
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
    "details" | "contacts" | "rates" | "campaigns" | "trade" | "suborgs"
  >("details");
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [showAddContactForm, setShowAddContactForm] = useState(false);
  const [showAddRateForm, setShowAddRateForm] = useState(false);
  const [showAddIncentiveForm, setShowAddIncentiveForm] = useState(false);

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

    // Cambiar de pestaña si se selecciona trade en una organización no-Agency
    if (
      organization &&
      organization.type !== "Agency" &&
      organization.type !== "Holding Agency" &&
      activeTab === "trade"
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
          <div className="mt-4">
            <BackToOrganizationsButton />
          </div>
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
              <BackToOrganizationsButton />
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">
                    {organization.name}
                  </h1>
                </div>
                <div className="flex items-center space-x-3 mt-4 md:mt-0">
                  <div className="flex items-center">
                    <StatusBadgeLarge status={organization.status} />
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
                    ...(organization.type === "Agency" ||
                    organization.type === "Holding Agency"
                      ? [{ id: "trade", name: "Trade" }]
                      : []),
                    ...(organization.isHolding
                      ? [{ id: "suborgs", name: "Sub-Organizations" }]
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
                            | "trade"
                            | "suborgs"
                        )
                      }
                      className={`
                        whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                        ${
                          activeTab === tab.id
                            ? "border-orange-500 text-orange-600"
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
                      className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-md text-sm font-medium flex items-center gap-2 shadow-sm"
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
                      className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-md text-sm font-medium flex items-center gap-2 shadow-sm"
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
                  {activeTab === "rates" &&
                    organization.type === "Publisher" && (
                      <button
                        onClick={() => {
                          console.log("Botón Add Rate clickeado");
                          setShowAddRateForm(true);
                        }}
                        className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-700 hover:from-orange-600 hover:to-orange-800 text-white rounded-md text-sm font-medium flex items-center gap-2 shadow-sm"
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
                  {activeTab === "trade" &&
                    (organization.type === "Agency" ||
                      organization.type === "Holding Agency") && (
                      <button
                        onClick={() => {
                          console.log("Botón Add Incentive clickeado");
                          setShowAddIncentiveForm(true);
                        }}
                        className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-md text-sm font-medium flex items-center gap-2 shadow-sm"
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
                        Add Incentive
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
              {activeTab === "trade" &&
                (organization.type === "Agency" ||
                  organization.type === "Holding Agency") && (
                  <div id="organization-trade">
                    <OrganizationTrade
                      organization={organization}
                      hideActionButtons={true}
                      showAddIncentiveForm={showAddIncentiveForm}
                      onFormDisplay={() => setShowAddIncentiveForm(false)}
                    />
                  </div>
                )}
              {activeTab === "suborgs" && organization.isHolding && (
                <div id="organization-suborgs">
                  <OrganizationSubOrgs
                    organization={organization}
                    hideActionButtons={true}
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
