import { Window } from "@tauri-apps/api/window";
import NeoCyberButton from "./NeoCyberButton";
import WindowButton from "./WindowButton";

const appWindow = Window.getCurrent();

function TitleBar({ fileName, filePath, handleOpenFile, handleSaveFile, handleSaveFileAs }) {
  return (
    <div
      style={{
        WebkitAppRegion: "drag",
        background: "linear-gradient(90deg, rgba(18, 21, 31, 0.755) 0%, rgba(26, 26, 46, 0.777) 100%)",
        color: "#e0e0ff",
        display: "flex",
        alignItems: "center",
        height: 40,
        userSelect: "none",
        position: "relative",
        borderBottom: "1px solid #2a1758",
        padding: "0 10px",
        boxShadow: "0 0 15px rgba(62, 0, 128, 0.5)",
      }}
    >
      {/* Grid overlay for cyberpunk effect */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(131, 56, 236, 0.03) 2px, rgba(131, 56, 236, 0.03) 4px),
                            repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(131, 56, 236, 0.03) 2px, rgba(131, 56, 236, 0.03) 4px)`,
          pointerEvents: "none",
          zIndex: 1,
        }}
      />
      
      {/* Logo and App Name */}
      <div 
        style={{
          display: "flex", 
          alignItems: "center", 
          gap: "10px",
          zIndex: 2,
        }}
      >
        <span
          style={{
            fontWeight: 800,
            fontSize: "1.3rem",
            letterSpacing: "2px",
            color: "#ff2a6d",
            textShadow: "0 0 10px rgba(255, 42, 109, 0.7)",
            marginLeft: "8px",
            fontFamily: "'Orbitron', sans-serif",
          }}
        >
          LOOM
        </span>
        
        <div
          style={{
            width: "1px",
            height: "20px",
            background: "linear-gradient(to bottom, transparent, #05d9e8, transparent)",
            margin: "0 12px",
            opacity: 0.7,
          }}
        />
        
        <span
          style={{
            color: "#d1d7e0",
            fontSize: "0.92rem",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "40vw",
            fontFamily: "'JetBrains Mono', monospace",
            zIndex: 2,
          }}
        >
          <span style={{ color: "#05d9e8", fontWeight: 600 }}>{fileName}</span>
          {filePath && (
            <span style={{ color: "#a2f1e4", fontSize: "0.85em", marginLeft: "8px", opacity: 0.8 }}>
              @ {filePath}
            </span>
          )}
        </span>
      </div>
      
      {/* File Actions */}
      <div
        style={{
          marginLeft: "auto",
          display: "flex",
          gap: "6px",
          WebkitAppRegion: "no-drag",
          zIndex: 2,
        }}
      >
        <NeoCyberButton onClick={handleOpenFile} icon="📂" label="OPEN" />
        <NeoCyberButton onClick={handleSaveFile} icon="💾" label="SAVE" />
        <NeoCyberButton onClick={handleSaveFileAs} icon="📝" label="SAVE AS" />
      </div>
      
      {/* Window Controls */}
      <div
        style={{
          display: "flex",
          WebkitAppRegion: "no-drag",
          marginLeft: "16px",
          zIndex: 2,
        }}
      >
        <WindowButton onClick={() => appWindow.minimize()} title="Minimize">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 7H11" stroke="#05d9e8" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </WindowButton>
        
        <WindowButton onClick={() => appWindow.toggleMaximize()} title="Maximize">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="3" width="8" height="8" rx="1" stroke="#05d9e8" strokeWidth="1.5" fill="none" />
          </svg>
        </WindowButton>
        
        <WindowButton onClick={() => appWindow.close()} isClose title="Close">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 3L11 11M11 3L3 11" stroke="#ff2a6d" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </WindowButton>
      </div>
    </div>
  );
}

export default TitleBar;