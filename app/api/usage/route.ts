import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase-admin";
import { createSupabaseFromRequest, getAuthenticatedUser } from "@/lib/server-auth";
import { getMonthlyPlenaUsage } from "@/lib/usage";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: "Entre na sua conta para ver seu uso mensal." }, { status: 401 });
    }

    const database = createSupabaseAdmin() ?? createSupabaseFromRequest(request);
    if (!database) {
      return NextResponse.json({ error: "O Supabase ainda não foi configurado no servidor." }, { status: 500 });
    }

    const usage = await getMonthlyPlenaUsage(database, user.id);
    return NextResponse.json({ usage });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Não consegui carregar seu uso mensal agora." }, { status: 500 });
  }
}
