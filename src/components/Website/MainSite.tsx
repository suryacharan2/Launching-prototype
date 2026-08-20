import React from 'react';
import './MainSite.css';
import logo from '../../assets/logo.png';

const MainSite: React.FC = () => {
  return (
    <div className="main-site-container logo-only-container">
      <div className="logo-display-wrapper">
        <img src={logo} alt="NZTA Logo" className="final-logo" />
      </div>
    </div>
  );
};

export default MainSite;
