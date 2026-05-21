import React, { useState, useEffect } from "react";
import { Sparkles, MessageSquare, Send, CheckCircle2, Copy, ArrowRight, ArrowLeft, RefreshCw, Smartphone } from "lucide-react";
import { Briefing, AIResponse } from "../types";

const OBJECTIVES = [
  { id: "Jingle ou Propaganda Comercial", title: "Jingle & Propaganda", desc: "Melodias cativantes e slogans cantados para fixar seu comércio ou negócio na mente do público." },
  { id: "Música de Casamento", title: "Casamentos & Noivados", desc: "Música personalizada altamente emocionante para a entrada dos noivos ou cerimônias." },
  { id: "Música Romântica ou Homenagem", title: "Música Romântica", desc: "Homenagens, bodas ou declarações exclusivas com arranjos delicados de piano e cordas." },
  { id: "Música de Aniversário", title: "Presente de Aniversário", desc: "Canções acústicas personalizadas narrando histórias de vida e memórias de pessoas amadas." },
  { id: "Trilha para Eventos", title: "Eventos & Festividades", desc: "Sonorização sob medida e aberturas para marcas, convenções corporativas e desfiles." },
  { id: "Outros Momentos", title: "Outro Projeto", desc: "Qualquer outra ideia criativa de trilhas ou produções musicais por encomenda." }
];

const MOODS = [
  { id: "Romântico e Emocionante", label: "💖 Romântico & Emocionante", desc: "Lento, tocante, arranjos de piano, violão e violino." },
  { id: "Alegre e Festivo", label: "🥳 Alegre & Contagiante", desc: "Para cima, andamento rápido, violões pulsantes e ritmo alegre." },
  { id: "Épico e Cinematográfico", label: "🎬 Épico & Grandioso", desc: "Climax poderoso, cordas orquestrais e bumbo impactante." },
  { id: "Corporativo e Moderno", label: "💼 Profissional & Tecnológico", desc: "Estilo eletrônico, clean, compassos firmes que transmitem confiança." },
  { id: "Nostálgico Retrô", label: "🕹️ Retrô / Anos 80 (Synthwave)", desc: "Sintetizadores vibrantes, estética cyberpunk e nostalgia." }
];

interface BriefingCreatorProps {
  selectedObjective?: string;
  onClearObjective?: () => void;
}

export default function BriefingCreator({
  selectedObjective,
  onClearObjective
}: BriefingCreatorProps) {
  const [step, setStep] = useState<number>(1);
  const [briefing, setBriefing] = useState<Briefing>({
    objective: "",
    mood: "",
    companyName: "",
    briefDetails: ""
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [aiSuggestions, setAiSuggestions] = useState<AIResponse | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Auto populate and advance when a service card is clicked
  useEffect(() => {
    if (selectedObjective) {
      setBriefing(prev => ({
        ...prev,
        objective: selectedObjective
      }));
      setStep(2); // Jump automatically to Step 2 (Mood Selection)
      onClearObjective?.();
    }
  }, [selectedObjective, onClearObjective]);

  const handleSelectObjective = (obj: string) => {
    setBriefing({ ...briefing, objective: obj });
    setStep(2);
  };

  const handleSelectMood = (mood: string) => {
    setBriefing({ ...briefing, mood });
    setStep(3);
  };

  const handleGenerateAI = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch("/api/brainstorm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(briefing)
      });
      const data = await response.json();
      if (response.ok) {
        setAiSuggestions(data);
        setStep(4);
      } else {
        throw new Error(data.error || "Failed to generate");
      }
    } catch (err) {
      console.error(err);
      // Fallback
      setAiSuggestions({
        lyrics: `[Verso 1]\nUm passo à frente, o sonho vai brilhar\nVesper Music pra te registrar.\nCom os graves na mesa, o som vai ecoar,\nSua melodia gravada no ar.\n\n[Refrão]\nEsta é sua canção, feita com o coração,\nCada nota no tempo, no ritmo da emoção.\nPersonalizado no ponto ideal,\nUm som único, original.`,
        slogans: [
          "Sua essência na batida certa.",
          "O som por trás das suas grandes ideias.",
          "Vesper Music: Sua vida em harmonia."
        ],
        structure: ["Intro Acústica", "Verso 1 com Piano", "Refrão com Sabor Pop", "Final Clássico"],
        tips: [
          "Dê preferência a vozes limpas e sem afinação em excesso.",
          "Use um arranjo minimalista para destacar a mensagem da letra.",
          "Encaminhe agora ao produtor para decidirmos os dubladores!"
        ]
      });
      setStep(4);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyText = () => {
    if (!aiSuggestions) return;
    
    const textToCopy = `--- BRIEFING MUSICAL - VESPER MUSIC ---
Objetivo: ${briefing.objective}
Identidade/Nome: ${briefing.companyName || "N/A"}
Sentimento/Vibe: ${briefing.mood}
História/Referências: ${briefing.briefDetails}

--- ESBOÇO SUGERIDO - VESPER MUSIC ---
Letra/Jingle Sugerido:
${aiSuggestions.lyrics}

Slogans Propostos:
${aiSuggestions.slogans.map(s => `• "${s}"`).join("\n")}

Estrutura Recomendada:
${aiSuggestions.structure.join(" -> ")}

Dicas de Produção:
${aiSuggestions.tips.map(t => `- ${t}`).join("\n")}
`;

    navigator.clipboard.writeText(textToCopy);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSendToWhatsapp = () => {
    let message = `Olá! Montei meu briefing musical de projeto no site da Vesper Music. Aqui estão as informações básicas:

🎵 *OBJETIVO:* ${briefing.objective}
✍️ *ID / NOME EM DESTAQUE:* ${briefing.companyName || "Não especificado"}
✨ *ESTILO/VIBE:* ${briefing.mood}
📝 *MINHA HISTÓRIA/DETALHES:* ${briefing.briefDetails || "Desejo conversar diretamente sobre os detalhes."}`;

    if (aiSuggestions) {
      message += `\n\n💡 *ESBOÇO DE ARRANJO E LETRA SUGERIDO:*
Slogan Sugerido: "${aiSuggestions.slogans[0]}"
Estrutura Musical: ${aiSuggestions.structure.join(" -> ")}`;
    }

    if (referenceFile) {
      message += `\n\n📎 *ARQUIVO DE REFERÊNCIA:* ${referenceFile.name} (Enviarei este arquivo de áudio no chat a seguir)`;
    }

    message += `\n\nEstou ansioso para produzir essa trilha com você! Gostaria de um orçamento detalhado.`;

    const encodedText = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/5512996539857?text=${encodedText}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <section id="custom-briefing-creator" className="py-24 bg-studio-dark relative z-10 px-4 scroll-mt-12">
      <div className="max-w-4xl mx-auto">
        
        {/* Banner Decorativo de Fundo */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-neon-blue/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="bg-[#111111] p-8 md:p-12 rounded-none border-l-4 border-neon-blue shadow-2xl relative overflow-hidden">
          
          {/* Progress Indicator - Square Brutalist Layout */}
          <div className="flex justify-between items-center mb-10 max-w-sm mx-auto">
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-none flex items-center justify-center font-display text-xs font-black transition-all duration-300 ${
                    step >= num
                      ? "bg-neon-blue text-studio-dark ring-4 ring-neon-blue/10"
                      : "bg-[#0a0a0a] text-gray-600 border border-white/10"
                  }`}
                >
                  {num}
                </div>
                {num < 4 && (
                  <div
                    className={`w-12 h-0.5 transition-all duration-300 ${
                      step > num ? "bg-neon-blue" : "bg-white/10"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* STEP 1: OBJETIVO */}
          {step === 1 && (
            <div>
              <div className="text-center mb-10">
                <span className="text-xs font-mono text-neon-blue uppercase tracking-[0.25em] font-bold">03 — PASSO 1 DE 4</span>
                <h3 className="text-3xl md:text-4xl font-display font-black text-white mt-1 uppercase tracking-tighter">
                  OBJETIVO DA SUA MÚSICA?
                </h3>
                <div className="w-12 h-[2px] bg-neon-blue mx-auto mt-3 mb-3" />
                <p className="text-gray-400 text-xs">
                  Selecione do que se trata seu projeto sonoro para ajustarmos os sintetizadores.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {OBJECTIVES.map((obj) => (
                  <button
                    key={obj.id}
                    onClick={() => handleSelectObjective(obj.id)}
                    className="p-6 rounded-none bg-[#0a0a0a] border-l-2 border-white/20 hover:border-l-2 hover:border-neon-blue text-left transition-all duration-300 group"
                  >
                    <div className="flex items-start justify-between">
                      <h4 className="font-display font-black text-lg text-white uppercase tracking-tight group-hover:text-neon-blue transition-colors">
                        {obj.title}
                      </h4>
                      <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-neon-blue group-hover:translate-x-1 transition-all" />
                    </div>
                    <p className="text-gray-400 text-xs mt-2 font-light leading-relaxed">
                      {obj.desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: MOOD / SENTIMENTO */}
          {step === 2 && (
            <div>
              <div className="text-center mb-10">
                <span className="text-xs font-mono text-neon-pink uppercase tracking-[0.25em] font-bold">03 — PASSO 2 DE 4</span>
                <h3 className="text-3xl md:text-4xl font-display font-black text-white mt-1 uppercase tracking-tighter">
                  VIBE OU SENTIMENTO?
                </h3>
                <div className="w-12 h-[2px] bg-neon-pink mx-auto mt-3 mb-3" />
                <p className="text-gray-400 text-xs">
                  A energia da música define os instrumentos e a velocidade (BPM).
                </p>
              </div>

              <div className="space-y-3 max-w-2xl mx-auto">
                {MOODS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => handleSelectMood(m.id)}
                    className="w-full p-5 rounded-none bg-[#0a0a0a] border-l-2 border-white/10 hover:border-l-2 hover:border-neon-pink text-left transition-all duration-300 flex justify-between items-center group"
                  >
                    <div>
                      <h4 className="font-display font-bold text-base uppercase tracking-tight text-white group-hover:text-neon-pink transition-colors">
                        {m.label}
                      </h4>
                      <p className="text-xs text-gray-400 mt-1 font-light">
                        {m.desc}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-neon-pink group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>

              <div className="mt-8 text-center">
                <button
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-white uppercase tracking-wider font-mono font-bold transition-colors animate-pulse"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Voltar ao passo anterior
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: DETAILS & BRAND */}
          {step === 3 && (
            <div>
              <div className="text-center mb-10">
                <span className="text-xs font-mono text-neon-blue uppercase tracking-[0.25em] font-bold">03 — PASSO 3 DE 4</span>
                <h3 className="text-3xl md:text-4xl font-display font-black text-white mt-1 uppercase tracking-tighter">
                  DETALHES &amp; HISTÓRIA
                </h3>
                <div className="w-12 h-[2px] bg-neon-blue mx-auto mt-3 mb-3" />
                <p className="text-gray-400 text-xs">
                  Nomes de destaque, datas, jargões da marca ou memórias para inspirar a composição.
                </p>
              </div>

              <form onSubmit={handleGenerateAI} className="space-y-6 max-w-2xl mx-auto">
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-widest mb-2 font-bold">
                    Nome da Empresa / Nome das Pessoas em Destaque
                  </label>
                  <input
                    type="text"
                    value={briefing.companyName}
                    onChange={(e) => setBriefing({ ...briefing, companyName: e.target.value })}
                    placeholder="Ex: Pedro & Mariana (Casal) ou Vesper Hamburgueria"
                    className="w-full px-4 py-3 bg-[#0a0a0a] rounded-none border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-neon-blue transition-colors text-sm"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-widest mb-2 font-bold">
                    Conte a história ou o que a música precisa dizer
                  </label>
                  <textarea
                    rows={4}
                    value={briefing.briefDetails}
                    onChange={(e) => setBriefing({ ...briefing, briefDetails: e.target.value })}
                    required
                    placeholder="Ex: Como se conheceram, qual a proposta de valor do negócio, as frases que não podem faltar ou referências musicais preferidas..."
                    className="w-full px-4 py-3 bg-[#0a0a0a] rounded-none border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-neon-blue transition-colors text-sm resize-none"
                  />
                </div>

                <div className="bg-[#050505] p-5 rounded-none border-l-2 border-neon-blue flex gap-4 text-xs text-slate-400 leading-relaxed">
                  <Sparkles className="w-5 h-5 text-neon-blue shrink-0 animate-pulse" />
                  <p>
                    Ao clicar abaixo, usaremos a <strong className="text-white">tecnologia do algoritmo Vesper Music</strong> para desenhar esboços de letras e rascunhos de produção sob medida para o seu orçamento, direcionando perfeitamente a equipe do estúdio.
                  </p>
                </div>

                <div className="flex justify-between items-center pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="font-mono text-xs uppercase tracking-widest text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 font-bold"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Voltar
                  </button>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-4 rounded-none bg-neon-blue text-studio-dark font-display font-black text-xs uppercase tracking-widest hover:bg-cyan-300 transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(0,242,255,0.3)] disabled:opacity-55"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" /> Estruturando Esboço...
                      </>
                    ) : (
                      <>
                        Gerar Esboço &amp; Estrutura Musical <Sparkles className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* STEP 4: SUGGESTIONS & WHATSAPP GOTO */}
          {step === 4 && aiSuggestions && (
            <div className="space-y-8 animate-fadeIn">
              <div className="text-center">
                <div className="w-12 h-12 rounded-none bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-3 border border-emerald-500/20">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-3xl md:text-4xl font-display font-black text-white mt-1 uppercase tracking-tighter">
                  SEU BRIEFING ESTÁ PRONTO!
                </h3>
                <div className="w-12 h-[2px] bg-emerald-400 mx-auto mt-3 mb-3" />
                <p className="text-gray-400 text-xs">
                  Abaixo está o rascunho musical e lírico formulado pela IA. Analise as recomendações!
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* SUGERIDO LYRICS CARD */}
                <div className="md:col-span-2 bg-[#0a0a0a] rounded-none p-6 md:p-8 border-l-2 border-neon-pink flex flex-col justify-between border-t border-r border-b border-t-white/5 border-r-white/5 border-b-white/5">
                  <div>
                    <h4 className="text-xs font-mono text-neon-pink uppercase tracking-widest mb-4 flex items-center gap-1.5 font-bold">
                      <Sparkles className="w-3.5 h-3.5" /> Esboço de Letra Proposto
                    </h4>
                    <pre className="font-sans text-[#e5e7eb] text-sm whitespace-pre-line leading-relaxed italic bg-[#050505] p-5 rounded-none border border-white/5 text-slate-300 font-light select-all">
                      {aiSuggestions.lyrics}
                    </pre>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-white/5 flex flex-wrap gap-2">
                    {aiSuggestions.slogans.map((slog, idx) => (
                      <span key={idx} className="text-[10px] font-mono bg-white/5 text-slate-300 px-3 py-1 rounded-none border border-white/10 italic font-bold">
                        &ldquo;{slog}&rdquo;
                      </span>
                    ))}
                  </div>
                </div>

                {/* ESTRUTURA E DICAS COL */}
                <div className="space-y-6">
                  
                  {/* Estrutura */}
                  <div className="bg-[#0a0a0a] p-6 rounded-none border-l-2 border-neon-blue border-t border-r border-b border-t-white/5 border-r-white/5 border-b-white/5">
                    <h4 className="text-xs font-mono text-neon-blue uppercase mb-3 tracking-widest font-black">
                      ARRANGEMENT (ESTRUTURA)
                    </h4>
                    <ol className="space-y-2 text-xs text-slate-400">
                      {aiSuggestions.structure.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <span className="w-4 h-4 rounded-none bg-neon-blue/15 text-neon-blue font-mono text-[9px] flex items-center justify-center font-bold">
                            {idx + 1}
                          </span>
                          <span className="font-medium uppercase text-gray-300 text-[11px] font-display">{item}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Dicas de Mixagem */}
                  <div className="bg-[#0a0a0a] p-6 rounded-none border-l-2 border-[#a78bfa] border-t border-r border-b border-t-white/5 border-r-white/5 border-b-white/5">
                    <h4 className="text-xs font-mono text-[#a78bfa] uppercase mb-3 tracking-widest font-black">
                      DICAS PARA O ESTÚDIO
                    </h4>
                    <ul className="space-y-2 text-[11px] text-slate-400 leading-relaxed font-light">
                      {aiSuggestions.tips.map((tip, idx) => (
                        <li key={idx} className="flex gap-1.5 items-start">
                          <span className="text-neon-pink shrink-0 font-bold">•</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>
              </div>

              {/* BARRA DE CTA INTEGRADA */}
              <div className="bg-[#0c0d10] p-6 md:p-8 rounded-none border-2 border-dashed border-emerald-500/40 text-center">
                <h4 className="font-display font-black text-xl text-white uppercase mb-2">
                  DÊ VIDA À SUA MÚSICA! 🚀
                </h4>
                <p className="text-xs text-slate-400 max-w-lg mx-auto mb-6">
                  Ao clicar abaixo, abriremos o WhatsApp do produtor pré-formatado com todo o seu briefing detalhado. Ele passará o orçamento e criará a melodia!
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                  <button
                    onClick={handleSendToWhatsapp}
                    className="w-full sm:w-auto px-6 py-4 rounded-none bg-[#25d366] text-white hover:bg-emerald-600 font-display font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(37,211,102,0.35)]"
                  >
                    <Smartphone className="w-5 h-5 fill-white" />
                    Enviar Briefing via WhatsApp
                  </button>

                  <button
                    onClick={handleCopyText}
                    className="w-full sm:w-auto px-6 py-4 rounded-none bg-studio-card border border-white/10 hover:border-white/20 text-slate-300 font-display text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                  >
                    {isCopied ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Copiado!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-neon-blue" /> Copiar Dados do Briefing
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="text-center">
                <button
                  onClick={() => {
                    setBriefing({ objective: "", mood: "", companyName: "", briefDetails: "" });
                    setAiSuggestions(null);
                    setStep(1);
                  }}
                  className="text-xs font-mono font-bold uppercase tracking-widest text-[#00f2ff] hover:text-white transition-colors"
                >
                  Refazer Briefing / Iniciar Novo Projeto
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
    </section>
  );
}
