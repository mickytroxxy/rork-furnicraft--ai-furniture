export type FurnitureCategory = 'chairs' | 'tables' | 'sofas' | 'beds' | 'wardrobes';

export interface FurnitureItem {
  id: string;
  name: string;
  description: string;
  category: FurnitureCategory;
  imageUrl: string;
  price?: number;
}

export interface CartItem {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  isAiGenerated: boolean;
  aiPrompt?: string;
}

export interface Order {
  items: CartItem[];
  customerInfo: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
  };
  timestamp: number;
}
