import { motion } from 'motion/react';
import { Play } from 'lucide-react';

export default function Hero() {
  return (
    <section id="home" className="relative min-h-[100svh] flex items-center justify-center overflow-hidden pt-20">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-vesper-blue/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-vesper-red/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-6 inline-flex items-center gap-3 px-4 py-2 rounded-full border border-vesper-gray bg-vesper-darker/50 backdrop-blur-sm"
        >
          <span className="flex h-2 w-2 rounded-full bg-vesper-red animate-pulse glow-box-red"></span>
          <span className="text-xs font-medium tracking-wider text-vesper-lightgray uppercase">Produção Profissional</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl font-display font-bold leading-tight mb-6"
        >
          Transformamos suas <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-vesper-blue to-vesper-red glow-text-blue">
            ideias em música
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-xl text-vesper-lightgray max-w-2xl mx-auto mb-10"
        >
          Músicas personalizadas para aniversários, casamentos, empresas, eventos e momentos inesquecíveis.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a 
            href="#portfolio"
            className="flex items-center gap-2 px-8 py-4 rounded-full bg-white text-black font-semibold hover:scale-105 transition-transform w-full sm:w-auto justify-center"
          >
            <Play size={20} className="fill-black" />
            Ouvir Demonstrações
          </a>
          <a 
            href="#contact"
            className="px-8 py-4 rounded-full bg-transparent border border-vesper-gray text-white font-semibold hover:bg-vesper-gray transition-colors w-full sm:w-auto justify-center flex"
          >
            Solicitar Orçamento
          </a>
        </motion.div>
      </div>

      {/* Animated Equalizer at bottom */}
      <div className="absolute bottom-0 left-0 w-full h-32 flex items-end justify-center gap-1 opacity-20 pointer-events-none overflow-hidden">
        {[...Array(40)].map((_, i) => (
          <motion.div
            key={i}
            className="w-2 sm:w-4 bg-vesper-blue"
            animate={{
              height: [20, Math.random() * 100 + 20, 20],
            }}
            transition={{
              duration: Math.random() * 1 + 0.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </section>
  );
}
