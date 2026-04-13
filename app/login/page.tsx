"use client";

import Link from "next/link";
import { signIn, useSession } from "next-auth/react";

export default function LoginPage() {
  const { data: session } = useSession();

  return (
    <section className="pt-40 pb-32 max-w-3xl mx-auto px-6">
      <h1 className="text-4xl font-bold text-neutral-900 mb-6">
        Iniciar sesión
      </h1>

      <p className="text-lg text-neutral-600 mb-10 max-w-2xl">
        Accede a tu cuenta para guardar tu progreso, tus resultados y continuar
        con tus simuladores.
      </p>

      {!session ? (
        <div className="flex flex-wrap gap-4">
          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="
              px-8 py-4
              bg-blue-600 
              text-white 
              rounded-2xl 
              text-lg 
              font-semibold
              hover:bg-blue-700
              transition-all duration-300
            "
          >
            Continuar con Google
          </button>

          <Link
            href="/"
            className="
              px-8 py-4
              bg-white 
              text-neutral-900 
              border border-neutral-300
              rounded-2xl 
              text-lg 
              font-medium
              hover:bg-neutral-100
              transition-all duration-300
            "
          >
            Volver al inicio
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-neutral-700">
            Ya has iniciado sesión como{" "}
            <span className="font-semibold">
              {session.user?.name || session.user?.email}
            </span>
          </p>

          <Link
            href="/dashboard"
            className="
              inline-block px-8 py-4
              bg-blue-600 text-white rounded-2xl
              text-lg font-semibold hover:bg-blue-700 transition-all duration-300
            "
          >
            Ir al dashboard
          </Link>
        </div>
      )}
    </section>
  );
}