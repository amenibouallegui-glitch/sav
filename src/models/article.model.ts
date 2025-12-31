export interface Article {
  id: string;
  name: string;
  description: string;
  partNumber: string;
  brand: string;
  category: string;
  compatibleProducts: string[];
  price: number;
  stock: number;
  minimumStock: number;
  supplier: string;
  location: string; // emplacement en stock
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateArticleRequest {
  name: string;
  description: string;
  partNumber: string;
  brand: string;
  category: string;
  compatibleProducts: string[];
  price: number;
  stock: number;
  minimumStock: number;
  supplier: string;
  location: string;
}