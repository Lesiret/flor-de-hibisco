
import React, { useState } from 'react';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, Truck, MapPin, Loader2, Check, AlertTriangle, ChevronRight } from 'lucide-react';
import { CartItem, ShippingConfig, ShippingOption, Address } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  shippingConfig: ShippingConfig;
  addresses: Address[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onClearCart: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, items, shippingConfig, addresses, onUpdateQuantity, onRemove, onClearCart }) => {
  const [cep, setCep] = useState('');
  const [calculating, setCalculating] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [selectedOption, setSelectedOption] = useState<ShippingOption | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showAddressSelector, setShowAddressSelector] = useState(false);

  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const isFreeShipping = subtotal >= shippingConfig.freeShippingThreshold;
  
  const finalShippingCost = isFreeShipping ? 0 : (selectedOption?.price || 0);
  const total = subtotal + finalShippingCost;

  const maskCEP = (val: string) => val.replace(/\D/g, '').replace(/(\d{5})(\d)/, '$1-$2').substring(0, 9);

  const handleSelectSavedAddress = (addr: Address) => {
    setCep(addr.zipCode);
    setShowAddressSelector(false);
    // Trigger calculation automatically
    setTimeout(() => {
      const btn = document.getElementById('btn-calculate-shipping');
      if (btn) btn.click();
    }, 100);
  };

  /**
   * CÁLCULO REAL INTEGRADO
   * Esta função agora realiza uma chamada real para o seu endpoint de backend.
   */
  const handleCalculateShipping = async () => {
    if (cep.length < 9) return;
    
    if (!shippingConfig.originZipCode) {
      setError("CEP de origem não configurado no painel Admin.");
      return;
    }
    
    setCalculating(true);
    setError(null);
    setShippingOptions([]);
    setSelectedOption(null);
    
    try {
      const payload = {
        from: shippingConfig.originZipCode.replace(/\D/g, ''),
        to: cep.replace(/\D/g, ''),
        value: subtotal
      };

const response = await fetch('/api/shipping', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    from: payload.from,
    to: payload.to,
    value: payload.value
  })
});

if (!response.ok) {
  const text = await response.text();
  throw new Error(`Erro no servidor de frete: ${text}`);
}

const text = await response.text();
console.log("Resposta da API:", text);

const data = JSON.parse(text);

const validOptions: ShippingOption[] = Array.isArray(data) 
  ? data.map((opt: any) => ({
      id: String(opt.id),
      company: opt.company,
      name: opt.name,
      price: Number(opt.price) + (shippingConfig.flatRate || 0),
      delivery_time: opt.delivery_time
    }))
  : [];

      if (validOptions.length === 0) {
        setError("Nenhuma transportadora disponível para este CEP.");
      } else {
        setShippingOptions(validOptions);
        setSelectedOption(validOptions[0]);
      }
    } catch (err: any) {
      console.error("Erro na Logística:", err);
      setError(err.message || "Erro ao conectar com o servidor de frete.");
    } finally {
      setCalculating(false);
    }
  };

  const handleCheckout = async () => {
    setCheckingOut(true);
    setError(null);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity
          })),
          shippingCost: finalShippingCost,
          customerEmail: 'cliente@exemplo.com'
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Falha ao iniciar checkout');
      }

      const { init_point } = await response.json();
      
      // Redireciona para o checkout do Mercado Pago
      window.location.href = init_point;
    } catch (err: any) {
      console.error("Erro no Checkout:", err);
      setError(err.message || "Erro ao processar pagamento. Verifique se o Mercado Pago está configurado.");
    } finally {
      setCheckingOut(false);
    }
  };

  return (
    <>
      <div className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[1000] transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose} />
      
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-[1001] shadow-2xl transition-transform duration-700 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-8 border-b border-stone-100 flex items-center justify-between bg-[#FAF9F6]">
            <div className="flex items-center space-x-4">
              <ShoppingBag className="w-5 h-5 text-[#C082A0]" />
              <div className="flex flex-col">
                <h2 className="font-cinzel font-bold text-xs uppercase tracking-[0.4em]">Sua Sacola</h2>
                {items.length > 0 && (
                  <button onClick={onClearCart} className="flex items-center space-x-1 text-[8px] font-bold uppercase tracking-widest text-red-400 mt-1"><Trash2 className="w-2.5 h-2.5" /> <span>Limpar</span></button>
                )}
              </div>
            </div>
            <button onClick={onClose} className="p-2 text-stone-300 hover:text-[#1A1518]"><X className="w-6 h-6" /></button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-30">
                <ShoppingBag className="w-12 h-12 text-stone-200" />
                <p className="font-playfair italic">Sua sacola está vazia.</p>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex space-x-6 group">
                  <div className="w-20 h-28 bg-stone-50 rounded-xl overflow-hidden shadow-sm border border-stone-100">
                    <img src={item.image} className="w-full h-full object-cover" alt={item.name} referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div className="flex justify-between">
                      <h3 className="font-cinzel font-bold text-[11px] uppercase tracking-widest">{item.name}</h3>
                      <button onClick={() => onRemove(item.id)} className="text-stone-200 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center border border-stone-100 bg-[#FAF9F6] rounded-lg">
                        <button onClick={() => onUpdateQuantity(item.id, -1)} className="p-1.5 hover:text-[#C082A0]"><Minus className="w-3 h-3" /></button>
                        <span className="w-6 text-center text-[10px] font-bold">{item.quantity}</span>
                        <button onClick={() => onUpdateQuantity(item.id, 1)} className="p-1.5 hover:text-[#C082A0]"><Plus className="w-3 h-3" /></button>
                      </div>
                      <span className="font-cinzel font-bold text-xs">R$ {(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Logistics Section */}
          {items.length > 0 && (
            <div className="p-8 bg-[#FAF9F6] border-t border-stone-100 space-y-6">
              
              <div className="space-y-4 bg-white p-6 rounded-[2rem] border border-stone-100 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-[9px] font-bold uppercase tracking-widest text-stone-400">
                    <Truck className="w-3.5 h-3.5" /> <span>Cálculo Real</span>
                  </div>
                  {isFreeShipping && <span className="text-[8px] bg-green-50 text-green-500 px-2 py-0.5 rounded-full font-black uppercase">Grátis</span>}
                </div>

                <div className="flex space-x-2">
                  <div className="relative flex-1">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-200" />
                    <input 
                      type="text" 
                      placeholder="CEP de Destino" 
                      value={cep}
                      onChange={e => setCep(maskCEP(e.target.value))}
                      className="w-full bg-[#FAF9F6] border-none py-3 pl-10 pr-4 rounded-xl text-xs"
                    />
                  </div>
                  {addresses.length > 0 && (
                    <button 
                      type="button"
                      onClick={() => setShowAddressSelector(!showAddressSelector)}
                      className={`p-3 rounded-xl border transition-all ${showAddressSelector ? 'bg-[#C082A0] text-white border-[#C082A0]' : 'bg-[#FAF9F6] text-stone-400 border-transparent hover:border-stone-200'}`}
                      title="Usar endereço salvo"
                    >
                      <MapPin className="w-4 h-4" />
                    </button>
                  )}
                  <button 
                    id="btn-calculate-shipping"
                    onClick={handleCalculateShipping}
                    disabled={calculating || cep.length < 9}
                    className="px-6 bg-[#1A1518] text-white text-[9px] font-bold uppercase tracking-widest rounded-xl hover:bg-[#C082A0] transition-all disabled:bg-stone-100 disabled:text-stone-300"
                  >
                    {calculating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Calcular'}
                  </button>
                </div>

                {showAddressSelector && addresses.length > 0 && (
                  <div className="space-y-2 pt-2 animate-in fade-in slide-in-from-top-2">
                    <p className="text-[8px] font-bold uppercase tracking-widest text-stone-300 mb-2">Seus Endereços Salvos</p>
                    {addresses.map((addr) => (
                      <button 
                        key={addr.id}
                        type="button"
                        onClick={() => handleSelectSavedAddress(addr)}
                        className="w-full flex items-center space-x-3 p-3 rounded-xl border border-stone-100 bg-[#FAF9F6] hover:bg-white hover:border-[#C082A0]/30 transition-all text-left group"
                      >
                        <MapPin className="w-3.5 h-3.5 text-[#C082A0]" />
                        <div className="flex-1">
                          <p className="text-[9px] font-bold uppercase tracking-widest text-[#1A1518]">{addr.name}</p>
                          <p className="text-[8px] text-stone-400 truncate">{addr.street}, {addr.number} - {addr.zipCode}</p>
                        </div>
                        <ChevronRight className="w-3 h-3 text-stone-200 group-hover:text-[#C082A0] transition-colors" />
                      </button>
                    ))}
                  </div>
                )}

                {error && (
                   <div className="p-3 bg-red-50 rounded-xl flex items-center space-x-2 text-red-500 text-[10px] font-bold uppercase tracking-widest">
                     <AlertTriangle className="w-4 h-4" />
                     <span className="leading-tight">{error}</span>
                   </div>
                )}
                
                {shippingOptions.length > 0 && !calculating && (
                  <div className="space-y-2 pt-2 animate-in fade-in slide-in-from-top-2">
                    {shippingOptions.map((opt) => (
                      <button 
                        key={opt.id}
                        onClick={() => setSelectedOption(opt)}
                        className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all text-left group ${selectedOption?.id === opt.id ? 'border-[#C082A0] bg-[#C082A0]/5' : 'border-stone-100 hover:border-stone-200 bg-white'}`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-1.5 h-1.5 rounded-full transition-all ${selectedOption?.id === opt.id ? 'bg-[#C082A0] scale-125' : 'bg-stone-100 group-hover:bg-stone-200'}`} />
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#1A1518]">{opt.company} {opt.name}</p>
                            <p className="text-[9px] text-stone-400">{opt.delivery_time} dias úteis</p>
                          </div>
                        </div>
                        <span className={`text-[10px] font-bold ${isFreeShipping ? 'text-green-500' : 'text-[#C082A0]'}`}>
                          {isFreeShipping ? 'Grátis' : `R$ ${opt.price.toFixed(2)}`}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Totals */}
              <div className="space-y-3">
                <div className="flex justify-between text-stone-400 text-[10px] font-bold uppercase tracking-widest">
                  <span>Subtotal</span>
                  <span>R$ {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-stone-400 text-[10px] font-bold uppercase tracking-widest">
                  <span>Entrega ({selectedOption?.name || '...'})</span>
                  <span className={isFreeShipping ? 'text-green-500 font-bold' : ''}>
                    {isFreeShipping ? 'GRÁTIS' : selectedOption ? `R$ ${selectedOption.price.toFixed(2)}` : 'A calcular'}
                  </span>
                </div>
                <div className="flex justify-between text-[#1A1518] font-cinzel font-bold text-xl border-t border-stone-100 pt-4">
                  <span>Total</span>
                  <span>R$ {total.toFixed(2)}</span>
                </div>
              </div>

              <button 
                onClick={handleCheckout}
                disabled={(!selectedOption && !isFreeShipping) || checkingOut}
                className={`w-full py-5 rounded-full text-[10px] font-bold uppercase tracking-[0.5em] transition-all shadow-xl flex items-center justify-center space-x-4 group ${((!selectedOption && !isFreeShipping) || checkingOut) ? 'bg-stone-100 text-stone-300' : 'bg-[#1A1518] text-white hover:bg-[#C082A0]'}`}
              >
                {checkingOut ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Finalizar Compra</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartDrawer;
