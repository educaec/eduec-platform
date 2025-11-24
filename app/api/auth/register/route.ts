import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: "Todos los campos son obligatorios." },
        { status: 400 }
      );
    }

    // Verificar si el usuario ya existe
    const userExists = await prisma.user.findUnique({
      where: { email },
    });

    if (userExists) {
      return NextResponse.json(
        { success: false, error: "El correo ya está registrado." },
        { status: 400 }
      );
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "student",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Usuario registrado correctamente.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error en REGISTER:", error);
    return NextResponse.json(
      { success: false, error: "Error interno en el servidor" },
      { status: 500 }
    );
  }
}
