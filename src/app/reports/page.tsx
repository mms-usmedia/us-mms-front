"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  SlidersHorizontal,
  Search,
  Download,
  Save,
  ChevronDown,
  BarChart3,
  PieChart,
  LineChart,
  Layers,
  BarChart2,
  Activity,
  TrendingUp,
  FileBarChart,
  FileSpreadsheet,
  Wallet,
  Users,
  Briefcase,
  Building,
  Landmark,
  CircleDollarSign,
  X,
} from "lucide-react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableFooter,
  TableRow,
} from "@/components/ui/table";
import StatusBadge, { StatusType } from "@/components/ui/StatusBadge";

// Componentes de reportes
import ReportTemplates, {
  ReportTemplate,
} from "@/components/reports/ReportTemplates";
import ReportsTable, {
  ReportColumn,
  ReportData,
} from "@/components/reports/ReportsTable";

// Datos de ejemplo
import {
  mockReportTemplates,
  salesByExecutiveData,
  salesByExecutiveColumns,
  activeCampaignsData,
  activeCampaignsColumns,
} from "@/components/reports/mockData";

export default function ReportsPage() {
  const { user, isLoading } = useAuth();
  const [templates, setTemplates] =
    useState<ReportTemplate[]>(mockReportTemplates);
  const [selectedTemplate, setSelectedTemplate] =
    useState<ReportTemplate | null>(null);
  const [reportData, setReportData] = useState<ReportData[]>([]);
  const [reportColumns, setReportColumns] = useState<ReportColumn[]>([]);
  const [showPreview, setShowPreview] = useState<boolean>(false);

  // Estados para la vista de reportes personalizados
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [filterDateRange, setFilterDateRange] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("templates");

  // Estados para el modal de Save as Template
  const [showSaveTemplateModal, setShowSaveTemplateModal] =
    useState<boolean>(false);
  const [newTemplateName, setNewTemplateName] = useState<string>("");
  const [newTemplateDescription, setNewTemplateDescription] =
    useState<string>("");
  const [newTemplateIcon, setNewTemplateIcon] = useState<string>("BarChart3");
  const [newTemplateColor, setNewTemplateColor] = useState<string>("orange");

  // Estados para filtros específicos
  const [orgSearchTerm, setOrgSearchTerm] = useState<string>("");
  const [showOrgDropdown, setShowOrgDropdown] = useState<boolean>(false);
  const [filteredOrganizations, setFilteredOrganizations] = useState<string[]>(
    []
  );
  const [selectedOrganization, setSelectedOrganization] = useState<string>("");
  const [selectedOrganizations, setSelectedOrganizations] = useState<string[]>(
    []
  );
  const orgDropdownRef = useRef<HTMLDivElement>(null);

  // Estados para el filtro de Campaign Owner
  const [ownerSearchTerm, setOwnerSearchTerm] = useState<string>("");
  const [showOwnerDropdown, setShowOwnerDropdown] = useState<boolean>(false);
  const [filteredOwners, setFilteredOwners] = useState<string[]>([]);
  const [selectedOwner, setSelectedOwner] = useState<string>("");
  const [selectedOwners, setSelectedOwners] = useState<string[]>([]);
  const ownerDropdownRef = useRef<HTMLDivElement>(null);

  // Estados para fechas
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // Estados para filtros de HUR
  const [selectedHURStatuses, setSelectedHURStatuses] = useState<string[]>([]);
  const [selectedMediaTypes, setSelectedMediaTypes] = useState<string[]>([]);
  const [selectedBillingOffices, setSelectedBillingOffices] = useState<
    string[]
  >([]);

  // Estados para búsqueda en filtros de HUR
  const [billingOfficeSearchTerm, setBillingOfficeSearchTerm] =
    useState<string>("");
  const [showBillingOfficeDropdown, setShowBillingOfficeDropdown] =
    useState<boolean>(false);
  const [filteredBillingOffices, setFilteredBillingOffices] = useState<
    string[]
  >([]);
  const billingOfficeDropdownRef = useRef<HTMLDivElement>(null);

  // Estados para filtros de Finance
  const [selectedDivisions, setSelectedDivisions] = useState<string[]>([]);
  const [selectedServiceTypes, setSelectedServiceTypes] = useState<string[]>(
    []
  );
  // Custom campaigns: single Service selection for UI pill group
  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedPurchaseTypes, setSelectedPurchaseTypes] = useState<string[]>(
    []
  );
  const [selectedAccount, setSelectedAccount] = useState<string>("");
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [accountSearchTerm, setAccountSearchTerm] = useState<string>("");
  const [showAccountDropdown, setShowAccountDropdown] =
    useState<boolean>(false);
  const [filteredAccounts, setFilteredAccounts] = useState<string[]>([]);
  const [selectedAdvertiser, setSelectedAdvertiser] = useState<string>("");
  const [selectedAdvertisers, setSelectedAdvertisers] = useState<string[]>([]);
  const [advertiserSearchTerm, setAdvertiserSearchTerm] = useState<string>("");
  const [showAdvertiserDropdown, setShowAdvertiserDropdown] =
    useState<boolean>(false);
  const [filteredAdvertisers, setFilteredAdvertisers] = useState<string[]>([]);
  const [selectedPublisher, setSelectedPublisher] = useState<string>("");
  const [selectedPublishers, setSelectedPublishers] = useState<string[]>([]);
  const [publisherSearchTerm, setPublisherSearchTerm] = useState<string>("");
  const [showPublisherDropdown, setShowPublisherDropdown] =
    useState<boolean>(false);
  const [filteredPublishers, setFilteredPublishers] = useState<string[]>([]);
  const accountDropdownRef = useRef<HTMLDivElement>(null);
  const advertiserDropdownRef = useRef<HTMLDivElement>(null);
  const publisherDropdownRef = useRef<HTMLDivElement>(null);

  // Estados para filtros de Organizations
  const [selectedOrgTypes, setSelectedOrgTypes] = useState<string[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedContactTypes, setSelectedContactTypes] = useState<string[]>(
    []
  );

  // Estados para búsqueda en filtros de Organizations
  const [countrySearchTerm, setCountrySearchTerm] = useState<string>("");
  const [showCountryDropdown, setShowCountryDropdown] =
    useState<boolean>(false);
  const [filteredCountries, setFilteredCountries] = useState<string[]>([]);
  const countryDropdownRef = useRef<HTMLDivElement>(null);

  const [industrySearchTerm, setIndustrySearchTerm] = useState<string>("");
  const [showIndustryDropdown, setShowIndustryDropdown] =
    useState<boolean>(false);
  const [filteredIndustries, setFilteredIndustries] = useState<string[]>([]);
  const industryDropdownRef = useRef<HTMLDivElement>(null);

  // Estados para filtros de AdOps
  const [selectedAdOpsStatuses, setSelectedAdOpsStatuses] = useState<string[]>(
    []
  );
  const [selectedCampaignTypes, setSelectedCampaignTypes] = useState<string[]>(
    []
  );
  const [selectedProductTypes, setSelectedProductTypes] = useState<string[]>(
    []
  );
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [selectedTraffickers, setSelectedTraffickers] = useState<string[]>([]);
  const [selectedAdOpsPurchaseTypes, setSelectedAdOpsPurchaseTypes] = useState<
    string[]
  >([]);

  // Estados para búsqueda en filtros de AdOps
  const [productTypeSearchTerm, setProductTypeSearchTerm] =
    useState<string>("");
  const [showProductTypeDropdown, setShowProductTypeDropdown] =
    useState<boolean>(false);
  const [filteredProductTypes, setFilteredProductTypes] = useState<string[]>(
    []
  );
  const productTypeDropdownRef = useRef<HTMLDivElement>(null);

  const [productSearchTerm, setProductSearchTerm] = useState<string>("");
  const [showProductDropdown, setShowProductDropdown] =
    useState<boolean>(false);
  const [filteredProducts, setFilteredProducts] = useState<string[]>([]);
  const productDropdownRef = useRef<HTMLDivElement>(null);

  const [traffickerSearchTerm, setTraffickerSearchTerm] = useState<string>("");
  const [showTraffickerDropdown, setShowTraffickerDropdown] =
    useState<boolean>(false);
  const [filteredTraffickers, setFilteredTraffickers] = useState<string[]>([]);
  const traffickerDropdownRef = useRef<HTMLDivElement>(null);

  // Datos de ejemplo para organizaciones
  const organizations = useMemo(
    () => [
      "Organization 1",
      "Organization 2",
      "Organization 3",
      "US Media Group",
      "Media Partners Inc.",
      "Digital Advertising Solutions",
    ],
    []
  );

  // Datos de ejemplo para campaign owners
  const campaignOwners = useMemo(
    () => [
      "John Smith",
      "Maria Garcia",
      "David Johnson",
      "Sofia Rodriguez",
      "Michael Brown",
      "Emma Martinez",
    ],
    []
  );

  // Datos de HUR
  const hurStatuses = useMemo(
    () => [
      "Review",
      "More Info",
      "Approved",
      "Remove Invoice",
      "Re-open Campaign",
      "Editing",
      "Close Campaign",
      "Close Invoice Period",
      "Not Approved",
      "Completed",
    ],
    []
  );

  const mediaTypes = useMemo(
    () => ["Online", "Print", "Broadcast", "Out of Home"],
    []
  );
  const billingOffices = useMemo(() => ["Miami", "Mexico"], []);

  // Datos de Finance
  const divisions = useMemo(() => ["Online", "OOH", "Broadcast", "Print"], []);
  const serviceTypes = useMemo(
    () => [
      "Representación Comercial",
      "Servicio de Medios (IMB)",
      "Prefered Ad Services (PAS)",
      "Clearing House",
      "Mobile Performance",
    ],
    []
  );
  const purchaseTypes = useMemo(() => ["IO-Based", "Programmatic"], []);
  const accounts = useMemo(
    () => [
      "Account 1",
      "Account 2",
      "Account 3",
      "Major Accounts Inc.",
      "Global Media Group",
      "Digital Partners",
    ],
    []
  );
  const advertisers = useMemo(
    () => [
      "Advertiser 1",
      "Advertiser 2",
      "Advertiser 3",
      "Big Brand Co.",
      "Tech Solutions",
      "Fashion Brand",
    ],
    []
  );
  const publishers = useMemo(
    () => [
      "Publisher 1",
      "Publisher 2",
      "Publisher 3",
      "News Network",
      "Digital Magazine",
      "Video Platform",
    ],
    []
  );

  // Datos de Organizations
  const orgTypes = useMemo(
    () => ["Advertiser", "Publisher", "Agency", "Vendor"],
    []
  );
  const countries = useMemo(
    () => ["USA", "Mexico", "Colombia", "Brazil", "Argentina", "Chile", "Peru"],
    []
  );
  const industries = useMemo(
    () => [
      "Technology",
      "Automotive",
      "Finance",
      "Retail",
      "Healthcare",
      "Entertainment",
    ],
    []
  );
  const contactTypes = useMemo(
    () => ["Primary", "Billing", "Technical", "Legal"],
    []
  );

  // Datos de AdOps
  const adOpsStatuses = useMemo(
    () => ["Active", "Paused", "Completed", "Cancelled"],
    []
  );
  const campaignTypes = useMemo(
    () => ["Branding", "Performance", "Hybrid"],
    []
  );
  const productTypes = useMemo(
    () => [
      "Banners",
      "Pre-roll",
      "Mid-roll",
      "Post-roll",
      "In-feed",
      "Sponsored Content",
    ],
    []
  );
  const products = useMemo(
    () => [
      "Banners",
      "Pre-roll",
      "Mid-roll",
      "Post-roll",
      "In-feed",
      "Sponsored Content",
    ],
    []
  );
  const traffickers = useMemo(
    () => [
      "John Smith",
      "Maria Garcia",
      "Alex Johnson",
      "Sarah Lee",
      "David Kim",
    ],
    []
  );
  const adOpsPurchaseTypes = useMemo(
    () => ["Direct", "Programmatic", "Hybrid"],
    []
  );

  // Filtrar organizaciones cuando se escribe en el campo de búsqueda
  useEffect(() => {
    if (orgSearchTerm) {
      const filtered = organizations.filter((org) =>
        org.toLowerCase().includes(orgSearchTerm.toLowerCase())
      );
      setFilteredOrganizations(filtered);
    } else {
      setFilteredOrganizations(organizations);
    }
  }, [orgSearchTerm, organizations]);

  // Filtrar owners cuando se escribe en el campo de búsqueda
  useEffect(() => {
    if (ownerSearchTerm) {
      const filtered = campaignOwners.filter((owner) =>
        owner.toLowerCase().includes(ownerSearchTerm.toLowerCase())
      );
      setFilteredOwners(filtered);
    } else {
      setFilteredOwners(campaignOwners);
    }
  }, [ownerSearchTerm, campaignOwners]);

  // Filtrar accounts cuando se escribe en el campo de búsqueda
  useEffect(() => {
    if (accountSearchTerm) {
      const filtered = accounts.filter((account) =>
        account.toLowerCase().includes(accountSearchTerm.toLowerCase())
      );
      setFilteredAccounts(filtered);
    } else {
      setFilteredAccounts(accounts);
    }
  }, [accountSearchTerm, accounts]);

  // Filtrar advertisers cuando se escribe en el campo de búsqueda
  useEffect(() => {
    if (advertiserSearchTerm) {
      const filtered = advertisers.filter((advertiser) =>
        advertiser.toLowerCase().includes(advertiserSearchTerm.toLowerCase())
      );
      setFilteredAdvertisers(filtered);
    } else {
      setFilteredAdvertisers(advertisers);
    }
  }, [advertiserSearchTerm, advertisers]);

  // Filtrar publishers cuando se escribe en el campo de búsqueda
  useEffect(() => {
    if (publisherSearchTerm) {
      const filtered = publishers.filter((publisher) =>
        publisher.toLowerCase().includes(publisherSearchTerm.toLowerCase())
      );
      setFilteredPublishers(filtered);
    } else {
      setFilteredPublishers(publishers);
    }
  }, [publisherSearchTerm, publishers]);

  // Filtrar tipos de producto cuando se escribe en el campo de búsqueda
  useEffect(() => {
    if (productTypeSearchTerm) {
      const filtered = productTypes.filter((productType) =>
        productType.toLowerCase().includes(productTypeSearchTerm.toLowerCase())
      );
      setFilteredProductTypes(filtered);
    } else {
      setFilteredProductTypes(productTypes);
    }
  }, [productTypeSearchTerm, productTypes]);

  // Filtrar productos cuando se escribe en el campo de búsqueda
  useEffect(() => {
    if (productSearchTerm) {
      const filtered = products.filter((product) =>
        product.toLowerCase().includes(productSearchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [productSearchTerm, products]);

  // Filtrar traffickers cuando se escribe en el campo de búsqueda
  useEffect(() => {
    if (traffickerSearchTerm) {
      const filtered = traffickers.filter((trafficker) =>
        trafficker.toLowerCase().includes(traffickerSearchTerm.toLowerCase())
      );
      setFilteredTraffickers(filtered);
    } else {
      setFilteredTraffickers(traffickers);
    }
  }, [traffickerSearchTerm, traffickers]);

  // Filtrar oficinas de facturación cuando se escribe en el campo de búsqueda
  useEffect(() => {
    if (billingOfficeSearchTerm) {
      const filtered = billingOffices.filter((office) =>
        office.toLowerCase().includes(billingOfficeSearchTerm.toLowerCase())
      );
      setFilteredBillingOffices(filtered);
    } else {
      setFilteredBillingOffices(billingOffices);
    }
  }, [billingOfficeSearchTerm, billingOffices]);

  // Filtrar países cuando se escribe en el campo de búsqueda
  useEffect(() => {
    if (countrySearchTerm) {
      const filtered = countries.filter((country) =>
        country.toLowerCase().includes(countrySearchTerm.toLowerCase())
      );
      setFilteredCountries(filtered);
    } else {
      setFilteredCountries(countries);
    }
  }, [countrySearchTerm, countries]);

  // Filtrar industrias cuando se escribe en el campo de búsqueda
  useEffect(() => {
    if (industrySearchTerm) {
      const filtered = industries.filter((industry) =>
        industry.toLowerCase().includes(industrySearchTerm.toLowerCase())
      );
      setFilteredIndustries(filtered);
    } else {
      setFilteredIndustries(industries);
    }
  }, [industrySearchTerm, industries]);

  // Cerrar dropdown cuando se hace clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        orgDropdownRef.current &&
        !orgDropdownRef.current.contains(event.target as Node)
      ) {
        setShowOrgDropdown(false);
      }

      if (
        ownerDropdownRef.current &&
        !ownerDropdownRef.current.contains(event.target as Node)
      ) {
        setShowOwnerDropdown(false);
      }

      if (
        accountDropdownRef.current &&
        !accountDropdownRef.current.contains(event.target as Node)
      ) {
        setShowAccountDropdown(false);
      }

      if (
        advertiserDropdownRef.current &&
        !advertiserDropdownRef.current.contains(event.target as Node)
      ) {
        setShowAdvertiserDropdown(false);
      }

      if (
        publisherDropdownRef.current &&
        !publisherDropdownRef.current.contains(event.target as Node)
      ) {
        setShowPublisherDropdown(false);
      }

      if (
        productTypeDropdownRef.current &&
        !productTypeDropdownRef.current.contains(event.target as Node)
      ) {
        setShowProductTypeDropdown(false);
      }

      if (
        productDropdownRef.current &&
        !productDropdownRef.current.contains(event.target as Node)
      ) {
        setShowProductDropdown(false);
      }

      if (
        traffickerDropdownRef.current &&
        !traffickerDropdownRef.current.contains(event.target as Node)
      ) {
        setShowTraffickerDropdown(false);
      }

      if (
        billingOfficeDropdownRef.current &&
        !billingOfficeDropdownRef.current.contains(event.target as Node)
      ) {
        setShowBillingOfficeDropdown(false);
      }

      if (
        countryDropdownRef.current &&
        !countryDropdownRef.current.contains(event.target as Node)
      ) {
        setShowCountryDropdown(false);
      }

      if (
        industryDropdownRef.current &&
        !industryDropdownRef.current.contains(event.target as Node)
      ) {
        setShowIndustryDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Resetear filtros cuando cambia el módulo seleccionado
  useEffect(() => {
    if (selectedModule) {
      setFilterStatus("");
      setFilterDateRange("");
      setSearchTerm("");
      setSelectedOrganization("");
      setOrgSearchTerm("");
      setSelectedOwner("");
      setOwnerSearchTerm("");
      setStartDate("");
      setEndDate("");
      setSelectedStatuses([]);
      setSelectedOrganizations([]);
      setSelectedOwners([]);
      setSelectedHURStatuses([]);
      setSelectedMediaTypes([]);
      setSelectedBillingOffices([]);
      setSelectedDivisions([]);
      setSelectedServiceTypes([]);
      setSelectedPurchaseTypes([]);
      setSelectedAccount("");
      setAccountSearchTerm("");
      setSelectedAdvertiser("");
      setAdvertiserSearchTerm("");
      setSelectedPublisher("");
      setPublisherSearchTerm("");
      setSelectedOrgTypes([]);
      setSelectedCountries([]);
      setSelectedIndustries([]);
      setSelectedContactTypes([]);
      setSelectedAdOpsStatuses([]);
      setSelectedCampaignTypes([]);
      setSelectedProductTypes([]);
      setSelectedProducts([]);
      setSelectedTraffickers([]);
      setSelectedAdOpsPurchaseTypes([]);
      setProductTypeSearchTerm("");
      setProductSearchTerm("");
      setTraffickerSearchTerm("");
      setBillingOfficeSearchTerm("");
      setCountrySearchTerm("");
      setIndustrySearchTerm("");
      setSelectedAccounts([]);
      setSelectedAdvertisers([]);
      setSelectedPublishers([]);
    }
  }, [selectedModule]);

  // Comprobar si hay filtros activos
  const hasActiveFilters = () => {
    return (
      filterStatus !== "" ||
      filterDateRange !== "" ||
      searchTerm !== "" ||
      selectedOrganization !== "" ||
      selectedOwner !== "" ||
      startDate !== "" ||
      endDate !== "" ||
      selectedStatuses.length > 0 ||
      selectedOrganizations.length > 0 ||
      selectedOwners.length > 0 ||
      selectedHURStatuses.length > 0 ||
      selectedMediaTypes.length > 0 ||
      selectedBillingOffices.length > 0 ||
      selectedDivisions.length > 0 ||
      selectedServiceTypes.length > 0 ||
      selectedPurchaseTypes.length > 0 ||
      selectedAccount !== "" ||
      selectedAdvertiser !== "" ||
      selectedPublisher !== "" ||
      selectedOrgTypes.length > 0 ||
      selectedCountries.length > 0 ||
      selectedIndustries.length > 0 ||
      selectedContactTypes.length > 0 ||
      selectedAdOpsStatuses.length > 0 ||
      selectedCampaignTypes.length > 0 ||
      selectedProductTypes.length > 0 ||
      selectedProducts.length > 0 ||
      selectedTraffickers.length > 0 ||
      selectedAdOpsPurchaseTypes.length > 0
    );
  };

  // Manejar la vista previa de un template
  const handlePreviewTemplate = (template: ReportTemplate) => {
    setSelectedTemplate(template);
    setShowPreview(true);

    // Cargar datos según el tipo de template
    switch (template.name) {
      case "Sales by Executive":
        setReportData(salesByExecutiveData);
        setReportColumns(salesByExecutiveColumns);
        break;
      case "Active Campaigns":
        setReportData(activeCampaignsData);
        setReportColumns(activeCampaignsColumns);
        break;
      default:
        setReportData([]);
        setReportColumns([]);
    }
  };

  // Manejar la exportación de un template
  const handleExportTemplate = (template: ReportTemplate, format: string) => {
    alert(`Exporting report "${template.name}" in ${format} format`);
  };

  // Manejar el cambio de favorito de un template
  const handleToggleFavorite = (templateId: string) => {
    setTemplates(
      templates.map((template) =>
        template.id === templateId
          ? { ...template, isFavorite: !template.isFavorite }
          : template
      )
    );
  };

  // Manejar la eliminación de un template
  const handleDeleteTemplate = (templateId: string) => {
    setTemplates(templates.filter((template) => template.id !== templateId));
  };

  // Manejar la exportación de datos
  const handleExportData = (format: string) => {
    alert(`Exporting data in ${format} format`);
  };

  // Manejar la selección de un módulo
  const handleModuleSelect = (module: string) => {
    setSelectedModule(module);

    // Resetear los filtros y la barra de búsqueda al cambiar de módulo
    setSearchTerm("");
    setFilterStatus("");
    setFilterDateRange("");
    setShowFilters(false);

    // Cargar datos según el módulo seleccionado
    switch (module) {
      case "campaigns":
        setReportData(activeCampaignsData);
        setReportColumns(activeCampaignsColumns);
        break;
      case "finance":
        // Aquí cargaríamos datos financieros, por ahora usamos datos de ejemplo
        setReportData(salesByExecutiveData);
        setReportColumns(salesByExecutiveColumns);
        break;
      case "adops":
        // Aquí cargaríamos datos de AdOps, por ahora usamos datos de ejemplo
        setReportData(activeCampaignsData);
        setReportColumns(activeCampaignsColumns);
        break;
      case "hur":
        // Aquí cargaríamos datos de HUR, por ahora usamos datos de ejemplo
        setReportData(salesByExecutiveData);
        setReportColumns(salesByExecutiveColumns);
        break;
      case "organizations":
        // Aquí cargaríamos datos de organizaciones, por ahora usamos datos de ejemplo
        setReportData(activeCampaignsData);
        setReportColumns(activeCampaignsColumns);
        break;
      default:
        setReportData([]);
        setReportColumns([]);
    }
  };

  // Volver a la selección de módulos
  const handleBackToModules = () => {
    setSelectedModule(null);
    setActiveTab("custom");

    // Resetear los filtros y la barra de búsqueda al volver a la selección de módulos
    setSearchTerm("");
    setFilterStatus("");
    setFilterDateRange("");
    setShowFilters(false);
  };

  // Guardar como template
  const handleSaveAsTemplate = () => {
    setShowSaveTemplateModal(true);
  };

  // Cerrar modal
  const handleCloseTemplateModal = () => {
    setShowSaveTemplateModal(false);
    setNewTemplateName("");
    setNewTemplateDescription("");
    setNewTemplateIcon("BarChart3");
    setNewTemplateColor("orange");
  };

  // Guardar nuevo template
  const handleSaveNewTemplate = () => {
    if (!newTemplateName.trim()) {
      alert("Please enter a template name");
      return;
    }

    const newTemplate: ReportTemplate = {
      id: `template-${Date.now()}`,
      name: newTemplateName,
      description: newTemplateDescription,
      module: selectedModule as
        | "campaigns"
        | "finance"
        | "adops"
        | "hur"
        | "organizations",
      isFavorite: false,
      createdAt: new Date().toISOString(),
      createdBy: user?.name || "User",
      filters: {
        statuses: selectedStatuses,
        organizations: selectedOrganizations,
        owners: selectedOwners,
        startDate,
        endDate,
        // Add other filters based on the selected module
      },
      icon: newTemplateIcon,
      color: newTemplateColor,
    };

    setTemplates([...templates, newTemplate]);
    handleCloseTemplateModal();
    alert("Template saved successfully!");
  };

  // Función para alternar la selección de un status
  const toggleStatus = (status: string) => {
    if (selectedStatuses.includes(status)) {
      setSelectedStatuses(selectedStatuses.filter((s) => s !== status));
    } else {
      setSelectedStatuses([...selectedStatuses, status]);
    }
  };

  // Función para alternar la selección de una organización
  const toggleOrganization = (org: string) => {
    if (selectedOrganizations.includes(org)) {
      setSelectedOrganizations(selectedOrganizations.filter((o) => o !== org));
    } else {
      setSelectedOrganizations([...selectedOrganizations, org]);
    }
  };

  // Función para alternar la selección de un propietario
  const toggleOwner = (owner: string) => {
    if (selectedOwners.includes(owner)) {
      setSelectedOwners(selectedOwners.filter((o) => o !== owner));
    } else {
      setSelectedOwners([...selectedOwners, owner]);
    }
  };

  // Función para alternar la selección de un status de HUR
  const toggleHURStatus = (status: string) => {
    if (selectedHURStatuses.includes(status)) {
      setSelectedHURStatuses(selectedHURStatuses.filter((s) => s !== status));
    } else {
      setSelectedHURStatuses([...selectedHURStatuses, status]);
    }
  };

  // Función para alternar la selección de un tipo de medio
  const toggleMediaType = (mediaType: string) => {
    if (selectedMediaTypes.includes(mediaType)) {
      setSelectedMediaTypes(selectedMediaTypes.filter((m) => m !== mediaType));
    } else {
      setSelectedMediaTypes([...selectedMediaTypes, mediaType]);
    }
  };

  // Función para alternar la selección de una oficina de facturación
  const toggleBillingOffice = (office: string) => {
    if (selectedBillingOffices.includes(office)) {
      setSelectedBillingOffices(
        selectedBillingOffices.filter((o) => o !== office)
      );
    } else {
      setSelectedBillingOffices([...selectedBillingOffices, office]);
    }
  };

  // Función para alternar la selección de una división
  const toggleDivision = (division: string) => {
    if (selectedDivisions.includes(division)) {
      setSelectedDivisions(selectedDivisions.filter((d) => d !== division));
    } else {
      setSelectedDivisions([...selectedDivisions, division]);
    }
  };

  // Función para alternar la selección de un tipo de servicio
  const toggleServiceType = (serviceType: string) => {
    if (selectedServiceTypes.includes(serviceType)) {
      setSelectedServiceTypes(
        selectedServiceTypes.filter((s) => s !== serviceType)
      );
    } else {
      setSelectedServiceTypes([...selectedServiceTypes, serviceType]);
    }
  };

  // Función para alternar la selección de un tipo de compra
  const togglePurchaseType = (purchaseType: string) => {
    if (selectedPurchaseTypes.includes(purchaseType)) {
      setSelectedPurchaseTypes(
        selectedPurchaseTypes.filter((p) => p !== purchaseType)
      );
    } else {
      setSelectedPurchaseTypes([...selectedPurchaseTypes, purchaseType]);
    }
  };

  // Función para alternar la selección de un tipo de organización
  const toggleOrgType = (orgType: string) => {
    if (selectedOrgTypes.includes(orgType)) {
      setSelectedOrgTypes(selectedOrgTypes.filter((t) => t !== orgType));
    } else {
      setSelectedOrgTypes([...selectedOrgTypes, orgType]);
    }
  };

  // Función para alternar la selección de un país
  const toggleCountry = (country: string) => {
    if (selectedCountries.includes(country)) {
      setSelectedCountries(selectedCountries.filter((c) => c !== country));
    } else {
      setSelectedCountries([...selectedCountries, country]);
    }
  };

  // Función para alternar la selección de una industria
  const toggleIndustry = (industry: string) => {
    if (selectedIndustries.includes(industry)) {
      setSelectedIndustries(selectedIndustries.filter((i) => i !== industry));
    } else {
      setSelectedIndustries([...selectedIndustries, industry]);
    }
  };

  // Función para alternar la selección de un tipo de contacto
  const toggleContactType = (contactType: string) => {
    if (selectedContactTypes.includes(contactType)) {
      setSelectedContactTypes(
        selectedContactTypes.filter((c) => c !== contactType)
      );
    } else {
      setSelectedContactTypes([...selectedContactTypes, contactType]);
    }
  };

  // Función para alternar la selección de un status de AdOps
  const toggleAdOpsStatus = (status: string) => {
    if (selectedAdOpsStatuses.includes(status)) {
      setSelectedAdOpsStatuses(
        selectedAdOpsStatuses.filter((s) => s !== status)
      );
    } else {
      setSelectedAdOpsStatuses([...selectedAdOpsStatuses, status]);
    }
  };

  // Función para alternar la selección de un tipo de campaña
  const toggleCampaignType = (campaignType: string) => {
    if (selectedCampaignTypes.includes(campaignType)) {
      setSelectedCampaignTypes(
        selectedCampaignTypes.filter((c) => c !== campaignType)
      );
    } else {
      setSelectedCampaignTypes([...selectedCampaignTypes, campaignType]);
    }
  };

  // Función para alternar la selección de un tipo de producto
  const toggleProductType = (productType: string) => {
    if (selectedProductTypes.includes(productType)) {
      setSelectedProductTypes(
        selectedProductTypes.filter((p) => p !== productType)
      );
    } else {
      setSelectedProductTypes([...selectedProductTypes, productType]);
    }
  };

  // Función para alternar la selección de un producto
  const toggleProduct = (product: string) => {
    if (selectedProducts.includes(product)) {
      setSelectedProducts(selectedProducts.filter((p) => p !== product));
    } else {
      setSelectedProducts([...selectedProducts, product]);
    }
  };

  // Función para alternar la selección de un trafficker
  const toggleTrafficker = (trafficker: string) => {
    if (selectedTraffickers.includes(trafficker)) {
      setSelectedTraffickers(
        selectedTraffickers.filter((t) => t !== trafficker)
      );
    } else {
      setSelectedTraffickers([...selectedTraffickers, trafficker]);
    }
  };

  // Función para alternar la selección de un tipo de compra de AdOps
  const toggleAdOpsPurchaseType = (purchaseType: string) => {
    if (selectedAdOpsPurchaseTypes.includes(purchaseType)) {
      setSelectedAdOpsPurchaseTypes(
        selectedAdOpsPurchaseTypes.filter((p) => p !== purchaseType)
      );
    } else {
      setSelectedAdOpsPurchaseTypes([
        ...selectedAdOpsPurchaseTypes,
        purchaseType,
      ]);
    }
  };

  // Función para alternar la selección de una cuenta
  const toggleAccount = (account: string) => {
    if (selectedAccounts.includes(account)) {
      setSelectedAccounts(selectedAccounts.filter((a) => a !== account));
    } else {
      setSelectedAccounts([...selectedAccounts, account]);
    }
  };

  // Función para alternar la selección de un anunciante
  const toggleAdvertiser = (advertiser: string) => {
    if (selectedAdvertisers.includes(advertiser)) {
      setSelectedAdvertisers(
        selectedAdvertisers.filter((a) => a !== advertiser)
      );
    } else {
      setSelectedAdvertisers([...selectedAdvertisers, advertiser]);
    }
  };

  // Función para alternar la selección de un publisher
  const togglePublisher = (publisher: string) => {
    if (selectedPublishers.includes(publisher)) {
      setSelectedPublishers(selectedPublishers.filter((p) => p !== publisher));
    } else {
      setSelectedPublishers([...selectedPublishers, publisher]);
    }
  };

  // Obtener color para el badge de status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-amber-50 text-amber-700 border-amber-100";
      case "Negotiating":
        return "bg-blue-50 text-blue-700 border-blue-100";
      case "Won":
        return "bg-orange-50 text-orange-700 border-orange-100";
      case "Approved":
        return "bg-green-50 text-green-700 border-green-100";
      case "Materials & Creatives OK":
        return "bg-teal-50 text-teal-700 border-teal-100";
      case "Implementation":
        return "bg-cyan-50 text-cyan-700 border-cyan-100";
      case "Live":
        return "bg-violet-50 text-violet-700 border-violet-100";
      case "Closed":
        return "bg-gray-50 text-gray-700 border-gray-100";
      case "HUR":
        return "bg-rose-50 text-rose-700 border-rose-100";
      case "Invoiced":
        return "bg-purple-50 text-purple-700 border-purple-100";
      default:
        return "bg-gray-50 text-gray-700 border-gray-100";
    }
  };

  // Obtener color para el badge de status de HUR
  const getHURStatusColor = (status: string) => {
    switch (status) {
      case "Review":
        return "bg-amber-50 text-amber-700 border-amber-100";
      case "More Info":
        return "bg-blue-50 text-blue-700 border-blue-100";
      case "Approved":
        return "bg-green-50 text-green-700 border-green-100";
      case "Remove Invoice":
        return "bg-teal-50 text-teal-700 border-teal-100";
      case "Re-open Campaign":
        return "bg-cyan-50 text-cyan-700 border-cyan-100";
      case "Editing":
        return "bg-violet-50 text-violet-700 border-violet-100";
      case "Close Campaign":
        return "bg-gray-50 text-gray-700 border-gray-100";
      case "Close Invoice Period":
        return "bg-rose-50 text-rose-700 border-rose-100";
      case "Not Approved":
        return "bg-red-50 text-red-700 border-red-100";
      case "Completed":
        return "bg-purple-50 text-purple-700 border-purple-100";
      default:
        return "bg-gray-50 text-gray-700 border-gray-100";
    }
  };

  // Obtener color para el badge de tipo de medio
  const getMediaTypeColor = (mediaType: string) => {
    switch (mediaType) {
      case "Online":
        return "bg-blue-50 text-blue-700 border-blue-100";
      case "Print":
        return "bg-purple-50 text-purple-700 border-purple-100";
      case "Broadcast":
        return "bg-pink-50 text-pink-700 border-pink-100";
      case "Out of Home":
        return "bg-amber-50 text-amber-700 border-amber-100";
      default:
        return "bg-gray-50 text-gray-700 border-gray-100";
    }
  };

  // Obtener color para el badge de oficina de facturación
  const getBillingOfficeColor = (office: string) => {
    switch (office) {
      case "Miami":
        return "bg-orange-50 text-orange-700 border-orange-100";
      case "Mexico":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      default:
        return "bg-gray-50 text-gray-700 border-gray-100";
    }
  };

  // Obtener color para el badge de división
  const getDivisionColor = (division: string) => {
    switch (division) {
      case "Online":
        return "bg-blue-50 text-blue-700 border-blue-100";
      case "OOH":
        return "bg-yellow-50 text-yellow-700 border-yellow-100";
      case "Broadcast":
        return "bg-green-50 text-green-700 border-green-100";
      case "Print":
        return "bg-purple-50 text-purple-700 border-purple-100";
      default:
        return "bg-gray-50 text-gray-700 border-gray-100";
    }
  };

  // Obtener color para el badge de tipo de servicio
  const getServiceTypeColor = (serviceType: string) => {
    switch (serviceType) {
      case "Representación Comercial":
        return "bg-blue-50 text-blue-700 border-blue-100";
      case "Servicio de Medios (IMB)":
        return "bg-indigo-50 text-indigo-700 border-indigo-100";
      case "Prefered Ad Services (PAS)":
        return "bg-purple-50 text-purple-700 border-purple-100";
      case "Clearing House":
        return "bg-green-50 text-green-700 border-green-100";
      case "Mobile Performance":
        return "bg-yellow-50 text-yellow-700 border-yellow-100";
      default:
        return "bg-gray-50 text-gray-700 border-gray-100";
    }
  };

  // Obtener color para el badge de tipo de compra
  const getPurchaseTypeColor = (purchaseType: string) => {
    switch (purchaseType) {
      case "IO-Based":
        return "bg-blue-50 text-blue-700 border-blue-100";
      case "Programmatic":
        return "bg-orange-50 text-orange-700 border-orange-100";
      default:
        return "bg-gray-50 text-gray-700 border-gray-100";
    }
  };

  // Obtener color para el badge de tipo de organización
  const getOrgTypeColor = (orgType: string) => {
    switch (orgType) {
      case "Advertiser":
        return "bg-blue-50 text-blue-700 border-blue-100";
      case "Publisher":
        return "bg-green-50 text-green-700 border-green-100";
      case "Agency":
        return "bg-purple-50 text-purple-700 border-purple-100";
      case "Vendor":
        return "bg-amber-50 text-amber-700 border-amber-100";
      default:
        return "bg-gray-50 text-gray-700 border-gray-100";
    }
  };

  // Obtener color para el badge de país
  const getCountryColor = (country: string) => {
    switch (country) {
      case "USA":
        return "bg-blue-50 text-blue-700 border-blue-100";
      case "Mexico":
        return "bg-green-50 text-green-700 border-green-100";
      case "Colombia":
        return "bg-yellow-50 text-yellow-700 border-yellow-100";
      case "Brazil":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "Argentina":
        return "bg-cyan-50 text-cyan-700 border-cyan-100";
      case "Chile":
        return "bg-red-50 text-red-700 border-red-100";
      case "Peru":
        return "bg-orange-50 text-orange-700 border-orange-100";
      default:
        return "bg-gray-50 text-gray-700 border-gray-100";
    }
  };

  // Obtener color para el badge de industria
  const getIndustryColor = (industry: string) => {
    switch (industry) {
      case "Technology":
        return "bg-blue-50 text-blue-700 border-blue-100";
      case "Automotive":
        return "bg-red-50 text-red-700 border-red-100";
      case "Finance":
        return "bg-green-50 text-green-700 border-green-100";
      case "Retail":
        return "bg-purple-50 text-purple-700 border-purple-100";
      case "Healthcare":
        return "bg-cyan-50 text-cyan-700 border-cyan-100";
      case "Entertainment":
        return "bg-amber-50 text-amber-700 border-amber-100";
      default:
        return "bg-gray-50 text-gray-700 border-gray-100";
    }
  };

  // Obtener color para el badge de tipo de contacto
  const getContactTypeColor = (contactType: string) => {
    switch (contactType) {
      case "Primary":
        return "bg-blue-50 text-blue-700 border-blue-100";
      case "Billing":
        return "bg-green-50 text-green-700 border-green-100";
      case "Technical":
        return "bg-amber-50 text-amber-700 border-amber-100";
      case "Legal":
        return "bg-purple-50 text-purple-700 border-purple-100";
      default:
        return "bg-gray-50 text-gray-700 border-gray-100";
    }
  };

  // Obtener color para el badge de status de AdOps
  const getAdOpsStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-50 text-green-700 border-green-100";
      case "Paused":
        return "bg-yellow-50 text-yellow-700 border-yellow-100";
      case "Completed":
        return "bg-blue-50 text-blue-700 border-blue-100";
      case "Cancelled":
        return "bg-red-50 text-red-700 border-red-100";
      default:
        return "bg-gray-50 text-gray-700 border-gray-100";
    }
  };

  // Obtener color para el badge de tipo de campaña
  const getCampaignTypeColor = (campaignType: string) => {
    switch (campaignType) {
      case "Branding":
        return "bg-purple-50 text-purple-700 border-purple-100";
      case "Performance":
        return "bg-blue-50 text-blue-700 border-blue-100";
      case "Hybrid":
        return "bg-indigo-50 text-indigo-700 border-indigo-100";
      default:
        return "bg-gray-50 text-gray-700 border-gray-100";
    }
  };

  // Obtener color para el badge de tipo de producto
  const getProductTypeColor = (productType: string) => {
    switch (productType) {
      case "Display":
        return "bg-blue-50 text-blue-700 border-blue-100";
      case "Video":
        return "bg-red-50 text-red-700 border-red-100";
      case "Native":
        return "bg-green-50 text-green-700 border-green-100";
      case "Social":
        return "bg-purple-50 text-purple-700 border-purple-100";
      default:
        return "bg-gray-50 text-gray-700 border-gray-100";
    }
  };

  // Obtener color para el badge de producto
  const getProductColor = (product: string) => {
    switch (product) {
      case "Banners":
        return "bg-blue-50 text-blue-700 border-blue-100";
      case "Pre-roll":
        return "bg-red-50 text-red-700 border-red-100";
      case "Mid-roll":
        return "bg-amber-50 text-amber-700 border-amber-100";
      case "Post-roll":
        return "bg-orange-50 text-orange-700 border-orange-100";
      case "In-feed":
        return "bg-green-50 text-green-700 border-green-100";
      case "Sponsored Content":
        return "bg-purple-50 text-purple-700 border-purple-100";
      default:
        return "bg-gray-50 text-gray-700 border-gray-100";
    }
  };

  // Obtener color para el badge de trafficker
  const getTraffickerColor = (trafficker: string) => {
    const colors = [
      "bg-blue-50 text-blue-700 border-blue-100",
      "bg-green-50 text-green-700 border-green-100",
      "bg-purple-50 text-purple-700 border-purple-100",
      "bg-amber-50 text-amber-700 border-amber-100",
      "bg-red-50 text-red-700 border-red-100",
    ];
    const index = traffickers.indexOf(trafficker) % colors.length;
    return colors[index];
  };

  // Obtener color para el badge de tipo de compra de AdOps
  const getAdOpsPurchaseTypeColor = (purchaseType: string) => {
    switch (purchaseType) {
      case "Direct":
        return "bg-blue-50 text-blue-700 border-blue-100";
      case "Programmatic":
        return "bg-orange-50 text-orange-700 border-orange-100";
      case "Hybrid":
        return "bg-purple-50 text-purple-700 border-purple-100";
      default:
        return "bg-gray-50 text-gray-700 border-gray-100";
    }
  };

  // Limpiar filtros
  const handleClearFilters = () => {
    setFilterStatus("");
    setFilterDateRange("");
    setSearchTerm("");
    setSelectedOrganization("");
    setOrgSearchTerm("");
    setSelectedOwner("");
    setOwnerSearchTerm("");
    setStartDate("");
    setEndDate("");
    setSelectedStatuses([]);
    setSelectedOrganizations([]);
    setSelectedOwners([]);
    setSelectedHURStatuses([]);
    setSelectedMediaTypes([]);
    setSelectedBillingOffices([]);
    setSelectedDivisions([]);
    setSelectedServiceTypes([]);
    setSelectedPurchaseTypes([]);
    setSelectedAccount("");
    setAccountSearchTerm("");
    setSelectedAdvertiser("");
    setAdvertiserSearchTerm("");
    setSelectedPublisher("");
    setPublisherSearchTerm("");
    setSelectedOrgTypes([]);
    setSelectedCountries([]);
    setSelectedIndustries([]);
    setSelectedContactTypes([]);
    setSelectedAdOpsStatuses([]);
    setSelectedCampaignTypes([]);
    setSelectedProductTypes([]);
    setSelectedProducts([]);
    setSelectedTraffickers([]);
    setSelectedAdOpsPurchaseTypes([]);
    setProductTypeSearchTerm("");
    setProductSearchTerm("");
    setTraffickerSearchTerm("");
    setBillingOfficeSearchTerm("");
    setCountrySearchTerm("");
    setIndustrySearchTerm("");
    setSelectedAccounts([]);
    setSelectedAdvertisers([]);
    setSelectedPublishers([]);
  };

  // Obtener el componente de icono según el nombre
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "BarChart3":
        return <BarChart3 />;
      case "PieChart":
        return <PieChart />;
      case "LineChart":
        return <LineChart />;
      case "Layers":
        return <Layers />;
      case "BarChart2":
        return <BarChart2 />;
      case "Activity":
        return <Activity />;
      case "TrendingUp":
        return <TrendingUp />;
      case "FileBarChart":
        return <FileBarChart />;
      case "FileSpreadsheet":
        return <FileSpreadsheet />;
      case "Wallet":
        return <Wallet />;
      case "Users":
        return <Users />;
      case "Briefcase":
        return <Briefcase />;
      case "Building":
        return <Building />;
      case "Landmark":
        return <Landmark />;
      case "CircleDollarSign":
        return <CircleDollarSign />;
      default:
        return <BarChart3 />;
    }
  };

  // Mostrar carga mientras se verifica autenticación
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Componente para los botones de acción del reporte
  const ReportActions = () => (
    <div className="flex items-center gap-3">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowFilters(!showFilters)}
        className="flex items-center gap-1 bg-white border-gray-200 hover:bg-gray-50"
      >
        <SlidersHorizontal className="h-4 w-4 mr-1" />
        Filters
        <ChevronDown className="h-3 w-3 ml-1" />
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={handleSaveAsTemplate}
        className="flex items-center gap-1 bg-white border-orange-200 hover:bg-orange-50 text-orange-600 hover:text-orange-700"
      >
        <Save className="h-4 w-4 mr-1" />
        Save as Template
      </Button>

      <Button
        size="sm"
        className="flex items-center gap-1 bg-orange-600 hover:bg-orange-700 text-white"
        onClick={() => handleExportData("excel")}
      >
        <Download className="h-4 w-4 mr-1" />
        Export
      </Button>
    </div>
  );

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
            {/* Modal para guardar template */}
            {showSaveTemplateModal && (
              <div
                className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                onClick={handleCloseTemplateModal}
              >
                <div
                  className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h3 className="text-xl font-semibold text-gray-900">
                      Save as Template
                    </h3>
                    <button
                      onClick={handleCloseTemplateModal}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="p-6">
                    <div className="space-y-4">
                      {/* Nombre del template */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Template Name
                        </label>
                        <Input
                          type="text"
                          placeholder="Enter template name"
                          value={newTemplateName}
                          onChange={(e) => setNewTemplateName(e.target.value)}
                          className="w-full"
                        />
                      </div>

                      {/* Descripción del template */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <textarea
                          placeholder="Enter template description"
                          value={newTemplateDescription}
                          onChange={(e) =>
                            setNewTemplateDescription(e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm text-gray-900 bg-white"
                          rows={3}
                        />
                      </div>

                      {/* Selección de icono */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Icon
                        </label>
                        <div className="grid grid-cols-5 gap-2">
                          {[
                            "BarChart3",
                            "PieChart",
                            "LineChart",
                            "Layers",
                            "BarChart2",
                            "Activity",
                            "TrendingUp",
                            "FileBarChart",
                            "FileSpreadsheet",
                            "Wallet",
                            "Users",
                            "Briefcase",
                            "Building",
                            "Landmark",
                            "CircleDollarSign",
                          ].map((icon) => (
                            <div
                              key={icon}
                              onClick={() => setNewTemplateIcon(icon)}
                              className={`flex items-center justify-center p-2 rounded-md cursor-pointer ${
                                newTemplateIcon === icon
                                  ? "bg-orange-50 border-2 border-orange-500"
                                  : "border border-gray-200 hover:bg-gray-50"
                              }`}
                            >
                              <div className="text-gray-700">
                                {getIconComponent(icon)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Selección de color */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Color
                        </label>
                        <div className="grid grid-cols-5 gap-2">
                          {[
                            "orange",
                            "blue",
                            "green",
                            "purple",
                            "red",
                            "amber",
                            "indigo",
                            "pink",
                            "teal",
                            "cyan",
                          ].map((color) => (
                            <div
                              key={color}
                              onClick={() => setNewTemplateColor(color)}
                              className={`h-8 rounded-md cursor-pointer ${
                                color === "orange"
                                  ? "bg-orange-100"
                                  : color === "blue"
                                  ? "bg-blue-100"
                                  : color === "green"
                                  ? "bg-green-100"
                                  : color === "purple"
                                  ? "bg-purple-100"
                                  : color === "red"
                                  ? "bg-red-100"
                                  : color === "amber"
                                  ? "bg-amber-100"
                                  : color === "indigo"
                                  ? "bg-indigo-100"
                                  : color === "pink"
                                  ? "bg-pink-100"
                                  : color === "teal"
                                  ? "bg-teal-100"
                                  : "bg-cyan-100"
                              } border ${
                                newTemplateColor === color
                                  ? `border-2 ${
                                      color === "orange"
                                        ? "border-orange-500"
                                        : color === "blue"
                                        ? "border-blue-500"
                                        : color === "green"
                                        ? "border-green-500"
                                        : color === "purple"
                                        ? "border-purple-500"
                                        : color === "red"
                                        ? "border-red-500"
                                        : color === "amber"
                                        ? "border-amber-500"
                                        : color === "indigo"
                                        ? "border-indigo-500"
                                        : color === "pink"
                                        ? "border-pink-500"
                                        : color === "teal"
                                        ? "border-teal-500"
                                        : "border-cyan-500"
                                    }`
                                  : "border-gray-200"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                      <Button
                        variant="outline"
                        onClick={handleCloseTemplateModal}
                        className="border-gray-200"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSaveNewTemplate}
                        className="bg-orange-600 hover:bg-orange-700 text-white"
                      >
                        Save Template
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Vista principal - Solo mostrar si no hay módulo seleccionado y no estamos en preview */}
            {!selectedModule && !showPreview && (
              <>
                <div className="mb-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        Reports
                      </h1>
                      <p className="text-gray-600">
                        Generate and manage custom reports for all areas
                      </p>
                    </div>
                  </div>
                </div>

                <Tabs
                  defaultValue={activeTab}
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <TabsList className="mb-6">
                    <TabsTrigger value="templates">Templates</TabsTrigger>
                    <TabsTrigger value="custom">Custom</TabsTrigger>
                  </TabsList>

                  <TabsContent value="templates">
                    <ReportTemplates
                      templates={templates}
                      onPreview={handlePreviewTemplate}
                      onExport={handleExportTemplate}
                      onToggleFavorite={handleToggleFavorite}
                      onDelete={handleDeleteTemplate}
                    />
                  </TabsContent>

                  <TabsContent value="custom">
                    <Card className="border shadow-sm rounded-xl overflow-hidden">
                      <CardHeader className="bg-white pb-4">
                        <CardTitle className="text-xl font-semibold text-gray-900">
                          Create Custom Report
                        </CardTitle>
                        <CardDescription className="text-gray-600">
                          Select a module to start creating your custom report
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {/* Campaigns */}
                          <div
                            className="border border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center hover:border-orange-500 hover:bg-orange-50/30 hover:shadow-sm transition-all cursor-pointer"
                            onClick={() => handleModuleSelect("campaigns")}
                          >
                            <div className="bg-orange-100 p-3 rounded-full mb-3">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-8 w-8 text-orange-500"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                              </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">
                              Campaigns
                            </h3>
                          </div>

                          {/* Finance */}
                          <div
                            className="border border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center hover:border-orange-500 hover:bg-orange-50/30 hover:shadow-sm transition-all cursor-pointer"
                            onClick={() => handleModuleSelect("finance")}
                          >
                            <div className="bg-green-100 p-3 rounded-full mb-3">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-8 w-8 text-green-500"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">
                              Finance
                            </h3>
                          </div>

                          {/* AdOps */}
                          <div
                            className="border border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center hover:border-orange-500 hover:bg-orange-50/30 hover:shadow-sm transition-all cursor-pointer"
                            onClick={() => handleModuleSelect("adops")}
                          >
                            <div className="bg-blue-100 p-3 rounded-full mb-3">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-8 w-8 text-blue-500"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H9.229l-.946.371a1 1 0 00-.023.02l-.476.476-.224.224H5v-1h3.771zM5 14a1 1 0 100 2h10a1 1 0 100-2H5z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">
                              AdOps
                            </h3>
                          </div>

                          {/* HUR */}
                          <div
                            className="border border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center hover:border-orange-500 hover:bg-orange-50/30 hover:shadow-sm transition-all cursor-pointer"
                            onClick={() => handleModuleSelect("hur")}
                          >
                            <div className="bg-amber-100 p-3 rounded-full mb-3">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-8 w-8 text-amber-500"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">
                              HUR
                            </h3>
                          </div>

                          {/* Organizations */}
                          <div
                            className="border border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center hover:border-orange-500 hover:bg-orange-50/30 hover:shadow-sm transition-all cursor-pointer"
                            onClick={() => handleModuleSelect("organizations")}
                          >
                            <div className="bg-indigo-100 p-3 rounded-full mb-3">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-8 w-8 text-indigo-500"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 01-1 1h-2a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">
                              Organizations
                            </h3>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </>
            )}

            {/* Vista de módulo seleccionado */}
            {selectedModule && !showPreview && (
              <>
                <div className="mb-6">
                  <button
                    onClick={handleBackToModules}
                    className="text-orange-600 hover:text-orange-800 text-sm flex items-center mb-2"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Back to Modules
                  </button>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {selectedModule.charAt(0).toUpperCase() +
                      selectedModule.slice(1)}{" "}
                    Report
                  </h2>
                  <p className="text-gray-600">
                    Customize your {selectedModule} report with filters and save
                    it as a template
                  </p>
                </div>

                <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div className="relative flex-grow mr-4">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        type="text"
                        placeholder="Search in results..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center gap-1 ${
                          showFilters
                            ? "bg-orange-50 text-orange-700 border-orange-200"
                            : "bg-white border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        <SlidersHorizontal className="h-4 w-4 mr-1" />
                        Filters
                        <ChevronDown className="h-3 w-3 ml-1" />
                      </Button>

                      {showFilters && hasActiveFilters() && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleClearFilters}
                          className="flex items-center gap-1 bg-white border-gray-200 hover:bg-gray-50"
                        >
                          Clear Filters
                        </Button>
                      )}

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSaveAsTemplate}
                        className="flex items-center gap-1 bg-white border-orange-200 hover:bg-orange-50 text-orange-600 hover:text-orange-700"
                      >
                        <Save className="h-4 w-4 mr-1" />
                        Save as Template
                      </Button>

                      <Button
                        size="sm"
                        className="flex items-center gap-1 bg-orange-600 hover:bg-orange-700 text-white"
                        onClick={() => handleExportData("excel")}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Export
                      </Button>
                    </div>
                  </div>

                  {/* Filtros expandibles */}
                  {showFilters && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {selectedModule === "campaigns" && (
                          <>
                            <div>
                              <label className="text-sm font-medium text-gray-700 block mb-1">
                                Status
                              </label>
                              <div className="grid grid-cols-2 gap-2">
                                {[
                                  "Pending",
                                  "Negotiating",
                                  "Won",
                                  "Approved",
                                  "Materials & Creatives OK",
                                  "Implementation",
                                  "Live",
                                  "Closed",
                                  "HUR",
                                  "Invoiced",
                                ].map((status) => (
                                  <div
                                    key={status}
                                    className={`cursor-pointer rounded-md px-3 py-1.5 text-sm border ${
                                      selectedStatuses.includes(status)
                                        ? getStatusColor(status)
                                        : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                                    }`}
                                    onClick={() => toggleStatus(status)}
                                  >
                                    {status}
                                    {selectedStatuses.includes(status) && (
                                      <span className="ml-1.5 inline-block">
                                        ✓
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700 block mb-1">
                                Service
                              </label>
                              <div className="grid grid-cols-1 gap-2">
                                {[
                                  "Representación Comercial",
                                  "Servicio de Medios (IMB)",
                                  "Prefered Ad Services (PAS)",
                                  "Clearing House",
                                  "Mobile Performance",
                                ].map((service) => (
                                  <div
                                    key={service}
                                    className={`cursor-pointer rounded-md px-3 py-1.5 text-sm border ${
                                      selectedService === service
                                        ? "bg-orange-50 text-orange-700 border-orange-200"
                                        : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                                    }`}
                                    onClick={() =>
                                      setSelectedService(
                                        selectedService === service
                                          ? ""
                                          : service
                                      )
                                    }
                                  >
                                    {service}
                                    {selectedService === service && (
                                      <span className="ml-1.5 inline-block">
                                        ✓
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700 block mb-1">
                                Organization
                              </label>
                              <div className="relative" ref={orgDropdownRef}>
                                <input
                                  type="text"
                                  className="w-full h-9 rounded-md border border-gray-200 bg-white px-3 py-1 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                                  placeholder="Search organization..."
                                  value={orgSearchTerm}
                                  onChange={(e) =>
                                    setOrgSearchTerm(e.target.value)
                                  }
                                  onFocus={() => setShowOrgDropdown(true)}
                                />
                                {selectedOrganizations.length > 0 && (
                                  <button
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    onClick={() => {
                                      setSelectedOrganizations([]);
                                      setOrgSearchTerm("");
                                    }}
                                  >
                                    ×
                                  </button>
                                )}
                                {showOrgDropdown && (
                                  <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-auto">
                                    {filteredOrganizations.length > 0 ? (
                                      filteredOrganizations.map((org) => (
                                        <div
                                          key={org}
                                          className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 ${
                                            selectedOrganizations.includes(org)
                                              ? "bg-orange-50 text-orange-700"
                                              : ""
                                          }`}
                                          onClick={() => {
                                            toggleOrganization(org);
                                            setOrgSearchTerm("");
                                          }}
                                        >
                                          {org}
                                          {selectedOrganizations.includes(
                                            org
                                          ) && (
                                            <span className="ml-1.5 float-right">
                                              ✓
                                            </span>
                                          )}
                                        </div>
                                      ))
                                    ) : (
                                      <div className="px-3 py-2 text-sm text-gray-500">
                                        No organizations found
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                              {selectedOrganizations.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {selectedOrganizations.map((org) => (
                                    <div
                                      key={org}
                                      className="bg-orange-50 text-orange-700 border border-orange-100 rounded-md px-2 py-1 text-xs flex items-center"
                                    >
                                      {org}
                                      <button
                                        className="ml-1.5 text-orange-500 hover:text-orange-700"
                                        onClick={() => toggleOrganization(org)}
                                      >
                                        ×
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700 block mb-1">
                                Salesperson
                              </label>
                              <div className="relative" ref={ownerDropdownRef}>
                                <input
                                  type="text"
                                  className="w-full h-9 rounded-md border border-gray-200 bg-white px-3 py-1 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                                  placeholder="Search salesperson..."
                                  value={ownerSearchTerm}
                                  onChange={(e) =>
                                    setOwnerSearchTerm(e.target.value)
                                  }
                                  onFocus={() => setShowOwnerDropdown(true)}
                                />
                                {selectedOwners.length > 0 && (
                                  <button
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    onClick={() => {
                                      setSelectedOwners([]);
                                      setOwnerSearchTerm("");
                                    }}
                                  >
                                    ×
                                  </button>
                                )}
                                {showOwnerDropdown && (
                                  <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-auto">
                                    {filteredOwners.length > 0 ? (
                                      filteredOwners.map((owner) => (
                                        <div
                                          key={owner}
                                          className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 ${
                                            selectedOwners.includes(owner)
                                              ? "bg-orange-50 text-orange-700"
                                              : ""
                                          }`}
                                          onClick={() => {
                                            toggleOwner(owner);
                                            setOwnerSearchTerm("");
                                          }}
                                        >
                                          {owner}
                                          {selectedOwners.includes(owner) && (
                                            <span className="ml-1.5 float-right">
                                              ✓
                                            </span>
                                          )}
                                        </div>
                                      ))
                                    ) : (
                                      <div className="px-3 py-2 text-sm text-gray-500">
                                        No salespersons found
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                              {selectedOwners.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {selectedOwners.map((owner) => (
                                    <div
                                      key={owner}
                                      className="bg-orange-50 text-orange-700 border border-orange-100 rounded-md px-2 py-1 text-xs flex items-center"
                                    >
                                      {owner}
                                      <button
                                        className="ml-1.5 text-orange-500 hover:text-orange-700"
                                        onClick={() => toggleOwner(owner)}
                                      >
                                        ×
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                            {/* Date Range filter (moved) */}
                            <div>
                              <label className="text-sm font-medium text-gray-700 block mb-1">
                                Date Range
                              </label>
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <input
                                    type="date"
                                    className="block w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm text-gray-900 bg-white"
                                    placeholder="Start date"
                                    value={startDate}
                                    onChange={(e) =>
                                      setStartDate(e.target.value)
                                    }
                                  />
                                </div>
                                <div>
                                  <input
                                    type="date"
                                    className="block w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm text-gray-900 bg-white"
                                    placeholder="End date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                  />
                                </div>
                              </div>
                            </div>
                            {/* Trafficker filter */}
                            <div>
                              <label className="text-sm font-medium text-gray-700 block mb-1">
                                Trafficker
                              </label>
                              <div
                                className="relative"
                                ref={traffickerDropdownRef}
                              >
                                <input
                                  type="text"
                                  className="w-full h-9 rounded-md border border-gray-200 bg-white px-3 py-1 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                                  placeholder="Search trafficker..."
                                  value={traffickerSearchTerm}
                                  onChange={(e) =>
                                    setTraffickerSearchTerm(e.target.value)
                                  }
                                  onFocus={() =>
                                    setShowTraffickerDropdown(true)
                                  }
                                />
                                {selectedTraffickers.length > 0 && (
                                  <button
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    onClick={() => {
                                      setSelectedTraffickers([]);
                                      setTraffickerSearchTerm("");
                                    }}
                                  >
                                    ×
                                  </button>
                                )}
                                {showTraffickerDropdown && (
                                  <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-auto">
                                    {filteredTraffickers.length > 0 ? (
                                      filteredTraffickers.map((t) => (
                                        <div
                                          key={t}
                                          className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 ${
                                            selectedTraffickers.includes(t)
                                              ? "bg-orange-50 text-orange-700"
                                              : ""
                                          }`}
                                          onClick={() => {
                                            toggleTrafficker(t);
                                            setTraffickerSearchTerm("");
                                          }}
                                        >
                                          {t}
                                          {selectedTraffickers.includes(t) && (
                                            <span className="ml-1.5 float-right">
                                              ✓
                                            </span>
                                          )}
                                        </div>
                                      ))
                                    ) : (
                                      <div className="px-3 py-2 text-sm text-gray-500">
                                        No traffickers found
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                              {selectedTraffickers.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {selectedTraffickers.map((t) => (
                                    <div
                                      key={t}
                                      className={`rounded-md px-2 py-1 text-xs flex items-center ${getTraffickerColor(
                                        t
                                      )}`}
                                    >
                                      {t}
                                      <button
                                        className="ml-1.5 text-gray-500 hover:text-gray-700"
                                        onClick={() => toggleTrafficker(t)}
                                      >
                                        ×
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </>
                        )}
                        {selectedModule === "hur" && (
                          <>
                            <div>
                              <label className="text-sm font-medium text-gray-700 block mb-1">
                                Status
                              </label>
                              <div className="grid grid-cols-2 gap-2">
                                {hurStatuses.map((status) => (
                                  <div
                                    key={status}
                                    className={`cursor-pointer rounded-md px-3 py-1.5 text-sm border ${
                                      selectedHURStatuses.includes(status)
                                        ? getHURStatusColor(status)
                                        : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                                    }`}
                                    onClick={() => toggleHURStatus(status)}
                                  >
                                    {status}
                                    {selectedHURStatuses.includes(status) && (
                                      <span className="ml-1.5 inline-block">
                                        ✓
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700 block mb-1">
                                Media Type
                              </label>
                              <div className="grid grid-cols-2 gap-2">
                                {mediaTypes.map((mediaType) => (
                                  <div
                                    key={mediaType}
                                    className={`cursor-pointer rounded-md px-3 py-1.5 text-sm border ${
                                      selectedMediaTypes.includes(mediaType)
                                        ? getMediaTypeColor(mediaType)
                                        : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                                    }`}
                                    onClick={() => toggleMediaType(mediaType)}
                                  >
                                    {mediaType}
                                    {selectedMediaTypes.includes(mediaType) && (
                                      <span className="ml-1.5 inline-block">
                                        ✓
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700 block mb-1">
                                Billing Office
                              </label>
                              <div
                                className="relative"
                                ref={billingOfficeDropdownRef}
                              >
                                <input
                                  type="text"
                                  className="w-full h-9 rounded-md border border-gray-200 bg-white px-3 py-1 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                                  placeholder="Search billing office..."
                                  value={billingOfficeSearchTerm}
                                  onChange={(e) =>
                                    setBillingOfficeSearchTerm(e.target.value)
                                  }
                                  onFocus={() =>
                                    setShowBillingOfficeDropdown(true)
                                  }
                                />
                                {selectedBillingOffices.length > 0 && (
                                  <button
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    onClick={() => {
                                      setSelectedBillingOffices([]);
                                      setBillingOfficeSearchTerm("");
                                    }}
                                  >
                                    ×
                                  </button>
                                )}
                                {showBillingOfficeDropdown && (
                                  <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-auto">
                                    {filteredBillingOffices.length > 0 ? (
                                      filteredBillingOffices.map((office) => (
                                        <div
                                          key={office}
                                          className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 ${
                                            selectedBillingOffices.includes(
                                              office
                                            )
                                              ? "bg-orange-50 text-orange-700"
                                              : ""
                                          }`}
                                          onClick={() => {
                                            toggleBillingOffice(office);
                                            setBillingOfficeSearchTerm("");
                                          }}
                                        >
                                          {office}
                                          {selectedBillingOffices.includes(
                                            office
                                          ) && (
                                            <span className="ml-1.5 float-right">
                                              ✓
                                            </span>
                                          )}
                                        </div>
                                      ))
                                    ) : (
                                      <div className="px-3 py-2 text-sm text-gray-500">
                                        No billing offices found
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                              {selectedBillingOffices.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {selectedBillingOffices.map((office) => (
                                    <div
                                      key={office}
                                      className={`rounded-md px-2 py-1 text-xs flex items-center ${getBillingOfficeColor(
                                        office
                                      )}`}
                                    >
                                      {office}
                                      <button
                                        className="ml-1.5 text-gray-500 hover:text-gray-700"
                                        onClick={() =>
                                          toggleBillingOffice(office)
                                        }
                                      >
                                        ×
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </>
                        )}
                        {selectedModule === "finance" && (
                          <>
                            <div>
                              <label className="text-sm font-medium text-gray-700 block mb-1">
                                Account
                              </label>
                              <div
                                className="relative"
                                ref={accountDropdownRef}
                              >
                                <input
                                  type="text"
                                  className="w-full h-9 rounded-md border border-gray-200 bg-white px-3 py-1 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                                  placeholder="Search account..."
                                  value={accountSearchTerm}
                                  onChange={(e) =>
                                    setAccountSearchTerm(e.target.value)
                                  }
                                  onFocus={() => setShowAccountDropdown(true)}
                                />
                                {selectedAccounts.length > 0 && (
                                  <button
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    onClick={() => {
                                      setSelectedAccounts([]);
                                      setAccountSearchTerm("");
                                    }}
                                  >
                                    ×
                                  </button>
                                )}
                                {showAccountDropdown && (
                                  <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-auto">
                                    {filteredAccounts.length > 0 ? (
                                      filteredAccounts.map((account) => (
                                        <div
                                          key={account}
                                          className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 ${
                                            selectedAccounts.includes(account)
                                              ? "bg-orange-50 text-orange-700"
                                              : ""
                                          }`}
                                          onClick={() => {
                                            toggleAccount(account);
                                            setAccountSearchTerm("");
                                          }}
                                        >
                                          {account}
                                          {selectedAccounts.includes(
                                            account
                                          ) && (
                                            <span className="ml-1.5 float-right">
                                              ✓
                                            </span>
                                          )}
                                        </div>
                                      ))
                                    ) : (
                                      <div className="px-3 py-2 text-sm text-gray-500">
                                        No accounts found
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                              {selectedAccounts.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {selectedAccounts.map((account) => (
                                    <div
                                      key={account}
                                      className="bg-orange-50 text-orange-700 border border-orange-100 rounded-md px-2 py-1 text-xs flex items-center"
                                    >
                                      {account}
                                      <button
                                        className="ml-1.5 text-orange-500 hover:text-orange-700"
                                        onClick={() => toggleAccount(account)}
                                      >
                                        ×
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700 block mb-1">
                                Advertiser
                              </label>
                              <div
                                className="relative"
                                ref={advertiserDropdownRef}
                              >
                                <input
                                  type="text"
                                  className="w-full h-9 rounded-md border border-gray-200 bg-white px-3 py-1 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                                  placeholder="Search advertiser..."
                                  value={advertiserSearchTerm}
                                  onChange={(e) =>
                                    setAdvertiserSearchTerm(e.target.value)
                                  }
                                  onFocus={() =>
                                    setShowAdvertiserDropdown(true)
                                  }
                                />
                                {selectedAdvertisers.length > 0 && (
                                  <button
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    onClick={() => {
                                      setSelectedAdvertisers([]);
                                      setAdvertiserSearchTerm("");
                                    }}
                                  >
                                    ×
                                  </button>
                                )}
                                {showAdvertiserDropdown && (
                                  <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-auto">
                                    {filteredAdvertisers.length > 0 ? (
                                      filteredAdvertisers.map((advertiser) => (
                                        <div
                                          key={advertiser}
                                          className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 ${
                                            selectedAdvertisers.includes(
                                              advertiser
                                            )
                                              ? "bg-orange-50 text-orange-700"
                                              : ""
                                          }`}
                                          onClick={() => {
                                            toggleAdvertiser(advertiser);
                                            setAdvertiserSearchTerm("");
                                          }}
                                        >
                                          {advertiser}
                                          {selectedAdvertisers.includes(
                                            advertiser
                                          ) && (
                                            <span className="ml-1.5 float-right">
                                              ✓
                                            </span>
                                          )}
                                        </div>
                                      ))
                                    ) : (
                                      <div className="px-3 py-2 text-sm text-gray-500">
                                        No advertisers found
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                              {selectedAdvertisers.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {selectedAdvertisers.map((advertiser) => (
                                    <div
                                      key={advertiser}
                                      className="bg-orange-50 text-orange-700 border border-orange-100 rounded-md px-2 py-1 text-xs flex items-center"
                                    >
                                      {advertiser}
                                      <button
                                        className="ml-1.5 text-orange-500 hover:text-orange-700"
                                        onClick={() =>
                                          toggleAdvertiser(advertiser)
                                        }
                                      >
                                        ×
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700 block mb-1">
                                Publisher
                              </label>
                              <div
                                className="relative"
                                ref={publisherDropdownRef}
                              >
                                <input
                                  type="text"
                                  className="w-full h-9 rounded-md border border-gray-200 bg-white px-3 py-1 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                                  placeholder="Search publisher..."
                                  value={publisherSearchTerm}
                                  onChange={(e) =>
                                    setPublisherSearchTerm(e.target.value)
                                  }
                                  onFocus={() => setShowPublisherDropdown(true)}
                                />
                                {selectedPublishers.length > 0 && (
                                  <button
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    onClick={() => {
                                      setSelectedPublishers([]);
                                      setPublisherSearchTerm("");
                                    }}
                                  >
                                    ×
                                  </button>
                                )}
                                {showPublisherDropdown && (
                                  <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-auto">
                                    {filteredPublishers.length > 0 ? (
                                      filteredPublishers.map((publisher) => (
                                        <div
                                          key={publisher}
                                          className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 ${
                                            selectedPublishers.includes(
                                              publisher
                                            )
                                              ? "bg-orange-50 text-orange-700"
                                              : ""
                                          }`}
                                          onClick={() => {
                                            togglePublisher(publisher);
                                            setPublisherSearchTerm("");
                                          }}
                                        >
                                          {publisher}
                                          {selectedPublishers.includes(
                                            publisher
                                          ) && (
                                            <span className="ml-1.5 float-right">
                                              ✓
                                            </span>
                                          )}
                                        </div>
                                      ))
                                    ) : (
                                      <div className="px-3 py-2 text-sm text-gray-500">
                                        No publishers found
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                              {selectedPublishers.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {selectedPublishers.map((publisher) => (
                                    <div
                                      key={publisher}
                                      className="bg-orange-50 text-orange-700 border border-orange-100 rounded-md px-2 py-1 text-xs flex items-center"
                                    >
                                      {publisher}
                                      <button
                                        className="ml-1.5 text-orange-500 hover:text-orange-700"
                                        onClick={() =>
                                          togglePublisher(publisher)
                                        }
                                      >
                                        ×
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700 block mb-1">
                                Division
                              </label>
                              <div className="grid grid-cols-2 gap-2">
                                {divisions.map((division) => (
                                  <div
                                    key={division}
                                    className={`cursor-pointer rounded-md px-3 py-1.5 text-sm border ${
                                      selectedDivisions.includes(division)
                                        ? getDivisionColor(division)
                                        : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                                    }`}
                                    onClick={() => toggleDivision(division)}
                                  >
                                    {division}
                                    {selectedDivisions.includes(division) && (
                                      <span className="ml-1.5 inline-block">
                                        ✓
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700 block mb-1">
                                Service Type
                              </label>
                              <div className="grid grid-cols-1 gap-2">
                                {serviceTypes.map((serviceType) => (
                                  <div
                                    key={serviceType}
                                    className={`cursor-pointer rounded-md px-3 py-1.5 text-sm border ${
                                      selectedServiceTypes.includes(serviceType)
                                        ? getServiceTypeColor(serviceType)
                                        : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                                    }`}
                                    onClick={() =>
                                      toggleServiceType(serviceType)
                                    }
                                  >
                                    {serviceType}
                                    {selectedServiceTypes.includes(
                                      serviceType
                                    ) && (
                                      <span className="ml-1.5 inline-block">
                                        ✓
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700 block mb-1">
                                Purchase Type
                              </label>
                              <div className="grid grid-cols-2 gap-2">
                                {purchaseTypes.map((purchaseType) => (
                                  <div
                                    key={purchaseType}
                                    className={`cursor-pointer rounded-md px-3 py-1.5 text-sm border ${
                                      selectedPurchaseTypes.includes(
                                        purchaseType
                                      )
                                        ? getPurchaseTypeColor(purchaseType)
                                        : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                                    }`}
                                    onClick={() =>
                                      togglePurchaseType(purchaseType)
                                    }
                                  >
                                    {purchaseType}
                                    {selectedPurchaseTypes.includes(
                                      purchaseType
                                    ) && (
                                      <span className="ml-1.5 inline-block">
                                        ✓
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </>
                        )}
                        {selectedModule === "organizations" && (
                          <>
                            <div>
                              <label className="text-sm font-medium text-gray-700 block mb-1">
                                Organization Type
                              </label>
                              <div className="grid grid-cols-2 gap-2">
                                {orgTypes.map((orgType) => (
                                  <div
                                    key={orgType}
                                    className={`cursor-pointer rounded-md px-3 py-1.5 text-sm border ${
                                      selectedOrgTypes.includes(orgType)
                                        ? getOrgTypeColor(orgType)
                                        : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                                    }`}
                                    onClick={() => toggleOrgType(orgType)}
                                  >
                                    {orgType}
                                    {selectedOrgTypes.includes(orgType) && (
                                      <span className="ml-1.5 inline-block">
                                        ✓
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700 block mb-1">
                                Country
                              </label>
                              <div
                                className="relative"
                                ref={countryDropdownRef}
                              >
                                <input
                                  type="text"
                                  className="w-full h-9 rounded-md border border-gray-200 bg-white px-3 py-1 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                                  placeholder="Search country..."
                                  value={countrySearchTerm}
                                  onChange={(e) =>
                                    setCountrySearchTerm(e.target.value)
                                  }
                                  onFocus={() => setShowCountryDropdown(true)}
                                />
                                {selectedCountries.length > 0 && (
                                  <button
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    onClick={() => {
                                      setSelectedCountries([]);
                                      setCountrySearchTerm("");
                                    }}
                                  >
                                    ×
                                  </button>
                                )}
                                {showCountryDropdown && (
                                  <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-auto">
                                    {filteredCountries.length > 0 ? (
                                      filteredCountries.map((country) => (
                                        <div
                                          key={country}
                                          className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 ${
                                            selectedCountries.includes(country)
                                              ? "bg-orange-50 text-orange-700"
                                              : ""
                                          }`}
                                          onClick={() => {
                                            toggleCountry(country);
                                            setCountrySearchTerm("");
                                          }}
                                        >
                                          {country}
                                          {selectedCountries.includes(
                                            country
                                          ) && (
                                            <span className="ml-1.5 float-right">
                                              ✓
                                            </span>
                                          )}
                                        </div>
                                      ))
                                    ) : (
                                      <div className="px-3 py-2 text-sm text-gray-500">
                                        No countries found
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                              {selectedCountries.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {selectedCountries.map((country) => (
                                    <div
                                      key={country}
                                      className="bg-orange-50 text-orange-700 border border-orange-100 rounded-md px-2 py-1 text-xs flex items-center"
                                    >
                                      {country}
                                      <button
                                        className="ml-1.5 text-orange-500 hover:text-orange-700"
                                        onClick={() => toggleCountry(country)}
                                      >
                                        ×
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700 block mb-1">
                                Industry
                              </label>
                              <div
                                className="relative"
                                ref={industryDropdownRef}
                              >
                                <input
                                  type="text"
                                  className="w-full h-9 rounded-md border border-gray-200 bg-white px-3 py-1 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                                  placeholder="Search industry..."
                                  value={industrySearchTerm}
                                  onChange={(e) =>
                                    setIndustrySearchTerm(e.target.value)
                                  }
                                  onFocus={() => setShowIndustryDropdown(true)}
                                />
                                {selectedIndustries.length > 0 && (
                                  <button
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    onClick={() => {
                                      setSelectedIndustries([]);
                                      setIndustrySearchTerm("");
                                    }}
                                  >
                                    ×
                                  </button>
                                )}
                                {showIndustryDropdown && (
                                  <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-auto">
                                    {filteredIndustries.length > 0 ? (
                                      filteredIndustries.map((industry) => (
                                        <div
                                          key={industry}
                                          className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 ${
                                            selectedIndustries.includes(
                                              industry
                                            )
                                              ? "bg-orange-50 text-orange-700"
                                              : ""
                                          }`}
                                          onClick={() => {
                                            toggleIndustry(industry);
                                            setIndustrySearchTerm("");
                                          }}
                                        >
                                          {industry}
                                          {selectedIndustries.includes(
                                            industry
                                          ) && (
                                            <span className="ml-1.5 float-right">
                                              ✓
                                            </span>
                                          )}
                                        </div>
                                      ))
                                    ) : (
                                      <div className="px-3 py-2 text-sm text-gray-500">
                                        No industries found
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                              {selectedIndustries.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {selectedIndustries.map((industry) => (
                                    <div
                                      key={industry}
                                      className={`rounded-md px-2 py-1 text-xs flex items-center ${getIndustryColor(
                                        industry
                                      )}`}
                                    >
                                      {industry}
                                      <button
                                        className="ml-1.5 text-gray-500 hover:text-gray-700"
                                        onClick={() => toggleIndustry(industry)}
                                      >
                                        ×
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700 block mb-1">
                                Contact Type
                              </label>
                              <div className="grid grid-cols-2 gap-2">
                                {contactTypes.map((contactType) => (
                                  <div
                                    key={contactType}
                                    className={`cursor-pointer rounded-md px-3 py-1.5 text-sm border ${
                                      selectedContactTypes.includes(contactType)
                                        ? getContactTypeColor(contactType)
                                        : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                                    }`}
                                    onClick={() =>
                                      toggleContactType(contactType)
                                    }
                                  >
                                    {contactType}
                                    {selectedContactTypes.includes(
                                      contactType
                                    ) && (
                                      <span className="ml-1.5 inline-block">
                                        ✓
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </>
                        )}
                        {selectedModule === "adops" && (
                          <>
                            <div>
                              <label className="text-sm font-medium text-gray-700 block mb-1">
                                Status
                              </label>
                              <div className="grid grid-cols-2 gap-2">
                                {adOpsStatuses.map((status) => (
                                  <div
                                    key={status}
                                    className={`cursor-pointer rounded-md px-3 py-1.5 text-sm border ${
                                      selectedAdOpsStatuses.includes(status)
                                        ? getAdOpsStatusColor(status)
                                        : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                                    }`}
                                    onClick={() => toggleAdOpsStatus(status)}
                                  >
                                    {status}
                                    {selectedAdOpsStatuses.includes(status) && (
                                      <span className="ml-1.5 inline-block">
                                        ✓
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700 block mb-1">
                                Campaign Type
                              </label>
                              <div className="grid grid-cols-3 gap-2">
                                {campaignTypes.map((campaignType) => (
                                  <div
                                    key={campaignType}
                                    className={`cursor-pointer rounded-md px-3 py-1.5 text-sm border ${
                                      selectedCampaignTypes.includes(
                                        campaignType
                                      )
                                        ? getCampaignTypeColor(campaignType)
                                        : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                                    }`}
                                    onClick={() =>
                                      toggleCampaignType(campaignType)
                                    }
                                  >
                                    {campaignType}
                                    {selectedCampaignTypes.includes(
                                      campaignType
                                    ) && (
                                      <span className="ml-1.5 inline-block">
                                        ✓
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700 block mb-1">
                                Product Type
                              </label>
                              <div
                                className="relative"
                                ref={productTypeDropdownRef}
                              >
                                <input
                                  type="text"
                                  className="w-full h-9 rounded-md border border-gray-200 bg-white px-3 py-1 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                                  placeholder="Search product type..."
                                  value={productTypeSearchTerm}
                                  onChange={(e) =>
                                    setProductTypeSearchTerm(e.target.value)
                                  }
                                  onFocus={() =>
                                    setShowProductTypeDropdown(true)
                                  }
                                />
                                {selectedProductTypes.length > 0 && (
                                  <button
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    onClick={() => {
                                      setSelectedProductTypes([]);
                                      setProductTypeSearchTerm("");
                                    }}
                                  >
                                    ×
                                  </button>
                                )}
                                {showProductTypeDropdown && (
                                  <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-auto">
                                    {filteredProductTypes.length > 0 ? (
                                      filteredProductTypes.map(
                                        (productType) => (
                                          <div
                                            key={productType}
                                            className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 ${
                                              selectedProductTypes.includes(
                                                productType
                                              )
                                                ? "bg-orange-50 text-orange-700"
                                                : ""
                                            }`}
                                            onClick={() => {
                                              toggleProductType(productType);
                                              setProductTypeSearchTerm("");
                                            }}
                                          >
                                            {productType}
                                            {selectedProductTypes.includes(
                                              productType
                                            ) && (
                                              <span className="ml-1.5 float-right">
                                                ✓
                                              </span>
                                            )}
                                          </div>
                                        )
                                      )
                                    ) : (
                                      <div className="px-3 py-2 text-sm text-gray-500">
                                        No product types found
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                              {selectedProductTypes.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {selectedProductTypes.map((productType) => (
                                    <div
                                      key={productType}
                                      className={`rounded-md px-2 py-1 text-xs flex items-center ${getProductTypeColor(
                                        productType
                                      )}`}
                                    >
                                      {productType}
                                      <button
                                        className="ml-1.5 text-gray-500 hover:text-gray-700"
                                        onClick={() =>
                                          toggleProductType(productType)
                                        }
                                      >
                                        ×
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700 block mb-1">
                                Product
                              </label>
                              <div
                                className="relative"
                                ref={productDropdownRef}
                              >
                                <input
                                  type="text"
                                  className="w-full h-9 rounded-md border border-gray-200 bg-white px-3 py-1 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                                  placeholder="Search product..."
                                  value={productSearchTerm}
                                  onChange={(e) =>
                                    setProductSearchTerm(e.target.value)
                                  }
                                  onFocus={() => setShowProductDropdown(true)}
                                />
                                {selectedProducts.length > 0 && (
                                  <button
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    onClick={() => {
                                      setSelectedProducts([]);
                                      setProductSearchTerm("");
                                    }}
                                  >
                                    ×
                                  </button>
                                )}
                                {showProductDropdown && (
                                  <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-auto">
                                    {filteredProducts.length > 0 ? (
                                      filteredProducts.map((product) => (
                                        <div
                                          key={product}
                                          className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 ${
                                            selectedProducts.includes(product)
                                              ? "bg-orange-50 text-orange-700"
                                              : ""
                                          }`}
                                          onClick={() => {
                                            toggleProduct(product);
                                            setProductSearchTerm("");
                                          }}
                                        >
                                          {product}
                                          {selectedProducts.includes(
                                            product
                                          ) && (
                                            <span className="ml-1.5 float-right">
                                              ✓
                                            </span>
                                          )}
                                        </div>
                                      ))
                                    ) : (
                                      <div className="px-3 py-2 text-sm text-gray-500">
                                        No products found
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                              {selectedProducts.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {selectedProducts.map((product) => (
                                    <div
                                      key={product}
                                      className={`rounded-md px-2 py-1 text-xs flex items-center ${getProductColor(
                                        product
                                      )}`}
                                    >
                                      {product}
                                      <button
                                        className="ml-1.5 text-gray-500 hover:text-gray-700"
                                        onClick={() => toggleProduct(product)}
                                      >
                                        ×
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700 block mb-1">
                                Trafficker
                              </label>
                              <div
                                className="relative"
                                ref={traffickerDropdownRef}
                              >
                                <input
                                  type="text"
                                  className="w-full h-9 rounded-md border border-gray-200 bg-white px-3 py-1 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                                  placeholder="Search trafficker..."
                                  value={traffickerSearchTerm}
                                  onChange={(e) =>
                                    setTraffickerSearchTerm(e.target.value)
                                  }
                                  onFocus={() =>
                                    setShowTraffickerDropdown(true)
                                  }
                                />
                                {selectedTraffickers.length > 0 && (
                                  <button
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    onClick={() => {
                                      setSelectedTraffickers([]);
                                      setTraffickerSearchTerm("");
                                    }}
                                  >
                                    ×
                                  </button>
                                )}
                                {showTraffickerDropdown && (
                                  <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-auto">
                                    {filteredTraffickers.length > 0 ? (
                                      filteredTraffickers.map((trafficker) => (
                                        <div
                                          key={trafficker}
                                          className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 ${
                                            selectedTraffickers.includes(
                                              trafficker
                                            )
                                              ? "bg-orange-50 text-orange-700"
                                              : ""
                                          }`}
                                          onClick={() => {
                                            toggleTrafficker(trafficker);
                                            setTraffickerSearchTerm("");
                                          }}
                                        >
                                          {trafficker}
                                          {selectedTraffickers.includes(
                                            trafficker
                                          ) && (
                                            <span className="ml-1.5 float-right">
                                              ✓
                                            </span>
                                          )}
                                        </div>
                                      ))
                                    ) : (
                                      <div className="px-3 py-2 text-sm text-gray-500">
                                        No traffickers found
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                              {selectedTraffickers.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {selectedTraffickers.map((trafficker) => (
                                    <div
                                      key={trafficker}
                                      className={`rounded-md px-2 py-1 text-xs flex items-center ${getTraffickerColor(
                                        trafficker
                                      )}`}
                                    >
                                      {trafficker}
                                      <button
                                        className="ml-1.5 text-gray-500 hover:text-gray-700"
                                        onClick={() =>
                                          toggleTrafficker(trafficker)
                                        }
                                      >
                                        ×
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700 block mb-1">
                                Purchase Type
                              </label>
                              <div className="grid grid-cols-3 gap-2">
                                {adOpsPurchaseTypes.map((purchaseType) => (
                                  <div
                                    key={purchaseType}
                                    className={`cursor-pointer rounded-md px-3 py-1.5 text-sm border ${
                                      selectedAdOpsPurchaseTypes.includes(
                                        purchaseType
                                      )
                                        ? getAdOpsPurchaseTypeColor(
                                            purchaseType
                                          )
                                        : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                                    }`}
                                    onClick={() =>
                                      toggleAdOpsPurchaseType(purchaseType)
                                    }
                                  >
                                    {purchaseType}
                                    {selectedAdOpsPurchaseTypes.includes(
                                      purchaseType
                                    ) && (
                                      <span className="ml-1.5 inline-block">
                                        ✓
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </>
                        )}
                        {selectedModule !== "campaigns" &&
                          selectedModule !== "hur" &&
                          selectedModule !== "finance" &&
                          selectedModule !== "organizations" &&
                          selectedModule !== "adops" && (
                            <div className="col-span-2 text-center py-6 text-gray-500">
                              Select a module to see available filters
                            </div>
                          )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-x-auto">
                  <Table className="min-w-[1600px]">
                    <TableHeader>
                      <TableRow>
                        {reportColumns.map((column) => (
                          <TableHead key={column.id}>{column.name}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reportData.length > 0 ? (
                        reportData.map((row, rowIndex) => (
                          <TableRow key={rowIndex}>
                            {reportColumns.map((column) => {
                              const value = row[column.key];
                              const isNumeric = typeof value === "number";
                              // Campaign name styling and status badge/icon like /campaigns
                              if (column.key === "name") {
                                return (
                                  <TableCell key={column.id}>
                                    <span
                                      title={String(value ?? "")}
                                      className="text-sm font-medium text-orange-600 hover:text-orange-800 hover:underline"
                                    >
                                      {String(value ?? "-")}
                                    </span>
                                  </TableCell>
                                );
                              }
                              if (column.key === "status") {
                                return (
                                  <TableCell key={column.id}>
                                    <StatusBadge
                                      status={
                                        String(value ?? "-") as StatusType
                                      }
                                    />
                                  </TableCell>
                                );
                              }
                              const display = isNumeric
                                ? new Intl.NumberFormat("en-US", {
                                    style: "currency",
                                    currency: "USD",
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  }).format(value as number)
                                : String(value ?? "-");
                              return (
                                <TableCell key={column.id}>{display}</TableCell>
                              );
                            })}
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={reportColumns.length}
                            className="h-24 text-center text-gray-500"
                          >
                            No results found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                    {reportData.length > 0 &&
                      selectedModule === "campaigns" && (
                        <TableFooter>
                          <TableRow>
                            {reportColumns.map((column, idx) => {
                              if (idx === 0) {
                                return (
                                  <TableCell
                                    key={column.id}
                                    className="font-semibold"
                                  >
                                    Total
                                  </TableCell>
                                );
                              }

                              const firstVal = reportData.find(
                                (r) =>
                                  r[column.key] !== null &&
                                  r[column.key] !== undefined
                              )?.[column.key];
                              const isNumericCol = typeof firstVal === "number";
                              if (!isNumericCol) {
                                return <TableCell key={column.id}></TableCell>;
                              }
                              const sum = reportData.reduce((acc, row) => {
                                const v = Number(row[column.key] ?? 0);
                                return acc + (isNaN(v) ? 0 : v);
                              }, 0);
                              return (
                                <TableCell
                                  key={column.id}
                                  className="font-semibold"
                                >
                                  {new Intl.NumberFormat("en-US", {
                                    style: "currency",
                                    currency: "USD",
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  }).format(sum)}
                                </TableCell>
                              );
                            })}
                          </TableRow>
                        </TableFooter>
                      )}
                  </Table>
                </div>
              </>
            )}

            {/* Vista de Preview */}
            {showPreview && selectedTemplate && (
              <>
                <div className="mb-8">
                  <Link
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowPreview(false);
                    }}
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
                    Back to Templates
                  </Link>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      {selectedTemplate.name}
                    </h2>
                    <p className="text-gray-600">
                      {selectedTemplate.description}
                    </p>
                  </div>
                </div>
                <ReportsTable
                  columns={reportColumns}
                  data={reportData}
                  onExport={handleExportData}
                />
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
