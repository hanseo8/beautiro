import { siteUrl } from "@/lib/auth/google";

type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
};

export async function sendEmail({ to, subject, html }: SendEmailInput) {
  const from =
    process.env.EMAIL_FROM ?? "Beautiro <noreply@beautiro.com>";
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.info("[email:dev]", { to, subject, html });
    return;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to, subject, html }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error("[email:error]", res.status, body);
    throw new Error("Failed to send email");
  }
}

export function verificationEmailHtml(name: string, token: string, locale: string) {
  const url = `${siteUrl()}/api/auth/verify-email?token=${encodeURIComponent(token)}&locale=${locale}`;
  return `
    <div style="font-family:sans-serif;line-height:1.6;color:#111;">
      <h2>Beautiro</h2>
      <p>Hi ${name},</p>
      <p>Please verify your email address to complete your Beautiro account setup.</p>
      <p><a href="${url}" style="display:inline-block;padding:12px 20px;background:#7c6cf0;color:#fff;text-decoration:none;border-radius:8px;">Verify email</a></p>
      <p style="font-size:12px;color:#666;">This link expires in 48 hours.</p>
    </div>
  `;
}

export function resetPasswordEmailHtml(name: string, token: string, locale: string) {
  const url = `${siteUrl()}/${locale}/auth/reset-password?token=${encodeURIComponent(token)}`;
  return `
    <div style="font-family:sans-serif;line-height:1.6;color:#111;">
      <h2>Beautiro</h2>
      <p>Hi ${name},</p>
      <p>We received a request to reset your password.</p>
      <p><a href="${url}" style="display:inline-block;padding:12px 20px;background:#7c6cf0;color:#fff;text-decoration:none;border-radius:8px;">Reset password</a></p>
      <p style="font-size:12px;color:#666;">This link expires in 2 hours. If you did not request this, you can ignore this email.</p>
    </div>
  `;
}
