import { useState } from 'react';
import { CircleDollarSign, Bot, Menu, X, ArrowRight } from 'lucide-react';

interface HeaderLandingProps {
  view: 'home' | 'catalog';
  setView: (view: 'home' | 'catalog') => void;
  toggleChat: (open: boolean) => void;
}

export const HeaderLanding = ({ view, setView, toggleChat }: HeaderLandingProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Beranda', value: 'home' as const },
    { name: 'Katalog', value: 'catalog' as const }
  ];

  const handleNavClick = (value: 'home' | 'catalog') => {
    setView(value);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white/90 backdrop-blur-2xl border-b border-gray-100 sticky top-0 z-[100] transition-all">
      <div className="max-w-7xl mx-auto px-6 md:px-8 h-20 md:h-24 flex justify-between items-center">
        
        {/* LOGO SECTION */}
        <div 
          className="flex items-center gap-3 cursor-pointer group" 
          onClick={() => handleNavClick('home')}
        >
          <div className="bg-blue-600 p-2 md:p-2.5 rounded-xl md:rounded-2xl group-hover:rotate-[15deg] transition-all duration-500 shadow-lg shadow-blue-200">
            <CircleDollarSign className="text-white" size={24}  fill="currentColor" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-gray-900 tracking-tighter leading-none uppercase">BISSOLF</h1>
          </div>
        </div>
        
        {/* DESKTOP NAVIGATION */}
        <div className="hidden lg:flex items-center gap-12">
          {navItems.map((item) => (
            <button 
              key={item.name}
              onClick={() => setView(item.value)}
              className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all relative group ${
                view === item.value ? 'text-blue-600' : 'text-gray-400 hover:text-gray-900'
              }`}
            >
              {item.name}
              <span className={`absolute -bottom-2 left-0 w-0 h-1 bg-blue-600 transition-all duration-300 group-hover:w-full ${
                view === item.value ? 'w-full' : ''
              }`} />
            </button>
          ))}
        </div>

        {/* RIGHT ACTIONS (Tanya AI & Mobile Toggle) */}
        <div className="flex items-center gap-3 md:gap-4">
          <button 
            onClick={() => toggleChat(true)} 
            className="group relative bg-gray-900 text-white pl-4 md:pl-6 pr-5 md:pr-8 py-2.5 md:py-3.5 rounded-xl md:rounded-2xl font-bold text-sm hover:bg-blue-600 transition-all flex items-center gap-2 md:gap-3 shadow-xl active:scale-95 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <Bot size={18}  className="relative z-10 animate-bounce" /> 
            <span className="relative z-10 uppercase tracking-widest text-[9px] md:text-xs font-black">Tanya AI</span>
          </button>

          {/* MOBILE MENU TOGGLE */}
          <button 
            className="lg:hidden p-2.5 bg-gray-50 rounded-xl text-gray-900 hover:bg-gray-100 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU OVERLAY */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 animate-in slide-in-from-top duration-300 shadow-2xl">
          <div className="p-6 space-y-4">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavClick(item.value)}
                className={`w-full flex justify-between items-center p-5 rounded-2xl font-black uppercase tracking-widest text-sm transition-all ${
                  view === item.value 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' 
                  : 'bg-gray-50 text-gray-500'
                }`}
              >
                {item.name}
                <ArrowRight size={18} className={view === item.value ? 'opacity-100' : 'opacity-0'} />
              </button>
            ))}
            
            <div className="pt-4 border-t border-gray-100">
               <div className="flex items-center gap-3 p-4 text-gray-400">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest">AI Agent Online</span>
               </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};