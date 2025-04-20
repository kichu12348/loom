import { useState, useRef, useEffect } from 'react';
import { FaTerminal, FaAngleDown, FaAngleUp } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';

export default function Terminal({ show, onResize }) {
  const [height, setHeight] = useState(200);
  const [isDragging, setIsDragging] = useState(false);
  const minHeight = 100;
  const maxHeight = 500;
  const dragHandleRef = useRef(null);
  
  useEffect(() => {
    function handleMouseMove(e) {
      if (!isDragging) return;
      
      // Calculate new height (inverting the direction since we're dragging from top)
      const newHeight = Math.min(
        Math.max(
          height - e.movementY,
          minHeight
        ),
        maxHeight
      );
      
      setHeight(newHeight);
      if (onResize) onResize(newHeight);
    }
    
    function handleMouseUp() {
      setIsDragging(false);
    }
    
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, height, onResize]);

  if (!show) return null;

  return (
    <div 
      style={{
        height: `${height}px`,
        maxHeight: `${maxHeight}px`,
        minHeight: `${minHeight}px`,
        background: 'rgba(10,0,24,0.9)',
        color: '#00fff7',
        borderTop: '1.5px solid #00fff76c',
        boxShadow: 'inset 0 5px 16px #00fff722',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'height 0.2s ease-out',
        position: 'relative',
        backdropFilter: 'blur(2px)'
      }}
    >
      <div
        ref={dragHandleRef}
        style={{
          height: '6px',
          background: 'transparent',
          cursor: 'ns-resize',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10
        }}
        onMouseDown={() => setIsDragging(true)}
      />
      
      <div style={{ 
        padding: '8px 12px', 
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1.5px solid #00fff76c',
      }}>
        <FaTerminal size={14} style={{ marginRight: 8 }} />
        <IoClose size={20} style={{ marginRight: 8 }} />
      </div>
      
      <div 
        style={{
          flex: 1,
          background: 'rgba(10,0,24,0.9)',
          padding: '8px 12px',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 14,
          overflow: 'auto',
          color: '#e0e0ff'
        }}
      >
        <pre style={{ margin: 0 }}>
          <span style={{ color: '#00fff7' }}>user@loom:</span>
          <span style={{ color: '#ff2a6d' }}> ~/project</span>
          <span style={{ color: '#00fff7' }}> $ </span>
          <span style={{ color: '#e0e0ff' }}>{/* Terminal output would go here */}</span>
        </pre>
        {/* This is a placeholder for a real terminal implementation */}
        <div style={{ marginTop: 8 }}>
          <span style={{ opacity: 0.7 }}>
            Terminal functionality will be implemented soon.
          </span>
        </div>
      </div>
    </div>
  );
}
