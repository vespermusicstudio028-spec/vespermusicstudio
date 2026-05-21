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
  Plus,
  Trash2
} from "lucide-react";
import { Track } from "../types";
import defaultTracks from "../data/tracks.json";
import {
  saveAudio,
  getAllAudios,
  saveTrack,
  getAllTracks,
  deleteTrack,
  deleteAudio
} from "../utils/audioStorage";

const isLocalServer = () => {
  const hn = window.location.hostname;
  return hn === "localhost" || 
         hn === "127.0.0.1" || 
         hn.startsWith("192.168.") || 
         hn.startsWith("10.") || 
         hn.startsWith("172.16.") || 
         hn.startsWith("172.17.") || 
         hn.startsWith("172.18.") || 
         hn.startsWith("172.19.") || 
         hn.startsWith("172.20.") || 
         hn.startsWith("172.21.") || 
         hn.startsWith("172.22.") || 
         hn.startsWith("172.23.") || 
         hn.startsWith("172.24.") || 
         hn.startsWith("172.25.") || 
         hn.startsWith("172.26.") || 
         hn.startsWith("172.27.") || 
         hn.startsWith("172.28.") || 
         hn.startsWith("172.29.") || 
         hn.startsWith("172.30.") || 
         hn.startsWith("172.31.") || 
         hn.endsWith(".local");
};

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
  
  // DYNAMIC TRACKS AND EDIT STATE
  const [tracks, setTracks] = useState<Track[]>(defaultTracks as Track[]);
  const [editingTrackId, setEditingTrackId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Track | null>(null);
  const [editNotes, setEditNotes] = useState<string>("");
  const [editTags, setEditTags] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false);

  // Sync track modifications to server on localhost / local IP
  const syncTracksWithServer = async (tracksList: Track[]) => {
    if (isLocalServer()) {
      try {
        await fetch("/api/save-tracks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ tracks: tracksList })
        });
      } catch (err) {
        console.error("Erro ao sincronizar faixas com o servidor local:", err);
      }
    }
  };

  // Convert File to Base64
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.substring(result.indexOf(",") + 1);
        resolve(base64);
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  };

  // Unified audio file handler (IndexedDB + local server upload)
  const handleUploadAudio = async (trackId: string, file: File): Promise<string | undefined> => {
    try {
      await saveAudio(trackId, file.name, file);
      
      const url = URL.createObjectURL(file);
      const audio = new Audio(url);
      audio.volume = volume / 100;
      audio.loop = true;
      audio.onended = () => {
        setCustomPlaying(null);
      };
      
      setCustomAudios(prev => {
        if (prev[trackId]) {
          URL.revokeObjectURL(prev[trackId].url);
        }
        return {
          ...prev,
          [trackId]: { url, name: file.name, audio }
        };
      });

      if (isLocalServer()) {
        const base64Data = await convertFileToBase64(file);
        const res = await fetch("/api/upload-audio", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            trackId,
            filename: file.name,
            base64Data
          })
        });
        if (res.ok) {
          const data = await res.json();
          return data.audioUrl;
        }
      }
    } catch (err) {
      console.error("Erro no processamento do áudio:", err);
    }
    return undefined;
  };

  // 1. Initial Load of Dynamic Tracks from Server or Fallback
  useEffect(() => {
    const loadTracks = async () => {
      // If we are connected to the local development server, fetch the live tracks from the disk JSON
      if (isLocalServer()) {
        try {
          const res = await fetch("/api/tracks");
          if (res.ok) {
            const serverTracks = await res.json();
            if (serverTracks && serverTracks.length > 0) {
              setTracks(serverTracks);
              // Save to IndexedDB to keep local copy updated for offline fallback
              await Promise.all(serverTracks.map((t: Track) => saveTrack(t)));
              return;
            }
          }
        } catch (err) {
          console.error("Erro ao carregar faixas do servidor local, tentando IndexedDB:", err);
        }
      }

      // Production / Fallback: Load from IndexedDB or static JSON
      try {
        const savedTracks = await getAllTracks();
        if (savedTracks && savedTracks.length > 0) {
          // In production, we want the deployed static JSON to override any stale local database
          if (!isLocalServer()) {
            setTracks(defaultTracks as Track[]);
          } else {
            setTracks(savedTracks);
          }
        } else {
          // Initialize IndexedDB with default tracks
          await Promise.all(defaultTracks.map(t => saveTrack(t as Track)));
          setTracks(defaultTracks as Track[]);
        }
      } catch (err) {
        console.error("Erro ao carregar faixas:", err);
        setTracks(defaultTracks as Track[]);
      }
    };

    loadTracks();

    // Load custom audio files from IndexedDB
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
      setCustomAudios(prev => ({ ...prev, ...restored }));
    }).catch(err => {
      console.error("Erro ao carregar áudios do IndexedDB:", err);
    });
  }, []);

  // 2. Load audioUrls from tracks list into customAudios if not already loaded (useful for production assets)
  useEffect(() => {
    const updatedAudios = { ...customAudios };
    let changed = false;

    tracks.forEach(track => {
      if (track.audioUrl && !updatedAudios[track.id]) {
        const audio = new Audio(track.audioUrl);
        audio.volume = volume / 100;
        audio.loop = true;
        audio.onended = () => {
          setCustomPlaying(null);
        };
        
        const name = track.audioUrl.substring(track.audioUrl.lastIndexOf("/") + 1);
        updatedAudios[track.id] = {
          url: track.audioUrl,
          name: name.substring(name.indexOf("-") + 1), // remove prefix like "trackId-"
          audio
        };
        changed = true;
      }
    });

    if (changed) {
      setCustomAudios(updatedAudios);
    }
  }, [tracks, volume]);

  // Synchronize volume to dynamic audio instances
  useEffect(() => {
    Object.values(customAudios).forEach(ca => {
      ca.audio.volume = volume / 100;
    });
  }, [volume, customAudios]);

  // Stop custom playback when the synthesizer triggers
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const trackId = pendingTrackIdRef.current;
    if (e.target.files && e.target.files.length > 0 && trackId) {
      const file = e.target.files[0];
      
      // Stop and clean up old audio instance
      if (customAudios[trackId]) {
        customAudios[trackId].audio.pause();
        if (customAudios[trackId].url.startsWith("blob:")) {
          URL.revokeObjectURL(customAudios[trackId].url);
        }
      }

      // Handle upload and update track record
      const uploadedUrl = await handleUploadAudio(trackId, file);
      if (uploadedUrl) {
        setTracks(prev => {
          const newTracks = prev.map(t => t.id === trackId ? { ...t, audioUrl: uploadedUrl } : t);
          syncTracksWithServer(newTracks);
          // Update IndexedDB record
          const target = newTracks.find(t => t.id === trackId);
          if (target) saveTrack(target);
          return newTracks;
        });
      }
      e.target.value = "";
    }
  };

  const handleEditClick = (trackId: string) => {
    const track = tracks.find(t => t.id === trackId);
    if (!track) return;
    
    setEditingTrackId(trackId);
    setIsAddingNew(false);
    setEditForm({ ...track });
    setEditNotes(track.notes.join(" • "));
    setEditTags(track.tags.map(t => t.startsWith("#") ? t : `#${t.toUpperCase()}`).join(" "));
    setSelectedFile(null);
  };

  const handleAddNewClick = () => {
    const newId = `track-custom-${Date.now()}`;
    setEditingTrackId(newId);
    setIsAddingNew(true);
    setEditForm({
      id: newId,
      title: "Nova Música",
      titleColor: "text-white",
      category: "Jingles & Propaganda",
      categoryColor: "text-neon-pink",
      description: "Escreva uma descrição incrível para este jingle ou música.",
      bpm: 120,
      bpmColor: "text-slate-500",
      notes: ["C major"],
      audioType: "energetic",
      tags: ["NOVA", "MÚSICA"],
      waveColor: "bg-neon-blue",
      audioUrl: ""
    });
    setEditNotes("C major");
    setEditTags("#NOVA #MUSICA");
    setSelectedFile(null);
  };

  const handleDeleteTrackClick = async () => {
    if (!editForm || !editingTrackId) return;
    if (!window.confirm(`Tem certeza que deseja excluir a música "${editForm.title}"?`)) {
      return;
    }
    
    try {
      // 1. Delete entries
      await deleteTrack(editingTrackId);
      await deleteAudio(editingTrackId);
      
      // 2. Remove audio play state
      setCustomAudios(prev => {
        const copy = { ...prev };
        if (copy[editingTrackId]) {
          copy[editingTrackId].audio.pause();
          if (copy[editingTrackId].url.startsWith("blob:")) {
            URL.revokeObjectURL(copy[editingTrackId].url);
          }
          delete copy[editingTrackId];
        }
        return copy;
      });

      // 3. Update React state & sync with backend JSON
      setTracks(prev => {
        const newTracks = prev.filter(t => t.id !== editingTrackId);
        syncTracksWithServer(newTracks);
        return newTracks;
      });

      // 4. Close modal
      setEditingTrackId(null);
      setEditForm(null);
      setSelectedFile(null);
    } catch (err) {
      console.error("Erro ao excluir música:", err);
    }
  };

  const handleSaveCustomization = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm || !editingTrackId) return;

    try {
      let finalAudioUrl = editForm.audioUrl;
      
      // 1. Upload new audio file if selected
      if (selectedFile) {
        const uploadedUrl = await handleUploadAudio(editingTrackId, selectedFile);
        if (uploadedUrl) {
          finalAudioUrl = uploadedUrl;
        }
      }

      // 2. Assemble updated track object
      const updatedTrack: Track = {
        ...editForm,
        notes: editNotes.split("•").map(n => n.trim()).filter(n => n.length > 0),
        tags: editTags.split(/\s+/).map(t => t.trim().toUpperCase().replace("#", "")).filter(t => t.length > 0),
        audioUrl: finalAudioUrl
      };

      // 3. Save to IndexedDB
      await saveTrack(updatedTrack);
      
      // 4. Update React state and sync
      setTracks(prev => {
        let newTracks;
        const idx = prev.findIndex(t => t.id === editingTrackId);
        if (idx >= 0) {
          newTracks = [...prev];
          newTracks[idx] = updatedTrack;
        } else {
          newTracks = [...prev, updatedTrack];
        }
        syncTracksWithServer(newTracks);
        return newTracks;
      });

      // 5. Close modal
      setEditingTrackId(null);
      setEditForm(null);
      setSelectedFile(null);
    } catch (err) {
      console.error("Erro ao salvar card:", err);
    }
  };

  const playCustomAudio = (trackId: string) => {
    onStop();
    
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
    ? tracks
    : tracks.filter(t => t.category === activeTab);

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
        <div className="flex flex-wrap gap-2 justify-center mb-12 items-center">
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
          <button
            onClick={handleAddNewClick}
            className="px-5 py-2.5 rounded-none font-display text-xs uppercase tracking-[0.15em] bg-neon-pink/15 text-neon-pink hover:bg-neon-pink/35 transition-all duration-300 font-bold border border-neon-pink/30 hover:border-neon-pink cursor-pointer flex items-center gap-2"
          >
            <Plus className="w-3.5 h-3.5 animate-pulse" />
            Adicionar Nova Música
          </button>
        </div>

        {/* Lista de Tracks - Custom Left Border Matching Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {filteredTracks.map((track) => {
            const hasCustom = !!customAudios[track.id];
            const isCustomPlaying = customPlaying === track.id;
            const isSynthPlaying = isPlaying === track.id;
            const isSelfPlaying = isCustomPlaying || isSynthPlaying;

            const category = track.category;
            const categoryColor = track.categoryColor || "text-neon-pink";
            const bpm = `${track.bpm} BPM`;
            const bpmColor = track.bpmColor || "text-slate-500";
            const title = track.title;
            const titleColor = track.titleColor || "text-white";
            const description = track.description;
            const notesStr = track.notes.join(" • ");
            const tagsList = track.tags.map(t => t.startsWith("#") ? t : `#${t.toUpperCase()}`);
            const waveColor = track.waveColor || (
              track.audioType === "romantic" ? "bg-rose-500" :
              track.audioType === "energetic" ? "bg-amber-400" :
              track.audioType === "orchestral" ? "bg-indigo-500" :
              "bg-neon-blue"
            );

            // Left border accent color derived from waveColor class
            const accentBorderColor = waveColor.replace("bg-", "border-l-");

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
                      <span className={`text-[10px] font-mono tracking-widest uppercase font-bold ${categoryColor}`}>
                        {category}
                      </span>
                      <div className={`flex items-center gap-1.5 text-xs font-mono font-bold ${bpmColor}`}>
                        <span>{bpm}</span>
                      </div>
                    </div>

                    <h3 className={`text-2xl font-display font-black uppercase tracking-tight mb-1 ${titleColor}`}>
                      {title}
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
                      {description}
                    </p>
                  </div>

                  <div>
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {tagsList.map(t => (
                        <span key={t} className="px-2 py-0.5 rounded-none text-[9px] font-mono uppercase tracking-wider bg-white/5 text-slate-300 border border-white/5 font-bold">
                          {t}
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
                            {hasCustom ? customAudios[track.id].name : `ESCALA: ${notesStr}`}
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
                            } ${waveColor}`}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 mt-3">
                      {/* Botão de Adicionar/Substituir Música */}
                      <button
                        onClick={() => handleImportClick(track.id)}
                        className={`flex-1 py-3 rounded-none font-display text-[10px] uppercase tracking-[0.2em] transition-all duration-300 font-bold flex items-center justify-center gap-2 cursor-pointer ${
                          hasCustom
                            ? "bg-transparent hover:bg-emerald-500 text-emerald-400 hover:text-studio-dark border border-emerald-500/30 hover:border-emerald-500"
                            : "bg-transparent hover:bg-neon-blue text-neon-blue hover:text-studio-dark border border-neon-blue/30 hover:border-neon-blue"
                        }`}
                      >
                        <Plus className="w-3.5 h-3.5" /> {hasCustom ? "Substituir" : "Adicionar Áudio"}
                      </button>

                      {/* Botão de Editar Card */}
                      <button
                        onClick={() => handleEditClick(track.id)}
                        className="px-4 py-3 rounded-none font-display text-[10px] uppercase tracking-[0.2em] transition-all duration-300 font-bold flex items-center justify-center gap-2 cursor-pointer bg-transparent hover:bg-white text-white hover:text-studio-dark border border-white/20 hover:border-white"
                      >
                        <Settings2 className="w-3.5 h-3.5" /> Editar Card
                      </button>
                    </div>
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

      {/* MODAL DE CUSTOMIZAÇÃO DO CARD */}
      {editingTrackId && editForm && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#0c0c0c] border-2 border-white/20 w-full max-w-xl p-8 relative flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
              <h4 className="text-lg font-display font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-neon-blue animate-pulse" /> {isAddingNew ? "Criar Nova Música" : "Personalizar Card"}
              </h4>
              <button 
                onClick={() => { setEditingTrackId(null); setEditForm(null); setSelectedFile(null); }}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer text-xs font-mono uppercase tracking-widest"
              >
                [ FECHAR ]
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveCustomization} className="flex-1 overflow-y-auto space-y-5 pr-2 custom-scrollbar text-left">
              
              {/* Categoria e Cor */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1.5 font-bold">Categoria</label>
                  <input
                    type="text"
                    required
                    value={editForm.category}
                    onChange={e => setEditForm(prev => prev ? { ...prev, category: e.target.value } : null)}
                    className="w-full bg-[#121212] border border-white/15 px-3 py-2 text-sm text-white focus:outline-none focus:border-neon-blue"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1.5 font-bold">Cor da Categoria</label>
                  <select
                    value={editForm.categoryColor || "text-neon-pink"}
                    onChange={e => setEditForm(prev => prev ? { ...prev, categoryColor: e.target.value } : null)}
                    className="w-full bg-[#121212] border border-white/15 px-3 py-2 text-sm text-white focus:outline-none focus:border-neon-blue"
                  >
                    <option value="text-neon-pink">Rosa Neon (Padrão)</option>
                    <option value="text-neon-blue">Azul Neon</option>
                    <option value="text-emerald-400">Verde Emerald</option>
                    <option value="text-amber-400">Amarelo Amber</option>
                    <option value="text-rose-500">Rosa Rose</option>
                    <option value="text-indigo-500">Roxo Indigo</option>
                    <option value="text-white">Branco</option>
                  </select>
                </div>
              </div>

              {/* Título e Cor */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1.5 font-bold">Título da Música</label>
                  <input
                    type="text"
                    required
                    value={editForm.title}
                    onChange={e => setEditForm(prev => prev ? { ...prev, title: e.target.value } : null)}
                    className="w-full bg-[#121212] border border-white/15 px-3 py-2 text-sm text-white focus:outline-none focus:border-neon-blue"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1.5 font-bold">Cor do Título</label>
                  <select
                    value={editForm.titleColor || "text-white"}
                    onChange={e => setEditForm(prev => prev ? { ...prev, titleColor: e.target.value } : null)}
                    className="w-full bg-[#121212] border border-white/15 px-3 py-2 text-sm text-white focus:outline-none focus:border-neon-blue"
                  >
                    <option value="text-white">Branco (Padrão)</option>
                    <option value="text-neon-blue">Azul Neon</option>
                    <option value="text-neon-pink">Rosa Neon</option>
                    <option value="text-emerald-400">Verde Emerald</option>
                    <option value="text-amber-400">Amarelo Amber</option>
                    <option value="text-rose-500">Rosa Rose</option>
                    <option value="text-indigo-500">Roxo Indigo</option>
                  </select>
                </div>
              </div>

              {/* BPM e Cor */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1.5 font-bold">BPM (Batidas por Minuto)</label>
                  <input
                    type="number"
                    required
                    value={editForm.bpm}
                    onChange={e => setEditForm(prev => prev ? { ...prev, bpm: Number(e.target.value) || 120 } : null)}
                    className="w-full bg-[#121212] border border-white/15 px-3 py-2 text-sm text-white focus:outline-none focus:border-neon-blue"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1.5 font-bold">Cor do BPM</label>
                  <select
                    value={editForm.bpmColor || "text-slate-500"}
                    onChange={e => setEditForm(prev => prev ? { ...prev, bpmColor: e.target.value } : null)}
                    className="w-full bg-[#121212] border border-white/15 px-3 py-2 text-sm text-white focus:outline-none focus:border-neon-blue"
                  >
                    <option value="text-slate-500">Cinza (Padrão)</option>
                    <option value="text-neon-blue">Azul Neon</option>
                    <option value="text-neon-pink">Rosa Neon</option>
                    <option value="text-emerald-400">Verde Emerald</option>
                    <option value="text-amber-400">Amarelo Amber</option>
                    <option value="text-rose-500">Rosa Rose</option>
                    <option value="text-white">Branco</option>
                  </select>
                </div>
              </div>

              {/* Escala */}
              <div>
                <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1.5 font-bold">Escala / Notas (Separadas por • )</label>
                <input
                  type="text"
                  required
                  value={editNotes}
                  onChange={e => setEditNotes(e.target.value)}
                  className="w-full bg-[#121212] border border-white/15 px-3 py-2 text-sm text-white focus:outline-none focus:border-neon-blue"
                  placeholder="Ex: D major • A major • G major"
                />
              </div>

              {/* Descrição */}
              <div>
                <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1.5 font-bold">Descrição</label>
                <textarea
                  required
                  rows={3}
                  value={editForm.description}
                  onChange={e => setEditForm(prev => prev ? { ...prev, description: e.target.value } : null)}
                  className="w-full bg-[#121212] border border-white/15 px-3 py-2 text-sm text-white focus:outline-none focus:border-neon-blue resize-none leading-relaxed"
                />
              </div>

              {/* Hashtags */}
              <div>
                <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1.5 font-bold">Hashtags / Tags (Separadas por espaço)</label>
                <input
                  type="text"
                  required
                  value={editTags}
                  onChange={e => setEditTags(e.target.value)}
                  className="w-full bg-[#121212] border border-white/15 px-3 py-2 text-sm text-white focus:outline-none focus:border-neon-blue"
                  placeholder="Ex: #ANIVERSARIO #HOMENAGEM #VESPERSTUDIO"
                />
              </div>

              {/* Cor das Ondas de Som */}
              <div>
                <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1.5 font-bold">Cor das Ondas do Som (Equalizador)</label>
                <select
                  value={editForm.waveColor || "bg-neon-blue"}
                  onChange={e => setEditForm(prev => prev ? { ...prev, waveColor: e.target.value } : null)}
                  className="w-full bg-[#121212] border border-white/15 px-3 py-2 text-sm text-white focus:outline-none focus:border-neon-blue"
                >
                  <option value="bg-neon-blue">Azul Neon (Padrão)</option>
                  <option value="bg-neon-pink">Rosa Neon</option>
                  <option value="bg-rose-500">Rosa Rose</option>
                  <option value="bg-amber-400">Amarelo Amber</option>
                  <option value="bg-indigo-500">Roxo Indigo</option>
                  <option value="bg-emerald-500">Verde Emerald</option>
                  <option value="bg-white">Branco</option>
                </select>
              </div>

              {/* Estilo do Sintetizador */}
              <div>
                <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1.5 font-bold">Estilo do Sintetizador (Se não houver arquivo de áudio)</label>
                <select
                  value={editForm.audioType}
                  onChange={e => setEditForm(prev => prev ? { ...prev, audioType: e.target.value as any } : null)}
                  className="w-full bg-[#121212] border border-white/15 px-3 py-2 text-sm text-white focus:outline-none focus:border-neon-blue"
                >
                  <option value="energetic">Varejo Enérgico (Energetic)</option>
                  <option value="synthwave">Moderna Synthwave (Synthwave)</option>
                  <option value="romantic">Acústico Romântico (Romantic)</option>
                  <option value="orchestral">Sinfônico Casamento (Orchestral)</option>
                </select>
              </div>

              {/* Arquivo de Áudio */}
              <div>
                <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1.5 font-bold">Arquivo de Áudio (.mp3, .wav, .ogg, etc.)</label>
                <div className="flex gap-2">
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={e => {
                      if (e.target.files && e.target.files[0]) {
                        setSelectedFile(e.target.files[0]);
                      }
                    }}
                    className="hidden"
                    id="modal-audio-upload"
                  />
                  <label
                    htmlFor="modal-audio-upload"
                    className="flex-1 bg-[#121212] border border-white/15 px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-neon-blue cursor-pointer hover:bg-white/5 transition-colors flex items-center justify-between"
                  >
                    <span className="truncate max-w-[320px]">{selectedFile ? selectedFile.name : (editForm.audioUrl ? "Áudio configurado" : "Nenhum arquivo selecionado")}</span>
                    <span className="text-[10px] font-mono text-neon-blue uppercase font-bold shrink-0">[ PROCURAR ]</span>
                  </label>
                </div>
                {editForm.audioUrl && !selectedFile && (
                  <span className="text-[9px] font-mono text-slate-500 mt-1 block truncate">
                    Caminho do áudio: {editForm.audioUrl}
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4 border-t border-white/10 items-center justify-between">
                {!isAddingNew && (
                  <button
                    type="button"
                    onClick={handleDeleteTrackClick}
                    className="px-4 py-2.5 text-[10px] font-mono uppercase tracking-wider text-red-500 hover:text-white border border-red-500/20 hover:border-red-600 hover:bg-red-600 transition-all cursor-pointer bg-transparent flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Excluir Música
                  </button>
                )}
                <div className="flex-1" />
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => { setEditingTrackId(null); setEditForm(null); setSelectedFile(null); }}
                    className="px-5 py-2.5 text-[10px] font-mono uppercase tracking-wider text-slate-400 hover:text-white border border-white/10 hover:border-white/20 transition-all cursor-pointer bg-transparent"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 text-[10px] font-mono uppercase tracking-wider bg-neon-blue text-studio-dark font-black hover:bg-cyan-300 transition-all shadow-[0_0_15px_rgba(0,242,255,0.3)] cursor-pointer border-0"
                  >
                    Salvar
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
