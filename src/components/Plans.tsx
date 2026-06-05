import { Check } from 'lucide-react';
import { motion } from 'motion/react';

const PLANS = [
  {
    name: 'BÁSICO',
    description: 'Ideal para mensagens curtas',
    features: [
      'Música até 1 minuto',
      'Entrega rápida',
      'Instrumental padrão',
      'Qualidade MP3'
    ],
    highlight: false,
    color: 'border-vesper-gray'
  },
  {
    name: 'PREMIUM',
    description: 'A experiência e qualidade máxima',
    features: [
      'Produção completa',
      'Letra exclusiva',
      'Instrumental exclusivo',
      'Qualidade de estúdio WAV',
      'Revisões ilimitadas'
    ],
    highlight: true,
    color: 'border-vesper-blue glow-box-blue'
  },
  {
    name: 'PROFISSIONAL',
    description: 'Para jingles e homenagens',
    features: [
      'Música até 3 minutos',
      'Voz personalizada',
      'Mixagem profissional',
      'Arquivo em alta qualidade'
    ],
    highlight: false,
    color: 'border-vesper-gray'
  }
];

export default function Plans() {
  return (
    <section id="plans" className="py-24 bg-vesper-black">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">Escolha seu <span className="text-vesper-blue glow-text-blue">Plano</span></h2>
          <p className="text-vesper-lightgray text-lg">Soluções ideais para todos os tipos de projetos.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {PLANS.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className={`relative bg-vesper-darker rounded-2xl p-8 border ${plan.color} ${plan.highlight ? 'scale-100 md:scale-105 z-10' : 'scale-100'}`}
            >
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-vesper-blue text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-widest glow-box-blue">
                  Mais Popular
                </div>
              )}
              
              <h3 className="text-2xl font-display font-bold text-white mb-2">{plan.name}</h3>
              <p className="text-vesper-lightgray text-sm mb-8">{plan.description}</p>
              
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className={`mt-1 rounded-full p-0.5 ${plan.highlight ? 'bg-vesper-blue/20 text-vesper-blue' : 'bg-vesper-gray text-white'}`}>
                      <Check size={14} />
                    </div>
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <a 
                href="#contact"
                className={`block w-full py-4 rounded-full text-center font-bold tracking-wide transition-all ${
                  plan.highlight 
                    ? 'bg-vesper-blue text-white hover:bg-blue-500 glow-box-blue' 
                    : 'bg-white text-black hover:bg-gray-200'
                }`}
              >
                Solicitar Agora
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
