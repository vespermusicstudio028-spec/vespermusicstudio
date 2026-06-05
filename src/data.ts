export interface Track {
  id: string;
  title: string;
  artist: string;
  duration: string;
  coverUrl: string;
  audioUrl?: string;
}

export const DEMO_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Música Demonstrativa 01',
    artist: 'Vesper Music Studio',
    duration: '2:45',
    coverUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=300&auto=format&fit=crop',
    audioUrl: '/audio1.mp3'
  },
  {
    id: '2',
    title: 'Música Demonstrativa 02',
    artist: 'Vesper Music Studio',
    duration: '3:12',
    coverUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=300&auto=format&fit=crop',
    audioUrl: '/audio2.mp3'
  },
  {
    id: '3',
    title: 'Música Demonstrativa 03',
    artist: 'Vesper Music Studio',
    duration: '1:58',
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=300&auto=format&fit=crop',
    audioUrl: '/audio3.mp3'
  }
];
