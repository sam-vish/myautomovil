import { NextResponse } from "next/server";

/**
 * Lead intake endpoint.
 *
 * The client posts here as a fallback when NEXT_PUBLIC_GHL_WEBHOOK_URL is not
 * set. If a server-side GHL webhook is configured (GHL_WEBHOOK_URL), this route
 * forwards the lead to GoHighLevel. Otherwise it simply acknowledges receipt so
 * the front-end success state can be demoed end-to-end.
 */
export async function POST(request: Request) {
  try {
    const lead = await request.json();

    // Minimal server-side validation — phone is the required contact field.
    if (!lead?.phone || String(lead.phone).trim().length < 7) {
      return NextResponse.json(
        { ok: false, error: "A valid phone number is required." },
        { status: 400 }
      );
    }

    const webhookUrl = process.env.GHL_WEBHOOK_URL;

    if (webhookUrl) {
      const ghlResponse = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...lead,
          source: "My Automovil Corp Landing Page",
          submittedAt: new Date().toISOString(),
        }),
      });

      if (!ghlResponse.ok) {
        throw new Error(`GHL webhook responded with ${ghlResponse.status}`);
      }
    } else {
      // No webhook configured — log for local development visibility.
      console.info("[leads] New pre-approval lead received:", lead);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[leads] Failed to process lead:", error);
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
