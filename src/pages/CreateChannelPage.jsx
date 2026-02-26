import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createChannel } from "../services/api";

function CreateChannelPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await createChannel(formData);
      navigate("/my-channels");
    } catch {
      setError("Error al crear el canal. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      <button
        onClick={() => navigate("/my-channels")}
        className="text-zinc-400 hover:text-white text-sm mb-6 flex items-center gap-2"
      >
        ← Volver
      </button>

      <h1 className="text-2xl font-bold text-white mb-8">Crear canal</h1>

      {error && (
        <div className="bg-red-900/50 border border-red-600 text-red-300 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Nombre del canal
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Ej: Mi canal de tecnología"
            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-600 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Descripción
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            placeholder="Describe de qué trata tu canal..."
            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-600 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 transition resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-red-600 hover:bg-red-700 disabled:bg-zinc-600 text-white font-medium py-3 rounded-full transition"
        >
          {loading ? "Creando..." : "Crear canal"}
        </button>
      </form>
    </div>
  );
}

export default CreateChannelPage;