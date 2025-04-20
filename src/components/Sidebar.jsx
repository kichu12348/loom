import { useState, useEffect, useRef, useMemo } from "react";
import {
  readDir,
  mkdir,
  remove,
  rename,
  writeTextFile,
  BaseDirectory,
} from "@tauri-apps/plugin-fs";
import { open } from "@tauri-apps/plugin-dialog";
import {
  FaRegFolder,
  FaRegFolderOpen,
  FaRegFile,
  FaRegFileAlt,
  FaBars,
  FaPlus,
  FaTrash,
  FaEdit,
  FaChevronRight,
  FaChevronDown,
} from "react-icons/fa";

const workspaceRoot = "";

function FileItem({
  file,
  level = 0,
  onFileClick,
  onRefresh,
  currentRoot,
  onContextMenu,
  isImageOrVideo,
}) {
  const [expanded, setExpanded] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [newName, setNewName] = useState(file.name);
  const [children, setChildren] = useState(file.children || []);
  const isDir = file.isDirectory || file.children !== undefined;

  async function handleDelete(e) {
    e.stopPropagation();
    const filePath = currentRoot + "/" + file.name;
    if (isDir) {
      await remove(filePath, { recursive: true });
    } else {
      await remove(filePath);
    }
    onRefresh();
  }

  async function handleRename(e) {
    e.stopPropagation();
    if (newName && newName !== file.name) {
      const prevPath = currentRoot + "/" + file.name;
      const newPath = currentRoot + "/" + newName;
      await rename(prevPath, newPath);
      setRenaming(false);
      onRefresh(); // Refresh parent
    }
  }

  async function handleCreateFile(e) {
    e.stopPropagation();
    const name = prompt("Enter new file name:");
    if (name) {
      const newPath = currentRoot + "/" + name;
      await writeTextFile(newPath, "");
      onRefresh();
    }
  }

  async function handleCreateDir(e) {
    e.stopPropagation();
    const name = prompt("Enter new folder name:");
    if (name) {
      const newPath = currentRoot + "/" + name;
      await mkdir(newPath);
      onRefresh();
    }
  }

  async function handleExpand() {
    try {
      if (!expanded && isDir) {
        // Lazy load children
        const entries = await readDir(currentRoot + "/" + file.name, {
          recursive: false,
        });
        setChildren(entries);
      }
      setExpanded((e) => !e);
    } catch (e) {
      console.log("Error expanding directory:", e);
    }
  }

  return (
    <div
      style={{ marginLeft: level * 10 }}
      onContextMenu={(e) => onContextMenu(e, file)}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          cursor: isDir ? "pointer" : "pointer",
          color: isDir ? "#00fff7" : "#fff",
          fontWeight: isDir ? 600 : 400,
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 14,
          padding: "3px 0 3px 4px",
          borderRadius: 4,
          background: expanded && isDir ? "#181c2f" : "transparent",
          transition: "background 0.15s",
          gap: 8,
          position: "relative",
        }}
        onClick={() => {
          if (isDir) handleExpand();
          if (!isDir && onFileClick) onFileClick(currentRoot + "/" + file.name);
        }}
      >
        {isDir &&
          (expanded ? (
            <FaChevronDown
              size={12}
              style={{
                color: "#00fff7",
                marginRight: 2,
                transition: "transform 0.15s",
              }}
            />
          ) : (
            <FaChevronRight
              size={12}
              style={{
                color: "#00fff7",
                marginRight: 2,
                transition: "transform 0.15s",
              }}
            />
          ))}
        {isDir ? (
          expanded ? (
            <FaRegFolderOpen
              style={{
                color: "#00fff7",
                filter: "drop-shadow(0 0 4px #00fff7)",
              }}
              size={16}
            />
          ) : (
            <FaRegFolder
              style={{
                color: "#00fff7",
                filter: "drop-shadow(0 0 4px #00fff7)",
              }}
              size={16}
            />
          )
        ) : (
          <FaRegFile
            style={{ color: "#fff", filter: "drop-shadow(0 0 2px #fff)" }}
            size={15}
          />
        )}
        {renaming ? (
          <input
            value={newName}
            autoFocus
            onChange={(e) => setNewName(e.target.value)}
            onBlur={handleRename}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleRename(e);
            }}
            style={{ fontSize: 14, width: 100 }}
          />
        ) : (
          <span
            style={{
              textShadow: file.isDir ? "0 0 6px #00fff7" : "0 0 4px #fff",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: 140,
            }}
          >
            {file.name}
          </span>
        )}
      </div>
      {expanded && isDir && children && (
        <div>
          {children.map((child) => (
            <FileItem
              key={JSON.stringify(child)}
              file={child}
              level={level + 1}
              onFileClick={onFileClick}
              onRefresh={onRefresh}
              currentRoot={currentRoot + "/" + file.name}
              onContextMenu={onContextMenu}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Sidebar({
  onFileClick: handleFileClick,
  setCurrentLanguage,
  setIsImageOrVideo,
  currentRoot,
  files,
  refreshFiles,
  handleOpenDir,
}) {
  const [expanded, setExpanded] = useState(true);
  const [sidebarWidth, setSidebarWidth] = useState(220);
  const isResizing = useRef(false);

  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    file: null,
  });
  const minSidebarWidth = 160;
  const maxSidebarWidth = 420;
  const sidebarRef = useRef();
  // If no directory loaded, prompt to open one

  useEffect(() => {
    function handleMouseMove(e) {
      if (isResizing.current) {
        const newWidth = Math.min(
          Math.max(
            e.clientX - (sidebarRef.current?.getBoundingClientRect().left || 0),
            minSidebarWidth
          ),
          maxSidebarWidth
        );
        setSidebarWidth(newWidth);
      }
    }
    function handleMouseUp() {
      isResizing.current = false;
    }
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  function refresh() {
    refreshFiles();
  }

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
    vue: "vue",
  };
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp"];
  const videoExtensions = ["mp4", "avi", "mkv", "mov", "wmv", "flv"];

  function onFileClick(filePath) {
    const fileExtension = filePath.split(".").pop();
    const language = languageMap[fileExtension] || "plaintext";
    const isImage = imageExtensions.includes(fileExtension);
    const isVideo = videoExtensions.includes(fileExtension);
    if (isImage || isVideo) {
      setIsImageOrVideo({
        isImage: isImage,
        isVideo: isVideo,
      });
    } else setIsImageOrVideo(null);
    setCurrentLanguage(language);
    handleFileClick(filePath);
  }

  // Context menu handlers
  function handleContextMenu(e, file) {
    e.preventDefault();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY - 25,
      file,
    });
  }

  function closeContextMenu() {
    setContextMenu((cm) => ({ ...cm, visible: false }));
  }

  // Action handlers for context menu
  async function handleContextRename() {
    closeContextMenu();
    if (!contextMenu.file) return;
    // Trigger renaming in FileItem or do inline prompt
    const newName = prompt("Rename to:", contextMenu.file.name);
    if (newName && newName !== contextMenu.file.name) {
      const prevPath = contextMenu.file.path;
      const newPath = prevPath.replace(/[^\\/]+$/, newName);
      await rename(prevPath, newPath);
      refresh();
    }
  }

  async function handleContextDelete() {
    closeContextMenu();
    if (!contextMenu.file) return;
    const isDir =
      contextMenu.file.isDirectory || contextMenu.file.children !== undefined;
    if (window.confirm(`Delete ${contextMenu.file.name}?`)) {
      await remove(contextMenu.file.path, { recursive: isDir });
      refresh();
    }
  }

  async function handleContextAddFile() {
    closeContextMenu();
    if (!contextMenu.file) return;
    const name = prompt("Enter new file name:");
    if (name) {
      const newPath = contextMenu.file.path + "/" + name;
      await writeTextFile(newPath, "");
      refresh();
    }
  }

  async function handleContextAddDir() {
    closeContextMenu();
    if (!contextMenu.file) return;
    const name = prompt("Enter new folder name:");
    if (name) {
      const newPath = contextMenu.file.path + "/" + name;
      await mkdir(newPath);
      refresh();
    }
  }

  async function handleContextAddFileRoot() {
    const name = prompt("Enter new file name:");
    if (name) {
      const newPath = currentRoot + "/" + name;
      await writeTextFile(newPath, "");
      refresh();
    }
  }

  async function handleContextAddDirRoot() {
    const name = prompt("Enter new folder name:");
    if (name) {
      const newPath = currentRoot + "/" + name;
      await mkdir(newPath);
      refresh();
    }
  }

  // Hide context menu on click elsewhere
  useEffect(() => {
    if (!contextMenu.visible) return;
    const handler = () => closeContextMenu();
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, [contextMenu.visible]);

  const currentFolder = useMemo(
    () =>
      currentRoot?.toString().replace(/\\/g, "/").split("/").pop() ||
      currentRoot?.toString().replace(/\\/g, "/"),
    [currentRoot]
  );

  if (!currentRoot) {
    return (
      <div
        ref={sidebarRef}
        style={{
          width: 220,
          background: "rgba(10,0,44,0.98)",
          borderRight: "1.5px solid #00fff7",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <button
          onClick={handleOpenDir}
          style={{
            fontSize: 14,
            padding: "8px 16px",
            background: "#181c2f",
            color: "#00fff7",
            border: "1px solid #00fff7",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          Open Directory
        </button>
      </div>
    );
  }

  return (
    <div
      ref={sidebarRef}
      style={{
        width: expanded ? sidebarWidth : 44,
        minWidth: expanded ? minSidebarWidth : 44,
        maxWidth: expanded ? maxSidebarWidth : 44,
        background: "rgba(10,0,44,0.8)",
        borderRight: "1.5px solid #00fff7",
        boxShadow: "2px 0 16px #00fff744",
        color: "#fff",
        height: "100%",
        transition: "width 0.22s ease-in-out",
        overflowX: "hidden",
        position: "relative",
        zIndex: 10,
        display: "flex",
        flexDirection: "column",
        backdropFilter: "blur(2px)",
        paddingVertical: 8,
        userSelect: isResizing.current ? "none" : undefined,
        scrollbarWidth: "thin",
        scrollbarColor: "rgba(5, 217, 232, 0.15) transparent",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: 8,
          borderBottom: "1px solid #00fff7",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div
          style={{
            fontWeight: 300,
            color: "#00fff7",
            fontSize: 15,
            flex: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            userSelect: "text",
            //display: expanded ? "block" : "none",
          }}
        >
          ./{currentFolder}
        </div>
        <button
          onClick={() => handleContextAddFileRoot()}
          style={{
            marginLeft: 8,
            fontSize: 12,
            background: "#181c2f",
            color: "#00fff7",
            border: "none",
            borderRadius: 4,
            padding: "2px 8px",
            cursor: "pointer",
            display: expanded ? "block" : "none",
          }}
        >
          + File
        </button>
        <button
          onClick={() => handleContextAddDirRoot()}
          style={{
            marginLeft: 4,
            fontSize: 12,
            background: "#181c2f",
            color: "#00fff7",
            border: "none",
            borderRadius: 4,
            padding: "2px 8px",
            cursor: "pointer",
            display: expanded ? "block" : "none",
          }}
        >
          + Dir
        </button>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: 8,
          borderBottom: "1px solid #00fff7",
        }}
      >
        <div
          onClick={() => setExpanded(!expanded)}
          style={{
            cursor: "pointer",
            padding: "4px",
            borderRadius: "4px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {expanded ? (
            <FaRegFileAlt
              size={20}
              style={{
                color: "#00fff7",
                filter: "drop-shadow(0 0 4px #00fff7)",
                marginLeft: 4,
              }}
            />
          ) : (
            <FaBars
              size={20}
              style={{
                color: "#00fff7",
                filter: "drop-shadow(0 0 4px #00fff7)",
              }}
            />
          )}
        </div>
      </div>
      <div
        style={{
          flex: 1,
          padding: expanded ? "8px 0 8px 8px" : 0,
          overflowY: "auto",
        }}
      >
        {expanded &&
          files.map((file) => (
            <FileItem
              key={JSON.stringify(file)}
              file={file}
              onFileClick={onFileClick}
              onRefresh={refresh}
              currentRoot={currentRoot.toString().replace(/\\/g, "/")}
              level={0}
              onContextMenu={handleContextMenu}
            />
          ))}
      </div>
      {expanded && (
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 6,
            height: "100%",
            cursor: "ew-resize",
            zIndex: 20,
            background: "transparent",
          }}
          onMouseDown={() => {
            isResizing.current = true;
          }}
        />
      )}
      {contextMenu.visible && (
        <div
          style={{
            position: "fixed",
            top: contextMenu.y,
            left: Math.min(
              contextMenu.x,
              window.innerWidth - 160 // Prevent overflow, menu width ~140 + margin
            ),
            background: "#181c2f",
            color: "#00fff7",
            border: "1px solid #00fff7",
            borderRadius: 6,
            boxShadow: "0 2px 16px #00fff799",
            zIndex: 9999,
            minWidth: 140,
            padding: 4,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 14,
            userSelect: "none",
          }}
        >
          <div
            style={{ padding: "6px 12px", cursor: "pointer" }}
            onClick={handleContextRename}
          >
            Rename
          </div>
          <div
            style={{ padding: "6px 12px", cursor: "pointer" }}
            onClick={handleContextDelete}
          >
            Delete
          </div>
          {(contextMenu.file.isDirectory ||
            contextMenu.file.children !== undefined) && (
            <>
              <div
                style={{ padding: "6px 12px", cursor: "pointer" }}
                onClick={handleContextAddFile}
              >
                Add File
              </div>
              <div
                style={{ padding: "6px 12px", cursor: "pointer" }}
                onClick={handleContextAddDir}
              >
                Add Directory
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
