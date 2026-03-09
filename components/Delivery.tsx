
import React from 'react';
import { Truck, Package, Clock, MapPin } from 'lucide-react';

const Delivery: React.FC = () => {
  return (
    <div className="min-h-screen bg-white pt-48 pb-32 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center text-center mb-20">
          <span className="text-[#C082A0] font-cinzel text-[10px] font-bold tracking-[0.8em] uppercase mb-6">Logística Sagrada</span>
          <h1 className="text-4xl md:text-6xl font-cinzel font-bold text-[#1A1518] mb-8">Entrega</h1>
          <div className="w-12 h-1 bg-stone-100" />
        </div>

        <div className="space-y-16 text-stone-600 font-light leading-relaxed text-lg">
          <section className="space-y-6">
            <div className="flex items-center space-x-4 text-[#1A1518]">
              <Clock className="w-6 h-6 text-[#C082A0]" />
              <h2 className="font-cinzel font-bold text-xl uppercase tracking-widest">Prazos de Envio</h2>
            </div>
            <p>
              Cada item da <strong>Flor de Hibisco</strong> é preparado com intenção. O prazo para postagem de nossos produtos é de até <strong>5 dias úteis</strong> após a confirmação do pagamento, tempo necessário para a consagração e embalagem cuidadosa.
            </p>
          </section>

          <section className="space-y-6">
            <div className="flex items-center space-x-4 text-[#1A1518]">
              <Truck className="w-6 h-6 text-[#C082A0]" />
              <h2 className="font-cinzel font-bold text-xl uppercase tracking-widest">Métodos de Entrega</h2>
            </div>
            <p>
              Utilizamos os serviços dos <strong>Correios (PAC e SEDEX)</strong> e transportadoras parceiras para garantir que sua encomenda chegue em segurança. O prazo final de entrega depende da sua localização e da modalidade escolhida no checkout.
            </p>
          </section>

          <section className="space-y-6">
            <div className="flex items-center space-x-4 text-[#1A1518]">
              <Package className="w-6 h-6 text-[#C082A0]" />
              <h2 className="font-cinzel font-bold text-xl uppercase tracking-widest">Rastreamento</h2>
            </div>
            <p>
              Assim que seu pedido for enviado, você receberá um código de rastreamento por e-mail para acompanhar a jornada da sua alquimia até sua casa.
            </p>
          </section>

          <section className="space-y-6 pt-10 border-t border-stone-100">
            <h2 className="font-cinzel font-bold text-xl text-[#1A1518] uppercase tracking-widest">Atenção ao Endereço</h2>
            <p>
              Certifique-se de preencher os dados de entrega corretamente. Em caso de reenvio por endereço incorreto ou ausência do destinatário, o custo do novo frete será de responsabilidade do cliente.
            </p>
            <p className="mt-4 italic">
              Dúvidas sobre seu envio? Contate-nos em <span className="text-[#C082A0] font-medium">flordehibisco_@hotmail.com</span>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Delivery;
