import { FaBars } from "react-icons/fa";

export default function RepoHeader({ onToggleSidebar }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-[#0b1220] border-b border-gray-800">
      <button
        onClick={onToggleSidebar}
        className="p-2 rounded bg-gray-800 hover:bg-gray-700 text-cyan-400"
        title="Toggle folder tree"
      >
        <FaBars />
      </button>

      <div className="font-semibold text-white tracking-wide">
        Repo Search
      </div>
    </div>
  );
}
