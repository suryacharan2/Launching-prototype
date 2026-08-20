import React from 'react';
import './MainSite.css';
import { Menu, Search } from 'lucide-react';

const MainSite: React.FC = () => {
  return (
    <div className="main-site-container">
      {/* Navigation */}
      <nav className="main-nav">
        <div className="nav-logo">NZTA</div>
        <div className="nav-links">
          <a href="#home" className="active">HOME</a>
          <a href="#about">ABOUT NZTA</a>
          <a href="#history">OUR HISTORY</a>
          <a href="#events">EVENTS</a>
          <a href="#community">TELUGU COMMUNITY</a>
          <a href="#gallery">GALLERY</a>
          <a href="#news">NEWS</a>
          <a href="#contact">CONTACT</a>
        </div>
        <div className="nav-actions">
          <Search size={20} className="action-icon" />
          <Menu size={24} className="action-icon mobile-menu" />
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero-section">
        <div className="hero-content">
          <h1>PRESERVING HERITAGE</h1>
          <h2>Embracing the Future</h2>
          <p>The official New Zealand Telugu Association bridging cultures and communities.</p>
          <button className="primary-btn">EXPLORE UPCOMING EVENTS</button>
        </div>
      </header>
      
      {/* Scrollable content would go here */}
      <section className="about-section" style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
        {/* Just a placeholder for scrolling */}
      </section>
    </div>
  );
};

export default MainSite;
