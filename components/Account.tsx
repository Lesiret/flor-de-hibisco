import React, { useState } from 'react';
import { 
  User as UserIcon, Package, MapPin, Shield, Heart, 
  LogOut, ChevronRight, Truck, CreditCard, RefreshCcw, Star, Plus, 
  Trash2, X, CheckCircle2, ShieldAlert, Mail, ArrowRight, AlertCircle, LayoutDashboard, ExternalLink
} from 'lucide-react';
import { User, Order, Address, Product, ViewState } from '../types';
import { PRODUCTS } from '../constants';
import { uploadImage } from '../lib/storage';
import { supabase } from '../lib/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';



interface AccountProps {
  user: User;
  products: Product[];
  onLogout: () => void;
  orders: Order[];
  addresses: Address[];
  onAddAddress: (addr: Address) => void;
  onDeleteAddress: (id: string) => void;
  wishlist: string[];
  onToggleWishlist: (id: string) => void;
  onAddToCart: (p: Product, q: number) => void;
  onUpdateUser: (data: Partial<User>) => void;
  onNavigate: (v: ViewState) => void;
  onNotify: (msg: string, type?: 'success' | 'error') => void;
}

type Tab = 'dashboard' | 'orders' | 'addresses' | 'wishlist' | 'security';

const Account: React.FC<AccountProps> = ({ 
  user, products, onLogout, orders, addresses, onAddAddress, onDeleteAddress, wishlist, onToggleWishlist, onAddToCart, onUpdateUser, onNavigate, onNotify 
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [localOrders, setLocalOrders] = useState<Order[]>([]);
  const [ordersSubscription, setOrdersSubscription] = useState<RealtimeChannel | null>(null);  
  
  React.useEffect(() => {
    // Popula inicialmente os pedidos
    const mapped = orders.map(o => ({
      ...o,
      tracking_code: o.tracking_code || ''
    }));
    setLocalOrders(mapped);

    // Configura Realtime
    const subscription = supabase
      .channel('public:orders')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          const newOrder = payload.new as Order;
          setLocalOrders(prev => {
            const updated = [...prev];
            const index = updated.findIndex(o => o.id === newOrder.id);

            if (payload.eventType === 'INSERT') {
              updated.unshift(newOrder);
            } else if (payload.eventType === 'UPDATE' && index !== -1) {
              updated[index] = newOrder;
            } else if (payload.eventType === 'DELETE' && index !== -1) {
              updated.splice(index, 1);
            }

            return updated;
          });
        }
      )
      .subscribe();

    setOrdersSubscription(subscription);

    // Cleanup
    return () => {
      supabase.removeChannel(subscription);
    };
  }, []); 

  const [addressForm, setAddressForm] = useState<Partial<Address>>({
    name: '',
    zipCode: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    type: 'Alternativo'
  });
  
  // Estados para edição de perfil
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user.name || '',
    avatarUrl: user.avatarUrl || ''
  });
  const [isUploading, setIsUploading] = useState(false);

  // Estados para troca de senha
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [touchedPasswords, setTouchedPasswords] = useState({ current: false, new: false, confirm: false });
  
  const [securityStep, setSecurityStep] = useState<'initial' | 'verify'>('initial');

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (isUploading) {
      onNotify("Aguarde o upload da foto ser concluído.", "error");
      return;
    }
    onUpdateUser(profileForm);
    setIsEditingProfile(false);
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      onNotify("Fazendo upload da foto...");
      const url = await uploadImage(file, 'avatars');
      if (url) {
        setProfileForm({ ...profileForm, avatarUrl: url });
        onNotify("Upload concluído!");
      } else {
        onNotify("Erro ao fazer upload da foto.", "error");
      }
    } catch (err) {
      onNotify("Erro inesperado no upload.", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const maskCEP = (val: string) => val.replace(/\D/g, '').replace(/(\d{5})(\d)/, '$1-$2').substring(0, 9);

  // Validações de senha
  // Removido check de user.password pois o Supabase não retorna a senha no objeto user
  const areNewPasswordsMatching = passwords.new === passwords.confirm;
  const isConfirmError = touchedPasswords.confirm && !areNewPasswordsMatching && passwords.confirm !== '';
  const isNewPassValid = passwords.new.length >= 6;
  const isNewError = touchedPasswords.new && !isNewPassValid && passwords.new !== '';

  const isPasswordFormValid = areNewPasswordsMatching && isNewPassValid && passwords.current.length > 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pagamento aprovado': return 'text-green-500 bg-green-50';
      case 'Produto enviado': return 'text-[#C082A0] bg-[#C082A0]/5';
      case 'Entregue': return 'text-stone-400 bg-stone-50';
      case 'Pagamento em análise': return 'text-amber-500 bg-amber-50';
      case 'Aguardando envio': return 'text-blue-500 bg-blue-50';
      default: return 'text-stone-500 bg-stone-100';
    }
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    const newAddr: Address = {
      ...addressForm as Address,
      id: `addr-${Date.now()}`
    };
    onAddAddress(newAddr);
    setIsAddingAddress(false);
    setAddressForm({
      name: '',
      zipCode: '',
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      type: 'Alternativo'
    });
    onNotify("Endereço adicionado com sucesso!");
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordFormValid) {
      if (passwords.current.length === 0) onNotify("Informe sua senha atual.", "error");
      else if (!areNewPasswordsMatching) onNotify("As novas senhas não coincidem.", "error");
      else if (!isNewPassValid) onNotify("A nova senha deve ter 6+ caracteres.", "error");
      return;
    }
    onUpdateUser({ password: passwords.new });
    setPasswords({ current: '', new: '', confirm: '' });
    setTouchedPasswords({ current: false, new: false, confirm: false });
  };
  
  const wishlistProducts = products.filter(p =>
  wishlist.includes(p.id)
);

  return (
    <div className="min-h-screen bg-[#FAF9F6] pt-32 pb-24 px-6 relative">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
        
        {/* Sidebar */}
        <div className="w-full lg:w-80 flex flex-col space-y-4">
          <div className="bg-white p-8 rounded-[2rem] shadow-premium border border-stone-100">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-[#C082A0]/10 flex items-center justify-center text-[#C082A0] overflow-hidden">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <UserIcon className="w-8 h-8" />
                )}
              </div>
              <div>
                <h2 className="font-cinzel font-bold text-[#1A1518] leading-tight">{user.name?.split(' ')[0] || 'Cliente'}</h2>
                <p className="text-[10px] text-stone-400 uppercase tracking-widest font-bold">Guardiã de Luz</p>
              </div>
            </div>
            <div className="space-y-2">
               {[
                 { id: 'dashboard', icon: UserIcon, label: 'Resumo' },
                 { id: 'orders', icon: Package, label: 'Meus Pedidos' },
                 { id: 'wishlist', icon: Heart, label: 'Favoritos' },
                 { id: 'addresses', icon: MapPin, label: 'Endereços' },
                 { id: 'security', icon: Shield, label: 'Segurança' }
               ].map((tab) => (
                 <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as Tab)} 
                  className={`w-full flex items-center space-x-4 p-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-[#1A1518] text-white shadow-lg' : 'text-stone-400 hover:bg-stone-50'}`}
                 >
                   <tab.icon className="w-4 h-4" /> <span>{tab.label}</span>
                 </button>
               ))}
               
               {/* ADM LINK para administradores */}
               {user.isAdmin && (
                 <button 
                  onClick={() => onNavigate('admin')} 
                  className="w-full flex items-center space-x-4 p-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-[#C082A0] hover:bg-[#C082A0]/10 transition-all border border-[#C082A0]/20 mt-4"
                 >
                   <LayoutDashboard className="w-4 h-4" /> <span>Painel ADM</span>
                 </button>
               )}
            </div>
          </div>
          <button onClick={onLogout} className="w-full flex items-center justify-between p-6 bg-white rounded-2xl text-red-400 text-[10px] font-bold uppercase tracking-widest hover:bg-red-50 transition-all border border-stone-100">
            <span>Encerrar Sessão</span>
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-white rounded-[2.5rem] p-8 md:p-16 shadow-premium border border-stone-100 min-h-[700px]">
          
          {activeTab === 'dashboard' && (
            <div className="space-y-12 animate-in fade-in duration-700">
              <div className="flex justify-between items-end">
                <div>
                  <span className="text-[#C082A0] font-cinzel text-[9px] font-bold tracking-[0.6em] uppercase mb-4 block">Bem-vinda</span>
                  <h1 className="text-4xl font-cinzel font-bold text-[#1A1518]">Olá, {user.name || 'Cliente'}</h1>
                </div>
                <button 
                  onClick={() => setIsEditingProfile(true)}
                  className="px-6 py-2 border border-stone-100 rounded-full text-[9px] font-bold uppercase tracking-widest hover:bg-stone-50 transition-all"
                >
                  Editar Perfil
                </button>
              </div>

              {isEditingProfile && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
                  <div className="bg-white rounded-[2.5rem] p-12 max-w-md w-full shadow-2xl animate-in zoom-in duration-300">
                    <div className="flex justify-between items-center mb-8">
                      <h2 className="font-cinzel font-bold text-xl">Editar Perfil</h2>
                      <button onClick={() => setIsEditingProfile(false)} className="text-stone-400 hover:text-stone-600">
                        <X className="w-6 h-6" />
                      </button>
                    </div>
                    <form onSubmit={handleUpdateProfile} className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Nome Completo</label>
                        <input 
                          type="text"
                          value={profileForm.name}
                          onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                          className="w-full bg-[#FAF9F6] border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-[#C082A0]/20"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Foto de Perfil</label>
                        <div className="flex items-center space-x-6">
                          <div className="w-20 h-20 rounded-full bg-[#FAF9F6] border border-stone-100 overflow-hidden relative group/avatar">
                            {profileForm.avatarUrl ? (
                              <img src={profileForm.avatarUrl} className="w-full h-full object-cover" alt="Avatar Preview" referrerPolicy="no-referrer" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-stone-200">
                                <UserIcon className="w-8 h-8" />
                              </div>
                            )}
                            
                            {isUploading && (
                              <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                                <div className="w-5 h-5 border-2 border-[#C082A0] border-t-transparent rounded-full animate-spin"></div>
                              </div>
                            )}

                            <label className="absolute inset-0 cursor-pointer flex items-center justify-center bg-black/0 group-hover/avatar:bg-black/20 transition-all">
                              <input 
                                type="file" 
                                accept="image/*" 
                                onChange={handleAvatarChange} 
                                className="hidden" 
                                disabled={isUploading}
                              />
                              <Plus className="w-5 h-5 text-white opacity-0 group-hover/avatar:opacity-100 transition-all" />
                            </label>
                          </div>
                          <div className="flex-1">
                            <p className="text-[10px] text-stone-400 italic">Clique no círculo para alterar sua foto</p>
                          </div>
                        </div>
                      </div>
                      <button type="submit" className="w-full bg-[#1A1518] text-white py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-[#2D2429] transition-all shadow-lg">
                        Salvar Alterações
                      </button>
                    </form>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-8 bg-[#FAF9F6] rounded-[2rem] border border-stone-50 group hover:border-[#C082A0]/20 transition-colors">
                  <Package className="w-6 h-6 text-[#C082A0] mb-4" />
                  <p className="text-3xl font-cinzel font-bold text-[#1A1518]">{localOrders.length}</p>
                  <p className="text-[9px] text-stone-400 font-bold uppercase tracking-widest">Pedidos</p>
                </div>
                <div className="p-8 bg-[#FAF9F6] rounded-[2rem] border border-stone-50 group hover:border-[#C082A0]/20 transition-colors">
                  <Heart className="w-6 h-6 text-[#C082A0] mb-4" />
                  <p className="text-3xl font-cinzel font-bold text-[#1A1518]">{wishlist.length}</p>
                  <p className="text-[9px] text-stone-400 font-bold uppercase tracking-widest">Favoritos</p>
                </div>
                <div className="p-8 bg-[#FAF9F6] rounded-[2rem] border border-stone-50 group hover:border-[#C082A0]/20 transition-colors">
                  <Star className="w-6 h-6 text-[#C082A0] mb-4" />
                  <p className="text-3xl font-cinzel font-bold text-[#1A1518]">Safira</p>
                  <p className="text-[9px] text-stone-400 font-bold uppercase tracking-widest">Nível de Fidelidade</p>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="font-cinzel font-bold text-xs uppercase tracking-[0.4em] border-b border-stone-50 pb-4">Acompanhamento</h3>
                {localOrders.length > 0 ? (
                  <div className="p-8 bg-[#FAF9F6] rounded-[2rem] flex flex-col md:flex-row items-center justify-between border border-stone-50">
                    <div className="flex items-center space-x-6">
                      <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                        <Package className="w-6 h-6 text-stone-200" />
                      </div>
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-widest text-stone-300">#{localOrders[0].id}</p>
                        <p className="font-cinzel font-bold text-[#1A1518]">R$ {localOrders[0].total.toFixed(2)}</p>
                      </div>
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest mt-4 md:mt-0 ${getStatusColor(localOrders[0].status)}`}>
                      {localOrders[0].status}
                    </span>
                  </div>
                ) : (
                  <p className="text-stone-300 italic font-playfair py-10 text-center">Nenhum pedido pendente.</p>
                )}
              </div>
            </div>
          )}

          {/* ... Restante das tabs (Endereços, Favoritos, Segurança) ... */}
          {activeTab === 'addresses' && (
            <div className="space-y-12 animate-in fade-in duration-700">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-cinzel font-bold text-[#1A1518]">Meus Endereços</h2>
                <button 
                  onClick={() => setIsAddingAddress(true)}
                  className="flex items-center space-x-2 bg-[#1A1518] text-white px-6 py-3 rounded-full text-[9px] font-bold uppercase tracking-widest hover:bg-[#2D2429] transition-all shadow-lg"
                >
                  <Plus className="w-4 h-4" /> <span>Novo Endereço</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {addresses.map((addr) => (
                  <div key={addr.id} className="p-8 bg-[#FAF9F6] rounded-[2rem] border border-stone-50 relative group">
                    <button 
                      onClick={() => onDeleteAddress(addr.id)}
                      className="absolute top-6 right-6 p-2 text-stone-300 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="flex items-center space-x-3 mb-4">
                      <MapPin className="w-4 h-4 text-[#C082A0]" />
                      <span className="text-[9px] font-bold uppercase tracking-widest text-[#C082A0]">{addr.type}</span>
                    </div>
                    <h4 className="font-cinzel font-bold text-[#1A1518] mb-2">{addr.name}</h4>
                    <p className="text-stone-500 text-sm leading-relaxed">
                      {addr.street}, {addr.number} {addr.complement && `- ${addr.complement}`}<br />
                      {addr.neighborhood} — {addr.city}/{addr.state}<br />
                      CEP: {addr.zipCode}
                    </p>
                  </div>
                ))}
                {addresses.length === 0 && (
                  <div className="col-span-full py-20 text-center">
                    <MapPin className="w-12 h-12 text-stone-100 mx-auto mb-4" />
                    <p className="text-stone-300 italic font-playfair">Nenhum endereço cadastrado.</p>
                  </div>
                )}
              </div>

              {isAddingAddress && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
                  <div className="bg-white rounded-[2.5rem] p-12 max-w-2xl w-full shadow-2xl animate-in zoom-in duration-300 max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-8">
                      <h2 className="font-cinzel font-bold text-xl">Novo Endereço</h2>
                      <button onClick={() => setIsAddingAddress(false)} className="text-stone-400 hover:text-stone-600">
                        <X className="w-6 h-6" />
                      </button>
                    </div>
                    <form onSubmit={handleSaveAddress} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Identificação (ex: Casa, Trabalho)</label>
                        <input 
                          type="text"
                          value={addressForm.name}
                          onChange={(e) => setAddressForm({...addressForm, name: e.target.value})}
                          className="w-full bg-[#FAF9F6] border-none rounded-2xl p-4 text-sm"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">CEP</label>
                        <input 
                          type="text"
                          value={addressForm.zipCode}
                          onChange={(e) => setAddressForm({...addressForm, zipCode: maskCEP(e.target.value)})}
                          className="w-full bg-[#FAF9F6] border-none rounded-2xl p-4 text-sm"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Cidade</label>
                        <input 
                          type="text"
                          value={addressForm.city}
                          onChange={(e) => setAddressForm({...addressForm, city: e.target.value})}
                          className="w-full bg-[#FAF9F6] border-none rounded-2xl p-4 text-sm"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Bairro</label>
                        <input 
                          type="text"
                          value={addressForm.neighborhood}
                          onChange={(e) => setAddressForm({...addressForm, neighborhood: e.target.value})}
                          className="w-full bg-[#FAF9F6] border-none rounded-2xl p-4 text-sm"
                          required
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Logradouro</label>
                        <input 
                          type="text"
                          value={addressForm.street}
                          onChange={(e) => setAddressForm({...addressForm, street: e.target.value})}
                          className="w-full bg-[#FAF9F6] border-none rounded-2xl p-4 text-sm"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Número</label>
                        <input 
                          type="text"
                          value={addressForm.number}
                          onChange={(e) => setAddressForm({...addressForm, number: e.target.value})}
                          className="w-full bg-[#FAF9F6] border-none rounded-2xl p-4 text-sm"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Complemento (Opcional)</label>
                        <input 
                          type="text"
                          value={addressForm.complement}
                          onChange={(e) => setAddressForm({...addressForm, complement: e.target.value})}
                          className="w-full bg-[#FAF9F6] border-none rounded-2xl p-4 text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Estado (UF)</label>
                        <input 
                          type="text"
                          value={addressForm.state}
                          onChange={(e) => setAddressForm({...addressForm, state: e.target.value})}
                          className="w-full bg-[#FAF9F6] border-none rounded-2xl p-4 text-sm"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Tipo de Endereço</label>
                        <select 
                          value={addressForm.type}
                          onChange={(e) => setAddressForm({...addressForm, type: e.target.value as any})}
                          className="w-full bg-[#FAF9F6] border-none rounded-2xl p-4 text-sm"
                        >
                          <option value="Principal">Principal</option>
                          <option value="Alternativo">Alternativo</option>
                        </select>
                      </div>
                      <button type="submit" className="md:col-span-2 bg-[#1A1518] text-white py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-[#2D2429] transition-all shadow-lg mt-4">
                        Salvar Endereço
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}
          {activeTab === 'orders' && (
            <div className="space-y-12 animate-in fade-in duration-700">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-cinzel font-bold text-[#1A1518]">Meus Pedidos</h2>
              </div>

              {selectedOrder ? (
                <div className="space-y-8 animate-in slide-in-from-right duration-500">
                  <button 
                    onClick={() => setSelectedOrder(null)}
                    className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-stone-400 hover:text-[#C082A0] transition-colors"
                  >
                    <ArrowRight className="w-4 h-4 rotate-180" /> <span>Voltar para lista</span>
                  </button>

                  <div className="bg-[#FAF9F6] rounded-[2.5rem] p-8 md:p-12 border border-stone-100 space-y-10">
                    <div className="flex flex-col md:flex-row justify-between gap-6">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-stone-300 mb-1">Pedido #{selectedOrder.id}</p>
                        <h3 className="text-2xl font-cinzel font-bold text-[#1A1518]">Detalhes da Compra</h3>
                        <p className="text-sm text-stone-400 mt-2">Realizado em {new Date(selectedOrder.date).toLocaleDateString('pt-BR')}</p>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className={`px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest ${getStatusColor(selectedOrder.status)}`}>
                          {selectedOrder.status}
                        </span>
                        {selectedOrder.status === 'Produto enviado' && selectedOrder.tracking_code && (
                          <div className="flex flex-col items-end space-y-2">
                            <p className="text-[10px] font-bold text-[#C082A0] mt-3 uppercase tracking-widest italic">
                              Código de rastreio: {selectedOrder.tracking_code}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                      <div className="space-y-6">
                        <h4 className="font-cinzel font-bold text-xs uppercase tracking-[0.3em] text-stone-400 border-b border-stone-200 pb-4">Itens</h4>
                        <div className="space-y-4">
                          {selectedOrder.products.map((item, idx) => (
                            <div key={idx} className="flex items-center space-x-4">
                              <div className="w-12 h-16 bg-white rounded-lg overflow-hidden border border-stone-100">
                                <img src={item.image} className="w-full h-full object-cover" alt={item.name} referrerPolicy="no-referrer" />
                              </div>
                              <div className="flex-1">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-[#1A1518]">{item.name}</p>
                                <p className="text-[10px] text-stone-400">{item.quantity}x R$ {item.price.toFixed(2)}</p>
                              </div>
                              <p className="text-[10px] font-bold text-[#1A1518]">R$ {(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                          ))}
                        </div>
                        <div className="pt-4 border-t border-stone-200 flex justify-between items-center">
                          <span className="font-cinzel font-bold text-sm">Total</span>
                          <span className="font-cinzel font-bold text-xl text-[#C082A0]">R$ {selectedOrder.total.toFixed(2)}</span>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <h4 className="font-cinzel font-bold text-xs uppercase tracking-[0.3em] text-stone-400 border-b border-stone-200 pb-4">Linha do Tempo</h4>
                        <div className="space-y-6 relative before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[1px] before:bg-stone-200">
                          {[
                            { s: 'Pagamento em análise', icon: CreditCard },
                            { s: 'Pagamento aprovado', icon: CheckCircle2 },
                            { s: 'Aguardando envio', icon: Package },
                            { s: 'Produto enviado', icon: Truck },
                            { s: 'Entregue', icon: MapPin }
                          ].map((step, idx) => {
                            const isPast = ['Pagamento em análise', 'Pagamento aprovado', 'Aguardando envio', 'Produto enviado', 'Entregue'].indexOf(step.s) <= ['Pagamento em análise', 'Pagamento aprovado', 'Aguardando envio', 'Produto enviado', 'Entregue'].indexOf(selectedOrder.status);
                            const isCurrent = step.s === selectedOrder.status;
                            
                            return (
                              <div key={idx} className={`flex items-start space-x-6 relative z-10 ${isPast ? 'opacity-100' : 'opacity-30'}`}>
                                <div className={`w-4 h-4 rounded-full flex items-center justify-center ${isCurrent ? 'bg-[#C082A0] ring-4 ring-[#C082A0]/20' : isPast ? 'bg-stone-800' : 'bg-stone-200'}`}>
                                  <div className="w-1.5 h-1.5 bg-white rounded-full" />
                                </div>
                                <div>
                                  <p className={`text-[10px] font-bold uppercase tracking-widest ${isCurrent ? 'text-[#C082A0]' : 'text-[#1A1518]'}`}>{step.s}</p>
                                  {step.s === 'Produto enviado' && isPast && (
                                    <p className="text-[9px] text-[#C082A0] font-bold uppercase tracking-widest mt-1">CÓDIGO ENVIADO POR EMAIL</p>
                                  )}
                                  {isCurrent && step.s !== 'Produto enviado' && <p className="text-[9px] text-stone-400 italic mt-1">Status atual do seu pedido místico</p>}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {localOrders.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                      {localOrders.map((order) => (
                        <button 
                          key={order.id}
                          onClick={() => setSelectedOrder(order)}
                          className="w-full p-8 bg-[#FAF9F6] rounded-[2rem] border border-stone-50 hover:border-[#C082A0]/30 transition-all flex flex-col md:flex-row items-center justify-between group"
                        >
                          <div className="flex items-center space-x-6">
                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                              <Package className="w-6 h-6 text-[#C082A0]" />
                            </div>
                            <div className="text-left">
                              <p className="text-[9px] font-bold uppercase tracking-widest text-stone-300">#{order.id}</p>
                              <p className="font-cinzel font-bold text-[#1A1518]">R$ {order.total.toFixed(2)}</p>
                              <p className="text-[9px] text-stone-400 uppercase tracking-widest mt-1">{new Date(order.created_at).toLocaleDateString('pt-BR')}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-6 mt-4 md:mt-0">
                            <span className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                            <ChevronRight className="w-4 h-4 text-stone-200 group-hover:text-[#C082A0] transition-colors" />
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="py-20 text-center">
                      <Package className="w-12 h-12 text-stone-100 mx-auto mb-4" />
                      <p className="text-stone-300 italic font-playfair">Você ainda não realizou nenhum pedido.</p>
                      <button 
                        onClick={() => onNavigate('store')}
                        className="mt-6 text-[10px] font-bold uppercase tracking-widest text-[#C082A0] hover:underline"
                      >
                        Explorar a Loja
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'wishlist' && (
            <div className="space-y-12 animate-in fade-in duration-700">
              <h2 className="text-3xl font-cinzel font-bold text-[#1A1518]">Meus Favoritos</h2>
              
              {wishlistProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {wishlistProducts.map((product) => (
                    <div key={product.id} className="group bg-[#FAF9F6] rounded-[2rem] overflow-hidden border border-stone-50 hover:border-[#C082A0]/20 transition-all">
                      <div className="aspect-[3/4] relative overflow-hidden">
                        <img src={product.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={product.name} referrerPolicy="no-referrer" />
                        <button 
                          onClick={() => onToggleWishlist(product.id)}
                          className="absolute top-4 right-4 p-3 bg-white/80 backdrop-blur-md rounded-full text-[#C082A0] shadow-lg"
                        >
                          <Heart className="w-4 h-4 fill-current" />
                        </button>
                      </div>
                    <div className="p-6 space-y-4">
                      <div>
                        <h3 className="font-cinzel font-bold text-[#1A1518]">{product.name}</h3>
                        <p className="text-stone-400 text-[10px]">R$ {product.price.toFixed(2)}</p>
                      </div>
                      <button
                        onClick={() => onAddToCart(product, 1)}
                        className="w-full bg-[#1A1518] text-white py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-[#2D2429] transition-all shadow-lg"
                      >
                        Adicionar ao Carrinho
                      </button>
                    </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center">
                  <Heart className="w-12 h-12 text-stone-100 mx-auto mb-4" />
                  <p className="text-stone-300 italic font-playfair">Sua lista de desejos está vazia.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-12 animate-in fade-in duration-700">
              <h2 className="text-3xl font-cinzel font-bold text-[#1A1518]">Segurança</h2>

              <div className="space-y-8">
                {/* Password Change Section */}
                <div className="p-8 bg-white rounded-[2.5rem] border border-stone-100 space-y-8">
                  <div className="flex items-center space-x-4">
                    <ShieldAlert className="w-5 h-5 text-[#C082A0]" />
                    <h4 className="font-cinzel font-bold text-[#1A1518]">Alterar Senha</h4>
                  </div>
                  
                  <form onSubmit={handleUpdatePassword} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Senha Atual</label>
                      <input 
                        type="password"
                        value={passwords.current}
                        onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                        className="w-full bg-[#FAF9F6] border-none rounded-2xl p-4 text-sm"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Nova Senha</label>
                      <input 
                        type="password"
                        value={passwords.new}
                        onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                        className="w-full bg-[#FAF9F6] border-none rounded-2xl p-4 text-sm"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Confirmar Nova Senha</label>
                      <input 
                        type="password"
                        value={passwords.confirm}
                        onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                        className="w-full bg-[#FAF9F6] border-none rounded-2xl p-4 text-sm"
                        required
                      />
                    </div>
                    <button type="submit" className="md:col-span-2 bg-[#1A1518] text-white py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-[#2D2429] transition-all shadow-lg mt-4">
                      Atualizar Senha
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Account;
