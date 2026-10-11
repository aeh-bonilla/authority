import { demoEvents, demoWork } from "@/lib/mock-data";
import type { RightsEvent } from "@/types/rights-event";
import type { Work } from "@/types/work";

export const storageKeys = {
  work: "authory_work",
  events: "authory_events",
  rights: "authory_rights",
} as const;

const VALID_WORK_TYPES = new Set([
  "photography",
  "illustration",
  "document",
  "music",
  "code",
  "video",
  "other",
]);

const VALID_WORK_STATUSES = new Set([
  "draft",
  "processing",
  "registered",
  "verified",
]);

const VALID_EVENT_TYPES = new Set([
  "registration",
  "evidence",
  "license",
  "assignment",
  "transfer",
]);

function isDefined<T>(val: T | undefined | null): val is T {
  return val !== undefined && val !== null;
}

function isValidDateString(val: unknown): boolean {
  if (typeof val !== "string" || !val.trim()) {
    return false;
  }
  const time = Date.parse(val);
  return !Number.isNaN(time);
}

function isValidHexHash(val: unknown): boolean {
  return typeof val === "string" && /^[a-fA-F0-9]{64}$/.test(val.trim());
}

export function isValidSafeUrl(val: unknown): boolean {
  if (typeof val !== "string" || !val.trim()) {
    return false;
  }
  const trimmed = val.trim().toLowerCase();
  return trimmed.startsWith("http://") || trimmed.startsWith("https://");
}

export function areRightsEventsEqual(a: RightsEvent, b: RightsEvent): boolean {
  return (
    a.id === b.id &&
    a.workId === b.workId &&
    a.type === b.type &&
    a.actor === b.actor &&
    (a.recipient ?? "") === (b.recipient ?? "") &&
    a.effectiveDate === b.effectiveDate &&
    (a.terms ?? "") === (b.terms ?? "") &&
    (a.notes ?? "") === (b.notes ?? "") &&
    (a.stellarTransactionId ?? "") === (b.stellarTransactionId ?? "") &&
    a.createdAt === b.createdAt
  );
}

export function isValidWork(value: unknown): value is Work {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }
  const w = value as Record<string, unknown>;

  // Required fields
  if (typeof w.id !== "string" || !w.id.trim()) return false;
  if (typeof w.title !== "string") return false;
  if (typeof w.type !== "string" || !VALID_WORK_TYPES.has(w.type)) return false;
  if (typeof w.description !== "string") return false;
  if (typeof w.author !== "string") return false;
  if (w.network !== "testnet") return false;
  if (typeof w.status !== "string" || !VALID_WORK_STATUSES.has(w.status)) return false;

  // Optional fields validation: if present, must match strict contract types
  if (isDefined(w.createdAt) && !isValidDateString(w.createdAt)) return false;
  if (isDefined(w.registeredAt) && !isValidDateString(w.registeredAt)) return false;
  if (isDefined(w.filename) && typeof w.filename !== "string") return false;
  if (isDefined(w.fileSize) && typeof w.fileSize !== "string") return false;
  if (isDefined(w.fileMimeType) && typeof w.fileMimeType !== "string") return false;
  if (isDefined(w.sourceUrl) && !isValidSafeUrl(w.sourceUrl)) return false;
  if (isDefined(w.notes) && typeof w.notes !== "string") return false;
  if (isDefined(w.hash) && !isValidHexHash(w.hash)) return false;
  if (isDefined(w.stellarTransactionId) && typeof w.stellarTransactionId !== "string") return false;

  return true;
}

export function isValidRightsEvent(value: unknown): value is RightsEvent {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }
  const e = value as Record<string, unknown>;

  // Required fields
  if (typeof e.id !== "string" || !e.id.trim()) return false;
  if (typeof e.workId !== "string" || !e.workId.trim()) return false;
  if (typeof e.type !== "string" || !VALID_EVENT_TYPES.has(e.type)) return false;
  if (typeof e.actor !== "string") return false;
  if (!isValidDateString(e.effectiveDate)) return false;
  if (!isValidDateString(e.createdAt)) return false;

  // Optional fields validation: if present, must be strings
  if (isDefined(e.recipient) && typeof e.recipient !== "string") return false;
  if (isDefined(e.terms) && typeof e.terms !== "string") return false;
  if (isDefined(e.notes) && typeof e.notes !== "string") return false;
  if (isDefined(e.stellarTransactionId) && typeof e.stellarTransactionId !== "string") return false;

  return true;
}

export function isValidEventsArray(value: unknown): value is RightsEvent[] {
  return Array.isArray(value) && value.every(isValidRightsEvent);
}

function getLocalStorage(): Storage | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function readStoredValue<T>(
  key: string,
  validator?: (val: unknown) => val is T,
): T | null {
  const localStorage = getLocalStorage();

  if (!localStorage) {
    return null;
  }

  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      return null;
    }
    const parsed: unknown = JSON.parse(raw);
    if (validator) {
      return validator(parsed) ? parsed : null;
    }
    return parsed as T;
  } catch {
    return null;
  }
}

function writeStoredValue<T>(key: string, value: T): boolean {
  const localStorage = getLocalStorage();

  if (!localStorage) {
    return false;
  }

  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    // Storage can be unavailable in private browsing or when its quota is full.
    return false;
  }
}

export function getWork(): Work {
  return readStoredValue<Work>(storageKeys.work, isValidWork) ?? { ...demoWork };
}

export function saveWork(work: Work): boolean {
  if (!isValidWork(work)) {
    return false;
  }
  return writeStoredValue(storageKeys.work, work);
}

export function getEvents(): RightsEvent[] {
  const storedEvents = readStoredValue<RightsEvent[]>(
    storageKeys.events,
    isValidEventsArray,
  );
  if (storedEvents) {
    return storedEvents;
  }
  return demoEvents.map((event) => ({ ...event }));
}

export function saveEvents(events: RightsEvent[]): boolean {
  if (!isValidEventsArray(events)) {
    return false;
  }
  return writeStoredValue(storageKeys.events, events);
}

export function addEvent(event: RightsEvent): boolean {
  if (!isValidRightsEvent(event)) {
    return false;
  }
  const currentEvents = getEvents();
  const existing = currentEvents.find((e) => e.id === event.id);

  if (existing) {
    // Genuine idempotent retry: exact same event data
    if (areRightsEventsEqual(existing, event)) {
      return true;
    }
    // Conflicting event reusing an ID: reject to prevent hiding different data
    return false;
  }

  const updated = [...currentEvents, event];
  return saveEvents(updated);
}

export function buildInitialEvents(work: Work): RightsEvent[] {
  const regTimestamp = work.registeredAt || new Date().toISOString();
  const effectiveDate = work.createdAt || regTimestamp;

  const registrationEvent: RightsEvent = {
    id: `EVT-REG-${work.id}`,
    workId: work.id,
    type: "registration",
    actor: work.author,
    effectiveDate,
    terms: "Registro inicial de autoría y titularidad",
    notes: work.notes ? `Notas: ${work.notes}` : "Registro inicial de la obra en Authory.",
    stellarTransactionId: work.stellarTransactionId,
    createdAt: regTimestamp,
  };

  const evidenceEvent: RightsEvent = {
    id: `EVT-EVI-${work.id}`,
    workId: work.id,
    type: "evidence",
    actor: "Authory Protocol (Mock)",
    effectiveDate: regTimestamp,
    terms: `Evidencia anclada en Stellar ${work.network.toUpperCase()}`,
    notes: work.hash ? `Hash simulado: ${work.hash}` : "Huella criptográfica generada",
    stellarTransactionId: work.stellarTransactionId,
    createdAt: regTimestamp,
  };

  return [registrationEvent, evidenceEvent];
}

export function reconcileInitialEvents(work: Work): boolean {
  if (!work.id || work.status !== "registered") {
    return false;
  }

  const existing = getEvents();
  const initial = buildInitialEvents(work);

  const missing: RightsEvent[] = [];
  for (const initEvt of initial) {
    const alreadyExists = existing.some(
      (e) => e.workId === work.id && e.type === initEvt.type,
    );
    if (!alreadyExists) {
      missing.push(initEvt);
    }
  }

  if (missing.length === 0) {
    return true;
  }

  return saveEvents([...existing, ...missing]);
}

export type CompoundSaveStatus =
  | "success"
  | "failed_restored"
  | "failed_partial_inconsistent";

export interface CompoundSaveResult {
  status: CompoundSaveStatus;
  error?: string;
}

export function saveWorkWithInitialEvents(work: Work): CompoundSaveResult {
  if (!isValidWork(work)) {
    return {
      status: "failed_restored",
      error: "La obra no tiene una estructura de datos válida conforme al contrato.",
    };
  }

  const localStorage = getLocalStorage();
  if (!localStorage) {
    return {
      status: "failed_restored",
      error: "El almacenamiento local no está disponible.",
    };
  }

  // 1. Snapshot previous raw values to allow exact restoration (or key deletion)
  let prevWorkRaw: string | null = null;
  let prevEventsRaw: string | null = null;
  try {
    prevWorkRaw = localStorage.getItem(storageKeys.work);
    prevEventsRaw = localStorage.getItem(storageKeys.events);
  } catch {
    return {
      status: "failed_restored",
      error: "No se pudo leer el estado previo del almacenamiento local.",
    };
  }

  // 2. Attempt writing work
  const workSaved = writeStoredValue(storageKeys.work, work);
  if (!workSaved) {
    return {
      status: "failed_restored",
      error: "No fue posible escribir la obra en el almacenamiento local. Revisa cuota o permisos.",
    };
  }

  // 3. Prepare initial events
  const existingEvents = getEvents();
  const initial = buildInitialEvents(work);

  const missing: RightsEvent[] = [];
  for (const initEvt of initial) {
    const alreadyExists = existingEvents.some(
      (e) => e.workId === work.id && e.type === initEvt.type,
    );
    if (!alreadyExists) {
      missing.push(initEvt);
    }
  }

  const eventsToSave = missing.length > 0 ? [...existingEvents, ...missing] : existingEvents;
  const eventsSaved = writeStoredValue(storageKeys.events, eventsToSave);

  if (eventsSaved) {
    return { status: "success" };
  }

  // 4. Events write failed -> attempt rollback of work and events keys
  try {
    if (prevWorkRaw !== null) {
      localStorage.setItem(storageKeys.work, prevWorkRaw);
    } else {
      localStorage.removeItem(storageKeys.work);
    }

    try {
      if (prevEventsRaw !== null) {
        localStorage.setItem(storageKeys.events, prevEventsRaw);
      } else {
        localStorage.removeItem(storageKeys.events);
      }
    } catch {
      // Ignore inner catch; will be evaluated by actual storage state below
    }
  } catch {
    // Ignore outer catch; will be evaluated by actual storage state below
  }

  // 5. Evaluate actual final state of affected keys to verify restoration
  let isFullyRestored = false;
  try {
    const finalWorkRaw = localStorage.getItem(storageKeys.work);
    const finalEventsRaw = localStorage.getItem(storageKeys.events);
    isFullyRestored =
      finalWorkRaw === prevWorkRaw && finalEventsRaw === prevEventsRaw;
  } catch {
    isFullyRestored = false;
  }

  if (isFullyRestored) {
    return {
      status: "failed_restored",
      error:
        "No se pudieron guardar los eventos iniciales. Se verificó que el estado previo del almacenamiento local fue restaurado.",
    };
  } else {
    return {
      status: "failed_partial_inconsistent",
      error:
        "Error en persistencia: los eventos fallaron y el almacenamiento no se restauró a su estado anterior. El almacenamiento local se encuentra en estado parcial.",
    };
  }
}

export function resetDemo(): void {
  const localStorage = getLocalStorage();

  if (!localStorage) {
    return;
  }

  try {
    localStorage.removeItem(storageKeys.work);
    localStorage.removeItem(storageKeys.events);
    localStorage.removeItem(storageKeys.rights);
  } catch {
    // Keep the in-memory demo fallback available if browser storage is unavailable.
  }
}
