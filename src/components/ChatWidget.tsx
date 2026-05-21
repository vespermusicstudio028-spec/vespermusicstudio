import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Smartphone, Send, SendHorizontal, Scissors, HelpCircle, Music, Check, Headphones } from "lucide-react";

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
}

const FAQ_OPTIONS = [
  {
    id: "jingles",
    question: "📻 Vocês fazem Jingles e Propagandas para Comércios?",
    answer: "Sim, com certeza! Criamos jingles comerciais extremamente cativantes e spots publicitários sob medida para atrair clientes. Perfeito para postar no Instagram, TikTok, rodar em carros de som, rádio, ou utilizar nas campanhas de vendas e eventos da sua loja ou empresa!"
  },
  {
    id: "weddings_romance",
    question: "💑 Trilha para Casamentos & Músicas Românticas?",
    answer: "Somos especialistas em transformar histórias reais em composições inesquecíveis! Criamos a trilha sonora exclusiva para a entrada dos noivos, canções de noivado sob medida, retrospectiva animada ou emocionantes declarações de amor românticas em piano, cordas e arranjos sublimes."
  },
  {
    id: "birthdays",
    question: "🎂 Música para Aniversários e Mensagens?",
    answer: "Sim, é um dos nossos formatos mais pedidos! Fazemos canções personalizadas incríveis contando as passagens marcantes, piadas internas e as histórias de vida de quem está soprando as velinhas. Um presente inesquecível e emocionante!"
  },
  {
    id: "events",
    question: "🎉 Sonorização para Eventos e Festas?",
    answer: "Sonorizamos aberturas corporativas, desfiles, convenções, festas de comércios locais e lançamentos importantes. Uma trilha sonora de alta definição criada especificamente para engajar o seu público-alvo no evento."
  },
  {
    id: "price_deadline",
    question: "💰 Qual o valor e prazo de entrega?",
    answer: "O orçamento varia conforme o estilo (acústico, orquestral ou jingle eletrônico de alta energia). Em média, entregamos um rascunho de som e letra em 4 dias úteis e a versão finalizada em estúdio profissional em até 7 a 10 dias úteis. Entre em contato por WhatsApp ou E-mail para uma proposta rápida!"
  }
];

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "bot",
      text: "Olá! Seja muito bem-vindo ao Vesper Music Studio. 🎵\n\nSou o assistente de atendimento automatizado. Escolha uma das perguntas frequentes abaixo, envie-nos um e-mail em vespermusicstudio028@gmail.com ou tire suas dúvidas agora mesmo!"
    }
  ]);
  const [showOptions, setShowOptions] = useState(true);
  const [hasTalkedToHuman, setHasTalkedToHuman] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSelectOption = (optionId: string, question: string, answer: string) => {
    // Add user question
    const userMsgId = `user-${Date.now()}`;
    const newUserMsg: Message = {
      id: userMsgId,
      sender: "user",
      text: question
    };

    setMessages(prev => [...prev, newUserMsg]);
    setShowOptions(false);

    // Dynamic delay to feel authentic and professional, without any AI
    setTimeout(() => {
      const botMsgId = `bot-${Date.now()}`;
      const newBotMsg: Message = {
        id: botMsgId,
        sender: "bot",
        text: answer
      };
      setMessages(prev => [...prev, newBotMsg]);
      setShowOptions(true);
    }, 600);
  };

  const handleCustomInput = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const text = formData.get("userMessage")?.toString().trim();
    if (!text) return;

    // Reset input
    e.currentTarget.reset();

    // Add user message
    const userMsgId = `user-${Date.now()}`;
    const newUserMsg: Message = {
      id: userMsgId,
      sender: "user",
      text: text
    };
    setMessages(prev => [...prev, newUserMsg]);

    setTimeout(() => {
      const botMsgId = `bot-${Date.now()}`;
      const newBotMsg: Message = {
        id: botMsgId,
        sender: "bot",
        text: "Entendi perfeitamente sua dúvida! Como seu contato é muito importante para nós, recomendo falar diretamente com nosso produtor no WhatsApp para conversarmos e resolvermos tudo de forma personalizada.👇"
      };
      setMessages(prev => [...prev, newBotMsg]);
      setHasTalkedToHuman(true);
    }, 500);
  };

  return (
    <>
      {/* FLOATING ACTION BUTTON WITH GLOW */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-14 h-14 rounded-full bg-[#111111] border-2 transition-all duration-300 flex items-center justify-center cursor-pointer shadow-[0_0_20px_rgba(0,242,255,0.25)] hover:shadow-[0_0_25px_rgba(255,0,85,0.4)] ${
            isOpen ? "border-neon-pink scale-110 rotate-90" : "border-neon-blue hover:scale-105"
          }`}
          title="Atendimento Rápido Vesper"
        >
          {isOpen ? (
            <X className="w-6 h-6 text-neon-pink" />
          ) : (
            <div className="relative">
              <MessageSquare className="w-6 h-6 text-neon-blue animate-pulse" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-neon-pink rounded-full" />
            </div>
          )}
        </button>
      </div>

      {/* CHAT PANEL */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[360px] md:w-[400px] max-h-[550px] h-[80vh] bg-[#0c0d10] border-2 border-white/10 rounded-none shadow-2xl z-50 flex flex-col overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="bg-[#111111] p-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-none bg-gradient-to-tr from-neon-blue to-neon-pink p-[1px] flex items-center justify-center">
                <div className="w-full h-full bg-[#0a0a0a] flex items-center justify-center">
                  <Headphones className="w-4 h-4 text-neon-blue" />
                </div>
              </div>
              <div className="text-left">
                <h4 className="text-xs font-display font-black tracking-wider uppercase text-white leading-none">
                  Atendimento Automatizado
                </h4>
                <p className="text-[9px] font-mono uppercase tracking-widest text-emerald-500 font-bold mt-1">
                  ● Respostas Instantâneas
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-slate-500 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#07070a]/90 custom-scrollbar select-none text-left">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === "user" ? "justify-end animate-sliceDown" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] px-4 py-3 text-xs leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-neon-blue/10 text-white border-r-2 border-neon-blue bg-[#111822]"
                      : "bg-[#111111] text-slate-300 border-l-2 border-neon-pink"
                  }`}
                >
                  <p className="whitespace-pre-line font-light">{msg.text}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Options Menu & Auto Prompting */}
          {showOptions && (
            <div className="p-3 bg-[#111111]/80 border-t border-white/5 space-y-2 max-h-[160px] overflow-y-auto custom-scrollbar">
              <p className="text-[10px] font-mono uppercase tracking-wider text-slate-500 text-left mb-1 font-bold">
                💡 Dúvidas Frequentes (Selecione um tópico):
              </p>
              <div className="flex flex-col gap-1.5 text-left">
                {FAQ_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(opt.id, opt.question, opt.answer)}
                    className="w-full text-[11px] text-slate-300 hover:text-neon-blue hover:bg-[#15151b] px-3 py-2 bg-[#0c0d10] border border-white/5 transition-all cursor-pointer text-left truncate font-light"
                  >
                    {opt.question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Core Interactive Fallback to WhatsApp and Email Direct Contact */}
          <div className="p-4 bg-[#111111] border-t border-white/10 flex flex-col gap-3">
            <div className="text-[10px] font-medium text-slate-400 text-center leading-relaxed font-sans">
              Deseja conversar de forma direta com o produtor?
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <a
                href="https://wa.me/5512996539857?text=Ol%C3%A1%21+Estou+vindo+do+site+da+Vesper+Music+e+gostaria+de+falar+sobre+meu+projeto+musical%22"
                target="_blank"
                rel="noreferrer"
                className="py-2.5 px-2 bg-emerald-600 hover:bg-emerald-500 text-white leading-none font-mono text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-[0_0_12px_rgba(16,185,129,0.3)] font-bold text-center"
              >
                <Smartphone className="w-3.5 h-3.5 fill-white text-emerald-600 shrink-0" />
                WhatsApp
              </a>
              <a
                href="mailto:vespermusicstudio028@gmail.com"
                className="py-2.5 px-2 bg-[#1e1f29] border border-white/10 hover:border-neon-blue text-white leading-none font-mono text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer font-bold text-center hover:text-neon-blue"
              >
                <span className="text-neon-blue font-bold shrink-0">@</span>
                Email
              </a>
            </div>

            {/* Manual user question inputs as manual alternative for generic queries */}
            <form onSubmit={handleCustomInput} className="flex gap-2">
              <input
                type="text"
                name="userMessage"
                required
                placeholder="Escreva outra pergunta..."
                className="flex-1 px-3 py-2 bg-[#050505] border border-white/10 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-neon-pink"
              />
              <button
                type="submit"
                className="p-2 bg-neon-pink text-white hover:bg-pink-600 transition-colors cursor-pointer flex items-center justify-center"
              >
                <SendHorizontal className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
