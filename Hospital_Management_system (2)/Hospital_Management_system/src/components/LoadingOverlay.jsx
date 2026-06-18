import React from 'react';
import './css_folder/loading_overlay.css';

const LoadingOverlay = () => {
  return (
    <div className="loading-overlay-container" id="loading-overlay">
      <div className="loading-overlay-card">
        <img 
          className="loading-gif" 
          src="https://i.pinimg.com/originals/da/50/09/da500959c4a72da8dd39ce88fc97208c.gif" 
          alt="Loading Animation" 
        />
        <div className="loading-text">Loading...</div>
      </div>
    </div>
  );
};

export default LoadingOverlay;
