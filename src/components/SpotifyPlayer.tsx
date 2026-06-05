import { Play, Pause, SkipBack, SkipForward, Volume2, Maximize2, Repeat, Shuffle, Music } from 'lucide-react';
import { Track } from '../data';
import { useRef, useEffect, useState } from 'react';

interface PlayerProps {
  currentTrack: Track | null;
  isPlaying: boolean;
  togglePlay: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
}

export default function SpotifyPlayer({ currentTrack, isPlaying, togglePlay, nextTrack, prevTrack }: PlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [currentTrack]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Audio playback prevented:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    nextTrack();
  };
  
  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current && duration) {
      const rect = e.currentTarget.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      audioRef.current.currentTime = pos * duration;
    }
  };

  const handleVolumeChange = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const newVol = Math.max(0, Math.min(1, pos));
    setVolume(newVol);
  };

  if (!currentTrack) return null;

  const progressPercentage = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 h-24 bg-vesper-darker border-t border-vesper-gray flex items-center justify-between px-4 z-50">
      <audio 
        ref={audioRef} 
        src={currentTrack.audioUrl} 
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />
      {/* Track Info */}
      <div className="flex items-center w-1/4 min-w-[180px]">
        {imgError ? (
          <div className="w-14 h-14 rounded bg-gradient-to-br from-vesper-blue to-vesper-red flex items-center justify-center mr-4 shrink-0 shadow-md">
            <Music size={20} className="text-white animate-pulse" />
          </div>
        ) : (
          <img 
            src={currentTrack.coverUrl} 
            alt={currentTrack.title} 
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-14 h-14 rounded object-cover mr-4 shrink-0"
          />
        )}
        <div className="flex flex-col">
          <span className="text-white text-sm font-medium hover:underline cursor-pointer line-clamp-1">{currentTrack.title}</span>
          <span className="text-vesper-lightgray text-xs hover:underline cursor-pointer">{currentTrack.artist}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center justify-center w-2/4 max-w-[722px]">
        <div className="flex items-center gap-6 mb-2">
          <button className="text-vesper-lightgray hover:text-white transition"><Shuffle size={18} /></button>
          <button onClick={prevTrack} className="text-vesper-lightgray hover:text-white transition"><SkipBack size={20} /></button>
          <button 
            onClick={togglePlay}
            className="w-8 h-8 flex items-center justify-center bg-white text-black rounded-full hover:scale-105 transition"
          >
            {isPlaying ? <Pause size={16} className="fill-black" /> : <Play size={16} className="fill-black ml-0.5" />}
          </button>
          <button onClick={nextTrack} className="text-vesper-lightgray hover:text-white transition"><SkipForward size={20} /></button>
          <button className="text-vesper-lightgray hover:text-white transition"><Repeat size={18} /></button>
        </div>
        <div className="flex items-center gap-2 w-full text-xs text-vesper-lightgray">
          <span>{formatTime(currentTime)}</span>
          <div className="h-1 bg-vesper-gray rounded-full flex-1 relative group cursor-pointer" onClick={handleSeek}>
            <div className="absolute top-0 left-0 h-full bg-vesper-red rounded-full group-hover:bg-vesper-blue transition-colors" style={{ width: `${progressPercentage}%` }}></div>
          </div>
          <span>{duration ? formatTime(duration) : currentTrack.duration}</span>
        </div>
      </div>

      {/* Volume */}
      <div className="flex items-center justify-end w-1/4 gap-4 min-w-[180px] text-vesper-lightgray">
        <Volume2 size={20} className="hover:text-white transition cursor-pointer" onClick={() => setVolume(volume === 0 ? 0.8 : 0)} />
        <div className="w-24 h-1 bg-vesper-gray rounded-full relative group cursor-pointer" onClick={handleVolumeChange}>
          <div className="absolute top-0 left-0 h-full bg-white rounded-full group-hover:bg-vesper-blue transition-colors" style={{ width: `${volume * 100}%` }}></div>
        </div>
        <Maximize2 size={18} className="hover:text-white transition cursor-pointer ml-2" />
      </div>
    </div>
  );
}
