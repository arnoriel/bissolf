// /Users/azriel/Project/bissolf/src/types.ts

export interface VariantOption {
  name: string; // contoh: "S", "M", "Red", "Chocolate", "Biji Utuh"
  image?: string; // URL gambar preview untuk option ini (opsional)
}

export interface ProductVariant {
  name: string; // contoh: "Size", "Color", "Rasa", "Gilingan"
  options: VariantOption[]; // <-- DIUBAH dari string[] menjadi VariantOption[]
}

export interface Product {
  id: string;
  product_name: string;
  product_sku: string;
  price: number;
  stocks: number;
  brand: string;
  category: string;
  description: string;
  image_url?: string;
  variants?: ProductVariant[]; // Array varian (opsional)
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
  selected_variants?: string; // Menyimpan varian yang dipilih user (misal: "Size: L, Color: Brown")
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