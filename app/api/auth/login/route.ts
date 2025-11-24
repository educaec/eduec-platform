import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Todos los campos son obligatorios." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.password) {
      return NextResponse.json(
        { success: false, error: "Credenciales incorrectas." },
        { status: 400 }
      );
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "Contraseña incorrecta." },
        { status: 400 }
      );
    }

    // ✔ Respuesta correcta
    return NextResponse.json({
      success: true,
      message: "Inicio de sesión exitoso.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error("Error en LOGIN:", error);
    return NextResponse.json(
      { success: false, error: "Error interno en el servidor" },
      { status: 500 }
    );
  }
}
