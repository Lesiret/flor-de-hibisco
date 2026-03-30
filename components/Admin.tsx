
import React, { useState } from 'react';
import { 
  LayoutDashboard, Package, Plus, Search, 
  Trash2, Edit3, X, Image as ImageIcon, 
  ArrowLeft, ShoppingBag, Truck, ShieldCheck, 
  Code, ExternalLink, Sparkles, ArrowRight, Eye, ChevronRight
} from 'lucide-react';
import { Product, ViewState, ShippingConfig, Order } from '../types';
import { supabase } from '../lib/supabase';
import { uploadImage } from '../lib/storage';
import { useEffect } from 'react';


interface AdminProps {
  products: Product[];
  orders: Order[];
  shippingConfig: ShippingConfig;
  onAdd: (p: Product) => void;
  onUpdate: (p: Product) => void;
  onDelete: (id: string) => void;
  onUpdateOrder: React.Dispatch<React.SetStateAction<Order[]>>;
  onUpdateShipping: (config: ShippingConfig) => void;
  onNavigate: (v: ViewState) => void;
  onNotify: (msg: string, type?: 'success' | 'error') => void;
}

const Admin: React.FC<AdminProps> = ({ products, orders, shippingConfig, onAdd, onUpdate, onDelete, onUpdateOrder, onUpdateShipping, onNavigate, onNotify }) => {
  const [activeAdminTab, setActiveAdminTab] = useState<'products' | 'orders' | 'shipping'>('products');
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({});
  const [isNewProduct, setIsNewProduct] = useState(false);
  const [search, setSearch] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [tempShipping, setTempShipping] = useState<ShippingConfig>(shippingConfig);

  // 🔹 Função para buscar pedidos do Supabase
const fetchOrders = async () => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
              *,
              order_items (
                quantity,
                product_id,
                price_at_time,
                products (
                  id,
                  name
                )
              ),
              profiles (
                name,
                phone
              )
            `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    if (data) onUpdateOrder(() => data);
  } catch (err) {
    console.error('Erro ao buscar pedidos:', err);
    onNotify('Erro ao carregar pedidos', 'error');
  }
};

useEffect(() => {
  if (activeAdminTab === 'orders') {
    fetchOrders();
  }
}, [activeAdminTab]);

useEffect(() => {
  const channel = supabase
    .channel('orders-realtime-admin')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'orders' },
      async (payload) => {
        console.log('Realtime pedido:', payload);

        const record = (payload.new || payload.old) as { id: string };

        if (!record?.id) return;

        // DELETE → remove direto
        if (payload.eventType === 'DELETE') {
          onUpdateOrder(prev => prev.filter(o => o.id !== record.id));
          return;
        }

        // INSERT ou UPDATE → busca completo
        const { data } = await supabase
          .from('orders')
          .select(`
            *,
            order_items (
              quantity,
              product_id,
              price_at_time,
              products (
                id,
                name
              )
            ),
            profiles (
              name,
              phone
            )
          `)
          .eq('id', record.id)
          .single();

        if (!data) return;

        onUpdateOrder(prev => {
          const updated = [...prev];
          const index = updated.findIndex(o => o.id === data.id);

          if (payload.eventType === 'INSERT') {
            onNotify('🛒 Novo pedido recebido!', 'success');

            const audio = new Audio('/images/sino-notif.mp3');
            audio.play().catch(() => {});
          }

          if (index !== -1) {
            updated[index] = data;
          } else {
            updated.unshift(data);
          }

          return updated.sort((a, b) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        });
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, []);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenEdit = (p?: Product) => {
    if (p) {
      setCurrentProduct({ ...p });
      setIsNewProduct(false);
    } else {
      setCurrentProduct({ 
        name: '', 
        price: 0, 
        category: 'Óleos', 
        image: '', 
        description: '', 
        weight: 0.5, 
        width: 10, 
        height: 10, 
        length: 10 
      });
      setIsNewProduct(true);
    }
    setIsEditing(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (isUploading) {
      onNotify("Aguarde o upload da imagem ser concluído.", "error");
      return;
    }
    if (isNewProduct) {
      onAdd(currentProduct as Product);
    } else {
      onUpdate(currentProduct as Product);
    }
    setIsEditing(false);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      onNotify("Fazendo upload da imagem...");
      const url = await uploadImage(file, 'products');
      if (url) {
        setCurrentProduct({ ...currentProduct, image: url });
        onNotify("Upload concluído!");
      } else {
        onNotify("Erro ao fazer upload da imagem.", "error");
      }
    } catch (err) {
      onNotify("Erro inesperado no upload.", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Tem certeza que deseja remover o produto "${name}"? Esta ação não pode ser desfeita.`)) {
      onDelete(id);
    }
  };

  const handleSaveShipping = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateShipping(tempShipping);
  };

    const handleUpdateOrderStatus = async (orderId: string, status: string, tracking?: string) => {
      const { error } = await supabase
        .from('orders')
        .update({ status, tracking_code: tracking })
        .eq('id', orderId);

      if (error) {
        onNotify("Erro ao atualizar pedido", "error");
      } else {
        onNotify("Status do pedido atualizado!");
        // 🔹 Passo 5: atualizar pedidos chamando fetchOrders
      }
    };

  const maskCEP = (val: string) => val.replace(/\D/g, '').replace(/(\d{5})(\d)/, '$1-$2').substring(0, 9);

  return (
    <div className="min-h-screen bg-[#FAF9F6] pt-32 pb-24 px-6">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <div className="flex items-center space-x-3 text-[#C082A0] mb-2">
              <LayoutDashboard className="w-5 h-5" />
              <span className="text-[9px] font-bold uppercase tracking-[0.5em]">Administração</span>
            </div>
            <h1 className="text-4xl font-cinzel font-bold text-[#1A1518]">Gerenciar Loja</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <button onClick={() => onNavigate('home')} className="px-6 py-3 rounded-xl border border-stone-200 text-[10px] font-bold uppercase tracking-widest text-stone-400 hover:border-[#C082A0] hover:text-[#C082A0] transition-all flex items-center space-x-2">
              <ArrowLeft className="w-3.5 h-3.5" /> <span>Sair do Painel</span>
            </button>
            {activeAdminTab === 'products' && (
              <button onClick={() => handleOpenEdit()} className="px-8 py-4 bg-[#1A1518] text-white rounded-full text-[10px] font-bold uppercase tracking-widest shadow-xl hover:bg-[#C082A0] transition-all flex items-center space-x-3">
                <Plus className="w-4 h-4" /> <span>Novo Produto</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-4 border-b border-stone-100 overflow-x-auto no-scrollbar">
           {[
             { id: 'products', label: 'Produtos', icon: Package },
             { id: 'orders', label: 'Pedidos', icon: ShoppingBag },
             { id: 'shipping', label: 'Frete', icon: Truck }
           ].map(tab => (
             <button 
              key={tab.id}
              onClick={() => setActiveAdminTab(tab.id as any)}
              className={`px-8 py-4 text-[10px] font-bold uppercase tracking-widest transition-all relative whitespace-nowrap flex items-center space-x-2 ${activeAdminTab === tab.id ? 'text-[#1A1518] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#C082A0]' : 'text-stone-300'}`}
             >
               <tab.icon className="w-3.5 h-3.5" /> <span>{tab.label}</span>
             </button>
           ))}
        </div>

        {/* Products Tab */}
        {activeAdminTab === 'products' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="bg-white p-4 rounded-[2rem] shadow-premium border border-stone-100 flex items-center px-8">
              <Search className="w-5 h-5 text-stone-300 mr-4" />
              <input 
                type="text" 
                placeholder="Buscar produto..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent border-none text-sm focus:ring-0 placeholder:text-stone-200 font-medium"
              />
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-premium border border-stone-100 overflow-hidden overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#FAF9F6]">
                  <tr>
                    <th className="px-8 py-6 text-left text-[10px] font-bold uppercase tracking-widest text-stone-400">Nome</th>
                    <th className="px-8 py-6 text-left text-[10px] font-bold uppercase tracking-widest text-stone-400">Categoria</th>
                    <th className="px-8 py-6 text-left text-[10px] font-bold uppercase tracking-widest text-stone-400">Valor</th>
                    <th className="px-8 py-6 text-right text-[10px] font-bold uppercase tracking-widest text-stone-400">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {filteredProducts.map(p => (
                    <tr key={p.id} className="hover:bg-stone-50/50 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center space-x-4">
                          <img src={p.image} className="w-12 h-12 rounded-xl object-cover shadow-sm group-hover:scale-110 transition-transform" referrerPolicy="no-referrer"/>
                          <span className="font-cinzel font-bold text-sm text-[#1A1518]">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-stone-400 bg-stone-100 px-3 py-1 rounded-full">{p.category}</span>
                      </td>
                      <td className="px-8 py-6 font-cinzel font-bold text-[#C082A0]">R$ {p.price.toFixed(2)}</td>
                      <td className="px-8 py-6 text-right space-x-2">
                        <button onClick={() => handleOpenEdit(p)} className="p-3 rounded-full hover:bg-[#C082A0]/10 text-stone-300 hover:text-[#C082A0] transition-all" title="Editar"><Edit3 className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(p.id, p.name)} className="p-3 rounded-full hover:bg-red-50 text-stone-300 hover:text-red-500 transition-all" title="Excluir"><Trash2 className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeAdminTab === 'orders' && (
          <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex justify-start">
              <select
                onChange={(e) => {
                  const val = e.target.value;

                  if (val === 'all') fetchOrders();
                  else onUpdateOrder(prev => prev.filter(o => o.status === val));
                }}
                className="mb-4 p-2 rounded-lg border text-sm"
              >
                <option value="all">Todos</option>
                <option value="Pagamento em análise">Pendentes</option>
                <option value="Pagamento aprovado">Aprovados</option>
                <option value="Produto enviado">Enviados</option>
                <option value="Entregue">Entregues</option>
                <option value="Cancelado">Cancelados</option>
              </select>
            </div>
            <div className="bg-white rounded-[2.5rem] shadow-premium border border-stone-100 overflow-hidden overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#FAF9F6]">
                  <tr>
                    <th className="px-8 py-6 text-left text-[10px] font-bold uppercase tracking-widest text-stone-400">ID / Data</th>
                    <th className="px-8 py-6 text-left text-[10px] font-bold uppercase tracking-widest text-stone-400">Total</th>
                    <th className="px-8 py-6 text-left text-[10px] font-bold uppercase tracking-widest text-stone-400">Status</th>
                    <th className="px-8 py-6 text-left text-[10px] font-bold uppercase tracking-widest text-stone-400">Rastreio</th>
                    <th className="px-8 py-6 text-right text-[10px] font-bold uppercase tracking-widest text-stone-400">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {orders.map(order => (
                    <tr key={order.id} className="hover:bg-stone-50/50 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-[#1A1518] uppercase tracking-widest">
                              #{order.id.substring(0, 8)}
                            </span>

                            {new Date(order.created_at).getTime() > Date.now() - 1000 * 60 * 5 && (
                              <span className="bg-green-100 text-green-600 text-[8px] px-2 py-1 rounded-full font-bold">
                                NOVO
                              </span>
                            )}
                          </div>
                          <span className="text-[9px] text-stone-400 mt-1">{new Date(order.created_at).toLocaleDateString('pt-BR')}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 font-cinzel font-bold text-[#C082A0]">R$ {order.total.toFixed(2)}</td>
                      <td className="px-8 py-6">
                        <select 
                          value={order.status}
                          onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as any, order.tracking_code)}
                          className="bg-[#FAF9F6] border-none text-[10px] font-bold uppercase tracking-widest py-2 px-4 rounded-full focus:ring-2 focus:ring-[#C082A0]/20 cursor-pointer"
                        >
                          <option value="Pagamento em análise">Pagamento em análise</option>
                          <option value="Pagamento aprovado">Pagamento aprovado</option>
                          <option value="Aguardando envio">Aguardando envio</option>
                          <option value="Produto enviado">Produto enviado</option>
                          <option value="Entregue">Entregue</option>
                          <option value="Cancelado">Cancelado</option>
                        </select>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center space-x-2">
                          <input 
                            type="text"
                            placeholder="Cód. Rastreio"
                            defaultValue={order.tracking_code || ''}
                            onBlur={(e) => handleUpdateOrderStatus(order.id, order.status, e.target.value)}
                            className="bg-[#FAF9F6] border-none text-[10px] font-bold uppercase tracking-widest py-2 px-4 rounded-full w-32 focus:ring-2 focus:ring-[#C082A0]/20"
                          />
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button 
                          onClick={() => {
                              onNotify(`
                             Cliente: ${order.profiles?.name || 'N/A'}
                             Telefone: ${order.profiles?.phone || 'N/A'}

                             Itens:
                            ${(order.order_items || [])
                              .map(i => `${i.quantity}x ${i.products?.name}`)
                              .join('\n')}

                             Total: R$ ${order.total?.toFixed(2)}

                             Entrega:
                            Nome: ${order.recipient_name || ''}
                            Telefone: ${order.recipient_phone || ''}

                            ${order.street || ''}, ${order.number || ''}
                            ${order.neighborhood || ''}
                            ${order.city || ''} - ${order.state || ''}
                            CEP: ${order.zip_code || ''}
                            `);
                            }}
                          className="p-3 rounded-full hover:bg-[#C082A0]/10 text-stone-300 hover:text-[#C082A0] transition-all"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-8 py-20 text-center text-stone-300 italic font-playfair">Nenhum pedido encontrado.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeAdminTab === 'shipping' && (
          <div className="bg-white p-12 rounded-[2.5rem] border border-stone-100">
            <h2 className="text-xl font-cinzel font-bold mb-8">Configurações de Frete</h2>
            <form onSubmit={handleSaveShipping} className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">CEP de Origem</label>
                  <input type="text" value={tempShipping.originZipCode} onChange={e => setTempShipping({...tempShipping, originZipCode: maskCEP(e.target.value)})} className="w-full bg-[#FAF9F6] border-none py-4 px-6 rounded-2xl text-sm font-bold" />
               </div>
               <button type="submit" className="md:col-span-2 bg-[#1A1518] text-white py-4 rounded-full text-[10px] font-bold uppercase tracking-widest">Salvar</button>
            </form>
          </div>
        )}
      </div>

      {/* Editor Modal - Simplified Labels */}
      {isEditing && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative bg-white w-full max-w-5xl max-h-[95vh] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-500">
            
            <div className="p-8 border-b border-stone-100 flex items-center justify-between bg-[#FAF9F6]">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-[#C082A0]/10 text-[#C082A0] rounded-2xl">
                  {isNewProduct ? <Plus className="w-6 h-6" /> : <Edit3 className="w-6 h-6" />}
                </div>
                <div>
                  <h2 className="text-2xl font-cinzel font-bold text-[#1A1518]">
                    {isNewProduct ? 'Novo Produto' : 'Editar Produto'}
                  </h2>
                  <p className="text-[9px] text-stone-400 uppercase font-bold tracking-[0.3em]">Gerenciamento de Inventário</p>
                </div>
              </div>
              <button onClick={() => setIsEditing(false)} className="p-3 bg-stone-100 rounded-full text-stone-300 hover:bg-red-50 hover:text-red-500 transition-all">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="flex-1 overflow-y-auto p-12 space-y-12">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                
                {/* Image Section */}
                <div className="lg:col-span-5 space-y-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 flex items-center space-x-2">
                      <ImageIcon className="w-3.5 h-3.5" /> <span>Imagem do Produto</span>
                    </label>
                    <div className="aspect-[3/4] rounded-[2.5rem] bg-[#FAF9F6] overflow-hidden relative border border-stone-100 shadow-inner group/img">
                      {currentProduct.image ? (
                        <img src={currentProduct.image} className="w-full h-full object-cover" alt="Preview" referrerPolicy="no-referrer"/>
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-stone-300 space-y-4">
                          <ImageIcon className="w-16 h-16 opacity-10" />
                          <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">Sem Imagem</p>
                        </div>
                      )}
                      
                      {isUploading && (
                        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                          <div className="w-8 h-8 border-2 border-[#C082A0] border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}

                      <label className="absolute inset-0 cursor-pointer flex items-center justify-center bg-black/0 group-hover/img:bg-black/20 transition-all">
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleFileChange} 
                          className="hidden" 
                          disabled={isUploading}
                        />
                        <div className="bg-white/90 p-4 rounded-full shadow-xl opacity-0 group-hover/img:opacity-100 transform translate-y-4 group-hover/img:translate-y-0 transition-all">
                          <Plus className="w-6 h-6 text-[#C082A0]" />
                        </div>
                      </label>
                    </div>
                    <p className="text-[9px] text-stone-400 text-center italic">Clique na área acima para fazer upload</p>
                  </div>

                  <div className="p-6 bg-[#1A1518] rounded-[2rem] text-white flex items-center space-x-6 shadow-xl">
                    <div className="w-16 h-20 rounded-lg bg-stone-800 overflow-hidden flex-shrink-0">
                      {currentProduct.image && <img src={currentProduct.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />}
                    </div>
                    <div className="space-y-1">
                      <p className="font-cinzel font-bold text-xs truncate max-w-[180px]">{currentProduct.name || 'Nome do Produto'}</p>
                      <p className="text-[10px] text-[#C082A0] font-bold uppercase tracking-widest">R$ {(currentProduct.price || 0).toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                {/* Fields Section */}
                <div className="lg:col-span-7 space-y-10">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 ml-1">Nome</label>
                      <input 
                        required 
                        value={currentProduct.name || ''} 
                        onChange={e => setCurrentProduct({...currentProduct, name: e.target.value})} 
                        placeholder="Nome do produto" 
                        className="w-full bg-[#FAF9F6] border-none py-5 px-8 rounded-[1.5rem] text-lg font-cinzel font-bold text-[#1A1518] focus:ring-2 focus:ring-[#C082A0]/20" 
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 ml-1">Categoria</label>
                        <select 
                          value={currentProduct.category} 
                          onChange={e => setCurrentProduct({...currentProduct, category: e.target.value})} 
                          className="w-full bg-[#FAF9F6] border-none py-5 px-8 rounded-[1.5rem] text-xs font-bold focus:ring-2 focus:ring-[#C082A0]/20 cursor-pointer"
                        >
                          {['Óleos', 'Banhos', 'Pós', 'Velas', 'Oráculos', 'Cristais', 'Acessórios'].map(c => <option key={c}>{c}</option>)}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 ml-1">Valor (R$)</label>
                        <input 
                          type="number" 
                          step="0.01" 
                          required
                          value={currentProduct.price ?? ''} 
                          onChange={(e) => setCurrentProduct({
                            ...currentProduct,
                            price: e.target.value ? parseFloat(e.target.value) : 0
                          })}
                          className="w-full bg-[#FAF9F6] border-none py-5 px-8 rounded-[1.5rem] text-sm font-bold focus:ring-2 focus:ring-[#C082A0]/20" 
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 ml-1">Descrição</label>
                      <textarea 
                      rows={6} 
                      required
                      value={currentProduct.description || ''} 
                      onChange={e => setCurrentProduct({...currentProduct, description: e.target.value})} 
                      placeholder="Detalhes do produto..." 
                      className="w-full bg-[#FAF9F6] border-none py-6 px-8 rounded-[2rem] text-sm font-medium leading-relaxed resize-y focus:ring-2 focus:ring-[#C082A0]/20"
                    />
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="w-full bg-[#1A1518] text-white py-6 rounded-full text-[10px] font-bold uppercase tracking-[0.6em] hover:bg-[#C082A0] transition-all shadow-xl flex items-center justify-center space-x-4 group"
                  >
                    <span>{isNewProduct ? 'Adicionar Produto' : 'Salvar Alterações'}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
