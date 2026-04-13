"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  return (
    <section className="pt-40 pb-32 max-w-3xl mx-auto px-6">
      <h1 className="text-4xl font-bold text-neutral-900 mb-6">
        Crear cuenta
      </h1>

      <p className="text-lg text-neutral-600 mb-10 max-w-2xl">
        Para crear tu cuenta de forma rápida y segura, continúa con Google.
      </p>

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
          Crear cuenta con Google
        </button>

        <Link
          href="/login"
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
          Ya tengo cuenta
        </Link>
      </div>
    </section>
  );
}