export interface Vendor {
  id: string;
  name: string;
  category:
    | "Insurance"
    | "Laboratory"
    | "Supplies"
    | "Financial"
    | "Utilities"
    | "Miscellaneous";
  labType?:
    | "Ortho"
    | "Removable"
    | "Crown & Bridge"
    | "Imaging"
    | "Implant"
    | "All";
  accountNumber?: string;
  payorId?: string;
  networkStatus?: "in-network" | "out-of-network";
  serviceType?: string;
  contactName: string;
  email: string;
  phone: string;
  website?: string;
  notes: string[];
  credentials?: {
    username: string;
    password: string;
  };
  labFees?: LabFee[];
  accountDetails?: {
    accountNumber?: string;
    routingNumber?: string;
    accountType?: "checking" | "savings" | "credit";
  };
}

export interface LabFee {
  id: string;
  code: string;
  description: string;
  fee: number;
  category?: string;
  effectiveDate: string;
}

export interface VendorGroup {
  name: string;
  vendors: Vendor[];
}
