import { getSupabaseClient } from "./client";
import type { Work } from "@/types/work";
import type { RightsEvent } from "@/types/rights-event";

interface DbWorkRow {
  id: string;
  title: string;
  type: string;
  description: string;
  author: string;
  hash: string;
  stellar_transaction_id: string | null;
  network: string;
  status: string;
  filename: string | null;
  file_size: string | null;
  file_mime_type: string | null;
  source_url: string | null;
  file_url: string | null;
  notes: string | null;
  preview_base64: string | null;
  created_at: string;
  registered_at: string;
}

interface DbRightsEventRow {
  id: string;
  work_id: string;
  type: string;
  actor: string;
  recipient: string | null;
  terms: string | null;
  notes: string | null;
  effective_date: string;
  stellar_transaction_id: string | null;
  created_at: string;
}

function mapRowToWork(row: DbWorkRow): Work {
  return {
    id: row.id,
    title: row.title,
    type: row.type as Work["type"],
    description: row.description,
    author: row.author,
    hash: row.hash,
    stellarTransactionId: row.stellar_transaction_id ?? undefined,
    network: "testnet",
    status: row.status as Work["status"],
    filename: row.filename ?? undefined,
    fileSize: row.file_size ?? undefined,
    fileMimeType: row.file_mime_type ?? undefined,
    sourceUrl: row.source_url ?? undefined,
    fileUrl: row.file_url ?? undefined,
    notes: row.notes ?? undefined,
    createdAt: row.created_at,
    registeredAt: row.registered_at,
  };
}

function mapRowToRightsEvent(row: DbRightsEventRow): RightsEvent {
  return {
    id: row.id,
    workId: row.work_id,
    type: row.type as RightsEvent["type"],
    actor: row.actor,
    recipient: row.recipient ?? undefined,
    terms: row.terms ?? undefined,
    notes: row.notes ?? undefined,
    effectiveDate: row.effective_date,
    stellarTransactionId: row.stellar_transaction_id ?? undefined,
    createdAt: row.created_at,
  };
}

/**
 * Uploads a PDF or Image file to Supabase Storage bucket 'authory-files'
 */
export async function uploadWorkFileToSupabase(
  fileBuffer: ArrayBuffer | Blob,
  fileName: string,
  mimeType: string,
  workId: string,
): Promise<string | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  const sanitized = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
  const filePath = `${workId}/${sanitized}`;

  const { error } = await supabase.storage
    .from("authory-files")
    .upload(filePath, fileBuffer, {
      contentType: mimeType,
      upsert: true,
    });

  if (error) {
    console.error("Error al subir archivo a Supabase Storage:", error.message);
    return null;
  }

  const { data } = supabase.storage.from("authory-files").getPublicUrl(filePath);
  return data.publicUrl;
}

export async function saveWorkToSupabase(
  work: Work,
  previewBase64?: string,
): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (!supabase) return false;

  const row = {
    id: work.id,
    title: work.title,
    type: work.type,
    description: work.description,
    author: work.author,
    hash: work.hash ?? "",
    stellar_transaction_id: work.stellarTransactionId ?? null,
    network: work.network,
    status: work.status,
    filename: work.filename ?? null,
    file_size: work.fileSize ?? null,
    file_mime_type: work.fileMimeType ?? null,
    source_url: work.sourceUrl ?? null,
    file_url: work.fileUrl ?? null,
    notes: work.notes ?? null,
    preview_base64: previewBase64 ?? null,
    created_at: work.createdAt ?? new Date().toISOString(),
    registered_at: work.registeredAt ?? new Date().toISOString(),
  };

  const { error } = await supabase.from("works").upsert(row);
  if (error) {
    console.error("Error saving work to Supabase:", error.message);
    return false;
  }

  return true;
}

export async function getWorkFromSupabase(workId: string): Promise<Work | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("works")
    .select("*")
    .eq("id", workId)
    .single();

  if (error || !data) {
    return null;
  }

  return mapRowToWork(data as DbWorkRow);
}

export async function getWorkByHashFromSupabase(hash: string): Promise<Work | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("works")
    .select("*")
    .eq("hash", hash.toLowerCase())
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return mapRowToWork(data as DbWorkRow);
}

export async function saveRightsEventToSupabase(
  event: RightsEvent,
): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (!supabase) return false;

  const row = {
    id: event.id,
    work_id: event.workId,
    type: event.type,
    actor: event.actor,
    recipient: event.recipient ?? null,
    terms: event.terms ?? null,
    notes: event.notes ?? null,
    effective_date: event.effectiveDate,
    stellar_transaction_id: event.stellarTransactionId ?? null,
    created_at: event.createdAt ?? new Date().toISOString(),
  };

  const { error } = await supabase.from("rights_events").upsert(row);
  if (error) {
    console.error("Error saving rights event to Supabase:", error.message);
    return false;
  }

  return true;
}

export async function getRightsEventsFromSupabase(
  workId: string,
): Promise<RightsEvent[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("rights_events")
    .select("*")
    .eq("work_id", workId)
    .order("created_at", { ascending: true });

  if (error || !data) {
    return [];
  }

  return (data as DbRightsEventRow[]).map(mapRowToRightsEvent);
}
