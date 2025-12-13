import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { FaFile, FaFolder, FaFolderOpen } from "react-icons/fa";

function highlight(text, search) {
  if (!search) return text;
  const i = text.toLowerCase().indexOf(search.toLowerCase());
  if (i === -1) return text;
  return (
    <>
      {text.slice(0, i)}
      <span className="text-blue-400 font-semibold">
        {text.slice(i, i + search.length)}
      </span>
      {text.slice(i + search.length)}
    </>
  );
}

function TreeLeaf({ item, search, onFileClick }) {
  const [open, setOpen] = useState(false);
  const [children, setChildren] = useState(null);

  async function toggle() {
    if (item.type !== "dir") return;
    if (!children) {
      const res = await fetch(item.url);
      setChildren(await res.json());
      setOpen(true);
    } else setOpen(!open);
  }

  const filtered = useMemo(() => {
    if (!children || !search) return children;
    return children.filter(c =>
      c.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [children, search]);

  if (
    search &&
    !item.name.toLowerCase().includes(search.toLowerCase()) &&
    (!filtered || !filtered.length)
  ) return null;

  return (
    <div className="flex flex-col">
      <div
        className="flex items-center gap-2 p-1 cursor-pointer rounded hover:bg-gray-800"
        onClick={() =>
          item.type === "dir" ? toggle() : onFileClick(item)
        }
      >
        {item.type === "dir"
          ? open
            ? <FaFolderOpen className="text-yellow-400" />
            : <FaFolder className="text-yellow-400" />
          : <FaFile className="text-blue-400" />
        }
        <span className="text-sm">{highlight(item.name, search)}</span>
      </div>

      <AnimatePresence>
        {open && filtered && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            className="ml-4 border-l border-gray-700"
          >
            {filtered.map(child => (
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

export default function FolderTree({ root, search, onFileClick }) {
  return (
    <div className="flex flex-col gap-1">
      {root.map(item => (
        <TreeLeaf
          key={item.path}
          item={item}
          search={search}
          onFileClick={onFileClick}
        />
      ))}
    </div>
  );
}
