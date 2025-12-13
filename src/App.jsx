import { useEffect, useState } from "react";
import CodeViewer from "./components/CodeViewer";
import FolderTree from "./components/FolderTree";
import RepoHeader from "./components/RepoHeader";

export default function App() {
  const [root, setRoot] = useState(null);
  const [repoInput, setRepoInput] = useState("PTHARRISH/Python-Notes");
  const [search, setSearch] = useState("");
  const [tabs, setTabs] = useState([]);
  const [active, setActive] = useState(0);
  const [showSidebar, setShowSidebar] = useState(true);

  async function loadRepo() {
    if (!repoInput.includes("/")) {
      alert("Use format: username/repository");
      return;
    }

    const [owner, repo] = repoInput.split("/");
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
        alert("Repository not found");
      }
    } catch {
      alert("Failed to load repository");
    }
  }

  useEffect(() => {
    loadRepo();
  }, []);

  async function openFile(item) {
    if (item.type === "dir") return;

    const res = await fetch(item.download_url);
    const code = await res.text();

    setTabs(t => [...t, { path: item.path, code }]);
    setActive(tabs.length);
  }

  return (
    <div className="flex flex-col h-screen bg-[#011627] text-white">
      {/* HEADER */}
      <RepoHeader onToggleSidebar={() => setShowSidebar(s => !s)} />

      {/* BODY */}
      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR */}
        {showSidebar && (
          <div className="w-80 bg-[#0e1116] p-3 border-r border-gray-800 overflow-y-auto">

            {/* Repo Search */}
            <div className="mb-3">
              <input
                value={repoInput}
                onChange={e => setRepoInput(e.target.value)}
                placeholder="username/repository"
                className="w-full px-3 py-2 mb-2 rounded bg-[#0b1220] border border-gray-800"
              />
              <button
                onClick={loadRepo}
                className="w-full py-2 rounded bg-green-600 hover:bg-green-700"
              >
                Load Repository
              </button>
            </div>

            {/* File Search */}
            <input
              className="w-full px-3 py-2 mb-3 rounded bg-[#0b1220] border border-gray-800"
              placeholder="Search files..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />

            {/* Folder Tree */}
            {root && (
              <FolderTree
                root={root}
                search={search}
                onFileClick={openFile}
              />
            )}
          </div>
        )}

        {/* MAIN */}
        <div className="flex-1 p-3 overflow-hidden">
          {tabs.length ? (
            <CodeViewer content={tabs[active].code} />
          ) : (
            <div className="text-gray-500 italic">
              Open a file to view code
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
