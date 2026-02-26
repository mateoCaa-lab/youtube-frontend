import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { searchVideos } from "../services/api";
import { STORAGE_URL } from "../config";

function SearchPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");

  const [videos, setVideos] = useState([]);
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    searchVideos(query)
      .then((data) => {
        setVideos(data.videos);
        setChannels(data.channels);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [query]);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <p className="text-zinc-400">Buscando...</p>
    </div>
  );

  return (
    <div>
      <h2 className="text-white font-semibold mb-6">
        Resultados para: <span className="text-red-400">"{query}"</span>
      </h2>

      {/* ── Canales ── */}
      {channels.length > 0 && (
        <div className="mb-8">
          <h3 className="text-zinc-400 text-sm font-medium mb-3">Canales</h3>
          <div className="flex flex-col gap-3">
            {channels.map((channel) => (
              <div
                key={channel.id}
                onClick={() => navigate(`/channels/${channel.id}`)}
                className="flex items-center gap-4 bg-zinc-800 hover:bg-zinc-700 rounded-xl p-4 cursor-pointer transition"
              >
                <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  {channel.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-white font-medium">{channel.name}</p>
                  <p className="text-zinc-400 text-sm">{channel.description || "Sin descripción"}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Videos ── */}
      {videos.length > 0 && (
        <div>
          <h3 className="text-zinc-400 text-sm font-medium mb-3">Videos</h3>
          <div className="flex flex-col gap-4">
            {videos.map((video) => (
              <div
                key={video.id}
                onClick={() => navigate(`/videos/${video.id}`)}
                className="flex gap-4 cursor-pointer group"
              >
                <div className="w-40 h-24 bg-zinc-800 rounded-lg overflow-hidden flex-shrink-0">
                  {video.thumbnail_path ? (
                    <img
                      src={`${STORAGE_URL}/${video.thumbnail_path}`}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-600">
                      <span className="text-2xl">▶</span>
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="text-white font-medium group-hover:text-red-400 transition">
                    {video.title}
                  </h4>
                  <p className="text-zinc-400 text-sm mt-1">{video.channel?.name}</p>
                  <p className="text-zinc-500 text-xs mt-1">{video.views} vistas</p>
                  {video.description && (
                    <p className="text-zinc-500 text-xs mt-2 line-clamp-2">{video.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sin resultados */}
      {videos.length === 0 && channels.length === 0 && (
        <div className="text-center py-20 text-zinc-500">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-lg">No se encontraron resultados para "{query}"</p>
        </div>
      )}
    </div>
  );
}

export default SearchPage;