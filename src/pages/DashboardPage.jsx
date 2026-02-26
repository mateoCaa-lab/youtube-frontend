import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyChannels, deleteChannel } from "../services/api";
import { useAuth } from "../context/AuthContext";

function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyChannels()
      .then((data) => setChannels(data.channels))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  function handleDelete(id) {
    if (!confirm("¿Estás seguro de eliminar este canal?")) return;
    deleteChannel(id)
      .then(() => setChannels((prev) => prev.filter((c) => c.id !== id)))
      .catch(console.error);
  }

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold text-white mb-6">
        Bienvenido, {user.name}
      </h1>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-zinc-300">Mis canales</h2>
        <button
          onClick={() => navigate("/channels/create")}
          className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-2 rounded-full transition"
        >
          + Crear canal
        </button>
      </div>

      {loading && <p className="text-zinc-400">Cargando canales...</p>}

      {!loading && channels.length === 0 && (
        <div className="text-center py-20 text-zinc-500">
          <p className="text-5xl mb-4">📺</p>
          <p className="text-lg">No tienes canales todavía</p>
          <p className="text-sm mt-1">Crea uno para empezar a subir videos</p>
        </div>
      )}

      <div className="flex flex-col gap-4 pt-2">
        {channels.map((channel) => (
          <div
            key={channel.id}
            className="bg-zinc-800 rounded-xl p-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 hover:bg-zinc-700 transition"
          >
            <div className="flex items-center gap-4 flex-1">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-red-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                {channel.avatar ? (
                  <img
                    src={`http://localhost:8000/storage/${channel.avatar}`}
                    alt={channel.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  channel.name.charAt(0).toUpperCase()
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3
                  onClick={() => navigate(`/channels/${channel.id}`)}
                  className="text-white font-semibold cursor-pointer hover:text-red-400 transition"
                >
                  {channel.name}
                </h3>
                <p className="text-zinc-400 text-sm truncate">
                  {channel.description || "Sin descripción"}
                </p>
                <span className="text-xs text-zinc-500 capitalize">
                  Rol: {channel.pivot.role}
                </span>
              </div>
            </div>

            <div className="flex gap-3 flex-shrink-0">
              <button
                onClick={() => navigate(`/channels/${channel.id}/upload`)}
                className="bg-red-600 hover:bg-red-700 text-white text-sm px-5 py-2 rounded-full transition"
              >
                ↑ Subir video
              </button>
              <button
                onClick={() => navigate(`/channels/${channel.id}/edit`)}
                className="bg-zinc-600 hover:bg-zinc-500 text-white text-sm px-5 py-2 rounded-full transition"
              >
                Editar
              </button>
              {channel.pivot.role === "owner" && (
                <button
                  onClick={() => handleDelete(channel.id)}
                  className="bg-red-800 hover:bg-red-700 text-white text-sm px-5 py-2 rounded-full transition"
                >
                  Eliminar
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DashboardPage;