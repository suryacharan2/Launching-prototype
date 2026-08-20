import React, { useState, useEffect } from 'react';
import './MainSite.css';
import logo from '../../assets/logo.png';

const MainSite: React.FC = () => {
  const fullText = "A Home for Telugu Hearts in New\u00A0Zealand.";
  const [displayedText, setDisplayedText] = useState("");
  
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(fullText.substring(0, i + 1));
      i++;
      if (i >= fullText.length) {
        clearInterval(interval);
      }
    }, 100); // 100ms per character typing speed
    
    return () => clearInterval(interval);
  }, []);

  // Helper to color the word "Telugu" if it's currently in the typed text
  const renderText = () => {
    if (displayedText.includes("Telugu")) {
      const parts = displayedText.split("Telugu");
      return (
        <>
          {parts[0]}
          <span className="highlight-text">Telugu</span>
          {parts[1]}
        </>
      );
    } else if (displayedText.includes("Telug")) {
       const parts = displayedText.split("Telug");
       return <>{parts[0]}<span className="highlight-text">Telug</span>{parts[1]}</>;
    } else if (displayedText.includes("Telu")) {
       const parts = displayedText.split("Telu");
       return <>{parts[0]}<span className="highlight-text">Telu</span>{parts[1]}</>;
    } else if (displayedText.includes("Tel")) {
       const parts = displayedText.split("Tel");
       return <>{parts[0]}<span className="highlight-text">Tel</span>{parts[1]}</>;
    } else if (displayedText.includes("Te")) {
       const parts = displayedText.split("Te");
       return <>{parts[0]}<span className="highlight-text">Te</span>{parts[1]}</>;
    } else if (displayedText.includes("T") && fullText.substring(0, displayedText.length).endsWith("T")) {
       const parts = displayedText.split("T");
       return <>{parts[0]}<span className="highlight-text">T</span>{parts[1]}</>;
    }
    
    return displayedText;
  };

  return (
    <div className="main-site-container logo-only-container">
      <div className="content-wrapper">
        <div className="logo-display-wrapper">
          <img src={logo} alt="NZTA Logo" className="final-logo" />
        </div>
        <div className="text-display-wrapper">
          <h1 className="typewriter-text">
            {renderText()}
          </h1>
        </div>
      </div>
    </div>
  );
};

export default MainSite;
