import { useState, useRef, useEffect } from "react";
import {
  Play,
  Square,
  Headphones,
  Award,
  Volume2,
  SlidersHorizontal,
  Settings2,
  HelpCircle,
  Star,
  Quote,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Zap,
  Plus
} from "lucide-react";
import { Track } from "../types";
import { saveAudio, getAllAudios } from "../utils/audioStorage";

const PREBUILT_TRACKS: Track[] = [
  {
    id: "track-jingle-1",
    title: "SUPER OFERTA (VIBE VAREJO ENÉRGICO)",
    category: "Jingles & Propaganda",
    description: "Um jingle comercial vibrante e de alta conversão. Com um ritmo pulsante e arranjo moderno, é a escolha perfeita para campanhas de varejo, anúncios de rádio, carros de som e ofertas dinâmicas no WhatsApp. Feito sob medida para fixar a sua marca na mente do cliente.",
    bpm: 120,
    notes: ["D major", "A major"],
    audioType: "energetic",
    tags: ["Supermercados", "Jingle Chiclete", "Vendas", "Propaganda"]
  },
  {
    id: "track-jingle-2",
    title: "Sabor & Ritmo (Burguer & Cia)",
    category: "Jingles & Propaganda",
    description: "Estrutura moderna, com timbres de arpejador envolvente e batida firme. Desenhado para anúncios dinâmicos de gastronomia, stories e Reels do Instagram.",
    bpm: 108,
    notes: ["A minor", "F major", "C major", "G major"],
    audioType: "synthwave",
    tags: ["Gastronomia", "Propaganda", "Moderna"]
  },
  {
    id: "track-romance-1",
    title: "Teu Perfume nas Estrelas",
    category: "Músicas Românticas",
    description: "Arranjo sentimental profundo com acordes de piano romântico e ambiência estelar. Ideal para homenagens apaixonadas, bodas e dia dos namorados.",
    bpm: 78,
    notes: ["Cmaj7", "Am7", "Fmaj7", "G6"],
    audioType: "romantic",
    tags: ["Romântica", "Acústico", "Declaração"]
  },
  {
    id: "track-wedding-1",
    title: "Laços Eternos",
    category: "Casamentos & Noivados",
    description: "Arranjo com acordes majestosos de cordas e introdução clássica nupcial em piano. Cria a entrada ideal e emocionante para noivos ou noivas.",
    bpm: 75,
    notes: ["D major", "G major", "A major", "Bm7"],
    audioType: "orchestral",
    tags: ["Casamento", "Entrada dos Noivos", "Sinfônico"]
  },
  {
    id: "track-bday-1",
    title: "O Tempo Voa (Nossa História)",
    category: "Música de Aniversário",
    description: "Canção de presente acústica cheia de ternura, desenhada para narrar passagens marcantes da história de vida de quem você mais ama.",
    bpm: 82,
    notes: ["C major", "Em7", "Fmaj7", "G7"],
    audioType: "romantic",
    tags: ["Aniversário", "Presente de Vida", "Homenagem"]
  },
  {
    id: "track-event-1",
    title: "Abertura Triunfal (Grand Opening)",
    category: "Eventos & Festividades",
    description: "Abertura de impacto com batidas enérgicas e transições marcantes para feiras de negócios locais, convenções de comércios e desfiles.",
    bpm: 125,
    notes: ["Am7", "Em7", "Fmaj7", "G major"],
    audioType: "energetic",
    tags: ["Inauguração", "Eventos", "Marcante"]
  }
];

const SUCCESS_CASES = [
  {
    client: "Vivian & Alexandre",
    type: "Entrada dos Noivos (Gramado, RS)",
    feedback: "A trilha personalizada levou todos os convidados às lágrimas. Capturou nossa história perfeitamente, unindo arranjos clássicos à nossa essência. Inesquecível!",
    rate: 5,
    trackStyle: "Laços Eternos (Estilo Romântico)"
  },
  {
    client: "Apex Fintech Group",
    type: "Sound Logo e Jingle Comercial (São Paulo, SP)",
    feedback: "Nossa marca agora tem voz. Os clientes reconhecem o jingle em menos de 3 segundos na rádio e nos vídeos do YouTube. Retorno absoluto de branding.",
    rate: 5,
    trackStyle: "Apex Beats (Estilo Energético)"
  },
  {
    client: "Overload Games",
    type: "Canção de Abertura do Jogo 'Neon Drift'",
    feedback: "Timbres retrô fantásticos! O synthwave desenhado pelo estúdio encaixou absurdamente na jogabilidade. Trabalho rápido e impecável.",
    rate: 5,
    trackStyle: "Cyberpunk Vesper (Estilo Eletrônico)"
  }
];

const FAQS = [
  {
    q: "Como funciona a criação de uma trilha sonora ou canção sob medida?",
    a: "O processo inicia no nosso construtor de briefing online (ou diretamente no WhatsApp). Você nos conta o objetivo, estilo e a história. Nós criamos um rascunho de letra e estrutura pelo Gemini. Depois, gravamos os arranjos no estúdio físico com mixagem profissional e enviamos para sua aprovação."
  },
  {
    q: "Quanto tempo demora para receber a música finalizada?",
    a: "Após a aprovação do briefing e fechamento do orçamento, entregamos amostras parciais de arranjo em até 4 dias úteis. A versão de estúdio finalizada com masterização profissional leva em média de 7 a 10 dias úteis."
  },
  {
    q: "Os direitos comerciais da música serão meus?",
    a: "Sim, absolutamente. Todas as músicas assinadas pelo Vesper Music acompanham um termo de cessão total de direitos de uso comercial. Você poderá monetizar no YouTube, postar em redes sociais, usar em TV e rádio sem pagar royalties."
  },
  {
    q: "Eu posso sugerir ajustes depois que a música estiver pronta?",
    a: "Com certeza. Nossos pacotes de produção incluem de 2 a 3 rodadas de refinamento gratuitas, assegurando que o brilho final do áudio, timbres e vocais fiquem exatamente do jeito que você idealizou."
  }
];

interface AudioPortfolioProps {
  isPlaying: string | null;
  onPlay: (trackId: string, audioType: 'romantic' | 'energetic' | 'orchestral' | 'synthwave') => void;
  onStop: () => void;
  volume: number;
  setVolume: (v: number) => void;
  filterCutoff: number;
  setFilterCutoff: (f: number) => void;
  tempoSpeed: number;
  setTempoSpeed: (s: number) => void;
  waveformOverride: string;
  setWaveformOverride: (w: string) => void;
}

interface CustomAudio {
  url: string;
  name: string;
  audio: HTMLAudioElement;
}

export default function AudioPortfolio({
  isPlaying,
  onPlay,
  onStop,
  volume,
  setVolume,
  filterCutoff,
  setFilterCutoff,
  tempoSpeed,
  setTempoSpeed,
  waveformOverride,
  setWaveformOverride
}: AudioPortfolioProps) {
  const [activeTab, setActiveTab] = useState<string>("All");
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pendingTrackIdRef = useRef<string>("");
  const [customAudios, setCustomAudios] = useState<Record<string, CustomAudio>>({});
  const [customPlaying, setCustomPlaying] = useState<string | null>(null);

  // Carregar áudios salvos no IndexedDB ao iniciar a página
  useEffect(() => {
    getAllAudios().then((saved) => {
      const restored: Record<string, CustomAudio> = {};
      saved.forEach((item) => {
        const url = URL.createObjectURL(item.blob);
        const audio = new Audio(url);
        audio.volume = volume / 100;
        audio.loop = true;
        audio.onended = () => {
          setCustomPlaying(null);
        };
        restored[item.trackId] = {
          url,
          name: item.name,
          audio
        };
      });
      setCustomAudios(restored);
    }).catch(err => {
      console.error("Erro ao carregar áudios do IndexedDB:", err);
    });
  }, []);

  // Sincronizar volume com áudios customizados
  useEffect(() => {
    Object.values(customAudios).forEach(ca => {
      ca.audio.volume = volume / 100;
    });
  }, [volume, customAudios]);

  // Se o sintetizador começar a tocar, paramos o áudio customizado
  useEffect(() => {
    if (isPlaying) {
      Object.values(customAudios).forEach(ca => {
        ca.audio.pause();
        ca.audio.currentTime = 0;
      });
      setCustomPlaying(null);
    }
  }, [isPlaying]);

  const handleImportClick = (trackId: string) => {
    pendingTrackIdRef.current = trackId;
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const trackId = pendingTrackIdRef.current;
    if (e.target.files && e.target.files.length > 0 && trackId) {
      const file = e.target.files[0];
      // Limpar áudio anterior desse track se existir
      if (customAudios[trackId]) {
        customAudios[trackId].audio.pause();
        URL.revokeObjectURL(customAudios[trackId].url);
      }
      const url = URL.createObjectURL(file);
      const audio = new Audio(url);
      audio.volume = volume / 100;
      audio.loop = true;
      audio.onended = () => {
        setCustomPlaying(null);
      };
      
      // Salvar no IndexedDB para persistir
      saveAudio(trackId, file.name, file).catch(err => {
        console.error("Erro ao salvar áudio no IndexedDB:", err);
      });

      setCustomAudios(prev => ({
        ...prev,
        [trackId]: { url, name: file.name, audio }
      }));
      e.target.value = "";
    }
  };

  const playCustomAudio = (trackId: string) => {
    // Parar sintetizador se estiver tocando
    onStop();
    
    // Parar qualquer outro áudio customizado
    Object.entries(customAudios).forEach(([id, ca]) => {
      if (id !== trackId) {
        ca.audio.pause();
        ca.audio.currentTime = 0;
      }
    });
    
    const ca = customAudios[trackId];
    if (ca) {
      ca.audio.volume = volume / 100;
      ca.audio.play().then(() => {
        setCustomPlaying(trackId);
      }).catch(err => {
        console.error("Erro ao tocar áudio customizado:", err);
      });
    }
  };

  const stopCustomAudio = (trackId: string) => {
    const ca = customAudios[trackId];
    if (ca) {
      ca.audio.pause();
      ca.audio.currentTime = 0;
    }
    setCustomPlaying(null);
  };

  const categories = ["All", "Jingles & Propaganda", "Casamentos & Noivados", "Músicas Românticas", "Música de Aniversário", "Eventos & Festividades"];

  const filteredTracks = activeTab === "All"
    ? PREBUILT_TRACKS
    : PREBUILT_TRACKS.filter(t => t.category === activeTab);

  const toggleFaq = (idx: number) => {
    setFaqOpen(faqOpen === idx ? null : idx);
  };

  return (
    <section id="portfolio-section" className="py-24 bg-studio-dark/50 border-t border-white/5 relative z-10 px-4">
      {/* Hidden File Input for Custom Uploads */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="audio/*"
        className="hidden"
      />
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-none bg-neon-pink/10 border border-neon-pink/20 text-neon-pink text-xs font-mono uppercase mb-4 tracking-[0.2em] font-bold">
            <Headphones className="w-4 h-4 text-neon-pink animate-pulse" />
            02 — Mostra Sonora Interativa
          </div>
          <h2 className="font-display text-5xl md:text-6xl font-black uppercase text-white tracking-tighter">
            PORTFÓLIO &amp; <span className="text-neon-blue">ESTILOS</span>
          </h2>
          <div className="w-16 h-[2px] bg-neon-pink mx-auto mt-4 mb-4" />
          <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base font-light leading-relaxed">
            Clique no play e sinta a textura dos timbres que modelamos no estúdio Vesper Music. Cada acorde é gerado em tempo real pelo seu navegador.
          </p>
        </div>

        {/* Tab Filtros - Square Brutalist Look */}
        <div className="flex flex-wrap gap-2 justify-center mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-5 py-2.5 rounded-none font-display text-xs uppercase tracking-[0.15em] transition-all duration-300 font-bold cursor-pointer ${
                activeTab === cat
                  ? "bg-neon-blue text-studio-dark font-black shadow-[0_0_15px_rgba(0,242,255,0.4)] border border-neon-blue"
                  : "bg-[#111111] text-gray-400 hover:text-white border border-white/5 hover:border-white/20"
              }`}
            >
              {cat === "All" ? "Todos os Estilos" : cat}
            </button>
          ))}
        </div>

        {/* Lista de Tracks - Custom Left Border Matching Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {filteredTracks.map((track) => {
            const hasCustom = !!customAudios[track.id];
            const isCustomPlaying = customPlaying === track.id;
            const isSynthPlaying = isPlaying === track.id;
            const isSelfPlaying = isCustomPlaying || isSynthPlaying;

            // Define active accent color class for left-border
            const accentBorderColor =
              track.audioType === "romantic" ? "border-l-rose-500" :
              track.audioType === "energetic" ? "border-l-amber-500" :
              track.audioType === "orchestral" ? "border-l-indigo-500" :
              "border-l-neon-blue";

            return (
              <div
                key={track.id}
                className={`p-8 rounded-none bg-[#111111] border-l-4 ${accentBorderColor} transition-all duration-300 relative overflow-hidden group border-t border-r border-b border-t-white/5 border-r-white/5 border-b-white/5 ${
                  isSelfPlaying
                    ? "shadow-[0_0_20px_rgba(0,242,255,0.15)] bg-[#151515]"
                    : "hover:bg-[#151515]"
                }`}
              >
                {/* Grid principal do card */}
                <div className="flex flex-col h-full justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-[10px] font-mono tracking-widest text-neon-pink uppercase font-bold">
                        {track.category}
                      </span>
                      <div className="flex items-center gap-1.5 text-xs font-mono text-slate-500">
                        <span>{track.bpm} BPM</span>
                      </div>
                    </div>

                    <h3 className="text-2xl font-display font-black uppercase tracking-tight text-white mb-1">
                      {track.title}
                    </h3>
                    {/* Mostrar nome do arquivo importado */}
                    {hasCustom && (
                      <div className="flex items-center gap-1.5 mb-3">
                        <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-bold">
                          ♫ {customAudios[track.id].name}
                        </span>
                      </div>
                    )}
                    <p className="text-gray-400 text-sm leading-relaxed mb-6 font-light">
                      {track.description}
                    </p>
                  </div>

                  <div>
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {track.tags.map(t => (
                        <span key={t} className="px-2 py-0.5 rounded-none text-[9px] font-mono uppercase tracking-wider bg-white/5 text-slate-300 border border-white/5 font-bold">
                          #{t}
                        </span>
                      ))}
                    </div>

                    {/* Controles de Som & Ondas com visual Brutalista */}
                    <div className="flex items-center justify-between p-4 rounded-none bg-[#0a0a0a] border border-white/5">
                      <div className="flex items-center gap-4">
                        {isSelfPlaying ? (
                          <button
                            onClick={() => {
                              if (isCustomPlaying) stopCustomAudio(track.id);
                              else onStop();
                            }}
                            className="w-12 h-12 rounded-none bg-neon-pink flex items-center justify-center text-white hover:bg-red-600 transition-colors shadow-[0_0_12px_rgba(255,0,85,0.4)] cursor-pointer"
                          >
                            <Square className="w-5 h-5 fill-white" />
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              if (hasCustom) playCustomAudio(track.id);
                              else onPlay(track.id, track.audioType);
                            }}
                            className="w-12 h-12 rounded-none bg-neon-blue flex items-center justify-center text-studio-dark hover:bg-cyan-300 transition-colors shadow-[0_0_12px_rgba(0,242,255,0.4)] cursor-pointer"
                          >
                            <Play className="w-5 h-5 fill-studio-dark" />
                          </button>
                        )}
                        <div className="flex flex-col text-left">
                          <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                            {isSelfPlaying ? (hasCustom ? "TOCANDO ARQUIVO..." : "SINTETIZANDO...") : "AMOSTRA OFFLINE"}
                          </span>
                          <span className="text-[10px] font-mono text-slate-500">
                            {hasCustom ? customAudios[track.id].name : `ESCALA: ${track.notes.slice(0, 3).join(" • ")}`}
                          </span>
                        </div>
                      </div>

                      {/* Equalizador Animado */}
                      <div className="flex items-end gap-[3px] h-6 px-3">
                        {[1, 2, 3, 4, 5, 6].map((bar) => (
                          <div
                            key={bar}
                            style={{
                              animationDelay: `${bar * 0.15}s`,
                              height: isSelfPlaying ? "100%" : "20%"
                            }}
                            className={`w-1 rounded-none ${
                              isSelfPlaying ? "animate-equalizer" : ""
                            } ${
                              track.audioType === "romantic" ? "bg-rose-500" :
                              track.audioType === "energetic" ? "bg-amber-400" :
                              track.audioType === "orchestral" ? "bg-indigo-500" :
                              "bg-neon-blue"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Botão para Adicionar/Substituir Música */}
                    <button
                      onClick={() => handleImportClick(track.id)}
                      className={`w-full mt-3 py-3 rounded-none font-display text-[10px] uppercase tracking-[0.2em] transition-all duration-300 font-bold flex items-center justify-center gap-2 cursor-pointer ${
                        hasCustom
                          ? "bg-transparent hover:bg-emerald-500 text-emerald-400 hover:text-studio-dark border border-emerald-500/30 hover:border-emerald-500"
                          : "bg-transparent hover:bg-neon-blue text-neon-blue hover:text-studio-dark border border-neon-blue/30 hover:border-neon-blue"
                      }`}
                    >
                      <Plus className="w-3.5 h-3.5" /> {hasCustom ? "Substituir música" : "Adicionar música"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>



        {/* FEEDBACK / TESTIMONIALS SECTOR (CO-CRIAÇÕES DE SUCESSO) */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <span className="text-xs font-mono text-neon-blue uppercase tracking-[0.2em] font-bold block mb-2">
              CASES DE SUCESSO
            </span>
            <h3 className="font-display font-black text-3xl uppercase tracking-tight text-white">
              CO-CRIAÇÕES EM DESTAQUE
            </h3>
            <div className="w-12 h-[2px] bg-neon-blue mx-auto mt-3" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SUCCESS_CASES.map((sc, idx) => (
              <div key={idx} className="bg-[#111111] p-6 border border-white/5 flex flex-col justify-between rounded-none hover:border-white/10 transition-colors">
                <div>
                  <div className="flex gap-1 mb-4 select-none">
                    {[...Array(sc.rate)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-8 h-8 text-white/5 mb-2 shrink-0" />
                  <p className="text-slate-300 text-xs md:text-sm leading-relaxed font-light italic">
                    &ldquo;{sc.feedback}&rdquo;
                  </p>
                </div>
                
                <div className="mt-6 pt-4 border-t border-white/5">
                  <span className="text-[10px] font-mono text-neon-pink uppercase font-bold block mb-1">
                    {sc.trackStyle}
                  </span>
                  <p className="text-white text-xs font-black">{sc.client}</p>
                  <p className="text-[10px] text-slate-500 font-mono">{sc.type}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* INTERACTIVE FAQ SECTOR */}
        <div className="mt-24 border-t border-white/5 pt-16 max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-mono text-[#a78bfa] uppercase tracking-[0.2em] font-bold block mb-2">
              <HelpCircle className="w-4 h-4 text-[#a78bfa] inline-block mr-1.5 mb-0.5" />
              DÚVIDAS FREQUENTES
            </span>
            <h3 className="font-display font-black text-3xl uppercase tracking-tight text-white">
              PERGUNTAS RECORRENTES
            </h3>
            <div className="w-12 h-[2px] bg-[#a78bfa] mx-auto mt-3" />
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => {
              const isOpen = faqOpen === idx;
              return (
                <div
                  key={idx}
                  className="bg-[#111111] border border-white/5 transition-all duration-300 rounded-none overflow-hidden"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-5 text-left flex justify-between items-center text-white font-display font-bold text-sm md:text-base uppercase tracking-tight hover:text-neon-blue transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-neon-blue shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                    )}
                  </button>
                  
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs md:text-sm text-slate-400 border-t border-white/5 font-light leading-relaxed animate-fadeIn bg-[#0d0d0d]">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Informações Extras sobre o Estúdio Vesper em Grid de Estilo Brutal */}
        <div className="mt-24 bg-[#111111] rounded-none p-8 md:p-10 border border-white/10 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex gap-4 border-l border-neon-blue pl-4">
            <div>
              <h4 className="font-display font-black uppercase text-lg tracking-wider text-white mb-2">Qualidade Premium</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-light">
                Produções entregues em áudio Wave de alta fidelidade (24-bit, 48kHz), prontas para plataformas de streaming ou mídias audiovisuais de alta escala.
              </p>
            </div>
          </div>

          <div className="flex gap-4 border-l border-white/20 pl-4">
            <div>
              <h4 className="font-display font-black uppercase text-lg tracking-wider text-white mb-2">Entrega Rápida</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-light">
                Nosso ecossistema de co-criação acelera os arranjos e letras. Seu projeto musical completo entregue em tempo recorde, aprovado por você.
              </p>
            </div>
          </div>

          <div className="flex gap-4 border-l border-white/20 pl-4">
            <div>
              <h4 className="font-display font-black uppercase text-lg tracking-wider text-white mb-2">Direitos de Uso</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-light">
                Trilhas e composições 100% de propriedade sobre direitos comerciais livres para veiculação no YouTube, comerciais de TV ou eventos.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-slate-500 font-mono">
            Vesper Music Studio • Direção Artística Premium
          </p>
        </div>
      </div>
    </section>
  );
}
