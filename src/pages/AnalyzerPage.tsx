import { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { getAIResponse } from '../lib/ai';
import { Sparkles, BarChart3, TrendingUp, Lightbulb, Activity } from 'lucide-react';
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
    <div className="max-w-5xl mx-auto">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-[2rem] p-10 text-white mb-10 shadow-xl shadow-indigo-100 relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-black mb-2 flex items-center gap-3">
            <Sparkles className="text-yellow-300" /> AI Business Analyzer
          </h2>
          <p className="text-indigo-100 max-w-xl leading-relaxed">
            Biarkan kecerdasan buatan kami memproses data transaksi Anda untuk memberikan wawasan mendalam, rating kesehatan bisnis, dan saran strategis untuk meningkatkan omzet.
          </p>
          <button 
            onClick={startAnalysis} 
            disabled={loading}
            className="mt-8 bg-white text-indigo-600 px-8 py-4 rounded-2xl font-black shadow-lg hover:bg-indigo-50 transition-all active:scale-95 flex items-center gap-3 disabled:opacity-50"
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
        
        {/* Decorative Background Icons */}
        <Activity className="absolute -bottom-10 -right-10 text-white/10 w-64 h-64" />
      </div>

      {/* Result Section */}
      {analysis ? (
        <div className="bg-white p-10 rounded-[2rem] shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-8 duration-500">
          <div className="prose prose-indigo max-w-none prose-headings:font-black prose-h1:text-3xl prose-h2:text-xl prose-p:text-gray-600 prose-li:text-gray-600 prose-strong:text-indigo-600">
            <ReactMarkdown>{analysis}</ReactMarkdown>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-100 flex justify-between items-center">
            <div className="flex gap-4">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-400 bg-gray-50 px-4 py-2 rounded-full">
                <TrendingUp size={14} /> Berdasarkan {orders.length} Transaksi
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-gray-400 bg-gray-50 px-4 py-2 rounded-full">
                <Lightbulb size={14} /> AI Analyzer by Cobamulai
              </div>
            </div>
            <button 
              onClick={() => window.print()} 
              className="text-indigo-600 font-bold text-sm hover:underline"
            >
              Cetak Laporan PDF
            </button>
          </div>
        </div>
      ) : (
        !loading && (
          <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-[2rem] p-20 text-center">
            <div className="bg-white w-20 h-20 rounded-3xl flex items-center justify-center shadow-sm mx-auto mb-6">
              <BarChart3 className="text-gray-300" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Belum Ada Analisis</h3>
            <p className="text-gray-500 max-w-sm mx-auto mb-0">
              Data transaksi Anda sudah terkumpul. Klik tombol di atas untuk mendapatkan analisa performa dari asisten AI kami.
            </p>
          </div>
        )
      )}
    </div>
  );
};