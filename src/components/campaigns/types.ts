// Tipos compartidos para la sección de campañas

export interface Campaign {
  id: string;
  name: string;
  organizationName: string;
  organizationType:
    | "Agencia"
    | "Advertiser"
    | "Publisher"
    | "Holding Agency"
    | "Holding Advertiser";
  startDate: string;
  endDate: string;
  status:
    | "Pending"
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
  // Campos adicionales para el detalle
  salesperson?: string;
  trafficker?: string;
  customer?: string;
  notes?: string;
  internalNotes?: string;
  billingParty: string;
  billingOffice: string;
  accountManager: string;
  adOpsLeader: string;
  industry: string;
  adUnits?: AdUnit[];
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
  investment: number;
  usmcRate: number;
  clientNetRate: number;
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

export interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadDate: string;
  uploadedBy: string;
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
    name: "Google AdSense",
    website: "www.google.com/adsense",
    agencyCommission: 10,
  },
  {
    id: "pub3",
    name: "Facebook Ads",
    website: "www.facebook.com/business",
    agencyCommission: 12,
  },
  {
    id: "pub4",
    name: "Twitter Ads",
    website: "ads.twitter.com",
    agencyCommission: 8,
  },
  {
    id: "pub5",
    name: "Amazon Advertising",
    website: "advertising.amazon.com",
    agencyCommission: 14,
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

export const channelOptions = [
  "Cross Platform Takeover VIDEO",
  "Podcast Audio Ads",
  "Display",
  "Video",
  "Social",
];

export const formatOptions = ["Display", "Video", "Audio", "Social", "Mobile"];

export const sizeOptions = [
  "Takeover",
  "Banner",
  "30s",
  "15s",
  "60s",
  "120x60",
  "300x250",
  "Interstitial",
];

export const modelOptions = ["CPM", "CPC", "CPA", "CPV", "Flat Fee"];

// Constantes para los estados posibles
export const statusOptions = [
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
];
