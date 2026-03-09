
import React from 'react';
import { FileText, ShieldCheck, Scale, HelpCircle } from 'lucide-react';

const TermsOfUse: React.FC = () => {
  return (
    <div className="min-h-screen bg-white pt-48 pb-32 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Cabeçalho */}
        <div className="flex flex-col items-center text-center mb-20">
          <span className="text-[#C082A0] font-cinzel text-[10px] font-bold tracking-[0.8em] uppercase mb-6">Diretrizes & Ética</span>
          <h1 className="text-4xl md:text-6xl font-cinzel font-bold text-[#1A1518] mb-8">Termos de Uso</h1>
          <div className="w-12 h-1 bg-stone-100" />
        </div>

        {/* Conteúdo */}
        <div className="space-y-16 text-stone-600 font-light leading-relaxed text-lg">
          <section className="space-y-6">
            <div className="flex items-center space-x-4 text-[#1A1518]">
              <Scale className="w-6 h-6 text-[#C082A0]" />
              <h2 className="font-cinzel font-bold text-xl uppercase tracking-widest">1. Aceitação dos Termos</h2>
            </div>
            <p>
              Ao acessar e utilizar a plataforma <strong>Flor de Hibisco</strong>, você concorda em cumprir e estar vinculado aos seguintes Termos de Uso. Estes termos regem a compra de nossas alquimias, oráculos e o uso de nossos serviços digitais. Se você não concorda com qualquer parte destes termos, não deve utilizar nosso site.
            </p>
          </section>

          <section className="space-y-6">
            <div className="flex items-center space-x-4 text-[#1A1518]">
              <ShieldCheck className="w-6 h-6 text-[#C082A0]" />
              <h2 className="font-cinzel font-bold text-xl uppercase tracking-widest">2. Uso Responsável e Ético</h2>
            </div>
            <p>
              Nossas alquimias e oráculos são ferramentas de autoconhecimento e bem-estar. O usuário compromete-se a utilizar os produtos de forma responsável, respeitando as instruções de uso e a egrégora da marca. É proibida a revenda não autorizada ou o uso de nossa propriedade intelectual para fins comerciais sem consentimento prévio.
            </p>
          </section>

          <section className="space-y-6">
            <div className="flex items-center space-x-4 text-[#1A1518]">
              <FileText className="w-6 h-6 text-[#C082A0]" />
              <h2 className="font-cinzel font-bold text-xl uppercase tracking-widest">3. Cadastro e Segurança</h2>
            </div>
            <p>
              Para realizar compras, é necessário criar uma conta. Você é responsável por manter a confidencialidade de sua senha e por todas as atividades que ocorram em sua conta. A <strong>Flor de Hibisco</strong> reserva-se o direito de suspender contas que violem nossas diretrizes éticas ou apresentem comportamento suspeito.
            </p>
          </section>

          <section className="space-y-6">
            <div className="flex items-center space-x-4 text-[#1A1518]">
              <HelpCircle className="w-6 h-6 text-[#C082A0]" />
              <h2 className="font-cinzel font-bold text-xl uppercase tracking-widest">4. Propriedade Intelectual</h2>
            </div>
            <p>
              Todo o conteúdo deste site, incluindo textos, logotipos, imagens e fórmulas de alquimias, é de propriedade exclusiva da <strong>Flor de Hibisco</strong>. A reprodução total ou parcial sem autorização é estritamente proibida e protegida pelas leis de direitos autorais.
            </p>
          </section>

          <section className="space-y-6 pt-10 border-t border-stone-100">
            <h2 className="font-cinzel font-bold text-xl text-[#1A1518] uppercase tracking-widest">Dúvidas Jurídicas?</h2>
            <p>
              Para esclarecimentos sobre nossos termos, entre em contato através do e-mail <span className="text-[#C082A0] font-medium">flordehibisco_@hotmail.com</span>.
            </p>
          </section>
        </div>

        {/* Rodapé Interno */}
        <div className="mt-24 pt-12 border-t border-stone-50 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-stone-300">
            Última atualização: Março de 2024 • Flor de Hibisco
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfUse;
