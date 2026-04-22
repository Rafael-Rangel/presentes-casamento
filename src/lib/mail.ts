import nodemailer from "nodemailer";

export type SendMailResult =
  | { ok: true; sent: true }
  | { ok: true; sent: false; reason: string }
  | { ok: false; error: string };

/** Envia e-mail se SMTP estiver configurado; caso contrário devolve skipped. */
export async function sendMail(opts: {
  to: string;
  subject: string;
  text: string;
  html?: string;
}): Promise<SendMailResult> {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? "587");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;
  const from = process.env.EMAIL_FROM ?? user;

  if (!host || !user || !pass || !from) {
    return {
      ok: true,
      sent: false,
      reason:
        "SMTP não configurado (SMTP_HOST, SMTP_USER, SMTP_PASSWORD, EMAIL_FROM).",
    };
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    const fromName = process.env.EMAIL_FROM_NAME ?? "Casamento";
    await transporter.sendMail({
      from: `"${fromName}" <${from}>`,
      to: opts.to,
      subject: opts.subject,
      text: opts.text,
      html: opts.html ?? opts.text.replace(/\n/g, "<br/>"),
    });
    return { ok: true, sent: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erro ao enviar e-mail";
    return { ok: false, error: msg };
  }
}
