// /src/components/campaigns/publisherData.ts
// Estructura de datos para publishers y sus opciones disponibles

export interface PublisherOption {
  channel: string;
  format: string;
  size: string;
  commModel: string;
  openRate: number;
}

// Datos para LinkedIn
export const linkedinOptions: PublisherOption[] = [
  // 160x600
  {
    channel: "ROS",
    format: "Display",
    size: "160x600",
    commModel: "CPM",
    openRate: 22.5,
  },
  {
    channel: "Home Page",
    format: "Display",
    size: "160x600",
    commModel: "CPM",
    openRate: 12.5,
  },
  {
    channel: "Education",
    format: "Display",
    size: "160x600",
    commModel: "CPM",
    openRate: 18.66,
  },
  {
    channel: "Government Administration",
    format: "Display",
    size: "160x600",
    commModel: "CPM",
    openRate: 12.0,
  },
  {
    channel: "Run of Professionals",
    format: "Display",
    size: "160x600",
    commModel: "CPC",
    openRate: 18.49,
  },
  {
    channel: "Run of Professionals",
    format: "Display",
    size: "160x600",
    commModel: "CPM",
    openRate: 17.43,
  },

  // 728x90
  {
    channel: "ROS",
    format: "Display",
    size: "728x90",
    commModel: "CPM",
    openRate: 22.5,
  },
  {
    channel: "Home Page",
    format: "Display",
    size: "728x90",
    commModel: "CPM",
    openRate: 12.5,
  },
  {
    channel: "Education",
    format: "Display",
    size: "728x90",
    commModel: "CPM",
    openRate: 18.66,
  },
  {
    channel: "Targeted Gender & Age",
    format: "Display",
    size: "728x90",
    commModel: "CPM",
    openRate: 19.17,
  },

  // 300x250
  {
    channel: "ROS",
    format: "Display",
    size: "300x250",
    commModel: "CPC",
    openRate: 19.17,
  },
  {
    channel: "ROS",
    format: "Display",
    size: "300x250",
    commModel: "CPM",
    openRate: 22.5,
  },
  {
    channel: "Home Page",
    format: "Display",
    size: "300x250",
    commModel: "CPM",
    openRate: 12.5,
  },
  {
    channel: "Education",
    format: "Display",
    size: "300x250",
    commModel: "CPM",
    openRate: 18.66,
  },
  {
    channel: "Targeted Gender & Age",
    format: "Display",
    size: "300x250",
    commModel: "CPM",
    openRate: 19.17,
  },
];

// Datos para Tinder
export const tinderOptions: PublisherOption[] = [
  // Display
  {
    channel: "ROA - Run Of App",
    format: "Display",
    size: "Engagement Ad > Poll",
    commModel: "Fixed",
    openRate: 15.0,
  },
  {
    channel: "ROA - Run Of App",
    format: "Display",
    size: "Branded Profile Card",
    commModel: "CPM",
    openRate: 15.0,
  },
  {
    channel: "ROA - Run Of App",
    format: "Display",
    size: "Native Display Card",
    commModel: "CPM",
    openRate: 7.5,
  },
  {
    channel: "ROA - Run Of App",
    format: "Display",
    size: "Native Display Card",
    commModel: "Fixed",
    openRate: 889.0,
  },
  {
    channel: "ROA - Run Of App",
    format: "Display",
    size: "1st Impression NDC",
    commModel: "CPM",
    openRate: 9.5,
  },
  {
    channel: "ROA - Run Of App",
    format: "Display",
    size: "1st Impression BPC",
    commModel: "CPM",
    openRate: 17.0,
  },

  // Text Link
  {
    channel: "ROA - Run Of App",
    format: "Text Link",
    size: "Sponsored Inbox Message",
    commModel: "CPM",
    openRate: 0.07,
  },

  // Video
  {
    channel: "ROA - Run Of App",
    format: "Video",
    size: "300x250 Mobile Video Ad",
    commModel: "CPM",
    openRate: 0.0,
  },
  {
    channel: "ROA - Run Of App",
    format: "Video",
    size: 'Video Pre-roll 30"',
    commModel: "CPM",
    openRate: 0.09,
  },
  {
    channel: "ROA - Run Of App",
    format: "Video",
    size: "Native Video Card",
    commModel: "CPM",
    openRate: 7.5,
  },
  {
    channel: "ROA - Run Of App",
    format: "Video",
    size: "1st Impression NVC",
    commModel: "CPM",
    openRate: 9.5,
  },

  // Content Integration
  {
    channel: "ROA - Run Of App",
    format: "Content Integration",
    size: "Custom Poll",
    commModel: "CPM",
    openRate: 20.0,
  },
];

// Datos para MAP (Mobile Ad Performance)
export const mapOptions: PublisherOption[] = [
  // MAP - Bonificação
  {
    channel: "MAP - Bonificação",
    format: "Display",
    size: "Full Banner",
    commModel: "CPA",
    openRate: 0.06,
  },
  {
    channel: "MAP - Bonificação",
    format: "Display",
    size: "Full Banner",
    commModel: "CPI",
    openRate: 0.5,
  },
  {
    channel: "MAP - Bonificação",
    format: "Display",
    size: "banner",
    commModel: "CPA",
    openRate: 0.0,
  },
  {
    channel: "MAP - Bonificação",
    format: "Display",
    size: "Varios Mobile",
    commModel: "CPA",
    openRate: 0.0,
  },
  {
    channel: "MAP - Bonificação",
    format: "Display",
    size: "0",
    commModel: "CPI",
    openRate: 0.0,
  },

  // Mobile Ad Performance
  {
    channel: "Mobile Ad Performance",
    format: "Display",
    size: "Full Banner",
    commModel: "CPA",
    openRate: 16.0,
  },
  {
    channel: "Mobile Ad Performance",
    format: "Display",
    size: "Full Banner",
    commModel: "CPL",
    openRate: 0.0,
  },
  {
    channel: "Mobile Ad Performance",
    format: "Display",
    size: "110x220",
    commModel: "CPI",
    openRate: 0.0,
  },
  {
    channel: "Mobile Ad Performance",
    format: "Display",
    size: "Varios",
    commModel: "CPA",
    openRate: 0.23,
  },
  {
    channel: "Mobile Ad Performance",
    format: "Display",
    size: "Varios",
    commModel: "CPL",
    openRate: 0.0,
  },
  {
    channel: "Mobile Ad Performance",
    format: "Display",
    size: "Varios",
    commModel: "CPI",
    openRate: 0.74,
  },
  {
    channel: "Mobile Ad Performance",
    format: "Display",
    size: "banner",
    commModel: "CPA",
    openRate: 0.23,
  },
  {
    channel: "Mobile Ad Performance",
    format: "Display",
    size: "Varios Mobile",
    commModel: "CPA",
    openRate: 16.0,
  },
  {
    channel: "Mobile Ad Performance",
    format: "Display",
    size: "Varios Mobile",
    commModel: "CPL",
    openRate: 0.0,
  },
  {
    channel: "Mobile Ad Performance",
    format: "Display",
    size: "Varios Mobile",
    commModel: "CPI",
    openRate: 0.0,
  },
];

// Datos para Fandom
export const fandomOptions: PublisherOption[] = [
  // 100x20
  {
    channel: "1 day Sponsorship",
    format: "Display",
    size: "100x20",
    commModel: "Fixed",
    openRate: 4000.0,
  },
  {
    channel: "Sponsor Logo Bar",
    format: "Display",
    size: "100x20",
    commModel: "CPM",
    openRate: 0.0,
  },
  {
    channel: "Sponsor Logo Bar",
    format: "Display",
    size: "100x20",
    commModel: "Fixed",
    openRate: 0.0,
  },

  // 100x40
  {
    channel: "preroll",
    format: "Display",
    size: "100x40",
    commModel: "CPM",
    openRate: 14.4,
  },
  {
    channel: "Countdown Clock",
    format: "Display",
    size: "100x40",
    commModel: "CPM",
    openRate: 11.0,
  },

  // 728x90
  {
    channel: "ROS",
    format: "Display",
    size: "728x90",
    commModel: "CPM",
    openRate: 46.21,
  },
  {
    channel: "ROS",
    format: "Display",
    size: "728x90",
    commModel: "CPA",
    openRate: 149.74,
  },
  {
    channel: "Gaming Wikis",
    format: "Display",
    size: "728x90",
    commModel: "Fixed",
    openRate: 149.74,
  },
  {
    channel: "Billborad Roadblock",
    format: "Display",
    size: "728x90",
    commModel: "CPM",
    openRate: 61.51,
  },
  {
    channel: "Standard Roadblock Targeting Action",
    format: "Display",
    size: "728x90",
    commModel: "CPM",
    openRate: 55.31,
  },
  {
    channel: "Entertainment Channel 728x90 BT 15-24 Geo",
    format: "Display",
    size: "728x90",
    commModel: "CPM",
    openRate: 7.0,
  },
  {
    channel: "VIDEO BILLBOARD ROADBLOCK",
    format: "Display",
    size: "728x90",
    commModel: "CPM",
    openRate: 151.69,
  },
  {
    channel: "STANDARD ROADBLOCK",
    format: "Display",
    size: "728x90",
    commModel: "CPM",
    openRate: 124.63,
  },
  {
    channel: "standar banners",
    format: "Display",
    size: "728x90",
    commModel: "CPM",
    openRate: 46.21,
  },
  {
    channel: "Leaderboard 728 x 90",
    format: "Display",
    size: "728x90",
    commModel: "CPM",
    openRate: 67.6,
  },
];

// Datos para OneFootball
export const oneFootballOptions: PublisherOption[] = [
  // TakeOver
  {
    channel: "TakeOver",
    format: "Display",
    size: "HOME PAGE TAKEOVER (HPTO)",
    commModel: "CPM",
    openRate: 2.68,
  },
  {
    channel: "TakeOver",
    format: "Display",
    size: "HOME PAGE TAKEOVER (HPTO)",
    commModel: "Fixed",
    openRate: 3217.5,
  },
  {
    channel: "TakeOver",
    format: "Display",
    size: "MATCHDAY TAKEOVER (MDTO)",
    commModel: "Fixed",
    openRate: 4500.0,
  },
  {
    channel: "TakeOver",
    format: "Display",
    size: "HOME PAGE TAKEOVER (HPTO)",
    commModel: "Fixed",
    openRate: 3750.0,
  },

  // Video
  {
    channel: "Video",
    format: "Video",
    size: "OUTSTREAM VIDEO",
    commModel: "CPM",
    openRate: 11.0,
  },
  {
    channel: "Video",
    format: "Video",
    size: "VERTICAL VIDEO ADS",
    commModel: "CPM",
    openRate: 17.6,
  },
  {
    channel: "Video",
    format: "Video",
    size: "VIDEO PLAYER - PRE-ROLL - BUMPER ADS",
    commModel: "CPM",
    openRate: 17.6,
  },
  {
    channel: "Video",
    format: "Video",
    size: "PRE-ROLL - SKIPPABLE (12 - 30 SEC)",
    commModel: "CPM",
    openRate: 25.0,
  },
  {
    channel: "Video",
    format: "Video",
    size: "PRE-ROLL - NON-SKIPPABLE (MAX 20 SEC)",
    commModel: "CPM",
    openRate: 27.0,
  },

  // ROA
  {
    channel: "ROA - Run Of App",
    format: "Display",
    size: "320x50",
    commModel: "CPM",
    openRate: 0.92,
  },

  // Low Display
  {
    channel: "Low Display (Tier 1 Display)",
    format: "Display",
    size: "320x50",
    commModel: "CPM",
    openRate: 1.16,
  },
  {
    channel: "Low Display (Tier 1 Display)",
    format: "Display",
    size: "176x176",
    commModel: "CPM",
    openRate: 1.16,
  },
  {
    channel: "Low Display (Tier 1 Display)",
    format: "Display",
    size: "320x50px",
    commModel: "CPM",
    openRate: 2.31,
  },
  {
    channel: "Low Display (Tier 1 Display)",
    format: "Display",
    size: "STICKY BANNER (320x50px):",
    commModel: "CPM",
    openRate: 1.16,
  },
  {
    channel: "Low Display (Tier 1 Display)",
    format: "Display",
    size: "Sticky Banner 320x50",
    commModel: "CPM",
    openRate: 0.0,
  },
];

// Datos para WeTransfer
export const weTransferOptions: PublisherOption[] = [
  {
    channel: "Home Page",
    format: "Display",
    size: "728x90",
    commModel: "CPM",
    openRate: 0,
  },
  {
    channel: "Home Page",
    format: "Display",
    size: "120x600",
    commModel: "CPM",
    openRate: 15,
  },
  {
    channel: "Premium Position",
    format: "Display",
    size: "120x600",
    commModel: "CPM",
    openRate: 4,
  },
  {
    channel: "Platinum Position",
    format: "Display",
    size: "120x600",
    commModel: "CPM",
    openRate: 20,
  },
  {
    channel: "Home Page",
    format: "Display",
    size: "Overlay",
    commModel: "CPM",
    openRate: 21.38,
  },
  {
    channel: "Home Page",
    format: "Display",
    size: "300x250 with Video",
    commModel: "CPM",
    openRate: 20,
  },
  {
    channel: "Premium Position",
    format: "Display",
    size: "300x250 with Video",
    commModel: "CPM",
    openRate: 20,
  },
  {
    channel: "Home Page",
    format: "Display",
    size: "Shoskele (layer to banner)",
    commModel: "CPM",
    openRate: 2870.61,
  },
  {
    channel: "Premium Position",
    format: "Display",
    size: "Full Page",
    commModel: "CPM",
    openRate: 21.35,
  },
  {
    channel: "Home Page",
    format: "Display",
    size: "Fixed Takeover",
    commModel: "CPM",
    openRate: 5000,
  },
  {
    channel: "Home Page",
    format: "Display",
    size: "Fixed Takeover",
    commModel: "Fixed",
    openRate: 5000,
  },
  {
    channel: "Home Page",
    format: "Display",
    size: "Fixed Takeover",
    commModel: "Fx-Day",
    openRate: 5000,
  },
  {
    channel: "Home Page",
    format: "Display",
    size: "Background Customization",
    commModel: "CPM",
    openRate: 15,
  },
  {
    channel: "Home Page",
    format: "Display",
    size: "120x20",
    commModel: "CPM",
    openRate: 0,
  },
  {
    channel: "BG+Video",
    format: "Display",
    size: "120x20",
    commModel: "CPM",
    openRate: 2,
  },
];

// Datos para TikTok
export const tiktokOptions: PublisherOption[] = [
  {
    channel: "RON",
    format: "Video",
    size: "In Feed Ads",
    commModel: "CPC",
    openRate: 0.09,
  },
  {
    channel: "RON",
    format: "Video",
    size: "In Feed Ads",
    commModel: "CPM",
    openRate: 1.65,
  },
  {
    channel: "RON",
    format: "Video",
    size: "In Feed Ads",
    commModel: "CPV",
    openRate: 0.02,
  },
  {
    channel: "RON",
    format: "Video",
    size: "Top View",
    commModel: "Fx-Day",
    openRate: 39300.0,
  },
  {
    channel: "RON",
    format: "Video",
    size: "One Day Max",
    commModel: "CPM",
    openRate: 1.0,
  },
  {
    channel: "RON",
    format: "Video",
    size: "One Day Max",
    commModel: "Fx-Day",
    openRate: 12400.0,
  },
  {
    channel: "RON",
    format: "Video",
    size: "In Feed",
    commModel: "CPC",
    openRate: 0.09,
  },
  {
    channel: "RON",
    format: "Video",
    size: "In Feed",
    commModel: "CPM",
    openRate: 1.65,
  },
  {
    channel: "RON",
    format: "Video",
    size: "In Feed",
    commModel: "Fx-Day",
    openRate: 0.0,
  },
  {
    channel: "RON",
    format: "Video",
    size: "In Feed",
    commModel: "CPV",
    openRate: 0.02,
  },
  {
    channel: "RON",
    format: "Video",
    size: "Boosted",
    commModel: "CPC",
    openRate: 0.1,
  },
  {
    channel: "RON",
    format: "Video",
    size: "Boosted",
    commModel: "CPM",
    openRate: 0.1,
  },
  {
    channel: "RON",
    format: "Video",
    size: "Boosted",
    commModel: "CPV",
    openRate: 0.02,
  },
  {
    channel: "RON",
    format: "Video",
    size: "Collection Ads",
    commModel: "CPC",
    openRate: 0.1,
  },
  {
    channel: "RON",
    format: "Video",
    size: "Collection Ads",
    commModel: "CPM",
    openRate: 1.35,
  },
];

// Datos para Vevo
export const vevoOptions: PublisherOption[] = [
  {
    channel: "Mobile",
    format: "Video",
    size: "15 - 30 sec skippable",
    commModel: "CPM",
    openRate: 2.87,
  },
  {
    channel: "Mobile",
    format: "Video",
    size: "6 seg bumper video",
    commModel: "CPM",
    openRate: 5.03,
  },
  {
    channel: "Mobile",
    format: "Video",
    size: "10 sec non-skippable",
    commModel: "CPM",
    openRate: 2340.0,
  },
  {
    channel: "Desktop",
    format: "Video",
    size: "In Feed Ads",
    commModel: "CPM",
    openRate: 2.87,
  },
  {
    channel: "Desktop",
    format: "Video",
    size: "15 sec non-skippable",
    commModel: "CPM",
    openRate: 4.01,
  },
  {
    channel: "Desktop",
    format: "Video",
    size: "15 - 30 sec skippable",
    commModel: "CPM",
    openRate: 2.87,
  },
  {
    channel: "Desktop",
    format: "Video",
    size: "6 seg bumper video",
    commModel: "CPM",
    openRate: 5.03,
  },
  {
    channel: "Desktop",
    format: "Video",
    size: "short video",
    commModel: "CPM",
    openRate: 2.28,
  },
  {
    channel: "Desktop",
    format: "Video",
    size: "Skippable video",
    commModel: "CPM",
    openRate: 3.69,
  },
  {
    channel: "Desktop",
    format: "Video",
    size: "30 seg Skip",
    commModel: "CPM",
    openRate: 4.01,
  },
  {
    channel: "CTV",
    format: "Video",
    size: "15 sec non-skippable",
    commModel: "CPM",
    openRate: 8.42,
  },
  {
    channel: "CTV",
    format: "Video",
    size: "15 - 30 sec skippable",
    commModel: "CPM",
    openRate: 2.87,
  },
  {
    channel: "CTV",
    format: "Video",
    size: "6 seg bumper video",
    commModel: "CPM",
    openRate: 5.8,
  },
  {
    channel: "CTV",
    format: "Video",
    size: "short video",
    commModel: "CPM",
    openRate: 5.54,
  },
  {
    channel: "CTV",
    format: "Video",
    size: "Skippable video",
    commModel: "CPM",
    openRate: 3.69,
  },
];

// Mapa de publishers a sus opciones
export const publisherOptionsMap: Record<string, PublisherOption[]> = {
  Linkedin: linkedinOptions,
  Tinder: tinderOptions,
  MAP: mapOptions,
  Fandom: fandomOptions,
  OneFootball: oneFootballOptions,
  WeTransfer: weTransferOptions,
  TikTok: tiktokOptions,
  Vevo: vevoOptions,
};

// Función para obtener opciones de canal para un publisher
export const getChannelOptions = (publisher: string): string[] => {
  if (!publisherOptionsMap[publisher]) return [];

  // Extraer canales únicos para este publisher
  const channels = publisherOptionsMap[publisher].map(
    (option) => option.channel
  );
  return [...new Set(channels)];
};

// Función para obtener opciones de formato basado en publisher y canal
export const getFormatOptions = (
  publisher: string,
  channel: string
): string[] => {
  if (!publisherOptionsMap[publisher]) return [];

  // Filtrar por canal y extraer formatos únicos
  const formats = publisherOptionsMap[publisher]
    .filter((option) => option.channel === channel)
    .map((option) => option.format);

  return [...new Set(formats)];
};

// Función para obtener opciones de modelo de comisión basado en publisher, canal y formato
export const getCommModelOptions = (
  publisher: string,
  channel: string,
  format: string
): string[] => {
  if (!publisherOptionsMap[publisher]) return [];

  // Filtrar por canal y formato, luego extraer modelos de comisión únicos
  const models = publisherOptionsMap[publisher]
    .filter((option) => option.channel === channel && option.format === format)
    .map((option) => option.commModel);

  return [...new Set(models)];
};

// Función para obtener opciones de tamaño basado en publisher, canal, formato y modelo
export const getSizeOptions = (
  publisher: string,
  channel: string,
  format: string,
  commModel: string
): string[] => {
  if (!publisherOptionsMap[publisher]) return [];

  // Filtrar por canal, formato y modelo, luego extraer tamaños únicos
  const sizes = publisherOptionsMap[publisher]
    .filter(
      (option) =>
        option.channel === channel &&
        option.format === format &&
        option.commModel === commModel
    )
    .map((option) => option.size);

  return [...new Set(sizes)];
};

// Función para obtener la tarifa abierta basada en todas las selecciones
export const getOpenRate = (
  publisher: string,
  channel: string,
  format: string,
  size: string,
  commModel: string
): number | null => {
  if (!publisherOptionsMap[publisher]) return null;

  // Buscar la opción específica
  const option = publisherOptionsMap[publisher].find(
    (option) =>
      option.channel === channel &&
      option.format === format &&
      option.size === size &&
      option.commModel === commModel
  );

  return option ? option.openRate : null;
};
