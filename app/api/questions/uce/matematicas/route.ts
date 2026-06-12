import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const questions = await prisma.question.findMany({
      where: {
        university: "UCE",
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