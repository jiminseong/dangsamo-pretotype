import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // body: { email, product, utm, ts }
    console.log("[interest]", body);
    // TODO: 여기서 DB/Notion/Google Sheet/Slack Webhook 연동
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 400 });
  }
}
