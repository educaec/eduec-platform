import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "No autenticado." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { simulatorTitle, score } = body;

    if (!simulatorTitle || typeof score !== "number") {
      return NextResponse.json(
        { error: "Datos incompletos." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuario no encontrado." },
        { status: 404 }
      );
    }

    const simulator = await prisma.simulator.findFirst({
      where: { title: simulatorTitle },
    });

    if (!simulator) {
      return NextResponse.json(
        { error: "Simulador no encontrado." },
        { status: 404 }
      );
    }

    const existing = await prisma.simulatorProgress.findFirst({
      where: {
        userId: user.id,
        simulatorId: simulator.id,
      },
    });

    const newBestScore = existing
      ? Math.max(existing.bestScore, score)
      : score;

    if (!existing) {
      await prisma.simulatorProgress.create({
        data: {
          userId: user.id,
          simulatorId: simulator.id,
          bestScore: newBestScore,
        },
      });
    } else {
      await prisma.simulatorProgress.update({
        where: { id: existing.id },
        data: {
          bestScore: newBestScore,
        },
      });
    }

    await prisma.activity.create({
      data: {
        userId: user.id,
        description: `Completaste ${simulator.title} con ${score}%`,
      },
    });

    return NextResponse.json({
      ok: true,
      bestScore: newBestScore,
    });
  } catch (error) {
    console.error("Error al guardar progreso:", error);

    return NextResponse.json(
      { error: "No se pudo guardar el progreso." },
      { status: 500 }
    );
  }
}