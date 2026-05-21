import { useSynthesizer } from "./hooks/useSynthesizer";
import Hero from "./components/Hero";
import Services from "./components/Services";
import AudioPortfolio from "./components/AudioPortfolio";
import BriefingCreator from "./components/BriefingCreator";
import ChatWidget from "./components/ChatWidget";
import { Headphones, Send, Smartphone, Sparkles, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import logoImg from "./assets/images/vesper_music_logo_1779237647432.png";
export default function App() {
  const {
    isPlaying,
    playTrack,
    stop,
    volume,
    setVolume,
    filterCutoff,
    setFilterCutoff,
    tempoSpeed,
    setTempoSpeed,
    waveformOverride,
    setWaveformOverride
  } = useSynthesizer();
  const [scrolled, setScrolled] = useState(false);
  const [selectedObjective, setSelectedObjective] = useState<string>("");

  // Monitor header scrolling for dynamic opacity changes
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleStartBriefing = () => {
    const element = document.getElementById("custom-briefing-creator");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleViewPortfolio = () => {
    const element = document.getElementById("portfolio-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleScrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-studio-dark font-sans text-gray-100 flex flex-col justify-between selection:bg-neon-blue/30 selection:text-white">
      
      {/* HEADER DE NAVEGAÇÃO GLOW */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
          scrolled
            ? "bg-studio-dark/85 backdrop-blur-md border-white/5 py-3 shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
            : "bg-transparent border-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex justify-between items-center">
          
          {/* Logo Brand */}
          <div
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-20 h-10 rounded-none bg-gradient-to-tr from-neon-blue to-neon-pink flex items-center justify-center p-[2px] shadow-[0_0_15px_rgba(0,242,255,0.1)] transition-all overflow-hidden">
              <div className="w-full h-full bg-[#050505] flex items-center justify-center">
                <img
                  src={logoImg}
                  alt="Vesper Music Logo"
                  className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300 p-0.5"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
            <div className="flex flex-col text-left">
              <span className="font-display font-black text-sm tracking-[0.15em] text-white uppercase group-hover:text-neon-blue transition-colors duration-300">
                VESPER MUSIC
              </span>
              <span className="text-[9px] font-mono select-none text-slate-500 tracking-[0.25em] font-bold uppercase">
                <span className="text-neon-blue">EST.</span> 2023
              </span>
            </div>
          </div>

          {/* Core Navigation Links - Wide Tracked Brutalist Layout */}
          <nav className="hidden md:flex items-center gap-10 text-[10px] tracking-[0.3em] font-bold uppercase">
            <button
              onClick={() => handleScrollToSection("services-section")}
              className="text-gray-400 hover:text-neon-blue transition-colors font-display text-left cursor-pointer"
            >
              Serviços
            </button>
            <button
              onClick={() => handleScrollToSection("portfolio-section")}
              className="text-gray-400 hover:text-neon-blue transition-colors font-display text-left cursor-pointer"
            >
              Portfólio
            </button>
            <button
              onClick={() => handleStartBriefing()}
              className="text-gray-400 hover:text-neon-pink transition-colors font-display flex items-center gap-1.5 cursor-pointer"
            >
              Criar Trilha <Sparkles className="w-3 h-3 text-neon-pink animate-pulse" />
            </button>
          </nav>

          {/* Quick Contact Header CTA button - Sharp look */}
          <div className="flex items-center gap-3">
            <a
              href="https://wa.me/5512996539857"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 rounded-none bg-[#111111] hover:bg-neon-blue hover:text-black border border-white/20 text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-all active:scale-95 text-white"
            >
              <Smartphone className="w-3.5 h-3.5 text-neon-blue" />
              WhatsApp Estúdio
            </a>
          </div>

        </div>
      </header>

      {/* COMPONENTE HERO */}
      <Hero
        onStartBriefing={handleStartBriefing}
        onViewPortfolio={handleViewPortfolio}
      />

      {/* COMPONENTE SEÇÃO DE SERVIÇOS */}
      <Services onSelectObjective={(obj) => {
        setSelectedObjective(obj);
        handleStartBriefing();
      }} />
      {/* COMPONENTE PORTFÓLIO E SINTETIZADOR */}
      <AudioPortfolio
        isPlaying={isPlaying}
        onPlay={playTrack}
        onStop={stop}
        volume={volume}
        setVolume={setVolume}
        filterCutoff={filterCutoff}
        setFilterCutoff={setFilterCutoff}
        tempoSpeed={tempoSpeed}
        setTempoSpeed={setTempoSpeed}
        waveformOverride={waveformOverride}
        setWaveformOverride={setWaveformOverride}
      />

      {/* COMPONENTE CONSTRUTOR DE BRIEFING COM IA */}
      <BriefingCreator
        selectedObjective={selectedObjective}
        onClearObjective={() => setSelectedObjective("")}
      />

      {/* COMPONENTE FOOTER SEGUINDO TEMPLATE */}
      <footer className="border-t border-white/5 bg-[#050505] py-12 px-4 relative z-10 select-none">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
            <div className="w-24 h-12 rounded-none bg-gradient-to-tr from-neon-blue to-neon-pink p-[2px] shadow-[0_0_15px_rgba(0,242,255,0.1)] overflow-hidden shrink-0">
              <div className="w-full h-full bg-[#050505] flex items-center justify-center">
                <img
                  src={logoImg}
                  alt="Vesper Music Logo Icon"
                  className="w-full h-full object-contain p-0.5"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
            <div>
              <h4 className="font-display font-black text-lg text-white">VESPER MUSIC</h4>
              <p className="text-xs text-slate-500 mt-1 font-light max-w-sm">
                Modelagem artística premium unindo a riqueza das notas acústicas analógicas ao design sonoro de alta definição. Direção musical coordenada de forma profissional.
              </p>
              <p className="text-xs text-neon-blue mt-2 font-mono tracking-wider font-bold">
                E-MAIL: <a href="mailto:vespermusicstudio028@gmail.com" className="hover:text-neon-pink transition-colors underline underline-offset-4 decoration-neon-pink/40">vespermusicstudio028@gmail.com</a>
              </p>
            </div>
          </div>
          
          <div className="text-center md:text-right">
            <div className="flex justify-center md:justify-end gap-6 text-xs font-mono text-slate-400 mb-2">
              <span className="hover:text-neon-blue cursor-pointer" onClick={() => handleScrollToSection("services-section")}>SERVIÇOS</span>
              <span className="hover:text-neon-blue cursor-pointer" onClick={() => handleScrollToSection("portfolio-section")}>PORTFÓLIO</span>
              <span className="hover:text-neon-pink cursor-pointer" onClick={() => handleStartBriefing()}>BRIEFING</span>
            </div>
            <p className="text-xs text-slate-500 font-mono">
              &copy; {new Date().getFullYear()} Vesper Music Studio - Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>

      {/* CHATBOT DETERMINÍSTICO DE ATENDIMENTO RÁPIDO */}
      <ChatWidget />

    </div>
  );
}
