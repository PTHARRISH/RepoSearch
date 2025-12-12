import { useEffect, useState } from "react";
import CodeViewer from "./components/CodeViewer";
import FolderTree from "./components/FolderTree";
import "./index.css";

export default function App() {
  const [root, setRoot] = useState(null);
  const [tabs, setTabs] = useState([]);
  const [active, setActive] = useState(0);

  // search inside folder tree
  const [searchText, setSearchText] = useState("");

  // repo name state
  const [repoOwner, setRepoOwner] = useState("PTHARRISH");
  const [repoName, setRepoName] = useState("Python-Notes");

  // single combined input field
  const [repoInput, setRepoInput] = useState("PTHARRISH/Python-Notes");

  // Load repo contents
  async function loadRepo(owner, repo) {
    try {
      const res = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/`
      );
      const data = await res.json();

      if (Array.isArray(data)) {
        setRoot(data);
        setTabs([]);
        setActive(0);
      } else {
        alert("Repository not found!");
      }
    } catch (e) {
      alert("Failed to load repository.");
    }
  }

  // initial load
  useEffect(() => {
    loadRepo(repoOwner, repoName);
  }, []);

  async function handleSelect(item) {
    if (item.type === "dir") return;

    const exists = tabs.findIndex((t) => t.path === item.path);
    if (exists !== -1) {
      setActive(exists);
      return;
    }

    const res = await fetch(item.download_url);
    const code = await res.text();

    const newTab = { name: item.name, path: item.path, code };
    setTabs([...tabs, newTab]);
    setActive(tabs.length);
  }

  function closeTab(index) {
    const updated = tabs.filter((_, i) => i !== index);
    setTabs(updated);
    if (active >= updated.length) setActive(updated.length - 1);
  }

  return (
    <div className="app">
      {/* LEFT SIDEBAR */}
      <div className="sidebar">

        {/* 🔎 SINGLE REPO INPUT FIELD */}
        <div style={{ marginBottom: "12px" }}>
          <input
            type="text"
            placeholder="username/repository"
            value={repoInput}
            onChange={(e) => setRepoInput(e.target.value)}
            className="search-input"
            style={{ marginBottom: "6px" }}
          />

          <button
            style={{
              width: "100%",
              padding: "8px",
              background: "#238636",
              borderRadius: "6px",
              border: "none",
              color: "white",
              marginTop: "4px",
              cursor: "pointer"
            }}
            onClick={() => {
              if (!repoInput.includes("/")) {
                alert("Enter in format: username/repository");
                return;
              }

              const [owner, repo] = repoInput.split("/");

              setRepoOwner(owner);
              setRepoName(repo);

              loadRepo(owner, repo);
            }}
          >
            Load Repository
          </button>
        </div>

        {/* 🔍 SEARCH INSIDE FOLDER TREE */}
        <input
          className="search-input"
          type="text"
          placeholder="Search files..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        {/* Folder Tree */}
        {root ? (
          <FolderTree
            root={root}
            search={searchText}
            repoOwner={repoOwner}
            repoName={repoName}
            onFileClick={handleSelect}
          />
        ) : (
          <p>Loading repository...</p>
        )}
      </div>

      {/* RIGHT SIDE VIEWER */}
      <div className="main">
        <div className="tabs">
          {tabs.map((tab, i) => (
            <div
              key={i}
              className={`tab ${i === active ? "active" : ""}`}
              onClick={() => setActive(i)}
            >
              {tab.name}
              <span
                className="close"
                onClick={(e) => {
                  e.stopPropagation();
                  closeTab(i);
                }}
              >
                ×
              </span>
            </div>
          ))}
        </div>

        <div className="viewer">
          {tabs.length > 0 ? (
            <CodeViewer
              key={tabs[active]?.path}
              content={tabs[active].code}
            />
          ) : (
            <div style={{ color: "#7a8fa6", fontStyle: "italic" }}>
              Open a file to view its code
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
