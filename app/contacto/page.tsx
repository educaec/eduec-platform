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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nombre, email, motivo, mensaje }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error("Error al enviar el mensaje");
      }

      setEstado("ok");
      // limpiar campos
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
      {/* TÍTULO PRINCIPAL */}
      <h1 className="text-5xl font-semibold tracking-tight mb-6">
        Contáctenos
      </h1>

      <p className="text-gray-600 text-lg mb-12 max-w-2xl text-justify">
        Estamos aquí para ayudarte. Elige el tipo de contacto que necesitas y
        nos pondremos en comunicación contigo lo antes posible.
      </p>

      {/* GRID DE OPCIONES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* SECCIÓN TRABAJE / COLABORE */}
        <div
          className="
            bg-white/80 backdrop-blur-xl 
            border border-gray-200 
            rounded-2xl p-8 shadow-lg 
            transition hover:shadow-xl hover:bg-white
          "
        >
          <h2 className="text-2xl font-semibold mb-3">
            Trabaje / Colabore con nosotros 🤝
          </h2>

          <p className="text-gray-500 mb-6 leading-relaxed text-justify">
            ¿Deseas colaborar como docente, creador de contenido o desarrollador?
            Siempre estamos buscando talento apasionado por la educación.
          </p>
          <a
            href="#formulario"
            className="
              inline-block px-5 py-2
              bg-blue-600 hover:bg-blue-700
              text-white rounded-xl font-medium transition
            "
          >
            Enviar solicitud
          </a>
        </div>

        {/* SECCIÓN ASESORÍA ACADÉMICA */}
        <div
          className="
            bg-white/80 backdrop-blur-xl 
            border border-gray-200 
            rounded-2xl p-8 shadow-lg 
            transition hover:shadow-xl hover:bg-white
          "
        >
          <h2 className="text-2xl font-semibold mb-3">
            Asesoría académica 📘
          </h2>

          <p className="text-gray-500 mb-6 leading-relaxed text-justify">
            Si necesitas orientación sobre tu preparación para ingresar a la
            universidad, estamos listos para ayudarte de forma personalizada.
          </p>

          <a
            href="#formulario"
            className="
              inline-block px-5 py-2
              bg-blue-600 hover:bg-blue-700
              text-white rounded-xl font-medium transition
            "
          >
            Solicitar asesoría
          </a>
        </div>
      </div>

      {/* FORMULARIO DE CONTACTO */}
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
          {/* Nombre */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Nombre completo
            </label>
            <input
              type="text"
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="
                w-full px-4 py-3 border border-gray-300 rounded-xl
                focus:outline-none focus:ring-2 focus:ring-blue-600
                text-gray-800
              "
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Correo electrónico
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="
                w-full px-4 py-3 border border-gray-300 rounded-xl
                focus:outline-none focus:ring-2 focus:ring-blue-600
                text-gray-800
              "
            />
          </div>

          {/* Tipo de contacto */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Motivo del contacto
            </label>

            <select
              required
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              className="
                w-full px-4 py-3 border border-gray-300 rounded-xl
                focus:outline-none focus:ring-2 focus:ring-blue-600
                text-gray-800
              "
            >
              <option value="colaboracion">Trabaje / Colabore con nosotros</option>
              <option value="asesoria">Asesoría académica</option>
              <option value="otro">Otro</option>
            </select>
          </div>

          {/* Mensaje */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Mensaje
            </label>
            <textarea
              required
              rows={5}
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              className="
                w-full px-4 py-3 border border-gray-300 rounded-xl
                focus:outline-none focus:ring-2 focus:ring-blue-600
                text-gray-800
              "
            ></textarea>
          </div>

          {/* ESTADOS DEL ENVÍO */}
          {estado === "ok" && (
            <p className="text-green-600 text-sm">
              ✅ Mensaje enviado correctamente. Te contactaremos pronto.
            </p>
          )}

          {estado === "error" && (
            <p className="text-red-600 text-sm">
              ❌ {errorMsg || "No se pudo enviar el mensaje."}
            </p>
          )}

          {/* BOTÓN ENVIAR */}
          <button
            type="submit"
            disabled={estado === "enviando"}
            className="
              w-full py-3 bg-blue-600 hover:bg-blue-700
              text-white rounded-xl font-medium transition
              disabled:opacity-60 disabled:cursor-not-allowed
            "
          >
            {estado === "enviando" ? "Enviando..." : "Enviar mensaje"}
          </button>
        </form>
      </div>
    </div>
  );
}
