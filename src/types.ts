// /Users/azriel/Project/bissolf/src/types.ts

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
}

export type OrderStatus = 'Packaging' | 'Ready to Send' | 'On Delivery' | 'Done' | 'Canceled';

export interface Order {
  id: string;
  id_product: string;
  product_name: string;
  product_price: number;
  quantity: number;
  total_price: number;
  buyer_name: string;
  buyer_phone: string;
  buyer_location: string; // <--- TAMBAHAN BARU
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