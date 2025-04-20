import { useState, useEffect, useRef, useCallback } from "react";
import { open, save } from "@tauri-apps/plugin-dialog";
import { readTextFile, writeTextFile, readDir } from "@tauri-apps/plugin-fs";
import { basename } from "@tauri-apps/api/path";
import "./App.css";

import TitleBar from "./components/TitleBar";
import CodeEditor from "./components/CodeEditor";
import AnimationStyles from "./components/AnimationStyles";
import Sidebar from "./components/Sidebar";
import TabsBar from "./components/TabsBar";
import Terminal from "./components/Terminal";

const languageMap = {
  js: "javascript",
  ts: "typescript",
  py: "python",
  go: "go",
  rb: "ruby",
  java: "java",
  php: "php",
  html: "html",
  css: "css",
  json: "json",
  md: "markdown",
  rs: "rust",
  c: "c",
  cpp: "cpp",
  swift: "swift",
  kotlin: "kotlin",
  sql: "sql",
  xml: "xml",
  txt: "plaintext",
  yml: "yaml",
  yaml: "yaml",
  sh: "bash",
  bat: "batch",
  ps: "powershell",
  log: "plaintext",
  csv: "csv",
  ini: "ini",
  conf: "ini",
  toml: "toml",
  dockerfile: "dockerfile",
  jsx: "javascript",
  tsx: "typescript",
};



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
  const [code, setCode] = useState(null);
  const [filePath, setFilePath] = useState(null);
  const [fileName, setFileName] = useState("Untitled");
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [currentLanguage, setCurrentLanguage] = useState("javascript");
  const [isImageOrVideo, setIsImageOrVideo] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const editorContainerRef = useRef(null);

  // window.localStorage.removeItem('lastOpenedDir'); // Remove this line if you want to keep the last opened directory

  const [currentRoot, setCurrentRoot] = useState(() => {
    const saved = window.localStorage.getItem('lastOpenedDir');
    return saved || null;
  });
  const [files, setFiles] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  // Tabs state
  const [tabs, setTabs] = useState([]); // {filePath, name, language, code}
  const [activeTab, setActiveTab] = useState(null); // filePath of active tab

  const [showTerminal, setShowTerminal] = useState(false);
  const [terminalHeight, setTerminalHeight] = useState(200);
  
  // Toggle terminal visibility
  const toggleTerminal = useCallback(() => {
    setShowTerminal(prev => !prev);
  }, []);
  
  // Handle terminal resize
  const handleTerminalResize = useCallback((height) => {
    setTerminalHeight(height);
  }, []);
  
  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+` to toggle terminal
      if (e.ctrlKey && e.key === '`') {
        e.preventDefault();
        toggleTerminal();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleTerminal]);

  function handleEditorChange(value) {
    setCode(value);
    // Also update the code in the active tab
    if (activeTab) {
      setTabs(prev => 
        prev.map(tab => 
          tab.filePath === activeTab ? {...tab, code: value} : tab
        )
      );
    }
  }

  // async function handleEditorSave(filePath) {
  //   console.log("Saving file to:", filePath);
  //   try {
  //     await writeTextFile(filePath.toString(), code);
      
  //   } catch (err) {
  //     console.error("Error saving file:", err);
  //   }

  // }

  useEffect(() => {
    function handleResize() {
      if (editorContainerRef.current) {
        editorContainerRef.current.style.height = `${
          window.innerHeight - 40
        }px`;
      }
    }

    // Init sizing
    handleResize();

    window.addEventListener("resize", handleResize);

    // This will observe any size changes and force editor resize
    const resizeObserver = new ResizeObserver(() => {
      // Force editor to resize when container changes size
      window.dispatchEvent(new Event('resize'));
    });

    if (editorContainerRef.current) {
      resizeObserver.observe(editorContainerRef.current);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    async function fetchFiles() {
      if (!currentRoot) return;
      const entries = await readDir(currentRoot, { recursive: false });
      setFiles(entries);
    }
    fetchFiles();
  }, [currentRoot, refreshKey]);

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


  const handleSaveFile = useCallback(async () => {
    if (!code) return;
    try {
      let path_to_save = filePath;
      if (!path_to_save) {
        path_to_save = await save({
          filters: [
            {
              name: "Code Files",
              extensions: [
                "js", "jsx", "ts", "tsx", "html", "css", "json", 
                "md", "rs", "py",
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
        // Update tab information if this is an active tab
        if (tabs.some(tab => tab.filePath === path_to_save)) {
          setTabs(prev => 
            prev.map(tab => 
              tab.filePath === path_to_save ? 
                {...tab, code, name} : tab
            )
          );
        } else if (path_to_save) {
          // If it's a new file, add it to tabs
          const language = languageMap[name.split(".").pop()] || "plaintext";
          setTabs(prev => [...prev, {
            filePath: path_to_save,
            name,
            language,
            code
          }]);
          setActiveTab(path_to_save);
        }
        
        // Refresh file explorer if saving in the current workspace
        if (currentRoot && path_to_save.startsWith(currentRoot)) {
          refreshFiles();
        }
      }
    } catch (err) {
      console.error("Error saving file:", err);
    }
  }, [code, filePath, tabs, currentRoot]);

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

  async function handleOpenDir() {
    const dir = await open({ directory: true });
    if (dir) {
      setCurrentRoot(dir);
      setFiles([]); // Clear previous files
      setRefreshKey((k) => k + 1);
      setActiveIndex(0);
      setTabs([]); // Clear previous tabs
      setCode(null);
      setFilePath(null);
      setFileName("Untitled");
      setCurrentLanguage("javascript");
      setActiveTab(null);
      setIsImageOrVideo(null);
      window.localStorage.setItem('lastOpenedDir', dir);
    }
  }

  function refreshFiles() {
    setRefreshKey((k) => k + 1);
  }

  // Add a handler to open files from the sidebar
  async function handleSidebarFileClick(path) {
    // Check if tab already exists
    const existingTab = tabs.find((tab) => tab.filePath === path);
    if (existingTab) {
      setActiveTab(existingTab.filePath);
      setCode(existingTab.code);
      setFilePath(existingTab.filePath);
      setFileName(existingTab.name);
      setCurrentLanguage(existingTab.language || "javascript");
      setIsImageOrVideo(false);
      setActiveIndex(tabs.findIndex((t) => t.filePath === existingTab.filePath));
      return;
    }
    try {
      const contents = await readTextFile(path);
      const name = path.split(/[\\/]/).pop();
      const language = languageMap[name.split(".").pop()] || "plaintext";
      const newTab = {
        filePath: path,
        name,
        language,
        code: contents,
      };
      setTabs((prev) => [...prev, newTab]);
      setActiveTab(path);
      setCode(contents);
      setFilePath(path);
      setFileName(name);
      setCurrentLanguage(language);
      setIsImageOrVideo(false);
      setActiveIndex(tabs.length); // Set the new tab as active
    } catch (err) {
      console.error("Error opening file from sidebar:", err);
    }
  }

  // Handle tab change
  function handleTabChange(tab) {
    if (!tab) return;
    setActiveTab(tab.filePath);
    setCode(tab.code);
    setFilePath(tab.filePath);
    setFileName(tab.name);
    setCurrentLanguage(tab.language || "javascript");
    setIsImageOrVideo(false);
    setActiveIndex(tabs.findIndex((t) => t.filePath === tab.filePath));
  }

  // Handle tab close
  function handleTabClose(tab) {
    setTabs((prev) => prev.filter((t) => t.filePath !== tab.filePath));
    if (activeTab === tab.filePath) {
      // Move to previous tab or first tab
      const idx = tabs.findIndex((t) => t.filePath === tab.filePath);
      const newTabs = tabs.filter((t) => t.filePath !== tab.filePath);
      if (newTabs.length > 0) {
        const newActive = newTabs[idx === 0 ? 0 : idx - 1];
        handleTabChange(newActive);
      } else {
        setActiveTab(null);
        setCode("");
        setFilePath(null);
        setFileName("Untitled");
        setCurrentLanguage("javascript");
        setIsImageOrVideo(false);
      }
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
        fontFamily: "'Synth Midnight', 'Orbitron', 'JetBrains Mono', sans-serif",
        color: "#e0e0ff",
        margin: 0,
        padding: 0,
        overflow: "hidden",
      }}
    >
      {/* Title Bar always on top */}
      <TitleBar
        fileName={fileName}
        filePath={filePath}
        handleOpenFile={handleOpenFile}
        handleSaveFile={handleSaveFile}
        handleSaveFileAs={handleSaveFileAs}
        handleOpenDir={handleOpenDir}
        toggleTerminal={toggleTerminal}
        isTerminalVisible={showTerminal}
      />
      {/* Main content: sidebar + (tabs + editor) */}
      <div style={{ flex: 1, display: "flex", flexDirection: "row", minWidth: 0, minHeight: 0 }}>
        <Sidebar 
          onFileClick={handleSidebarFileClick} 
          onToggleExpand={(expanded) => setSidebarExpanded(expanded)}
          initialExpanded={sidebarExpanded}
          setCurrentLanguage={setCurrentLanguage}
          setIsImageOrVideo={setIsImageOrVideo}
          currentRoot={currentRoot}
          files={files}
          refreshFiles={refreshFiles}
          handleOpenDir={handleOpenDir}
        />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
          {/* TabsBar is now inside the editor container, above the editor */}
          <TabsBar
            initial={tabs}
            onTabChange={handleTabChange}
            onTabClose={handleTabClose}
            tabs={tabs}
            setTabs={setTabs}
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
          />
          <AnimationStyles />
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
              currentLanguage={currentLanguage}
              isImageOrVideo={isImageOrVideo}
              handlePermSave={handleSaveFile}
            />
          </div>
          
          {/* Terminal component */}
          <Terminal 
            show={showTerminal} 
            onResize={handleTerminalResize}
            onClose={toggleTerminal}
          />
        </div>
      </div>
    </div>
  );
}
