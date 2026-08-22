import { NextResponse } from "next/server";
import { Resend } from "resend";

// Creative-pool signup (Connect page, CreativePool.tsx) → email. Requires
// RESEND_API_KEY (see .env.example) and a domain verified in Resend so we
// can send "from" that domain — see https://resend.com/domains.
const TO_ADDRESS = "daniel@jcami.dev";
const FROM_ADDRESS = "JCami Creative Pool <contact@jcami.dev>";

type SubscribePayload = {
  email?: unknown;
  role?: unknown;
};

function asTrimmedString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set — cannot send creative pool signup email.");
    return NextResponse.json({ error: "Email service is not configured." }, { status: 500 });
  }

  let payload: SubscribePayload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const email = asTrimmedString(payload.email);
  const role = asTrimmedString(payload.role);

  if (!email || !role) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
  }

  const resend = new Resend(apiKey);

  try {
    const { error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: TO_ADDRESS,
      replyTo: email,
      subject: `New creative pool signup: ${role}`,
      text: `New creative pool signup\nEmail: ${email}\nRole: ${role}`,
      html: `<p>New creative pool signup</p><table><tr><td style="padding:4px 12px 4px 0;color:#666;">Email</td><td>${escapeHtml(email)}</td></tr><tr><td style="padding:4px 12px 4px 0;color:#666;">Role</td><td>${escapeHtml(role)}</td></tr></table>`,
    });

    if (error) {
      console.error("Resend failed to send creative pool signup email:", error);
      return NextResponse.json({ error: "Failed to send message." }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Unexpected error sending creative pool signup email:", err);
    return NextResponse.json({ error: "Failed to send message." }, { status: 500 });
  }
}
