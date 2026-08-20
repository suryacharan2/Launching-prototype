import { useState } from 'react';
import Experience from './components/Experience/Experience';
import MainSite from './components/Website/MainSite';
import Celebration from './components/Reveal/Celebration';
import './App.css'; 

function App() {
  const [showWebsite, setShowWebsite] = useState(false);

  return (
    <>
      {!showWebsite && <Experience onComplete={() => setShowWebsite(true)} />}
      
      <div 
        style={{ 
          opacity: showWebsite ? 1 : 0, 
          pointerEvents: showWebsite ? 'auto' : 'none',
          transition: 'opacity 2s ease-in-out',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 10
        }}
      >
        <MainSite />
      </div>

      {showWebsite && <Celebration />}
    </>
  );
}

export default App;
