import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function PerfilPage() {
  const session = await getServerSession();

  if (!session) redirect("/login");

  const user = session.user;

  return (
    <div className="pt-32 max-w-2xl mx-auto px-6">

      {/* Título */}
      <h1 className="text-4xl font-bold text-gray-900 mb-6">
        Mi Perfil
      </h1>

      <p className="text-gray-600 mb-10">
        Administra la información de tu cuenta.
      </p>

      {/* CARD PRINCIPAL */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md space-y-6">

        {/* NOMBRE */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Nombre
          </label>
          <input
            type="text"
            defaultValue={user?.name ?? ""}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* CORREO */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Correo electrónico
          </label>
          <input
            type="email"
            defaultValue={user?.email ?? ""}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* CAMBIAR CONTRASEÑA */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Nueva contraseña
          </label>
          <input
            type="password"
            placeholder="********"
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* BOTONES */}
        <div className="flex justify-between mt-8">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
          >
            Guardar cambios
          </button>

          <a
            href="/api/auth/signout"
            className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition"
          >
            Cerrar sesión
          </a>
        </div>
      </div>

      {/* VOLVER */}
      <div className="mt-10">
        <a
          href="/dashboard"
          className="text-blue-600 hover:underline"
        >
          ← Volver al Panel
        </a>
      </div>
    </div>
  );
}
