import React from 'react';
import type { ScenePhase } from './Experience';
import './Overlays.css';

interface OverlaysProps {
  phase: ScenePhase;
  onBeginJourney: () => void;
  onSkip: () => void;
}

const Overlays: React.FC<OverlaysProps> = ({ phase, onBeginJourney, onSkip: _onSkip }) => {
  return (
    <div className="overlays-container">
      
      {/* Opening Screen - ONLY the launch button */}
      <div 
        className="opening-screen flex-center flex-col absolute-fill"
        style={{ 
          opacity: phase === 'PRE_LAUNCH' ? 1 : 0,
          pointerEvents: phase === 'PRE_LAUNCH' ? 'auto' : 'none',
          transition: 'opacity 1s ease'
        }}
      >
        <button 
          className="begin-btn" 
          onClick={onBeginJourney}
          style={{
            fontSize: '2rem',
            padding: '20px 60px',
            background: 'transparent',
            border: '2px solid var(--color-accent-gold)',
            color: 'var(--color-accent-gold)',
            boxShadow: '0 0 20px rgba(212, 175, 55, 0.4)'
          }}
        >
          LAUNCH
        </button>
      </div>

    </div>
  );
};

export default Overlays;
