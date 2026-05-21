import { useState, useRef, useEffect } from 'react';

export function useSynthesizer() {
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const [volume, setVolume] = useState<number>(35); // percentage 0-100
  const [filterCutoff, setFilterCutoff] = useState<number>(1200); // Hz
  const [tempoSpeed, setTempoSpeed] = useState<number>(100); // percentage 50-150
  const [waveformOverride, setWaveformOverride] = useState<string>('default'); // 'default' | 'sine' | 'triangle' | 'sawtooth' | 'square'

  const audioCtxRef = useRef<AudioContext | null>(null);
  const activeNodesRef = useRef<AudioNode[]>([]);
  const timerRef = useRef<any>(null);

  // Refs to allow interval loops and active nodes to read current values instantly
  const volumeRef = useRef<number>(35);
  const filterCutoffRef = useRef<number>(1200);
  const tempoSpeedRef = useRef<number>(100);
  const waveformOverrideRef = useRef<string>('default');
  const masterGainRef = useRef<GainNode | null>(null);
  const currentTrackIdRef = useRef<string | null>(null);
  const currentAudioTypeRef = useRef<'romantic' | 'energetic' | 'orchestral' | 'synthwave' | null>(null);

  // Synchronize state to refs
  useEffect(() => {
    volumeRef.current = volume;
    if (masterGainRef.current && audioCtxRef.current) {
      // Map volume dynamically in real time
      const targetGain = (volume / 100) * 0.45;
      masterGainRef.current.gain.setValueAtTime(targetGain, audioCtxRef.current.currentTime);
    }
  }, [volume]);

  useEffect(() => {
    filterCutoffRef.current = filterCutoff;
  }, [filterCutoff]);

  useEffect(() => {
    waveformOverrideRef.current = waveformOverride;
  }, [waveformOverride]);

  // Handle tempo changes in real time by restarting the scheduler loop
  useEffect(() => {
    tempoSpeedRef.current = tempoSpeed;
    if (isPlaying && currentTrackIdRef.current && currentAudioTypeRef.current) {
      // Restart the schedule looping with the new tempo
      restartInterval(currentAudioTypeRef.current);
    }
  }, [tempoSpeed]);

  const initAudioCtx = () => {
    if (!audioCtxRef.current) {
      // @ts-ignore
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      audioCtxRef.current = new AudioCtx();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  const stop = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    activeNodesRef.current.forEach((node) => {
      try {
        // @ts-ignore
        node.stop();
      } catch (e) {}
    });
    activeNodesRef.current = [];
    setIsPlaying(null);
    currentTrackIdRef.current = null;
    currentAudioTypeRef.current = null;
    masterGainRef.current = null;
  };

  const restartInterval = (audioType: 'romantic' | 'energetic' | 'orchestral' | 'synthwave') => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    // Speeds map to interval intervals inverse proportionally
    const speedFactor = tempoSpeedRef.current / 100;

    if (audioType === 'romantic') {
      let noteIndex = 0;
      let chords = [
        [261.63, 311.13, 392.00, 466.16], // Cm7
        [233.08, 293.66, 349.23, 415.30], // Bb7
        [207.65, 261.63, 311.13, 392.00], // Abmaj7
        [196.00, 246.94, 293.66, 349.23], // G7
      ];
      let chordIndex = 0;

      const scheduleNextNote = () => {
        const time = ctx.currentTime;
        const currentChord = chords[chordIndex];
        const freq = currentChord[noteIndex % currentChord.length];

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // Waveform override or default triangle
        const preferredWave = waveformOverrideRef.current === 'default' ? 'triangle' : waveformOverrideRef.current;
        osc.type = preferredWave as OscillatorType;
        osc.frequency.setValueAtTime(freq, time);

        // Filter sweeps can also apply in romantic if user turns down slider
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(filterCutoffRef.current, time);

        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(0.20, time + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.9);

        osc.connect(filter);
        filter.connect(gain);
        if (masterGainRef.current) {
          gain.connect(masterGainRef.current);
        }

        osc.start(time);
        osc.stop(time + 0.9);
        activeNodesRef.current.push(osc);

        noteIndex++;
        if (noteIndex % 8 === 0) {
          chordIndex = (chordIndex + 1) % chords.length;
        }
      };

      scheduleNextNote();
      timerRef.current = setInterval(scheduleNextNote, Math.max(100, 220 / speedFactor));

    } else if (audioType === 'energetic') {
      const majorArp = [146.83, 220.00, 293.66, 369.99, 440.00, 587.33, 739.99]; // D Major arp
      let index = 0;

      const scheduleBeat = () => {
        const time = ctx.currentTime;
        const freq = majorArp[index % majorArp.length];

        const osc = ctx.createOscillator();
        const subOsc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        const preferredWave = waveformOverrideRef.current === 'default' ? 'sawtooth' : waveformOverrideRef.current;
        osc.type = preferredWave as OscillatorType;
        osc.frequency.setValueAtTime(freq, time);

        subOsc.type = 'square';
        subOsc.frequency.setValueAtTime(freq / 2, time);

        filter.type = 'lowpass';
        // Connect to filter frequency live slider
        filter.frequency.setValueAtTime(filterCutoffRef.current, time);
        filter.frequency.exponentialRampToValueAtTime(Math.max(150, filterCutoffRef.current / 4), time + 0.18);

        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(0.15, time + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.22);

        osc.connect(filter);
        subOsc.connect(filter);
        filter.connect(gain);
        if (masterGainRef.current) {
          gain.connect(masterGainRef.current);
        }

        osc.start(time);
        subOsc.start(time);
        osc.stop(time + 0.25);
        subOsc.stop(time + 0.25);

        activeNodesRef.current.push(osc, subOsc);
        index = (index + 1) % majorArp.length;
      };

      scheduleBeat();
      timerRef.current = setInterval(scheduleBeat, Math.max(80, 160 / speedFactor));

    } else if (audioType === 'orchestral') {
      const chordNotes = [
        [130.81, 196.00, 329.63, 392.00, 523.25], // C Major
        [146.83, 220.00, 349.23, 440.00, 587.33], // D minor
        [164.81, 246.94, 392.00, 493.88, 659.25], // E minor
        [174.61, 261.63, 349.23, 523.25, 698.46], // F Major
      ];
      let chordIndex = 0;

      const scheduleSwells = () => {
        const time = ctx.currentTime;
        const notes = chordNotes[chordIndex];

        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          const gain = ctx.createGain();
          const filter = ctx.createBiquadFilter();

          const preferredWave = waveformOverrideRef.current === 'default' ? 'sine' : waveformOverrideRef.current;
          osc.type = preferredWave as OscillatorType;
          osc.frequency.setValueAtTime(freq, time);

          osc2.type = 'triangle';
          osc2.frequency.setValueAtTime(freq + 1.8, time); // detuned spread

          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(filterCutoffRef.current, time);

          gain.gain.setValueAtTime(0, time);
          gain.gain.linearRampToValueAtTime(0.045, time + 1.2);
          gain.gain.setValueAtTime(0.045, time + 2.2);
          gain.gain.exponentialRampToValueAtTime(0.001, time + 3.8);

          osc.connect(filter);
          osc2.connect(filter);
          filter.connect(gain);
          if (masterGainRef.current) {
            gain.connect(masterGainRef.current);
          }

          osc.start(time);
          osc2.start(time);
          osc.stop(time + 4.0);
          osc2.stop(time + 4.0);

          activeNodesRef.current.push(osc, osc2);
        });

        chordIndex = (chordIndex + 1) % chordNotes.length;
      };

      scheduleSwells();
      timerRef.current = setInterval(scheduleSwells, Math.max(1000, 3500 / speedFactor));

    } else if (audioType === 'synthwave') {
      const bassNotes = [110.00, 110.00, 98.00, 98.00, 87.31, 87.31, 73.42, 87.31];
      let step = 0;

      const scheduleSynthwave = () => {
        const time = ctx.currentTime;
        const baseFreq = bassNotes[(Math.floor(step / 4)) % bassNotes.length];
        
        const osc = ctx.createOscillator();
        const sub = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();

        const multipliers = [1.0, 1.2, 1.5, 1.8];
        const mult = multipliers[step % 4];
        const leadFreq = baseFreq * 2 * mult;

        const preferredWave = waveformOverrideRef.current === 'default' ? 'sawtooth' : waveformOverrideRef.current;
        osc.type = preferredWave as OscillatorType;
        osc.frequency.setValueAtTime(leadFreq, time);

        sub.type = 'square';
        sub.frequency.setValueAtTime(baseFreq, time);

        filter.type = 'lowpass';
        // Custom interactive high definition sweeps
        filter.frequency.setValueAtTime(filterCutoffRef.current, time);

        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(0.10, time + 0.02);
        gain.gain.linearRampToValueAtTime(0.04, time + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.15);

        osc.connect(filter);
        sub.connect(filter);
        filter.connect(gain);
        if (masterGainRef.current) {
          gain.connect(masterGainRef.current);
        }

        osc.start(time);
        sub.start(time);
        osc.stop(time + 0.16);
        sub.stop(time + 0.16);

        activeNodesRef.current.push(osc, sub);
        step = (step + 1) % 16;
      };

      scheduleSynthwave();
      timerRef.current = setInterval(scheduleSynthwave, Math.max(80, 170 / speedFactor));
    }
  };

  const playTrack = (trackId: string, audioType: 'romantic' | 'energetic' | 'orchestral' | 'synthwave') => {
    initAudioCtx();
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    stop();
    setIsPlaying(trackId);
    currentTrackIdRef.current = trackId;
    currentAudioTypeRef.current = audioType;

    const masterGainNode = ctx.createGain();
    const initialGain = (volumeRef.current / 100) * 0.45;
    masterGainNode.gain.setValueAtTime(initialGain, ctx.currentTime);
    masterGainNode.connect(ctx.destination);
    
    masterGainRef.current = masterGainNode;
    activeNodesRef.current.push(masterGainNode);

    restartInterval(audioType);
  };

  useEffect(() => {
    return () => {
      stop();
    };
  }, []);

  return {
    isPlaying,
    playTrack,
    stop,
    // Real-time Controls
    volume,
    setVolume,
    filterCutoff,
    setFilterCutoff,
    tempoSpeed,
    setTempoSpeed,
    waveformOverride,
    setWaveformOverride
  };
}
