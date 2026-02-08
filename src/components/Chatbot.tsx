import { useState, useEffect, useRef } from 'react';
import { X, Send, Loader2, Wallet, CreditCard, Bot, Copy, Check } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { getAIResponse } from '../lib/ai';
import type { Order } from '../types';
import ReactMarkdown from 'react-markdown';

export const Chatbot = () => {
  const { 
    isChatOpen, 
    toggleChat, 
    chatMessages, 
    addChatMessage, 
    createOrder, 
    products, 
    orders,
    cancelOrder 
  } = useStore();
  
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pendingOrderData, setPendingOrderData] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // --- Payment Modal States ---
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [paymentInput, setPaymentInput] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  
  // --- Copy Feedback State ---
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, pendingOrderData, isLoading]);

  // Handle Initial System Prompt & AI Logic
  useEffect(() => {
    if (isChatOpen && chatMessages.length > 0) {
      const lastMsg = chatMessages[chatMessages.length - 1];
      if (lastMsg.role === 'user') {
        processAIResponse();
      }
    } else if (isChatOpen && chatMessages.length === 0) {
      addChatMessage({ 
        role: 'assistant', 
        content: 'Halo! Selamat datang di **BISSOLF Store** 🤖.\n\nAda yang bisa saya bantu? Saya bisa membantu kamu:\n1. **Informasi Produk**\n2. **Pemesanan Instan**\n3. **Cek Status Pesanan**\n4. **Pembatalan Pesanan** (Ketik: "Batalkan [ID Pesanan]")' 
      });
    }
  }, [chatMessages, isChatOpen]);

  const processAIResponse = async () => {
    setIsLoading(true);
    
    const systemPrompt = `
      Kamu adalah asisten toko BISSOLF yang cerdas dan ramah.
      
      DATA KONTEKS:
      - Produk Tersedia: ${JSON.stringify(products.map(p => ({name: p.product_name, price: p.price, stock: p.stocks})))}
      - Database Pesanan: ${JSON.stringify(orders.map(o => ({id: o.id, status: o.status, buyer: o.buyer_name, item: o.product_name})))}
      
      TUGAS UTAMA:
      1. Jawab pertanyaan produk dengan ramah menggunakan Markdown.
      2. PEMESANAN: Jika user ingin membeli, minta data berikut secara bertahap atau sekaligus:
         - Nama
         - No HP
         - Alamat Lengkap (Lokasi pengiriman)
         - Jumlah Pesanan
         
         SETELAH semua data (Nama, HP, Alamat, Jumlah) lengkap, kamu WAJIB memberikan konfirmasi ringkas dan MENGELUARKAN JSON:
         ~~~{"action": "PAYMENT", "product": "nama_produk", "qty": 1, "name": "user", "phone": "08x", "location": "Alamat user..."}~~~
         
         JANGAN memberikan instruksi transfer manual di teks. Cukup katakan: "Terima kasih [Nama]! Silakan pilih metode pembayaran di bawah ini."
      3. TRACKING & PEMBATALAN: Sesuai prosedur biasa.
      4. PEMBATALAN PESANAN:
         - Cari ID. Jika Packaging, tanya alasan.
         - SETELAH alasan diberikan, keluarkan JSON: ~~~{"action": "CANCEL_ORDER", "orderId": "ORD-xxx", "reason": "alasan"}~~~
      
      Aturan: Gunakan Bahasa Indonesia. Bold bagian penting. Jangan bertele-tele saat data order sudah lengkap.
    `;

    const apiMessages = [
      { role: "system", content: systemPrompt },
      ...chatMessages.map(m => ({ role: m.role, content: m.content }))
    ];

    const reply = await getAIResponse(apiMessages);
    
    if (reply) {
      const parts = reply.split('~~~');
      const naturalText = parts[0].trim();
      
      // Jika ada JSON action, eksekusi SEBELUM menampilkan pesan terakhir agar sinkron
      if (parts.length > 1) {
        try {
          const actionData = JSON.parse(parts[1]);
          
          if (actionData.action === 'PAYMENT') {
            setPendingOrderData(actionData); 
            addChatMessage({ role: 'assistant', content: naturalText });
          } 
          else if (actionData.action === 'CANCEL_ORDER') {
            // EKSEKUSI PEMBATALAN DI SINI
            const result = cancelOrder(actionData.orderId, actionData.reason);
            
            if (result.success) {
              addChatMessage({ 
                role: 'assistant', 
                content: `✅ **Berhasil Dibatalkan!**\n\nPesanan \`${actionData.orderId}\` telah resmi dibatalkan dengan alasan: *${actionData.reason}*.\n\nStatus di dashboard telah berubah menjadi **Canceled** dan stok telah dikembalikan.` 
              });
            } else {
              addChatMessage({ 
                role: 'assistant', 
                content: `❌ **Gagal Membatalkan:** ${result.message}` 
              });
            }
          }
        } catch (e) {
          console.error("Gagal parse action JSON", e);
          addChatMessage({ role: 'assistant', content: naturalText });
        }
      } else {
        // Jika tidak ada action, tampilkan teks biasa
        addChatMessage({ role: 'assistant', content: naturalText });
      }
    }
    setIsLoading(false);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    addChatMessage({ role: 'user', content: input });
    setInput('');
  };

  const handlePaymentClick = (method: string) => {
    setSelectedMethod(method);
    setPaymentInput('');
    setShowPaymentModal(true);
  };

  const isEWallet = (method: string) => ['Dana', 'Gopay', 'Ovo'].includes(method);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const confirmPayment = async () => {
    if (!pendingOrderData || !paymentInput) return;

    setIsProcessingPayment(true);
    await new Promise(resolve => setTimeout(resolve, 2000));

    const product = products.find(p => 
      p.product_name.toLowerCase().includes(pendingOrderData.product.toLowerCase())
    ) || products[0];
    
    const orderId = `ORD-${Date.now().toString().slice(-6)}`;

    const newOrder: Order = {
      id: orderId,
      id_product: product.id,
      product_name: product.product_name,
      product_price: product.price,
      quantity: pendingOrderData.qty,
      total_price: product.price * pendingOrderData.qty,
      buyer_name: pendingOrderData.name,
      buyer_phone: pendingOrderData.phone,
      buyer_location: pendingOrderData.location || "Alamat tidak terdeteksi",
      payment_method: selectedMethod,
      status: 'Packaging',
      created_at: new Date().toISOString()
    };

    createOrder(newOrder);
    
    setIsProcessingPayment(false);
    setShowPaymentModal(false);
    setPendingOrderData(null);
    
    addChatMessage({ 
      role: 'assistant', 
      content: `### ✅ Pembayaran Berhasil!\n\nPembayaran via **${selectedMethod}** dikonfirmasi.\n\n**Order ID:** \`${orderId}\` (Klik ID untuk menyalin)\n\nTerima kasih! Pesananmu sedang disiapkan.` 
    });
  };

  if (!isChatOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 w-[400px] h-[650px] bg-white shadow-2xl rounded-[2.5rem] flex flex-col z-50 border border-gray-100 overflow-hidden animate-in slide-in-from-bottom-8 duration-300">
      
      {/* --- PAYMENT MODAL --- */}
      {showPaymentModal && (
        <div className="absolute inset-0 z-[60] bg-white/95 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="w-full bg-white rounded-[2rem] shadow-2xl border border-gray-100 p-8 relative">
            {!isProcessingPayment && (
               <button onClick={() => setShowPaymentModal(false)} className="absolute top-6 right-6 text-gray-400 hover:text-red-500 transition"><X size={24} /></button>
            )}

            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                {isEWallet(selectedMethod) ? <Wallet size={40} /> : <CreditCard size={40} />}
              </div>
              <h3 className="font-black text-gray-900 text-xl tracking-tight">Verifikasi Pembayaran</h3>
              <p className="text-xs text-gray-400 mt-1 uppercase font-bold tracking-widest">{selectedMethod} Gateway</p>
            </div>

            {isProcessingPayment ? (
              <div className="flex flex-col items-center justify-center py-6 space-y-4">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                <p className="text-sm font-black text-gray-600 animate-pulse">Memverifikasi...</p>
              </div>
            ) : (
              <div className="space-y-5">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1 mb-2 block">
                    {isEWallet(selectedMethod) ? "Input Nomor HP E-Wallet" : "Input Nomor Rekening Anda"}
                  </label>
                  <input 
                    type="text"
                    value={paymentInput}
                    onChange={(e) => setPaymentInput(e.target.value)}
                    placeholder={isEWallet(selectedMethod) ? "08..." : "Rekening No..."}
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-600 rounded-2xl px-5 py-4 text-sm outline-none transition-all font-bold"
                    autoFocus
                  />
                </div>

                <div className="bg-gray-900 rounded-2xl p-5 text-white">
                   <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400 font-bold">Total Tagihan:</span>
                      <span className="font-black text-blue-400 text-lg">
                        Rp {((products.find(p => p.product_name.toLowerCase().includes(pendingOrderData?.product?.toLowerCase() || ''))?.price || 0) * (pendingOrderData?.qty || 1)).toLocaleString()}
                      </span>
                   </div>
                </div>

                <button 
                  onClick={confirmPayment}
                  disabled={!paymentInput}
                  className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50 shadow-xl shadow-blue-200"
                >
                  Confirm Payment
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-gray-50 p-6 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="bg-blue-600 p-2.5 rounded-2xl text-white shadow-lg shadow-blue-100">
              <Bot size={24} />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          <div>
            <h3 className="font-black text-gray-900 text-base leading-none tracking-tighter uppercase">BISSOLF AI</h3>
            <p className="text-[10px] text-green-600 font-black mt-1 uppercase tracking-widest">ONLINE</p>
          </div>
        </div>
        <button onClick={() => toggleChat(false)} className="bg-gray-50 p-2.5 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all"><X size={20} /></button>
      </div>

      {/* Messages Area */}
     <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
        {chatMessages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-5 rounded-[2rem] text-sm leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none shadow-2xl shadow-blue-100 font-medium' 
                : 'bg-gray-50 border border-gray-100 text-gray-800 rounded-tl-none prose prose-sm prose-blue'
            }`}>
              <ReactMarkdown
                components={{
                  // Kita hapus 'inline' dari destructured props untuk menghindari error TS
                  code: ({ node, className, children, ...props }) => {
                    const content = String(children);
                    const isOrderId = /ORD-\d+/.test(content);
                    
                    // Cek apakah ini inline code (biasanya tidak diawali 'language-')
                    const isInline = !className?.includes('language-');

                    if (isInline && isOrderId) {
                      const id = content.match(/ORD-\d+/)?.[0] || content;
                      return (
                        <button
                          onClick={() => copyToClipboard(id)}
                          className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-md font-black hover:bg-blue-200 transition-colors inline-flex items-center gap-1 group relative mx-1"
                          title="Klik untuk menyalin"
                        >
                          {content}
                          {copiedId === id ? (
                            <Check size={12} className="text-green-600" />
                          ) : (
                            <Copy size={12} className="opacity-50 group-hover:opacity-100" />
                          )}
                          {copiedId === id && (
                            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded shadow-lg animate-in fade-in zoom-in duration-200 whitespace-nowrap z-50">
                              Copied!
                            </span>
                          )}
                        </button>
                      );
                    }

                    return (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  }
                }}
              >
                {msg.content}
              </ReactMarkdown>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex gap-2 items-center px-5 py-3 bg-gray-50 w-max rounded-full">
            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce"></div>
          </div>
        )}
        
        {/* Payment Selection UI */}
        {pendingOrderData && !showPaymentModal && (
          <div className="bg-white p-6 rounded-[2.5rem] shadow-2xl border-2 border-blue-600 mt-2 animate-in zoom-in-95">
             <div className="flex items-center gap-3 mb-4">
               <div className="bg-blue-100 p-2 rounded-xl text-blue-600"><CreditCard size={18} /></div>
               <h4 className="font-black text-gray-900 uppercase text-xs tracking-widest">Pilih Metode Pembayaran</h4>
             </div>
            <div className="space-y-3 mb-6 bg-gray-50 p-4 rounded-2xl">
              <div className="flex justify-between text-[10px] font-bold">
                <span className="text-gray-400 uppercase">Produk</span>
                <span className="text-gray-900 text-right">{pendingOrderData.product}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                <span className="text-xs font-black">Total Bayar</span>
                <span className="text-blue-600 font-black text-base">
                  Rp {((products.find(p => p.product_name.toLowerCase().includes(pendingOrderData.product.toLowerCase()))?.price || 0) * pendingOrderData.qty).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">E-Wallet</p>
                <div className="grid grid-cols-3 gap-2">
                  {['Dana', 'Gopay', 'Ovo'].map(m => (
                    <button key={m} onClick={() => handlePaymentClick(m)} className="bg-gray-900 text-white text-[9px] font-black py-3 rounded-xl hover:bg-blue-600 transition-all uppercase">
                      {m}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Transfer Bank</p>
                <div className="grid grid-cols-3 gap-2">
                  {['BCA', 'BRI', 'Mandiri'].map(m => (
                    <button key={m} onClick={() => handlePaymentClick(m)} className="bg-blue-50 text-blue-700 text-[9px] font-black py-3 rounded-xl hover:bg-blue-600 hover:text-white transition-all uppercase border border-blue-100">
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-6 bg-white border-t border-gray-50 shrink-0">
        <div className="flex items-center gap-3 bg-gray-50 rounded-[1.5rem] p-2 focus-within:ring-2 focus-within:ring-blue-600/10 focus-within:bg-white border-2 border-transparent focus-within:border-blue-600/20 transition-all">
          <input 
            type="text" 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Tulis pesan..." 
            className="flex-1 bg-transparent border-none px-4 py-3 text-sm outline-none font-bold placeholder:text-gray-400"
          />
          <button 
            onClick={handleSend} 
            disabled={isLoading || !input.trim()} 
            className="bg-blue-600 text-white p-3.5 rounded-2xl hover:bg-gray-900 transition-all shadow-xl shadow-blue-100 disabled:bg-gray-200"
          >
            <Send size={20} />
          </button>
        </div>
        <div className="flex items-center justify-center gap-2 mt-4 opacity-30">
            <div className="h-[1px] w-8 bg-gray-400"></div>
            <p className="text-[8px] font-black uppercase tracking-[0.3em] text-gray-500">Trinity AI Engine 2.0</p>
            <div className="h-[1px] w-8 bg-gray-400"></div>
        </div>
      </div>
    </div>
  );
};