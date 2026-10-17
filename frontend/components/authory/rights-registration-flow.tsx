"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, AlertTriangle, ShieldAlert } from "lucide-react";

import { BrutalistButton } from "@/components/ui/brutalist-button";
import { Input } from "@/components/ui/input";
import { Panel } from "@/components/ui/panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { Textarea } from "@/components/ui/textarea";
import { addEvent, getWork } from "@/lib/storage";
import { createMockRightsEvidence } from "@/lib/stellar/mock-stellar";
import type { RightsEvent } from "@/types/rights-event";
import type { Work } from "@/types/work";

export interface RightsRegistrationFlowProps {
  workId: string;
}

const rightsFormSchema = z.object({
  type: z.enum(["license", "assignment"], {
    error: "Selecciona el tipo de registro.",
  }),
  actor: z.string().trim().min(1, "Indica el declarante o titular actual."),
  recipient: z.string().trim().min(1, "Indica el receptor o beneficiario."),
  terms: z.string().trim().min(1, "Especifica las condiciones o alcance de los derechos."),
  effectiveDate: z.string().min(1, "Indica la fecha de entrada en vigencia."),
  notes: z.string().trim().optional(),
});

type RightsFormValues = z.infer<typeof rightsFormSchema>;

function generateEventId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `EVT-${crypto.randomUUID()}`;
  }
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 8);
  return `EVT-${timestamp}-${randomPart}`;
}

export function RightsRegistrationFlow({ workId }: RightsRegistrationFlowProps) {
  const [work, setWork] = useState<Work | null>(null);
  const [isLoadingWork, setIsLoadingWork] = useState(true);
  const [submissionState, setSubmissionState] = useState<
    "idle" | "submitting" | "confirmed" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmedEvent, setConfirmedEvent] = useState<RightsEvent | null>(null);
  const [retryEventId, setRetryEventId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RightsFormValues>({
    resolver: zodResolver(rightsFormSchema),
    defaultValues: {
      type: "license",
      actor: "",
      recipient: "",
      terms: "",
      effectiveDate: new Date().toISOString().slice(0, 10),
      notes: "",
    },
  });

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const persisted = getWork();
      if (persisted.id === workId) {
        setWork(persisted);
        reset({
          type: "license",
          actor: persisted.author,
          recipient: "",
          terms: "",
          effectiveDate: new Date().toISOString().slice(0, 10),
          notes: "",
        });
      } else {
        setWork(null);
      }
      setIsLoadingWork(false);
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [workId, reset]);

  const handleFormSubmit = async (values: RightsFormValues) => {
    if (!work || work.id !== workId) {
      setErrorMessage("La obra activa no coincide con la solicitud actual.");
      setSubmissionState("error");
      return;
    }

    setSubmissionState("submitting");
    setErrorMessage(null);

    // Reuse existing ID on retry if a previous attempt failed, or generate a new ID
    const eventId = retryEventId ?? generateEventId();
    if (!retryEventId) {
      setRetryEventId(eventId);
    }

    const createdAt = new Date().toISOString();
    const effectiveDate = values.effectiveDate.includes("T")
      ? values.effectiveDate
      : `${values.effectiveDate}T00:00:00.000Z`;

    const partialEvent: RightsEvent = {
      id: eventId,
      workId: work.id,
      type: values.type,
      actor: values.actor.trim(),
      recipient: values.recipient.trim(),
      effectiveDate,
      terms: values.terms.trim(),
      ...(values.notes?.trim() ? { notes: values.notes.trim() } : {}),
      createdAt,
    };

    try {
      // 1. Record on Soroban smart contract via Next.js backend API
      let txId: string | undefined;

      try {
        const res = await fetch("/api/stellar/record-rights", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            workId: work.id,
            eventId: partialEvent.id,
            eventType: partialEvent.type,
            actor: partialEvent.actor,
            recipient: partialEvent.recipient,
            terms: partialEvent.terms,
            effectiveDate: partialEvent.effectiveDate,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success && data.transactionId) {
            txId = data.transactionId;
          }
        }
      } catch (chainErr) {
        console.warn("Error calling record-rights API, falling back:", chainErr);
      }

      // Fallback to local mock ledger if API call failed
      if (!txId) {
        const mockEvidence = await createMockRightsEvidence(partialEvent);
        txId = mockEvidence.transactionId;
      }

      // Verify work is still active
      const currentWork = getWork();
      if (currentWork.id !== work.id) {
        throw new Error("La obra activa cambió durante la operación.");
      }

      const completeEvent: RightsEvent = {
        ...partialEvent,
        stellarTransactionId: txId,
      };

      // 2. Persist event to storage
      const saved = addEvent(completeEvent);
      if (!saved) {
        throw new Error("No se pudo persistir el evento en el almacenamiento local.");
      }

      // Asynchronously sync to Supabase backend database if available
      void fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event: completeEvent }),
      }).catch(() => {});

      // Success
      setRetryEventId(null);
      setConfirmedEvent(completeEvent);
      setSubmissionState("confirmed");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al procesar el registro de derechos.";
      setErrorMessage(msg);
      setSubmissionState("error");
    }
  };

  if (isLoadingWork) {
    return (
      <Panel padding="md">
        <p className="font-ui text-xs font-bold tracking-[0.1em] text-ink">
          CARGANDO DATOS DE LA OBRA...
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
                OBRA NO ENCONTRADA EN EL REGISTRO LOCAL
              </h1>
              <p className="mt-2 font-ui text-sm leading-6 text-ink/75">
                No es posible registrar licencias o cesiones porque la obra con ID <code>{workId}</code> no se encuentra activa en el almacenamiento local de este navegador.
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

  if (submissionState === "confirmed" && confirmedEvent) {
    return (
      <section
        aria-labelledby="confirmed-title"
        className="mx-auto w-full max-w-3xl"
      >
        <Panel padding="none">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-border bg-cyan px-4 py-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-5 text-ink" />
              <span className="font-ui text-xs font-bold tracking-[0.1em] text-ink">
                REGISTRO DE DERECHOS CONFIRMADO
              </span>
            </div>
            <StatusBadge variant="success">CONFIRMADO</StatusBadge>
          </div>

          <div className="p-6">
            <h1
              className="font-display text-2xl font-bold tracking-[-0.05em] text-ink"
              id="confirmed-title"
            >
              {confirmedEvent.type === "license"
                ? "LICENCIA DE USO REGISTRADA"
                : "CESIÓN DE DERECHOS REGISTRADA"}
            </h1>
            <p className="mt-2 font-ui text-xs leading-5 text-ink/70">
              Se ha creado una referencia simulada en Stellar Testnet para el evento de derechos de la obra <strong>{work.title}</strong>.
            </p>

            <dl className="mt-6 grid border-l-2 border-t-2 border-border sm:grid-cols-2">
              <div className="border-b-2 border-r-2 border-border p-3">
                <dt className="font-ui text-[10px] font-bold tracking-[0.1em] text-ink/60">ID DE EVENTO</dt>
                <dd className="mt-1 font-ui text-xs font-semibold text-ink">{confirmedEvent.id}</dd>
              </div>
              <div className="border-b-2 border-r-2 border-border p-3">
                <dt className="font-ui text-[10px] font-bold tracking-[0.1em] text-ink/60">TIPO DE DERECHO</dt>
                <dd className="mt-1 font-ui text-xs uppercase text-ink">
                  {confirmedEvent.type === "license" ? "Licencia de Uso" : "Cesión de Derechos"}
                </dd>
              </div>
              <div className="border-b-2 border-r-2 border-border p-3">
                <dt className="font-ui text-[10px] font-bold tracking-[0.1em] text-ink/60">TITULAR / DECLARANTE</dt>
                <dd className="mt-1 font-ui text-xs text-ink">{confirmedEvent.actor}</dd>
              </div>
              <div className="border-b-2 border-r-2 border-border p-3">
                <dt className="font-ui text-[10px] font-bold tracking-[0.1em] text-ink/60">RECEPTOR / BENEFICIARIO</dt>
                <dd className="mt-1 font-ui text-xs text-ink">{confirmedEvent.recipient}</dd>
              </div>
              <div className="border-b-2 border-r-2 border-border p-3 sm:col-span-2">
                <dt className="font-ui text-[10px] font-bold tracking-[0.1em] text-ink/60">CONDICIONES / TÉRMINOS</dt>
                <dd className="mt-1 font-ui text-xs text-ink">{confirmedEvent.terms}</dd>
              </div>
              <div className="border-b-2 border-r-2 border-border p-3">
                <dt className="font-ui text-[10px] font-bold tracking-[0.1em] text-ink/60">FECHA EFECTIVA</dt>
                <dd className="mt-1 font-ui text-xs text-ink">{confirmedEvent.effectiveDate.slice(0, 10)}</dd>
              </div>
              <div className="border-b-2 border-r-2 border-border p-3">
                <dt className="font-ui text-[10px] font-bold tracking-[0.1em] text-ink/60">
                  {confirmedEvent.stellarTransactionId && !confirmedEvent.stellarTransactionId.startsWith("mock_")
                    ? "TRANSACCIÓN EN STELLAR TESTNET"
                    : "TRANSACCIÓN REGISTRADA"}
                </dt>
                <dd className="mt-1 line-clamp-1 break-all font-mono text-[11px] text-ink" title={confirmedEvent.stellarTransactionId}>
                  {confirmedEvent.stellarTransactionId && !confirmedEvent.stellarTransactionId.startsWith("mock_") ? (
                    <a
                      className="font-semibold text-cyan-800 underline decoration-cyan hover:text-cyan-900"
                      href={`https://stellar.expert/explorer/testnet/tx/${confirmedEvent.stellarTransactionId}`}
                      rel="noreferrer"
                      target="_blank"
                    >
                      {confirmedEvent.stellarTransactionId.slice(0, 16)}…{confirmedEvent.stellarTransactionId.slice(-8)} ↗
                    </a>
                  ) : (
                    confirmedEvent.stellarTransactionId
                  )}
                </dd>
              </div>
            </dl>

            <div className="mt-8 flex flex-wrap gap-3 border-t-2 border-border pt-4">
              <BrutalistButton href={`/obra/${work.id}/historial`} variant="yellow">
                VER EN EL HISTORIAL →
              </BrutalistButton>
              <BrutalistButton href={`/obra/${work.id}`} variant="secondary">
                VOLVER AL DETALLE DE LA OBRA
              </BrutalistButton>
              <button
                className="font-ui text-xs font-semibold text-ink/70 underline hover:text-ink focus-visible:outline-2"
                onClick={() => {
                  setConfirmedEvent(null);
                  setSubmissionState("idle");
                  setRetryEventId(null);
                  reset({
                    type: "license",
                    actor: work.author,
                    recipient: "",
                    terms: "",
                    effectiveDate: new Date().toISOString().slice(0, 10),
                    notes: "",
                  });
                }}
                type="button"
              >
                Registrar otro evento
              </button>
            </div>
          </div>
        </Panel>
      </section>
    );
  }

  return (
    <section aria-labelledby="rights-flow-title" className="mx-auto w-full max-w-4xl">
      <div className="border-l-4 border-cyan pl-4 sm:pl-6">
        <p className="font-ui text-xs font-bold tracking-[0.1em] text-ink/65">
          GESTIÓN Y TRAZABILIDAD DE DERECHOS
        </p>
        <h1
          className="mt-1 font-display text-3xl font-semibold tracking-[-0.065em] text-ink sm:text-4xl"
          id="rights-flow-title"
        >
          REGISTRAR LICENCIA O CESIÓN
        </h1>
        <p className="mt-2 font-ui text-sm leading-6 text-ink/75">
          Obra: <strong>{work.title}</strong> (ID: <code>{work.id}</code>) · Autor original: <strong>{work.author}</strong>
        </p>
      </div>

      <div className="mt-6 border-2 border-border bg-neutral/60 p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 size-5 shrink-0 text-ink/80" />
          <p className="font-ui text-xs leading-5 text-ink/80">
            <strong>Aviso legal y técnico:</strong> Este registro asienta una declaración en el historial local y genera una referencia simulada en Stellar. No constituye un contrato legal ejecutado ni modifica la autoría histórica irrevocable de la obra.
          </p>
        </div>
      </div>

      {submissionState === "error" && errorMessage && (
        <div className="mt-4 border-2 border-border bg-red-50 p-4" role="alert">
          <p className="font-ui text-xs font-bold text-red-800">Error al guardar:</p>
          <p className="mt-1 font-ui text-xs text-red-700">{errorMessage}</p>
          <p className="mt-2 font-ui text-[11px] text-red-600">
            Los datos ingresados se han conservado para que puedas reintentar.
          </p>
        </div>
      )}

      <form className="mt-6" noValidate onSubmit={handleSubmit(handleFormSubmit)}>
        <Panel padding="md">
          <div className="grid gap-x-5 gap-y-4 sm:grid-cols-2">
            <label className="flex w-full flex-col gap-2 font-ui sm:col-span-2">
              <span className="text-[11px] font-bold tracking-[0.08em] text-ink">
                TIPO DE DERECHO *
              </span>
              <select
                aria-invalid={Boolean(errors.type)}
                className="min-h-11 w-full border-2 border-border bg-white px-3 text-sm text-ink focus:border-cyan focus:outline-none"
                {...register("type")}
              >
                <option value="license">Licencia de uso (autorización no exclusiva o delimitada)</option>
                <option value="assignment">Cesión de derechos (transferencia patrimonial)</option>
              </select>
              {errors.type && (
                <span className="text-[11px] font-semibold text-red-600">{errors.type.message}</span>
              )}
            </label>

            <Input
              error={errors.actor?.message}
              label="DECLARANTE O TITULAR ACTUAL *"
              placeholder="Nombre del declarante"
              {...register("actor")}
            />

            <Input
              error={errors.recipient?.message}
              label="RECEPTOR O BENEFICIARIO *"
              placeholder="Nombre o entidad que recibe los derechos"
              {...register("recipient")}
            />

            <Input
              error={errors.effectiveDate?.message}
              label="FECHA EFECTIVA (VIGENCIA) *"
              type="date"
              {...register("effectiveDate")}
            />

            <div className="sm:col-span-2">
              <Textarea
                error={errors.terms?.message}
                label="ALCANCE Y CONDICIONES *"
                placeholder="Ej. Licencia comercial mundial para publicación impresa por 2 años..."
                {...register("terms")}
              />
            </div>

            <div className="sm:col-span-2">
              <Textarea
                label="NOTAS ADICIONALES (OPCIONAL)"
                placeholder="Referencias contractuales, cláusulas de revocabilidad..."
                {...register("notes")}
              />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t-2 border-border pt-4">
            <BrutalistButton
              disabled={isSubmitting || submissionState === "submitting"}
              type="submit"
            >
              {submissionState === "submitting"
                ? "REGISTRANDO EN STELLAR (MOCK)..."
                : "REGISTRAR DERECHOS EN HISTORIAL →"}
            </BrutalistButton>

            <BrutalistButton href={`/obra/${work.id}`} size="sm" variant="secondary">
              CANCELAR
            </BrutalistButton>
          </div>
        </Panel>
      </form>
    </section>
  );
}
