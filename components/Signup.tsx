
import React, { useState, useRef, useEffect } from 'react';
import { Eye, EyeOff, ArrowRight, Mail, Lock, User as UserIcon, AlertCircle, X, Check, Phone, Fingerprint } from 'lucide-react';
import { ViewState, User } from '../types';

interface SignupProps {
  onSignup: (userData: Partial<User>) => void;
  onNavigate: (view: ViewState) => void;
  onNotify: (msg: string, type: 'success' | 'error') => void;
}

const Signup: React.FC<SignupProps> = ({ onSignup, onNavigate, onNotify }) => {
  const [showPass, setShowPass] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    cpf: '',
    password: '',
    confirmPassword: '',
    marketingConsent: false
  });
  
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [termsScrolledToBottom, setTermsScrolledToBottom] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const passwordsMatch = formData.password === formData.confirmPassword;
  const isConfirmError = touched.confirmPassword && !passwordsMatch && formData.confirmPassword !== '';

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 50) {
      setTermsScrolledToBottom(true);
    }
  };

  const maskCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const maskPhone = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/^(\d{2})(\d)/g, '($1) $2')
      .replace(/(\d)(\d{4})$/, '$1-$2');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value, type, checked } = e.target;
    if (name === 'cpf') value = maskCPF(value);
    if (name === 'phone') value = maskPhone(value);
    
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  const handleBlur = (name: string) => {
    setTouched({ ...touched, [name]: true });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordsMatch) {
      onNotify('As senhas precisam ser iguais.', 'error');
      return;
    }
    if (!acceptedTerms) {
      onNotify('Você precisa ler e aceitar os termos de uso.', 'error');
      return;
    }
    onSignup(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6] px-6 pt-24 pb-16">
      <div className="w-full max-w-xl bg-white rounded-[2.5rem] p-10 md:p-14 shadow-premium border border-stone-100 animate-in fade-in zoom-in-95 duration-700">
        <div className="text-center mb-10">
          <span className="text-[#C082A0] font-cinzel text-[9px] font-bold tracking-[0.5em] uppercase mb-4 block">Inicie sua jornada</span>
          <h1 className="text-3xl font-cinzel font-bold text-[#1A1518]">Criar Conta</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nome */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 ml-1">Nome Completo</label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300" />
                <input 
                  name="name"
                  type="text" 
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Seu nome"
                  className="w-full bg-[#FAF9F6] border-none py-4 pl-12 pr-4 rounded-2xl text-sm focus:ring-1 focus:ring-[#C082A0]/20"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 ml-1">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300" />
                <input 
                  name="email"
                  type="email" 
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="seu@email.com"
                  className="w-full bg-[#FAF9F6] border-none py-4 pl-12 pr-4 rounded-2xl text-sm focus:ring-1 focus:ring-[#C082A0]/20"
                />
              </div>
            </div>

            {/* CPF */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 ml-1">CPF</label>
              <div className="relative">
                <Fingerprint className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300" />
                <input 
                  name="cpf"
                  maxLength={14}
                  required
                  value={formData.cpf}
                  onChange={handleChange}
                  placeholder="000.000.000-00"
                  className="w-full bg-[#FAF9F6] border-none py-4 pl-12 pr-4 rounded-2xl text-sm focus:ring-1 focus:ring-[#C082A0]/20"
                />
              </div>
            </div>

            {/* Telefone */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 ml-1">Telefone</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300" />
                <input 
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="(00) 00000-0000"
                  className="w-full bg-[#FAF9F6] border-none py-4 pl-12 pr-4 rounded-2xl text-sm focus:ring-1 focus:ring-[#C082A0]/20"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Senha */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 ml-1">Senha</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300" />
                <input 
                  name="password"
                  type={showPass ? 'text' : 'password'} 
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Mínimo 6"
                  className="w-full bg-[#FAF9F6] border-none py-4 pl-12 pr-12 rounded-2xl text-sm focus:ring-1 focus:ring-[#C082A0]/20"
                />
                <button 
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-300 hover:text-[#C082A0] transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirmar Senha */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 ml-1">Confirmar</label>
              <div className="relative">
                <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${isConfirmError ? 'text-red-400' : 'text-stone-300'}`} />
                <input 
                  name="confirmPassword"
                  type={showPass ? 'text' : 'password'} 
                  required
                  onBlur={() => handleBlur('confirmPassword')}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repita a senha"
                  className={`w-full bg-[#FAF9F6] py-4 pl-12 pr-12 rounded-2xl text-sm transition-all focus:ring-1 ${
                    isConfirmError ? 'border-red-400 ring-1 ring-red-400' : 'border-none focus:ring-[#C082A0]/20'
                  }`}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            {/* Marketing Consent */}
            <div className="flex items-start space-x-3 group cursor-pointer" onClick={() => setFormData({...formData, marketingConsent: !formData.marketingConsent})}>
              <div className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition-all ${formData.marketingConsent ? 'bg-[#1A1518] border-[#1A1518]' : 'bg-white border-stone-200 group-hover:border-[#C082A0]'}`}>
                {formData.marketingConsent && <Check className="w-3.5 h-3.5 text-white stroke-[3px]" />}
              </div>
              <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest leading-relaxed">
                Aceito receber avisos de novas tiragens, rituais e ofertas exclusivas.
              </p>
            </div>

            {/* Checkbox Termos */}
            <div className="flex items-start space-x-3">
              <button 
                type="button"
                onClick={() => acceptedTerms ? setAcceptedTerms(false) : setShowTermsModal(true)}
                className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition-all ${acceptedTerms ? 'bg-[#C082A0] border-[#C082A0]' : 'bg-white border-stone-200'}`}
              >
                {acceptedTerms && <Check className="w-3.5 h-3.5 text-white stroke-[3px]" />}
              </button>
              <p className="text-[10px] text-stone-400 leading-relaxed">
                Li e concordo com os{' '}
                <button type="button" onClick={() => setShowTermsModal(true)} className="text-[#C082A0] font-bold underline">Termos de Uso</button>.
              </p>
            </div>
          </div>

          <button 
            type="submit"
            disabled={!acceptedTerms || !passwordsMatch || formData.password === ''}
            className={`w-full py-5 rounded-full text-[10px] font-bold uppercase tracking-[0.4em] transition-all duration-500 shadow-xl flex items-center justify-center space-x-3 group mt-4 ${
              acceptedTerms && passwordsMatch && formData.password !== ''
              ? 'bg-[#1A1518] text-white hover:bg-[#C082A0]' 
              : 'bg-stone-100 text-stone-300 cursor-not-allowed shadow-none'
            }`}
          >
            <span>Criar Minha Conta</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-stone-50 text-center">
          <p className="text-stone-400 text-xs font-light mb-4">Já possui um cadastro?</p>
          <button onClick={() => onNavigate('login')} className="text-[10px] font-bold uppercase tracking-widest text-[#C082A0] border-b border-[#C082A0]/30 pb-1 hover:border-[#C082A0]">Acessar Conta</button>
        </div>
      </div>

      {/* Modal Termos (simplificado para brevidade) */}
      {showTermsModal && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
          <div className="relative bg-white w-full max-w-2xl max-h-[80vh] rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95">
            <div className="p-8 border-b border-stone-100 flex items-center justify-between">
              <h3 className="font-cinzel font-bold text-lg">Termos de Uso</h3>
              <button onClick={() => setShowTermsModal(false)}><X className="w-6 h-6" /></button>
            </div>
            <div onScroll={handleScroll} className="flex-1 overflow-y-auto p-10 space-y-8 text-stone-500 text-sm leading-relaxed">
              <div className="space-y-4">
                <h4 className="font-cinzel font-bold text-[#1A1518] uppercase tracking-widest text-xs">1. Aceitação da Egrégora</h4>
                <p>Ao se cadastrar na Flor de Hibisco, você entra em nossa egrégora de cuidado e autoconhecimento. Você concorda em utilizar nossas alquimias e serviços de forma ética e respeitosa.</p>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-cinzel font-bold text-[#1A1518] uppercase tracking-widest text-xs">2. Uso das Alquimias</h4>
                <p>Nossos produtos são ferramentas de suporte espiritual e bem-estar. O uso deve seguir as orientações fornecidas. A Flor de Hibisco não se responsabiliza pelo uso indevido das fórmulas consagradas.</p>
              </div>

              <div className="space-y-4">
                <h4 className="font-cinzel font-bold text-[#1A1518] uppercase tracking-widest text-xs">3. Sigilo e Confidencialidade</h4>
                <p>Seus dados são sagrados para nós. Comprometemo-nos a nunca compartilhar suas informações pessoais com terceiros, utilizando-as apenas para o processamento de seus pedidos e comunicações da marca.</p>
              </div>

              <div className="space-y-4">
                <h4 className="font-cinzel font-bold text-[#1A1518] uppercase tracking-widest text-xs">4. Responsabilidade da Conta</h4>
                <p>Você é a guardiã de sua senha. Mantenha seus dados de acesso em segurança para garantir a integridade de sua jornada em nossa plataforma.</p>
              </div>

              <div className="space-y-4">
                <h4 className="font-cinzel font-bold text-[#1A1518] uppercase tracking-widest text-xs">5. Propriedade Mística</h4>
                <p>Todo o conteúdo, artes, fórmulas e textos são de propriedade intelectual da Flor de Hibisco. A reprodução sem autorização fere não apenas as leis humanas, mas a ética de nossa comunidade.</p>
              </div>

              <p className="text-center font-bold text-[#C082A0] pt-4">Role até o fim para selar este acordo.</p>
            </div>
            <div className="p-8 border-t border-stone-100">
              <button 
                disabled={!termsScrolledToBottom}
                onClick={() => { setAcceptedTerms(true); setShowTermsModal(false); }}
                className={`w-full py-5 rounded-full text-[10px] font-bold uppercase tracking-[0.4em] transition-all ${termsScrolledToBottom ? 'bg-[#1A1518] text-white' : 'bg-stone-50 text-stone-300'}`}
              >
                Li e Aceito
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Signup;
