import { useState } from "react";

function WindowButton({ children, onClick, title, isClose }) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <button
      title={title}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: isHovered 
          ? isClose 
            ? "rgba(255, 42, 109, 0.15)" 
            : "rgba(5, 217, 232, 0.15)" 
          : "transparent",
        border: "none",
        width: "40px",
        height: "32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: "background 0.2s ease",
        WebkitAppRegion: "no-drag",
      }}
    >
      {children}
    </button>
  );
}

export default WindowButton;