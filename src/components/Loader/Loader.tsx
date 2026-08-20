import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import './Loader.css';

interface LoaderProps {
  onComplete: () => void;
}

const Loader: React.FC<LoaderProps> = ({ onComplete }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => setIsLoaded(true)
    });

    // 1. Animate SVG Path Drawing (Map Outline)
    if (pathRef.current) {
      const length = pathRef.current.getTotalLength();
      gsap.set(pathRef.current, { strokeDasharray: length, strokeDashoffset: length });
      
      tl.to(pathRef.current, {
        strokeDashoffset: 0,
        duration: 4,
        ease: 'power2.inOut',
      });
    }

    // 2. Fade in the Launch Button
    if (buttonRef.current) {
      tl.fromTo(buttonRef.current, 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, ease: 'power2.out' },
        '-=1' // Start fading in the button slightly before the map finishes drawing
      );
    }
  }, []);

  const handleLaunch = () => {
    // Fade out the entire loader
    gsap.to(containerRef.current, {
      opacity: 0,
      duration: 1,
      ease: 'power2.inOut',
      onComplete: onComplete
    });
  };

  return (
    <div className="loader-container absolute-fill" ref={containerRef}>
      
      <div className="loader-map-wrapper">
        <svg viewBox="0 0 500 800" className="loader-nz-map">
          {/* Stylized outline of New Zealand */}
          <path 
            ref={pathRef}
            d="M 250 100 C 300 150, 320 200, 310 250 C 290 300, 260 350, 220 370 C 200 380, 180 390, 160 380 C 140 370, 150 350, 180 320 C 200 300, 220 280, 230 250 C 240 220, 240 180, 230 150 C 220 120, 230 100, 250 100 Z 
               M 150 400 C 200 450, 220 500, 210 550 C 200 600, 180 650, 150 700 C 120 750, 100 780, 80 750 C 60 720, 80 680, 100 650 C 120 620, 140 580, 130 550 C 120 520, 110 480, 120 450 C 130 420, 140 410, 150 400 Z" 
            fill="none" 
            stroke="#d4af37" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            filter="drop-shadow(0px 0px 10px rgba(212, 175, 55, 0.8))"
          />
        </svg>
      </div>

      <div className="loader-content">
        <button 
          ref={buttonRef} 
          className={`launch-btn ${isLoaded ? 'active' : ''}`}
          onClick={handleLaunch}
          style={{ opacity: 0 }} // Initially hidden
        >
          LAUNCH
        </button>
      </div>

    </div>
  );
};

export default Loader;
