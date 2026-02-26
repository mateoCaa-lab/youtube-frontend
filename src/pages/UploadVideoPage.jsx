// UploadVideoPage.jsx
// Página para subir un video a un canal.
// El usuario selecciona el canal, título, descripción,
// archivo de video y thumbnail opcional.

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { uploadVideo, getMyChannels } from "../services/api";

function UploadVideoPage() {
  const { id } = useParams(); // id del canal
  const navigate = useNavigate();

  const [channel, setChannel] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    getMyChannels()
      .then((data) => {
        const found = data.channels.find((c) => c.id === parseInt(id));
        if (!found) { navigate("/my-channels"); return; }
        setChannel(found);
      })
      .catch(console.error);
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!videoFile) {
      setError("Debes seleccionar un archivo de video");
      return;
    }

    setLoading(true);
    setError(null);
    setProgress("Subiendo video...");

    try {
      // Usamos FormData porque estamos subiendo archivos
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("video", videoFile);
      if (thumbnail) formData.append("thumbnail", thumbnail);

      const data = await uploadVideo(id, formData);
      navigate(`/videos/${data.video.id}`);
    } catch {
      setError("Error al subir el video. Verifica el formato e intenta de nuevo.");
    } finally {
      setLoading(false);
      setProgress(null);
    }
  }

  if (!channel) return (
    <div className="flex items-center justify-center h-64">
      <p className="text-zinc-400">Cargando...</p>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={() => navigate("/my-channels")}
        className="text-zinc-400 hover:text-white text-sm mb-6 flex items-center gap-2"
      >
        ← Volver
      </button>

      <h1 className="text-2xl font-bold text-white mb-2">Subir video</h1>
      <p className="text-zinc-400 text-sm mb-8">
        Canal: <span className="text-red-400">{channel.name}</span>
      </p>

      {error && (
        <div className="bg-red-900/50 border border-red-600 text-red-300 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {progress && (
        <div className="bg-blue-900/50 border border-blue-600 text-blue-300 px-4 py-3 rounded-lg mb-6">
          {progress}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">

        {/* Título */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Título del video
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Ej: Mi primer video"
            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-600 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 transition"
          />
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Descripción
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="Describe tu video..."
            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-600 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 transition resize-none"
          />
        </div>

        {/* Archivo de video */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Archivo de video
          </label>
          <div className="w-full px-4 py-8 bg-zinc-800 border-2 border-dashed border-zinc-600 rounded-lg text-center hover:border-red-500 transition">
            <input
              type="file"
              accept="video/mp4,video/quicktime"
              onChange={(e) => setVideoFile(e.target.files[0])}
              className="hidden"
              id="videoInput"
            />
            <label htmlFor="videoInput" className="cursor-pointer">
              {videoFile ? (
                <div>
                  <p className="text-green-400 font-medium">✓ {videoFile.name}</p>
                  <p className="text-zinc-500 text-xs mt-1">
                    {(videoFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-4xl mb-2">🎬</p>
                  <p className="text-zinc-300 font-medium">
                    Haz clic para seleccionar un video
                  </p>
                  <p className="text-zinc-500 text-xs mt-1">MP4 o MOV, máximo 500MB</p>
                </div>
              )}
            </label>
          </div>
        </div>

        {/* Thumbnail opcional */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Miniatura (opcional)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setThumbnail(e.target.files[0])}
            className="text-sm text-zinc-400 file:mr-3 file:py-1 file:px-3 file:rounded-full file:border-0 file:bg-zinc-600 file:text-white hover:file:bg-zinc-500"
          />
          {thumbnail && (
            <p className="text-zinc-500 text-xs mt-1">✓ {thumbnail.name}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-red-600 hover:bg-red-700 disabled:bg-zinc-600 text-white font-medium py-3 rounded-full transition"
        >
          {loading ? "Subiendo..." : "Subir video"}
        </button>

      </form>
    </div>
  );
}

export default UploadVideoPage;