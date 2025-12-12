import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { FaFile, FaFolder, FaFolderOpen } from "react-icons/fa";

function highlight(text, search) {
  if (!search) return text;
  const index = text.toLowerCase().indexOf(search.toLowerCase());
  if (index === -1) return text;

  return (
    <>
      {text.substring(0, index)}
      <span style={{ color: "#58a6ff", fontWeight: 600 }}>
        {text.substring(index, index + search.length)}
      </span>
      {text.substring(index + search.length)}
    </>
  );
}

function TreeLeaf({ item, search, onFileClick }) {
  const [open, setOpen] = useState(false);
  const [children, setChildren] = useState(item.children || null);
  const [loading, setLoading] = useState(false);

  const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());

  async function toggle() {
    if (item.type !== "dir") return;

    if (!children) {
      setLoading(true);
      const res = await fetch(item.url);
      const json = await res.json();
      setChildren(json);
      setLoading(false);
      setOpen(true);
      return;
    }

    setOpen(!open);
  }

  const filteredChildren = useMemo(() => {
    if (!children) return null;
    if (!search) return children;

    return children.filter((child) =>
      child.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [children, search]);

  const shouldShow =
    !search ||
    matchesSearch ||
    (filteredChildren && filteredChildren.length > 0);

  if (!shouldShow) return null;

  return (
    <div>
      <div
        className="tree-item"
        onClick={() =>
          item.type === "dir" ? toggle() : onFileClick(item)
        }
      >
        {item.type === "dir"
          ? open
            ? <FaFolderOpen />
            : <FaFolder />
          : <FaFile />}

        <div style={{ fontSize: 14 }}>
          {highlight(item.name, search)}
          {loading ? " •" : ""}
        </div>
      </div>

      <AnimatePresence>
        {open && filteredChildren && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ overflow: "hidden" }}
            className="tree-children"
          >
            {filteredChildren.map((child) => (
              <TreeLeaf
                key={child.path}
                item={child}
                search={search}
                onFileClick={onFileClick}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FolderTree({
  root,
  search,
  repoOwner,
  repoName,
  onFileClick
}) {
  if (!root) return null;

  return (
    <div>
    <br></br>
      {/* 🔥 Dynamic Repo Header */}
      <div className="repo-header">
        <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
          <path
            fill="#fff"
            d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59..."
          />
        </svg>
        <div>{repoOwner} / {repoName}</div>
      </div>

      {/* 📁 Folder Tree */}
      <div style={{ marginTop: 8 }}>
        {root.map((item) => (
          <TreeLeaf
            key={item.path}
            item={item}
            search={search}
            onFileClick={onFileClick}
          />
        ))}
      </div>
    </div>
  );
}
