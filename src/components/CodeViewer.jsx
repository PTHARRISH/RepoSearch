import { useState } from "react";
import { FaCopy, FaExpand, FaPalette, FaCheck } from "react-icons/fa";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  dracula,
  vscDarkPlus,
  nightOwl,
  oneDark
} from "react-syntax-highlighter/dist/esm/styles/prism";

export default function CodeViewer({ content }) {
  const THEMES = {
    Dracula: dracula,
    "VS Code Dark": vscDarkPlus,
    "Night Owl": nightOwl,
    "One Dark": oneDark
  };

  const [theme, setTheme] = useState("Dracula");
  const [zoom, setZoom] = useState(1);
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex gap-2 mb-2">
        <Icon onClick={() => setOpen(!open)}><FaPalette /></Icon>
        <Icon onClick={() => navigator.clipboard.writeText(content || "")}><FaCopy /></Icon>
        <Icon onClick={() => document.documentElement.requestFullscreen()}><FaExpand /></Icon>
      </div>

      {/* Theme selector */}
      {open && (
        <div className="mb-2 bg-[#071021] border border-gray-700 rounded">
          {Object.keys(THEMES).map(t => (
            <div
              key={t}
              onClick={() => { setTheme(t); setOpen(false); }}
              className={`flex items-center justify-between px-3 py-2 cursor-pointer text-sm
                ${t === theme ? "bg-blue-600 text-white" : "hover:bg-gray-800"}`}
            >
              {t}
              {t === theme && <FaCheck />}
            </div>
          ))}
        </div>
      )}

      {/* Code */}
      <div className="flex-1 overflow-auto">
        <SyntaxHighlighter
          PreTag="div"
          language="python"
          style={THEMES[theme]}
          showLineNumbers
          wrapLongLines
          customStyle={{
            background: "transparent",
            fontSize: `${14 * zoom}px`,
            lineHeight: 1.45,
            margin: 0,
            padding: 12
          }}
        >
          {content || "# Select a file"}
        </SyntaxHighlighter>
      </div>

      {/* Zoom */}
      <div className="flex gap-3 mt-2">
        <Btn onClick={() => setZoom(z => Math.max(0.6, z - 0.1))}>A-</Btn>
        <span className="text-cyan-400">{Math.round(zoom * 100)}%</span>
        <Btn onClick={() => setZoom(z => z + 0.1)}>A+</Btn>
      </div>
    </div>
  );
}

const Icon = ({ children, onClick }) => (
  <button onClick={onClick} className="p-2 bg-gray-800 hover:bg-gray-700 rounded text-cyan-400">
    {children}
  </button>
);

const Btn = ({ children, onClick }) => (
  <button onClick={onClick} className="px-2 py-1 bg-gray-800 rounded">
    {children}
  </button>
);
