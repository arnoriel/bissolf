// /Users/azriel/Project/bissolf/src/context/StoreContext.tsx

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
  updateProductStock: (id: string, qty: number) => void;
  initiateOrderFromLanding: (product: Product, variantLabel?: string) => void;
  resetChat: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Inisialisasi Produk dari LocalStorage atau Dummy Data
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('bissolf_products');
    return saved ? JSON.parse(saved) : dummyProducts;
  });

  // Inisialisasi Pesanan dari LocalStorage
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('bissolf_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  // Efek untuk Sinkronisasi ke LocalStorage setiap ada perubahan data
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

  const updateProductStock = (id: string, qty: number) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        // Mengurangi stok, namun pastikan tidak kurang dari 0
        return { ...p, stocks: Math.max(0, p.stocks - qty) };
      }
      return p;
    }));
  };

  // --- Order Management ---
  const createOrder = (order: Order) => {
    setOrders(prev => [order, ...prev]);
    // Otomatis kurangi stok produk saat order berhasil dibuat
    updateProductStock(order.id_product, order.quantity);
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const cancelOrder = (orderId: string, reason: string) => {
    const order = orders.find(o => o.id === orderId);
    
    if (!order) {
      return { success: false, message: "Pesanan tidak ditemukan di database." };
    }

    // Hanya pesanan dengan status 'Packaging' yang bisa dibatalkan secara otomatis via Chatbot
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

    // 2. Kembalikan stok produk yang sebelumnya dipesan
    setProducts(prev => prev.map(p => 
      p.id === order.id_product 
        ? { ...p, stocks: p.stocks + order.quantity } 
        : p
    ));

    return { 
      success: true, 
      message: "Pesanan berhasil dibatalkan dan stok produk telah dikembalikan." 
    };
  };

  /**
   * Fungsi untuk memicu pembelian dari Landing Page/Katalog.
   * Mendukung label varian agar Chatbot AI langsung mendapatkan konteks pilihan user.
   */
  const initiateOrderFromLanding = (product: Product, variantLabel?: string) => {
    setIsChatOpen(true);
    
    const content = variantLabel 
      ? `Halo BISSOLF! Saya tertarik untuk memesan ${product.product_name} dengan ${variantLabel}` 
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
