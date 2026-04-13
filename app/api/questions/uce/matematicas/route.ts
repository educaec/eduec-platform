import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const questions = await prisma.question.findMany({
      where: {
        university: "uce",
        subject: "matematicas",
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return NextResponse.json(questions);
  } catch (error) {
    console.error("Error al obtener preguntas:", error);
    return NextResponse.json(
      { error: "No se pudieron obtener las preguntas" },
      { status: 500 }
    );
  }
}