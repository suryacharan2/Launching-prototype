import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import './GrandReveal.css';

const GrandReveal: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const visualsRef = useRef<HTMLDivElement>(null);

  // Using high-quality unsplash placeholders for cinematic effect
  const visuals = [
    'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?q=80&w=2000&auto=format&fit=crop', // Indian culture/dance
    'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?q=80&w=2000&auto=format&fit=crop', // New Zealand landscape
    'https://images.unsplash.com/photo-1511556820780-d912e42b4980?q=80&w=2000&auto=format&fit=crop'  // Celebration/Community
  ];

  useEffect(() => {
    const tl = gsap.timeline();

    // 1. Fade in the background/container
    tl.fromTo(containerRef.current, { opacity: 0 }, { opacity: 1, duration: 1 });

    // 2. Animate the text sequence
    if (textRef.current) {
      const texts = textRef.current.children;
      tl.fromTo(texts, 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.5, stagger: 0.5, ease: 'power3.out' }
      );

      // Fade out text to make way for visual montage
      tl.to(texts, { opacity: 0, y: -20, duration: 1, stagger: 0.2, delay: 2 });
    }

    // 3. Animate the visual montage (crossfading images)
    if (visualsRef.current) {
      const images = visualsRef.current.children;
      
      // Initially hide all images
      gsap.set(images, { opacity: 0, scale: 1.1 });

      // Crossfade sequence
      Array.from(images).forEach((img) => {
        tl.to(img, { opacity: 1, scale: 1, duration: 2, ease: 'power2.out' }, `-=0.5`)
          .to(img, { opacity: 0, duration: 1.5 }, `+=1.5`);
      });
    }

  }, []);

  return (
    <div className="reveal-container absolute-fill" ref={containerRef}>
      
      {/* Background ambient glow */}
      <div className="ambient-glow"></div>

      {/* Text Reveal Sequence */}
      <div className="reveal-text-wrapper" ref={textRef}>
        <h3 className="reveal-welcome">WELCOME TO</h3>
        <h1 className="reveal-logo-text">NZTA</h1>
        <h2 className="reveal-full-name">NEW ZEALAND TELUGU ASSOCIATION</h2>
        <p className="reveal-tagline">Connecting Telugu Hearts Across New Zealand</p>
      </div>

      {/* Cultural Visuals Montage */}
      <div className="reveal-visuals-wrapper" ref={visualsRef}>
        {visuals.map((src, index) => (
          <div 
            key={index} 
            className="reveal-visual" 
            style={{ backgroundImage: `url(${src})` }}
          />
        ))}
      </div>
      
    </div>
  );
};

export default GrandReveal;
