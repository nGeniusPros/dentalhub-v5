export interface Integration {
  id: string;
  name: string;
  description: string;
  category: string;
  subcategory?: string;
  icon?: string;
  rating: number;
  reviews: number;
  pricing: string;
  features: string[];
  status: "available" | "installed";
  featured?: boolean;
  website?: string;
  location?: string;
  contact?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  customAdded?: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  subcategories?: Array<{
    id: string;
    name: string;
  }>;
}
