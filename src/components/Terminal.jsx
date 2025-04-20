import { audioDir } from "@tauri-apps/api/path";
import { useState, useRef, useEffect } from "react";
import { FaTerminal } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
// Removed: import { Command } from '@tauri-apps/plugin-shell'; // No longer needed

export default function Terminal({ show, onResize, onClose }) {
  const [height, setHeight] = useState(200);
  const [isDragging, setIsDragging] = useState(false);
  // Removed state related to commands, history, output, processing, currentDir

  const outputRef = useRef(null);
  const minHeight = 100;
  const maxHeight = 500;
  const dragHandleRef = useRef(null);

  // Removed useEffect for getting current directory

  // Auto-scroll to bottom (might still be useful if we add static messages)
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, []); // Update if content changes, though it won't dynamically now

  // Removed useEffect for focusing input, as it's disabled

  // Handle resize drag (Keep this functionality)
  useEffect(() => {
    function handleMouseMove(e) {
      if (!isDragging) return;

      const newHeight = Math.min(
        Math.max(height - e.movementY, minHeight),
        maxHeight
      );

      setHeight(newHeight);
      if (onResize) onResize(newHeight);
    }

    function handleMouseUp() {
      setIsDragging(false);
    }

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, height, onResize]);

  // Removed executeCommandInternal and executeCommand functions
  // Removed handleKeyDown function

  // Conditional rendering for collapsed state
  if (!show) return null;

  return (
    <div
      style={{
        height: `${height}px`,
        maxHeight: `${maxHeight}px`,
        minHeight: `${minHeight}px`,
        background: "rgba(10,0,24,0.9)",
        color: "#00fff7",
        borderTop: "1.5px solid #00fff76c",
        boxShadow: "inset 0 5px 16px #00fff722",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        transition: "height 0.2s ease-out",
        position: "relative",
        backdropFilter: "blur(2px)",
      }}
    >
      <div
        ref={dragHandleRef}
        style={{
          height: "6px",
          background: "transparent",
          cursor: "ns-resize",
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
        }}
        onMouseDown={() => setIsDragging(true)}
      />

      <div
        style={{
          padding: "8px 12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1.5px solid #00fff76c",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <FaTerminal size={14} style={{ marginRight: 8 }} />
          <span
            style={{ fontSize: 13, fontFamily: "'JetBrains Mono', monospace" }}
          >
            Terminal
          </span>
        </div>
        <div
          onClick={onClose}
          style={{ cursor: "pointer", opacity: 0.8 }}
          onMouseOver={(e) => (e.currentTarget.style.opacity = 1)}
          onMouseOut={(e) => (e.currentTarget.style.opacity = 0.8)}
        >
          <IoClose
            size={18}
            style={{
              filter: "drop-shadow(0 0 2px #00fff7)",
            }}
          />
        </div>
      </div>

      <div
        ref={outputRef}
        style={{
          flex: 1,
          background: "rgba(10,0,24,0.9)",
          padding: "8px 12px",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 14,
          overflow: "auto",
          color: "#e0e0ff",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          // scrollbar styles
          scrollbarWidth: "thin",
          scrollbarColor: "#00fff7",
        }}
      >
        {/* Display configuration error message */}
        <div
          style={{
            marginBottom: 4,
            color: "#ff2a6d",
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          Shell execution is disabled by Tauri configuration (shell scope).
        </div>
        <div
          style={{
            color: "#e0e0ff",
            opacity: 0.7,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12,
          }}
        >
          To enable terminal functionality, adjust the `plugins.shell.scope` in
          your `tauri.conf.json`.
        </div>

        {/* Keep input area visually, but disable it */}
        <div style={{ display: "flex", marginTop: 8, opacity: 0.5 }}>
          <span style={{ color: "#00fff7" }}>loom:</span>
          <span style={{ color: "#ff2a6d" }}> ~</span>{" "}
          {/* Placeholder directory */}
          <span style={{ color: "#00fff7" }}> $ </span>
          <div style={{ flex: 1, position: "relative" }}>
            <input
              type="text"
              style={{
                background: "transparent",
                border: "none",
                color: "#e0e0ff",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 14,
                outline: "none",
                width: "100%",
                cursor: "not-allowed", // Indicate disabled state
              }}
              disabled // Disable the input field
              placeholder="Shell execution disabled"
            />
          </div>
        </div>
      </div>

      {/* Removed style tag for pulse animation */}
    </div>
  );
}
