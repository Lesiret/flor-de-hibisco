
import React from 'react';
import { RefreshCcw, AlertTriangle, CheckCircle, Mail } from 'lucide-react';

const Returns: React.FC = () => {
  return (
    <div className="min-h-screen bg-white pt-48 pb-32 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center text-center mb-20">
          <span className="text-[#C082A0] font-cinzel text-[10px] font-bold tracking-[0.8em] uppercase mb-6">Ética & Harmonia</span>
          <h1 className="text-4xl md:text-6xl font-cinzel font-bold text-[#1A1518] mb-8 text-center">Trocas e Devoluções</h1>
          <div className="w-12 h-1 bg-stone-100" />
        </div>

        <div className="space-y-16 text-stone-600 font-light leading-relaxed text-lg">
          <section className="space-y-6">
            <div className="flex items-center space-x-4 text-[#1A1518]">
              <RefreshCcw className="w-6 h-6 text-[#C082A0]" />
              <h2 className="font-cinzel font-bold text-xl uppercase tracking-widest">Direito de Arrependimento</h2>
            </div>
            <p>
              Conforme o Código de Defesa do Consumidor, você tem até <strong>7 dias corridos</strong> após o recebimento para solicitar a devolução por arrependimento. O produto deve estar em sua embalagem original, sem sinais de uso ou violação do lacre (especialmente para óleos e banhos).
            </p>
          </section>

          <section className="space-y-6">
            <div className="flex items-center space-x-4 text-[#1A1518]">
              <AlertTriangle className="w-6 h-6 text-[#C082A0]" />
              <h2 className="font-cinzel font-bold text-xl uppercase tracking-widest">Produtos com Defeito ou Avarias</h2>
            </div>
            <p>
              Se sua encomenda chegar com alguma avaria devido ao transporte ou defeito de fabricação, entre em contato conosco em até 48 horas após o recebimento enviando fotos do ocorrido para nosso e-mail.
            </p>
          </section>

          <section className="space-y-6">
            <div className="flex items-center space-x-4 text-[#1A1518]">
              <CheckCircle className="w-6 h-6 text-[#C082A0]" />
              <h2 className="font-cinzel font-bold text-xl uppercase tracking-widest">Como Solicitar</h2>
            </div>
            <p>
              Para iniciar um processo de troca ou devolução, envie um e-mail para <span className="text-[#C082A0] font-medium font-bold">flordehibisco_@hotmail.com</span> com o número do seu pedido e o motivo da solicitação. Responderemos com as instruções de postagem em até 2 dias úteis.
            </p>
          </section>

          <section className="space-y-6 pt-10 border-t border-stone-100">
            <h2 className="font-cinzel font-bold text-xl text-[#1A1518] uppercase tracking-widest">Restituição de Valores</h2>
            <p>
              A restituição será feita utilizando a mesma forma de pagamento escolhida no processo de compra, após o recebimento e conferência do produto em nosso ateliê.
            </p>
            <div className="mt-8 flex items-center space-x-3 text-stone-400">
              <Mail className="w-4 h-4" />
              <span className="text-sm tracking-widest uppercase">Suporte: flordehibisco_@hotmail.com</span>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Returns;
