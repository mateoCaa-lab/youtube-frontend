import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getFeed } from "../services/api";
import { STORAGE_URL } from "../config";

function SubscriptionsPage() {
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFeed()
      .then((data) => setVideos(data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <p className="text-zinc-400">Cargando...</p>
    </div>
  );

  if (videos.length === 0) return (
    <div className="text-center py-20 text-zinc-500">
      <p className="text-5xl mb-4">🔔</p>
      <p className="text-lg">No hay videos de tus suscripciones</p>
      <p className="text-sm mt-1">Suscríbete a canales para ver sus videos aquí</p>
    </div>
  );

  return (
    <div>
      <h2 className="text-lg font-semibold text-white mb-6">Suscripciones</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {videos.map((video) => (
          <div
            key={video.id}
            onClick={() => navigate(`/videos/${video.id}`)}
            className="cursor-pointer group"
          >
            <div className="w-full aspect-video bg-zinc-800 rounded-xl overflow-hidden mb-3">
              {video.thumbnail_path ? (
                <img
                  src={`${STORAGE_URL}/${video.thumbnail_path}`}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-600">
                  <span className="text-4xl">▶</span>
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-full bg-red-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                {video.channel?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-white text-sm font-medium line-clamp-2">{video.title}</h3>
                <p className="text-zinc-400 text-xs mt-1">{video.channel?.name}</p>
                <p className="text-zinc-500 text-xs">{video.views} vistas</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SubscriptionsPage;