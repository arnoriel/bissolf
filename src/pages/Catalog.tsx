import { useState, useMemo, useEffect } from 'react';
import { 
  Search, ArrowLeft, 
  Star, ShoppingCart, X, ZapOff, Flame, Layers, 
  Sparkles, TrendingUp
} from 'lucide-react';
import type { Product, Order } from '../types';
import { getImageUrl } from '../lib/supabase';


interface CatalogProps {
  products: Product[];
  orders: Order[];
  onBack: () => void;
  onOrder: (product: Product & { selectedVariant?: string }) => void;
}

export const Catalog = ({ products, orders, onBack, onOrder }: CatalogProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  
  const [currentBanner, setCurrentBanner] = useState(0);

  const banners = [
    {
      title: "WELCOMERS",
      subtitle: "GET CURATED AND GREAT PRODUCTS",
      desc: "Koleksi pilihan untuk gaya hidup maksimal.",
      bg: "bg-blue-600",
      accent: "bg-blue-400",
      image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80"
    },
    {
      title: "TECH SERIES 2026",
      subtitle: "NEW ARRIVAL",
      desc: "Gadget masa depan kini tersedia di katalog kami.",
      bg: "bg-gray-900",
      accent: "bg-indigo-600",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80"
    },
    {
      title: "EXCLUSIVE",
      subtitle: "MEMBER ONLY",
      desc: "Dapatkan akses awal untuk produk terbatas.",
      bg: "bg-purple-900",
      accent: "bg-purple-500",
      image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const topPicks = useMemo(() => {
    const orderCounts = orders.reduce((acc, order) => {
      acc[order.id_product] = (acc[order.id_product] || 0) + order.quantity;
      return acc;
    }, {} as Record<string, number>);

    return [...products]
      .sort((a, b) => {
        const countA = orderCounts[a.id] || 0;
        const countB = orderCounts[b.id] || 0;
        if (countB === countA) return b.price - a.price;
        return countB - countA;
      })
      .slice(0, 4);
  }, [products, orders]);

  const groupedProducts = useMemo(() => {
    const filtered = products.filter(p => 
      p.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return filtered.reduce((acc, product) => {
      if (!acc[product.category]) acc[product.category] = [];
      acc[product.category].push(product);
      return acc;
    }, {} as Record<string, Product[]>);
  }, [products, searchQuery]);

  const handleOpenProduct = (product: Product) => {
    setSelectedProduct(product);
    setSelectedVariants({});
  };

  const handleCheckout = () => {
    if (!selectedProduct) return;

    const variantEntries = Object.entries(selectedVariants);
    const variantString = variantEntries.length > 0 
      ? variantEntries.map(([key, val]) => `${key} ${val}`).join(', ')
      : '';

    onOrder({ 
      ...selectedProduct, 
      selectedVariant: variantString 
    });
    
    setSelectedProduct(null);
  };

  return (
    <div className="animate-in slide-in-from-right-10 duration-700 bg-[#f8f9fb] min-h-screen">
      <section className="py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-3 md:px-8">
          
          {/* PREMIUM HEADER & SEARCH */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 md:gap-10 mb-10 md:mb-16">
            <div className="max-w-2xl w-full">
              <button 
                onClick={onBack} 
                className="group flex items-center gap-3 text-blue-600 font-black text-[9px] md:text-[10px] uppercase tracking-[0.3em] mb-6 md:mb-8 hover:bg-blue-50 w-fit px-4 py-2 rounded-full transition-all"
              >
                <ArrowLeft size={14} className="group-hover:-translate-x-2 transition-transform" /> Kembali
              </button>
              <h2 className="text-3xl md:text-7xl font-black text-gray-900 mb-3 md:mb-4 tracking-tighter leading-none uppercase">
                Vault <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Collection</span>
              </h2>
              <p className="text-gray-400 text-sm md:text-xl font-medium italic">Eksplorasi kurasi produk terbaik di Bissolf.</p>
            </div>
            
            <div className="relative w-full lg:w-[500px] group">
              <div className="absolute left-5 md:left-7 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors">
                <Search size={20} className="md:w-[26px] md:h-[26px]" />
              </div>
              <input 
                type="text" 
                placeholder="Cari koleksi eksklusif..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border-none pl-12 md:pl-16 pr-8 py-4 md:py-7 rounded-xl md:rounded-[2.5rem] outline-none focus:ring-[8px] md:focus:ring-[15px] focus:ring-blue-500/5 transition-all font-bold shadow-[0_10px_30px_rgba(0,0,0,0.02)] text-gray-900 placeholder:text-gray-300 text-xs md:text-base"
              />
            </div>
          </div>


          {/* BANNER CAROUSEL */}
          <div className="relative mb-12 md:mb-24 overflow-hidden rounded-2xl md:rounded-[4rem] shadow-2xl group h-[280px] md:h-[450px]">
            <div className="flex h-full transition-transform duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)]" style={{ transform: `translateX(-${currentBanner * 100}%)` }}>
              {banners.map((banner, index) => (
                <div key={index} className="min-w-full h-full relative flex-shrink-0">
                  <div className={`absolute inset-0 ${banner.bg}`}>
                    <img src={banner.image} className="w-full h-full object-cover opacity-40 mix-blend-overlay" alt="" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  </div>
                  <div className="relative h-full flex flex-col justify-end p-6 md:p-16 text-white">
                    <div className={`${banner.accent} inline-block px-3 md:px-5 py-1 md:py-1.5 rounded-full mb-3 md:mb-6 w-fit`}>
                      <span className="text-[8px] md:text-[11px] font-black tracking-[0.2em] md:tracking-[0.4em] uppercase">{banner.subtitle}</span>
                    </div>
                    <h3 className="text-3xl md:text-8xl font-black tracking-tighter mb-2 md:mb-4 leading-none">{banner.title}</h3>
                    <p className="text-white/70 text-xs md:text-2xl font-medium max-w-xl mb-2 md:mb-8 line-clamp-2 md:line-clamp-none">{banner.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="absolute bottom-4 md:bottom-10 right-6 md:right-16 flex gap-2">
              {banners.map((_, i) => (
                <button key={i} onClick={() => setCurrentBanner(i)} className={`h-1 md:h-1.5 transition-all duration-500 rounded-full ${i === currentBanner ? 'w-6 md:w-12 bg-white' : 'w-2 md:w-4 bg-white/30'}`} />
              ))}
            </div>
          </div>

          {/* TOP PICKS SECTION */}
          {!searchQuery && (
            <div className="mb-12 md:mb-24">
              <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-10 px-1">
                <div className="bg-orange-100 p-2 md:p-3 rounded-xl md:rounded-2xl text-orange-600">
                  <Flame size={20} className="md:w-[28px] md:h-[28px]" fill="currentColor" />
                </div>
                <div>
                  <h3 className="text-lg md:text-3xl font-black text-gray-900 tracking-tighter uppercase">Top Picks</h3>
                  <p className="text-gray-400 text-[8px] md:text-sm font-bold uppercase tracking-widest">Trending Choice</p>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8">
                {topPicks.map(product => (
                  <ProductCard key={product.id} product={product} onClick={() => handleOpenProduct(product)} isTopPick />
                ))}
              </div>
            </div>
          )}

          <div className="mb-10">
            <h3 className="text-lg md:text-3xl font-black text-gray-900 tracking-tighter uppercase">All Items</h3>
            <p className="text-gray-400 text-[8px] md:text-sm font-bold uppercase tracking-widest">Temukan produk yang sesuai untukmu</p>
          </div>

          {/* MAIN CATALOG */}
          {Object.keys(groupedProducts).length > 0 ? (
            <div className="space-y-12 md:space-y-24">
              {Object.entries(groupedProducts).map(([category, items]) => (
                <div key={category} className="animate-in fade-in slide-in-from-bottom-10 px-1">
                  <div className="flex items-center justify-between mb-6 md:mb-10 border-b border-gray-200 pb-4 md:pb-6">
                    <div className="flex items-center gap-2 md:gap-4">
                      <div className="bg-blue-600 p-1.5 md:p-2.5 rounded-lg md:rounded-xl text-white">
                        <Layers size={16} className="md:w-[20px] md:h-[20px]" />
                      </div>
                      <h3 className="text-base md:text-3xl font-black text-gray-900 tracking-tighter uppercase">{category}</h3>
                    </div>
                    <span className="text-[8px] md:text-xs font-black text-gray-400 uppercase tracking-widest">{items.length} Items</span>
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-10">
                    {items.map(product => (
                      <ProductCard key={product.id} product={product} onClick={() => handleOpenProduct(product)} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 md:py-40 text-center bg-white rounded-3xl md:rounded-[5rem] shadow-xl border border-gray-100 px-6">
              <ZapOff size={40} className="md:w-[64px] md:h-[64px] mx-auto mb-6 text-gray-100" />
              <h3 className="text-xl md:text-4xl font-black text-gray-900 mb-2 md:mb-4">No results.</h3>
              <p className="text-gray-400 mb-8 text-xs md:text-base">Gunakan kata kunci lain atau bersihkan filter.</p>
              <button onClick={() => setSearchQuery('')} className="bg-gray-900 text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest hover:bg-blue-600 transition-all text-[10px] md:text-base">Clear Filter</button>
            </div>
          )}
        </div>
      </section>

      {/* DETAIL MODAL - Diperbaiki: no empty space atas, close button di luar & kanan atas */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[200] bg-gray-950/90 backdrop-blur-2xl flex items-end md:items-center justify-center overflow-hidden">
          {/* Tombol close DIPINDAH KE LUAR MODAL, kanan atas */}
          <button 
            onClick={() => setSelectedProduct(null)} 
            className="absolute top-4 right-4 md:top-6 md:right-6 z-[210] bg-white/90 backdrop-blur-md p-3 md:p-4 rounded-full shadow-lg hover:bg-red-50 hover:text-red-600 transition-all"
          >
            <X size={20} className="md:w-[28px] md:h-[28px]" />
          </button>

          <div 
            className="
              bg-white w-full max-w-7xl 
              h-[94vh] md:h-[90vh] lg:h-[88vh]
              rounded-t-[2.5rem] md:rounded-[3.5rem] lg:rounded-[4rem] 
              overflow-y-auto 
              relative z-10 
              animate-in slide-in-from-bottom md:zoom-in-95 duration-500 
              custom-scrollbar
              pt-0 md:pt-0
            "
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 min-h-full">
              {/* Image Section - langsung dari atas, no padding atas */}
              <div className="relative h-[40vh] sm:h-[50vh] lg:h-full overflow-hidden group order-1 lg:order-1">
                <img 
                  src={
                    selectedProduct.image
                      ? getImageUrl(selectedProduct.image)
                      : '/placeholder.png'
                  }
                  className="w-full h-full object-cover" 
                  alt={selectedProduct.product_name} 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-6 md:p-12 lg:p-16">
                  <div className="flex items-center gap-2 md:gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
                    <Sparkles className="text-yellow-400" size={14} />
                    <span className="text-white text-[9px] md:text-[10px] font-black uppercase tracking-widest">Premium Quality</span>
                  </div>
                </div>
              </div>
              
              {/* Detail Content */}
              <div className="p-6 sm:p-8 md:p-10 lg:p-12 xl:p-16 flex flex-col order-2 lg:order-2">
                <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
                  <span className="bg-blue-50 text-blue-600 text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] px-3 md:px-5 py-1.5 md:py-2 rounded-full border border-blue-100">
                    {selectedProduct.category}
                  </span>
                  <div className="flex gap-1 text-yellow-400">
                    <Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" />
                    <Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" />
                    <Star size={14} fill="currentColor" />
                  </div>
                </div>

                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-5 md:mb-8 leading-tight tracking-tighter uppercase text-gray-900">
                  {selectedProduct.product_name}
                </h2>

                <p className="text-gray-500 mb-6 md:mb-10 text-base md:text-lg lg:text-xl font-medium leading-relaxed italic border-l-4 md:border-l-[6px] border-blue-600 pl-4 md:pl-6 lg:pl-10">
                  "{selectedProduct.description}"
                </p>
                
                <div className="grid grid-cols-2 gap-4 md:gap-6 mb-8 md:mb-10">
                  <div className="p-4 md:p-6 lg:p-8 bg-gray-50 rounded-2xl md:rounded-[2rem] border border-gray-100">
                    <p className="text-[9px] md:text-[10px] lg:text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1 md:mb-2">Availability</p>
                    <p className="text-lg md:text-2xl lg:text-3xl font-black text-gray-900">
                      {selectedProduct.stocks} <span className="text-sm md:text-base lg:text-lg text-gray-400 font-bold">Units</span>
                    </p>
                  </div>
                  <div className="p-4 md:p-6 lg:p-8 bg-gray-900 text-white rounded-2xl md:rounded-[2rem] shadow-xl">
                    <p className="text-[9px] md:text-[10px] lg:text-[11px] font-black text-blue-400 uppercase tracking-widest mb-1 md:mb-2">Price</p>
                    <p className="text-lg md:text-2xl lg:text-3xl font-black">Rp {selectedProduct.price.toLocaleString()}</p>
                  </div>
                </div>

                {/* Available Variants */}
                {selectedProduct.variants && selectedProduct.variants.length > 0 && (
                  <div className="mb-10 md:mb-12 lg:mb-14 space-y-5 md:space-y-6 lg:space-y-8">
                    <div className="flex items-center gap-3">
                      <div className="h-px bg-gray-200 flex-1"></div>
                      <span className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Available Variants</span>
                      <div className="h-px bg-gray-200 flex-1"></div>
                    </div>

                    {selectedProduct.variants.map((variant, index) => (
                      <div key={index} className="space-y-3 md:space-y-4">
                        <h4 className="text-xs md:text-sm lg:text-base font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
                          {variant.name}
                        </h4>
                        
                        <div className="flex flex-wrap gap-3 md:gap-4">
                          {variant.options.map((option, optIndex) => {
                            const isObject = typeof option !== 'string';
                            const hasImage = isObject && option.image;
                            const optionName = isObject ? option.name : option;
                            const priceAddon = isObject ? (option.option_price || 0) : 0;

                            return (
                              <div
                                key={optIndex}
                                className={`flex flex-col items-center gap-1.5 md:gap-2 px-3 md:px-4 py-3 md:py-4 rounded-xl md:rounded-2xl transition-all duration-300 border cursor-default
                                  ${hasImage 
                                    ? 'bg-white border-gray-200 shadow-sm hover:shadow-md' 
                                    : 'bg-white text-gray-400 border-gray-100'}`}
                              >
                                {hasImage && (
                                  <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-lg md:rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                                    <img 
                                      src={
                                        option.image
                                          ? getImageUrl(option.image)
                                          : undefined
                                      }
                                      alt={optionName}
                                      className="w-full h-full object-cover"
                                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                    />
                                  </div>
                                )}
                                
                                <div className="flex flex-col items-center">
                                  <span className={`text-[9px] md:text-xs font-bold uppercase tracking-widest text-center
                                    ${hasImage ? 'text-gray-800' : 'text-gray-500'}`}>
                                    {optionName}
                                  </span>
                                  
                                  {/* LOGIK BARU: Tampilkan harga jika > 0 */}
                                  {priceAddon > 0 && (
                                    <span className="text-[8px] md:text-[10px] font-black text-blue-600 mt-0.5">
                                      + Rp {priceAddon.toLocaleString()}
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Checkout Button */}
                <div className="mt-8 md:mt-auto pb-6 md:pb-8 sticky bottom-0 left-0 right-0 bg-white pt-4 md:pt-6 z-20 border-t md:border-none">
                  <button 
                    onClick={handleCheckout}
                    className="group relative bg-blue-600 text-white w-full py-5 md:py-7 lg:py-9 rounded-2xl md:rounded-[3rem] font-black text-lg md:text-xl lg:text-2xl flex items-center justify-center gap-3 md:gap-5 hover:bg-black transition-all shadow-[0_20px_40px_-10px_rgba(59,130,246,0.5)] active:scale-95 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
                    <ShoppingCart size={22} className="md:w-[28px] md:h-[28px]" /> CHECKOUT NOW
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ProductCard component tetap sama
const ProductCard = ({ product, onClick, isTopPick }: { product: Product, onClick: () => void, isTopPick?: boolean }) => (
  <div 
    key={product.id} 
    className={`group relative bg-white rounded-2xl md:rounded-[3.5rem] p-3 md:p-5 border transition-all duration-700 cursor-pointer overflow-hidden
      ${isTopPick 
        ? 'border-blue-100 shadow-[0_15px_30px_rgba(59,130,246,0.06)] ring-1 ring-blue-50/50' 
        : 'border-gray-50 hover:border-blue-500 hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)]'}`}
    onClick={onClick}
  >
    <div className="relative overflow-hidden rounded-[1.2rem] md:rounded-[2.8rem] h-[180px] md:h-[340px] mb-4 md:mb-8">
      <img 
        src={
          product.image
            ? getImageUrl(product.image)
            : '/placeholder.png'
        }
        alt={product.product_name} 
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s] ease-out" 
      />
      
      {isTopPick && (
        <div className="absolute top-3 left-3 md:top-6 md:left-6 bg-gray-900/80 backdrop-blur-xl text-white px-2 md:px-5 py-1 md:py-2 rounded-lg md:rounded-2xl flex items-center gap-1.5 border border-white/10">
          <TrendingUp size={10} className="text-blue-400 md:w-[14px] md:h-[14px]" />
          <span className="text-[7px] md:text-[10px] font-black uppercase tracking-widest">Hot</span>
        </div>
      )}

      <div className="absolute top-3 right-3 md:top-6 md:right-6 bg-white/90 backdrop-blur-md p-2 md:p-3.5 rounded-lg md:rounded-2xl shadow-xl">
        <Star size={12} className="fill-yellow-400 text-yellow-400 md:w-[16px] md:h-[16px]" />
      </div>
      
      <div className="hidden md:flex absolute inset-0 bg-gradient-to-t from-blue-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 items-end p-10">
        <button className="w-full bg-white text-gray-900 py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
          View Details
        </button>
      </div>
    </div>
    
    <div className="px-1 md:px-4">
      <div className="flex justify-between items-center mb-2 md:mb-4">
        <span className="bg-gray-50 text-gray-400 text-[7px] md:text-[9px] font-black uppercase tracking-[0.1em] md:tracking-[0.2em] px-2 md:px-4 py-1 md:py-1.5 rounded-full group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
          {product.category}
        </span>
      </div>
      <h3 className="font-black text-sm md:text-2xl mb-3 md:mb-6 text-gray-900 group-hover:text-blue-600 transition-colors truncate tracking-tighter leading-tight">
        {product.product_name}
      </h3>
      
      <div className="flex justify-between items-center border-t border-gray-100 pt-3 md:pt-7">
        <div>
          <p className="text-[7px] md:text-[10px] font-black text-gray-300 uppercase tracking-widest mb-0.5">Price</p>
          <p className="text-sm md:text-2xl font-black text-gray-900 tracking-tight">Rp {product.price.toLocaleString()}</p>
        </div>
        <div className="w-8 h-8 md:w-14 md:h-14 rounded-lg md:rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
          <PlusIconCustom size={16} className="md:w-[24px] md:h-[24px]" />
        </div>
      </div>
    </div>
  </div>
);

const PlusIconCustom = ({ size, className }: { size: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);
