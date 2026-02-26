// VideoPage.jsx
// Página de reproducción de un video.
// Muestra el video, likes, comentarios y botón de suscripción.

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getVideo, toggleLike, addComment, deleteComment, toggleSubscription } from "../services/api";
import { useAuth } from "../context/AuthContext";

function VideoPage() {
  const { id } = useParams();
  const { user } = useAuth();

  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [subscribed, setSubscribed] = useState(false);
  const [subscribersCount, setSubscribersCount] = useState(0);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  useEffect(() => {
      getVideo(id)
        .then((data) => {
          setVideo(data);
          setLikesCount(data.likes_count || 0);
          setSubscribed(data.is_subscribed || false);
          setComments(data.comments || []);
          setSubscribersCount(data.subscribers_count || 0);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
  }, [id]);

  async function handleLike() {
    try {
      const data = await toggleLike(id);
      setLiked(data.liked);
      setLikesCount(data.likes_count);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleSubscribe() {
    try {
      const data = await toggleSubscription(video.channel.id);
      setSubscribed(data.subscribed);
      setSubscribersCount(data.subscribers_count);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleComment(e) {
    e.preventDefault();
    if (!comment.trim()) return;
    try {
      const data = await addComment(id, comment);
      setComments((prev) => [data.comment, ...prev]);
      setComment("");
    } catch (err) {
      console.error(err);
    }
  }

  async function handleDeleteComment(commentId) {
    try {
      await deleteComment(commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (err) {
      console.error(err);
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <p className="text-zinc-400">Cargando video...</p>
    </div>
  );

  if (!video) return (
    <div className="flex items-center justify-center h-64">
      <p className="text-zinc-400">Video no encontrado</p>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto">
      {/* ── Reproductor de video ── */}
      <div className="w-full aspect-video bg-black rounded-xl overflow-hidden mb-4">
        <video
          src={`http://localhost:8000/storage/${video.video_path}`}
          controls
          className="w-full h-full"
        />
      </div>

      {/* ── Título y acciones ── */}
      <h1 className="text-xl font-bold text-white mb-3">{video.title}</h1>

      <div className="flex justify-between items-center mb-4 pb-4 border-b border-zinc-700">
        {/* Info del canal */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white font-bold">
            {video.channel?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-white font-medium">{video.channel?.name}</p>
            <p className="text-zinc-400 text-sm">{subscribersCount} suscriptores</p>
          </div>
          {/* Botón suscribirse */}
          <button
            onClick={handleSubscribe}
            className={`ml-4 px-4 py-2 rounded-full text-sm font-medium transition ${
              subscribed
                ? "bg-zinc-600 hover:bg-zinc-500 text-white"
                : "bg-white hover:bg-zinc-200 text-black"
            }`}
          >
            {subscribed ? "Suscrito ✓" : "Suscribirse"}
          </button>
        </div>

        {/* Botón like */}
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition ${
            liked
              ? "bg-zinc-600 text-white"
              : "bg-zinc-700 hover:bg-zinc-600 text-white"
          }`}
        >
          👍 {likesCount}
        </button>
      </div>

      {/* ── Descripción ── */}
      {video.description && (
        <div className="bg-zinc-800 rounded-xl p-4 mb-6">
          <p className="text-zinc-300 text-sm whitespace-pre-wrap">{video.description}</p>
          <p className="text-zinc-500 text-xs mt-2">{video.views} vistas</p>
        </div>
      )}

      {/* ── Comentarios ── */}
      <div>
        <h2 className="text-white font-semibold mb-4">
          {comments.length} comentarios
        </h2>

        {/* Formulario nuevo comentario */}
        <form onSubmit={handleComment} className="flex gap-3 mb-6">
          <div className="w-9 h-9 rounded-full bg-red-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <input
              type="text"
              placeholder="Agrega un comentario..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full bg-transparent border-b border-zinc-600 text-white text-sm py-1 focus:outline-none focus:border-white placeholder-zinc-500"
            />
            {comment && (
              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setComment("")}
                  className="text-xs text-zinc-400 hover:text-white px-3 py-1 rounded-full"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-full"
                >
                  Comentar
                </button>
              </div>
            )}
          </div>
        </form>

        {/* Lista de comentarios */}
        <div className="flex flex-col gap-4">
          {comments.map((c) => (
            <div key={c.id} className="flex gap-3">
              <div className="w-9 h-9 rounded-full bg-zinc-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                {c.user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-white text-sm font-medium">{c.user?.name}</span>
                  <span className="text-zinc-500 text-xs">
                    {new Date(c.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-zinc-300 text-sm mt-1">{c.content}</p>
              </div>
              {/* Solo el autor puede eliminar su comentario */}
              {c.user?.id === user?.id && (
                <button
                  onClick={() => handleDeleteComment(c.id)}
                  className="text-zinc-500 hover:text-red-400 text-xs"
                >
                  🗑
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default VideoPage;