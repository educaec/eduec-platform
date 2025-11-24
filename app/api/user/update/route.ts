import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "No autorizado" },
        { status: 401 }
      );
    }

    const { name, email, newPassword } = await req.json();
    const userId = session.user.id;

    // Validaciones
    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: "Nombre y correo son obligatorios." },
        { status: 400 }
      );
    }

    // Preparamos datos para actualización
    const dataToUpdate: any = {
      name,
      email,
    };

    // Si el usuario ingresó nueva contraseña
    if (newPassword && newPassword.trim() !== "") {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      dataToUpdate.password = hashedPassword;
    }

    // Actualizar usuario
    const updatedUser = await prisma.user.update({
      where: { id: Number(userId) },
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
