
import React, { useEffect, useState } from 'react';
import { Search, ShoppingCart, Star, ArrowRight, X, Plus, Minus, CheckCircle2, Heart } from 'lucide-react';
import { Product } from '../types';

interface StoreProps {
  initialCategory?: string;
  onAddToCart: (product: Product, quantity: number) => void;
  onToggleWishlist: (id: string) => void;
  wishlist: string[];
  products: Product[];
}

const Store: React.FC<StoreProps> = ({ initialCategory = 'Todos', onAddToCart, onToggleWishlist, wishlist, products }) => {
  const categories = ['Todos', 'Óleos', 'Banhos', 'Pós'];
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    setSelectedCategory(initialCategory);
  }, [initialCategory]);

  const filteredProducts = selectedCategory === 'Todos' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  const openProduct = (product: Product) => {
    setActiveProduct(product);
    setQuantity(1);
    setAddedToCart(false);
    document.body.style.overflow = 'hidden';
  };

  const closeProduct = () => {
    setActiveProduct(null);
    document.body.style.overflow = 'unset';
  };

  const handleAddToCart = () => {
    if (activeProduct) {
      onAddToCart(activeProduct, quantity);
      setAddedToCart(true);
      setTimeout(() => {
        setAddedToCart(false);
        closeProduct();
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-white pt-24 md:pt-32 pb-16 md:pb-24">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center mb-12 md:mb-20">
          <span className="text-[#C082A0] font-cinzel text-[8px] md:text-[10px] font-bold tracking-[0.5em] md:tracking-[0.6em] uppercase mb-3 md:mb-4">The Collection</span>
          <h1 className="text-3xl md:text-5xl font-cinzel font-bold text-[#1A1518] mb-4 md:mb-6 leading-tight">
            {selectedCategory === 'Todos' ? 'A Loja' : selectedCategory}
          </h1>
          <div className="w-12 md:w-16 h-0.5 bg-stone-100" />
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 mb-10 md:mb-16 pb-6 md:pb-8 border-b border-stone-50">
          <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar w-full md:w-auto pb-2 md:pb-0">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 md:px-5 py-2 text-[9px] md:text-[10px] font-bold uppercase tracking-widest whitespace-nowrap smooth-hover rounded-lg md:rounded-none ${
                  selectedCategory === cat ? 'bg-[#1A1518] text-white shadow-lg' : 'text-stone-400 hover:text-[#1A1518] bg-stone-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="flex items-center space-x-4 w-full md:w-auto">
            <div className="relative group flex-1 md:w-64">
              <input 
                type="text" 
                placeholder="Procurar produto..." 
                className="w-full bg-[#FAF9F6] border-none py-2.5 md:py-3 pl-10 pr-4 text-xs focus:ring-1 focus:ring-[#C082A0]/20 rounded-xl" 
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300" />
            </div>
          </div>
        </div>

        {/* Grade de produtos ajustada para 2 colunas no mobile e gap reduzido para celular */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-3 sm:gap-x-6 md:gap-x-12 gap-y-8 sm:gap-y-12 md:gap-y-20">
          {filteredProducts.map(product => (
            <div key={product.id} className="group flex flex-col">
              <div 
                className="relative aspect-[4/5] md:aspect-[3/4] overflow-hidden bg-stone-50 mb-3 md:mb-8 border border-stone-100 shadow-premium shadow-premium-hover smooth-hover rounded-[1rem] sm:rounded-[1.5rem] md:rounded-[2rem]"
              >
                <img onClick={() => openProduct(product)} src={product.image} className="w-full h-full object-cover transition-transform duration-[2.5s] group-hover:scale-105 cursor-pointer" alt={product.name} />
                
                <button 
                  onClick={() => onToggleWishlist(product.id)}
                  className={`absolute top-2 sm:top-4 md:top-6 right-2 sm:right-4 md:right-6 p-2 sm:p-2.5 md:p-3 rounded-full backdrop-blur transition-all duration-500 z-10 ${wishlist.includes(product.id) ? 'bg-[#C082A0] text-white' : 'bg-white/60 text-white hover:bg-white hover:text-[#C082A0]'}`}
                >
                  <Heart className={`w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 ${wishlist.includes(product.id) ? 'fill-current' : ''}`} />
                </button>

                {/* Botão simplificado para mobile para não poluir a imagem pequena */}
                <button onClick={() => openProduct(product)} className="absolute bottom-2 sm:bottom-4 md:bottom-6 left-2 sm:left-4 md:left-6 right-2 sm:right-4 md:right-6 bg-[#1A1518]/90 backdrop-blur-md text-white py-2 sm:py-3 md:py-4 rounded-full text-[7px] sm:text-[8px] md:text-[9px] font-bold uppercase tracking-[0.1em] sm:tracking-[0.2em] md:tracking-[0.3em] md:translate-y-20 md:group-hover:translate-y-0 smooth-hover flex items-center justify-center space-x-1 sm:space-x-2 md:space-x-3 z-20 shadow-xl">
                  <ShoppingCart className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
                  <span>Ver Detalhes</span>
                </button>
              </div>
              <div className="space-y-1 sm:space-y-2 md:space-y-3 px-1 md:px-2">
                <h3 onClick={() => openProduct(product)} className="text-sm sm:text-lg md:text-xl font-cinzel font-bold text-[#1A1518] group-hover:text-[#C082A0] smooth-hover cursor-pointer leading-tight truncate">{product.name}</h3>
                <p className="text-stone-400 text-[10px] sm:text-[11px] md:text-sm italic line-clamp-1 sm:line-clamp-2">{product.description}</p>
                <div className="pt-2 md:pt-4 flex items-center justify-between border-t border-stone-50">
                  <span className="text-xs sm:text-base md:text-lg font-cinzel font-bold text-[#1A1518]">R$ {product.price.toFixed(2)}</span>
                  <button onClick={() => openProduct(product)} className="text-[7px] sm:text-[8px] md:text-[9px] font-bold uppercase tracking-widest text-stone-400 hover:text-[#C082A0] flex items-center space-x-1">
                    <span className="hidden sm:inline">Ver</span>
                    <ArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {activeProduct && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center px-0 md:px-6">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-500" onClick={closeProduct} />
            <div className="relative bg-white w-full max-w-5xl h-full md:h-auto md:max-h-[95vh] overflow-y-auto md:overflow-hidden flex flex-col md:flex-row animate-in md:zoom-in-95 duration-500 shadow-2xl md:rounded-[2.5rem]">
              <button onClick={closeProduct} className="absolute top-4 md:top-8 right-4 md:right-8 z-30 p-2.5 md:p-3 bg-white/20 backdrop-blur rounded-full text-white hover:bg-white hover:text-[#1A1518] transition-all">
                <X className="w-6 h-6" />
              </button>
              <div className="w-full md:w-[50%] h-[350px] sm:h-[450px] md:h-auto overflow-hidden bg-stone-100 p-0 md:p-6">
                <img src={activeProduct.image} className="w-full h-full object-cover md:rounded-[2rem]" alt={activeProduct.name} />
              </div>
              <div className="w-full md:w-[50%] p-8 md:p-14 flex flex-col bg-white">
                <div className="flex-1">
                  <span className="text-[#C082A0] font-cinzel text-[8px] md:text-[9px] font-bold tracking-[0.5em] md:tracking-[0.8em] uppercase mb-4 md:mb-8 block">{activeProduct.category}</span>
                  <h2 className="text-2xl md:text-4xl font-cinzel font-bold text-[#1A1518] mb-4 md:mb-8 leading-tight">{activeProduct.name}</h2>
                  <div className="flex items-center space-x-4 mb-6 md:mb-10 pb-6 md:pb-10 border-b border-stone-50">
                    <span className="text-xl md:text-2xl font-cinzel font-bold text-[#1A1518]">R$ {activeProduct.price.toFixed(2)}</span>
                    <div className="flex text-[#C082A0]/30 space-x-0.5">{[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}</div>
                  </div>
                  <p className="text-stone-500 text-sm md:text-lg font-playfair italic leading-relaxed mb-8">{activeProduct.description}</p>
                </div>

                <div className="pt-6 md:pt-10 border-t border-stone-100 mt-auto">
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
                    <div className="flex flex-col space-y-3">
                      <span className="text-[8px] font-bold uppercase tracking-widest text-stone-300">Quantidade</span>
                      <div className="flex items-center bg-[#FAF9F6] border border-stone-100 p-1 rounded-lg w-fit">
                        <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-3 py-2 text-stone-400 hover:text-[#1A1518]"><Minus className="w-3.5 h-3.5" /></button>
                        <span className="w-8 text-center font-bold text-xs">{quantity}</span>
                        <button onClick={() => setQuantity(q => q + 1)} className="px-3 py-2 text-stone-400 hover:text-[#1A1518]"><Plus className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                    <div className="text-left sm:text-right">
                      <span className="text-[8px] font-bold uppercase tracking-widest text-stone-300 block mb-1">Subtotal</span>
                      <span className="text-xl md:text-2xl font-cinzel font-bold text-[#C082A0]">R$ {(activeProduct.price * quantity).toFixed(2)}</span>
                    </div>
                  </div>

                  <button 
                    onClick={handleAddToCart}
                    disabled={addedToCart}
                    className={`group w-full py-4 md:py-5 text-[9px] font-bold uppercase tracking-[0.4em] md:tracking-[0.5em] transition-all duration-500 flex items-center justify-center relative overflow-hidden rounded-full ${
                      addedToCart ? 'bg-stone-100 text-[#C082A0]' : 'bg-[#1A1518] text-white hover:bg-[#C082A0] shadow-xl'
                    }`}
                  >
                    {addedToCart ? (
                      <div className="flex items-center space-x-3 animate-in fade-in slide-in-from-bottom-2">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Item Adicionado</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-3 group-hover:translate-x-1 transition-transform">
                        <span>Adicionar à Sacola</span>
                        <ArrowRight className="w-4 h-4 opacity-50" />
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Store;
