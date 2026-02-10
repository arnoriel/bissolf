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

  const toggleChat = (state?: boolean) => setIsChatOpen(prev => state ?? !prev);
  
  const addChatMessage = (msg: ChatMessage) => {
    setChatMessages(prev => [...prev, msg]);
  };

  const resetChat = () => {
    setChatMessages([]);
  };

  const addProduct = (product: Product) => {
    setProducts(prev => [product, ...prev]);
  };

  const updateProduct = (updated: Product) => {
    setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const updateProductStock = (id: string, qty: number, variantOptionName?: string) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        const newGlobalStock = Math.max(0, p.stocks - qty);
        let updatedVariants = p.variants;
        
        if (variantOptionName && p.variants) {
           updatedVariants = p.variants.map(v => ({
             ...v,
             options: v.options.map(opt => {
               if (variantOptionName.includes(opt.name)) {
                 const currentVariantStock = opt.stock !== undefined ? opt.stock : 0;
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

  const createOrder = (order: Order) => {
    setOrders(prev => [order, ...prev]);
    updateProductStock(order.id_product, order.quantity, order.selected_variants);
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const cancelOrder = (orderId: string, reason: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return { success: false, message: "Pesanan tidak ditemukan." };

    if (order.status !== 'Packaging') {
      return { success: false, message: `Status "${order.status}" tidak bisa dibatalkan.` };
    }

    setOrders(prev => prev.map(o => 
      o.id === orderId ? { ...o, status: 'Canceled', cancel_reason: reason } : o
    ));

    updateProductStock(order.id_product, -order.quantity, order.selected_variants);
    return { success: true, message: "Pesanan dibatalkan, stok dikembalikan." };
  };

  // --- UPDATE LOGIC DISINI ---
  const initiateOrderFromLanding = (product: Product, variantLabel?: string) => {
    setIsChatOpen(true);
    
    let additionalPrice = 0;
    
    // Cari apakah ada additional price dari variant yang dipilih
    if (variantLabel && product.variants) {
      product.variants.forEach(v => {
        v.options.forEach(opt => {
          // Jika nama option ada di dalam label (misal "Stroberi" ada di "Rasa: Stroberi")
          if (variantLabel.includes(opt.name)) {
            additionalPrice += opt.option_price || 0;
          }
        });
      });
    }

    const totalPrice = product.price + additionalPrice;
    
    const content = variantLabel 
      ? `Halo BISSOLF! Saya tertarik untuk memesan ${product.product_name} (${variantLabel}). Harga total: Rp${totalPrice.toLocaleString('id-ID')}` 
      : `Halo BISSOLF! Saya tertarik untuk memesan ${product.product_name}.`;
    
    addChatMessage({ role: 'user', content: content });
  };

  return (
    <StoreContext.Provider value={{
      products, orders, isChatOpen, toggleChat, chatMessages, 
      addChatMessage, createOrder, updateOrderStatus, updateProductStock, 
      initiateOrderFromLanding, resetChat, addProduct, updateProduct, 
      deleteProduct, cancelOrder
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};
