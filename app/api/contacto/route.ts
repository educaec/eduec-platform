import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { nombre, email, motivo, mensaje } = body;

    if (!nombre || !email || !motivo || !mensaje) {
      return NextResponse.json(
        { success: false, error: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    // Validación fuerte de la variable de entorno
    const contactEmail = process.env.CONTACT_EMAIL;

    if (!contactEmail) {
      console.error("❌ ERROR: CONTACT_EMAIL no está definido");
      return NextResponse.json(
        { success: false, error: "CONTACT_EMAIL no está configurado" },
        { status: 500 }
      );
    }

    const data = await resend.emails.send({
      from: "EduEc <onboarding@resend.dev>",
      to: contactEmail, // ← ya no puede ser undefined
      reply_to: email,
      subject: `Nuevo mensaje de contacto (${motivo})`,
      html: `
        <h2>Nuevo mensaje desde la plataforma EduEc</h2>
        <p><strong>Nombre:</strong> ${nombre}</p>
        <p><strong>Correo:</strong> ${email}</p>
        <p><strong>Motivo:</strong> ${motivo}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${mensaje}</p>
      `,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error enviando mensaje:", error);
    return NextResponse.json(
      { success: false, error: "Error interno en el servidor" },
      { status: 500 }
    );
  }
}