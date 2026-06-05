import { Music } from 'lucide-react';

export default function About() {
  return (
    <section id="about" className="py-24 bg-vesper-black">
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-6 leading-tight">
              A música <span className="text-vesper-red glow-text-red">perfeita</span> <br/>
              para cada momento
            </h2>
            <p className="text-vesper-lightgray text-lg leading-relaxed mb-8">
              A Vesper Music Studio cria experiências sonoras únicas através de músicas personalizadas e jingles profissionais. Transformamos histórias, emoções e marcas em canções memoráveis que conectam pessoas.
            </p>
            <div className="flex gap-4">
              <div className="flex items-center gap-3 bg-vesper-darker py-3 px-5 rounded-lg border border-vesper-gray">
                <Music className="text-vesper-blue" size={20} />
                <span className="font-medium text-sm">Produção Autoral</span>
              </div>
              <div className="flex items-center gap-3 bg-vesper-darker py-3 px-5 rounded-lg border border-vesper-gray">
                <Music className="text-vesper-red" size={20} />
                <span className="font-medium text-sm">Qualidade de Estúdio</span>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden relative">
              <img 
                src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=800&auto=format&fit=crop" 
                alt="Estúdio de Música" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover grayscale opacity-80 hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-vesper-blue/30 to-transparent mix-blend-overlay"></div>
            </div>
            {/* Glow decoration */}
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-vesper-blue/30 rounded-full blur-[50px] -z-10"></div>
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-vesper-red/30 rounded-full blur-[50px] -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
