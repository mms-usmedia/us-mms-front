// Interfaces
export interface VolumeTier {
  minVolume: number;
  maxVolume?: number;
  percentage: number;
}

export interface TradeIncentive {
  id: string;
  organizationId: string;
  country: string;
  productType: "EAP" | "PAS" | "All" | "Specific";
  specificProduct?: {
    id: string;
    name: string;
  };
  incentiveType: "Fixed" | "Volume" | "Scale" | "OnTop";
  // Para incentivos Fixed
  percentage: number;
  // Para incentivos OnTop
  additionalPercentage?: number; // Porcentaje adicional para incentivos OnTop
  thresholdVolume?: number; // Volumen a partir del cual se aplica el porcentaje adicional
  // Para incentivos Scale
  tiers?: VolumeTier[]; // Escalas múltiples para incentivos Scale
  description: string;
  startDate: string;
  endDate?: string;
  minVolume?: number;
  maxVolume?: number;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

// Mock data para incentivos de trade para todas las organizaciones
export const mockTradeIncentives: TradeIncentive[] = [
  // OMD Mexico (org001) - Agency
  {
    id: "inc001",
    organizationId: "org001",
    country: "Mexico",
    productType: "EAP",
    incentiveType: "Fixed",
    percentage: 15,
    description: "Comisión estándar para productos exclusivos (Tinder, Hulu)",
    startDate: "2023-01-01",
    createdAt: "2022-12-15T00:00:00Z",
    updatedAt: "2022-12-15T00:00:00Z",
    isActive: true,
  },
  {
    id: "inc002",
    organizationId: "org001",
    country: "Mexico",
    productType: "PAS",
    incentiveType: "Fixed",
    percentage: 20,
    description:
      "Comisión estándar para productos no exclusivos (LinkedIn, Twitter)",
    startDate: "2023-01-01",
    createdAt: "2022-12-15T00:00:00Z",
    updatedAt: "2022-12-15T00:00:00Z",
    isActive: true,
  },
  {
    id: "inc003",
    organizationId: "org001",
    country: "Colombia",
    productType: "All",
    incentiveType: "Scale",
    percentage: 15,
    description: "Comisión escalonada para Colombia",
    startDate: "2023-01-01",
    tiers: [
      {
        minVolume: 0,
        maxVolume: 10000000,
        percentage: 15,
      },
      {
        minVolume: 10000001,
        maxVolume: 20000000,
        percentage: 18,
      },
      {
        minVolume: 20000001,
        percentage: 20,
      },
    ],
    createdAt: "2022-12-15T00:00:00Z",
    updatedAt: "2022-12-15T00:00:00Z",
    isActive: true,
  },
  {
    id: "inc005",
    organizationId: "org001",
    country: "Brazil",
    productType: "All",
    incentiveType: "OnTop",
    percentage: 5,
    additionalPercentage: 3,
    thresholdVolume: 25000000,
    description: "Incentivo adicional por volumen anual (Brasil)",
    startDate: "2023-01-01",
    endDate: "2023-12-31",
    createdAt: "2022-12-15T00:00:00Z",
    updatedAt: "2022-12-15T00:00:00Z",
    isActive: true,
  },

  // Havas Media Colombia (org006) - Agency
  {
    id: "inc006",
    organizationId: "org006",
    country: "Colombia",
    productType: "EAP",
    incentiveType: "Fixed",
    percentage: 14,
    description: "Comisión para productos exclusivos en Colombia",
    startDate: "2023-01-01",
    createdAt: "2022-12-20T00:00:00Z",
    updatedAt: "2022-12-20T00:00:00Z",
    isActive: true,
  },
  {
    id: "inc007",
    organizationId: "org006",
    country: "Colombia",
    productType: "PAS",
    incentiveType: "Fixed",
    percentage: 18,
    description: "Comisión para productos no exclusivos en Colombia",
    startDate: "2023-01-01",
    createdAt: "2022-12-20T00:00:00Z",
    updatedAt: "2022-12-20T00:00:00Z",
    isActive: true,
  },
  {
    id: "inc008",
    organizationId: "org006",
    country: "Mexico",
    productType: "All",
    incentiveType: "Volume",
    percentage: 16,
    description: "Comisión por volumen en México (mínimo $5M)",
    startDate: "2023-01-01",
    minVolume: 5000000,
    createdAt: "2022-12-20T00:00:00Z",
    updatedAt: "2022-12-20T00:00:00Z",
    isActive: true,
  },

  // Omnicom Media Group (org004) - Holding Agency
  {
    id: "inc009",
    organizationId: "org004",
    country: "United States",
    productType: "EAP",
    incentiveType: "Fixed",
    percentage: 12,
    description: "Comisión base para productos exclusivos en USA",
    startDate: "2023-01-01",
    createdAt: "2023-01-05T00:00:00Z",
    updatedAt: "2023-01-05T00:00:00Z",
    isActive: true,
  },
  {
    id: "inc010",
    organizationId: "org004",
    country: "United States",
    productType: "PAS",
    incentiveType: "Fixed",
    percentage: 17,
    description: "Comisión base para productos no exclusivos en USA",
    startDate: "2023-01-01",
    createdAt: "2023-01-05T00:00:00Z",
    updatedAt: "2023-01-05T00:00:00Z",
    isActive: true,
  },
  {
    id: "inc011",
    organizationId: "org004",
    country: "United States",
    productType: "All",
    incentiveType: "Scale",
    percentage: 15,
    description: "Escala 1: Inversión hasta $50M",
    startDate: "2023-01-01",
    minVolume: 0,
    maxVolume: 50000000,
    createdAt: "2023-01-05T00:00:00Z",
    updatedAt: "2023-01-05T00:00:00Z",
    isActive: true,
  },
  {
    id: "inc012",
    organizationId: "org004",
    country: "United States",
    productType: "All",
    incentiveType: "Scale",
    percentage: 18,
    description: "Escala 2: Inversión de $50M a $100M",
    startDate: "2023-01-01",
    minVolume: 50000001,
    maxVolume: 100000000,
    createdAt: "2023-01-05T00:00:00Z",
    updatedAt: "2023-01-05T00:00:00Z",
    isActive: true,
  },
  {
    id: "inc013",
    organizationId: "org004",
    country: "United States",
    productType: "All",
    incentiveType: "Scale",
    percentage: 20,
    description: "Escala 3: Inversión superior a $100M",
    startDate: "2023-01-01",
    minVolume: 100000001,
    createdAt: "2023-01-05T00:00:00Z",
    updatedAt: "2023-01-05T00:00:00Z",
    isActive: true,
  },
  {
    id: "inc014",
    organizationId: "org004",
    country: "Global",
    productType: "All",
    incentiveType: "OnTop",
    percentage: 3,
    additionalPercentage: 2,
    description:
      "Incentivo adicional global por cumplimiento de objetivos anuales",
    startDate: "2023-01-01",
    endDate: "2023-12-31",
    minVolume: 200000000,
    createdAt: "2023-01-05T00:00:00Z",
    updatedAt: "2023-01-05T00:00:00Z",
    isActive: true,
  },

  // WPP (org005) - Holding Agency
  {
    id: "inc015",
    organizationId: "org005",
    country: "United Kingdom",
    productType: "EAP",
    incentiveType: "Fixed",
    percentage: 13,
    description: "Comisión para productos exclusivos en Reino Unido",
    startDate: "2023-01-01",
    createdAt: "2023-01-10T00:00:00Z",
    updatedAt: "2023-01-10T00:00:00Z",
    isActive: true,
  },
  {
    id: "inc016",
    organizationId: "org005",
    country: "United Kingdom",
    productType: "PAS",
    incentiveType: "Fixed",
    percentage: 18,
    description: "Comisión para productos no exclusivos en Reino Unido",
    startDate: "2023-01-01",
    createdAt: "2023-01-10T00:00:00Z",
    updatedAt: "2023-01-10T00:00:00Z",
    isActive: true,
  },
  {
    id: "inc017",
    organizationId: "org005",
    country: "Spain",
    productType: "All",
    incentiveType: "Fixed",
    percentage: 15,
    description: "Comisión estándar para España",
    startDate: "2023-01-01",
    createdAt: "2023-01-10T00:00:00Z",
    updatedAt: "2023-01-10T00:00:00Z",
    isActive: true,
  },
  {
    id: "inc018",
    organizationId: "org005",
    country: "Global",
    productType: "All",
    incentiveType: "Volume",
    percentage: 2,
    description: "Incentivo global adicional por volumen (más de $150M)",
    startDate: "2023-01-01",
    minVolume: 150000000,
    createdAt: "2023-01-10T00:00:00Z",
    updatedAt: "2023-01-10T00:00:00Z",
    isActive: true,
  },
  {
    id: "inc019",
    organizationId: "org005",
    country: "France",
    productType: "All",
    incentiveType: "Fixed",
    percentage: 16,
    description: "Comisión estándar para Francia",
    startDate: "2023-01-01",
    createdAt: "2023-01-10T00:00:00Z",
    updatedAt: "2023-01-10T00:00:00Z",
    isActive: true,
  },

  // CALIA Y2 PROPAGANDA E MARKETING LTDA (org010) - Agency (Brasil)
  {
    id: "inc020",
    organizationId: "org010",
    country: "Brazil",
    productType: "EAP",
    incentiveType: "Fixed",
    percentage: 16,
    description: "Comisión base para productos exclusivos en Brasil",
    startDate: "2023-01-01",
    createdAt: "2023-02-15T00:00:00Z",
    updatedAt: "2023-02-15T00:00:00Z",
    isActive: true,
  },
  {
    id: "inc021",
    organizationId: "org010",
    country: "Brazil",
    productType: "PAS",
    incentiveType: "Fixed",
    percentage: 21,
    description: "Comisión para productos no exclusivos en Brasil",
    startDate: "2023-01-01",
    createdAt: "2023-02-15T00:00:00Z",
    updatedAt: "2023-02-15T00:00:00Z",
    isActive: true,
  },
  {
    id: "inc022",
    organizationId: "org010",
    country: "Brazil",
    productType: "All",
    incentiveType: "Scale",
    percentage: 18,
    description: "Escala 1: Inversión hasta $8M BRL",
    startDate: "2023-01-01",
    minVolume: 0,
    maxVolume: 8000000,
    createdAt: "2023-02-15T00:00:00Z",
    updatedAt: "2023-02-15T00:00:00Z",
    isActive: true,
  },
  {
    id: "inc023",
    organizationId: "org010",
    country: "Brazil",
    productType: "All",
    incentiveType: "Scale",
    percentage: 22,
    description: "Escala 2: Inversión superior a $8M BRL",
    startDate: "2023-01-01",
    minVolume: 8000001,
    createdAt: "2023-02-15T00:00:00Z",
    updatedAt: "2023-02-15T00:00:00Z",
    isActive: true,
  },
  {
    id: "inc024",
    organizationId: "org010",
    country: "Argentina",
    productType: "All",
    incentiveType: "Fixed",
    percentage: 17,
    description: "Comisión para campañas en Argentina",
    startDate: "2023-01-01",
    createdAt: "2023-02-15T00:00:00Z",
    updatedAt: "2023-02-15T00:00:00Z",
    isActive: true,
  },

  // Omnet Chile (org012) - Agency (Chile)
  {
    id: "inc025",
    organizationId: "org012",
    country: "Chile",
    productType: "EAP",
    incentiveType: "Fixed",
    percentage: 14,
    description: "Comisión para productos exclusivos en Chile",
    startDate: "2023-01-01",
    createdAt: "2023-03-10T00:00:00Z",
    updatedAt: "2023-03-10T00:00:00Z",
    isActive: true,
  },
  {
    id: "inc026",
    organizationId: "org012",
    country: "Chile",
    productType: "PAS",
    incentiveType: "Fixed",
    percentage: 19,
    description: "Comisión para productos no exclusivos en Chile",
    startDate: "2023-01-01",
    createdAt: "2023-03-10T00:00:00Z",
    updatedAt: "2023-03-10T00:00:00Z",
    isActive: true,
  },
  {
    id: "inc027",
    organizationId: "org012",
    country: "Chile",
    productType: "All",
    incentiveType: "Volume",
    percentage: 4,
    description: "Incentivo adicional por volumen (más de $150M CLP)",
    startDate: "2023-01-01",
    minVolume: 150000000,
    createdAt: "2023-03-10T00:00:00Z",
    updatedAt: "2023-03-10T00:00:00Z",
    isActive: true,
  },
  {
    id: "inc028",
    organizationId: "org012",
    country: "Peru",
    productType: "All",
    incentiveType: "Fixed",
    percentage: 15,
    description: "Comisión para campañas en Perú",
    startDate: "2023-01-01",
    createdAt: "2023-03-10T00:00:00Z",
    updatedAt: "2023-03-10T00:00:00Z",
    isActive: true,
  },
  {
    id: "inc029",
    organizationId: "org012",
    country: "Chile",
    productType: "All",
    incentiveType: "OnTop",
    percentage: 3,
    description: "Incentivo especial por fidelidad (más de 3 años)",
    startDate: "2023-01-01",
    endDate: "2023-12-31",
    createdAt: "2023-03-10T00:00:00Z",
    updatedAt: "2023-03-10T00:00:00Z",
    isActive: true,
  },
];

// Función para obtener incentivos por ID de organización
export const getTradeIncentivesByOrganizationId = (
  organizationId: string
): TradeIncentive[] => {
  return mockTradeIncentives.filter(
    (incentive) => incentive.organizationId === organizationId
  );
};

// Función para obtener un incentivo por su ID
export const getTradeIncentiveById = (
  id: string
): TradeIncentive | undefined => {
  return mockTradeIncentives.find((incentive) => incentive.id === id);
};

// Función para obtener todos los países disponibles
export const getAllCountries = (): string[] => {
  const countries = new Set<string>();
  mockTradeIncentives.forEach((incentive) => {
    countries.add(incentive.country);
  });
  return ["All", ...Array.from(countries)].sort();
};

// Lista de productos disponibles para incentivos específicos
const mockProducts = [
  { id: "prod001", name: "Tinder" },
  { id: "prod002", name: "Hulu" },
  { id: "prod003", name: "LinkedIn" },
  { id: "prod004", name: "Twitter" },
  { id: "prod005", name: "Facebook" },
  { id: "prod006", name: "Instagram" },
  { id: "prod007", name: "Snapchat" },
  { id: "prod008", name: "TikTok" },
  { id: "prod009", name: "YouTube" },
  { id: "prod010", name: "Spotify" },
];

export const getAllProducts = () => {
  return mockProducts;
};
