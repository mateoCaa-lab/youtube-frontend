// EditChannelPage.jsx
// Página para editar un canal existente. Tiene tres secciones:
// 1. Editar nombre y descripción
// 2. Subir avatar y banner
// 3. Gestionar miembros (agregar/quitar admins, transferir ownership)

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getMyChannels, updateChannel, updateAvatar, updateBanner,
  addMember, removeMember, transferOwnership,
} from "../services/api";
import { useAuth } from "../context/AuthContext";

// Componente de mensaje reutilizable — va FUERA de EditChannelPage
function Msg({ msg }) {
  if (!msg) return null;
  return (
    <p className={`text-sm px-3 py-2 rounded-lg mb-3 ${
      msg.type === "ok"
        ? "bg-green-900/50 text-green-400 border border-green-700"
        : "bg-red-900/50 text-red-400 border border-red-700"
    }`}>
      {msg.text}
    </p>
  );
}

function EditChannelPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [channel, setChannel] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [memberEmail, setMemberEmail] = useState("");
  const [infoMsg, setInfoMsg] = useState(null);
  const [avatarMsg, setAvatarMsg] = useState(null);
  const [bannerMsg, setBannerMsg] = useState(null);
  const [memberMsg, setMemberMsg] = useState(null);

  useEffect(() => {
    getMyChannels().then((data) => {
      const found = data.channels.find((c) => c.id === parseInt(id));
      if (!found) { navigate("/my-channels"); return; }
      setChannel(found);
      setFormData({ name: found.name, description: found.description || "" });
      setIsOwner(found.pivot.role === "owner");
    }).catch(console.error);
  }, [id]);

  function handleChange(e) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleUpdateInfo(e) {
    e.preventDefault();
    try {
      await updateChannel(id, formData);
      setInfoMsg({ type: "ok", text: "Canal actualizado correctamente" });
    } catch {
      setInfoMsg({ type: "err", text: "Error al actualizar el canal" });
    }
  }

  async function handleAvatarChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const data = await updateAvatar(id, file);
      setAvatarMsg({ type: "ok", text: "Avatar actualizado correctamente" });
      setChannel((prev) => ({ ...prev, avatar: data.avatar }));
    } catch {
      setAvatarMsg({ type: "err", text: "Error al actualizar el avatar" });
    }
  }

  async function handleBannerChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    try {
      await updateBanner(id, file);
      setBannerMsg({ type: "ok", text: "Banner actualizado correctamente" });
    } catch {
      setBannerMsg({ type: "err", text: "Error al actualizar el banner" });
    }
  }

  async function handleAddMember(e) {
    e.preventDefault();
    try {
      await addMember(id, memberEmail);
      setMemberMsg({ type: "ok", text: "Miembro agregado correctamente" });
      setMemberEmail("");
      const data = await getMyChannels();
      const found = data.channels.find((c) => c.id === parseInt(id));
      setChannel(found);
    } catch {
      setMemberMsg({ type: "err", text: "Error al agregar miembro" });
    }
  }

  async function handleRemoveMember(userId) {
    if (!confirm("¿Quitar a este miembro?")) return;
    try {
      await removeMember(id, userId);
      setMemberMsg({ type: "ok", text: "Miembro eliminado" });
      setChannel((prev) => ({
        ...prev,
        users: prev.users.filter((u) => u.id !== userId),
      }));
    } catch {
      setMemberMsg({ type: "err", text: "Error al eliminar miembro" });
    }
  }

  async function handleTransfer(userId) {
    if (!confirm("¿Transferir ownership a este usuario?")) return;
    try {
      await transferOwnership(id, userId);
      setMemberMsg({ type: "ok", text: "Ownership transferido. Ya no eres owner." });
      setIsOwner(false);
    } catch {
      setMemberMsg({ type: "err", text: "Error al transferir ownership" });
    }
  }

  // Componente de mensaje reutilizable
  function Msg({ msg }) {
    if (!msg) return null;
    return (
      <p className={`text-sm px-3 py-2 rounded-lg mb-3 ${
        msg.type === "ok"
          ? "bg-green-900/50 text-green-400 border border-green-700"
          : "bg-red-900/50 text-red-400 border border-red-700"
      }`}>
        {msg.text}
      </p>
    );
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

      <h1 className="text-2xl font-bold text-white mb-8">
        Editar canal: <span className="text-red-500">{channel.name}</span>
      </h1>

      {/* ── Sección 1: Info básica ── */}
      <section className="bg-zinc-800 rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold text-white mb-4">Información básica</h2>
        <Msg msg={infoMsg} />
        <form onSubmit={handleUpdateInfo} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm text-zinc-300 mb-1">Nombre</label>
            <input
              type="text" name="name" value={formData.name}
              onChange={handleChange} required
              className="w-full px-4 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white focus:outline-none focus:border-red-500"
            />
          </div>
          <div>
            <label className="block text-sm text-zinc-300 mb-1">Descripción</label>
            <textarea
              name="description" value={formData.description}
              onChange={handleChange} rows={3}
              className="w-full px-4 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white focus:outline-none focus:border-red-500 resize-none"
            />
          </div>
          <button type="submit"
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 rounded-full transition w-fit px-6">
            Guardar cambios
          </button>
        </form>
      </section>

      {/* ── Sección 2: Imágenes ── */}
      <section className="bg-zinc-800 rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold text-white mb-4">Imágenes</h2>
        <Msg msg={avatarMsg} />
        <Msg msg={bannerMsg} />
        <div className="flex gap-8">
          <div>
            <label className="block text-sm text-zinc-300 mb-2">Avatar</label>
            <input type="file" accept="image/*" onChange={handleAvatarChange}
              className="text-sm text-zinc-400 file:mr-3 file:py-1 file:px-3 file:rounded-full file:border-0 file:bg-zinc-600 file:text-white hover:file:bg-zinc-500"
            />
          </div>
          <div>
            <label className="block text-sm text-zinc-300 mb-2">Banner</label>
            <input type="file" accept="image/*" onChange={handleBannerChange}
              className="text-sm text-zinc-400 file:mr-3 file:py-1 file:px-3 file:rounded-full file:border-0 file:bg-zinc-600 file:text-white hover:file:bg-zinc-500"
            />
          </div>
        </div>
      </section>

      {/* ── Sección 3: Miembros (solo owners) ── */}
      {isOwner && (
        <section className="bg-zinc-800 rounded-xl p-6 flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-white mb-4">Miembros</h2>
          <Msg msg={memberMsg} />

          <form onSubmit={handleAddMember} className="flex gap-2 mb-6">
            <input
              type="email" placeholder="Email del nuevo admin"
              value={memberEmail} onChange={(e) => setMemberEmail(e.target.value)} required
              className="flex-1 px-4 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
            />
            <button type="submit"
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition">
              Agregar
            </button>
          </form>

          <div className="flex flex-col gap-2">
            {channel.users?.map((member) => (
              <div key={member.id}
                className="flex justify-between items-center bg-zinc-700 rounded-lg px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white text-sm font-bold">
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{member.name}</p>
                    <p className="text-zinc-400 text-xs capitalize">{member.pivot.role}</p>
                  </div>
                </div>
                {member.id !== user.id && member.pivot.role === "admin" && (
                  <div className="flex gap-2">
                    <button onClick={() => handleTransfer(member.id)}
                      className="text-xs bg-zinc-600 hover:bg-zinc-500 text-white px-3 py-1 rounded-full transition">
                      Hacer owner
                    </button>
                    <button onClick={() => handleRemoveMember(member.id)}
                      className="text-xs bg-red-800 hover:bg-red-700 text-white px-3 py-1 rounded-full transition">
                      Quitar
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default EditChannelPage;