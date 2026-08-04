import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const titles = {
  "/dashboard": "Dashboard",
  "/files": "My Files",
  "/trash": "Trash",
  "/settings": "Settings",
};

export default function AppShell() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const title = titles[location.pathname] || "CLOudex";

  return (
    <div className="flex min-h-screen bg-paper">
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar onMenuClick={() => setMenuOpen(true)} title={title} />
        <main className="flex-1 px-4 lg:px-8 py-6 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
