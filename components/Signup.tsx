import React, { useState } from 'react';
import { Eye, EyeOff, ArrowRight, Mail, Lock, User as UserIcon, Fingerprint, Phone } from 'lucide-react';
import { ViewState, User } from '../types';
import { Check } from 'lucide-react';

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
    marketingConsent: false,
    // Campos de endereço
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: '',
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const passwordsMatch = formData.password === formData.confirmPassword;
  const isConfirmError = touched.confirmPassword && !passwordsMatch && formData.confirmPassword !== '';

  const maskCPF = (value: string) =>
    value.replace(/\D/g, '')
         .replace(/(\d{3})(\d)/, '$1.$2')
         .replace(/(\d{3})(\d)/, '$1.$2')
         .replace(/(\d{3})(\d{1,2})/, '$1-$2')
         .replace(/(-\d{2})\d+?$/, '$1');

  const maskPhone = (value: string) =>
    value.replace(/\D/g, '')
         .replace(/^(\d{2})(\d)/g, '($1) $2')
         .replace(/(\d)(\d{4})$/, '$1-$2');

  const maskZipCode = (value: string) =>
    value.replace(/\D/g, '').replace(/(\d{5})(\d)/, '$1-$2');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value, type, checked } = e.target;
    if (name === 'cpf') value = maskCPF(value);
    if (name === 'phone') value = maskPhone(value);
    if (name === 'zipCode') value = maskZipCode(value);

    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleBlur = (name: string) => setTouched({ ...touched, [name]: true });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordsMatch) {
      onNotify('As senhas precisam ser iguais.', 'error');
      return;
    }
    if (!acceptedTerms) {
      onNotify('Você precisa aceitar os termos de uso.', 'error');
      return;
    }
    // Envia todos os dados da conta + endereço
    onSignup(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6] px-6 pt-24 pb-16">
      <div className="w-full max-w-xl bg-white rounded-[2.5rem] p-10 md:p-14 shadow-premium border border-stone-100">
        <div className="text-center mb-10">
          <span className="text-[#C082A0] font-cinzel text-[9px] font-bold tracking-[0.5em] uppercase mb-4 block">Inicie sua jornada</span>
          <h1 className="text-3xl font-cinzel font-bold text-[#1A1518]">Criar Conta</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campos do Usuário */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 ml-1">Nome Completo</label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300" />
                <input name="name" type="text" required value={formData.name} onChange={handleChange} placeholder="Seu nome"
                  className="w-full bg-[#FAF9F6] border-none py-4 pl-12 pr-4 rounded-2xl text-sm focus:ring-1 focus:ring-[#C082A0]/20" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 ml-1">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300" />
                <input name="email" type="email" required value={formData.email} onChange={handleChange} placeholder="seu@email.com"
                  className="w-full bg-[#FAF9F6] border-none py-4 pl-12 pr-4 rounded-2xl text-sm focus:ring-1 focus:ring-[#C082A0]/20" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 ml-1">CPF</label>
              <div className="relative">
                <Fingerprint className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300" />
                <input name="cpf" maxLength={14} required value={formData.cpf} onChange={handleChange} placeholder="000.000.000-00"
                  className="w-full bg-[#FAF9F6] border-none py-4 pl-12 pr-4 rounded-2xl text-sm focus:ring-1 focus:ring-[#C082A0]/20" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 ml-1">Telefone</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300" />
                <input name="phone" required value={formData.phone} onChange={handleChange} placeholder="(00) 00000-0000"
                  className="w-full bg-[#FAF9F6] border-none py-4 pl-12 pr-4 rounded-2xl text-sm focus:ring-1 focus:ring-[#C082A0]/20" />
              </div>
            </div>
          </div>

          {/* Campos de senha */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 ml-1">Senha</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300" />
                <input name="password" type={showPass ? 'text' : 'password'} required value={formData.password} onChange={handleChange} placeholder="Mínimo 6"
                  className="w-full bg-[#FAF9F6] border-none py-4 pl-12 pr-12 rounded-2xl text-sm focus:ring-1 focus:ring-[#C082A0]/20" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-300 hover:text-[#C082A0]">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 ml-1">Confirmar</label>
              <div className="relative">
                <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${isConfirmError ? 'text-red-400' : 'text-stone-300'}`} />
                <input name="confirmPassword" type={showPass ? 'text' : 'password'} required onBlur={() => handleBlur('confirmPassword')}
                  value={formData.confirmPassword} onChange={handleChange} placeholder="Repita a senha"
                  className={`w-full bg-[#FAF9F6] py-4 pl-12 pr-12 rounded-2xl text-sm transition-all focus:ring-1 ${
                    isConfirmError ? 'border-red-400 ring-1 ring-red-400' : 'border-none focus:ring-[#C082A0]/20'
                  }`} />
              </div>
            </div>
          </div>

          {/* Campos do endereço */}
          <h3 className="text-sm font-bold text-stone-700 mt-6 mb-2">Endereço</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {['street','number','complement','neighborhood','city','state','zipCode'].map((field) => (
              <div key={field} className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 ml-1">{field.charAt(0).toUpperCase()+field.slice(1)}</label>
                <input
                  name={field}
                  required={field !== 'complement'}
                  value={formData[field as keyof typeof formData]}
                  onChange={handleChange}
                  placeholder={field === 'zipCode' ? '00000-000' : field}
                  className="w-full bg-[#FAF9F6] border-none py-4 px-4 rounded-2xl text-sm focus:ring-1 focus:ring-[#C082A0]/20"
                />
              </div>
            ))}
          </div>

          {/* Marketing consent e termos */}
          <div className="space-y-4 pt-4">
            <div className="flex items-start space-x-3 group cursor-pointer" onClick={() => setFormData({...formData, marketingConsent: !formData.marketingConsent})}>
              <div className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition-all ${formData.marketingConsent ? 'bg-[#1A1518] border-[#1A1518]' : 'bg-white border-stone-200 group-hover:border-[#C082A0]'}`}>
                {formData.marketingConsent && <Check className="w-3.5 h-3.5 text-white stroke-[3px]" />}
              </div>
              <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest leading-relaxed">
                Aceito receber avisos de novas tiragens, rituais e ofertas exclusivas.
              </p>
            </div>

            <div className="flex items-start space-x-3">
              <button type="button" onClick={() => setAcceptedTerms(!acceptedTerms)}
                className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition-all ${acceptedTerms ? 'bg-[#C082A0] border-[#C082A0]' : 'bg-white border-stone-200'}`}>
                {acceptedTerms && <Check className="w-3.5 h-3.5 text-white stroke-[3px]" />}
              </button>
              <p className="text-[10px] text-stone-400 leading-relaxed">
                Li e concordo com os Termos de Uso.
              </p>
            </div>
          </div>

          {/* Botão submit */}
          <button type="submit"
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
    </div>
  );
};

export default Signup;