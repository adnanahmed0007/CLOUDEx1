 import { Menu, Search, Moon, Sun } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";

export default function Topbar({ onMenuClick, title }) {
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  const { darkMode, setDarkMode } = useTheme();

  const submitSearch = (e) => {
    e.preventDefault();

    if (q.trim()) {
      navigate(`/files?q=${encodeURIComponent(q.trim())}`);
    }
  };

  return (
    <header className="h-16 sticky top-0 z-20 flex items-center gap-4 px-4 lg:px-8 border-b border-gray-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur transition-colors">
      {/* Mobile Menu */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-1 text-gray-600 dark:text-gray-300 hover:text-cobalt"
        aria-label="Open menu"
      >
        <Menu size={22} />
      </button>

      {/* Title */}
      <h1 className="hidden sm:block font-display text-lg font-semibold text-gray-900 dark:text-white">
        {title}
      </h1>

      {/* Search */}
      <form
        onSubmit={submitSearch}
        className="ml-auto w-full max-w-xs"
      >
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
          />

          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search your files..."
            className="w-full rounded-lg border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cobalt transition-colors"
          />
        </div>
      </form>

      {/* Theme Toggle */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="ml-3 p-2 rounded-lg bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition"
        aria-label="Toggle Theme"
      >
        {darkMode ? (
          <Sun className="w-5 h-5 text-yellow-400" />
        ) : (
          <Moon className="w-5 h-5 text-gray-700" />
        )}
      </button>
    </header>
  );
}
