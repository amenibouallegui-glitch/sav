export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  productsPurchased?: Product[];
  warrantyStatus?: 'Active' | 'Expired' | 'Extended';
  customerSince: string;
  isActive: boolean;
  createdAt: string;
  totalClaims?: number;
}

export interface Product {
  id: string;
  name: string;
  model: string;
  serialNumber: string;
  purchaseDate: string;
  warrantyEndDate: string;
  category: string;
}

export interface CreateClientRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
}