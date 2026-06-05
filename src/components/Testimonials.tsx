import { Star } from 'lucide-react';
import { motion } from 'motion/react';

const REVIEWS = [
  {
    name: 'Carlos e Juliana',
    text: '"Minha esposa chorou ao ouvir a música do nosso casamento. Foi o momento mais mágico da cerimônia!"',
    role: 'Casais'
  },
  {
    name: 'Loja Exemplo',
    text: '"Nosso jingle aumentou muito o reconhecimento da empresa. Hoje todos cantam nossa marca na rua."',
    role: 'Cliente Corporativo'
  },
  {
    name: 'Marcos Oliveira',
    text: '"Serviço rápido e resultado incrível. Dei de presente de aniversário para meu pai e ele se emocionou muito."',
    role: 'Cliente Pessoal'
  }
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-vesper-dark border-y border-vesper-gray/50 relative">
      <div className="absolute inset-0 z-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-vesper-blue via-vesper-black to-vesper-black" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <h2 className="text-3xl font-display font-bold text-center mb-16">O que dizem sobre nós</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {REVIEWS.map((review, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-vesper-black p-8 rounded-2xl border border-vesper-gray hover:border-vesper-blue/30 transition-colors"
            >
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} size={18} className="fill-vesper-blue text-vesper-blue" />
                ))}
              </div>
              <p className="text-vesper-lightgray mb-6 h-24 italic leading-relaxed">{review.text}</p>
              <div>
                <p className="font-bold text-white">{review.name}</p>
                <p className="text-xs text-vesper-blue uppercase tracking-wider mt-1">{review.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
