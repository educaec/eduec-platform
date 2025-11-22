"use client";

import { useState } from "react";

export default function ContactoPage() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [motivo, setMotivo] = useState("colaboracion");
  const [mensaje, setMensaje] = useState("");
  const [estado, setEstado] = useState<"idle" | "enviando" | "ok" | "error">(
    "idle"
  );
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEstado("enviando");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email, motivo, mensaje }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error("Error al enviar mensaje");
      }

      setEstado("ok");
      setNombre("");
      setEmail("");
      setMotivo("colaboracion");
      setMensaje("");
    } catch (err) {
      console.error(err);
      setEstado("error");
      setErrorMsg("Ocurrió un problema al enviar tu mensaje. Intenta de nuevo.");
    }
  };

  return (
    <div className="pt-32 max-w-4xl mx-auto px-6">
      <h1 className="text-5xl font-semibold tracking-tight mb-6">
        Contáctenos
      </h1>

      <p className="text-gray-600 text-lg mb-12 max-w-2xl text-justify">
        Estamos aquí para ayudarte. Elige el tipo de contacto que necesitas y
        nos pondremos en comunicación contigo lo antes posible.
      </p>

      {/* FORMULARIO */}
      <div id="formulario" className="mt-20">
        <h2 className="text-3xl font-semibold mb-6">Envíanos un mensaje</h2>

      <form
  onSubmit={handleSubmit}
  className="
    bg-white/80 backdrop-blur-xl
    border border-gray-200 
    shadow-xl rounded-2xl
    p-8 space-y-6
  "
>
  <div>
    <label className="block text-gray-700 font-medium mb-2" htmlFor="nombre">
      Nombre completo
    </label>
    <input
      id="nombre"
      type="text"
      value={nombre}
      onChange={(e) => setNombre(e.target.value)}
      required
      className="w-full px-4 py-3 border border-gray-300 rounded-xl"
    />
  </div>

  <div>
    <label className="block text-gray-700 font-medium mb-2" htmlFor="email">
      Correo electrónico
    </label>
    <input
      id="email"
      type="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      required
      className="w-full px-4 py-3 border border-gray-300 rounded-xl"
    />
  </div>

  <div>
    <label className="block text-gray-700 font-medium mb-2" htmlFor="motivo">
      Motivo del contacto
    </label>
    <select
      id="motivo"
      value={motivo}
      onChange={(e) => setMotivo(e.target.value)}
      required
      className="w-full px-4 py-3 border border-gray-300 rounded-xl"
    >
      <option value="colaboracion">Trabaje / Colabore con nosotros</option>
      <option value="asesoria">Asesoría académica</option>
      <option value="otro">Otro</option>
    </select>
  </div>

  <div>
    <label className="block text-gray-700 font-medium mb-2" htmlFor="mensaje">
      Mensaje
    </label>
    <textarea
      id="mensaje"
      rows={5}
      value={mensaje}
      onChange={(e) => setMensaje(e.target.value)}
      required
      className="w-full px-4 py-3 border border-gray-300 rounded-xl"
    ></textarea>
  </div>

  {estado === "ok" && (
    <p className="text-green-600">✅ Mensaje enviado correctamente</p>
  )}

  {estado === "error" && (
    <p className="text-red-600">❌ No se pudo enviar el mensaje.</p>
  )}

  <button
    disabled={estado === "enviando"}
    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
  >
    {estado === "enviando" ? "Enviando..." : "Enviar mensaje"}
  </button>
</form>
      </div>
    </div>
  );
}
