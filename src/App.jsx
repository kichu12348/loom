import { useState, useEffect, useRef } from "react";
import { open, save } from "@tauri-apps/plugin-dialog";
import { readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";
import { basename } from "@tauri-apps/api/path";
import "./App.css";

import TitleBar from "./components/TitleBar";
import CodeEditor from "./components/CodeEditor";
import AnimationStyles from "./components/AnimationStyles";

const CyberpunkDecorations = () => {
  return (
    <>
      {/* Grid Lines Overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: "none",
          backgroundImage: `repeating-linear-gradient(rgba(5, 217, 232, 0.03) 0px, transparent 2px, transparent 30px),
                           repeating-linear-gradient(90deg, rgba(5, 217, 232, 0.03) 0px, transparent 2px, transparent 30px)`,
          opacity: 0.3,
          zIndex: 1,
        }}
      />
    </>
  );
};

export default function App() {
  const [code, setCode] = useState("// welcome to Loom!");
  const [filePath, setFilePath] = useState(null);
  const [fileName, setFileName] = useState("Untitled");
  const editorContainerRef = useRef(null);

  function handleEditorChange(value, _) {
    setCode(value);
  }

  useEffect(() => {
    function handleResize() {
      if (editorContainerRef.current) {
        editorContainerRef.current.style.height = `${
          window.innerHeight - 40
        }px`;
        editorContainerRef.current.style.width = `${window.innerWidth}px`;
      }
    }

    // Init sizing
    handleResize();

    window.addEventListener("resize", handleResize);

    const resizeObserver = new ResizeObserver(() => {
      //deebooging
    });

    resizeObserver.observe(document.documentElement);

    return () => {
      window.removeEventListener("resize", handleResize);
      resizeObserver.disconnect();
    };
  }, []);

  async function handleOpenFile() {
    try {
      const selectedPath = await open({
        multiple: false,
        filters: [
          {
            name: "Code Files",
            extensions: [
              "js",
              "jsx",
              "ts",
              "tsx",
              "html",
              "css",
              "json",
              "md",
              "rs",
              "py",
            ],
          },
        ],
      });
      if (selectedPath) {
        const contents = await readTextFile(selectedPath);
        setCode(contents);
        setFilePath(selectedPath);
        const name = await basename(selectedPath);
        setFileName(name);
      }
    } catch (err) {
      console.log("Error opening file:", err);
    }
  }

  async function handleSaveFile() {
    try {
      let path_to_save = filePath;
      if (!path_to_save) {
        path_to_save = await save({
          filters: [
            {
              name: "Code Files",
              extensions: [
                "js",
                "jsx",
                "ts",
                "tsx",
                "html",
                "css",
                "json",
                "md",
                "rs",
                "py",
              ],
            },
          ],
        });
      }

      if (path_to_save) {
        await writeTextFile(path_to_save, code);
        setFilePath(path_to_save);
        const name = await basename(path_to_save);
        setFileName(name);
        console.log("File saved successfully!");
      }
    } catch (err) {
      console.error("Error saving file:", err);
    }
  }

  async function handleSaveFileAs() {
    try {
      const path_to_save = await save({
        filters: [
          {
            name: "Code Files",
            extensions: [
              "js",
              "jsx",
              "ts",
              "tsx",
              "html",
              "css",
              "json",
              "md",
              "rs",
              "py",
            ],
          },
        ],
        defaultPath: filePath || undefined,
      });

      if (path_to_save) {
        await writeTextFile(path_to_save, code);
        setFilePath(path_to_save);
        const name = await basename(path_to_save);
        setFileName(name);
        console.log("File saved successfully!");
      }
    } catch (err) {
      console.error("Error saving file as:", err);
    }
  }

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        background: "transparent",
        fontFamily:
          "'Synth Midnight', 'Orbitron', 'JetBrains Mono', sans-serif",
        color: "#e0e0ff",
        margin: 0,
        padding: 0,
        overflow: "hidden",
      }}
    >
      {/* Add global animation styles */}
      <AnimationStyles />

      {/* Title Bar Component */}
      <TitleBar
        fileName={fileName}
        filePath={filePath}
        handleOpenFile={handleOpenFile}
        handleSaveFile={handleSaveFile}
        handleSaveFileAs={handleSaveFileAs}
      />

      <div
        ref={editorContainerRef}
        style={{
          flex: 1,
          position: "relative",
          overflow: "hidden",
          border: "1px solid #12151f",
          boxShadow: "inset 0 0 30px rgba(5, 217, 232, 0.1)",
        }}
      >
        <CyberpunkDecorations />

        <CodeEditor
          filePath={filePath}
          fileName={fileName}
          code={code}
          handleEditorChange={handleEditorChange}
        />
      </div>
    </div>
  );
}
