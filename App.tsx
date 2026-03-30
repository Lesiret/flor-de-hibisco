
import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { ViewState, Product, CartItem, User, Order, Address, ShippingConfig } from './types';
import { PRODUCTS as INITIAL_PRODUCTS } from './constants';
import { supabase } from './lib/supabase';
import Navbar from './components/Navbar';
import Entrance from './components/Entrance';
import Home from './components/Home';
import Store from './components/Store';
import SocialLinks from './components/SocialLinks';
import About from './components/About';
import Footer from './components/Footer';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfUse from './components/TermsOfUse';
import Delivery from './components/Delivery';
import Payment from './components/Payment';
import Returns from './components/Returns';
import CartDrawer from './components/CartDrawer';
import Login from './components/Login';
import Signup from './components/Signup';
import Account from './components/Account';
import Admin from './components/Admin';

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    className={className} 
    fill="currentColor" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('entrance');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [notification, setNotification] = useState<{msg: string, type: 'success' | 'error'} | null>(null);
  
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [shippingConfig, setShippingConfig] = useState<ShippingConfig>({
    originZipCode: '88035-001',
    flatRate: 25.00,
    freeShippingThreshold: 250.00,
    estimatedDaysBase: 5
  });
  
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [user, setUser] = useState<User | null>(null);
  const [pendingUser, setPendingUser] = useState<any>(null);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);

  // Reset de scroll em toda mudança de página
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  const notify = (msg: string, type: 'success' | 'error' = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const fetchData = async () => {
    try {
      const { data: prods } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (prods) setProducts(prods);

const { data: config } = await supabase
  .from('global_settings')
  .select('*')
  .maybeSingle();

      if (config) {
        setShippingConfig({
          originZipCode: config.origin_zip_code,
          flatRate: config.flat_rate,
          freeShippingThreshold: config.free_shipping_threshold,
          estimatedDaysBase: config.estimated_days_base || 5
        });
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
        if (profile) {
          const userData: User = {
            id: session.user.id,
            email: session.user.email || '',
            name: profile.name || 'Cliente',
            phone: profile.phone || '',
            cpf: profile.cpf || '',
            joinedAt: profile.joined_at || '',
            isAdmin: profile.is_admin || false,
            avatarUrl: profile.avatar_url || ''
          };
          setUser(userData);

          const { data: addrs } = await supabase.from('addresses').select('*').eq('user_id', session.user.id);
          if (addrs) {
            const mappedAddrs: Address[] = addrs.map(a => ({
              id: a.id,
              name: a.name || '',
              type: a.type || 'Alternativo',
              street: a.street || '',
              number: a.number || '',
              complement: a.complement || '',
              neighborhood: a.neighborhood || '',
              city: a.city || '',
              state: a.state || '',
              zipCode: a.zip_code || ''
            }));
            setAddresses(mappedAddrs);
          }

          const { data: wish } = await supabase.from('wishlist').select('product_id').eq('user_id', session.user.id);
          if (wish) setWishlist(wish.map(w => w.product_id));

          let ordersQuery = supabase.from('orders').select('*, order_items(*)');

          if (!profile.is_admin) {
            ordersQuery = ordersQuery.eq('user_id', session.user.id);
          }
          const { data: ords } = await ordersQuery.order('created_at', { ascending: false });
          if (ords) {
            const mappedOrders: Order[] = ords.map((o: any) => ({
              id: o.id,
              user_id: o.user_id,
              created_at: o.created_at,
              total: o.total_amount,           // <-- aqui
              status: o.status,
              payment_method: o.payment_method,
              tracking_code: o.tracking_code,
              items: o.order_items.map((oi: any) => ({
                id: oi.product_id,
                name: oi.name,
                price: oi.price,
                quantity: oi.quantity,
                image: oi.image_url
              }))
            }));
            setOrders(mappedOrders);
          }
        }
      }
    } catch (e) {
      console.error("Erro ao carregar dados:", e);
    }
  };

    useEffect(() => {
      let interval: any = null;

      // Função async interna para poder usar await
      const initialize = async () => {
        // Carrega os dados iniciais
        await fetchData();

        // Detectar retorno do Mercado Pago
        const params = new URLSearchParams(window.location.search);
        const status = params.get('status');

        if (status === 'approved') {
          window.history.replaceState({}, document.title, window.location.pathname);
          await fetchData();
          setView('payment-success');
          clearCart();

        } else if (status === 'rejected') {
          setView('payment-failure');

        } else if (status === 'in_process' || status === 'pending') {
          setView('payment-pending');

          // 🔥 polling até confirmar pagamento
          interval = setInterval(async () => {
            await fetchData();

            const params = new URLSearchParams(window.location.search);

            const { data: { session } } = await supabase.auth.getSession();

              if (!session) return;

              const { data: ords } = await supabase
                .from('orders')
                .select('*')
                .eq('user_id', session.user.id)
                .order('created_at', { ascending: false })
                .limit(1);

              const latestOrder = ords?.[0];

            if (
                  latestOrder?.status === 'approved' ||
                  latestOrder?.status === 'Pagamento aprovado'
                ) {
              clearInterval(interval);
              setView('payment-success');
              clearCart();
            }
          }, 5000);
        }
      };

      initialize();

      const channel = supabase
        .channel('orders-realtime')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'orders'
          },
          (payload) => {
            if (!user || payload.new.user_id !== user.id) return;

            const status = payload.new.status;

            if (status === 'approved' || status === 'Pagamento aprovado') {
              fetchData();

              notify("✅ Pagamento aprovado!", "success");

              setView('payment-success');

              clearCart();
            }
          }
        )
        .subscribe();

      // 🧹 cleanup
      return () => {
        if (interval) clearInterval(interval);
        supabase.removeChannel(channel);
      };

    }, [user]);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const handleLogin = async (email: string, pass: string) => {
    try {
      notify("Acessando sua conta...");
      const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
      
      if (error) {
        notify("Erro ao entrar: " + error.message, "error");
        return;
      }

      if (data.session) {
        await fetchData();
        setView('home');
      }
    } catch (e) {
      notify("Erro inesperado ao entrar.", "error");
    }
  };

  const handleVerify2FA = async (code: string) => {
    // Simulated verification - in a real app, this would check against a code stored in DB or sent via service
    if (code === '123456' || code.length === 6) {
      notify("Verificação concluída com sucesso!", "success");
      await fetchData();
      setPendingUser(null);
      setView('home');
    } else {
      notify("Código incorreto. Tente novamente.", "error");
    }
  };

  const handleSignup = async (userData: any) => {
    try {
      notify("Criando sua conta...");
      
      // 1. Criar usuário no Auth do Supabase
      const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: { data: { name: userData.name, phone: userData.phone, cpf: userData.cpf } }
    });

      if (authError) {
        notify("Erro no cadastro: " + authError.message, "error");
        return;
      }

      if (authData.user) {
        // 2. Criar perfil na tabela 'profiles'
        // Usamos upsert para evitar erros de duplicidade caso exista algum trigger no banco
        const { error: profileError } = await supabase.from('profiles').upsert([{
          id: authData.user.id,
          name: userData.name,
          phone: userData.phone,
          cpf: userData.cpf,
          is_admin: false, // Garantindo o valor padrão
          marketing_consent: userData.marketingConsent,
          joined_at: new Date().toISOString()
        }]);

        if (profileError) {
          console.error("Erro ao criar perfil:", profileError);
          // Se o erro for de RLS, o usuário pode precisar confirmar o e-mail primeiro
          if (profileError.code === '42501') {
            notify("Conta criada! Por favor, verifique seu e-mail para ativar seu acesso.", "success");
          } else {
            notify("Conta criada, mas houve um erro no perfil: " + profileError.message, "error");
          }
        } else {
          notify("Seja bem-vinda à nossa egrégora!", "success");
        }
      }

      await supabase.from('addresses').insert([{
        user_id: authData.user.id,
        name: 'Principal',
        type: 'Principal',
        street: userData.street,
        number: userData.number,
        complement: userData.complement,
        neighborhood: userData.neighborhood,
        city: userData.city,
        state: userData.state,
        zip_code: userData.zipCode
      }]);

      notify("Seja bem-vinda!", "success");
      await fetchData();
      setView('home');
    } catch (e) {
      console.error("Erro no processo de signup:", e);
      notify("Erro inesperado ao cadastrar.", "error");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setOrders([]);
    setAddresses([]);
    setWishlist([]);
    notify("Sessão encerrada.");
    setView('entrance');
  };

  const createOrder = async (paymentMethod: string = 'Mercado Pago') => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session || cart.length === 0) return;
    
    try {
      const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      
      const { data: order, error: orderError } = await supabase.from('orders').insert([{
        user_id: session.user.id,
        total_amount: total,
        status: 'pending',
        payment_method: paymentMethod
      }]).select().single();

      if (orderError) throw orderError;

      const orderItems = cart.map(item => ({
        order_id: order.id,
        product_id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image_url: item.image
      }));

      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
      if (itemsError) throw itemsError;

      fetchData();
    } catch (e) {
      console.error("Erro ao criar pedido:", e);
    }
  };

  const handleAddProduct = async (p: Product) => {
    if (!user?.isAdmin) return;
    const { id, ...productWithoutId } = p as any;
    const { error } = await supabase.from('products').insert([productWithoutId]);
    if (error) notify("Erro ao adicionar: " + error.message, "error");
    else {
      notify("Produto adicionado com sucesso!");
      fetchData();
    }
  };

  const handleUpdateProduct = async (p: Product) => {
    if (!user?.isAdmin) return;
    const { error } = await supabase.from('products').update(p).eq('id', p.id);
    if (error) notify("Erro ao atualizar: " + error.message, "error");
    else {
      notify("Produto atualizado!");
      fetchData();
    }
  };

  // Fix: use camelCase property names from config (type ShippingConfig) to update snake_case database columns
  const handleUpdateUser = async (data: Partial<User> & { password?: string }) => {
    if (!user) return;
    try {
      // Se houver senha nova, atualiza no Auth do Supabase
      if (data.password) {
        const { error: authError } = await supabase.auth.updateUser({
          password: data.password
        });
        if (authError) throw authError;
      }

      // Atualiza o perfil no banco de dados
      const { error } = await supabase.from('profiles').update({
        name: data.name,
        phone: data.phone,
        cpf: data.cpf,
        avatar_url: data.avatarUrl
      }).eq('id', user.id);

      if (error) throw error;
      
      const { password, ...userDataToSet } = data;
      setUser({ ...user, ...userDataToSet });
      notify("Perfil atualizado com sucesso!");
    } catch (e: any) {
      console.error("Erro ao atualizar perfil:", e);
      notify("Erro ao atualizar perfil: " + e.message, "error");
    }
  };

  const handleAddAddress = async (addr: Address) => {
    if (!user) return;
    try {
      const { error } = await supabase.from('addresses').insert([{
        user_id: user.id,
        name: addr.name,
        zip_code: addr.zipCode,
        street: addr.street,
        number: addr.number,
        complement: addr.complement,
        neighborhood: addr.neighborhood,
        city: addr.city,
        state: addr.state,
        type: addr.type
      }]);

      if (error) throw error;
      
      fetchData(); // Recarrega endereços
      notify("Endereço adicionado!");
    } catch (e: any) {
      console.error("Erro ao adicionar endereço:", e);
      notify("Erro ao adicionar endereço.", "error");
    }
  };

  const handleDeleteAddress = async (id: string) => {
    try {
      const { error } = await supabase.from('addresses').delete().eq('id', id);
      if (error) throw error;
      fetchData();
      notify("Endereço removido.");
    } catch (e: any) {
      console.error("Erro ao remover endereço:", e);
      notify("Erro ao remover endereço.", "error");
    }
  };

  const handleUpdateShipping = async (config: ShippingConfig) => {
    if (!user?.isAdmin) return;
    const { error } = await supabase.from('global_settings').update({
      origin_zip_code: config.originZipCode,
      flat_rate: config.flatRate,
      free_shipping_threshold: config.freeShippingThreshold,
      estimated_days_base: config.estimatedDaysBase || 5
    }).eq('id', 1);

    if (error) notify("Erro ao salvar config: " + error.message, "error");
    else notify("Configurações atualizadas!");
  };

  const handleDeleteProduct = async (id: string) => {
    if (!user?.isAdmin) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) notify("Erro ao excluir: " + error.message, "error");
    else {
      notify("Produto removido.");
      fetchData();
    }
  };

  const addToCart = (product: Product, quantity: number) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      }
      return [...prevCart, { ...product, quantity }];
    });
    setIsCartOpen(true);
  };

  const updateCartQuantity = (id: string, delta: number) => {
    setCart(prevCart => 
      prevCart.map(item => 
        item.id === id 
          ? { ...item, quantity: Math.max(1, item.quantity + delta) } 
          : item
      )
    );
  };

  const removeFromCart = (id: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
    notify("Sacola esvaziada.");
  };

const toggleWishlist = async (productId: string) => {
  if (!user) {
    notify("Faça login para favoritar.", "error");
    return;
  }

  try {
    const isRemoving = wishlist.includes(productId);

    if (isRemoving) {
      const { error } = await supabase
        .from("wishlist")
        .delete()
        .eq("user_id", user.id)
        .eq("product_id", productId);

      if (error) throw error;

      setWishlist(prev => prev.filter(id => id !== productId));
      notify("Removido dos favoritos");

    } else {
      const { error } = await supabase
        .from("wishlist")
        .insert([
          {
            user_id: user.id,
            product_id: productId
          }
        ]);

      if (error) throw error;

      setWishlist(prev => {
        if (prev.includes(productId)) return prev;
        return [...prev, productId];
      });

      notify("Adicionado aos favoritos");
    }

  } catch (err) {
    console.error("Erro na wishlist:", err);
    notify("Erro ao atualizar favoritos.", "error");
  }
};

  const renderView = () => {
    switch (view) {
      case 'login': return <Login onLogin={handleLogin} onNavigate={setView} />;
      case 'signup': return <Signup onSignup={handleSignup} onNavigate={setView} onNotify={notify} />;
      case 'admin':
        if (!user?.isAdmin) {
          setTimeout(() => setView('home'), 0);
          return <Home onNavigate={setView} />;
        }
        return (
          <Admin 
            products={products} 
            orders={orders}
            shippingConfig={shippingConfig}
            onAdd={handleAddProduct} 
            onUpdate={handleUpdateProduct} 
            onDelete={handleDeleteProduct}
            onUpdateOrder={fetchData}
            onUpdateShipping={handleUpdateShipping}
            onNavigate={setView}
            onNotify={notify}
          />
        );
      case 'account':
        return user ? (
          <Account 
            user={user}
            products={products}
            onLogout={handleLogout} 
            orders={orders}
            addresses={addresses} 
            onAddAddress={handleAddAddress}
            onDeleteAddress={handleDeleteAddress}
            wishlist={wishlist}
            onToggleWishlist={toggleWishlist}
            onAddToCart={addToCart}
            onUpdateUser={handleUpdateUser}
            onNavigate={setView}
            onNotify={notify}
          />
        ) : <Login onLogin={handleLogin} onNavigate={setView} />;
      case 'home': 
        return (
          <Home 
            onNavigate={(v, cat) => {
              if (cat) setSelectedCategory(cat);
              else if (v === 'store') setSelectedCategory('Todos');
              setView(v);
            }} 
          />
        );
      case 'store':
        return (
          <Store 
            initialCategory={selectedCategory} 
            onAddToCart={addToCart} 
            onToggleWishlist={toggleWishlist} 
            wishlist={wishlist}
            products={products.length > 0 ? products : INITIAL_PRODUCTS}
          />
        );
      case 'links': return <SocialLinks />;
      case 'about': return <About />;
      case 'privacy': return <PrivacyPolicy />;
      case 'terms': return <TermsOfUse />;
      case 'delivery': return <Delivery />;
      case 'payment': return <Payment />;
      case 'returns': return <Returns />;
      case 'payment-success':
        return (
          <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center space-y-6">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="font-cinzel font-bold text-3xl">Pagamento Confirmado!</h2>
            <p className="font-playfair italic text-stone-500 max-w-md">
              Sua jornada mística começou. Recebemos seu pedido e já estamos preparando suas ferramentas de poder com todo carinho.
            </p>
            <button onClick={() => setView('home')} className="px-10 py-4 bg-[#1A1518] text-white text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-[#C082A0] transition-all">
              Voltar para a Home
            </button>
          </div>
        );
      case 'payment-failure':
        return (
          <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center space-y-6">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center">
              <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="font-cinzel font-bold text-3xl">Ops! Algo deu errado.</h2>
            <p className="font-playfair italic text-stone-500 max-w-md">
              Não conseguimos processar seu pagamento. Por favor, verifique os dados ou tente outra forma de pagamento.
            </p>
            <button onClick={() => setView('store')} className="px-10 py-4 bg-[#1A1518] text-white text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-[#C082A0] transition-all">
              Tentar Novamente
            </button>
          </div>
        );
      case 'payment-pending':
        return (
          <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center space-y-6">
            <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center">
              <AlertCircle className="w-10 h-10 text-amber-500" />
            </div>
            <h2 className="font-cinzel font-bold text-3xl">Pagamento em Processamento</h2>
            <p className="font-playfair italic text-stone-500 max-w-md">
              Seu pagamento está sendo analisado. Assim que for confirmado, você receberá um e-mail de confirmação.
            </p>
            <button onClick={() => setView('home')} className="px-10 py-4 bg-[#1A1518] text-white text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-[#C082A0] transition-all">
              Ir para Home
            </button>
          </div>
        );
      case 'entrance':
      default:
        return <Entrance onSelect={(v) => {
          if (v === 'home') setSelectedCategory('Todos');
          setView(v);
        }} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] selection:bg-[#C082A0]/20 text-[#1A1518] flex flex-col">
      <Navbar 
        currentView={view} 
        setView={setView} 
        onSelectCategory={setSelectedCategory}
        cartCount={cart.reduce((acc, item) => acc + item.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        user={user}
      />
      
      {notification && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[3000] animate-in fade-in slide-in-from-top-4 duration-500">
          <div className={`px-8 py-4 rounded-full shadow-2xl flex items-center space-x-3 border ${
            notification.type === 'error' ? 'bg-red-50 border-red-100 text-red-500' : 'bg-[#1A1518] border-stone-800 text-white'
          }`}>
            {notification.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4 text-[#C082A0]" />}
            <span className="text-[10px] font-bold uppercase tracking-widest">{notification.msg}</span>
          </div>
        </div>
      )}

      <main className="flex-1">
        {renderView()}
      </main>

      {view !== 'entrance' && <Footer currentView={view} setView={setView} />}

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cart}
        shippingConfig={shippingConfig}
        addresses={addresses}
        onUpdateQuantity={updateCartQuantity}
        onRemove={removeFromCart}
        onClearCart={clearCart}
      />

      {view !== 'entrance' && (
        <a 
          href="https://api.whatsapp.com/send?phone=5548988365882&text=Oie!%20Gostaria%20de%20agendar%20um%20horário."
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-10 right-10 z-[90] group"
        >
          <div className="absolute -inset-4 bg-[#C082A0]/10 rounded-full blur-xl group-hover:bg-[#C082A0]/30 transition-all duration-500"></div>
          <div className="relative bg-[#1A1518] text-white w-14 h-14 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-[#C082A0] translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
            <WhatsAppIcon className="w-7 h-7 relative z-10" />
          </div>
        </a>
      )}
    </div>
  );
}

export default App;
