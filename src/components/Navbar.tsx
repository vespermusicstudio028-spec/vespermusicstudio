import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const NAV_LINKS = [
  { name: 'Início', href: '#home' },
  { name: 'Serviços', href: '#services' },
  { name: 'Portfólio', href: '#portfolio' },
  { name: 'Planos', href: '#plans' },
  { name: 'Sobre Nós', href: '#about' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 w-full z-40 transition-all duration-300 ${
        isScrolled ? 'bg-vesper-black/90 backdrop-blur-md py-4 shadow-lg shadow-vesper-blue/5' : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <a href="#home" className="text-2xl font-display font-black tracking-wider flex flex-col leading-none z-50">
          <span className="text-vesper-blue glow-text-blue">VESPER</span>
          <span className="text-white text-sm tracking-[0.2em] font-sans">MUSIC STUDIO</span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a 
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-vesper-lightgray hover:text-white hover:glow-text-blue transition-colors"
            >
              {link.name}
            </a>
          ))}
          <a 
            href="#contact"
            className="px-5 py-2 rounded-full border border-vesper-blue text-vesper-blue text-sm font-medium hover:bg-vesper-blue hover:text-white transition-all glow-box-blue"
          >
            Contato
          </a>
        </nav>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-white z-50"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-0 left-0 w-full h-screen bg-vesper-black pt-24 px-6 flex flex-col gap-6 md:hidden"
          >
            {NAV_LINKS.map((link) => (
              <a 
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-2xl font-display font-medium text-white hover:text-vesper-blue transition-colors"
              >
                {link.name}
              </a>
            ))}
            <a 
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-4 px-6 py-3 rounded-full bg-vesper-blue text-white text-center font-medium font-display text-lg"
            >
              Fale Conosco
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
