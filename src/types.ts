// F:\projectan\bissolf\src\types.ts

export interface VariantOption {
  name: string; // contoh: "Stroberi", "Vanila"
  image?: string; 
  stock?: number; // <--- NEW: Menambahkan stok spesifik per opsi varian
}

export interface ProductVariant {
  name: string; // contoh: "Rasa"
  options: VariantOption[]; 
}

export interface Product {
  id: string;
  product_name: string;
  product_sku: string;
  price: number;
  stocks: number; // Stok Global (Total semua varian)
  brand: string;
  category: string;
  description: string;
  image_url?: string;
  variants?: ProductVariant[]; 
}

export type OrderStatus = 'Packaging' | 'Ready to Send' | 'On Delivery' | 'Done' | 'Canceled';

export interface Order {
  variant: string;
  id: string;
  id_product: string;
  product_name: string;
  product_price: number;
  quantity: number;
  total_price: number;
  buyer_name: string;
  buyer_phone: string;
  buyer_location: string;
  selected_variants?: string; // String varian, misal: "Rasa: Stroberi"
  payment_method: string;
  status: OrderStatus;
  cancel_reason?: string;
  created_at: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  isPaymentRequest?: boolean;
}