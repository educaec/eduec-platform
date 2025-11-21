import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: Request) {
  try {
    const { nombre, email, motivo, mensaje } = await req.json();

    const data = await resend.emails.send({
      from: "EduEc <onboarding@resend.dev>",
      to: "TU-CORREO-REAL",  
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
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
