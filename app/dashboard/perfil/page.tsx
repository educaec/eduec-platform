import { auth, signOut } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

async function updateProfile(formData: FormData) {
  "use server";

  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const newPassword = String(formData.get("newPassword") || "").trim();

  if (!name || !email) {
    return;
  }

  const dataToUpdate: {
    name: string;
    email: string;
    password?: string;
  } = {
    name,
    email,
  };

  if (newPassword) {
    dataToUpdate.password = await bcrypt.hash(newPassword, 10);
  }

  await prisma.user.update({
    where: {
      email: session.user.email,
    },
    data: dataToUpdate,
  });

  redirect("/dashboard/perfil");
}

async function logout() {
  "use server";

  await signOut({ redirectTo: "/" });
}

export default async function PerfilPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="pt-32 max-w-2xl mx-auto px-6">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">Mi Perfil</h1>

      <p className="text-gray-600 mb-10">
        Administra la información de tu cuenta.
      </p>

      <form
        action={updateProfile}
        className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md space-y-6"
      >
        <div>
          <label className="block text-gray-700 font-medium mb-2">Nombre</label>
          <input
            name="name"
            type="text"
            defaultValue={user.name ?? ""}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Correo electrónico
          </label>
          <input
            name="email"
            type="email"
            defaultValue={user.email ?? ""}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Nueva contraseña
          </label>
          <input
            name="newPassword"
            type="password"
            placeholder="Dejar vacío si no deseas cambiarla"
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-2">
            Si iniciaste sesión con Google, no necesitas crear una contraseña.
          </p>
        </div>

        <div className="flex justify-between mt-8">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
          >
            Guardar cambios
          </button>
        </div>
      </form>

      <form action={logout} className="mt-4">
        <button
          type="submit"
          className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition"
        >
          Cerrar sesión
        </button>
      </form>

      <div className="mt-10">
        <a href="/dashboard" className="text-blue-600 hover:underline">
          ← Volver al Panel
        </a>
      </div>
    </div>
  );
}
