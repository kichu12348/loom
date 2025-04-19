import { useState } from "react";

function NeoCyberButton({ onClick, label, icon }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);
  
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={() => setIsActive(true)}
      onMouseUp={() => setIsActive(false)}
      style={{
        position: "relative",
        background: isActive 
          ? "rgba(131, 56, 236, 0.9)" 
          : isHovered 
            ? "rgba(23, 37, 84, 0.95)" 
            : "rgba(17, 25, 54, 0.6)",
        color: isHovered ? "#05d9e8" : "#d1d7e0",
        border: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        height: "28px",
        fontSize: "0.85rem",
        fontWeight: "600",
        padding: "0 12px",
        cursor: "pointer",
        transition: "all 0.2s ease",
        borderRadius: "2px",
        fontFamily: "'JetBrains Mono', monospace",
        overflow: "hidden",
        letterSpacing: "1px",
        WebkitAppRegion: "no-drag",
        boxShadow: isHovered ? "0 0 10px rgba(5, 217, 232, 0.3)" : "none",
      }}
    >
      {/* Button Content */}
      <span style={{ 
        fontSize: "0.9em", 
        display: "flex",
        alignItems: "center",
        position: "relative",
        zIndex: 2,
      }}>
        {icon}
      </span>
      <span style={{ 
        position: "relative",
        zIndex: 2,
      }}>
        {label}
      </span>
      
      {/* Hover Effect with Animation */}
      {isHovered && (
        <>
          <div style={{
            position: "absolute",
            left: 0,
            bottom: 0,
            width: "100%",
            height: "2px",
            background: "linear-gradient(90deg, transparent, #05d9e8, transparent)",
            animation: "neonScan 1.5s linear infinite",
          }} />
          
          <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "radial-gradient(circle at center, rgba(5, 217, 232, 0.1) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />
        </>
      )}
    </button>
  );
}

export default NeoCyberButton;