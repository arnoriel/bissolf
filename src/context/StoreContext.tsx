// F:\projectan\bissolf\src\context\StoreContext.tsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Product, Order, ChatMessage, OrderStatus } from '../types';
import { dummyProducts } from '../data';

interface StoreContextType {
  products: Product[];
  orders: Order[];
  isChatOpen: boolean;
  toggleChat: (state?: boolean) => void;
  chatMessages: ChatMessage[];
  addChatMessage: (msg: ChatMessage) => void;
  createOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  cancelOrder: (orderId: string, reason: string) => { success: boolean; message: string };
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  // UPDATE: Menambahkan parameter opsional variantOptionName
  updateProductStock: (id: string, qty: number, variantOptionName?: string) => void;
  initiateOrderFromLanding: (product: Product, variantLabel?: string) => void;
  resetChat: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('bissolf_products');
    return saved ? JSON.parse(saved) : dummyProducts;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('bissolf_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    localStorage.setItem('bissolf_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('bissolf_orders', JSON.stringify(orders));
  }, [orders]);

  // --- Chat Logic ---
  const toggleChat = (state?: boolean) => setIsChatOpen(prev => state ?? !prev);
  
  const addChatMessage = (msg: ChatMessage) => {
    setChatMessages(prev => [...prev, msg]);
  };

  const resetChat = () => {
    setChatMessages([]);
  };

  // --- Product Management ---
  const addProduct = (product: Product) => {
    setProducts(prev => [product, ...prev]);
  };

  const updateProduct = (updated: Product) => {
    setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  // --- UPDATE: Logic Stok Varian ---
  // Fungsi ini sekarang bisa menangani pengurangan stok Global DAN Stok Varian
  const updateProductStock = (id: string, qty: number, variantOptionName?: string) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        // 1. Update Stok Global Product
        const newGlobalStock = Math.max(0, p.stocks - qty);
        
        // 2. Update Stok Varian Spesifik (jika ada variantOptionName)
        let updatedVariants = p.variants;
        
        if (variantOptionName && p.variants) {
           updatedVariants = p.variants.map(v => ({
             ...v,
             options: v.options.map(opt => {
               // Cek apakah nama option ini ada di dalam string varian yang dipilih
               // Misal: variantOptionName = "Rasa: Stroberi", opt.name = "Stroberi" -> Match!
               if (variantOptionName.includes(opt.name)) {
                 const currentVariantStock = opt.stock !== undefined ? opt.stock : 0;
                 // Jika qty positif = mengurangi stok. Jika negatif = menambah stok (untuk cancel order)
                 return { ...opt, stock: Math.max(0, currentVariantStock - qty) }; 
               }
               return opt;
             })
           }));
        }

        return { ...p, stocks: newGlobalStock, variants: updatedVariants };
      }
      return p;
    }));
  };

  // --- Order Management ---
  const createOrder = (order: Order) => {
    setOrders(prev => [order, ...prev]);
    // UPDATE: Kirim juga selected_variants agar stok varian spesifik ikut berkurang
    updateProductStock(order.id_product, order.quantity, order.selected_variants);
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const cancelOrder = (orderId: string, reason: string) => {
    const order = orders.find(o => o.id === orderId);
    
    if (!order) {
      return { success: false, message: "Pesanan tidak ditemukan di database." };
    }

    if (order.status !== 'Packaging') {
      return { 
        success: false, 
        message: `Maaf, pesanan statusnya sudah "${order.status}" dan tidak dapat dibatalkan secara otomatis.` 
      };
    }

    // 1. Ubah status pesanan menjadi Canceled
    setOrders(prev => prev.map(o => 
      o.id === orderId 
        ? { ...o, status: 'Canceled' as OrderStatus, cancel_reason: reason } 
        : o
    ));

    // 2. Kembalikan stok produk (Pass quantity negatif untuk menambah stok kembali)
    // UPDATE: Kirim juga selected_variants agar stok varian dikembalikan
    updateProductStock(order.id_product, -order.quantity, order.selected_variants);

    return { 
      success: true, 
      message: "Pesanan berhasil dibatalkan dan stok produk telah dikembalikan." 
    };
  };

  const initiateOrderFromLanding = (product: Product, variantLabel?: string) => {
    setIsChatOpen(true);
    
    const content = variantLabel 
      ? `Halo BISSOLF! Saya tertarik untuk memesan ${product.product_name} dengan varian ${variantLabel}` 
      : `Halo BISSOLF! Saya tertarik untuk memesan ${product.product_name}`;
    
    addChatMessage({ role: 'user', content: content });
  };

  return (
    <StoreContext.Provider value={{
      products, 
      orders, 
      isChatOpen, 
      toggleChat, 
      chatMessages, 
      addChatMessage, 
      createOrder, 
      updateOrderStatus, 
      updateProductStock, 
      initiateOrderFromLanding, 
      resetChat, 
      addProduct, 
      updateProduct, 
      deleteProduct,
      cancelOrder
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within StoreProvider');
  }
  return context;
};
