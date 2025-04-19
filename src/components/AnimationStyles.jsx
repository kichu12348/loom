// Add global styles for cyberpunk animations
const AnimationStyles = () => {
  const styleElement = document.createElement("style");
  styleElement.innerHTML = `
    @keyframes neonScan {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
    
    @keyframes pulse {
      0% { opacity: 0.6; }
      50% { opacity: 1; }
      100% { opacity: 0.6; }
    }
  `;
  document.head.appendChild(styleElement);
  
  return null;
};

export default AnimationStyles;