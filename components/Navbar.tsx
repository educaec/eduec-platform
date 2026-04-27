"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { data: session, status } = useSession();

  const user = session?.user
    ? {
        name: session.user.name || "Usuario",
        avatar: session.user.image || null,
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
        <div className="fixed top-0 right-0 h-full w-80 bg-white/80 backdrop-blur-2xl border-l border-gray-200 shadow-2xl z-50 animate-slideLeft p-6 overflow-y-auto">
          <button
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-xl"
          >
            ✕
          </button>

          <div className="flex items-center gap-4 mb-8">
            {user.avatar ? (
              <Image
                src={user.avatar}
                width={48}
                height={48}
                className="rounded-full border border-gray-300"
                alt="Avatar del usuario"
              />
            ) : (
              <div className="w-12 h-12 rounded-full border border-gray-300 bg-gray-200 flex items-center justify-center text-gray-700 font-semibold">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}

            <div>
              <p className="text-gray-900 font-semibold">{user.name}</p>
              <p className="text-gray-500 text-sm">Estudiante</p>
            </div>
          </div>

          <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-4">
            <h3 className="text-gray-900 font-semibold mb-2">Progreso general</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Aún no hay progreso registrado. Cuando inicies cursos o completes simuladores, aparecerá aquí.
            </p>
          </div>

          <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-4">
            <h3 className="text-gray-900 font-semibold mb-2">Cursos en progreso</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Aún no has iniciado ningún curso.
            </p>
          </div>

          <Link
            href="/dashboard"
            onClick={() => setOpen(false)}
            className="block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-center rounded-xl text-white font-medium transition"
          >
            Ir al Dashboard completo
          </Link>
        </div>
      )}
    </>
  );
}