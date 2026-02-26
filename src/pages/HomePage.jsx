// HomePage.jsx
// Página principal — muestra el feed de todos los videos
// como la página de inicio de YouTube

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getVideos } from "../services/api";

function HomePage() {
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getVideos()
      .then((data) => setVideos(data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <p className="text-zinc-400">Cargando videos...</p>
    </div>
  );

  if (videos.length === 0) return (
    <div className="text-center py-20 text-zinc-500">
      <p className="text-5xl mb-4">🎬</p>
      <p className="text-lg">No hay videos todavía</p>
      <p className="text-sm mt-1">Crea un canal y sube el primer video</p>
    </div>
  );

  return (
    <div>
      <h2 className="text-lg font-semibold text-white mb-6">Inicio</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} onClick={() => navigate(`/videos/${video.id}`)} />
        ))}
      </div>
    </div>
  );
}

function VideoCard({ video, onClick }) {
  return (
    <div onClick={onClick} className="cursor-pointer group">
      {/* Thumbnail */}
      <div className="w-full aspect-video bg-zinc-800 rounded-xl overflow-hidden mb-3">
        {video.thumbnail_path ? (
          <img
            src={`http://localhost:8000/storage/${video.thumbnail_path}`}
            alt={video.title}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-600">
            <span className="text-4xl">▶</span>
          </div>
        )}
      </div>

      {/* Info del video */}
      <div className="flex gap-3">
        {/* Avatar del canal */}
        <div className="w-9 h-9 rounded-full overflow-hidden bg-red-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
          {video.channel?.avatar ? (
            <img
              src={`http://localhost:8000/storage/${video.channel.avatar}`}
              alt={video.channel.name}
              className="w-full h-full object-cover"
            />
          ) : (
            video.channel?.name?.charAt(0).toUpperCase()
          )}
        </div>
        <div>
          <h3 className="text-white text-sm font-medium line-clamp-2 leading-snug">
            {video.title}
          </h3>
          <p className="text-zinc-400 text-xs mt-1">{video.channel?.name}</p>
          <p className="text-zinc-500 text-xs">{video.views} vistas</p>
        </div>
      </div>
    </div>
  );
}

export default HomePage;