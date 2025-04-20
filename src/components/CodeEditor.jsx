import Editor from "@monaco-editor/react";
import JellyFish from './themes/JellyFish.json';
import { useEffect } from "react";

function CodeEditor({ filePath, fileName, code, handleEditorChange, currentLanguage,isImageOrVideo,handlePermSave }) {

const defineCyberpunkTheme = (monaco) => {
      monaco.editor.defineTheme('cyberpunk-theme', {
        base: 'vs-dark',
        inherit: true,
        ...JellyFish
      });
  };


  // if(isImageOrVideo) {
  //   const {image, video} = isImageOrVideo;
  //   return (
  //     <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", width: "100%" }}>
  //       {image && <img src={filePath} alt="Image" style={{ maxWidth: "100%", maxHeight: "100%" }} />}
  //       {video && <video src={filePath} controls style={{ maxWidth: "100%", maxHeight: "100%" }} />}
  //     </div>
  //   );
  // };


  useEffect(()=>{
    const handleCtrlS = (e) => {
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        handlePermSave(filePath);
      }
    }
    window.addEventListener('keydown', handleCtrlS);

    return () => window.removeEventListener('keydown', handleCtrlS);
    
  },[]);


  return (
    <Editor
      height="100%"
      width="100%"
      path={filePath || `untitled.${fileName.split(".").pop() || "js"}`}
      value={code}
      onChange={handleEditorChange}
      language={currentLanguage}
      theme="cyberpunk-theme"
        beforeMount={defineCyberpunkTheme}
      options={{
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        fontLigatures: true,
        minimap: {
          enabled: true,
          renderCharacters: false,
          showSlider: "always",
          maxColumn: 60,
        },
        smoothScrolling: true,
        cursorSmoothCaretAnimation: "on",
        cursorBlinking: "phase",
        cursorWidth: 2,
        padding: { top: 20 },
        scrollbar: {
          verticalScrollbarSize: 8,
          horizontalScrollbarSize: 8,
          verticalSliderSize: 8,
          horizontalSliderSize: 8,
        },
        lineNumbers: "on",
        glyphMargin: true,
        renderLineHighlight: "all",
        roundedSelection: false,
        scrollBeyondLastLine: false,
        wordWrap: "on",
        bracketPairColorization: { enabled: true },
        guides: {
          bracketPairs: true,
          indentation: true,
        },
        renderWhitespace: "selection",
        // Add decorations/effects to enhance cyberpunk feel
        matchBrackets: "always",
        occurrencesHighlight: true,
        renderControlCharacters: false,
        renderIndentGuides: true,
        colorDecorators: true,
      }}
    />
  );
}

export default CodeEditor;