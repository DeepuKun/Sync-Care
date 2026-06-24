import React, { useState, useEffect } from 'react';
import './css_folder/loading_overlay.css';

const LoadingOverlay = () => {
  const [showSlowMessage, setShowSlowMessage] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSlowMessage(true);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="loading-overlay-container" id="loading-overlay">
      <div className="loading-overlay-card">
        <img 
          className="loading-gif" 
          src="https://i.pinimg.com/originals/da/50/09/da500959c4a72da8dd39ce88fc97208c.gif" 
          alt="Loading Animation" 
        />
        <div className="loading-text">Loading...</div>
        {showSlowMessage && (
          <div className="loading-subtext">
            Connecting to the backend server. Since the server spins down when idle, the first connection may take up to a minute to wake up. Thank you for your patience!
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingOverlay;
