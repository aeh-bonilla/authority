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
  "textile",
  "pottery",
  "woodwork",
  "metalwork",
  "painting",
  "sculpture",
  "music_dance",
  "traditional_cuisine",
  "craft_other",
  "photography",
  "illustration",
  "document",
  "music",
  "code",
  "video",
  "other",
] as const satisfies readonly WorkType[];

const workTypeOptions: ReadonlyArray<{ value: WorkType; label: string }> = [
  { value: "textile", label: "Textil / Telar Tradicional" },
  { value: "pottery", label: "Cerámica / Alfarería" },
  { value: "woodwork", label: "Talla en Madera / Alebrijes" },
  { value: "metalwork", label: "Orfebrería / Joyería / Filigrana" },
  { value: "painting", label: "Pintura Tradicional / Arte Popular" },
  { value: "sculpture", label: "Escultura / Cantería" },
  { value: "music_dance", label: "Música / Danza Tradicional" },
  { value: "traditional_cuisine", label: "Gastronomía / Recetario Ancestral" },
  { value: "craft_other", label: "Otro Oficio Artesanal" },
  { value: "photography", label: "Fotografía y Registro Visual" },
  { value: "illustration", label: "Ilustración / Gráfica" },
  { value: "document", label: "Documento / Saberes Escritos" },
  { value: "music", label: "Composición Musical" },
  { value: "code", label: "Código / Software Cultural" },
  { value: "video", label: "Video Documental" },
  { value: "other", label: "Otro Tipo" },
];

const authorRoleOptions = [
  { value: "artisan", label: "Artesano / Artista directo" },
  { value: "collective", label: "Taller familiar o Cooperativa comunitaria" },
  { value: "cultural_promoter", label: "Promotor cultural (en nombre del artesano)" },
] as const;

const commercialStatusOptions = [
  { value: "available", label: "Disponible para venta directa" },
  { value: "on_order", label: "Elaboración sobre encargo / pedido" },
  { value: "private", label: "Patrimonial / Colección (fuera de venta)" },
  { value: "sold", label: "Pieza vendida (certificado de autenticidad)" },
] as const;

const registerWorkSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, "El título o nombre de la pieza es obligatorio."),
    type: z.enum(workTypes, {
      error: "El tipo de obra u oficio es obligatorio. Selecciona una opción.",
    }),
    description: z
      .string()
      .trim()
      .min(1, "La descripción de la pieza y su proceso es obligatoria."),
    // Campos culturales de oficio
    authorRole: z.enum(["artisan", "collective", "cultural_promoter"]),
    technique: z.string().trim().optional(),
    originCommunity: z.string().trim().optional(),
    materials: z.string().trim().optional(),
    masterTeacher: z.string().trim().optional(),
    // Campos de comercialización
    commercialStatus: z.enum(["available", "on_order", "private", "sold"]),
    price: z.string().trim().optional(),
    artisanContact: z.string().trim().optional(),
    artisanWallet: z.string().trim().optional(),
    // Campos de archivo y enlace
    sourceUrl: z
      .string()
      .trim()
      .refine(
        (val) => !val || /^https?:\/\//i.test(val),
        "El enlace debe comenzar con http:// o https://",
      ),
    author: z
      .string()
      .trim()
      .min(1, "El nombre del artesano, artista o taller es obligatorio."),
    createdAt: z
      .string()
      .trim()
      .min(1, "La fecha de creación o término es obligatoria.")
      .refine(
        (val) => !Number.isNaN(Date.parse(val)),
        "Ingresa una fecha válida.",
      ),
    notes: z.string().trim(),
    hasFile: z.boolean(),
  })
  .superRefine(({ hasFile, sourceUrl }, context) => {
    const trimmedSource = sourceUrl ? sourceUrl.trim() : "";
    if (!hasFile && !trimmedSource) {
      context.addIssue({
        code: "custom",
        message: "Debes adjuntar al menos una fotografía o ingresar un enlace de la pieza.",
        path: ["sourceUrl"],
      });
      context.addIssue({
        code: "custom",
        message: "Debes adjuntar al menos una fotografía o ingresar un enlace de la pieza.",
        path: ["hasFile"],
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
  const [selectedFileObj, setSelectedFileObj] = useState<File | null>(null);
  const [realHash, setRealHash] = useState<string>();
  const [work, setWork] = useState<Work>();
  const [currentStep, setCurrentStep] = useState(1);
  const [generationRun, setGenerationRun] = useState(0);
  const [generationError, setGenerationError] = useState<string>();

  const {
    formState: { errors, isSubmitted },
    handleSubmit,
    register,
    setValue,
  } = useForm<RegisterWorkValues>({
    resolver: zodResolver(registerWorkSchema),
    mode: "onTouched",
    defaultValues: {
      title: "",
      type: undefined,
      description: "",
      authorRole: "artisan",
      technique: "",
      originCommunity: "",
      materials: "",
      masterTeacher: "",
      commercialStatus: "available",
      price: "",
      artisanContact: "",
      artisanWallet: "",
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
              `${generationWork.id}:${generationWork.title}:${generationWork.author}:${generationWork.technique ?? ""}`,
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

        // If a file was selected and it's an image or PDF, upload to Supabase Storage
        let uploadedFileUrl: string | undefined;
        if (selectedFileObj) {
          const mime = selectedFileObj.type || "";
          const isImg = mime.startsWith("image/");
          const isPdfDoc = mime === "application/pdf" || selectedFileObj.name.toLowerCase().endsWith(".pdf");
          if (isImg || isPdfDoc) {
            try {
              const formData = new FormData();
              formData.append("file", selectedFileObj);
              formData.append("workId", generationWork.id);
              const uploadRes = await fetch("/api/storage/upload", {
                method: "POST",
                body: formData,
              });
              if (uploadRes.ok) {
                const uploadData = await uploadRes.json();
                if (uploadData.success && uploadData.fileUrl) {
                  uploadedFileUrl = uploadData.fileUrl;
                }
              }
            } catch (uploadErr) {
              console.warn("Supabase Storage upload fallback:", uploadErr);
            }
          }
        }

        if (uploadedFileUrl) {
          updatedWork = {
            ...updatedWork,
            fileUrl: uploadedFileUrl,
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

        // Asynchronously sync to Supabase backend database if available
        void fetch("/api/works", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ work: updatedWork }),
        }).catch(() => {});

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
  }, [flowState, generationRun, work, selectedFileObj]);

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
      setSelectedFileObj(null);
      setRealHash(undefined);
      setValue("hasFile", false, { shouldValidate: true });
      return;
    }

    setSelectedFileObj(selectedFile);
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
      authorRole: values.authorRole,
      ...(values.technique?.trim() ? { technique: values.technique.trim() } : {}),
      ...(values.originCommunity?.trim() ? { originCommunity: values.originCommunity.trim() } : {}),
      ...(values.materials?.trim() ? { materials: values.materials.trim() } : {}),
      ...(values.masterTeacher?.trim() ? { masterTeacher: values.masterTeacher.trim() } : {}),
      commercialStatus: values.commercialStatus,
      ...(values.price?.trim() ? { price: values.price.trim() } : {}),
      ...(values.artisanContact?.trim() ? { artisanContact: values.artisanContact.trim() } : {}),
      ...(values.artisanWallet?.trim() ? { artisanWallet: values.artisanWallet.trim() } : {}),
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
          SELLANDO PASAPORTE CULTURAL
        </h1>
        <p className="mt-3 max-w-xl font-ui text-sm leading-6 text-ink/75">
          TlamatiK está generando la huella criptográfica de la técnica y registrando la evidencia inmutable en Stellar.
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
            Los datos del registro se conservaron para que puedas reintentar la operación.
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
        <span className="font-ui text-xs font-bold tracking-[0.12em] text-cyan-900 uppercase">
          TlamatiK · Pasaporte Cultural Creado
        </span>
        <h1
          className="mt-1 font-display text-4xl font-semibold tracking-[-0.065em] text-ink sm:text-5xl"
          id="evidence-created-title"
        >
          PASAPORTE CULTURAL SELLADO
        </h1>
        <p className="mt-2 font-ui text-sm text-ink/75">
          El conocimiento del oficio, origen comunitario y datos de comercialización han quedado anclados de forma inmutable a la red Stellar.
        </p>

        <Panel className="mt-7" padding="none">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-border bg-neutral px-4 py-3">
            <p className="font-ui text-[11px] font-bold tracking-[0.1em] text-ink">RESUMEN DE REGISTRO PATRIMONIAL</p>
            <StatusBadge variant="success">REGISTRADA EN STELLAR</StatusBadge>
          </div>
          <dl className="grid sm:grid-cols-3">
            <div className="border-b-2 border-border p-4 sm:border-r-2 sm:border-b-0">
              <dt className="font-ui text-[10px] font-bold tracking-[0.1em] text-ink/60">TLAMATIK ID</dt>
              <dd className="mt-2 break-all font-mono text-xs font-bold text-ink">{work.id}</dd>
            </div>
            <div className="border-b-2 border-border p-4 sm:border-r-2 sm:border-b-0">
              <dt className="font-ui text-[10px] font-bold tracking-[0.1em] text-ink/60">HUELLA CRIPTOGRÁFICA</dt>
              <dd className="mt-2 font-mono text-xs text-ink">{shortenHash(work.hash)}</dd>
            </div>
            <div className="p-4">
              <dt className="font-ui text-[10px] font-bold tracking-[0.1em] text-ink/60">RED BLOCKCHAIN</dt>
              <dd className="mt-2 font-ui text-xs text-ink font-bold">STELLAR TESTNET</dd>
            </div>
          </dl>
          {work.technique || work.originCommunity ? (
            <div className="border-t-2 border-border bg-yellow/10 p-4">
              <p className="font-ui text-[11px] font-bold tracking-[0.08em] text-ink">
                SABERES ANCESTRALES SALVAGUARDADOS:
              </p>
              <p className="mt-1 font-ui text-xs text-ink/80">
                {work.technique ? `Técnica: ${work.technique}` : ""}
                {work.technique && work.originCommunity ? " · " : ""}
                {work.originCommunity ? `Origen: ${work.originCommunity}` : ""}
              </p>
            </div>
          ) : null}
        </Panel>

        <BrutalistButton className="mt-6" href={`/obra/${work.id}`}>
          VER PASAPORTE CULTURAL Y QR →
        </BrutalistButton>
      </section>
    );
  }

  return (
    <section
      aria-labelledby="register-work-title"
      className="mx-auto w-full max-w-7xl lg:flex lg:flex-1 lg:flex-col"
    >
      <div className="border-l-2 border-border pl-4 sm:pl-6">
        <span className="font-ui text-xs font-bold tracking-[0.12em] text-cyan-900 uppercase">
          TlamatiK · Salvaguarda de Oficios & Comercio Justo
        </span>
        <h1
          className="mt-1 font-display text-4xl font-semibold tracking-[-0.065em] text-ink sm:text-5xl"
          id="register-work-title"
        >
          REGISTRAR OFICIO / PIEZA ARTESANAL
        </h1>
        <p className="mt-1.5 max-w-3xl font-ui text-sm leading-6 text-ink/75">
          Documenta la técnica ancestral, comunidad de origen y fija las condiciones de comercialización directa
          respaldadas por la red Stellar.
        </p>
      </div>

      <form className="mt-6 space-y-6" noValidate onSubmit={handleSubmit(handleRegister)}>
        {/* SECCIÓN 1: IDENTIFICACIÓN GENERAL */}
        <Panel className="p-4" padding="sm">
          <div className="border-b-2 border-border pb-2 mb-4">
            <h2 className="font-display text-lg font-bold tracking-[-0.04em] text-ink">
              1. IDENTIFICACIÓN DE LA PIEZA U OBRA
            </h2>
            <p className="font-ui text-xs text-ink/70">
              Nombre de la creación y rama artesanal o artística a la que pertenece.
            </p>
          </div>

          <div className="grid gap-x-5 gap-y-4 lg:grid-cols-2">
            <Input
              error={errors.title?.message}
              label="TÍTULO O NOMBRE DE LA PIEZA *"
              placeholder="ej. Rebozo de Seda con Patrón Granada"
              {...register("title")}
            />

            <label className="flex w-full flex-col gap-2 font-ui lg:gap-1.5">
              <span className="text-[11px] font-bold tracking-[0.08em] text-ink">RAMA ARTESANAL / OFICIO *</span>
              <select
                aria-invalid={Boolean(errors.type)}
                className={`min-h-11 w-full border-2 ${
                  errors.type
                    ? "border-red-600 bg-red-50/20 focus:border-red-600"
                    : "border-border bg-white focus:border-cyan"
                } px-3 text-sm text-ink focus:outline-none`}
                defaultValue=""
                {...register("type")}
              >
                <option disabled value="">
                  Selecciona la disciplina u oficio
                </option>
                {workTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.type ? (
                <span className="text-[11px] font-bold text-red-600" role="alert">
                  {errors.type.message}
                </span>
              ) : null}
            </label>

            <div className="lg:col-span-2">
              <Textarea
                className="lg:[&>textarea]:min-h-20"
                error={errors.description?.message}
                label="DESCRIPCIÓN Y SIGNIFICADO CULTURAL *"
                placeholder="Describe la pieza, su simbolismo tradicional, tiempo dedicado en su confección e historia..."
                {...register("description")}
              />
            </div>
          </div>
        </Panel>

        {/* SECCIÓN 2: CÁPSULA DE SABERES Y TÉCNICA ANCESTRAL */}
        <Panel className="p-4 bg-yellow/5 border-2 border-border" padding="sm">
          <div className="border-b-2 border-border pb-2 mb-4">
            <div className="flex items-center gap-2">
              <span className="bg-yellow px-2 py-0.5 font-ui text-[10px] font-bold tracking-[0.1em] text-ink border border-border">
                PRESERVACIÓN PATRIMONIAL
              </span>
              <h2 className="font-display text-lg font-bold tracking-[-0.04em] text-ink">
                2. CÁPSULA DE SABERES DEL OFICIO
              </h2>
            </div>
            <p className="mt-1 font-ui text-xs text-ink/75">
              Protege el conocimiento tradicional contra la apropiación cultural y certifica su autenticidad.
            </p>
          </div>

          <div className="grid gap-x-5 gap-y-4 lg:grid-cols-2">
            <label className="flex w-full flex-col gap-2 font-ui lg:gap-1.5">
              <span className="text-[11px] font-bold tracking-[0.08em] text-ink">ROL DEL REGISTRANTE *</span>
              <select
                className="min-h-11 w-full border-2 border-border bg-white px-3 text-sm text-ink focus:border-cyan focus:outline-none"
                {...register("authorRole")}
              >
                {authorRoleOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <Input
              label="TÉCNICA U OFICIO TRADICIONAL"
              placeholder="ej. Telar de cintura con urdimbre ancestral, Barro negro bruñido..."
              {...register("technique")}
            />

            <Input
              label="COMUNIDAD O TERRITORIO DE ORIGEN"
              placeholder="ej. San Bartolo Coyotepec, Oaxaca, México"
              {...register("originCommunity")}
            />

            <Input
              label="MATERIALES E INSUMOS NATURALES"
              placeholder="ej. Lana virgen, tintes de grana cochinilla, barro negro, madera de copal..."
              {...register("materials")}
            />

            <div className="lg:col-span-2">
              <Input
                label="LINAJE FORMATIVO / MAESTRO DE QUIEN APRENDIÓ (OPCIONAL)"
                placeholder="ej. Taller de la Maestra Gómez (4ª generación familiar) o Aprendido por tradición oral comunitaria"
                {...register("masterTeacher")}
              />
            </div>
          </div>
        </Panel>

        {/* SECCIÓN 3: COMERCIALIZACIÓN JUSTA EN STELLAR */}
        <Panel className="p-4 bg-cyan/5 border-2 border-border" padding="sm">
          <div className="border-b-2 border-border pb-2 mb-4">
            <div className="flex items-center gap-2">
              <span className="bg-cyan px-2 py-0.5 font-ui text-[10px] font-bold tracking-[0.1em] text-ink border border-border">
                COMERCIO JUSTO
              </span>
              <h2 className="font-display text-lg font-bold tracking-[-0.04em] text-ink">
                3. COMERCIALIZACIÓN Y PAGOS DIRECTOS
              </h2>
            </div>
            <p className="mt-1 font-ui text-xs text-ink/75">
              Fija el precio digno y los canales para que compradores o promotores contacten y paguen sin intermediarios abusivos.
            </p>
          </div>

          <div className="grid gap-x-5 gap-y-4 lg:grid-cols-2">
            <label className="flex w-full flex-col gap-2 font-ui lg:gap-1.5">
              <span className="text-[11px] font-bold tracking-[0.08em] text-ink">DISPONIBILIDAD COMERCIAL</span>
              <select
                className="min-h-11 w-full border-2 border-border bg-white px-3 text-sm text-ink focus:border-cyan focus:outline-none"
                {...register("commercialStatus")}
              >
                {commercialStatusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <Input
              label="PRECIO SUGERIDO (EN XLM O MONEDA LOCAL)"
              placeholder="ej. 320 XLM o $4,500 MXN"
              {...register("price")}
            />

            <Input
              label="CONTACTO DIRECTO (WHATSAPP / TEL / CORREO)"
              placeholder="ej. WhatsApp +52 444 812 3456 / contacto@taller.mx"
              {...register("artisanContact")}
            />

            <Input
              label="BILLETERA STELLAR PÚBLICA (OPCIONAL)"
              placeholder="ej. G... (Clave pública para pagos instantáneos en XLM o USDC)"
              {...register("artisanWallet")}
            />
          </div>
        </Panel>

        {/* SECCIÓN 4: ARCHIVO, AUTORÍA Y FECHA */}
        <Panel className="p-4" padding="sm">
          <div className="border-b-2 border-border pb-2 mb-4">
            <h2 className="font-display text-lg font-bold tracking-[-0.04em] text-ink">
              4. EVIDENCIA VISUAL Y AUTORÍA
            </h2>
            <p className="font-ui text-xs text-ink/70">
              Adjunta fotografías o videos del proceso y especifica la persona o colectivo autor.
            </p>
          </div>

          <div className="grid gap-x-5 gap-y-4 lg:grid-cols-2">
            <fieldset
              className={`border-2 ${
                errors.hasFile || errors.sourceUrl
                  ? "border-red-600 bg-red-50/10"
                  : "border-border"
              } p-3 lg:col-span-2`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <legend className="px-1 font-ui text-[11px] font-bold tracking-[0.08em] text-ink">
                  FOTOGRAFÍA, VIDEO O DOCUMENTO DEL PROCESO *
                </legend>
                {(errors.hasFile || errors.sourceUrl) && !fileMetadata && (
                  <span className="font-ui text-[11px] font-bold text-red-600" role="alert">
                    {errors.hasFile?.message || errors.sourceUrl?.message}
                  </span>
                )}
              </div>
              <p className="mt-0.5 font-ui text-[10px] leading-4 text-ink/65">
                Adjunta al menos una foto de la pieza física, video del telar/taller o enlace público.
              </p>
              <div className="mt-2.5 grid gap-x-5 gap-y-2 sm:grid-cols-2">
                <label className="flex flex-col gap-2 font-ui">
                  <span className="text-[11px] font-bold tracking-[0.08em] text-ink">SUBIR ARCHIVO LOCAL</span>
                  <input
                    aria-invalid={Boolean(errors.hasFile && !fileMetadata)}
                    className={`w-full border-2 ${
                      errors.hasFile && !fileMetadata
                        ? "border-red-600 bg-red-50/20"
                        : "border-border bg-white"
                    } px-3 py-2 text-xs text-ink file:mr-3 file:border-0 file:bg-cyan file:px-3 file:py-1.5 file:font-ui file:text-[10px] file:font-bold file:tracking-[0.08em] file:text-ink focus:border-cyan focus:outline-none`}
                    onChange={handleFileChange}
                    type="file"
                  />
                  {fileMetadata ? (
                    <span className="font-ui text-[11px] font-semibold leading-5 text-ink/80">
                      ✓ {fileMetadata.filename} · {fileMetadata.fileSize}
                    </span>
                  ) : null}
                  {realHash ? (
                    <div className="mt-1 flex flex-col gap-0.5 border-l-2 border-cyan pl-2 font-mono text-[10px] text-ink/80">
                      <span className="font-bold tracking-wider text-cyan-900">HUELLA CRIPTOGRÁFICA SHA-256:</span>
                      <span className="break-all">{realHash}</span>
                    </div>
                  ) : null}
                </label>
                <Input
                  error={errors.sourceUrl?.message}
                  label="ENLACE WEB O CATÁLOGO (OPCIONAL)"
                  placeholder="https://..."
                  type="url"
                  {...register("sourceUrl")}
                />
              </div>
            </fieldset>

            <Input
              error={errors.author?.message}
              label="NOMBRE DEL ARTESANO, ARTISTA O COLECTIVO *"
              placeholder="ej. Maestra Juana Bautista"
              {...register("author")}
            />

            <Input
              error={errors.createdAt?.message}
              label="FECHA DE CREACIÓN / TÉRMINO *"
              type="date"
              {...register("createdAt")}
            />

            <div className="lg:col-span-2">
              <Textarea
                className="lg:[&>textarea]:min-h-16"
                label="NOTAS ADICIONALES SOBRE LA PIEZA O ENCARGOS"
                placeholder="Notas de conservación, indicaciones de cuidado o detalles para el comprador..."
                {...register("notes")}
              />
            </div>
          </div>
        </Panel>

        {isSubmitted && Object.keys(errors).length > 0 && (
          <div
            className="border-2 border-red-600 bg-red-50 p-3 font-ui text-xs font-bold text-red-700"
            role="alert"
          >
            ⚠️ Por favor completa los campos obligatorios (*) marcados en rojo antes de sellar la evidencia.
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <PrivacyNotice className="p-2.5 sm:flex-1" />
          <BrutalistButton className="sm:shrink-0" type="submit">
            SELLAR PASAPORTE EN STELLAR →
          </BrutalistButton>
        </div>
      </form>
    </section>
  );
}
