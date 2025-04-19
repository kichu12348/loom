import Editor from "@monaco-editor/react";
import JellyFish from './themes/JellyFish.json';

function CodeEditor({ filePath, fileName, code, handleEditorChange }) {

const defineCyberpunkTheme = (monaco) => {
      monaco.editor.defineTheme('cyberpunk-theme', {
        base: 'vs-dark',
        inherit: true,
        ...JellyFish
      });
  };

  return (
    <Editor
      height="100%"
      width="100%"
      path={filePath || `untitled.${fileName.split(".").pop() || "js"}`}
      value={code}
      onChange={handleEditorChange}
      language="c"
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