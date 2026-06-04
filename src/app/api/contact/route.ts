import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { Resend } from 'resend';
import { headers } from 'next/headers';

const ContactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  subject: z.string().min(2).max(200),
  message: z.string().min(10).max(5000),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = ContactSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'validation', issues: parsed.error.issues }, { status: 400 });
    }

    const data = parsed.data;
    const h = headers();
    const referer = h.get('referer') ?? undefined;

    // Guardar en DB
    await prisma.feedback.create({
      data: {
        siteSlug: 'personal',
        type: 'CONTACT',
        email: data.email,
        payload: {
          name: data.name,
          subject: data.subject,
          message: data.message,
          referer,
        } as any,
      },
    });

    // Enviar email si Resend está configurado
    if (process.env.RESEND_API_KEY && process.env.CONTACT_EMAIL) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: 'JuanMa Crypto <noreply@manko.blog>',
          to: process.env.CONTACT_EMAIL,
          replyTo: data.email,
          subject: `[Contacto web] ${data.subject}`,
          html: `
            <h2>Nuevo mensaje de contacto</h2>
            <p><strong>Nombre:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Asunto:</strong> ${data.subject}</p>
            <hr />
            <p>${data.message.replace(/\n/g, '<br>')}</p>
          `,
        });
      } catch (err) {
        console.error('[api/contact] Resend error:', err);
        // No fallar la request si el email falla; ya quedó guardado
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[api/contact]', err);
    return NextResponse.json({ error: 'internal' }, { status: 500 });
  }
}
