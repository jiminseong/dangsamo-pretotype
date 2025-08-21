// app/api/price-audit/route.ts
import { NextResponse } from "next/server";
import { auditPrice, PriceAuditInput } from "@/lib/priceAudit";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as PriceAuditInput;

    // 최소 검증
    if (!Number.isFinite(body.cost) || !Number.isFinite(body.listPrice)) {
      return NextResponse.json({ ok: false, error: "Invalid cost/listPrice" }, { status: 400 });
    }

    const result = auditPrice(body);
    return NextResponse.json({ ok: true, result });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 400 });
  }
}
