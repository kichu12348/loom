import React, { useState } from "react";
import { IoClose } from "react-icons/io5";


const TabsBar = ({ onTabChange, onTabClose,tabs,setTabs,activeIndex,setActiveIndex }) => {

  const handleTabClick = (idx) => {
    setActiveIndex(idx);
    if (onTabChange) onTabChange(tabs[idx]);
  };

  const handleTabClose = (e, idx) => {
    e.stopPropagation();
    setTabs(tabs.filter((_, index) => index !== idx));
    onTabClose(tabs[idx]);
  };

  return (
    <div
      className="tabs-bar"
      style={{ display: 
        "flex",
        background: "rgba(10,0,44,0.98)",
        padding: "4px",
        overflowX: "auto",
        whiteSpace: "nowrap",
        WebkitOverflowScrolling: "touch",
     }}
    >
      {tabs.map((tab, idx) => (
        <div
          key={tab.filePath}
          className={`tab${idx === activeIndex ? " active" : ""}`}
          style={{
            padding: "4px 8px",
            cursor: "pointer",
            background: idx === activeIndex ? "rgba(5, 217, 232, 0.15)" : "transparent",
            color: "#fff",
            borderRight: "1px solid #333",
            display: "flex",
            alignItems: "center",
          }}
          onClick={() => handleTabClick(idx)}
        >
          <span style={{ marginRight: 8 }}>{tab.name}</span>
          {idx ===activeIndex &&
            <button
            onClick={(e) => handleTabClose(e, idx)}
            style={{
              background: "none",
              border: "none",
              color: "#fff",
              cursor: "pointer",
              alignItems: "center",
                display: "flex",
                justifyContent: "center",
                padding: 0,
            }}
            title="Close tab"
          >
            <IoClose size={16} style={{ color: "#fff" }} />
          </button>}
        </div>
      ))}
    </div>
  );
};

export default TabsBar;
