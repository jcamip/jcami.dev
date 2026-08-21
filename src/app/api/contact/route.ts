import { NextResponse } from "next/server";
import { Resend } from "resend";

// Contact form → email. Requires RESEND_API_KEY (see .env.example) and a
// domain verified in Resend so we can send "from" that domain — see
// https://resend.com/domains. Until a domain is verified, Resend will only
// deliver "from" its shared onboarding@resend.dev address.
const TO_ADDRESS = "hello@jcami.dev";
const FROM_ADDRESS = "JCami Contact Form <contact@jcami.dev>";

type ContactPayload = {
  fullName?: unknown;
  email?: unknown;
  company?: unknown;
  website?: unknown;
  projectDetails?: unknown;
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
    console.error("RESEND_API_KEY is not set — cannot send contact form email.");
    return NextResponse.json({ error: "Email service is not configured." }, { status: 500 });
  }

  let payload: ContactPayload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const fullName = asTrimmedString(payload.fullName);
  const email = asTrimmedString(payload.email);
  const company = asTrimmedString(payload.company);
  const website = asTrimmedString(payload.website);
  const projectDetails = asTrimmedString(payload.projectDetails);

  // Mirrors the required/optional fields in ContactForm.tsx.
  if (!fullName || !email || !company) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
  }

  const resend = new Resend(apiKey);

  const textLines = [
    `Full name: ${fullName}`,
    `Email: ${email}`,
    `Company / brand: ${company}`,
    website ? `Website / social: ${website}` : null,
    "",
    "Project details:",
    projectDetails || "(none provided)",
  ].filter((line) => line !== null);

  const htmlRows = [
    ["Full name", fullName],
    ["Email", email],
    ["Company / brand", company],
    ...(website ? [["Website / social", website]] : []),
  ]
    .map(
      ([label, value]) =>
        `<tr><td style="padding:4px 12px 4px 0;color:#666;">${escapeHtml(label)}</td><td>${escapeHtml(value)}</td></tr>`
    )
    .join("");

  try {
    const { error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: TO_ADDRESS,
      replyTo: email,
      subject: `New project inquiry from ${fullName}`,
      text: textLines.join("\n"),
      html: `
        <table>${htmlRows}</table>
        <p style="margin-top:16px;color:#666;">Project details</p>
        <p style="white-space:pre-wrap;">${escapeHtml(projectDetails || "(none provided)")}</p>
      `,
    });

    if (error) {
      console.error("Resend failed to send contact form email:", error);
      return NextResponse.json({ error: "Failed to send message." }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Unexpected error sending contact form email:", err);
    return NextResponse.json({ error: "Failed to send message." }, { status: 500 });
  }
}
