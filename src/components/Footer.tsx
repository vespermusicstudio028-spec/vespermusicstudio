import { Instagram, Facebook, Youtube, Music2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-vesper-black border-t border-vesper-gray py-12 pb-28 md:pb-12 text-center md:text-left">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8">
        <div>
          <div className="text-xl font-display font-black tracking-wider flex flex-col leading-none mb-4 items-center md:items-start">
            <span className="text-vesper-blue glow-text-blue">VESPER</span>
            <span className="text-white text-xs tracking-[0.2em] font-sans">MUSIC STUDIO</span>
          </div>
          <p className="text-vesper-lightgray text-sm max-w-xs mx-auto md:mx-0">
            Produzindo emoções através da música.
          </p>
        </div>
        
        <div className="flex flex-col items-center">
          <h4 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Links Rápidos</h4>
          <nav className="flex flex-col gap-2 text-sm text-vesper-lightgray">
            <a href="#services" className="hover:text-vesper-blue transition-colors">Serviços</a>
            <a href="#portfolio" className="hover:text-vesper-blue transition-colors">Portfólio</a>
            <a href="#plans" className="hover:text-vesper-blue transition-colors">Planos</a>
          </nav>
        </div>

        <div className="flex flex-col items-center md:items-end">
          <h4 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Redes Sociais</h4>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 rounded-full bg-vesper-darker flex items-center justify-center text-white hover:bg-vesper-blue transition-colors cursor-pointer"><Instagram size={18} /></a>
            <a href="#" className="w-10 h-10 rounded-full bg-vesper-darker flex items-center justify-center text-white hover:bg-vesper-blue transition-colors cursor-pointer"><Facebook size={18} /></a>
            <a href="#" className="w-10 h-10 rounded-full bg-vesper-darker flex items-center justify-center text-white hover:bg-vesper-blue transition-colors cursor-pointer"><Youtube size={18} /></a>
            <a href="#" className="w-10 h-10 rounded-full bg-vesper-darker flex items-center justify-center text-white hover:bg-vesper-blue transition-colors cursor-pointer"><Music2 size={18} /></a>
          </div>
        </div>
      </div>
      
      <div className="mt-12 pt-8 border-t border-vesper-gray/50 text-center text-xs text-vesper-lightgray">
        &copy; {new Date().getFullYear()} Vesper Music Studio. Todos os direitos reservados.
      </div>
    </footer>
  );
}
