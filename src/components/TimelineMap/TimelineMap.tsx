import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import './TimelineMap.css';
import type { ScenePhase } from '../Experience/Experience';

interface TimelineMapProps {
  phase?: ScenePhase;
}

const TimelineMap: React.FC<TimelineMapProps> = ({ phase: _phase }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [year, setYear] = useState(1998);

  useEffect(() => {
    // 1. Fade in the container
    gsap.fromTo(containerRef.current, 
      { opacity: 0 }, 
      { opacity: 1, duration: 1, ease: 'power2.inOut' }
    );

    // 2. Animate Year Counter from 1998 to 2026 over 8 seconds
    const obj = { y: 1998 };
    gsap.to(obj, {
      y: 2026,
      duration: 8,
      ease: 'none',
      onUpdate: () => {
        setYear(Math.floor(obj.y));
      }
    });

  }, []);

  return (
    <div className="timeline-map-container transparent-overlay" ref={containerRef}>
      
      {/* Dynamic Year Counter */}
      <div className="year-counter">
        {year}
      </div>

    </div>
  );
};

export default TimelineMap;
