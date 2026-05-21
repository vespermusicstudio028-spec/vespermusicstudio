export interface Track {
  id: string;
  title: string;
  titleColor?: string;
  category: string;
  categoryColor?: string;
  description: string;
  bpm: number;
  bpmColor?: string;
  notes: string[];
  audioType: 'romantic' | 'energetic' | 'orchestral' | 'synthwave';
  tags: string[];
  waveColor?: string;
  audioUrl?: string;
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
