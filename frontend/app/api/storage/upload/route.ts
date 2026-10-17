import { NextResponse } from "next/server";
import { uploadWorkFileToSupabase } from "@/lib/supabase/service";
import { isSupabaseConfigured } from "@/lib/supabase/client";

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase Storage no está configurado", fallback: true },
      { status: 503 },
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const workId = formData.get("workId") as string | null;

    if (!file || !workId) {
      return NextResponse.json(
        { error: "file y workId son obligatorios" },
        { status: 400 },
      );
    }

    // Validar que sea PDF o imagen
    const mimeType = file.type || "application/octet-stream";
    const isImage = mimeType.startsWith("image/");
    const isPdf = mimeType === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");

    if (!isImage && !isPdf) {
      return NextResponse.json(
        { error: "Solo se permite persistir imágenes y documentos PDF en Storage." },
        { status: 400 },
      );
    }

    const buffer = await file.arrayBuffer();
    const fileUrl = await uploadWorkFileToSupabase(buffer, file.name, mimeType, workId);

    if (!fileUrl) {
      return NextResponse.json(
        { error: "No se pudo subir el archivo a Supabase Storage." },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, fileUrl });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error interno en subida de archivo";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
