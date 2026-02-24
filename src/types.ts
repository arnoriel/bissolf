export interface VariantOption {
  name: string;
  image?: string; 
  stock?: number;
  option_price?: number;
}

export interface ProductVariant {
  name: string;
  options: VariantOption[]; 
}

export interface Product {
  id: string;
  user_id: string; // NEW: Owner of the product
  product_name: string;
  product_sku: string;
  price: number;
  stocks: number;
  brand: string;
  category: string;
  description: string;
  image?: string;
  variants?: ProductVariant[]; 
  created_at?: string;
}

export type OrderStatus = 'Packaging' | 'Ready to Send' | 'On Delivery' | 'Done' | 'Canceled';

export interface Order {
  variant: string;
  id: string;
  id_product: string;
  seller_id?: string; // NEW: Owner of the product that was ordered
  product_name: string;
  product_price: number;
  quantity: number;
  total_price: number;
  buyer_name: string;
  buyer_phone: string;
  buyer_location: string;
  selected_variants?: string;
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

// NEW: Profile Type
export interface Profile {
  id: string;
  store_name: string;
  description?: string;
  image_profile?: string;
  image_background?: string;
  ratings: number;
  created_at: string;
  updated_at: string;
}

// NEW: User Type with Profile
export interface UserWithProfile {
  id: string;
  email: string;
  profile?: Profile;
}