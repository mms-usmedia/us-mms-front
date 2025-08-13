export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  country?: string;
  username: string;
  isAdmin: boolean;
  noLimitAccess: boolean;
  active: boolean;
  role?: string;
  roles?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  module: string;
  permissions: Permission[];
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  module: string;
  action: "view" | "create" | "edit" | "delete" | "approve";
}

export interface UserRole {
  userId: string;
  roleId: string;
  role: Role;
}

export interface UserVisibility {
  userId: string;
  visibleUserId: string;
  visibleUser: User;
}

export interface ExchangeRate {
  id: string;
  fromCurrency: string;
  toCurrency: string;
  rate: number;
  // Legacy fields kept for compatibility
  date: string;
  updatedBy: string;
  // History support
  status?: "active" | "inactive";
  createdAt?: string;
  createdBy?: string;
}

export interface InvoicingPeriod {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  module?: string;
  status: "open" | "closed" | "processing";
  createdAt: string;
  updatedAt: string;
}
