export interface Track {
  id: string;
  title: string;
  category: string;
  description: string;
  bpm: number;
  notes: string[];
  audioType: 'romantic' | 'energetic' | 'orchestral' | 'synthwave';
  tags: string[];
}

export interface Briefing {
  objective: string;
  mood: string;
  companyName: string;
  briefDetails: string;
}

export interface AIResponse {
  lyrics: string;
  slogans: string[];
  structure: string[];
  tips: string[];
}
