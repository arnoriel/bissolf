import { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { getAIResponse } from '../lib/ai';
import { Sparkles, BarChart3, TrendingUp, Lightbulb, Activity, Printer } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export const AnalyzerPage = () => {
  const { orders, products } = useStore();
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const startAnalysis = async () => {
    setLoading(true);
    const dataContext = `
      Data Penjualan BISSOLF:
      Total Orders: ${orders.length}
      Detail Orders: ${JSON.stringify(orders.map(o => ({ item: o.product_name, qty: o.quantity, total: o.total_price, date: o.created_at })))}
      Current Stock Status: ${JSON.stringify(products.map(p => ({ item: p.product_name, stock: p.stocks })))}
    `;

    const prompt = `
      Sebagai Business Analyst AI Senior, tolong analisis data performa bisnis BISSOLF berikut.
      
      Berikan laporan lengkap dengan struktur Markdown berikut:
      # 📊 Laporan Analisis Performa Bisnis BISSOLF
      
      ## 1. 🚀 Ringkasan Performa
      (Jelaskan performa penjualan secara keseluruhan)
      
      ## 2. 🏆 Analisis Produk
      - **Produk Terlaris:** (Sebutkan produk)
      - **Produk Perlu Perhatian:** (Sebutkan produk dengan stok mengendap)
      
      ## 3. 📉 Trend & Statistik
      (Analisis waktu penjualan dan jumlah pelanggan)
      
      ## 4. 🌟 Business Health Rating
      **Rating: X/10**
      *Alasan:* (Berikan justifikasi singkat)
      
      ## 5. 💡 Saran Strategis Konkret
      - (Saran 1)
      - (Saran 2)
      
      Pastikan format Markdown sangat rapi dan mudah dibaca.
    `;

    const res = await getAIResponse([
      { role: "system", content: "You are an expert Senior Business Analyst. Always respond in professional Indonesian." },
      { role: "user", content: dataContext + "\n\n" + prompt }
    ]);

    setAnalysis(res || "Gagal mendapatkan analisa dari AI.");
    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
      
      {/* Header Section */}
      <div className="bg-gradient-to-br from-indigo-600 via-indigo-600 to-blue-500 rounded-[2rem] p-6 md:p-10 text-white mb-6 md:mb-10 shadow-xl shadow-indigo-100 relative overflow-hidden">
        <div className="relative z-10 flex flex-col items-start">
          <h2 className="text-2xl md:text-3xl font-black mb-3 flex items-center gap-3">
            <Sparkles className="text-yellow-300 shrink-0" /> AI Business Analyzer
          </h2>
          <p className="text-indigo-50 text-sm md:text-base max-w-xl leading-relaxed opacity-90">
            Biarkan kecerdasan buatan kami memproses data transaksi Anda untuk memberikan wawasan mendalam, rating kesehatan bisnis, dan saran strategis untuk meningkatkan omzet.
          </p>
          
          <button 
            onClick={startAnalysis} 
            disabled={loading}
            className="mt-8 w-full sm:w-auto bg-white text-indigo-600 px-8 py-4 rounded-2xl font-black shadow-lg hover:bg-indigo-50 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                Menganalisis Data...
              </>
            ) : (
              <>
                <BarChart3 size={20} /> Mulai Analisis Bisnis
              </>
            )}
          </button>
        </div>
        
        {/* Decorative Background Icons - Hidden on very small screens */}
        <Activity className="absolute -bottom-10 -right-10 text-white/10 w-48 h-48 md:w-64 md:h-64 pointer-events-none" />
      </div>

      {/* Result Section */}
      {analysis ? (
        <div className="bg-white p-6 md:p-10 rounded-[2rem] shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-8 duration-500">
          <div className="prose prose-indigo max-w-none prose-headings:font-black prose-h1:text-2xl md:prose-h1:text-3xl prose-h2:text-lg md:prose-h2:text-xl prose-p:text-gray-600 prose-li:text-gray-600 prose-strong:text-indigo-600">
            <ReactMarkdown>{analysis}</ReactMarkdown>
          </div>
          
          <div className="mt-10 md:mt-12 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-wrap justify-center md:justify-start gap-3 md:gap-4">
              <div className="flex items-center gap-2 text-[10px] md:text-xs font-bold text-gray-400 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
                <TrendingUp size={14} /> Berdasarkan {orders.length} Transaksi
              </div>
              <div className="flex items-center gap-2 text-[10px] md:text-xs font-bold text-gray-400 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
                <Lightbulb size={14} /> AI Analyzer by Bissolf
              </div>
            </div>
            
            <button 
              onClick={() => window.print()} 
              className="flex items-center gap-2 text-indigo-600 font-black text-sm hover:bg-indigo-50 px-5 py-2.5 rounded-xl transition"
            >
              <Printer size={16} /> Cetak Laporan
            </button>
          </div>
        </div>
      ) : (
        !loading && (
          <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-[2rem] p-8 md:p-20 text-center">
            <div className="bg-white w-16 h-16 md:w-20 md:h-20 rounded-3xl flex items-center justify-center shadow-sm mx-auto mb-6">
              <BarChart3 className="text-gray-300" size={32} />
            </div>
            <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2">Belum Ada Analisis</h3>
            <p className="text-sm md:text-base text-gray-500 max-w-xs mx-auto mb-0 leading-relaxed">
              Klik tombol di atas untuk mendapatkan analisa performa dari asisten AI berdasarkan data transaksi Anda.
            </p>
          </div>
        )
      )}

      {/* Loading Placeholder */}
      {loading && !analysis && (
        <div className="space-y-4 animate-pulse">
          <div className="h-12 bg-gray-100 rounded-2xl w-3/4"></div>
          <div className="h-4 bg-gray-100 rounded-xl w-full"></div>
          <div className="h-4 bg-gray-100 rounded-xl w-full"></div>
          <div className="h-4 bg-gray-100 rounded-xl w-5/6"></div>
          <div className="pt-6 space-y-4">
            <div className="h-8 bg-gray-100 rounded-xl w-1/2"></div>
            <div className="h-20 bg-gray-100 rounded-2xl w-full"></div>
          </div>
        </div>
      )}
    </div>
  );
};