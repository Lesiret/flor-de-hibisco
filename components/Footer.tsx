
import React from 'react';
import { Mail, Phone, ShieldCheck, Send, Truck } from 'lucide-react';
import { ViewState } from '../types';
import { Logo } from '../constants';

interface FooterProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

const Footer: React.FC<FooterProps> = ({ currentView, setView }) => {
  const handleNav = (targetView: ViewState) => (e: React.MouseEvent) => {
    e.preventDefault();
    if (currentView === targetView) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setView(targetView);
    }
  };

  return (
    <footer className="bg-[#1A1518] text-[#FAF9F6] pt-16 md:pt-20 pb-8 md:pb-12 px-6 md:px-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 mb-12 md:mb-16">
          
          {/* Coluna 1: Marca com Novo Ícone */}
          <div className="space-y-6">
            <div onClick={handleNav('home')} className="cursor-pointer">
              <Logo variant="text" />
            </div>
            <p className="text-stone-400 text-[12px] md:text-[13px] leading-relaxed tracking-wide font-light max-w-[240px]">
              Energia, intenção e prática. Alquimias artesanais consagradas para elevar sua jornada.
            </p>
            <div className="flex items-center space-x-3 text-[#C082A0]">
              <ShieldCheck className="w-5 h-5" />
              <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em]">Pagamento Seguro</span>
            </div>
          </div>

          {/* Coluna 2: Navegação */}
          <div className="space-y-5 md:space-y-6">
            <h4 className="font-cinzel font-bold text-[10px] md:text-xs uppercase tracking-[0.4em] text-[#C082A0]">Institucional</h4>
            <ul className="grid grid-cols-1 gap-3 text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-stone-400">
              <li><button onClick={handleNav('home')} className="hover:text-white transition-all hover:translate-x-1">Início</button></li>
              <li><button onClick={handleNav('store')} className="hover:text-white transition-all hover:translate-x-1">Loja Completa</button></li>
              <li><button onClick={handleNav('privacy')} className="hover:text-white transition-all hover:translate-x-1">Privacidade</button></li>
              <li><button onClick={handleNav('terms')} className="hover:text-white transition-all hover:translate-x-1">Termos de Uso</button></li>
              <li><button onClick={handleNav('delivery')} className="hover:text-white transition-all hover:translate-x-1">Envios & Entrega</button></li>
              <li><button onClick={handleNav('payment')} className="hover:text-white transition-all hover:translate-x-1">Pagamento</button></li>
              <li><button onClick={handleNav('returns')} className="hover:text-white transition-all hover:translate-x-1">Trocas & Devoluções</button></li>
            </ul>
          </div>

          {/* Coluna 3: Suporte */}
          <div className="space-y-5 md:space-y-6">
            <h4 className="font-cinzel font-bold text-[10px] md:text-xs uppercase tracking-[0.4em] text-[#C082A0]">Contato</h4>
            <div className="flex flex-col space-y-4 md:space-y-5 text-stone-400">
              <div className="flex items-center space-x-3 text-white text-[11px] md:text-[12px]">
                <Mail className="w-4 h-4 text-[#C082A0] shrink-0" />
                <span className="tracking-widest truncate">flordehibisco_@hotmail.com</span>
              </div>
              <div className="flex items-center space-x-3 text-white text-[11px] md:text-[12px]">
                <Phone className="w-4 h-4 text-[#C082A0] shrink-0" />
                <span className="tracking-widest">(48) 98836-5882</span>
              </div>
            </div>
          </div>

          {/* Coluna 4: Newsletter & Pagamentos */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h4 className="font-cinzel font-bold text-[10px] md:text-xs uppercase tracking-[0.4em] text-[#C082A0]">Newsletter</h4>
              <form className="relative" onSubmit={(e) => e.preventDefault()}>
                <input 
                  type="email" 
                  placeholder="Seu e-mail..." 
                  className="w-full bg-transparent border-b border-stone-800 py-2 pr-10 text-[11px] md:text-[12px] focus:outline-none focus:border-[#C082A0] transition-colors placeholder:text-stone-700"
                />
                <button className="absolute right-0 bottom-2 text-[#C082A0] hover:text-white transition-colors">
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 flex-wrap">
                {/* VISA */}
                <div className="bg-white px-2 py-1 rounded-[3px] h-5 md:h-6 flex items-center justify-center">
                  <svg className="w-6 md:w-8 h-auto" viewBox="0 0 45 15" fill="#1A1F71">
                    <path d="M17.8 0.2L14.7 14.8H19.2L22.3 0.2H17.8ZM33.3 0.2H28.7C27.3 0.2 26.3 1 25.7 2.4L18.4 14.8H23L23.9 12.5H29.6C29.7 13.1 30.1 14.8 30.1 14.8H34.1L30.7 0.2L33.3 0.2ZM24.7 10.4L27.2 3.8L28.2 10.4H24.7ZM10.5 0.2L6 10.7L5.5 8.1C4.7 5.4 2.3 2.6 0 1.2L0.1 0.7H7.6L9.1 8.8L12.5 0.2H16.8L10.5 0.2Z"/>
                  </svg>
                </div>
                {/* MASTERCARD */}
                <div className="bg-white px-1.5 py-1 rounded-[3px] h-5 md:h-6 flex items-center justify-center">
                  <svg className="w-6 md:w-7 h-auto" viewBox="0 0 32 20">
                    <circle cx="10" cy="10" r="10" fill="#EB001B" />
                    <circle cx="22" cy="10" r="10" fill="#FF5F00" fillOpacity="0.8" />
                  </svg>
                </div>
                {/* PIX */}
                <div className="bg-white px-1.5 py-1 rounded-[3px] h-5 md:h-6 flex items-center justify-center gap-1">
                  <svg className="w-2.5 md:w-3 h-2.5 md:h-3 fill-[#32BCAD]" viewBox="0 0 24 24">
                    <path d="M12 2L4.5 9.5 12 17l7.5-7.5L12 2zm0 3.8l4.4 4.4-4.4 4.4-4.4-4.4 4.4-4.4z"/>
                  </svg>
                  <span className="text-[7px] md:text-[8px] font-black text-[#32BCAD] leading-none">PIX</span>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-stone-600">
                <Truck className="w-3.5 h-3.5" />
                <span className="text-[8px] md:text-[9px] font-bold uppercase tracking-[0.2em]">Envios via Correios</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-10 md:pt-12 border-t border-white/5 opacity-40">
          <p className="text-[8px] md:text-[9px] font-bold uppercase tracking-[0.3em] md:tracking-[0.4em] text-stone-400 text-center md:text-left">
            Flor de Hibisco • Ateliê Místico • CNPJ 49.013.412\0001-55
          </p>
          <p className="text-[8px] md:text-[9px] uppercase tracking-[0.2em] text-stone-400 italic text-center">
            © 2026 Flor de Hibisco • Todos os direitos reservados
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
