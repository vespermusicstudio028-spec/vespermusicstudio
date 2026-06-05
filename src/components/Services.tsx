import { Cake, Heart, Gift, Building2, Smartphone, Mic2, Church, GraduationCap, PartyPopper, Megaphone } from 'lucide-react';
import { motion } from 'motion/react';

const SERVICES = [
  { icon: Cake, title: 'Música de Aniversário', desc: 'Surpreenda com uma canção única contando a história do aniversariante.' },
  { icon: Heart, title: 'Música para Casamento', desc: 'A trilha sonora perfeita para o momento mais emocionante da sua vida.' },
  { icon: Gift, title: 'Música de Presente', desc: 'Um presente inesquecível e emocionante para quem você ama.' },
  { icon: Building2, title: 'Jingles Empresariais', desc: 'Destaque sua marca com um jingle chiclete e profissional.' },
  { icon: Smartphone, title: 'Jingles para Redes Sociais', desc: 'Áudios curtos e virais para Reels, TikTok e campanhas digitais.' },
  { icon: Mic2, title: 'Vinhetas Profissionais', desc: 'Aberturas marcantes para podcasts, rádios e canais no YouTube.' },
  { icon: Church, title: 'Música para Igrejas', desc: 'Produção de hinos, playbacks e arranjos exclusivos.' },
  { icon: GraduationCap, title: 'Formaturas', desc: 'Homenagens musicais para tornar a colação de grau memorável.' },
  { icon: PartyPopper, title: 'Eventos Especiais', desc: 'Trilhas sonoras sob medida para eventos corporativos e festas.' },
  { icon: Megaphone, title: 'Propagandas Comerciais', desc: 'Locuções e trilhas para comerciais de TV, rádio e internet.' },
];

export default function Services() {
  return (
    <section id="services" className="py-24 bg-vesper-dark">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">Nossos <span className="text-vesper-blue glow-text-blue">Serviços</span></h2>
          <p className="text-vesper-lightgray text-lg max-w-2xl">Atendemos diversas necessidades musicais com qualidade de estúdio e criatividade sem limites.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {SERVICES.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="bg-vesper-black p-6 rounded-xl border border-vesper-gray hover:border-vesper-blue/50 transition-colors group"
              >
                <div className="w-12 h-12 rounded-lg bg-vesper-darker flex items-center justify-center mb-6 group-hover:glow-box-blue transition-shadow border border-vesper-gray group-hover:border-vesper-blue/30">
                  <Icon className="text-vesper-blue" size={24} />
                </div>
                <h3 className="text-lg font-bold mb-2 text-white">{service.title}</h3>
                <p className="text-sm text-vesper-lightgray leading-relaxed">{service.desc}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  );
}
