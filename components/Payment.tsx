
import React from 'react';
import { CreditCard, QrCode, ShieldCheck, Banknote } from 'lucide-react';

const Payment: React.FC = () => {
  return (
    <div className="min-h-screen bg-white pt-48 pb-32 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center text-center mb-20">
          <span className="text-[#C082A0] font-cinzel text-[10px] font-bold tracking-[0.8em] uppercase mb-6">Troca Justa</span>
          <h1 className="text-4xl md:text-6xl font-cinzel font-bold text-[#1A1518] mb-8">Pagamento</h1>
          <div className="w-12 h-1 bg-stone-100" />
        </div>

        <div className="space-y-16 text-stone-600 font-light leading-relaxed text-lg">
          <section className="space-y-6">
            <div className="flex items-center space-x-4 text-[#1A1518]">
              <QrCode className="w-6 h-6 text-[#C082A0]" />
              <h2 className="font-cinzel font-bold text-xl uppercase tracking-widest">PIX</h2>
            </div>
            <p>
              A forma mais rápida de processar seu pedido. Ao escolher o PIX, você recebe um QR Code ou chave 'Copia e Cola'. A confirmação é instantânea, agilizando a preparação da sua encomenda.
            </p>
          </section>

          <section className="space-y-6">
            <div className="flex items-center space-x-4 text-[#1A1518]">
              <CreditCard className="w-6 h-6 text-[#C082A0]" />
              <h2 className="font-cinzel font-bold text-xl uppercase tracking-widest">Cartão de Crédito</h2>
            </div>
            <p>
              Aceitamos as principais bandeiras (Visa, Mastercard, Amex, Elo). Oferecemos opções de parcelamento para que você possa adquirir suas ferramentas de poder com tranquilidade.
            </p>
          </section>

          <section className="space-y-6">
            <div className="flex items-center space-x-4 text-[#1A1518]">
              <Banknote className="w-6 h-6 text-[#C082A0]" />
              <h2 className="font-cinzel font-bold text-xl uppercase tracking-widest">Boleto Bancário</h2>
            </div>
            <p>
              Para pagamentos via boleto, o prazo de compensação é de até <strong>3 dias úteis</strong>. O pedido só começará a ser preparado após essa confirmação.
            </p>
          </section>

          <section className="space-y-6 pt-10 border-t border-stone-100">
            <div className="flex items-center space-x-4 text-[#1A1518]">
              <ShieldCheck className="w-6 h-6 text-[#C082A0]" />
              <h2 className="font-cinzel font-bold text-xl uppercase tracking-widest">Ambiente Seguro</h2>
            </div>
            <p>
              Todos os pagamentos são processados através de gateways seguros com criptografia SSL. Não armazenamos seus dados sensíveis de cartão em nosso servidor.
            </p>
            <p className="mt-4 italic">
              Precisa de ajuda com o pagamento? E-mail: <span className="text-[#C082A0] font-medium">flordehibisco_@hotmail.com</span>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Payment;
