
import React from 'react';
import { Sparkles } from 'lucide-react';
import { ViewState } from '../types';

interface EntranceProps {
  onSelect: (view: ViewState) => void;
}

const Entrance: React.FC<EntranceProps> = ({ onSelect }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] relative overflow-hidden">
      {/* Background Decorativo */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-5%] right-[-10%] w-[400px] md:w-[800px] h-[400px] md:h-[800px] bg-[#C082A0]/5 rounded-full blur-[100px] md:blur-[150px]" />
        <div className="absolute bottom-[-5%] left-[-10%] w-[400px] md:w-[800px] h-[400px] md:h-[800px] bg-stone-200/20 rounded-full blur-[100px] md:blur-[150px]" />
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 md:px-6 pt-20 md:pt-0 max-w-7xl mx-auto w-full">
        
        {/* Escolha de Portais - Centralizada no espaço disponível */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 w-full max-w-6xl">
          {/* Card Loja */}
            <div 
              onClick={() => onSelect('home')}
              className="group relative h-[35vh] sm:h-[40vh] md:h-[580px] bg-[#1A1518] cursor-pointer overflow-hidden rounded-[2rem] md:rounded-[2.5rem] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.3)] hover:-translate-y-2 transition-all duration-700"
            >
            <img 
              src="/images/entrada1.jpg" 
              className="absolute inset-0 w-full h-full object-cover opacity-75 group-hover:scale-110 group-hover:opacity-90 transition-all duration-[3s]"
              alt="Flor de Hibisco"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A1518] via-transparent to-transparent opacity-90" />
            
            <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end">
              <h3 className="text-2xl md:text-4xl font-cinzel font-bold text-white mb-2 md:mb-4 tracking-[0.2em]">Flor de Hibisco</h3>
              <p className="text-stone-300 text-[10px] md:text-sm font-light max-w-xs mb-6 md:mb-10 leading-relaxed">
                Explore nossos produtos ritualísticos e espirituais.
              </p>
              <div className="flex items-center space-x-4 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.5em] text-[#C082A0]">
                <span>Acessar Loja</span>
                <div className="w-8 md:w-10 h-px bg-[#C082A0] group-hover:w-16 md:group-hover:w-20 transition-all duration-700" />
              </div>
            </div>
          </div>

          {/* Card Conexões */}
          <div 
            onClick={() => onSelect('links')}
            className="group relative h-[35vh] sm:h-[40vh] md:h-[580px] bg-[#1A1518] cursor-pointer overflow-hidden rounded-[2rem] md:rounded-[2.5rem] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.3)] hover:-translate-y-2 transition-all duration-700"
          >
            <img 
              src="/images/entrada2.jpg" 
              className="absolute inset-0 w-full h-full object-cover opacity-75 group-hover:scale-110 group-hover:opacity-90 transition-all duration-[3s]"
              alt="Contato e Redes Sociais"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A1518] via-transparent to-transparent opacity-90" />
            
            <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end">
              <h3 className="text-2xl md:text-4xl font-cinzel font-bold text-white mb-2 md:mb-4 tracking-[0.2em]">Contatos e Redes</h3>
              <p className="text-stone-300 text-[10px] md:text-sm font-light max-w-xs mb-6 md:mb-10 leading-relaxed">
                Agendamentos e atendimentos personalizados.
              </p>
              <div className="flex items-center space-x-4 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.5em] text-white">
                <span>Contatar</span>
                <div className="w-8 md:w-10 h-px bg-white group-hover:w-16 md:group-hover:w-20 transition-all duration-700" />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Subliminar */}
        <div className="flex flex-col md:flex-row items-center justify-between w-full pb-8 md:pb-10 border-t border-stone-100 pt-8 text-stone-300 gap-4 mt-12 md:mt-24">
          <div className="flex items-center space-x-3">
            <div className="animate-pulse">
              <Sparkles className="w-4 h-4 text-[#C082A0]" />
            </div>
            <span className="text-[8px] md:text-[9px] font-bold uppercase tracking-[0.4em]">Sinta a Magia do Hibisco</span>
          </div>
          <div className="text-[8px] md:text-[9px] font-bold uppercase tracking-[0.4em]">© 2026 Flor de Hibisco</div>
        </div>
      </div>
    </div>
  );
};

export default Entrance;
