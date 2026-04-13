"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { data: session, status } = useSession();

  const user = session?.user
    ? {
        name: session.user.name || "Usuario",
        avatar: session.user.image || "https://i.pravatar.cc/150?img=15",
        overallProgress: 58,
        courses: [
          { title: "Fundamentos de Matemáticas", progress: 35 },
          { title: "Lectura Crítica", progress: 20 },
        ],
      }
    : null;

  return (
    <>
      <nav className="fixed top-0 left-0 w-full bg-white/70 backdrop-blur-2xl border-b border-gray-200 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link className="text-xl font-semibold text-gray-900" href="/">
            EduEc
          </Link>

          <div className="flex items-center gap-6 text-gray-600 text-sm font-medium">
            <Link href="/" className="hover:text-gray-900 transition">
              Inicio
            </Link>

            <Link href="/simulador" className="hover:text-gray-900 transition">
              Simulador
            </Link>

            <Link href="/cursos" className="hover:text-gray-900 transition">
              Cursos
            </Link>

            <Link href="/contacto" className="hover:text-gray-900 transition">
              Contáctenos
            </Link>

            <Link href="/donaciones" className="hover:text-gray-900 transition">
              Donaciones
            </Link>

            <Link href="/sobre-nosotros" className="hover:text-gray-900 transition">
              Sobre nosotros
            </Link>

            {status === "loading" ? null : !session ? (
              <>
                <button
                  onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition"
                >
                  Iniciar sesión
                </button>

                <Link
                  href="/register"
                  className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-100 transition"
                >
                  Crear cuenta
                </Link>
              </>
            ) : (
              <>
                <button
                  onClick={() => setOpen(true)}
                  className="hover:text-gray-900 transition text-xl px-2"
                  title="Abrir panel"
                >
                  ☰
                </button>

                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-100 transition"
                >
                  Cerrar sesión
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {open && user && (
        <div
          className="
            fixed top-0 right-0 h-full w-80 
            bg-white/80 backdrop-blur-2xl
            border-l border-gray-200
            shadow-2xl z-50 animate-slideLeft
            p-6 overflow-y-auto
          "
        >
          <button
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-xl"
          >
            ✕
          </button>

          <div className="flex items-center gap-4 mb-8">
            <img
              src={user.avatar}
              className="w-12 h-12 rounded-full border border-gray-300"
              alt="avatar"
            />
            <div>
              <p className="text-gray-900 font-semibold">{user.name}</p>
              <p className="text-gray-500 text-sm">Estudiante</p>
            </div>
          </div>

          <h3 className="text-gray-900 font-semibold mb-2">Progreso general</h3>

          <p className="text-gray-700 text-sm mb-1">
            {user.overallProgress}% completado
          </p>

          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-6">
            <div
              className="h-full bg-blue-600 transition-all duration-700"
              style={{ width: `${user.overallProgress}%` }}
            />
          </div>

          <h3 className="text-gray-900 font-semibold mb-3">
            Cursos en progreso
          </h3>

          <div className="space-y-4 mb-6">
            {user.courses.map((c, i) => (
              <div key={i}>
                <p className="text-gray-800 text-sm">{c.title}</p>

                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mt-1">
                  <div
                    className="h-full bg-blue-500 transition-all duration-700"
                    style={{ width: `${c.progress}%` }}
                  />
                </div>

                <p className="text-xs text-gray-500 mt-1">
                  {c.progress}% completado
                </p>
              </div>
            ))}
          </div>

          <Link
            href="/dashboard"
            className="block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-center rounded-xl text-white font-medium transition"
          >
            Ir al Dashboard completo
          </Link>
        </div>
      )}
    </>
  );
}