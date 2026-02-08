import { useEffect, useState } from 'react';
import { 
  Zap, 
  ShieldCheck, 
  Star,
  Search,
  Bot,
  Sparkles,
  TrendingUp,
  Globe,
  MessageSquare,
  Award,
  MoveRight
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Chatbot } from '../components/Chatbot';
import { HeaderLanding } from '../components/HeaderLanding';
import { Catalog } from './Catalog';

export const LandingPage = () => {
  // Destructure orders juga dari store untuk dikirim ke Catalog nanti
  const { products, initiateOrderFromLanding, toggleChat } = useStore();
  const [view, setView] = useState<'home' | 'catalog'>('home');

  // Reset scroll ke atas setiap kali ganti view
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  // --- SUB-COMPONENT: VIEW HOME ---
  const renderHome = () => (
    <div className="animate-in fade-in duration-1000">
      {/* Hero Section */}
      <section className="relative pt-16 md:pt-24 pb-24 md:pb-40 overflow-hidden">
        {/* Background Blobs - Disesuaikan agar tidak menghalangi teks di mobile */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 overflow-hidden">
            <div className="absolute top-[-5%] left-[-10%] w-[60%] md:w-[40%] h-[40%] bg-blue-100/40 rounded-full blur-[80px] md:blur-[120px] animate-pulse" />
            <div className="absolute bottom-[10%] right-[-10%] w-[50%] md:w-[30%] h-[30%] bg-purple-100/40 rounded-full blur-[80px] md:blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 md:gap-3 px-5 md:px-6 py-2 md:py-2.5 mb-8 md:mb-10 bg-white border border-gray-100 rounded-full shadow-xl shadow-gray-50">
            <Sparkles size={14} className="text-blue-600" />
            <span className="text-[8px] md:text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Next-Gen Commerce Experience</span>
          </div>
          
          <h2 className="text-5xl sm:text-7xl md:text-[10rem] font-black mb-8 md:mb-10 leading-[0.9] md:leading-[0.85] tracking-tighter text-gray-900 break-words">
            CARI PRODUK <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600">
              SEMUDAH CHATTING
            </span>
          </h2>
          
          <p className="text-lg md:text-2xl text-gray-500 mb-12 md:mb-16 max-w-3xl mx-auto leading-relaxed font-medium px-4">
            Bukan sekadar toko online. BISSOLF adalah ekosistem belanja cerdas berbasis AI yang memahami keinginan Anda.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 md:gap-8 justify-center items-center px-4">
            <button 
              onClick={() => toggleChat(true)} 
              className="w-full sm:w-auto group bg-blue-600 text-white px-8 md:px-12 py-5 md:py-7 rounded-2xl md:rounded-[2rem] font-black text-lg md:text-xl hover:bg-gray-900 transition-all shadow-[0_20px_40px_-12px_rgba(59,130,246,0.4)] flex items-center justify-center gap-4 md:gap-5 active:scale-95"
            >
              Mulai Chatting <MoveRight className="group-hover:translate-x-2 md:group-hover:translate-x-3 transition-transform" size={20} />
            </button>
            <button 
              onClick={() => setView('catalog')}
              className="w-full sm:w-auto group bg-white text-gray-900 px-8 md:px-12 py-5 md:py-7 rounded-2xl md:rounded-[2rem] font-black text-lg md:text-xl border-2 border-gray-100 hover:border-blue-600 transition-all flex items-center justify-center gap-3 md:gap-4 active:scale-95 shadow-xl shadow-gray-100"
            >
              Eksplorasi Katalog <Search size={18} className="group-hover:rotate-90 transition-transform" />
            </button>
          </div>

          {/* Trust Badges - Stacked on mobile */}
          <div className="mt-20 md:mt-32 flex flex-wrap justify-center items-center gap-6 md:gap-12 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
             <div className="flex items-center gap-2 font-black text-sm md:text-2xl tracking-tighter"><Globe size={18}/> GLOBAL DELIVERY</div>
             <div className="flex items-center gap-2 font-black text-sm md:text-2xl tracking-tighter"><ShieldCheck size={18}/> SECURE 256-BIT</div>
             <div className="flex items-center gap-2 font-black text-sm md:text-2xl tracking-tighter"><Award size={18}/> PREMIUM QUALITY</div>
          </div>
        </div>
      </section>

      {/* Stats Marquee */}
      <div className="bg-gray-900 py-6 md:py-10 overflow-hidden flex whitespace-nowrap border-y border-white/10">
        <div className="flex gap-10 md:gap-20 animate-marquee items-center">
          {[1,2,3,4].map(i => (
            <div key={i} className="flex gap-10 md:gap-20 items-center">
              <span className="text-white font-black text-lg md:text-2xl tracking-[0.2em] md:tracking-[0.3em] flex items-center gap-3 md:gap-4">
                <Star className="text-blue-500 fill-blue-500" size={18} /> 50K+ USERS
              </span>
              <span className="text-white font-black text-lg md:text-2xl tracking-[0.2em] md:tracking-[0.3em] flex items-center gap-3 md:gap-4">
                <Zap className="text-yellow-400 fill-yellow-400" size={18} /> INSTANT PROCESS
              </span>
              <span className="text-white font-black text-lg md:text-2xl tracking-[0.2em] md:tracking-[0.3em] flex items-center gap-3 md:gap-4">
                <TrendingUp className="text-green-400" size={18} /> 99.9% SATISFACTION
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Features - Bento Grid Style */}
      <section className="py-24 md:py-40 bg-[#fcfcfd]">
        <div className="max-w-7xl mx-auto px-6 md:px-4">
          <div className="text-center mb-16 md:mb-24">
            <h2 className="text-4xl md:text-7xl font-black text-gray-900 mb-6 tracking-tighter uppercase">KEUNGGULAN <span className="text-blue-600 underline decoration-blue-100 underline-offset-8">BISSOLF</span></h2>
            <p className="text-gray-400 text-lg md:text-xl font-medium max-w-2xl mx-auto italic">Membangun standar baru dalam dunia retail digital.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 md:gap-6 h-auto md:h-[700px]">
            {/* Box 1: AI Chat */}
            <div className="md:col-span-3 bg-white p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] shadow-xl shadow-gray-100 flex flex-col justify-between group hover:bg-blue-600 transition-all duration-500 border border-gray-50">
               <div className="bg-blue-50 w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-3xl flex items-center justify-center text-blue-600 group-hover:bg-white/20 group-hover:text-white transition-all mb-8 md:mb-0">
                  <Bot size={32} />
               </div>
               <div>
                 <h3 className="text-3xl md:text-4xl font-black mb-4 group-hover:text-white transition-colors uppercase tracking-tighter">Neuro-Chat AI</h3>
                 <p className="text-gray-500 text-base md:text-lg font-medium group-hover:text-blue-100 transition-colors">Asisten AI yang mengenali preferensi gaya Anda dan memberikan rekomendasi yang personal.</p>
               </div>
            </div>

            {/* Box 2 & 3: Security & Speed */}
            <div className="md:col-span-3 grid grid-cols-1 gap-4 md:gap-6">
               <div className="bg-gray-900 p-8 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] text-white flex items-center gap-6 md:gap-8 group hover:scale-[1.02] transition-transform">
                  <div className="bg-white/10 p-4 md:p-5 rounded-2xl flex-shrink-0"><ShieldCheck size={28} className="text-blue-400" /></div>
                  <div>
                    <h4 className="text-xl md:text-2xl font-black mb-1 uppercase">Ultra-Secure</h4>
                    <p className="text-gray-400 text-xs md:text-sm font-medium">Proteksi data level militer di setiap transaksi.</p>
                  </div>
               </div>
               <div className="bg-blue-600 p-8 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] text-white flex items-center gap-6 md:gap-8 group hover:scale-[1.02] transition-transform">
                  <div className="bg-white/10 p-4 md:p-5 rounded-2xl flex-shrink-0"><Zap size={28} className="text-yellow-300" /></div>
                  <div>
                    <h4 className="text-xl md:text-2xl font-black mb-1 uppercase">Fast Response</h4>
                    <p className="text-blue-100 text-xs md:text-sm font-medium">Latency rendah, belanja tanpa jeda waktu.</p>
                  </div>
               </div>
            </div>

            {/* Box 4: Logistics */}
            <div className="md:col-span-2 bg-indigo-50 p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] flex flex-col justify-center border border-indigo-100 text-center md:text-left">
               <h3 className="text-5xl md:text-6xl font-black text-indigo-900 mb-2 tracking-tighter">12+</h3>
               <p className="text-indigo-600 font-bold uppercase tracking-widest text-[10px] md:text-xs">Partner Logistik Global</p>
            </div>

            {/* Box 5: Image/Quality */}
            <div className="md:col-span-4 min-h-[300px] bg-[url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80')] bg-cover bg-center rounded-[2.5rem] md:rounded-[3.5rem] relative overflow-hidden group">
               <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-700" />
               <div className="absolute bottom-6 md:bottom-10 left-6 md:left-10 right-6 text-white">
                 <h3 className="text-2xl md:text-3xl font-black mb-2 uppercase tracking-tighter">Kualitas Tanpa Kompromi</h3>
                 <p className="text-white/80 text-sm md:text-base font-medium">Hanya produk terkurasi yang masuk ke dalam sistem kami.</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 md:py-40 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-16 md:mb-24 gap-8 md:gap-10">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter max-w-xl text-center md:text-left uppercase">DENGAR APA KATA <span className="text-blue-600 underline underline-offset-8">MEREKA.</span></h2>
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 bg-gray-50 px-8 py-4 rounded-[2rem]">
              <div className="text-center md:text-right">
                <p className="text-2xl md:text-3xl font-black text-gray-900">4.9/5.0</p>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Customer Rating</p>
              </div>
              <div className="flex items-center gap-1 text-yellow-400">
                <Star size={20} fill="currentColor"/><Star size={20} fill="currentColor"/><Star size={20} fill="currentColor"/><Star size={20} fill="currentColor"/><Star size={20} fill="currentColor"/>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              { name: 'Alex Rivera', role: 'Tech Enthusiast', text: 'Pengalaman belanja paling gila yang pernah saya rasakan. Chatbot-nya benar-benar pintar!' },
              { name: 'Sarah Jenkins', role: 'Fashion Designer', text: 'Kurasi produknya sangat premium. Saya tidak perlu menghabiskan waktu berjam-jam mencari barang.' },
              { name: 'Budi Santoso', role: 'Entrepreneur', text: 'Sangat cepat dan efisien. Pembatalan pesanan lewat chat juga sangat membantu jika saya berubah pikiran.' }
            ].map((t, i) => (
              <div key={i} className="p-8 md:p-10 bg-gray-50 rounded-[2.5rem] md:rounded-[3rem] relative hover:-translate-y-4 transition-all duration-500 border border-transparent hover:border-blue-100 hover:bg-white hover:shadow-2xl">
                <MessageSquare className="text-blue-600/20 absolute top-8 md:top-10 right-8 md:right-10" size={32} />
                <p className="text-gray-600 text-base md:text-lg font-medium leading-relaxed mb-8 italic">"{t.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-600 rounded-xl md:rounded-2xl flex items-center justify-center text-white font-black">{t.name[0]}</div>
                  <div>
                    <p className="font-black text-gray-900 text-sm md:text-base uppercase tracking-tight">{t.name}</p>
                    <p className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-blue-600 selection:text-white">
      {/* HEADER COMPONENT */}
      <HeaderLanding 
        view={view} 
        setView={setView} 
        toggleChat={toggleChat} 
      />

      <main>
        {view === 'home' ? (
          renderHome()
        ) : (
          <Catalog 
            products={products}
            onBack={() => setView('home')}
            onOrder={initiateOrderFromLanding}
          />
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-gray-900 pt-24 pb-12 md:py-32 text-white">
        <div className="max-w-7xl mx-auto px-6 md:px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 mb-16 md:mb-24 border-b border-white/10 pb-16 md:pb-24">
            <div>
              <div className="flex items-center gap-3 md:gap-4 mb-8 md:mb-10">
                <div className="bg-blue-600 p-2.5 md:p-3 rounded-xl md:rounded-2xl"><Zap size={24} fill="currentColor"/></div>
                <span className="font-black text-3xl md:text-4xl tracking-tighter uppercase">BISSOLF</span>
              </div>
              <p className="text-gray-400 max-w-md text-lg md:text-xl font-medium leading-relaxed mb-10">
                Masa depan retail ada di sini. Rasakan kekuatan AI dalam setiap genggaman Anda.
              </p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-10 md:gap-16">
               <div>
                 <p className="text-[10px] md:text-[11px] font-black text-blue-600 uppercase tracking-[0.3em] mb-6 md:mb-10">Platform</p>
                 <ul className="space-y-4 md:space-y-6 text-xs md:text-sm font-black text-gray-400">
                   <li className="hover:text-white cursor-pointer transition-colors" onClick={() => setView('home')}>HOME</li>
                   <li className="hover:text-white cursor-pointer transition-colors" onClick={() => setView('catalog')}>CATALOG</li>
                 </ul>
               </div>
               <div>
                 <p className="text-[10px] md:text-[11px] font-black text-blue-600 uppercase tracking-[0.3em] mb-6 md:mb-10">Connect</p>
                 <ul className="space-y-4 md:space-y-6 text-xs md:text-sm font-black text-gray-400">
                   <li className="hover:text-white cursor-pointer transition-colors">INSTAGRAM</li>
                   <li className="hover:text-white cursor-pointer transition-colors">X / TWITTER</li>
                   <li className="hover:text-white cursor-pointer transition-colors">LINKEDIN</li>
                 </ul>
               </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 md:gap-10">
            <p className="text-gray-500 text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-center">
              &copy; 2026 BISSOLF &bull; ALL RIGHTS RESERVED
            </p>
            <div className="flex flex-wrap justify-center gap-6 md:gap-12 text-[9px] md:text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">
                <span className="hover:text-white cursor-pointer">Privacy</span>
                <span className="hover:text-white cursor-pointer">Terms</span>
                <span className="hover:text-white cursor-pointer">Cookies</span>
            </div>
          </div>
        </div>
      </footer>

      <Chatbot />

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
        @media (min-width: 768px) {
          .animate-marquee {
            animation: marquee 30s linear infinite;
          }
        }
      `}</style>
    </div>
  );
};

export const PlusIconCustom = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);