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
  Image as ImageIconAlt
} from 'lucide-react';
import type { Product } from '../types';

export const ProductsPage = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // PAGINATION STATE
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Form State
  const [formData, setFormData] = useState<Partial<Product>>({
    product_name: '',
    product_sku: '',
    category: '',
    brand: '',
    price: 0,
    stocks: 0,
    description: '',
    image_url: ''
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
      setFormData(product);
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
        image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500'
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalData = {
      ...formData,
      id: editingProduct ? editingProduct.id : Date.now().toString(),
      price: Number(formData.price),
      stocks: Number(formData.stocks)
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
    <div className="p-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Inventory</h2>
          <p className="text-gray-500 text-sm font-medium">Total {products.length} produk di database.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80 group">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
            <input 
              type="text"
              placeholder="Cari nama, SKU, atau kategori..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full bg-white border border-gray-100 pl-11 pr-4 py-2.5 rounded-xl text-sm font-medium shadow-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
            />
          </div>

          <button 
            onClick={() => openModal()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-100 active:scale-95 whitespace-nowrap"
          >
            <PlusIcon size={20} /> Tambah Produk
          </button>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-400 text-[10px] uppercase tracking-widest font-black">
                <th className="p-6">Produk</th>
                <th className="p-6">Kategori</th>
                <th className="p-6">Harga</th>
                <th className="p-6">Stok</th>
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
                        </div>
                      </div>
                    </td>
                    <td className="p-6 font-semibold text-gray-500">{product.category}</td>
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

      {/* FULL MODAL FORM */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsModalOpen(false)} />
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-xl font-black text-gray-900">{editingProduct ? 'Edit Produk' : 'Tambah Produk Baru'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition"><XIcon size={20} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* NAMA PRODUK */}
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider flex items-center gap-2">
                    <PackageIcon size={14}/> Nama Produk
                  </label>
                  <input 
                    required 
                    value={formData.product_name} 
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
                    value={formData.product_sku} 
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
                    value={formData.category} 
                    onChange={e => setFormData({...formData, category: e.target.value})} 
                    className="w-full bg-gray-50 border-none rounded-2xl px-5 py-3 focus:ring-2 focus:ring-blue-500 transition outline-none text-sm font-medium" 
                    placeholder="Elektronik, Kopi, dll" 
                  />
                </div>

                {/* HARGA */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider flex items-center gap-2">
                    <MoneyIcon size={14}/> Harga (Rp)
                  </label>
                  <input 
                    required 
                    type="number" 
                    value={formData.price} 
                    onChange={e => setFormData({...formData, price: Number(e.target.value)})} 
                    className="w-full bg-gray-50 border-none rounded-2xl px-5 py-3 focus:ring-2 focus:ring-blue-500 transition outline-none text-sm font-medium" 
                  />
                </div>

                {/* STOK */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider flex items-center gap-2">
                    <BoxIcon size={14}/> Stok Awal
                  </label>
                  <input 
                    required 
                    type="number" 
                    value={formData.stocks} 
                    onChange={e => setFormData({...formData, stocks: Number(e.target.value)})} 
                    className="w-full bg-gray-50 border-none rounded-2xl px-5 py-3 focus:ring-2 focus:ring-blue-500 transition outline-none text-sm font-medium" 
                  />
                </div>

                {/* IMAGE URL */}
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider flex items-center gap-2">
                    <ImageIconAlt size={14}/> Image URL
                  </label>
                  <input 
                    value={formData.image_url} 
                    onChange={e => setFormData({...formData, image_url: e.target.value})} 
                    className="w-full bg-gray-50 border-none rounded-2xl px-5 py-3 focus:ring-2 focus:ring-blue-500 transition outline-none text-sm font-medium" 
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>

                {/* DESKRIPSI */}
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Deskripsi</label>
                  <textarea 
                    rows={3} 
                    value={formData.description} 
                    onChange={e => setFormData({...formData, description: e.target.value})} 
                    className="w-full bg-gray-50 border-none rounded-2xl px-5 py-3 focus:ring-2 focus:ring-blue-500 transition outline-none text-sm font-medium" 
                    placeholder="Ceritakan tentang produk ini..." 
                  />
                </div>
              </div>

              {/* BUTTONS */}
              <div className="mt-8 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="flex-1 bg-gray-100 text-gray-600 font-bold py-4 rounded-2xl hover:bg-gray-200 transition active:scale-95"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="flex-1 bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-100 transition active:scale-95"
                >
                  {editingProduct ? 'Simpan Perubahan' : 'Tambah Produk'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};