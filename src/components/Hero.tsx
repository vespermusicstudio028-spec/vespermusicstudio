import { motion } from "motion/react";
import { Sparkles, Headphones, Radio } from "lucide-react";
import logoImg from "../assets/images/vesper_music_logo_1779237647432.png";
import heroBg from "../assets/images/studio_hero_banner_1779231913825.png";
interface HeroProps {
  onStartBriefing: () => void;
  onViewPortfolio: () => void;
}

export default function Hero({ onStartBriefing, onViewPortfolio }: HeroProps) {
  return (
    <div id="hero-section" className="relative min-h-[95vh] flex items-center justify-center overflow-hidden py-24 px-4 bg-[#050505]">
      {/* Imagem de Fundo Gerada pela IA */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBg}
          alt="Vesper Music Recording Studio"
          className="w-full h-full object-cover filter brightness-[0.2] saturate-[0.8] scale-105"
          referrerPolicy="no-referrer"
        />
        {/* Glow Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent" />
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-neon-blue/10 blur-[130px] pointer-events-none" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-neon-pink/10 blur-[130px] pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center select-none">
        
        {/* Left Column (Content) */}
        <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
          {/* Badge Flutuante */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-none bg-white/5 border border-white/10 backdrop-blur-md mb-8"
          >
            <Radio className="w-4 h-4 text-neon-blue animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-[0.3em] text-slate-300 font-bold">
              Vesper Music Studio • Est. 2023 • Live Sound
            </span>
          </motion.div>

          {/* Título Principal Bold Typography */}
          <div className="relative inline-block w-full">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-display text-6xl sm:text-8xl md:text-[100px] lg:text-[120px] leading-[0.8] font-black uppercase tracking-tighter text-neon-blue opacity-95 text-center lg:text-left"
            >
              Vesper<br />
              <span className="text-white">Music</span>
            </motion.h1>
            
            {/* Linhas decorativas do tema Bold Typography */}
            <div className="absolute -right-4 top-0 w-24 h-[2px] bg-neon-pink hidden xl:block" />
            <div className="absolute -right-4 bottom-12 w-12 h-[2px] bg-neon-pink hidden xl:block" />
          </div>

          {/* Subtítulo / Descrição Principal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-8 max-w-2xl text-center lg:text-left"
          >
            <p className="font-display text-lg sm:text-xl md:text-2xl font-light text-gray-400 leading-normal">
              O tom exato para <span className="text-white border-b-2 border-neon-pink pb-1">engajar seu comércio ou emocionar quem você ama</span>. Criamos jingles e propagandas comerciais marcantes, canções sob medida para casamentos, aniversários, músicas românticas e trilhas para eventos imperdíveis.
            </p>
          </motion.div>

          {/* CTA BOTOES */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center w-full mt-10"
          >
            <button
              id="btn-trigger-briefing"
              onClick={onStartBriefing}
              className="w-full sm:w-auto px-8 py-4 rounded-none bg-gradient-to-r from-neon-blue to-violet-600 font-display font-medium text-xs md:text-sm uppercase tracking-[0.2em] text-white shadow-[0_0_25px_rgba(0,242,255,0.35)] hover:shadow-[0_0_35px_rgba(0,242,255,0.5)] transition-all duration-300 transform hover:-translate-y-1 relative group overflow-hidden"
            >
              <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="flex items-center justify-center gap-2 font-bold">
                <Sparkles className="w-4 h-4 text-white" />
                Criar Meu Briefing Musical
              </span>
            </button>

            <button
              id="btn-trigger-portfolio"
              onClick={onViewPortfolio}
              className="w-full sm:w-auto px-8 py-4 rounded-none bg-studio-card border border-white/20 hover:border-neon-pink/50 text-gray-200 hover:text-white font-display text-xs md:text-sm uppercase tracking-[0.2em] transition-all duration-300 transform hover:-translate-y-1"
            >
              <span className="flex items-center justify-center gap-2 font-semibold">
                <Headphones className="w-4 h-4 text-neon-pink" />
                Ouvir Amostras Interativas
              </span>
            </button>
          </motion.div>
        </div>

        {/* Right Column (Logo Graphic with Neon Borders & Glow) */}
        <div className="lg:col-span-5 flex justify-center items-center w-full mt-8 lg:mt-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="relative p-2 bg-[#050505] border border-white/15 shadow-[0_0_50px_rgba(0,242,255,0.15)] max-w-[340px] md:max-w-[380px] group overflow-hidden"
          >
            {/* Ambient colored highlights in corners */}
            <div className="absolute top-0 left-0 w-16 h-16 bg-neon-blue/20 blur-xl group-hover:bg-neon-blue/35 transition-colors duration-500" />
            <div className="absolute bottom-0 right-0 w-16 h-16 bg-neon-pink/20 blur-xl group-hover:bg-neon-pink/35 transition-colors duration-500" />
            
            <img
              src={logoImg}
              alt="VESPER MUSIC NEON STUDIO LOGO"
              className="w-full h-auto object-contain relative z-10 filter hover:brightness-110 saturate-110 transition-all duration-500"
              referrerPolicy="no-referrer"
            />
            {/* Neon frame lines */}
            <div className="absolute -inset-[1px] border border-neon-blue/10 pointer-events-none group-hover:border-neon-blue/30 transition-colors duration-500" />
            <div className="absolute -top-[1px] left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-neon-pink to-transparent opacity-40 group-hover:opacity-100 transition-opacity" />
            <div className="absolute -bottom-[1px] left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-neon-blue to-transparent opacity-40 group-hover:opacity-100 transition-opacity" />
          </motion.div>
        </div>

        {/* Full-width Internal Row (Footer Attributes in Grid Brutalista) */}
        <div className="lg:col-span-12 w-full">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.9 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full mt-16 pt-8 border-t border-white/10 text-left font-display text-xs"
          >
            <div className="bg-[#111111]/80 backdrop-blur-sm p-4 border-l border-neon-blue flex flex-col justify-between">
              <span className="text-[10px] font-mono uppercase tracking-widest text-neon-blue font-bold">01 — ENGENHARIA</span>
              <span className="text-white text-sm font-bold mt-2">Estúdio Profissional</span>
            </div>
            <div className="bg-[#111111]/80 backdrop-blur-sm p-4 border-l border-white/20 flex flex-col justify-between">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#a78bfa] font-bold">02 — CRIAÇÃO</span>
              <span className="text-white text-sm font-bold mt-2">Letras &amp; Melodias</span>
            </div>
            <div className="bg-[#111111]/80 backdrop-blur-sm p-4 border-l border-white/20 flex flex-col justify-between">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#ff0055] font-bold">03 — TECNOLOGIA</span>
              <span className="text-white text-sm font-bold mt-2">Arranjo Sintetizado</span>
            </div>
            <div className="bg-neon-blue text-black p-4 flex flex-col justify-between font-bold">
              <span className="text-[10px] font-mono uppercase tracking-widest text-black/70 font-bold">04 — PROCESSO</span>
              <div className="text-xs font-black uppercase leading-none mt-2">Estúdio &amp; Produção Humana</div>
            </div>
          </motion.div>
        </div>
        
      </div>
    </div>
  );
}
