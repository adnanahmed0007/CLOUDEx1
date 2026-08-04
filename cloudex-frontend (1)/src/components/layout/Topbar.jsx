import { Menu, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Topbar({ onMenuClick, title }) {
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  const submitSearch = (e) => {
    e.preventDefault();
    if (q.trim()) navigate(`/files?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <header className="h-16 border-b border-line bg-surface/80 backdrop-blur sticky top-0 z-20 flex items-center gap-4 px-4 lg:px-8">
      <button
        onClick={onMenuClick}
        className="lg:hidden text-ink-muted hover:text-ink p-1"
        aria-label="Open menu"
      >
        <Menu size={22} />
      </button>

      <h1 className="font-display font-semibold text-lg text-ink hidden sm:block">
        {title}
      </h1>

      <form onSubmit={submitSearch} className="ml-auto w-full max-w-xs">
        <div className="relative">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint"
          />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search your files…"
            className="w-full bg-paper border border-line rounded-lg pl-9 pr-3 py-2 text-sm placeholder:text-ink-faint focus:bg-surface transition-colors"
          />
        </div>
      </form>
    </header>
  );
}
