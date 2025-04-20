import { Window } from "@tauri-apps/api/window";
import { useState, useRef, useEffect, act } from "react";
import WindowButton from "./WindowButton";
import loom from "../assets/loom.svg";

const appWindow = Window.getCurrent();

function MenuBar({ handleOpenFile, handleSaveFile, handleSaveFileAs,handleOpenDir }) {
  const [activeMenu, setActiveMenu] = useState(null);
  const menuRef = useRef(null);

  // Close the dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenu(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const menuItems = [
    {
      name: "File",
      options: [
        { label: "Open", action: handleOpenFile },
        { label: "Save", action: handleSaveFile },
        { label: "Save As", action: handleSaveFileAs },
        { label: "Close", action: () => appWindow.close() },
        {label: "Open Folder",action: handleOpenDir},
      ]
    },
    { name: "Edit", options: [] },
    { name: "Selection", options: [] },
    { name: "View", options: [] },
    { name: "Terminal", options: [] }
  ];

  return (
    <nav
      ref={menuRef}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 24,
        height: 40,
        marginLeft: 16,
        zIndex: 2,
        position: "relative",
      }}
    >
      {menuItems.map((item) => (
        <div key={item.name} style={{ position: "relative" }}>
          <span
            style={{
              color: "#00fff7",
              fontWeight: 600,
              fontSize: 10,
              letterSpacing: 1,
              padding: "10px 8px",
              cursor: "pointer",
              borderRadius: 2,
              transition: "background 0.15s, color 0.15s",
              userSelect: "none",
              lineHeight: "40px",
              background: activeMenu === item.name ? "#181c2f" : "transparent",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "#181c2f";
            }}
            onMouseOut={(e) => {
              if (activeMenu !== item.name) {
                e.currentTarget.style.background = "transparent";
              }
            }}
            onClick={() => {
              setActiveMenu(activeMenu === item.name ? null : item.name);
            }}
          >
            {item.name}
          </span>
          
          {/* Dropdown menu */}
          {activeMenu === item.name && item.options.length > 0 && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                background: "#181c2f",
                borderRadius: 4,
                boxShadow: "0 5px 15px rgba(0, 0, 0, 0.5)",
                minWidth: "150px",
                zIndex: 1000,
                overflow: "hidden",
                border: "1px solid rgba(0, 255, 247, 0.3)",
              }}
            >
              {item.options.map((option, index) => (
                <div
                  key={index}
                  style={{
                    padding: "8px 16px",
                    color: "#00fff7",
                    fontSize: 12,
                    cursor: "pointer",
                    transition: "background 0.15s",
                    borderBottom: index !== item.options.length - 1 ? "1px solid rgba(0, 255, 247, 0.1)" : "none",
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.background = "#252a40")}
                  onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
                  onClick={() => {
                    if (option.action) {
                      option.action();
                    }
                    setActiveMenu(null);
                  }}
                >
                  {option.label}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </nav>
  );
}

export default function TitleBar({
  fileName,
  filePath,
  handleOpenFile,
  handleSaveFile,
  handleSaveFileAs,
  handleOpenDir,
}) {
  return (
    <div
      style={{
        WebkitAppRegion: "drag",
        background: "linear-gradient(90deg, #12151fdd 0%, #1a1a2ed2 100%)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        color: "#e0e0ff",
        display: "flex",
        alignItems: "center",
        height: 40,
        userSelect: "none",
        position: "relative",
        borderBottom: "1.5px solid #00fff7",
        padding: 0,
        boxShadow: "0 0 15px rgba(62, 0, 128, 0.5)",
        zIndex: 100,
      }}
    >
      {/* App Name */}
      <span
        style={{
          marginLeft: 18,
          fontFamily: "'Orbitron', sans-serif",
          marginRight: 18,
        }}
      >
        <img
          src={loom}
          alt="Loom"
          style={{
            width: 24,
            height: 24,
            marginRight: 8,
            verticalAlign: "middle",
            filter: "drop-shadow(0 0 5px rgb(255, 45, 109))",
          }}
        />
      </span>
      {/* Menu Bar */}
      <MenuBar 
        handleOpenFile={handleOpenFile}
        handleSaveFile={handleSaveFile}
        handleSaveFileAs={handleSaveFileAs}
        handleOpenDir={handleOpenDir}
      />
      {/* Open Dir Button */}
      {/* <button
        onClick={handleOpenDir}
        style={{
          marginLeft: 24,
          background: "#181c2f",
          color: "#00fff7",
          border: "1px solid #00fff7",
          borderRadius: 4,
          padding: "6px 14px",
          fontWeight: 600,
          fontSize: 12,
          cursor: "pointer",
          boxShadow: "0 0 8px #00fff799",
          transition: "background 0.15s, color 0.15s",
        }}
      >
        Open Dir
      </button> */}
      {/* Window Controls */}
      <div
        style={{
          display: "flex",
          WebkitAppRegion: "no-drag",
          marginLeft: "auto",
          marginRight: 8,
          zIndex: 2,
        }}
      >
        <WindowButton onClick={() => appWindow.minimize()} title="Minimize">
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 7H11"
              stroke="#00fff7"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </WindowButton>
        <WindowButton
          onClick={() => appWindow.toggleMaximize()}
          title="Maximize"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="3"
              y="3"
              width="8"
              height="8"
              rx="1"
              stroke="#00fff7"
              strokeWidth="1.5"
              fill="none"
            />
          </svg>
        </WindowButton>
        <WindowButton onClick={() => appWindow.close()} isClose title="Close">
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 3L11 11M11 3L3 11"
              stroke="#ff2a6d"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </WindowButton>
      </div>
    </div>
  );
}
