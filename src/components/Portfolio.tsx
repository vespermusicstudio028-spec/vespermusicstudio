import { Play, Music } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { Track, DEMO_TRACKS } from '../data';

interface PortfolioProps {
  currentTrack: Track | null;
  isPlaying: boolean;
  onPlayTrack: (track: Track) => void;
}

interface TrackRowProps {
  track: Track;
  index: number;
  currentTrack: Track | null;
  isPlaying: boolean;
  onPlayTrack: (track: Track) => void;
}

function TrackRow({ track, index, currentTrack, isPlaying, onPlayTrack }: TrackRowProps) {
  const [imgError, setImgError] = useState(false);
  const isThisPlaying = currentTrack?.id === track.id && isPlaying;

  return (
    <motion.div 
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className={`flex items-center px-4 py-3 rounded-lg cursor-pointer group hover:bg-white/5 transition-colors ${currentTrack?.id === track.id ? 'bg-white/5' : ''}`}
      onClick={() => onPlayTrack(track)}
    >
      <div className="w-12 text-center flex justify-center">
        {isThisPlaying ? (
          <div className="flex items-end h-4 gap-[2px]">
            <motion.div animate={{ height: [4, 14, 4] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-1 bg-vesper-blue rounded-full" />
            <motion.div animate={{ height: [8, 16, 8] }} transition={{ repeat: Infinity, duration: 0.7 }} className="w-1 bg-vesper-blue rounded-full" />
            <motion.div animate={{ height: [6, 12, 6] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-1 bg-vesper-blue rounded-full" />
          </div>
        ) : (
          <span className="text-vesper-lightgray group-hover:hidden">{index + 1}</span>
        )}
        {!isThisPlaying && <Play size={16} className="hidden group-hover:block fill-white text-white" />}
      </div>
      
      <div className="flex-1 flex items-center gap-4">
        {imgError ? (
          <div className="w-10 h-10 rounded bg-gradient-to-br from-vesper-blue to-vesper-red flex items-center justify-center shrink-0 shadow-md">
            <Music size={16} className="text-white" />
          </div>
        ) : (
          <img 
            src={track.coverUrl} 
            alt={track.title} 
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-10 h-10 rounded shadow-md object-cover shrink-0"
          />
        )}
        <div className="flex flex-col">
          <span className={`font-medium ${currentTrack?.id === track.id ? 'text-vesper-blue font-semibold' : 'text-white'}`}>{track.title}</span>
          <span className="text-sm text-vesper-lightgray">{track.artist}</span>
        </div>
      </div>
      
      <div className="w-24 hidden md:flex items-center text-sm text-vesper-lightgray">
        {track.duration}
      </div>
    </motion.div>
  );
}

export default function Portfolio({ currentTrack, isPlaying, onPlayTrack }: PortfolioProps) {
  return (
    <section id="portfolio" className="py-24 bg-gradient-to-b from-vesper-dark to-vesper-black relative overflow-hidden">
      {/* Visual Accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-vesper-blue/5 rounded-full blur-[100px] pointer-events-none pb-24" />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">Portfólio</h2>
          <p className="text-vesper-lightgray text-lg max-w-xl mx-auto">Ouça alguns trabalhos da Vesper Music Studio e sinta a qualidade das nossas produções.</p>
        </div>

        {/* Playlist Container */}
        <div className="bg-vesper-darker/60 backdrop-blur-md rounded-2xl border border-vesper-gray overflow-hidden">
          {/* Header */}
          <div className="flex px-6 py-3 border-b border-vesper-gray text-xs font-medium text-vesper-lightgray uppercase tracking-wider">
            <div className="w-12 text-center">#</div>
            <div className="flex-1">Título</div>
            <div className="w-24 hidden md:block">Duração</div>
          </div>

          {/* Tracks */}
          <div className="p-2">
            {DEMO_TRACKS.map((track, index) => (
              <TrackRow 
                key={track.id} 
                track={track} 
                index={index} 
                currentTrack={currentTrack} 
                isPlaying={isPlaying} 
                onPlayTrack={onPlayTrack} 
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
