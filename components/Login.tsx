
import React, { useState } from 'react';
import { Eye, EyeOff, ArrowRight, Mail, Lock } from 'lucide-react';
import { ViewState } from '../types';

interface LoginProps {
  onLogin: (email: string, pass: string) => void;
  onNavigate: (view: ViewState) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onNavigate }) => {
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6] px-6 pt-20">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] p-12 shadow-premium border border-stone-100 animate-in fade-in zoom-in-95 duration-700">
        <div className="text-center mb-10">
          <span className="text-[#C082A0] font-cinzel text-[9px] font-bold tracking-[0.5em] uppercase mb-4 block">Bem-vinda de volta</span>
          <h1 className="text-3xl font-cinzel font-bold text-[#1A1518]">Acessar conta</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 ml-1">E-mail</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300" />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full bg-[#FAF9F6] border-none py-4 pl-12 pr-4 rounded-2xl text-sm focus:ring-1 focus:ring-[#C082A0]/20"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 ml-1">Senha</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300" />
              <input 
                type={showPass ? 'text' : 'password'} 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
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

          <div className="flex justify-end">
            <button type="button" className="text-[9px] font-bold uppercase tracking-widest text-stone-400 hover:text-[#C082A0] transition-colors">Esqueci a senha</button>
          </div>

          <button 
            type="submit"
            className="w-full bg-[#1A1518] text-white py-5 rounded-full text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-[#C082A0] transition-all duration-500 shadow-xl flex items-center justify-center space-x-3 group"
          >
            <span>Entrar</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-12 pt-8 border-t border-stone-50 text-center space-y-4">
          <p className="text-stone-400 text-xs font-light">Ainda não faz parte da nossa egrégora?</p>
          <button 
            onClick={() => onNavigate('signup')}
            className="text-[10px] font-bold uppercase tracking-widest text-[#C082A0] border-b border-[#C082A0]/30 pb-1 hover:border-[#C082A0] transition-all"
          >
            Criar conta gratuita
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
