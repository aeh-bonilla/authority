import { NextResponse } from "next/server";
import {
  getRightsEventsFromSupabase,
  saveRightsEventToSupabase,
} from "@/lib/supabase/service";
import { isSupabaseConfigured } from "@/lib/supabase/client";

export async function GET(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase no está configurado", fallback: true },
      { status: 503 },
    );
  }

  const { searchParams } = new URL(request.url);
  const workId = searchParams.get("workId");

  if (!workId) {
    return NextResponse.json({ error: "Indica workId" }, { status: 400 });
  }

  const events = await getRightsEventsFromSupabase(workId);
  return NextResponse.json({ events });
}

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase no está configurado", fallback: true },
      { status: 503 },
    );
  }

  try {
    const body = await request.json();
    const { event } = body;

    if (!event || !event.id || !event.workId) {
      return NextResponse.json({ error: "Datos de evento inválidos" }, { status: 400 });
    }

    const success = await saveRightsEventToSupabase(event);
    return NextResponse.json({ success });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error interno";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
