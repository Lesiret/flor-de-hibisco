
import React from 'react';
import { Heart, Moon, Sun, Star, Feather, Sparkles } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-white pt-48 pb-32 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Cabeçalho de História */}
        <div className="flex flex-col items-center text-center mb-32">
          <span className="text-[#C082A0] font-cinzel text-[10px] font-bold tracking-[0.8em] uppercase mb-6">Manifesto</span>
          <h1 className="text-5xl md:text-7xl font-cinzel font-bold text-[#1A1518] mb-8">Nossa Essência</h1>
          <div className="w-12 h-1 bg-stone-100" />
        </div>

        {/* Sessão 1: Imagem de Destaque e Texto Atualizado */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="relative group overflow-hidden shadow-2xl bg-[#FAF9F6] border border-stone-50 rounded-[2rem] md:rounded-[3rem]">
            <img 
              src="/images/sobre.png" 
              alt="Essência Flor de Hibisco Oficial" 
              className="w-full h-[700px] object-cover smooth-hover group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-[#C082A0]/5 group-hover:bg-transparent transition-colors pointer-events-none" />
          </div>
          
          <div className="space-y-12">
            <div className="flex items-center space-x-6 text-[#C082A0]">
              <Feather className="w-10 h-10" />
              <h2 className="text-3xl font-cinzel font-bold text-[#1A1518]">O Propósito</h2>
            </div>
            
            <div className="space-y-8 text-stone-500 font-light leading-relaxed text-xl font-playfair italic">
              <p>
                A <strong className="text-[#1A1518]">Flor de Hibisco</strong> é uma marca espiritual criada para integrar intenção e energia ao dia a dia.
              </p>
              <p>
                Acreditamos que a espiritualidade não precisa estar distante da rotina. Ela pode estar presente nos pequenos rituais, no cuidado com o corpo e energia, na organização do espaço e na definição de objetivos.
              </p>
              <p>
                Cada produto é desenvolvido com propósito, cuidado, atenção aos detalhes e intenção direcionada para fortalecer sua energia, seja no autocuidado ou na sua prática espiritual.
              </p>
              <p>
                Criamos fórmulas artesanais que acompanham sua jornada pessoal.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-12">
              {[
                { icon: Moon, label: 'Intuição' },
                { icon: Sun, label: 'Claridade' },
                { icon: Heart, label: 'Cuidado' }
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center p-8 bg-[#FAF9F6] group hover:bg-white smooth-hover shadow-premium-hover border border-stone-50 rounded-2xl">
                  <item.icon className="w-8 h-8 text-[#C082A0] mb-4 group-hover:scale-110 smooth-hover" />
                  <span className="text-[9px] uppercase font-bold tracking-[0.2em] text-stone-400">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
