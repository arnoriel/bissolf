import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Search as SearchIcon, 
  Plus as PlusIcon, 
  Edit2 as EditIcon, 
  Trash2 as TrashIcon,
  X as XIcon,
  ChevronLeft as LeftIcon,
  ChevronRight as RightIcon,
  Package as PackageIcon,
  Tag as TagIcon,
  Layers as LayersIcon,
  DollarSign as MoneyIcon,
  Box as BoxIcon,
  Image as ImageIconAlt,
  Sliders as SlidersIcon
} from 'lucide-react';
import type { Product, ProductVariant, VariantOption } from '../types';

// Interface lokal untuk form agar sinkron dengan state
interface FormVariant {
  name: string;
  options: VariantOption[];
}

export const ProductsPage = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // PAGINATION STATE
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Form State - Mendukung detail variant option lengkap
  const [formData, setFormData] = useState<Partial<Product> & { variants: FormVariant[] }>({
    product_name: '',
    product_sku: '',
    category: '',
    brand: '',
    price: 0,
    stocks: 0,
    description: '',
    image_url: '',
    variants: []
  });

  // 1. Search Logic
  const filteredProducts = useMemo(() => {
    return products.filter(product => 
      product.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.product_sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  // 2. Pagination Logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); 
  };

  const openModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      // MAPPING LOGIC: Jika option_price 0 atau kosong, tetap di-set 0 (Original)
      const mappedVariants = (product.variants || []).map(v => ({
        name: v.name,
        options: v.options.map(opt => 
          typeof opt === 'string' 
            ? { name: opt, image: undefined, stock: 0, option_price: 0 } 
            : { 
                name: opt.name, 
                image: opt.image, 
                stock: opt.stock || 0, 
                option_price: opt.option_price || 0 
              }
        )
      }));
      setFormData({
        ...product,
        variants: mappedVariants
      });
    } else {
      setEditingProduct(null);
      setFormData({
        product_name: '',
        product_sku: `SKU-${Math.floor(Math.random() * 10000)}`,
        category: '',
        brand: '',
        price: 0,
        stocks: 0,
        description: '',
        image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
        variants: []
      });
    }
    setIsModalOpen(true);
  };

  // ────────────────────────────────────────────────
  // Logic CRUD Variant di dalam Form
  // ────────────────────────────────────────────────

  const addVariantField = () => {
    setFormData(prev => ({
      ...prev,
      variants: [...(prev.variants || []), { name: '', options: [] }]
    }));
  };

  const removeVariantField = (index: number) => {
    const newVariants = [...(formData.variants || [])];
    newVariants.splice(index, 1);
    setFormData({ ...formData, variants: newVariants });
  };

  const updateVariantName = (index: number, name: string) => {
    const newVariants = [...(formData.variants || [])];
    newVariants[index].name = name;
    setFormData({ ...formData, variants: newVariants });
  };

  const addOptionToVariant = (variantIndex: number) => {
    const newVariants = [...(formData.variants || [])];
    newVariants[variantIndex].options.push({ 
      name: '', 
      image: undefined, 
      stock: 0, 
      option_price: 0 // Default ke 0 (Original)
    });
    setFormData({ ...formData, variants: newVariants });
  };

  const updateOptionName = (variantIndex: number, optionIndex: number, name: string) => {
    const newVariants = [...(formData.variants || [])];
    newVariants[variantIndex].options[optionIndex].name = name;
    setFormData({ ...formData, variants: newVariants });
  };

  const updateOptionImage = (variantIndex: number, optionIndex: number, imageUrl: string) => {
    const newVariants = [...(formData.variants || [])];
    newVariants[variantIndex].options[optionIndex].image = imageUrl || undefined;
    setFormData({ ...formData, variants: newVariants });
  };

  const updateOptionStock = (variantIndex: number, optionIndex: number, stock: string) => {
    const newVariants = [...(formData.variants || [])];
    newVariants[variantIndex].options[optionIndex].stock = Number(stock);
    setFormData({ ...formData, variants: newVariants });
  };

  const updateOptionPrice = (variantIndex: number, optionIndex: number, price: string) => {
    const newVariants = [...(formData.variants || [])];
    newVariants[variantIndex].options[optionIndex].option_price = Number(price);
    setFormData({ ...formData, variants: newVariants });
  };

  const removeOptionFromVariant = (variantIndex: number, optionIndex: number) => {
    const newVariants = [...(formData.variants || [])];
    newVariants[variantIndex].options.splice(optionIndex, 1);
    setFormData({ ...formData, variants: newVariants });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const cleanedVariants: ProductVariant[] = (formData.variants || [])
      .filter(v => v.name.trim() !== '')
      .map(v => ({
        name: v.name.trim(),
        options: v.options.filter(o => o.name.trim() !== '')
      }));

    const finalData = {
      ...formData,
      id: editingProduct ? editingProduct.id : crypto.randomUUID(),
      price: Number(formData.price),
      stocks: Number(formData.stocks),
      variants: cleanedVariants.length > 0 ? cleanedVariants : undefined,
    } as Product;

    if (editingProduct) {
      updateProduct(finalData);
    } else {
      addProduct(finalData);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      deleteProduct(id);
    }
  };

  return (
    <div className="p-4 md:p-6 bg-[#fcfcfd] min-h-screen">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6 md:mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Inventory</h2>
          <p className="text-gray-500 text-sm font-medium mt-1">Total {products.length} produk di database.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-80 group">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
            <input 
              type="text"
              placeholder="Cari nama, SKU, atau kategori..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full bg-white border border-gray-100 pl-11 pr-4 py-3 md:py-2.5 rounded-xl text-sm font-medium shadow-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
            />
          </div>

          <button 
            onClick={() => openModal()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 md:py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-100 active:scale-95 whitespace-nowrap text-sm"
          >
            <PlusIcon size={20} /> <span className="hidden sm:inline">Tambah Produk</span><span className="inline sm:hidden">Tambah</span>
          </button>
        </div>
      </div>

      {/* MOBILE VIEW: CARD LIST */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {paginatedProducts.length > 0 ? (
          paginatedProducts.map(product => (
            <div key={product.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4">
              <div className="w-20 h-20 bg-gray-100 rounded-xl shrink-0 overflow-hidden border border-gray-100">
                <img src={product.image_url} alt="" className="w-full h-full object-cover"/>
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-gray-900 text-sm truncate">{product.product_name}</h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">{product.product_sku}</p>
                  <div className="flex flex-wrap gap-1">
                      <span className="text-[9px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-bold uppercase">{product.category}</span>
                      {product.variants?.map((v, i) => (
                        <span key={i} className="text-[9px] bg-purple-50 text-purple-600 px-1.5 py-0.5 rounded font-bold uppercase">
                           {v.name} ({v.options.length})
                        </span>
                      ))}
                  </div>
                </div>
                <div className="flex items-end justify-between mt-2">
                   <div>
                      <p className="text-xs font-black text-gray-900">Rp {product.price.toLocaleString()}</p>
                      <p className={`text-[9px] font-bold ${product.stocks < 5 ? 'text-red-500' : 'text-green-500'}`}>Global Stok: {product.stocks}</p>
                   </div>
                   <div className="flex gap-1">
                      <button onClick={() => openModal(product)} className="p-2 bg-gray-50 text-blue-600 rounded-lg"><EditIcon size={14}/></button>
                      <button onClick={() => handleDelete(product.id)} className="p-2 bg-gray-50 text-red-600 rounded-lg"><TrashIcon size={14}/></button>
                   </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center p-8 text-gray-400 text-sm font-bold bg-white rounded-2xl border border-dashed border-gray-200">
            Tidak ada produk ditemukan.
          </div>
        )}
      </div>

      {/* DESKTOP VIEW: TABLE */}
      <div className="hidden md:block bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-400 text-[10px] uppercase tracking-widest font-black">
                <th className="p-6">Produk</th>
                <th className="p-6">Varian & Stok Detail</th>
                <th className="p-6">Harga Dasar</th>
                <th className="p-6">Stok Total</th>
                <th className="p-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {paginatedProducts.length > 0 ? (
                paginatedProducts.map(product => (
                  <tr key={product.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <img src={product.image_url} className="w-12 h-12 rounded-2xl object-cover bg-gray-100 shadow-sm" alt="" />
                        <div>
                          <p className="font-bold text-gray-900">{product.product_name}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">{product.product_sku}</p>
                          <span className="text-[9px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded border border-gray-200 font-medium inline-block mt-1">
                             {product.category}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      {product.variants && product.variants.length > 0 ? (
                        <div className="flex flex-col gap-2">
                          {product.variants.map((v, i) => (
                            <div key={i} className="flex flex-col gap-1">
                              <span className="text-[10px] font-bold text-gray-400 uppercase">{v.name}:</span>
                              <div className="flex flex-wrap gap-1">
                                {v.options.map((opt, optIdx) => (
                                  <span key={optIdx} className="text-[10px] bg-white border border-gray-200 text-gray-600 px-2 py-0.5 rounded-md shadow-sm">
                                    {opt.name} 
                                    <span className={`font-black ml-1 ${ (opt.stock || 0) <= 0 ? 'text-red-500' : 'text-blue-600' }`}>({opt.stock || 0})</span>
                                    {/* Jika option_price ada dan bukan 0, tampilkan harga khusus */}
                                    {opt.option_price && opt.option_price > 0 && (
                                      <span className="ml-1 text-orange-600 font-bold">@ Rp{opt.option_price.toLocaleString()}</span>
                                    )}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs italic">- Tidak ada varian -</span>
                      )}
                    </td>
                    <td className="p-6 font-black text-gray-900">Rp {product.price.toLocaleString()}</td>
                    <td className="p-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${product.stocks < 5 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                        {product.stocks} Unit
                      </span>
                    </td>
                    <td className="p-6">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openModal(product)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition"><EditIcon size={18} /></button>
                        <button onClick={() => handleDelete(product.id)} className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition"><TrashIcon size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <PackageIcon size={40} className="text-gray-200" />
                      <p className="text-gray-400 font-bold tracking-tight">Produk tidak ditemukan...</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION FOOTER */}
        <div className="p-6 border-t border-gray-50 flex items-center justify-between bg-gray-50/30">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
            Halaman {currentPage} dari {totalPages || 1}
          </p>
          <div className="flex gap-2">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="p-2 bg-white border border-gray-200 rounded-xl disabled:opacity-30 hover:bg-gray-100 transition shadow-sm"
            >
              <LeftIcon size={18} />
            </button>
            <button 
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="p-2 bg-white border border-gray-200 rounded-xl disabled:opacity-30 hover:bg-gray-100 transition shadow-sm"
            >
              <RightIcon size={18} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Pagination */}
      <div className="md:hidden mt-4 flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
         <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="text-sm font-bold text-gray-600 disabled:opacity-50">Previous</button>
         <span className="text-xs text-gray-400 font-medium">Page {currentPage} of {totalPages}</span>
         <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="text-sm font-bold text-gray-600 disabled:opacity-50">Next</button>
      </div>

      {/* FULL MODAL FORM */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsModalOpen(false)} />
          <div className="bg-white w-full max-w-3xl rounded-t-[2rem] sm:rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden animate-in slide-in-from-bottom-10 sm:zoom-in-95 duration-300 flex flex-col max-h-[95vh]">
            
            <div className="p-6 md:p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 shrink-0">
              <h3 className="text-lg md:text-xl font-black text-gray-900">{editingProduct ? 'Edit Produk' : 'Tambah Produk'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition"><XIcon size={20} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {/* NAMA PRODUK */}
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider flex items-center gap-2">
                    <PackageIcon size={14}/> Nama Produk
                  </label>
                  <input 
                    required 
                    value={formData.product_name || ''} 
                    onChange={e => setFormData({...formData, product_name: e.target.value})} 
                    className="w-full bg-gray-50 border-none rounded-2xl px-5 py-3 focus:ring-2 focus:ring-blue-500 transition outline-none text-sm font-medium" 
                    placeholder="Contoh: Kopi Gayo Premium" 
                  />
                </div>
                
                {/* SKU */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider flex items-center gap-2">
                    <TagIcon size={14}/> SKU
                  </label>
                  <input 
                    required 
                    value={formData.product_sku || ''} 
                    onChange={e => setFormData({...formData, product_sku: e.target.value})} 
                    className="w-full bg-gray-50 border-none rounded-2xl px-5 py-3 focus:ring-2 focus:ring-blue-500 transition outline-none text-sm font-medium" 
                  />
                </div>

                {/* KATEGORI */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider flex items-center gap-2">
                    <LayersIcon size={14}/> Kategori
                  </label>
                  <input 
                    required 
                    value={formData.category || ''} 
                    onChange={e => setFormData({...formData, category: e.target.value})} 
                    className="w-full bg-gray-50 border-none rounded-2xl px-5 py-3 focus:ring-2 focus:ring-blue-500 transition outline-none text-sm font-medium" 
                    placeholder="Elektronik, Kopi, dll" 
                  />
                </div>

                {/* HARGA DASAR */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider flex items-center gap-2">
                    <MoneyIcon size={14}/> Harga Dasar (Rp)
                  </label>
                  <input 
                    required 
                    type="number" 
                    value={formData.price ?? 0} 
                    onChange={e => setFormData({...formData, price: Number(e.target.value)})} 
                    className="w-full bg-gray-50 border-none rounded-2xl px-5 py-3 focus:ring-2 focus:ring-blue-500 transition outline-none text-sm font-medium" 
                  />
                </div>

                {/* STOK TOTAL */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider flex items-center gap-2">
                    <BoxIcon size={14}/> Stok Total (Global)
                  </label>
                  <input 
                    required 
                    type="number" 
                    value={formData.stocks ?? 0} 
                    onChange={e => setFormData({...formData, stocks: Number(e.target.value)})} 
                    className="w-full bg-gray-50 border-none rounded-2xl px-5 py-3 focus:ring-2 focus:ring-blue-500 transition outline-none text-sm font-medium" 
                  />
                </div>

                {/* IMAGE URL */}
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider flex items-center gap-2">
                    <ImageIconAlt size={14}/> Image URL (Produk Utama)
                  </label>
                  <input 
                    value={formData.image_url || ''} 
                    onChange={e => setFormData({...formData, image_url: e.target.value})} 
                    className="w-full bg-gray-50 border-none rounded-2xl px-5 py-3 focus:ring-2 focus:ring-blue-500 transition outline-none text-sm font-medium" 
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>

                {/* VARIANT SECTION */}
                <div className="md:col-span-2 space-y-5 pt-6 border-t border-dashed border-gray-200">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider flex items-center gap-2">
                      <SlidersIcon size={14}/> Varian Produk
                    </label>
                    <button 
                      type="button" 
                      onClick={addVariantField}
                      className="text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg font-bold hover:bg-blue-100 transition flex items-center gap-1"
                    >
                      <PlusIcon size={14} /> <span className="hidden sm:inline">Tambah Varian</span><span className="sm:hidden">Add</span>
                    </button>
                  </div>
                  
                  {(formData.variants || []).length === 0 && (
                    <div className="text-center py-6 md:py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                      <p className="text-xs md:text-sm text-gray-400">Belum ada varian (contoh: Warna, Ukuran)</p>
                    </div>
                  )}

                  {(formData.variants || []).map((variant, vIndex) => (
                    <div key={vIndex} className="bg-gray-50 p-3 md:p-4 rounded-2xl border border-gray-200 relative group">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-3">
                        <input 
                          placeholder="Nama Varian (Mis: Ukuran)" 
                          value={variant.name}
                          onChange={(e) => updateVariantName(vIndex, e.target.value)}
                          className="w-full sm:flex-1 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        <div className="flex gap-2 w-full sm:w-auto">
                            <button 
                              type="button"
                              onClick={() => addOptionToVariant(vIndex)}
                              className="flex-1 sm:flex-none bg-blue-100 text-blue-700 px-3 py-2 rounded-xl text-xs font-bold hover:bg-blue-200 transition whitespace-nowrap"
                            >
                              + Opsi
                            </button>
                            <button 
                              type="button" 
                              onClick={() => removeVariantField(vIndex)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition border border-red-100 bg-white"
                            >
                              <TrashIcon size={16} />
                            </button>
                        </div>
                      </div>

                      {/* List Opsi + Stok + option_price + Gambar */}
                      <div className="space-y-2 pl-0 sm:pl-4 sm:border-l-2 sm:border-gray-200 sm:ml-2">
                        {variant.options.length > 0 && (
                            <div className="hidden sm:flex gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-wider px-2">
                              <span className="flex-1">Nama Opsi</span>
                              <span className="w-24">Harga (Rp)</span>
                              <span className="w-16">Stok</span>
                              <span className="w-32">URL Gambar</span>
                              <span className="w-8"></span>
                            </div>
                        )}

                        {variant.options.map((option, oIndex) => (
                          <div key={oIndex} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-white p-2 rounded-xl border border-gray-200">
                            {/* Input Nama Opsi */}
                            <input 
                              placeholder="Nama (Mis: XL)" 
                              value={option.name}
                              onChange={(e) => updateOptionName(vIndex, oIndex, e.target.value)}
                              className="flex-1 px-3 py-2 text-sm border-none bg-gray-50 sm:bg-transparent rounded-lg focus:ring-1 focus:ring-blue-400 outline-none font-medium"
                            />
                            
                            <div className="flex flex-wrap sm:flex-nowrap gap-2 w-full sm:w-auto">
                                {/* INPUT HARGA: Jika 0, tampilkan string kosong agar placeholder terlihat */}
                                <div className="relative flex-1 sm:w-25">
                                  <input 
                                    type="number"
                                    placeholder="0 (Original)" 
                                    value={option.option_price === 0 ? '' : option.option_price}
                                    onChange={(e) => updateOptionPrice(vIndex, oIndex, e.target.value)}
                                    title="Kosongkan untuk harga variant original"
                                    className="w-full pl-6 pr-2 py-2 text-[11px] bg-gray-50 border border-gray-100 rounded-lg focus:ring-1 focus:ring-blue-400 outline-none font-bold"
                                  />
                                  <span className="absolute left-1.5 top-1/2 -translate-y-1/2 text-[9px] text-gray-400 font-bold">Rp</span>
                                </div>

                                {/* Input Stok Opsi */}
                                <div className="relative w-16">
                                  <input 
                                    type="number"
                                    placeholder="Stok" 
                                    value={option.stock ?? 0}
                                    onChange={(e) => updateOptionStock(vIndex, oIndex, e.target.value)}
                                    className="w-full px-2 py-2 text-[11px] text-center bg-gray-50 border border-gray-100 rounded-lg focus:ring-1 focus:ring-blue-400 outline-none"
                                  />
                                </div>

                                {/* Input URL Gambar */}
                                <input 
                                  placeholder="URL Gambar" 
                                  value={option.image || ''}
                                  onChange={(e) => updateOptionImage(vIndex, oIndex, e.target.value)}
                                  className="flex-1 sm:w-32 px-3 py-2 text-[10px] bg-gray-50 border border-gray-100 rounded-lg focus:ring-1 focus:ring-blue-400 outline-none"
                                />

                                <button 
                                  type="button"
                                  onClick={() => removeOptionFromVariant(vIndex, oIndex)}
                                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition shrink-0"
                                >
                                <TrashIcon size={14} />
                                </button>
                            </div>
                          </div>
                        ))}
                        {variant.options.length === 0 && (
                          <p className="text-xs text-gray-400 italic pl-2">Klik "+ Opsi" untuk menambah pilihan.</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="mt-8 flex gap-3">
                <button 
                  type="submit" 
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-lg shadow-blue-100 transition active:scale-[0.98]"
                >
                  {editingProduct ? 'Simpan Perubahan' : 'Tambah Produk Baru'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
