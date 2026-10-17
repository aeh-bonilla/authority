import { NextResponse } from "next/server";
import {
  getWorkFromSupabase,
  getWorkByHashFromSupabase,
  saveWorkToSupabase,
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
  const id = searchParams.get("id");
  const hash = searchParams.get("hash");

  if (id) {
    const work = await getWorkFromSupabase(id);
    if (!work) {
      return NextResponse.json({ error: "Obra no encontrada" }, { status: 404 });
    }
    return NextResponse.json({ work });
  }

  if (hash) {
    const work = await getWorkByHashFromSupabase(hash);
    if (!work) {
      return NextResponse.json({ error: "Obra no encontrada por hash" }, { status: 404 });
    }
    return NextResponse.json({ work });
  }

  return NextResponse.json({ error: "Indica id o hash" }, { status: 400 });
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
    const { work, previewBase64 } = body;

    if (!work || !work.id || !work.title) {
      return NextResponse.json({ error: "Datos de obra inválidos" }, { status: 400 });
    }

    const success = await saveWorkToSupabase(work, previewBase64);
    return NextResponse.json({ success });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error interno";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
