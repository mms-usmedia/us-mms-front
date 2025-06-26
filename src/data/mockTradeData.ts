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
  // Havas Media-Mexico- Havas (org001) - Agency
  {
    id: "inc001",
    organizationId: "org001",
    country: "Mexico",
    productType: "EAP",
    incentiveType: "Fixed",
    percentage: 15,
    description: "Comisión estándar para productos exclusivos",
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
    percentage: 18,
    description: "Comisión estándar para productos no exclusivos",
    startDate: "2023-01-01",
    createdAt: "2022-12-15T00:00:00Z",
    updatedAt: "2022-12-15T00:00:00Z",
    isActive: true,
  },
  {
    id: "inc003",
    organizationId: "org001",
    country: "Mexico",
    productType: "All",
    incentiveType: "Scale",
    percentage: 15,
    description: "Comisión escalonada para México",
    startDate: "2023-01-01",
    tiers: [
      {
        minVolume: 0,
        maxVolume: 5000000,
        percentage: 15,
      },
      {
        minVolume: 5000001,
        maxVolume: 10000000,
        percentage: 17,
      },
      {
        minVolume: 10000001,
        percentage: 20,
      },
    ],
    createdAt: "2022-12-15T00:00:00Z",
    updatedAt: "2022-12-15T00:00:00Z",
    isActive: true,
  },

  // UM - Mexico - IPG (org008) - Agency
  {
    id: "inc004",
    organizationId: "org008",
    country: "Mexico",
    productType: "EAP",
    incentiveType: "Fixed",
    percentage: 14,
    description: "Comisión estándar para productos exclusivos",
    startDate: "2023-01-01",
    createdAt: "2022-12-20T00:00:00Z",
    updatedAt: "2022-12-20T00:00:00Z",
    isActive: true,
  },
  {
    id: "inc005",
    organizationId: "org008",
    country: "Mexico",
    productType: "PAS",
    incentiveType: "Fixed",
    percentage: 17,
    description: "Comisión estándar para productos no exclusivos",
    startDate: "2023-01-01",
    createdAt: "2022-12-20T00:00:00Z",
    updatedAt: "2022-12-20T00:00:00Z",
    isActive: true,
  },

  // MUV-Brasil-WPP (org009) - Agency
  {
    id: "inc006",
    organizationId: "org009",
    country: "Brasil",
    productType: "EAP",
    incentiveType: "Fixed",
    percentage: 16,
    description: "Comisión estándar para productos exclusivos",
    startDate: "2023-01-01",
    createdAt: "2022-12-25T00:00:00Z",
    updatedAt: "2022-12-25T00:00:00Z",
    isActive: true,
  },
  {
    id: "inc007",
    organizationId: "org009",
    country: "Brasil",
    productType: "PAS",
    incentiveType: "Fixed",
    percentage: 19,
    description: "Comisión estándar para productos no exclusivos",
    startDate: "2023-01-01",
    createdAt: "2022-12-25T00:00:00Z",
    updatedAt: "2022-12-25T00:00:00Z",
    isActive: true,
  },

  // Omnet-United States-OMG (org010) - Agency
  {
    id: "inc008",
    organizationId: "org010",
    country: "United States",
    productType: "EAP",
    incentiveType: "Fixed",
    percentage: 13,
    description: "Comisión estándar para productos exclusivos",
    startDate: "2023-01-01",
    createdAt: "2022-12-30T00:00:00Z",
    updatedAt: "2022-12-30T00:00:00Z",
    isActive: true,
  },
  {
    id: "inc009",
    organizationId: "org010",
    country: "United States",
    productType: "PAS",
    incentiveType: "Fixed",
    percentage: 16,
    description: "Comisión estándar para productos no exclusivos",
    startDate: "2023-01-01",
    createdAt: "2022-12-30T00:00:00Z",
    updatedAt: "2022-12-30T00:00:00Z",
    isActive: true,
  },

  // Carat-Argentina-Dentsu (org013) - Agency
  {
    id: "inc010",
    organizationId: "org013",
    country: "Argentina",
    productType: "EAP",
    incentiveType: "Fixed",
    percentage: 15,
    description: "Comisión estándar para productos exclusivos",
    startDate: "2023-01-01",
    createdAt: "2023-01-05T00:00:00Z",
    updatedAt: "2023-01-05T00:00:00Z",
    isActive: true,
  },
  {
    id: "inc011",
    organizationId: "org013",
    country: "Argentina",
    productType: "PAS",
    incentiveType: "Fixed",
    percentage: 18,
    description: "Comisión estándar para productos no exclusivos",
    startDate: "2023-01-01",
    createdAt: "2023-01-05T00:00:00Z",
    updatedAt: "2023-01-05T00:00:00Z",
    isActive: true,
  },

  // Starcom-Mexico-Publicis (org014) - Agency
  {
    id: "inc012",
    organizationId: "org014",
    country: "México",
    productType: "EAP",
    incentiveType: "Fixed",
    percentage: 14,
    description: "Comisión estándar para productos exclusivos",
    startDate: "2023-01-01",
    createdAt: "2023-01-10T00:00:00Z",
    updatedAt: "2023-01-10T00:00:00Z",
    isActive: true,
  },
  {
    id: "inc013",
    organizationId: "org014",
    country: "México",
    productType: "PAS",
    incentiveType: "Fixed",
    percentage: 17,
    description: "Comisión estándar para productos no exclusivos",
    startDate: "2023-01-01",
    createdAt: "2023-01-10T00:00:00Z",
    updatedAt: "2023-01-10T00:00:00Z",
    isActive: true,
  },

  // OMD-Argentina-OMG (org015) - Agency
  {
    id: "inc014",
    organizationId: "org015",
    country: "Argentina",
    productType: "EAP",
    incentiveType: "Fixed",
    percentage: 15,
    description: "Comisión estándar para productos exclusivos",
    startDate: "2023-01-01",
    createdAt: "2023-01-15T00:00:00Z",
    updatedAt: "2023-01-15T00:00:00Z",
    isActive: true,
  },
  {
    id: "inc015",
    organizationId: "org015",
    country: "Argentina",
    productType: "PAS",
    incentiveType: "Fixed",
    percentage: 18,
    description: "Comisión estándar para productos no exclusivos",
    startDate: "2023-01-01",
    createdAt: "2023-01-15T00:00:00Z",
    updatedAt: "2023-01-15T00:00:00Z",
    isActive: true,
  },
  {
    id: "inc016",
    organizationId: "org015",
    country: "Argentina",
    productType: "All",
    incentiveType: "OnTop",
    percentage: 18,
    additionalPercentage: 2,
    thresholdVolume: 5000000,
    description: "Incentivo adicional para volúmenes altos",
    startDate: "2023-01-01",
    createdAt: "2023-01-15T00:00:00Z",
    updatedAt: "2023-01-15T00:00:00Z",
    isActive: true,
  },

  // Soko (org016) - Agency
  {
    id: "inc017",
    organizationId: "org016",
    country: "Mexico",
    productType: "EAP",
    incentiveType: "Fixed",
    percentage: 12,
    description: "Comisión estándar para productos exclusivos",
    startDate: "2023-01-01",
    createdAt: "2023-01-20T00:00:00Z",
    updatedAt: "2023-01-20T00:00:00Z",
    isActive: true,
  },
  {
    id: "inc018",
    organizationId: "org016",
    country: "Mexico",
    productType: "PAS",
    incentiveType: "Fixed",
    percentage: 15,
    description: "Comisión estándar para productos no exclusivos",
    startDate: "2023-01-01",
    createdAt: "2023-01-20T00:00:00Z",
    updatedAt: "2023-01-20T00:00:00Z",
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
