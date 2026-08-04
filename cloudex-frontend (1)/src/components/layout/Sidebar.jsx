 import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutGrid,
  Files,
  Trash2,
  Settings,
  LogOut,
  Cloud,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { initials } from "../../utils/format";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { to: "/files", label: "My Files", icon: Files },
  { to: "/trash", label: "Trash", icon: Trash2 },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-ink/40 z-30 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed lg:static z-40 top-0 left-0 h-full w-64 bg-ink text-white flex flex-col transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex items-center gap-2.5 px-6 h-16 border-b border-white/10">
          <div className="w-8 h-8 rounded-lg bg-cobalt flex items-center justify-center">
            <Cloud size={17} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="font-display font-semibold text-lg tracking-tight">
            CLOudex
          </span>
        </div>

        <nav className="flex-1 px-3 py-5 space-y-1">
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 pb-4 border-t border-white/10 pt-4">
          <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg mb-1">
            <div className="w-8 h-8 rounded-full bg-cobalt/30 flex items-center justify-center text-xs font-semibold text-white shrink-0">
              {initials(user?.name) || "U"}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-white/50 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-white/60 hover:bg-white/5 hover:text-white transition-colors disabled:opacity-50"
          >
            <LogOut size={16} />
            {loggingOut ? "Logging out…" : "Log out"}
          </button>
        </div>
      </aside>
    </>
  );
}
