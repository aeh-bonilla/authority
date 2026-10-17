"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, type ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { PrivacyNotice } from "@/components/authory/privacy-notice";
import { ProgressStepper } from "@/components/authory/progress-stepper";
import { BrutalistButton } from "@/components/ui/brutalist-button";
import { Input } from "@/components/ui/input";
import { Panel } from "@/components/ui/panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { Textarea } from "@/components/ui/textarea";
import { saveWork, saveWorkWithInitialEvents } from "@/lib/storage";
import {
  createMockAuthoryId,
  createMockEvidence,
} from "@/lib/stellar/mock-stellar";
import { computeFileSha256, computeTextSha256 } from "@/lib/stellar/client-crypto";
import type { Work, WorkType } from "@/types/work";

const workTypes = [
  "photography",
  "illustration",
  "document",
  "music",
  "code",
  "video",
  "other",
] as const satisfies readonly WorkType[];

const workTypeOptions: ReadonlyArray<{ value: WorkType; label: string }> = [
  { value: "photography", label: "Fotografía" },
  { value: "illustration", label: "Ilustración" },
  { value: "document", label: "Documento" },
  { value: "music", label: "Música" },
  { value: "code", label: "Código" },
  { value: "video", label: "Video" },
  { value: "other", label: "Otro" },
];

const registerWorkSchema = z
  .object({
    title: z.string().trim().min(1, "Indica el título de la obra."),
    type: z.enum(workTypes, { error: "Selecciona un tipo de obra." }),
    description: z.string().trim().min(1, "Describe brevemente la obra."),
    sourceUrl: z
      .string()
      .trim()
      .refine(
        (val) => !val || /^https?:\/\//i.test(val),
        "El enlace debe comenzar con http:// o https://",
      ),
    author: z.string().trim().min(1, "Indica el nombre de la persona autora."),
    createdAt: z.string(),
    notes: z.string().trim(),
    hasFile: z.boolean(),
  })
  .superRefine(({ hasFile, sourceUrl }, context) => {
    if (!hasFile && !sourceUrl) {
      context.addIssue({
        code: "custom",
        message: "Selecciona un archivo o indica un enlace.",
        path: ["sourceUrl"],
      });
    }
  });

type RegisterWorkValues = z.infer<typeof registerWorkSchema>;
type FlowState = "register" | "generating" | "created" | "error";

interface FileMetadata {
  filename: string;
  fileSize: string;
  fileMimeType?: string;
}

function wait(duration: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, duration);
  });
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function toCreatedAt(value: string): string | undefined {
  return value ? `${value}T00:00:00.000Z` : undefined;
}

function shortenHash(hash: string): string {
  return `${hash.slice(0, 12)}…${hash.slice(-8)}`;
}

export function RegisterWorkFlow() {
  const [flowState, setFlowState] = useState<FlowState>("register");
  const [fileMetadata, setFileMetadata] = useState<FileMetadata>();
  const [realHash, setRealHash] = useState<string>();
  const [work, setWork] = useState<Work>();
  const [currentStep, setCurrentStep] = useState(1);
  const [generationRun, setGenerationRun] = useState(0);
  const [generationError, setGenerationError] = useState<string>();

  const {
    formState: { errors },
    handleSubmit,
    register,
    setValue,
  } = useForm<RegisterWorkValues>({
    resolver: zodResolver(registerWorkSchema),
    defaultValues: {
      title: "",
      type: undefined,
      description: "",
      sourceUrl: "",
      author: "",
      createdAt: "",
      notes: "",
      hasFile: false,
    },
  });

  useEffect(() => {
    if (flowState !== "generating" || !work || generationRun === 0) {
      return;
    }

    const generationWork = work;
    let cancelled = false;

    async function generateEvidence() {
      try {
        await wait(350);
        if (cancelled) return;
        setCurrentStep(2);

        await wait(350);
        if (cancelled) return;
        setCurrentStep(3);

        // Try on-chain registration on Soroban contract via Next.js backend API
        let onChainTx: {
          transactionId: string;
          registeredAt: string;
          hash: string;
        } | null = null;

        try {
          const finalHash =
            generationWork.hash ||
            (await computeTextSha256(
              `${generationWork.id}:${generationWork.title}:${generationWork.author}`,
            ));

          const res = await fetch("/api/stellar/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              workId: generationWork.id,
              hash: finalHash,
              author: generationWork.author,
            }),
          });

          if (res.ok) {
            const data = await res.json();
            if (data.success && data.transactionId) {
              onChainTx = {
                transactionId: data.transactionId,
                registeredAt: data.timestamp || new Date().toISOString(),
                hash: finalHash,
              };
            }
          }
        } catch (chainErr) {
          console.warn("Testnet API call fell back to local ledger:", chainErr);
        }

        let updatedWork: Work;

        if (onChainTx) {
          updatedWork = {
            ...generationWork,
            hash: onChainTx.hash,
            stellarTransactionId: onChainTx.transactionId,
            registeredAt: onChainTx.registeredAt,
            network: "testnet",
            status: "registered",
          };
        } else {
          // Fallback to local mock ledger
          const evidence = await createMockEvidence(generationWork);
          if (cancelled) return;

          updatedWork = {
            ...generationWork,
            hash: evidence.hash,
            stellarTransactionId: evidence.transactionId,
            registeredAt: evidence.registeredAt,
            network: evidence.network,
            status: "registered",
          };
        }

        const saveResult = saveWorkWithInitialEvents(updatedWork);
        if (saveResult.status !== "success") {
          if (!cancelled) {
            setGenerationError(
              saveResult.error ??
                "No se pudo completar el guardado en el almacenamiento local. Revisa el espacio disponible.",
            );
            setFlowState("error");
          }
          return;
        }

        setWork(updatedWork);
        setCurrentStep(4);
        setFlowState("created");
      } catch {
        if (!cancelled) {
          setGenerationError("No fue posible crear la evidencia. Inténtalo de nuevo.");
          setFlowState("error");
        }
      }
    }

    void generateEvidence();

    return () => {
      cancelled = true;
    };
  }, [flowState, generationRun, work]);

  function startGeneration(nextWork: Work): void {
    setWork(nextWork);
    setCurrentStep(1);
    setGenerationError(undefined);
    setGenerationRun((run) => run + 1);
    setFlowState("generating");
  }

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>): Promise<void> {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      setFileMetadata(undefined);
      setRealHash(undefined);
      setValue("hasFile", false, { shouldValidate: true });
      return;
    }

    setFileMetadata({
      filename: selectedFile.name,
      fileSize: formatFileSize(selectedFile.size),
      fileMimeType: selectedFile.type || undefined,
    });
    setValue("hasFile", true, { shouldValidate: true });

    // Calculate real SHA-256 using Web Crypto API in browser
    try {
      const calculatedHash = await computeFileSha256(selectedFile);
      setRealHash(calculatedHash);
    } catch (err) {
      console.warn("Error computing file SHA-256:", err);
    }
  }

  function handleRegister(values: RegisterWorkValues): void {
    const sourceUrl = values.sourceUrl.trim();
    const notes = values.notes.trim();
    const createdAt = toCreatedAt(values.createdAt);
    const nextWork: Work = {
      id: createMockAuthoryId(),
      title: values.title,
      type: values.type,
      description: values.description,
      author: values.author,
      network: "testnet",
      status: "processing",
      ...(realHash ? { hash: realHash } : {}),
      ...(createdAt ? { createdAt } : {}),
      ...(fileMetadata ?? {}),
      ...(sourceUrl ? { sourceUrl } : {}),
      ...(notes ? { notes } : {}),
    };

    saveWork(nextWork);
    startGeneration(nextWork);
  }

  if (flowState === "generating") {
    return (
      <section aria-labelledby="generation-title" className="mx-auto max-w-3xl">
        <h1
          className="font-display text-4xl font-semibold tracking-[-0.065em] text-ink sm:text-5xl"
          id="generation-title"
        >
          GENERANDO EVIDENCIA
        </h1>
        <p className="mt-3 max-w-xl font-ui text-sm leading-6 text-ink/75">
          Authory está preparando una referencia verificable de la obra.
        </p>

        <Panel className="mt-8" padding="md">
          <ProgressStepper currentStep={currentStep} />
          <p aria-live="polite" className="mt-5 font-ui text-[11px] font-semibold tracking-[0.08em] text-ink/70">
            PROCESO EN CURSO · PASO {currentStep} DE 4
          </p>
        </Panel>
      </section>
    );
  }

  if (flowState === "error" && work) {
    return (
      <section aria-labelledby="generation-error-title" className="mx-auto max-w-3xl">
        <h1
          className="font-display text-4xl font-semibold tracking-[-0.065em] text-ink sm:text-5xl"
          id="generation-error-title"
        >
          EVIDENCIA PENDIENTE
        </h1>
        <Panel className="mt-6" padding="md">
          <p className="font-ui text-sm leading-6 text-ink/75" role="alert">
            {generationError}
          </p>
          <p className="mt-3 font-ui text-[11px] leading-5 text-ink/65">
            Los datos de la obra se conservaron para que puedas reintentar la operación.
          </p>
          <BrutalistButton
            className="mt-6"
            onClick={() => startGeneration(work)}
            type="button"
          >
            REINTENTAR →
          </BrutalistButton>
        </Panel>
      </section>
    );
  }

  if (flowState === "created" && work?.hash && work.stellarTransactionId && work.registeredAt) {
    return (
      <section
        aria-labelledby="evidence-created-title"
        className="mx-auto flex w-full max-w-3xl flex-1 flex-col lg:justify-center lg:pb-16"
      >
        <h1
          className="font-display text-4xl font-semibold tracking-[-0.065em] text-ink sm:text-5xl"
          id="evidence-created-title"
        >
          EVIDENCIA CREADA
        </h1>

        <Panel className="mt-7" padding="none">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-border bg-neutral px-4 py-3">
            <p className="font-ui text-[11px] font-bold tracking-[0.1em] text-ink">RESUMEN DE REGISTRO</p>
            <StatusBadge variant="success">REGISTRADA</StatusBadge>
          </div>
          <dl className="grid sm:grid-cols-3">
            <div className="border-b-2 border-border p-4 sm:border-r-2 sm:border-b-0">
              <dt className="font-ui text-[10px] font-bold tracking-[0.1em] text-ink/60">AUTHORY ID</dt>
              <dd className="mt-2 break-all font-ui text-xs text-ink">{work.id}</dd>
            </div>
            <div className="border-b-2 border-border p-4 sm:border-r-2 sm:border-b-0">
              <dt className="font-ui text-[10px] font-bold tracking-[0.1em] text-ink/60">HASH SIMULADO</dt>
              <dd className="mt-2 font-ui text-xs text-ink">{shortenHash(work.hash)}</dd>
            </div>
            <div className="p-4">
              <dt className="font-ui text-[10px] font-bold tracking-[0.1em] text-ink/60">RED</dt>
              <dd className="mt-2 font-ui text-xs text-ink">STELLAR TESTNET</dd>
            </div>
          </dl>
        </Panel>

        <BrutalistButton className="mt-6" href={`/obra/${work.id}`}>
          CONTINUAR AL DETALLE →
        </BrutalistButton>
      </section>
    );
  }

  return (
    <section
      aria-labelledby="register-work-title"
      className="mx-auto w-full max-w-7xl lg:flex lg:flex-1 lg:flex-col"
    >
      <h1
        className="font-display text-4xl font-semibold tracking-[-0.065em] text-ink sm:text-5xl"
        id="register-work-title"
      >
        REGISTRAR OBRA
      </h1>
      <p className="mt-1 max-w-2xl font-ui text-sm leading-6 text-ink/75 lg:max-w-none lg:whitespace-nowrap">
        Crea evidencia verificable de autoría sin publicar el archivo original en Stellar.
      </p>

      <form className="mt-4" noValidate onSubmit={handleSubmit(handleRegister)}>
        <Panel className="lg:p-3" padding="sm">
          <div className="grid gap-x-5 gap-y-3 lg:grid-cols-2 lg:[&>label]:gap-1.5">
            <Input
              error={errors.title?.message}
              label="TÍTULO *"
              {...register("title")}
            />
            <label className="flex w-full flex-col gap-2 font-ui lg:gap-1.5">
              <span className="text-[11px] font-bold tracking-[0.08em] text-ink">TIPO DE OBRA *</span>
              <select
                aria-invalid={Boolean(errors.type)}
                className="min-h-11 w-full border-2 border-border bg-white px-3 text-sm text-ink focus:border-cyan focus:outline-none"
                defaultValue=""
                {...register("type")}
              >
                <option disabled value="">
                  Selecciona un tipo
                </option>
                {workTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.type ? (
                <span className="text-[11px] font-semibold text-ink">{errors.type.message}</span>
              ) : null}
            </label>

            <Textarea
              className="lg:[&>textarea]:min-h-24"
              error={errors.description?.message}
              label="DESCRIPCIÓN *"
              {...register("description")}
            />

            <Textarea className="lg:[&>textarea]:min-h-24" label="NOTAS" {...register("notes")} />

            <fieldset className="border-2 border-border p-2 lg:col-span-2">
              <legend className="px-1 font-ui text-[11px] font-bold tracking-[0.08em] text-ink">
                ARCHIVO O ENLACE *
              </legend>
              <p className="font-ui text-[10px] leading-4 text-ink/65">
                Selecciona un archivo o indica un enlace a la obra.
              </p>
              <div className="mt-2 grid gap-x-5 gap-y-2 sm:grid-cols-2 sm:[&>label]:gap-1.5">
                <label className="flex flex-col gap-2 font-ui">
                  <span className="text-[11px] font-bold tracking-[0.08em] text-ink">ARCHIVO</span>
                  <input
                    className="w-full border-2 border-border bg-white px-3 py-2 text-xs text-ink file:mr-3 file:border-0 file:bg-cyan file:px-3 file:py-1.5 file:font-ui file:text-[10px] file:font-bold file:tracking-[0.08em] file:text-ink"
                    onChange={handleFileChange}
                    type="file"
                  />
                  {fileMetadata ? (
                    <span className="font-ui text-[11px] leading-5 text-ink/65">
                      {fileMetadata.filename} · {fileMetadata.fileSize}
                    </span>
                  ) : null}
                  {realHash ? (
                    <div className="mt-1 flex flex-col gap-0.5 border-l-2 border-cyan pl-2 font-mono text-[10px] text-ink/80">
                      <span className="font-bold tracking-wider text-cyan-900">HUELLA CRIPTOGRÁFICA (SHA-256):</span>
                      <span className="break-all">{realHash}</span>
                    </div>
                  ) : null}
                </label>
                <Input
                  error={errors.sourceUrl?.message}
                  label="ENLACE DE LA OBRA"
                  placeholder="https://..."
                  type="url"
                  {...register("sourceUrl")}
                />
              </div>
            </fieldset>

            <Input
              error={errors.author?.message}
              label="AUTOR *"
              {...register("author")}
            />
            <Input label="FECHA DE CREACIÓN" type="date" {...register("createdAt")} />
          </div>
        </Panel>

        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <PrivacyNotice className="p-2.5 sm:flex-1" />
          <BrutalistButton className="sm:shrink-0" type="submit">
            CREAR EVIDENCIA →
          </BrutalistButton>
        </div>
      </form>
    </section>
  );
}
