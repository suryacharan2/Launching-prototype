import React from 'react';
import './MainSite.css';
import { Search, Menu, X } from 'lucide-react';

const MainSite: React.FC = () => {
  return (
    <div className="main-site-container">
      {/*
        CSS-only mobile drawer: the hidden checkbox drives the open/close
        state via sibling selectors, so no JS state needed.
      */}
      <input type="checkbox" id="nav-toggle" className="nav-toggle-checkbox" />

      {/* Navigation */}
      <nav className="main-nav">
        <div className="nav-logo">NZTA</div>

        {/* Desktop links */}
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
          {/* Hamburger label — visible only on mobile via CSS */}
          <label htmlFor="nav-toggle" className="nav-toggle-label" aria-label="Open navigation menu">
            <Menu size={24} />
          </label>
        </div>
      </nav>

      {/* Mobile Drawer (sibling of the checkbox so CSS can target it) */}
      <div className="mobile-drawer" role="dialog" aria-label="Navigation menu">
        {/* Close button inside the drawer */}
        <label htmlFor="nav-toggle" className="mobile-drawer-close" aria-label="Close navigation menu">
          <X size={22} />
        </label>

        <a href="#home" className="active">HOME</a>
        <a href="#about">ABOUT NZTA</a>
        <a href="#history">OUR HISTORY</a>
        <a href="#events">EVENTS</a>
        <a href="#community">TELUGU COMMUNITY</a>
        <a href="#gallery">GALLERY</a>
        <a href="#news">NEWS</a>
        <a href="#contact">CONTACT</a>
      </div>

      {/* Semi-transparent backdrop — clicking it closes the drawer */}
      <label htmlFor="nav-toggle" className="drawer-backdrop" aria-hidden="true" />

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
