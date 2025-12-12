import { useState, useEffect } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula, vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { FaCopy, FaExpand, FaPalette, FaTimes } from "react-icons/fa";

export default function CodeViewer({ content, onClose }) {
  const THEMES = { "VS Code Dark": vscDarkPlus, Dracula: dracula };
  const [themeName, setThemeName] = useState("VS Code Dark");
  const [openSelector, setOpenSelector] = useState(false);
  const [zoom, setZoom] = useState(1);

  function copyCode() { navigator.clipboard.writeText(content || "").catch(() => {}); }
  function toggleFullscreen() {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen().catch(()=>{});
    else document.exitFullscreen().catch(()=>{});
  }

  const fontSize = Math.max(10, Math.round(14 * zoom));

  // Re-render on zoom change without needing theme change
  useEffect(() => {}, [zoom]);

  return (
    <div style={{ position:"relative", height:"100%", display:"flex", flexDirection:"column" }}>
      {/* Toolbar now scrolls with code */}
      <div style={{ display:"flex", gap:8, marginBottom:8 }}>
        <div className="theme-picker icon-btn" onClick={()=>setOpenSelector(!openSelector)}><FaPalette/></div>
        <div className="icon-btn" onClick={copyCode} title="Copy code"><FaCopy/></div>
        <div className="icon-btn" onClick={toggleFullscreen} title="Fullscreen"><FaExpand/></div>
        {onClose && <div className="icon-btn" onClick={onClose} title="Close tab"><FaTimes/></div>}
      </div>

      {openSelector && (
        <div style={{ marginBottom: 8, background:"#071021", border:"1px solid rgba(255,255,255,0.04)", borderRadius:8, padding:8 }}>
          <div style={{ color:"#9fb6d8", fontSize:13, marginBottom:6 }}>Select theme</div>
          {Object.keys(THEMES).map(t=>(
            <div key={t} className="tree-item" style={{padding:"8px 10px", borderRadius:6, cursor:"pointer"}} onClick={()=>{setThemeName(t); setOpenSelector(false);}}>{t}</div>
          ))}
        </div>
      )}

      <div style={{ flex:1, overflow:"auto" }} className="code-wrap">
        <SyntaxHighlighter
          language="python"
          style={THEMES[themeName]}
          customStyle={{ background:"transparent", fontSize:`${fontSize}px`, borderRadius:8, padding:12, lineHeight:1.45, whiteSpace:"pre-wrap", wordBreak:"break-word" }}
          wrapLongLines
          showLineNumbers
        >
          {content || "# Select a .py file from left panel"}
        </SyntaxHighlighter>
      </div>

      {/* Zoom controls scroll with code */}
      <div style={{ display:"flex", gap:8, marginTop:8, alignItems:"center" }}>
        <button onClick={()=>setZoom(z=>Math.max(0.6, +(z-0.1).toFixed(2)))}>A-</button>
        <div style={{ color:"#cfe8ff" }}>{Math.round(zoom*100)}%</div>
        <button onClick={()=>setZoom(z=>(+(z+0.1).toFixed(2)))}>A+</button>
      </div>
    </div>
  );
}
