import { MessageCircle } from 'lucide-react';

export default function Contact() {
  const whatsappLink = "https://wa.me/5512996539857?text=Olá,%20gostaria%20de%20fazer%20um%20orçamento%20com%20a%20Vesper%20Music%20Studio!";

  return (
    <section id="contact" className="py-24 bg-gradient-to-b from-vesper-black to-vesper-darker">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">Pronto para dar o play?</h2>
        <p className="text-vesper-lightgray text-lg mb-12">
          Entre em contato com o Flávio pelo WhatsApp e solicite um orçamento sem compromisso. Nossa equipe está pronta para produzir a sua música.
        </p>
        
        <a 
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-3 bg-[#25D366] text-white font-bold text-lg px-8 py-4 rounded-full hover:scale-105 transition-transform"
        >
          <MessageCircle size={24} />
          Falar no WhatsApp
        </a>
        <p className="mt-6 text-sm text-vesper-lightgray font-mono">(12) 99653-9857</p>
      </div>
    </section>
  );
}
