
import React from 'react';
import { ShieldCheck, Lock, Eye, FileText } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-white pt-48 pb-32 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Cabeçalho */}
        <div className="flex flex-col items-center text-center mb-20">
          <span className="text-[#C082A0] font-cinzel text-[10px] font-bold tracking-[0.8em] uppercase mb-6">Segurança & Ética</span>
          <h1 className="text-4xl md:text-6xl font-cinzel font-bold text-[#1A1518] mb-8">Política de Privacidade</h1>
          <div className="w-12 h-1 bg-stone-100" />
        </div>

        {/* Conteúdo Informativo */}
        <div className="space-y-16 text-stone-600 font-light leading-relaxed text-lg">
          <section className="space-y-6">
            <div className="flex items-center space-x-4 text-[#1A1518]">
              <ShieldCheck className="w-6 h-6 text-[#C082A0]" />
              <h2 className="font-cinzel font-bold text-xl uppercase tracking-widest">Compromisso com sua Privacidade</h2>
            </div>
            <p>
              Na <strong>Flor de Hibisco</strong>, a privacidade e a segurança dos dados de nossos clientes são prioridades absolutas. Esta política detalha como coletamos, usamos e protegemos as informações fornecidas por você ao utilizar nosso site e adquirir nossas alquimias.
            </p>
          </section>

          <section className="space-y-6">
            <div className="flex items-center space-x-4 text-[#1A1518]">
              <FileText className="w-6 h-6 text-[#C082A0]" />
              <h2 className="font-cinzel font-bold text-xl uppercase tracking-widest">Coleta de Informações</h2>
            </div>
            <p>
              Coletamos informações essenciais para o processamento de seus pedidos e para proporcionar uma experiência personalizada. Isso inclui:
            </p>
            <ul className="list-disc pl-6 space-y-3 italic">
              <li>Dados cadastrais (nome, e-mail, telefone e endereço para entrega).</li>
              <li>Informações de navegação através de cookies para melhoria da plataforma.</li>
              <li>Histórico de compras para atendimento personalizado e sugestões de oráculos.</li>
            </ul>
          </section>

          <section className="space-y-6">
            <div className="flex items-center space-x-4 text-[#1A1518]">
              <Lock className="w-6 h-6 text-[#C082A0]" />
              <h2 className="font-cinzel font-bold text-xl uppercase tracking-widest">Segurança dos Dados</h2>
            </div>
            <p>
              Utilizamos tecnologias de ponta e protocolos de segurança (SSL) para garantir que seus dados de pagamento e informações pessoais estejam sempre protegidos. Jamais compartilhamos, vendemos ou alugamos seus dados para terceiros.
            </p>
          </section>

          <section className="space-y-6">
            <div className="flex items-center space-x-4 text-[#1A1518]">
              <Eye className="w-6 h-6 text-[#C082A0]" />
              <h2 className="font-cinzel font-bold text-xl uppercase tracking-widest">Cookies e Navegação</h2>
            </div>
            <p>
              O uso de cookies permite que nosso site "relembre" suas preferências e melhore sua navegação. Você pode desativar os cookies em seu navegador a qualquer momento, embora isso possa afetar algumas funcionalidades da loja mística.
            </p>
          </section>

          <section className="space-y-6 pt-10 border-t border-stone-100">
            <h2 className="font-cinzel font-bold text-xl text-[#1A1518] uppercase tracking-widest">Dúvidas?</h2>
            <p>
              Caso tenha qualquer dúvida sobre como tratamos seus dados, entre em contato através do e-mail <span className="text-[#C082A0] font-medium">flordehibisco_@hotmail.com</span>.
            </p>
          </section>
        </div>

        {/* Rodapé Interno da Página */}
        <div className="mt-24 pt-12 border-t border-stone-50 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-stone-300">
            Atualizado em Março de 2024 • Flor de Hibisco
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
