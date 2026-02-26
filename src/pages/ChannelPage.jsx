import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getChannel, toggleSubscription } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { STORAGE_URL } from "../config";

function ChannelPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);
  const [subscribed, setSubscribed] = useState(false);
  const [subscribersCount, setSubscribersCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getChannel(id)
      .then((data) => {
        setChannel(data.channel);
        setVideos(data.videos);
        setSubscribersCount(data.subscribers_count);
        setSubscribed(data.is_subscribed);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSubscribe() {
    try {
      const data = await toggleSubscription(id);
      setSubscribed(data.subscribed);
      setSubscribersCount(data.subscribers_count);
    } catch (err) {
      console.error(err);
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <p className="text-zinc-400">Cargando canal...</p>
    </div>
  );

  if (!channel) return (
    <div className="flex items-center justify-center h-64">
      <p className="text-zinc-400">Canal no encontrado</p>
    </div>
  );

  return (
    <div>
      {/* ── Banner del canal ── */}
      <div className="w-full h-32 bg-zinc-800 rounded-xl overflow-hidden mb-4">
        {channel.banner ? (
          <img
            src={`${STORAGE_URL}/${channel.banner}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-red-900 to-zinc-800" />
        )}
      </div>

      {/* ── Info del canal ── */}
      <div className="flex items-center justify-between mb-8 px-2">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-red-600 flex items-center justify-center text-white text-2xl font-bold">
            {channel.avatar ? (
              <img
                src={`${STORAGE_URL}/${channel.avatar}`}
                alt={channel.name}
                className="w-full h-full object-cover"
              />
            ) : (
              channel.name?.charAt(0).toUpperCase()
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{channel.name}</h1>
            <p className="text-zinc-400 text-sm">{subscribersCount} suscriptores</p>
            {channel.description && (
              <p className="text-zinc-500 text-sm mt-1">{channel.description}</p>
            )}
          </div>
        </div>

        {!channel.users?.some((u) => u.id === user?.id) && (
          <button
            onClick={handleSubscribe}
            className={`px-6 py-2 rounded-full text-sm font-medium transition ${
              subscribed
                ? "bg-zinc-600 hover:bg-zinc-500 text-white"
                : "bg-red-600 hover:bg-red-700 text-white"
            }`}
          >
            {subscribed ? "Suscrito ✓" : "Suscribirse"}
          </button>
        )}
      </div>

      {/* ── Videos del canal ── */}
      <h2 className="text-white font-semibold mb-4">Videos</h2>

      {videos.length === 0 ? (
        <div className="text-center py-20 text-zinc-500">
          <p className="text-4xl mb-3">🎬</p>
          <p>Este canal no tiene videos todavía</p>
        </div>
      ) : (
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
              <h3 className="text-white text-sm font-medium line-clamp-2">{video.title}</h3>
              <p className="text-zinc-500 text-xs mt-1">{video.views} vistas</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ChannelPage;