"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();

  return (
    <section className="pt-40 pb-32 max-w-5xl mx-auto px-6">
      <h1
        className="
          text-6xl 
          font-extrabold 
          tracking-tight 
          text-neutral-900 
          leading-[1.1] 
          mb-6
        "
      >
        Aprende mejor.
        <br />
        <span className="text-neutral-800">Avanza más rápido.</span>
      </h1>

      <p
        className="
          text-xl 
          text-neutral-600 
          leading-relaxed 
          mb-10 
          max-w-2xl
        "
      >
        Una plataforma educativa creada para ayudarte a ingresar a la universidad.
        Simuladores precisos, cursos completos y una experiencia fluida y moderna.
      </p>

      {status === "loading" ? (
        <p className="text-neutral-500">Cargando...</p>
      ) : !session ? (
        <div className="flex flex-wrap gap-4">
          <Link
            href="/login"
            className="
              px-8 py-4
              bg-blue-600 
              text-white 
              rounded-2xl 
              text-lg 
              font-semibold
              shadow-[0_8px_24px_-5px_rgba(37,99,235,0.35)]
              hover:bg-blue-700 
              hover:shadow-[0_10px_28px_-4px_rgba(37,99,235,0.45)]
              active:scale-[0.98]
              transition-all duration-300
            "
          >
            Iniciar sesión
          </Link>

          <Link
            href="/register"
            className="
              px-8 py-4
              bg-white 
              text-neutral-900 
              border border-neutral-300
              rounded-2xl 
              text-lg 
              font-medium
              hover:bg-neutral-100 
              active:scale-[0.98]
              transition-all duration-300
            "
          >
            Crear cuenta
          </Link>
        </div>
      ) : (
        <div className="flex flex-wrap gap-4">
          <Link
            href="/dashboard"
            className="
              px-8 py-4
              bg-blue-600 
              text-white 
              rounded-2xl 
              text-lg 
              font-semibold
              shadow-[0_8px_24px_-5px_rgba(37,99,235,0.35)]
              hover:bg-blue-700 
              hover:shadow-[0_10px_28px_-4px_rgba(37,99,235,0.45)]
              active:scale-[0.98]
              transition-all duration-300
            "
          >
            Ir al dashboard
          </Link>

          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="
              px-8 py-4
              bg-white 
              text-neutral-900 
              border border-neutral-300
              rounded-2xl 
              text-lg 
              font-medium
              hover:bg-neutral-100 
              active:scale-[0.98]
              transition-all duration-300
            "
          >
            Cerrar sesión
          </button>
        </div>
      )}

      {session?.user && (
        <div className="mt-8 text-neutral-600">
          Has iniciado sesión como{" "}
          <span className="font-semibold text-neutral-900">
            {session.user.name || session.user.email}
          </span>
        </div>
      )}

      <div
        className="
          mt-20 
          text-neutral-500 
          tracking-wide 
          text-sm 
          uppercase
        "
      >
        Plataforma diseñada para estudiantes ecuatorianos 🧠🇪🇨
      </div>
    </section>
  );
}