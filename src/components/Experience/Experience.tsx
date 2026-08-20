import React, { useState, useEffect, useRef } from 'react';
import Scene from './Scene';
import Overlays from './Overlays';
import TimelineMap from '../TimelineMap/TimelineMap';
import './Experience.css';

interface ExperienceProps {
  onComplete: () => void;
}

export type ScenePhase = 
  | 'PRE_LAUNCH'
  | 'ZOOM_INDIA' 
  | 'FLIGHT' 
  | 'ARRIVE_NZ'
  | 'DRAW_MAP'
  | 'ZOOM_NZ_DEEP'
  | 'COMPLETE';

const Experience: React.FC<ExperienceProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<ScenePhase>('PRE_LAUNCH');
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioCtxRef = useRef<AudioContext | any>(null);

  const handleBeginJourney = () => {
    // Start Soundtrack Audio
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
      audioRef.current.play().catch(e => console.log('Audio play blocked:', e));
    }
    
    // Initialize a native Web Audio Context on this user gesture.
    // This is 100% immune to network/format issues!
    if (!audioCtxRef.current) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        audioCtxRef.current = new AudioContextClass();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }

    setPhase('ZOOM_INDIA');
    
    // Sequence Timers
    setTimeout(() => setPhase('FLIGHT'), 3000); // 3s zoom
    setTimeout(() => setPhase('ARRIVE_NZ'), 10000); // 7s flight
    setTimeout(() => setPhase('DRAW_MAP'), 12000); // 2s pause at NZ before drawing
    setTimeout(() => setPhase('ZOOM_NZ_DEEP'), 20000); // 8s to draw map
    setTimeout(() => {
      
      // Synthesize a satisfying "POP" sound natively
      if (audioCtxRef.current) {
        try {
          const ctx = audioCtxRef.current;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          
          osc.type = 'sine';
          // Rapidly sweep frequency down for a pop/blast sound
          osc.frequency.setValueAtTime(800, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.1);
          
          // Quick volume envelope
          gain.gain.setValueAtTime(1, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
          
          osc.start(ctx.currentTime);
          osc.stop(ctx.currentTime + 0.1);
        } catch(e) {
          console.log('Pop synthesis failed', e);
        }
      }

      setPhase('COMPLETE');
      onComplete();
    }, 23000); // 3s for final deep zoom, then complete
  };

  const handleSkip = () => {
    setPhase('COMPLETE');
    onComplete();
  };

  return (
    <div className="experience-container">
      {/* Cinematic Soundtrack */}
      <audio 
        ref={audioRef} 
        src="https://cdn.pixabay.com/audio/2022/11/22/audio_febc508520.mp3" 
        preload="auto"
      />

      <div 
        className="canvas-container" 
        style={{ 
          opacity: phase !== 'COMPLETE' ? 1 : 0,
          transition: 'opacity 2s ease'
        }}
      >
        {phase !== 'COMPLETE' && (
          <Scene phase={phase} />
        )}
      </div>

      <Overlays phase={phase} onBeginJourney={handleBeginJourney} onSkip={handleSkip} />

      {/* Render 2D map overlay dynamically when drawing */}
      {(phase === 'DRAW_MAP' || phase === 'ZOOM_NZ_DEEP') && <TimelineMap phase={phase} />}
    </div>
  );
};

export default Experience;
