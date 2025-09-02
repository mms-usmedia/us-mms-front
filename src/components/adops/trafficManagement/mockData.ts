export interface TrafficCampaign {
  id: string;
  campaignId: string;
  name: string;
  format: string;
  publisher: {
    name: string;
    id: string;
  };
  advertiser: {
    name: string;
    id: string;
  };
  startDate: string;
  endDate: string;
  status:
    | "Materials Send"
    | "Material Received"
    | "Implementing"
    | "Live"
    | "Delivery"
    | "Closed";
  priority: "High" | "Medium" | "Low";
  trafficker: string;
  documents: {
    clientIO: boolean;
    publisherIO: boolean;
    creativeAssets: boolean;
  };
  notes?: string;
  duration?: number; // en días
}

export const mockTrafficCampaigns: TrafficCampaign[] = [
  {
    id: "1",
    campaignId: "#23584",
    name: "Fandom - Mercado Libre - Meliplay (MEX) - abr25",
    format: "Display",
    publisher: {
      name: "Fandom",
      id: "22688",
    },
    advertiser: {
      name: "Mercado Libre",
      id: "ML001",
    },
    startDate: "2025-04-06",
    endDate: "2025-05-10",
    status: "Material Received",
    priority: "High",
    trafficker: "Octavio Martinez",
    documents: {
      clientIO: true,
      publisherIO: true,
      creativeAssets: false,
    },
    notes: "Waiting for creative assets from client",
    duration: 34,
  },
  {
    id: "2",
    campaignId: "#23589",
    name: "Samsung - TAKEOVER - WeTransfer - ABRIL- MEX 2025",
    format: "Takeover",
    publisher: {
      name: "WeTransfer",
      id: "23955",
    },
    advertiser: {
      name: "Samsung MOSAIC MEDIA SAPI DE CV",
      id: "SM002",
    },
    startDate: "2025-04-10",
    endDate: "2025-04-12",
    status: "Materials Send",
    priority: "High",
    trafficker: "Laura Gómez",
    documents: {
      clientIO: true,
      publisherIO: true,
      creativeAssets: false,
    },
    duration: 2,
  },
  {
    id: "3",
    campaignId: "#23590",
    name: "Coca-Cola - Summer Campaign - YouTube - MEX 2024",
    format: "Video",
    publisher: {
      name: "YouTube",
      id: "23001",
    },
    advertiser: {
      name: "Coca-Cola México",
      id: "CC001",
    },
    startDate: "2024-06-01",
    endDate: "2024-08-31",
    status: "Implementing",
    priority: "Medium",
    trafficker: "Miguel Ángel Rodríguez",
    documents: {
      clientIO: true,
      publisherIO: true,
      creativeAssets: true,
    },
    notes: "Implementation in progress, waiting for final approval",
    duration: 92,
  },
  {
    id: "4",
    campaignId: "#23591",
    name: "Nike - Running Collection - Instagram - MEX 2024",
    format: "Social",
    publisher: {
      name: "Instagram",
      id: "23002",
    },
    advertiser: {
      name: "Nike México",
      id: "NM001",
    },
    startDate: "2024-05-15",
    endDate: "2024-06-30",
    status: "Live",
    priority: "Medium",
    trafficker: "Sofía Ramírez",
    documents: {
      clientIO: true,
      publisherIO: true,
      creativeAssets: true,
    },
    notes: "Campaign running smoothly, weekly reports being sent",
    duration: 47,
  },
  {
    id: "5",
    campaignId: "#23592",
    name: "Amazon Prime - Series Launch - Spotify - MEX 2024",
    format: "Audio",
    publisher: {
      name: "Spotify",
      id: "23003",
    },
    advertiser: {
      name: "Amazon México",
      id: "AM001",
    },
    startDate: "2024-04-01",
    endDate: "2024-05-15",
    status: "Closed",
    priority: "Low",
    trafficker: "Carlos Mendoza",
    documents: {
      clientIO: true,
      publisherIO: true,
      creativeAssets: true,
    },
    notes: "Campaign completed successfully, final report sent",
    duration: 45,
  },
  {
    id: "6",
    campaignId: "#23593",
    name: "BBVA - Financial Services - Facebook - MEX 2024",
    format: "Display",
    publisher: {
      name: "Facebook",
      id: "23004",
    },
    advertiser: {
      name: "BBVA México",
      id: "BM001",
    },
    startDate: "2024-06-10",
    endDate: "2024-07-31",
    status: "Materials Send",
    priority: "Medium",
    trafficker: "Ana Torres",
    documents: {
      clientIO: true,
      publisherIO: true,
      creativeAssets: true,
    },
    notes: "Ready to implement",
    duration: 52,
  },
  {
    id: "7",
    campaignId: "#23594",
    name: "Telcel - 5G Launch - TikTok - MEX 2024",
    format: "Video",
    publisher: {
      name: "TikTok",
      id: "23005",
    },
    advertiser: {
      name: "Telcel México",
      id: "TM001",
    },
    startDate: "2024-05-20",
    endDate: "2024-07-20",
    status: "Implementing",
    priority: "High",
    trafficker: "Roberto Sánchez",
    documents: {
      clientIO: true,
      publisherIO: true,
      creativeAssets: true,
    },
    notes: "Implementation in progress, waiting for platform approval",
    duration: 62,
  },
  {
    id: "8",
    campaignId: "#23595",
    name: "Liverpool - Summer Sale - Pinterest - MEX 2024",
    format: "Social",
    publisher: {
      name: "Pinterest",
      id: "23006",
    },
    advertiser: {
      name: "Liverpool México",
      id: "LM001",
    },
    startDate: "2024-06-15",
    endDate: "2024-07-15",
    status: "Live",
    priority: "Medium",
    trafficker: "Diana Flores",
    documents: {
      clientIO: true,
      publisherIO: true,
      creativeAssets: true,
    },
    duration: 31,
  },
];
