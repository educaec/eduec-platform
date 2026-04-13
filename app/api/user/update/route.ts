import { NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "No autorizado" },
        { status: 401 }
      );
    }

    const { name, email, newPassword } = await req.json();
    const userId = session.user.id as string;

    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: "Nombre y correo son obligatorios." },
        { status: 400 }
      );
    }

    const dataToUpdate: {
      name: string;
      email: string;
      password?: string;
    } = {
      name,
      email,
    };

    if (newPassword && newPassword.trim() !== "") {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      dataToUpdate.password = hashedPassword;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: dataToUpdate,
    });

    return NextResponse.json({
      success: true,
      message: "Perfil actualizado correctamente.",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error actualizando perfil:", error);

    return NextResponse.json(
      { success: false, error: "Error actualizando perfil." },
      { status: 500 }
    );
  }
}