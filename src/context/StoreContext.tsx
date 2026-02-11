import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Product, Order, ChatMessage, OrderStatus } from '../types';
import { dummyProducts } from '../data';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

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
  isLoading: boolean;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const useSupabase = isSupabaseConfigured();

  // ─── LOAD DATA SAAT MOUNT ───
  const loadData = useCallback(async () => {
    setIsLoading(true);

    if (useSupabase) {
      // === SUPABASE MODE ===
      try {
        const [productsRes, ordersRes] = await Promise.all([
          supabase.from('products').select('*').order('created_at', { ascending: true }),
          supabase.from('orders').select('*').order('created_at', { ascending: false })
        ]);

        if (productsRes.error) throw productsRes.error;
        if (ordersRes.error) throw ordersRes.error;

        setProducts(productsRes.data || []);
        setOrders(ordersRes.data || []);
      } catch (error) {
        console.error('Supabase load error, fallback ke localStorage:', error);
        // Fallback ke localStorage jika Supabase gagal
        loadFromLocalStorage();
      }
    } else {
      // === LOCAL MODE ===
      loadFromLocalStorage();
    }

    setIsLoading(false);
  }, [useSupabase]);

  const loadFromLocalStorage = () => {
    const savedProducts = localStorage.getItem('bissolf_products');
    const savedOrders = localStorage.getItem('bissolf_orders');
    setProducts(savedProducts ? JSON.parse(savedProducts) : dummyProducts);
    setOrders(savedOrders ? JSON.parse(savedOrders) : []);
  };

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ─── SYNC LOCAL STORAGE (fallback) ───
  useEffect(() => {
    if (!useSupabase && products.length > 0) {
      localStorage.setItem('bissolf_products', JSON.stringify(products));
    }
  }, [products, useSupabase]);

  useEffect(() => {
    if (!useSupabase) {
      localStorage.setItem('bissolf_orders', JSON.stringify(orders));
    }
  }, [orders, useSupabase]);

  // ─── CHAT ───
  const toggleChat = (state?: boolean) => setIsChatOpen(prev => state ?? !prev);

  const addChatMessage = (msg: ChatMessage) => {
    setChatMessages(prev => [...prev, msg]);
  };

  const resetChat = () => {
    setChatMessages([]);
  };

  // ─── PRODUCT CRUD ───
  const addProduct = async (product: Product) => {
    setProducts(prev => [product, ...prev]);

    if (useSupabase) {
      const { error } = await supabase.from('products').insert(product);
      if (error) console.error('Supabase insert product error:', error);
    }
  };

  const updateProduct = async (updated: Product) => {
    setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));

    if (useSupabase) {
      const { error } = await supabase
        .from('products')
        .update(updated)
        .eq('id', updated.id);
      if (error) console.error('Supabase update product error:', error);
    }
  };

  const deleteProduct = async (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));

    if (useSupabase) {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      if (error) console.error('Supabase delete product error:', error);
    }
  };

  const updateProductStock = async (id: string, qty: number, variantOptionName?: string) => {
    let updatedProduct: Product | null = null;

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
        updatedProduct = { ...p, stocks: newGlobalStock, variants: updatedVariants };
        return updatedProduct;
      }
      return p;
    }));

    if (useSupabase && updatedProduct) {
      const { error } = await supabase
        .from('products')
        .update({
          stocks: (updatedProduct as Product).stocks,
          variants: (updatedProduct as Product).variants
        })
        .eq('id', id);
      if (error) console.error('Supabase update stock error:', error);
    }
  };

  // ─── ORDER CRUD ───
  const createOrder = async (order: Order) => {
    setOrders(prev => [order, ...prev]);
    updateProductStock(order.id_product, order.quantity, order.selected_variants);

    if (useSupabase) {
      const { error } = await supabase.from('orders').insert(order);
      if (error) console.error('Supabase insert order error:', error);
    }
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));

    if (useSupabase) {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);
      if (error) console.error('Supabase update order status error:', error);
    }
  };

  const cancelOrder = (orderId: string, reason: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return { success: false, message: "Pesanan tidak ditemukan." };

    if (order.status !== 'Packaging') {
      return { success: false, message: `Status "${order.status}" tidak bisa dibatalkan.` };
    }

    setOrders(prev => prev.map(o =>
      o.id === orderId ? { ...o, status: 'Canceled' as OrderStatus, cancel_reason: reason } : o
    ));

    // Supabase update
    if (useSupabase) {
      supabase
        .from('orders')
        .update({ status: 'Canceled', cancel_reason: reason })
        .eq('id', orderId)
        .then(({ error }) => {
          if (error) console.error('Supabase cancel order error:', error);
        });
    }

    updateProductStock(order.id_product, -order.quantity, order.selected_variants);
    return { success: true, message: "Pesanan dibatalkan, stok dikembalikan." };
  };

  // ─── INITIATE ORDER FROM LANDING ───
  const initiateOrderFromLanding = (product: Product, variantLabel?: string) => {
    setIsChatOpen(true);

    let additionalPrice = 0;

    if (variantLabel && product.variants) {
      product.variants.forEach(v => {
        v.options.forEach(opt => {
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
      deleteProduct, cancelOrder, isLoading
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
