import React, { useEffect, useState } from 'react';
import './Celebration.css';

const Celebration: React.FC = () => {
  const [flowers, setFlowers] = useState<{ id: number; left: string; size: string; delay: string; duration: string }[]>([]);

  useEffect(() => {
    // Generate random flowers/bouquets
    const newFlowers = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}vw`,
      size: `${Math.random() * 2 + 1}rem`, // 1rem to 3rem
      delay: `${Math.random() * 2}s`,
      duration: `${Math.random() * 3 + 4}s`, // 4s to 7s fall
    }));
    setFlowers(newFlowers);

    // Stop adding more after 5 seconds to let it settle
    const timer = setTimeout(() => {
      setFlowers([]);
    }, 6000);

    return () => clearTimeout(timer);
  }, []);

  if (flowers.length === 0) return null;

  return (
    <div className="celebration-container pointer-events-none">
      {flowers.map(f => (
        <div 
          key={f.id} 
          className="falling-flower"
          style={{
            left: f.left,
            fontSize: f.size,
            animationDelay: f.delay,
            animationDuration: f.duration
          }}
        >
          {/* Alternating between different flower emojis */}
          {f.id % 3 === 0 ? '🌸' : f.id % 3 === 1 ? '💐' : '🌹'}
        </div>
      ))}
    </div>
  );
};

export default Celebration;
