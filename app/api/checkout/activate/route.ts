import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/server-auth";
import { activateApprovedPurchaseForUser } from "@/lib/subscription";
import { createSupabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: "Entre na sua conta para ativar o acesso." }, { status: 401 });
    }

    const admin = createSupabaseAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Supabase admin não configurado." }, { status: 500 });
    }

    const activated = await activateApprovedPurchaseForUser(admin, {
      id: user.id,
      email: user.email
    });

    return NextResponse.json({ activated });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Não consegui ativar seu acesso agora." }, { status: 500 });
  }
}
