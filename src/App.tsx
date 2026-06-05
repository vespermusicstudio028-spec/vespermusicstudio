import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Portfolio from './components/Portfolio';
import Plans from './components/Plans';
import Testimonials from './components/Testimonials';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import SpotifyPlayer from './components/SpotifyPlayer';
import { Track, DEMO_TRACKS } from './data';

export default function App() {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayTrack = (track: Track) => {
    if (currentTrack?.id === track.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
    }
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    if (!currentTrack) return;
    const currentIndex = DEMO_TRACKS.findIndex(t => t.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % DEMO_TRACKS.length;
    setCurrentTrack(DEMO_TRACKS[nextIndex]);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    if (!currentTrack) return;
    const currentIndex = DEMO_TRACKS.findIndex(t => t.id === currentTrack.id);
    const prevIndex = currentIndex === 0 ? DEMO_TRACKS.length - 1 : currentIndex - 1;
    setCurrentTrack(DEMO_TRACKS[prevIndex]);
    setIsPlaying(true);
  };

  return (
    <div className="relative pb-0 md:pb-0">
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Portfolio 
          currentTrack={currentTrack} 
          isPlaying={isPlaying} 
          onPlayTrack={handlePlayTrack} 
        />
        <Plans />
        <Testimonials />
        <About />
        <Contact />
      </main>
      <Footer />
      <FloatingWhatsApp />
      
      {currentTrack && (
        <SpotifyPlayer 
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          togglePlay={togglePlay}
          nextTrack={nextTrack}
          prevTrack={prevTrack}
        />
      )}
    </div>
  );
}
