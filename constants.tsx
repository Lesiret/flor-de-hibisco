
import React from 'react';
import { ShoppingCart, Instagram, MessageCircle, Music2, Moon, Sparkles, MapPin } from 'lucide-react';
import { Product, SocialLink } from './types';

interface LogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "full" | "icon" | "text";
}

// URLs das imagens (Convertidas para link direto do Google Drive)
const LOGO_URL = "https://lh3.googleusercontent.com/d/1_q9GD-BjZmXaqDAQ9yaguxsHwdc_M-fO";
const ICON_URL = "https://lh3.googleusercontent.com/d/1mHtq5EoFMVd1IxzpoSf5-j1CnGbZgMlZ";

export const Logo = ({ size = "lg", variant = "full" }: LogoProps) => {
  // Ajuste de tamanho responsivo para a logo principal
  const containerSize = size === "lg" ? "w-48 h-48 sm:w-60 sm:h-60 md:w-72 md:h-72" : size === "md" ? "w-28 h-28" : "w-12 h-12";
  
  // Variante para Navbar e Footer: Novo Ícone enviado pelo usuário
  if (variant === "text" || variant === "icon") {
    return (
      <div className="flex items-center space-x-3 group cursor-pointer">
        <div className="w-10 h-10 rounded-full overflow-hidden shadow-md bg-white border border-[#C082A0]/20 flex items-center justify-center relative">
           <img 
              src={ICON_URL} 
              alt="Ícone Flor de Hibisco" 
              className="w-full h-full object-cover transform scale-[1.8] group-hover:scale-[2] transition-transform duration-500" 
           />
        </div>
        {variant === "text" && (
          <span className="font-cinzel font-bold text-white tracking-[0.25em] text-[10px] uppercase group-hover:text-stone-100 transition-colors">
            Flor de Hibisco
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center group select-none">
      <div className={`relative ${containerSize} rounded-[1.5rem] sm:rounded-[2rem] md:rounded-[2.5rem] bg-[#C082A0] shadow-2xl overflow-hidden transition-all duration-700 hover:scale-105`}>
        <img 
          src={LOGO_URL} 
          alt="Logo Flor de Hibisco Principal" 
          className="w-full h-full object-cover"
        />
      </div>
      
      {size === 'lg' && (
        <div className="mt-8 md:mt-12 flex flex-col items-center animate-fade">
          <div className="h-[1px] md:h-[2px] w-12 md:w-16 bg-[#C082A0]/20 mb-3 md:mb-4" />
          <span className="text-stone-400 font-cinzel font-bold text-[8px] md:text-[10px] tracking-[0.4em] md:tracking-[0.6em] uppercase opacity-60">
            Alquimia & Oráculos
          </span>
        </div>
      )}
    </div>
  );
};

export const PRODUCTS: Product[] = [
  {
    id: 'sabonetes-condicao',
    name: 'Sabonetes de Condição',
    price: 45.00,
    category: 'Banhos',
    image: 'https://images.unsplash.com/photo-1661450159298-d58a3b98f3a4?q=80&w=880&auto=format&fit=crop',
    description: 'Sabonetes artesanais consagrados para limpeza e atração de novas energias.',
    weight: 0.2, width: 12, height: 4, length: 12
  },
  {
    id: 'oleos-condicao',
    name: 'Óleos de Condição',
    price: 210.00,
    category: 'Óleos',
    image: 'https://lh3.googleusercontent.com/d/1Jlaf26XG6m6BVOJpsvBcyYIjYu2D-DVH',
    description: 'Alquimias potentes para atrair prosperidade, saúde e abertura de caminhos.',
    weight: 0.4, width: 8, height: 15, length: 8
  }
];

export const SOCIAL_LINKS: SocialLink[] = [
  { 
    label: 'Conversar no whatsapp', 
    url: 'https://api.whatsapp.com/send?phone=5548988365882&text=Oie!%20Gostaria%20de%20agendar%20um%20horário.', 
    icon: 'MessageCircle', 
    highlight: true 
  },
  { label: 'Instagram', url: 'https://www.instagram.com/jesscartomancia/', icon: 'Instagram' },
  { label: 'Loja Shopee', url: 'https://br.shp.ee/KvMGXs5', icon: 'ShoppingCart' },
  { label: 'TikTok', url: 'https://www.tiktok.com/@jesscartomancia', icon: 'Music2' }
];
