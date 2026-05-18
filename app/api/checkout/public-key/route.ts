import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const publicKey = process.env["MERCADO_PAGO_PUBLIC_KEY"] ?? "";

  return NextResponse.json({
    publicKey
  });
}
