
import React, { useEffect, useState } from 'react';
import { ShoppingCart, Menu, X, ArrowLeft, User as UserIcon, Sparkles, ChevronRight } from 'lucide-react';
import { ViewState, User } from '../types';
import { Logo } from '../constants';

interface NavbarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  onSelectCategory: (category: string) => void;
  cartCount: number;
  onOpenCart: () => void;
  user: User | null;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, setView, onSelectCategory, cartCount, onOpenCart, user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Previne scroll do corpo quando o menu está aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  const isEntrance = currentView === 'entrance';
  const navBaseClass = "fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ease-in-out px-4 md:px-12";
  const navAppearanceClass = "py-3 bg-[#C082A0] border-b border-white/10 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.2)]";

  const handleGoToStore = () => {
    onSelectCategory('Todos');
    setView('store');
    setIsOpen(false);
  };

  const navItems = [
    { label: 'Início', view: 'home' as ViewState },
    { label: 'Loja', view: 'store' as ViewState, action: handleGoToStore },
    { label: 'Contatos', view: 'links' as ViewState },
    { label: 'A Flor', view: 'about' as ViewState },
  ];

  return (
    <nav className={`${navBaseClass} ${navAppearanceClass}`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4 md:space-x-6">
          {!isEntrance && (
            <button 
              onClick={() => setView('entrance')}
              className="group flex items-center space-x-2 transition-all text-white"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </button>
          )}
          <div onClick={() => setView('home')} className="cursor-pointer">
            <Logo variant="text" />
          </div>
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center space-x-8 xl:space-x-12">
          {navItems.map((item) => (
            <button 
              key={item.label}
              onClick={item.action || (() => setView(item.view))} 
              className={`text-[8px] font-bold uppercase tracking-[0.4em] transition-all relative py-2 ${currentView === item.view ? 'text-white after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-white' : 'text-white/60 hover:text-white'}`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-3 md:space-x-6">
          <div className="flex items-center space-x-2">
            {user ? (
              <button 
                onClick={() => setView('account')}
                className="flex items-center space-x-2 md:space-x-3 group px-3 md:px-4 py-2 rounded-full transition-all bg-white/10 hover:bg-white text-white hover:text-[#C082A0]"
              >
                <div className="text-[8px] font-bold uppercase tracking-widest hidden sm:block">Olá, {user.name?.split(' ')[0] || 'Cliente'}</div>
                <div className="p-1 rounded-full bg-current/10">
                  <UserIcon className="w-4 h-4" />
                </div>
              </button>
            ) : (
              <button 
                onClick={() => setView('login')}
                className="p-2.5 rounded-full transition-all text-white hover:bg-white/10"
              >
                <UserIcon className="w-5 h-5" />
              </button>
            )}
          </div>

          <button onClick={onOpenCart} className="relative group">
            <div className={`p-2.5 rounded-full transition-all shadow-lg bg-white text-[#C082A0] ${cartCount > 0 ? 'animate-pulse' : ''}`}>
              <ShoppingCart className="w-4 h-4" />
            </div>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 text-white text-[7px] w-4 h-4 rounded-full flex items-center justify-center font-bold border-2 bg-[#1A1518] border-[#C082A0]">
                {cartCount}
              </span>
            )}
          </button>
          
          <button className="lg:hidden p-2 text-white" onClick={() => setIsOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-[2000] overflow-hidden">
          {/* Overlay de Vidro com Blur */}
          <div 
            className="absolute inset-0 bg-[#1A1518]/95 backdrop-blur-xl animate-in fade-in duration-500"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Elementos Decorativos de Fundo */}
          <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] bg-[#C082A0]/20 rounded-full blur-[80px] animate-pulse" />
          <div className="absolute bottom-[20%] left-[-20%] w-[400px] h-[400px] bg-[#C082A0]/10 rounded-full blur-[100px]" />

          {/* Conteúdo do Menu */}
          <div className="relative h-full flex flex-col p-8 md:p-12 animate-in slide-in-from-right duration-500">
            <div className="flex justify-between items-center mb-16">
              <Logo variant="text" />
              <button 
                onClick={() => setIsOpen(false)}
                className="p-3 rounded-full bg-white/5 border border-white/10 text-white/50 hover:text-white transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex flex-col space-y-2">
              <div className="flex items-center space-x-3 mb-6">
                <Sparkles className="w-4 h-4 text-[#C082A0]" />
                <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#C082A0]">Menu</span>
              </div>

              {navItems.map((item, idx) => (
                <button 
                  key={item.label}
                  onClick={() => {
                    if (item.action) item.action();
                    else setView(item.view);
                    setIsOpen(false);
                  }}
                  className="group flex items-center justify-between py-5 border-b border-white/5 text-left animate-in fade-in slide-in-from-right duration-500"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <span className={`text-lg md:text-xl font-cinzel tracking-[0.2em] uppercase transition-all ${currentView === item.view ? 'text-[#C082A0]' : 'text-white/80 group-hover:text-white'}`}>
                    {item.label}
                  </span>
                  <ChevronRight className={`w-5 h-5 transition-all ${currentView === item.view ? 'text-[#C082A0]' : 'text-white/20 group-hover:text-white group-hover:translate-x-1'}`} />
                </button>
              ))}

              <button 
                onClick={() => { setView('account'); setIsOpen(false); }}
                className="flex items-center justify-between py-10 mt-8 group animate-in fade-in slide-in-from-right duration-700"
                style={{ animationDelay: `400ms` }}
              >
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-white/40 mb-1">
                    {user ? 'Acesse seu Perfil' : 'Portal do Cliente'}
                  </span>
                  <span className="text-base md:text-lg font-cinzel tracking-[0.2em] text-white uppercase">
                    {user ? `Olá, ${user.name.split(' ')[0]}` : 'ENTRAR'}
                  </span>
                </div>
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-[#C082A0] group-hover:border-[#C082A0] transition-all">
                  <UserIcon className="w-5 h-5 text-white" />
                </div>
              </button>
            </nav>

            {/* Footer do Menu */}
            <div className="mt-auto pt-10 border-t border-white/5 flex flex-col items-center space-y-4 opacity-40">
              <div className="flex space-x-6 text-[8px] font-bold uppercase tracking-[0.3em] text-white">
                <button onClick={() => { setView('privacy'); setIsOpen(false); }}>Privacidade</button>
                <button onClick={() => { setView('delivery'); setIsOpen(false); }}>Envios</button>
              </div>
              <p className="text-[8px] font-bold uppercase tracking-[0.4em] text-white/30">© 2026 Flor de Hibisco</p>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
