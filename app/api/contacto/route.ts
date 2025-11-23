import { NextResponse } from "next/server";
import { Resend } from "resend";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: Request) {
  try {
    const { nombre, email, motivo, mensaje } = await req.json();

    // Validación
    if (!nombre || !email || !motivo || !mensaje) {
      return NextResponse.json(
        { success: false, error: "Todos los campos son obligatorios." },
        { status: 400 }
      );
    }

    // Verificar variable de entorno
    const contactEmail = process.env.CONTACT_EMAIL;
    if (!contactEmail) {
      return NextResponse.json(
        { success: false, error: "CONTACT_EMAIL no configurado." },
        { status: 500 }
      );
    }

    // 1️⃣ Guardar en la base de datos
    const saved = await prisma.contactMessage.create({
      data: {
        nombre,
        email,
        motivo,
        mensaje,
      },
    });

    // 2️⃣ Enviar correo usando Resend
    await resend.emails.send({
      from: "EduEc <onboarding@resend.dev>",
      to: contactEmail,
      replyTo: email,
      subject: `Nuevo mensaje de contacto (${motivo})`,
      html: `
        <h2>Nuevo mensaje desde la plataforma EduEc</h2>
        <p><strong>Nombre:</strong> ${nombre}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Motivo:</strong> ${motivo}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${mensaje}</p>
      `,
    });

    // 3️⃣ Respuesta final
    return NextResponse.json({
      success: true,
      message: "Mensaje enviado y guardado correctamente.",
      data: saved,
    });
  } catch (error) {
    console.error("❌ Error en contacto:", error);
    return NextResponse.json(
      { success: false, error: "Error interno del servidor." },
      { status: 500 }
    );
  }
}
