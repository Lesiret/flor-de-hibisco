
import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles, Moon, Sun } from 'lucide-react';
import { ViewState } from '../types';

interface HomeProps {
  onNavigate: (view: ViewState, category?: string) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // URLs das imagens para Desktop
  const desktopImages = [
  "/images/carrossel.png",
  "/images/carrossel2.png",
  "/images/carrossel3.png"
  ];

  // URLs das imagens para Mobile
  const mobileImages = [
  "/images/carrosselCEL1.png",
  "/images/carrosselCEL2.png",
  "/images/carrosselCEL3.png"
  ];

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const carouselImages = isMobile ? mobileImages : desktopImages;

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);

  useEffect(() => {
    const timer = setInterval(nextSlide, 7000);
    return () => clearInterval(timer);
  }, [carouselImages.length]);

  return (
    <div className="flex flex-col w-full bg-[#FAF9F6]">
      {/* Hero Carousel - Imagens específicas para Mobile e Desktop */}
      <section className="relative w-full overflow-hidden mt-[64px] md:mt-[72px] bg-[#C082A0] aspect-[16/7] sm:aspect-[16/8] md:aspect-[21/9] lg:aspect-[21/7] xl:aspect-[21/6] max-h-[750px] min-h-[180px] sm:min-h-[250px]">
        {carouselImages.map((img, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-[1500ms] ease-in-out ${
              idx === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
          >
            {/* object-cover no mobile para legibilidade, object-contain no desktop para evitar cortes na arte horizontal */}
            <img 
              src={img} 
              className="w-full h-full object-cover md:object-contain object-center image-render-quality" 
              alt={`Arte Sagrada ${idx + 1}`} 
              referrerPolicy="no-referrer"
            />
          </div>
        ))}
        
        {/* Controles do Carrossel - Visíveis em todos os dispositivos com tamanhos adaptáveis */}
        <button 
          onClick={prevSlide} 
          className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 z-30 p-2 md:p-3 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white hover:text-[#1A1518] transition-all flex shadow-xl"
        >
          <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
        </button>
        <button 
          onClick={nextSlide} 
          className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 z-30 p-2 md:p-3 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white hover:text-[#1A1518] transition-all flex shadow-xl"
        >
          <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
        </button>

        {/* Indicadores de Slide */}
        <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-30 flex space-x-2">
          {carouselImages.map((_, idx) => (
            <button 
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-1 rounded-full transition-all duration-500 ${idx === currentSlide ? 'w-6 md:w-8 bg-white' : 'w-1.5 md:w-2 bg-white/40 hover:bg-white/60'}`}
            />
          ))}
        </div>
      </section>

      {/* Intro Manifesto */}
      <section className="py-16 md:py-24 px-6 max-w-5xl mx-auto text-center border-b border-stone-100">
        <div className="flex justify-center space-x-6 mb-6 md:mb-8 text-[#C082A0]">
           <Moon className="w-5 h-5" />
           <Sparkles className="w-5 h-5" />
           <Sun className="w-5 h-5" />
        </div>
        <h2 className="text-2xl md:text-5xl font-cinzel font-bold text-[#1A1518] mb-6 md:mb-8 tracking-[0.1em]">Espiritualidade prática no dia a dia</h2>
        <p className="text-stone-500 text-base md:text-lg font-playfair italic leading-relaxed max-w-4xl mx-auto">
          "Cada produto foi pensado para transformar o cuidado com a sua energia em um ritual prático, alinhado com as suas intenções. Feitos de maneira artesanal e consagrados com propósito."
        </p>
      </section>

      {/* Middle Banners */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 px-4 md:px-12 py-16 md:py-24 max-w-7xl mx-auto w-full">
        <div 
          onClick={() => onNavigate('store', 'Óleos')}
          className="group relative h-[400px] md:h-[500px] overflow-hidden cursor-pointer shadow-2xl rounded-[2rem] md:rounded-[2.5rem]"
        >
          <img 
            src="/images/meio1.jpg" 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2.5s]" 
            alt="Óleos de Intenção"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent group-hover:via-black/30 transition-all" />
          <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
            <span className="text-[#C082A0] font-cinzel text-[8px] md:text-[10px] font-bold tracking-[0.4em] md:tracking-[0.5em] uppercase mb-4">Energia direcionada para seus objetivos</span>
            <h3 className="text-2xl md:text-4xl font-cinzel font-bold text-white mb-4 md:mb-6 tracking-widest uppercase">ÓLEOS DE INTENÇÃO</h3>
            <button className="flex items-center space-x-4 text-[8px] md:text-[9px] font-bold uppercase tracking-[0.3em] md:tracking-[0.4em] text-white">
              <span className="border-b border-white/30 pb-1">VER COLEÇÃO</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-3 transition-transform" />
            </button>
          </div>
        </div>

        <div 
          onClick={() => onNavigate('store', 'Banhos')}
          className="group relative h-[400px] md:h-[500px] overflow-hidden cursor-pointer shadow-2xl rounded-[2rem] md:rounded-[2.5rem]"
        >
          <img 
            src="/images/meio2.jpg" 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2.5s]" 
            alt="Banhos Energéticos"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent group-hover:via-black/30 transition-all" />
          <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
            <span className="text-[#C082A0] font-cinzel text-[8px] md:text-[10px] font-bold tracking-[0.4em] md:tracking-[0.5em] uppercase mb-4">Cuidados e fortalecimento vibracional</span>
            <h3 className="text-2xl md:text-4xl font-cinzel font-bold text-white mb-4 md:mb-6 tracking-widest uppercase">BANHOS ENERGÉTICOS</h3>
            <button className="flex items-center space-x-4 text-[8px] md:text-[9px] font-bold uppercase tracking-[0.3em] md:tracking-[0.4em] text-white">
              <span className="border-b border-white/30 pb-1">VER COLEÇÃO</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-3 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Large Final Banner */}
      <section className="relative h-[500px] md:h-[600px] w-full mt-4 md:mt-8 overflow-hidden cursor-pointer group" onClick={() => onNavigate('about')}>
        <img 
          src="/images/logo.png" 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[6s]" 
          alt="Essência da flor"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-[#1A1518]/60 backdrop-blur-[1px] group-hover:backdrop-blur-0 transition-all duration-1000" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 md:p-8">
          <div className="w-12 md:w-16 h-px bg-[#C082A0] mb-6 md:mb-8" />
          <h3 className="text-3xl md:text-6xl font-cinzel font-bold text-white mb-6 md:mb-8 tracking-[0.1em] max-w-4xl uppercase leading-tight">
            Essência da flor
          </h3>
          <p className="text-stone-300 text-sm md:text-lg font-playfair italic max-w-2xl mb-8 md:mb-10 leading-relaxed px-4">
            "A flor de hibisco une espiritualidade e intenção em produtos criados para fortalecer sua energia e acompanhar sua jornada."
          </p>
          <button className="px-10 md:px-14 py-4 md:py-5 border-2 border-white/20 bg-white/5 backdrop-blur-md text-white text-[8px] md:text-[10px] font-bold uppercase tracking-[0.4em] md:tracking-[0.5em] hover:bg-white hover:text-[#1A1518] hover:border-white transition-all duration-700 shadow-2xl rounded-full">
            Conheça a marca
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;
