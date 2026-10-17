"use client";

import { useEffect, useState } from "react";
import { History, ShieldAlert, ArrowLeft, PlusCircle } from "lucide-react";

import { BrutalistButton } from "@/components/ui/brutalist-button";
import { Panel } from "@/components/ui/panel";
import { StatusBadge, type StatusBadgeVariant } from "@/components/ui/status-badge";
import { getEvents, getWork, reconcileInitialEvents } from "@/lib/storage";
import type { RightsEvent, RightsEventType } from "@/types/rights-event";
import type { Work } from "@/types/work";

export interface WorkHistoryProps {
  workId: string;
}

interface TypeMeta {
  title: string;
  badge: string;
  variant: StatusBadgeVariant;
}

const eventTypeMetadata: Record<RightsEventType, TypeMeta> = {
  registration: {
    title: "Registro de Autoría y Metadatos",
    badge: "REGISTRO",
    variant: "active",
  },
  evidence: {
    title: "Generación de Evidencia Criptográfica",
    badge: "EVIDENCIA",
    variant: "success",
  },
  license: {
    title: "Concesión de Licencia de Uso",
    badge: "LICENCIA",
    variant: "neutral",
  },
  assignment: {
    title: "Cesión de Derechos Patrimoniales",
    badge: "CESIÓN",
    variant: "active",
  },
  transfer: {
    title: "Transferencia de Titularidad",
    badge: "TRANSFERENCIA",
    variant: "active",
  },
};

function formatIsoDate(iso: string): string {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) {
      return iso;
    }
    return new Intl.DateTimeFormat("es-MX", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "UTC",
    }).format(d);
  } catch {
    return iso;
  }
}

function sortWorkEvents(workEvents: RightsEvent[]): RightsEvent[] {
  return [...workEvents].sort((a, b) => {
    const timeA = new Date(a.createdAt).getTime();
    const timeB = new Date(b.createdAt).getTime();
    if (Number.isNaN(timeA) || Number.isNaN(timeB)) {
      return a.id.localeCompare(b.id);
    }
    if (timeA !== timeB) {
      return timeA - timeB;
    }
    return a.id.localeCompare(b.id);
  });
}

export function WorkHistory({ workId }: WorkHistoryProps) {
  const [work, setWork] = useState<Work | null>(null);
  const [events, setEvents] = useState<RightsEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reconciliationFailed, setReconciliationFailed] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadHistory() {
      const persisted = getWork();
      if (persisted.id === workId) {
        if (!isMounted) return;
        setWork(persisted);
        const ok = reconcileInitialEvents(persisted);
        setReconciliationFailed(!ok);
        const allEvents = getEvents();
        const workEvents = allEvents.filter((e) => e.workId === workId);
        setEvents(sortWorkEvents(workEvents));
        setIsLoading(false);
        return;
      }

      // Try fetching from Supabase / server API
      try {
        const [workRes, eventsRes] = await Promise.all([
          fetch(`/api/works?id=${encodeURIComponent(workId)}`),
          fetch(`/api/events?workId=${encodeURIComponent(workId)}`),
        ]);

        if (workRes.ok) {
          const workData = await workRes.json();
          if (workData.work && isMounted) {
            setWork(workData.work);
            let remoteEvents: RightsEvent[] = [];
            if (eventsRes.ok) {
              const eventsData = await eventsRes.json();
              remoteEvents = eventsData.events || [];
            }
            setEvents(sortWorkEvents(remoteEvents));
            setIsLoading(false);
            return;
          }
        }
      } catch {
        // Fallback
      }

      if (isMounted) {
        setWork(null);
        setEvents([]);
        setReconciliationFailed(false);
        setIsLoading(false);
      }
    }

    void loadHistory();

    return () => {
      isMounted = false;
    };
  }, [workId]);

  const handleRetryReconciliation = () => {
    if (!work) return;
    const ok = reconcileInitialEvents(work);
    setReconciliationFailed(!ok);
    const allEvents = getEvents();
    const workEvents = allEvents.filter((e) => e.workId === work.id);
    setEvents(sortWorkEvents(workEvents));
  };

  if (isLoading) {
    return (
      <Panel padding="md">
        <p className="font-ui text-xs font-bold tracking-[0.1em] text-ink">
          CARGANDO HISTORIAL DE EVENTOS...
        </p>
      </Panel>
    );
  }

  if (!work) {
    return (
      <section aria-labelledby="work-not-found-title" className="mx-auto max-w-3xl">
        <Panel padding="md">
          <div className="flex items-start gap-3">
            <ShieldAlert className="size-6 shrink-0 text-red-600" />
            <div>
              <h1
                className="font-display text-2xl font-bold tracking-[-0.05em] text-ink"
                id="work-not-found-title"
              >
                OBRA NO ENCONTRADA EN EL HISTORIAL
              </h1>
              <p className="mt-2 font-ui text-sm leading-6 text-ink/75">
                No existe un registro local activo para el identificador <code>{workId}</code>.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <BrutalistButton href="/" variant="secondary">
                  VOLVER AL INICIO
                </BrutalistButton>
                <BrutalistButton href="/verificar">VERIFICAR OTRA OBRA</BrutalistButton>
              </div>
            </div>
          </div>
        </Panel>
      </section>
    );
  }

  return (
    <section aria-labelledby="history-heading" className="mx-auto w-full max-w-4xl">
      {/* Header bar */}
      <div className="flex flex-wrap items-start justify-between gap-4 border-l-4 border-cyan pl-4 sm:pl-6">
        <div>
          <div className="flex items-center gap-2">
            <History className="size-4 text-ink/65" />
            <p className="font-ui text-xs font-bold tracking-[0.1em] text-ink/65">
              HISTORIAL CRONOLÓGICO DE DERECHOS
            </p>
          </div>
          <h1
            className="mt-1 font-display text-3xl font-semibold tracking-[-0.065em] text-ink sm:text-4xl"
            id="history-heading"
          >
            {work.title}
          </h1>
          <p className="mt-2 font-ui text-sm leading-6 text-ink/75">
            Authory ID: <code className="font-bold">{work.id}</code> · Autor original: <strong>{work.author}</strong>
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <BrutalistButton href={`/obra/${work.id}/derechos`} size="sm">
            <PlusCircle className="mr-1 size-3.5" />
            REGISTRAR DERECHOS →
          </BrutalistButton>
          <BrutalistButton href={`/obra/${work.id}`} size="sm" variant="secondary">
            <ArrowLeft className="mr-1 size-3.5" />
            DETALLE
          </BrutalistButton>
        </div>
      </div>

      {/* Honest notice */}
      <div className="mt-6 border-2 border-border bg-neutral/60 p-4">
        <p className="font-ui text-xs leading-5 text-ink/80">
          <strong>Trazabilidad auditable:</strong> Cada evento registrado en este historial representa una declaración de derechos o evidencia vinculada al Authory ID de la obra. Las transacciones asociadas son simuladas para propósitos de demostración en Stellar Testnet.
        </p>
      </div>

      {reconciliationFailed && (
        <div
          aria-live="polite"
          className="mt-4 border-2 border-border bg-amber-50 p-4"
          role="alert"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-ui text-xs font-bold uppercase tracking-[0.05em] text-amber-900">
                Aviso: Reconciliación de eventos incompleta
              </p>
              <p className="mt-1 font-ui text-xs leading-5 text-amber-800">
                No fue posible persistir los eventos iniciales de registro y evidencia en el almacenamiento local. El historial puede estar incompleto y no reflejar todas las acciones.
              </p>
            </div>
            <button
              className="shrink-0 border-2 border-border bg-yellow px-3 py-1.5 font-ui text-xs font-bold text-ink hover:bg-yellow/90"
              onClick={handleRetryReconciliation}
              type="button"
            >
              REINTENTAR RECONCILIACIÓN
            </button>
          </div>
        </div>
      )}

      {/* Events timeline */}
      <div className="mt-8">
        {events.length === 0 ? (
          <Panel padding="md">
            <p className="font-ui text-xs font-bold tracking-[0.08em] text-ink">
              NO SE HAN ENCONTRADO EVENTOS PARA ESTA OBRA
            </p>
            <p className="mt-1 font-ui text-xs text-ink/70">
              Registra una licencia o cesión para comenzar el historial.
            </p>
          </Panel>
        ) : (
          <ol className="relative space-y-6 border-l-2 border-border pl-6 sm:pl-8">
            {events.map((event, index) => {
              const meta = eventTypeMetadata[event.type] ?? {
                title: event.type,
                badge: event.type.toUpperCase(),
                variant: "neutral" as StatusBadgeVariant,
              };

              const showEffectiveDiff =
                event.effectiveDate &&
                event.effectiveDate.slice(0, 10) !== event.createdAt.slice(0, 10);

              return (
                <li key={event.id} className="relative">
                  {/* Timeline bullet */}
                  <span className="absolute -left-[31px] top-4 flex size-5 items-center justify-center border-2 border-border bg-cyan font-ui text-[10px] font-bold text-ink sm:-left-[39px]">
                    {index + 1}
                  </span>

                  <Panel padding="none">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-border bg-neutral px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <span className="font-ui text-[11px] font-bold tracking-[0.08em] text-ink">
                          {event.id}
                        </span>
                        <span className="text-[11px] text-ink/40">·</span>
                        <span className="font-ui text-[11px] text-ink/70">
                          {formatIsoDate(event.createdAt)}
                        </span>
                      </div>
                      <StatusBadge variant={meta.variant}>{meta.badge}</StatusBadge>
                    </div>

                    <div className="p-4 sm:p-5">
                      <h2 className="font-display text-lg font-bold tracking-[-0.03em] text-ink">
                        {meta.title}
                      </h2>

                      <dl className="mt-4 grid border-l-2 border-t-2 border-border sm:grid-cols-2">
                        <div className="border-b-2 border-r-2 border-border p-2.5">
                          <dt className="font-ui text-[10px] font-bold tracking-[0.1em] text-ink/60">
                            DECLARANTE / ACTOR
                          </dt>
                          <dd className="mt-1 font-ui text-xs font-semibold text-ink">
                            {event.actor}
                          </dd>
                        </div>

                        {event.recipient ? (
                          <div className="border-b-2 border-r-2 border-border p-2.5">
                            <dt className="font-ui text-[10px] font-bold tracking-[0.1em] text-ink/60">
                              RECEPTOR / BENEFICIARIO
                            </dt>
                            <dd className="mt-1 font-ui text-xs font-semibold text-ink">
                              {event.recipient}
                            </dd>
                          </div>
                        ) : (
                          <div className="border-b-2 border-r-2 border-border p-2.5">
                            <dt className="font-ui text-[10px] font-bold tracking-[0.1em] text-ink/60">
                              ALCANCE
                            </dt>
                            <dd className="mt-1 font-ui text-xs text-ink/80">
                              {event.type === "registration" ? "Registro primario" : "Emisión de evidencia"}
                            </dd>
                          </div>
                        )}

                        {event.terms ? (
                          <div className="border-b-2 border-r-2 border-border p-2.5 sm:col-span-2">
                            <dt className="font-ui text-[10px] font-bold tracking-[0.1em] text-ink/60">
                              TÉRMINOS / CONDICIONES
                            </dt>
                            <dd className="mt-1 font-ui text-xs leading-5 text-ink">
                              {event.terms}
                            </dd>
                          </div>
                        ) : null}

                        {event.notes ? (
                          <div className="border-b-2 border-r-2 border-border p-2.5 sm:col-span-2">
                            <dt className="font-ui text-[10px] font-bold tracking-[0.1em] text-ink/60">
                              NOTAS
                            </dt>
                            <dd className="mt-1 font-ui text-xs leading-5 text-ink/75">
                              {event.notes}
                            </dd>
                          </div>
                        ) : null}

                        {showEffectiveDiff ? (
                          <div className="border-b-2 border-r-2 border-border p-2.5">
                            <dt className="font-ui text-[10px] font-bold tracking-[0.1em] text-ink/60">
                              FECHA EFECTIVA (VIGENCIA)
                            </dt>
                            <dd className="mt-1 font-ui text-xs text-ink">
                              {formatIsoDate(event.effectiveDate)}
                            </dd>
                          </div>
                        ) : null}

                        {event.stellarTransactionId ? (
                          <div className={`border-b-2 border-r-2 border-border p-2.5 ${showEffectiveDiff ? "" : "sm:col-span-2"}`}>
                            <dt className="font-ui text-[10px] font-bold tracking-[0.1em] text-ink/60">
                              {event.stellarTransactionId.startsWith("mock_")
                                ? "TRANSACCIÓN REGISTRADA"
                                : "TRANSACCIÓN EN STELLAR TESTNET"}
                            </dt>
                            <dd
                              className="mt-1 line-clamp-1 break-all font-mono text-[11px] text-ink"
                              title={event.stellarTransactionId}
                            >
                              {!event.stellarTransactionId.startsWith("mock_") ? (
                                <a
                                  className="font-semibold text-cyan-800 underline decoration-cyan hover:text-cyan-900"
                                  href={`https://stellar.expert/explorer/testnet/tx/${event.stellarTransactionId}`}
                                  rel="noreferrer"
                                  target="_blank"
                                >
                                  {event.stellarTransactionId.slice(0, 16)}…{event.stellarTransactionId.slice(-8)} ↗
                                </a>
                              ) : (
                                event.stellarTransactionId
                              )}
                            </dd>
                          </div>
                        ) : null}
                      </dl>
                    </div>
                  </Panel>
                </li>
              );
            })}
          </ol>
        )}
      </div>

      {/* Bottom navigation */}
      <div className="mt-10 flex flex-wrap gap-3 border-t-2 border-border pt-4">
        <BrutalistButton href={`/obra/${work.id}`} variant="secondary">
          VOLVER AL DETALLE DE LA OBRA
        </BrutalistButton>
        <BrutalistButton href={`/verificar?workId=${encodeURIComponent(work.id)}`} variant="yellow">
          VERIFICAR ESTA OBRA →
        </BrutalistButton>
        <BrutalistButton href={`/obra/${work.id}/derechos`}>
          REGISTRAR OTRA LICENCIA O CESIÓN →
        </BrutalistButton>
      </div>
    </section>
  );
}
