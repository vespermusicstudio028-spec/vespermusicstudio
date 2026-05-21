import { Gift, Briefcase, Play, Sliders, Music4, Sparkles, Volume2, Heart, Calendar } from "lucide-react";
import { motion } from "motion/react";

interface ServicesProps {
  onSelectObjective?: (objective: string) => void;
}

export default function Services({ onSelectObjective }: ServicesProps) {
  const list = [
    {
      icon: <Volume2 className="w-8 h-8 text-neon-blue" />,
      title: "Jingles & Propaganda",
      desc: "Composições exclusivas, slogans cantados e spots de áudio para destacar o seu comércio, rádio, redes sociais ou campanhas de vendas.",
      badge: "Para Comércios & PJ"
    },
    {
      icon: <Gift className="w-8 h-8 text-rose-500" />,
      title: "Casamentos & Noivados",
      desc: "Trilhas sonoras inesquecíveis criadas sob medida para a entrada triunfal dos noivos, retrospectivas, votos de noivado e cerimônias.",
      badge: "Para o Grande Dia"
    },
    {
      icon: <Heart className="w-8 h-8 text-neon-pink" />,
      title: "Músicas Românticas",
      desc: "Arranjos sentimentais profundos, criados com letras emocionantes sob medida para bodas, declarações ou aniversários de namoro.",
      badge: "Homenagem Romântica"
    },
    {
      icon: <Sparkles className="w-8 h-8 text-amber-500" />,
      title: "Música de Aniversário",
      desc: "Presenteie com uma canção emocionante narrando a história de vida, as melhores memórias e as conquistas do aniversariante.",
      badge: "Presentes Acústicos"
    },
    {
      icon: <Calendar className="w-8 h-8 text-[#a78bfa]" />,
      title: "Eventos & Festividades",
      desc: "Sonorização proprietária elegante, canções sob medida e trilhas temáticas para convenções corporativas, festas comerciais ou shows.",
      badge: "Eventos Exclusivos"
    }
  ];

  return (
    <section id="services-section" className="py-24 px-4 bg-studio-dark relative z-10 select-none">
      <div className="max-w-7xl mx-auto">
        
        {/* Descrição em Destaque */}
        <div className="text-center mb-16">
          <span className="text-xs font-mono text-neon-blue uppercase tracking-[0.3em] block mb-3 font-bold">
            01 — O que fazemos no Estúdio
          </span>
          <h2 className="font-display text-5xl md:text-6xl font-black text-white uppercase tracking-tighter">
            NOSSOS <span className="text-neon-pink">SERVIÇOS</span>
          </h2>
          <div className="w-16 h-[2px] bg-neon-blue mx-auto mt-4 mb-4" />
          <p className="max-w-2xl mx-auto text-gray-400 text-sm md:text-base font-light leading-relaxed">
            Composição completa de letras, arranjos e mixagem em estúdio profissional. Criamos canções autênticas para emocionar pessoas e impulsionar negócios!
          </p>
        </div>

        {/* Grade de cartões de serviços Brutalistas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {list.map((item, idx) => {
            const numStr = `0${idx + 1}`;
            return (
              <div
                key={idx}
                className="group p-6 rounded-none bg-[#111111] border-l-2 border-white/20 hover:border-l-2 hover:border-neon-blue transition-all duration-300 flex flex-col justify-between items-start h-full"
              >
                <div>
                  {/* Número do Serviço e Badge */}
                  <div className="flex justify-between items-center w-full mb-6">
                    <span className="text-[10px] font-mono font-bold text-neon-pink tracking-wider">{numStr} — {item.badge}</span>
                    <div className="text-white/20 group-hover:text-neon-blue transition-colors duration-300">
                      {item.icon}
                    </div>
                  </div>

                  {/* Título */}
                  <h3 className="font-display font-black text-xl uppercase tracking-tight text-white mb-3 group-hover:text-neon-blue transition-colors leading-snug">
                    {item.title}
                  </h3>

                  {/* Descrição */}
                  <p className="text-gray-400 text-xs leading-relaxed mb-6 font-light">
                    {item.desc}
                  </p>
                </div>

                {/* Detalhe de Toque */}
                <button
                  onClick={() => onSelectObjective?.(
                    item.title === "Casamentos & Noivados" ? "Música de Casamento" :
                    item.title === "Jingles & Propaganda" ? "Jingle ou Propaganda Comercial" :
                    item.title === "Músicas Românticas" ? "Música Romântica ou Homenagem" :
                    item.title === "Música de Aniversário" ? "Música de Aniversário" :
                    item.title === "Eventos & Festividades" ? "Trilha para Eventos" :
                    "Outros Momentos"
                  )}
                  className="text-[10px] font-mono uppercase tracking-widest text-[#00f2ff] flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity duration-300 mt-2 font-bold cursor-pointer text-left border-none bg-transparent p-0"
                >
                  <span>Criar briefing deste</span>
                  <Play className="w-2.5 h-2.5 fill-neon-blue text-neon-blue stroke-none" />
                </button>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
