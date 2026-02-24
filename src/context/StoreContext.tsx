import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Product, Order, ChatMessage, OrderStatus } from '../types';
import { dummyProducts } from '../data';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useAuth } from './AuthContext';

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
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  updateProductStock: (id: string, qty: number, variantOptionName?: string) => void;
  initiateOrderFromLanding: (product: Product, variantLabel?: string) => void;
  resetChat: () => void;
  isLoading: boolean;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const useSupabase = isSupabaseConfigured();

  // Load data hanya untuk user yang login
  const loadData = useCallback(async () => {
    setIsLoading(true);

    if (useSupabase) {
      try {
        // ✅ LOAD ALL PRODUCTS (PUBLIC)
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (productsError) throw productsError;

        setProducts(productsData || []);

        // ✅ LOAD ORDERS ONLY IF SELLER LOGIN
        if (isAuthenticated && user) {
          const { data: ordersData, error: ordersError } = await supabase
            .from('orders')
            .select('*')
            .eq('seller_id', user.id)
            .order('created_at', { ascending: false });

          if (ordersError) throw ordersError;
          setOrders(ordersData || []);
        } else {
          setOrders([]);
        }

      } catch (error) {
        console.error('Supabase load error:', error);
        loadFromLocalStorage();
      }
    } else {
      loadFromLocalStorage();
    }

    setIsLoading(false);
  }, [useSupabase, isAuthenticated, user]);

  const loadFromLocalStorage = () => {
    const savedProducts = localStorage.getItem('bissolf_products');
    const savedOrders = localStorage.getItem('bissolf_orders');
    setProducts(savedProducts ? JSON.parse(savedProducts) : dummyProducts);
    setOrders(savedOrders ? JSON.parse(savedOrders) : []);
  };

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Sync LocalStorage hanya jika tidak pakai Supabase
  useEffect(() => {
    if (!useSupabase && !isLoading) {
      localStorage.setItem('bissolf_products', JSON.stringify(products));
      localStorage.setItem('bissolf_orders', JSON.stringify(orders));
    }
  }, [products, orders, useSupabase, isLoading]);

  const toggleChat = (state?: boolean) => setIsChatOpen(prev => state ?? !prev);
  const addChatMessage = (msg: ChatMessage) => setChatMessages(prev => [...prev, msg]);
  const resetChat = () => setChatMessages([]);

  // ─── PRODUCT CRUD ───
  const addProduct = async (product: Product) => {
    if (!isAuthenticated || !user) {
      alert("Anda harus login terlebih dahulu");
      return;
    }

    const productWithUser = {
      ...product,
      user_id: user.id,
    };

    // Update UI dulu (Optimistic Update)
    setProducts(prev => [productWithUser, ...prev]);

    if (useSupabase) {
      const { error } = await supabase.from('products').insert([productWithUser]);
      if (error) {
        console.error('Supabase Insert Error:', error.message, error.details);
        alert("Gagal menyimpan ke database: " + error.message);
        loadData(); // Revert jika gagal
      }
    }
  };

  const updateProduct = async (updated: Product) => {
    if (!isAuthenticated || !user) return;
    
    // Pastikan user hanya update produknya sendiri
    if (updated.user_id !== user.id) {
      alert("Anda tidak memiliki akses untuk mengubah produk ini");
      return;
    }

    setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));

    if (useSupabase) {
      const { error } = await supabase
      .from('products')
      .update({
        product_name: updated.product_name,
        product_sku: updated.product_sku,
        category: updated.category,
        brand: updated.brand,
        price: updated.price,
        stocks: updated.stocks,
        description: updated.description,
        image: updated.image,
        variants: updated.variants,
      })
      .eq('id', updated.id)
      .eq('user_id', user.id);
      
      if (error) {
        console.error('Supabase Update Error:', error.message);
        alert("Gagal update database: " + error.message);
        loadData();
      }
    }
  };

  const deleteProduct = async (id: string) => {
    if (!isAuthenticated || !user) return;

    setProducts(prev => prev.filter(p => p.id !== id));

    if (useSupabase) {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id); // Extra safety

      if (error) {
        console.error('Supabase Delete Error:', error.message);
        alert("Gagal menghapus dari database.");
        loadData();
      }
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
        .eq('id', id)
        .eq('user_id', user?.id);
      if (error) console.error('Supabase stock update error:', error);
    }
  };

  // ─── ORDER CRUD ───
  const createOrder = async (order: Order) => {
    if (!order.seller_id) {
      throw new Error("seller_id tidak boleh kosong");
    }

    setOrders(prev => [order, ...prev]);
    await updateProductStock(order.id_product, order.quantity, order.selected_variants);

    if (useSupabase) {
      const { error } = await supabase.from('orders').insert([order]);
      if (error) throw error;
    }
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    if (!isAuthenticated || !user) return;

    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));

    if (useSupabase) {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId)
        .eq('seller_id', user.id); // Extra safety
      if (error) console.error('Supabase order status error:', error);
    }
  };

  const cancelOrder = (orderId: string, reason: string) => {
    if (!isAuthenticated || !user) {
      return { success: false, message: "Anda harus login terlebih dahulu." };
    }

    const order = orders.find(o => o.id === orderId);
    if (!order) return { success: false, message: "Pesanan tidak ditemukan." };

    if (order.seller_id !== user.id) {
      return { success: false, message: "Anda tidak memiliki akses untuk membatalkan pesanan ini." };
    }

    if (order.status !== 'Packaging') {
      return { success: false, message: `Status "${order.status}" tidak bisa dibatalkan.` };
    }

    setOrders(prev => prev.map(o =>
      o.id === orderId ? { ...o, status: 'Canceled' as OrderStatus, cancel_reason: reason } : o
    ));

    if (useSupabase) {
      supabase
        .from('orders')
        .update({ status: 'Canceled', cancel_reason: reason })
        .eq('id', orderId)
        .eq('seller_id', user.id)
        .then(({ error }) => {
          if (error) console.error('Supabase cancel error:', error);
        });
    }

    updateProductStock(order.id_product, -order.quantity, order.selected_variants);
    return { success: true, message: "Pesanan dibatalkan, stok dikembalikan." };
  };

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