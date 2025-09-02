// /src/components/campaigns/types.ts
// Tipos compartidos para la sección de campañas

export interface Campaign {
  id: string;
  name: string;
  // Nuevo campo para tipo de campaña
  campaignType: "IO-based" | "Programmatic";
  organizationType:
    | "Agency"
    | "Advertiser"
    | "Publisher"
    | "Holding Agency"
    | "Holding Advertiser"
    | "Direct";
  startDate: string;
  endDate: string;
  status:
    | "Pending"
    | "Pending Organization Approval"
    | "Negotiating"
    | "Won"
    | "Approved"
    | "Materials & Creatives OK"
    | "Implementation"
    | "Live"
    | "Closed"
    | "HUR"
    | "Invoiced";
  units: number;
  budget: number;
  grossMargin: number;
  // Campos comunes para el detalle
  currency?: string;
  exchangeRate?: number;
  salesperson?: string;
  trafficker?: string;
  customer?: string;
  advertiser?: string;
  agencyName?: string; // Nombre de la agencia cuando organizationType es "Agency"
  notes?: string;
  internalNotes?: string;
  billingParty: string;
  billingOffice: string;
  accountManager: string;
  adOpsLeader: string;
  industry: string;
  adUnits?: AdUnit[];
  // Nuevos campos
  organizationPublisher?: string;
  customerBillingParty?: string;
  agencyContact?: string;
  billingContact?: string;
  cioOwner?: "Customer" | "USMC";

  // Campos específicos para campañas programáticas
  commissionRate?: number;
  dspUsed?: string;
  programmaticType?: "Standard" | "PMP" | "PG";
  brandProduct?: string; // Nuevo campo Product Brand para campañas programáticas

  // Campos específicos para campañas IO-based
  mediaOwner?: string;
  paymentTerms?: string;
  targetMarket?: string;
  isCrossBorder?: boolean;
  // Activity history (e.g., HUR changes)
  activityHistory?: CampaignActivityEvent[];
}

export interface AdUnit {
  id: string;
  line: string;
  publisher: string;
  market: string;
  channel: string;
  format: string;
  size: string;
  units: number;
  model: string;
  margin: string;
  unitCost: number;
  customerInvestment: number;
  customerNetRate: number;
  startDate: string;
  endDate: string;
  status: string;
  // Campos adicionales para costos ocultos
  agencyCommission?: number; // Porcentaje de comisión AVB
  localTaxes?: number; // Porcentaje de impuestos locales
  grossMargin?: number; // Margen bruto
  publisherNetCost?: number; // Costo neto para el publisher
  publisherOpenRate?: number; // Tarifa abierta que pagamos al publisher
  publisherCommission?: number; // Comisión opcional del publisher (porcentaje)
}

export type CampaignActivityEventType =
  | "created"
  | "status_changed"
  | "edited"
  | "hur_change";

export interface CampaignActivityEvent {
  id: string;
  type: CampaignActivityEventType;
  date: string;
  user: string;
  description?: string;
  hurCategory?: string;
  fieldChanged?: string;
  previousValue?: string;
  newValue?: string;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadDate: string;
  uploadedBy: string;
}

// Enumeración para el tipo de servidor de facturación en la PIO
export enum BillingServerType {
  CUSTOMER_AD_SERVER = "Customer Ad Server",
  PUBLISHER_AD_SERVER = "Publisher Ad Server",
  SUBJECT_TO_DISCREPANCY = "Subject To Discrepancy",
}

// Interfaz para la orden de inserción del publicador (PIO)
export interface PublisherInsertionOrder {
  id: string;
  campaignId: string;
  publisherId: string;
  publisherName: string;
  publishingHouse: string;
  advertiser: string;
  billingServer: BillingServerType;
  notes: string;
  internalNotes?: string;
  dateSent: string;
  sendBy: string;
  customerInvestment: number;
  market: string;
  adUnits: AdUnit[];
}

// Simulación de datos para publishers
export interface Publisher {
  id: string;
  name: string;
  website: string;
  agencyCommission: number; // Porcentaje de comisión predeterminado
}

// Publishers de ejemplo
export const samplePublishers: Publisher[] = [
  {
    id: "pub1",
    name: "US Media Consulting Miami",
    website: "www.usmediaconsulting.com",
    agencyCommission: 15,
  },
  {
    id: "pub2",
    name: "Linkedin",
    website: "www.linkedin.com",
    agencyCommission: 15,
  },
  {
    id: "pub3",
    name: "Tinder",
    website: "www.tinder.com",
    agencyCommission: 15,
  },
  {
    id: "pub4",
    name: "MAP",
    website: "www.mobileadperformance.com",
    agencyCommission: 14,
  },
  {
    id: "pub5",
    name: "Fandom",
    website: "www.fandom.com",
    agencyCommission: 12,
  },
  {
    id: "pub6",
    name: "OneFootball",
    website: "www.onefootball.com",
    agencyCommission: 12,
  },
  {
    id: "pub7",
    name: "WeTransfer",
    website: "www.wetransfer.com",
    agencyCommission: 15,
  },
  {
    id: "pub8",
    name: "TikTok",
    website: "www.tiktok.com",
    agencyCommission: 15,
  },
  {
    id: "pub9",
    name: "Vevo",
    website: "www.vevo.com",
    agencyCommission: 15,
  },
];

// Opciones para los dropdowns de AdUnit
export const marketOptions = [
  "Argentina",
  "Brazil",
  "Chile",
  "Colombia",
  "Mexico",
  "Peru",
  "USA",
  "Global",
];

// Los valores de channelOptions, formatOptions, sizeOptions y modelOptions ahora serán dinámicos
// basados en el publisher seleccionado, usando el archivo publisherData.ts
export const channelOptions = [
  "ROS",
  "Home Page",
  "Education",
  "Government Administration",
  "Run of Professionals",
  "Targeted Gender & Age",
  "Cross Platform Takeover VIDEO",
  "Podcast Audio Ads",
  "Display",
  "Video",
  "Social",
];

export const formatOptions = ["Display", "Video", "Audio", "Social", "Mobile"];

export const sizeOptions = [
  "160x600",
  "728x90",
  "300x250",
  "Takeover",
  "Banner",
  "30s",
  "15s",
  "60s",
  "120x60",
  "Interstitial",
];

export const modelOptions = ["CPM", "CPC", "CPA", "CPV", "Flat Fee"];

// Constantes para los estados posibles
export const statusOptions = [
  "Pending",
  "Pending Organization Approval",
  "Negotiating",
  "Won",
  "Approved",
  "Materials & Creatives OK",
  "Implementation",
  "Live",
  "Closed",
  "HUR",
  "Invoiced",
];

// Textos de notas predefinidos según el tipo de servidor de facturación para la PIO
export const billingServerNotes = {
  [BillingServerType.CUSTOMER_AD_SERVER]:
    "The quantity of delivered impressions will be billed based on Customer AD server.\nConfidentiality Obligation. By signing, accepting or delivering any service requested by this Insertion Order, publisher acknowledges and agrees that the negotiations and terms of this Insertion Order, and invoices, reports, materials, and other documents created in connection with or related to such Insertion Order, are and shall remain as confidential Information. As such, they shall be treated by publisher in the same manner as it treats its own confidential documents, and not shared with any third party.",

  [BillingServerType.PUBLISHER_AD_SERVER]:
    "The quantity of delivered impressions will be billed based on Publisher Ad Server.\nConfidentiality Obligation. By signing, accepting or delivering any service requested by this Insertion Order, publisher acknowledges and agrees that the negotiations and terms of this Insertion Order, and invoices, reports, materials, and other documents created in connection with or related to such Insertion Order, are and shall remain as confidential Information. As such, they shall be treated by publisher in the same manner as it treats its own confidential documents, and not shared with any third party.",

  [BillingServerType.SUBJECT_TO_DISCREPANCY]:
    "This campaign will be billed off Publisher's numbers unless there is a discrepancy of more than 10% between Publisher's numbers and those of the Third Party ad server, in which case the parties will initiate reconciliation.\nConfidentiality Obligation. By signing, accepting or delivering any service requested by this Insertion Order, publisher acknowledges and agrees that the negotiations and terms of this Insertion Order, and invoices, reports, materials, and other documents created in connection with or related to such Insertion Order, are and shall remain as confidential Information. As such, they shall be treated by publisher in the same manner as it treats its own confidential documents, and not shared with any third party.",
};
