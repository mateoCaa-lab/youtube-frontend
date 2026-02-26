import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Layout({ children }) {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");

  function handleSearch(e) {
    e.preventDefault();
    if (search.trim()) navigate(`/search?q=${encodeURIComponent(search)}`);
  }

  function isActive(path) {
    return location.pathname === path
      ? "bg-zinc-700 text-white"
      : "text-zinc-300 hover:bg-zinc-700 hover:text-white";
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-white">

      {/* ── HEADER ── */}
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-around px-4 h-14 bg-zinc-900 border-b border-zinc-800 gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2 rounded-full hover:bg-zinc-700 flex flex-col gap-1"
          >
            <div className="w-5 h-0.5 bg-white"></div>
            <div className="w-5 h-0.5 bg-white"></div>
            <div className="w-5 h-0.5 bg-white"></div>
          </button>
          <span onClick={() => navigate("/")} className="text-xl font-bold text-red-500 cursor-pointer">
            Youtube
          </span>
        </div>

        <form onSubmit={handleSearch} className="flex items-center flex-1 max-w-md mx-4">
          <input
            type="text"
            placeholder="Buscar"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-2 bg-zinc-800 border border-zinc-600 rounded-l-full text-sm text-white placeholder-zinc-400 focus:outline-none focus:border-blue-500"
          />
          <button type="submit" className="px-4 py-1.5 border-1 border-zinc-600 bg-zinc-800 rounded-r-full hover:bg-zinc-700 transition">
            🔍
          </button>
        </form>

        <div className="flex items-center gap-4">
          <span className="hidden md:block text-sm text-zinc-300 truncate max-w-32">{user?.name}</span>
          <div onClick={() => navigate("/my-channels")} className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-sm font-bold cursor-pointer">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <button onClick={() => setUser(null)} className="hidden sm:block text-xs text-zinc-400 hover:text-white">
            Salir
          </button>
        </div>
      </header>

      {/* ── OVERLAY móvil ── */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── LAYOUT ── */}
      <div style={{ paddingTop: "56px" }}>
        <aside style={{ width: "64px" }} className={`
          fixed top-14 left-0 bottom-0 bg-zinc-900 z-40 border-r border-zinc-800
          transition-transform duration-200
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}>
          <nav className="flex flex-col gap-1 p-2 mt-2">
            <SidebarItem icon="🏠" label="Inicio" active={isActive("/")} onClick={() => { navigate("/"); setSidebarOpen(false); }} />
            <SidebarItem icon="📺" label="Canales" active={isActive("/my-channels")} onClick={() => { navigate("/my-channels"); setSidebarOpen(false); }} />
            <SidebarItem icon="🔔" label="Subs" active={isActive("/subscriptions")} onClick={() => { navigate("/subscriptions"); setSidebarOpen(false); }} />
          </nav>
        </aside>

        <main style={{ marginLeft: "64px", minHeight: "calc(100vh - 56px)", padding: "24px 32px" }} className="bg-zinc-900">
          {children}
        </main>
      </div>

    </div>
  );
}

function SidebarItem({ icon, label, active, onClick }) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center gap-1 w-full px-2 py-3 rounded-lg transition-colors ${active}`}>
      <span className="text-xl">{icon}</span>
      <span className="text-xs">{label}</span>
    </button>
  );
}

export default Layout;