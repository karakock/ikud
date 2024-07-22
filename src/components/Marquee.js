import React from 'react';
import '../styles/Marquee.css';

const Marquee = ({ text, scrollAmount }) => {
  const marqueeStyle = {
    animationDuration: `${scrollAmount}s`,
  };

  return (
    <div className="marquee-container">
      <div className="marquee-content" style={marqueeStyle}>
        {text}
      </div>
    </div>
  );
};

export default Marquee;
