// Tipos para HUR (Historical Update Request)
export type HURStatus =
  | "Review"
  | "More Info"
  | "Approved"
  | "Remove Invoice"
  | "Re-open Campaign"
  | "Editing"
  | "Close Campaign"
  | "Close Invoice Period"
  | "Not Approved"
  | "Completed";

export interface HURRequest {
  id: string;
  requestNumber: string;
  requestDate: string;
  mediaType: string;
  publisher: string;
  campaign: string;
  campaignName: string;
  campaignId: string;
  billingOffice: string;
  category?: string;
  status: HURStatus;
  requestedBy: string;
  requester: string;
  assignedTo?: string;
  month: string;
  year: string;
  currentAmount?: number;
  newAmount?: number;
  lineNumbers: string[];
  publisherIONumbers: string[];
  comments?: string;
  moreInfoRequestedBy?: string;
  moreInfoRequestDate?: string;
  moreInfoRequestedByRole?: string;
  moreInfoRequestedByEmail?: string;
  moreInfoRequestedByDepartment?: string;
  approver?: string;
  approvalDate?: string;
  module: string;
  justification: string;
}

// Datos mock para HUR
export const mockHURRequests: HURRequest[] = [
  {
    id: "1",
    requestNumber: "HUR-2023-001",
    requestDate: "2023-10-15",
    mediaType: "Online",
    publisher: "WeTransfer",
    campaign: "Yakult_Campaña anual_WeTransfer_Jun_Mexico",
    campaignName: "Yakult_Campaña anual_WeTransfer_Jun_Mexico",
    campaignId: "CAM-2023-001",
    billingOffice: "Mexico City",
    category: "Change Customer Rate (Finance)",
    status: "Review",
    requestedBy: "Carlos Mendez",
    requester: "Carlos Mendez",
    month: "06",
    year: "2023",
    currentAmount: 50000,
    newAmount: 55000,
    lineNumbers: ["L-001", "L-002", "L-003"],
    publisherIONumbers: ["IO-WT-2023-001"],
    module: "Online",
    justification:
      "Ajuste de presupuesto debido a cambios en la estrategia de campaña.",
  },
  {
    id: "2",
    requestNumber: "HUR-2023-002",
    requestDate: "2023-10-16",
    mediaType: "Video",
    publisher: "YouTube",
    campaign: "Coca-Cola_Summer_Campaign_2023",
    campaignName: "Coca-Cola Summer Campaign 2023",
    campaignId: "CAM-2023-002",
    billingOffice: "Miami",
    category:
      "Change Impressions where it does not affect billed amount (AdOps)",
    status: "More Info",
    requestedBy: "John Smith",
    requester: "John Smith",
    assignedTo: "Maria Rodriguez",
    month: "07",
    year: "2023",
    // No amounts relevant for this category
    lineNumbers: ["L-004", "L-005"],
    publisherIONumbers: ["IO-YT-2023-002"],
    comments:
      "Necesitamos más detalles sobre los cambios en el presupuesto. Por favor proporcione información adicional.",
    moreInfoRequestedBy: "Maria Rodriguez",
    moreInfoRequestDate: "2023-10-17T14:30:00Z",
    moreInfoRequestedByRole: "Finance Manager",
    moreInfoRequestedByEmail: "maria.rodriguez@usmedia.com",
    moreInfoRequestedByDepartment: "Finance",
    module: "Video",
    justification:
      "Reducción del presupuesto debido a menor rendimiento del esperado.",
  },
  {
    id: "3",
    requestNumber: "HUR-2023-003",
    requestDate: "2023-10-17",
    mediaType: "Social",
    publisher: "Facebook",
    campaign: "Nike_Fall_Collection_2023",
    campaignName: "Nike Fall Collection 2023",
    campaignId: "CAM-2023-003",
    billingOffice: "Mexico",
    category: "Change Dates (Start and End Dates) (AdOps)",
    status: "Approved",
    requestedBy: "Emma Johnson",
    requester: "Emma Johnson",
    assignedTo: "Luis Gonzalez",
    month: "09",
    year: "2023",
    // No amounts changed
    lineNumbers: ["L-006", "L-007", "L-008", "L-009"],
    publisherIONumbers: ["IO-FB-2023-003", "IO-FB-2023-004"],
    approver: "Luis Gonzalez",
    approvalDate: "2023-10-18T09:15:00Z",
    module: "Social",
    justification:
      "Reasignación de presupuesto entre líneas sin cambio en el total.",
  },
  {
    id: "4",
    requestNumber: "HUR-2023-004",
    requestDate: "2023-10-18",
    mediaType: "Print",
    publisher: "Google",
    campaign: "Samsung_Galaxy_Launch_2023",
    campaignName: "Samsung Galaxy Launch 2023",
    campaignId: "CAM-2023-004",
    billingOffice: "Miami",
    category: "Change Publisher Rate (Finance)",
    status: "Remove Invoice",
    requestedBy: "Kim Lee",
    requester: "Kim Lee",
    assignedTo: "David Park",
    month: "08",
    year: "2023",
    currentAmount: 95000,
    newAmount: 105000,
    lineNumbers: ["L-010", "L-011"],
    publisherIONumbers: ["IO-GG-2023-005"],
    approver: "David Park",
    approvalDate: "2023-10-19T11:45:00Z",
    module: "Online",
    justification:
      "Aumento de presupuesto para ampliar el alcance de la campaña.",
  },
  {
    id: "5",
    requestNumber: "HUR-2023-005",
    requestDate: "2023-10-19",
    mediaType: "Broadcast",
    publisher: "Spotify",
    campaign: "Apple_AirPods_Campaign_2023",
    campaignName: "Apple AirPods Campaign 2023",
    campaignId: "CAM-2023-005",
    billingOffice: "Mexico",
    category: "Change Publisher Commission/Taxes/Others (Finance)",
    status: "Not Approved",
    requestedBy: "Sarah Williams",
    requester: "Sarah Williams",
    assignedTo: "Tom Brown",
    month: "10",
    year: "2023",
    currentAmount: 65000,
    newAmount: 60000,
    lineNumbers: ["L-012"],
    publisherIONumbers: ["IO-SP-2023-006"],
    comments:
      "El cambio solicitado no está alineado con nuestras políticas de ajuste de presupuesto.",
    approver: "Tom Brown",
    approvalDate: "2023-10-20T16:30:00Z",
    module: "Broadcast",
    justification:
      "Reducción de presupuesto debido a menor rendimiento del esperado.",
  },
  {
    id: "6",
    requestNumber: "HUR-2023-006",
    requestDate: "2023-10-20",
    mediaType: "Out of Home",
    publisher: "Twitch",
    campaign: "EA_Sports_FIFA_2024_Launch",
    campaignName: "EA Sports FIFA 2024 Launch",
    campaignId: "CAM-2023-006",
    billingOffice: "Mexico",
    category: "Change Buying Model (AdOps)",
    status: "Completed",
    requestedBy: "Javier Fernandez",
    requester: "Javier Fernandez",
    assignedTo: "Ana Torres",
    month: "11",
    year: "2023",
    // No direct amounts shown
    lineNumbers: ["L-013", "L-014", "L-015"],
    publisherIONumbers: ["IO-TW-2023-007", "IO-TW-2023-008"],
    approver: "Ana Torres",
    approvalDate: "2023-10-21T10:00:00Z",
    module: "Out of Home",
    justification:
      "Incremento de presupuesto para extender la campaña una semana más.",
  },
];
