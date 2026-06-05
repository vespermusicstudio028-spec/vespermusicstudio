import { MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';

export default function FloatingWhatsApp() {
  const whatsappLink = "https://wa.me/5512996539857?text=Olá,%20gostaria%20de%20fazer%20um%20orçamento%20com%20a%20Vesper%20Music%20Studio!";

  return (
    <motion.a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1, type: "spring" }}
      className="fixed bottom-6 right-6 md:bottom-28 z-[60] bg-[#25D366] text-white p-4 rounded-full shadow-lg shadow-[#25D366]/30 hover:scale-110 transition-transform group"
    >
      <MessageCircle size={28} />
      <span className="absolute right-full mr-4 bg-white text-black text-sm px-3 py-1 rounded shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none font-medium">
        Fale conosco 
      </span>
    </motion.a>
  );
}
