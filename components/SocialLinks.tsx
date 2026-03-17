
import React from 'react';
import { MessageCircle, Instagram, Music2, Moon, MapPin, ExternalLink, Sparkles, Star, Heart, ShoppingCart } from 'lucide-react';
import { SOCIAL_LINKS } from '../constants';

const IconMap: any = {
  MessageCircle,
  Instagram,
  Music2,
  Moon,
  MapPin,
  ShoppingCart
};

const SocialLinks: React.FC = () => {
  return (
    <div className="min-h-screen pt-32 pb-20 flex flex-col items-center bg-[#FAF9F6] px-6">
      <div className="max-w-xl w-full flex flex-col items-center">
        {/* Clean Profile Section */}
        <div className="text-center mb-16 space-y-6">
          <div className="relative w-32 h-32 mx-auto mb-8">
            <div className="w-full h-full rounded-full border border-[#C082A0]/20 p-2 bg-white shadow-xl overflow-hidden">
              <img 
                src="/images/social.jpg" 
                alt="Flor de Hibisco Profile" 
                className="w-full h-full rounded-full object-cover scale-[1.2]"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-white p-2 rounded-full shadow-md text-[#C082A0]">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          
          <div className="space-y-1">
            <h1 className="text-3xl font-cinzel font-bold text-[#2D2429] uppercase tracking-widest">Jess</h1>
          </div>
          
          <p className="text-stone-400 font-playfair italic text-lg leading-relaxed">
            "Guiando mulheres a redescobrirem seu caminho próprio com tarot & amor próprio."
          </p>
        </div>

        {/* Minimalist Link List */}
        <div className="w-full space-y-4">
          {SOCIAL_LINKS.map((link, idx) => {
            const Icon = IconMap[link.icon];
            return (
              <a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`group flex items-center justify-between p-5 transition-all border rounded-2xl ${
                  link.highlight 
                  ? 'bg-[#C082A0] border-[#C082A0] text-white shadow-lg hover:bg-[#A66B88]' 
                  : 'bg-white border-stone-100 text-[#2D2429] hover:border-[#C082A0]/30 hover:shadow-sm'
                }`}
              >
                <div className="flex items-center space-x-5">
                  <div className={`p-2 rounded-none ${link.highlight ? 'text-white' : 'text-[#C082A0]'}`}>
                    {Icon && <Icon className="w-5 h-5" />}
                  </div>
                  <span className="font-cinzel font-bold tracking-widest text-xs uppercase">
                    {link.label}
                  </span>
                </div>
                <ExternalLink className={`w-4 h-4 opacity-30 group-hover:opacity-100 transition-opacity`} />
              </a>
            );
          })}
        </div>

        {/* Professional Footer */}
        <div className="mt-20 text-center opacity-30">
          <div className="flex justify-center space-x-2 mb-4">
            <Star className="w-3 h-3 fill-current" />
            <Star className="w-3 h-3 fill-current" />
            <Star className="w-3 h-3 fill-current" />
          </div>
          <p className="text-[8px] font-bold uppercase tracking-[0.8em]">Flor de Hibisco © 2026</p>
        </div>
      </div>
    </div>
  );
};

export default SocialLinks;
