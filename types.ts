
export type ViewState = 
  | 'home' | 'entrance' | 'store' | 'links' | 'about' | 'privacy' | 'terms'
  | 'delivery' | 'payment' | 'returns' | 'login' | 'signup' | 'account' | 'wishlist' | 'admin'
  | 'payment-success' | 'payment-failure' | 'payment-pending';

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  // Campos para Frete Real
  weight: number; // em kg
  width: number;  // em cm
  height: number; // em cm
  length: number; // em cm
}

export interface CartItem extends Product {
  quantity: number;
}

export interface ShippingOption {
  id: string;
  name: string;
  price: number;
  delivery_time: number;
  company: 'Correios' | 'Jadlog' | 'Azul Cargo' | string;
}

export interface ShippingConfig {
  originZipCode: string;
  flatRate: number;
  freeShippingThreshold: number;
  estimatedDaysBase: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  joinedAt: string;
  password?: string;
  avatarUrl?: string;
  marketingConsent?: boolean;
  isAdmin?: boolean;
}

export interface Address {
  id: string;
  name: string;
  type: 'Principal' | 'Alternativo';
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  price_at_time: number;
  products?: Product;
}

export interface Order {
  id: string;
  user_id: string; // necessário para filtrar pedidos do usuário
  total: number;
  status: 
    | 'Pagamento em análise'
    | 'Pagamento aprovado'
    | 'Aguardando envio'
    | 'Produto enviado'
    | 'Entregue'
    | 'Cancelado';
  tracking_code?: string;
  payment_method: string;
  created_at: string; // usamos esse campo como data do pedido

  order_items?: OrderItem[];
}

export interface SocialLink {
  label: string;
  url: string;
  icon: string;
  highlight?: boolean;
}
