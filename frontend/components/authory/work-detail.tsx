"use client";

import { useEffect, useState } from "react";
import { Download, Copy, Check } from "lucide-react";

import { StellarEvidence } from "@/components/authory/stellar-evidence";
import { BrutalistButton } from "@/components/ui/brutalist-button";
import { Panel } from "@/components/ui/panel";
import { StatusBadge, type StatusBadgeVariant } from "@/components/ui/status-badge";
import { downloadDemoCertificate } from "@/lib/demo-certificate";
import { getWork } from "@/lib/storage";
import type { StellarEvidence as StellarEvidenceRecord } from "@/types/stellar";
import type { Work, WorkStatus, WorkType } from "@/types/work";

export interface WorkDetailProps {
  workId: string;
}

interface MetadataItem {
  label: string;
  value: string;
}

const workTypeLabels: Record<WorkType, string> = {
  textile: "Textil / Telar Tradicional",
  pottery: "Cerámica / Alfarería",
  woodwork: "Talla en Madera / Alebrijes",
  metalwork: "Orfebrería / Joyería / Filigrana",
  painting: "Pintura Tradicional / Arte Popular",
  sculpture: "Escultura / Cantería",
  music_dance: "Música / Danza Tradicional",
  traditional_cuisine: "Gastronomía / Recetario Ancestral",
  craft_other: "Oficio Artesanal",
  photography: "Fotografía",
  illustration: "Ilustración",
  document: "Documento",
  music: "Música",
  code: "Código",
  video: "Video",
  other: "Otro",
};

const authorRoleLabels: Record<string, string> = {
  artisan: "Artesano / Artista directo",
  collective: "Taller familiar / Cooperativa comunitaria",
  cultural_promoter: "Promotor cultural",
};

const commercialStatusLabels: Record<string, string> = {
  available: "Disponible para venta directa",
  on_order: "Elaboración sobre encargo",
  private: "Patrimonial / Colección",
  sold: "Pieza vendida (en custodia)",
};

const statusLabels: Record<WorkStatus, string> = {
  draft: "BORRADOR",
  processing: "EN PROCESO",
  registered: "REGISTRADA EN STELLAR",
  verified: "VERIFICADA",
};

const statusVariants: Record<WorkStatus, StatusBadgeVariant> = {
  draft: "neutral",
  processing: "active",
  registered: "success",
  verified: "success",
};

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("es-MX", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  }).format(date);
}

function getEvidence(work: Work): StellarEvidenceRecord | undefined {
  if (!work.hash || !work.stellarTransactionId || !work.registeredAt) {
    return undefined;
  }

  return {
    workId: work.id,
    hash: work.hash,
    transactionId: work.stellarTransactionId,
    network: work.network,
    registeredAt: work.registeredAt,
    status: "confirmed",
  };
}

function getMetadataItems(work: Work): MetadataItem[] {
  return [
    { label: "TOLTEK ID", value: work.id },
    { label: "AUTOR / CREADOR", value: work.author },
    ...(work.authorRole ? [{ label: "ROL", value: authorRoleLabels[work.authorRole] || work.authorRole }] : []),
    { label: "RAMA / OFICIO", value: workTypeLabels[work.type] || work.type },
    ...(work.technique ? [{ label: "TÉCNICA ANCESTRAL", value: work.technique }] : []),
    ...(work.originCommunity ? [{ label: "COMUNIDAD DE ORIGEN", value: work.originCommunity }] : []),
    ...(work.materials ? [{ label: "MATERIALES E INSUMOS", value: work.materials }] : []),
    ...(work.masterTeacher ? [{ label: "LINAJE / MAESTRO", value: work.masterTeacher }] : []),
    ...(work.commercialStatus
      ? [{ label: "ESTADO COMERCIAL", value: commercialStatusLabels[work.commercialStatus] || work.commercialStatus }]
      : []),
    ...(work.price ? [{ label: "PRECIO SUGERIDO", value: work.price }] : []),
    ...(work.artisanContact ? [{ label: "CONTACTO DE VENTA", value: work.artisanContact }] : []),
    ...(work.artisanWallet ? [{ label: "BILLETERA STELLAR", value: work.artisanWallet }] : []),
    ...(work.createdAt ? [{ label: "FECHA DE CREACIÓN", value: formatDate(work.createdAt) }] : []),
    ...(work.registeredAt
      ? [{ label: "FECHA DE REGISTRO", value: formatDate(work.registeredAt) }]
      : []),
    ...(work.filename ? [{ label: "ARCHIVO", value: work.filename }] : []),
    ...(work.fileSize ? [{ label: "TAMAÑO", value: work.fileSize }] : []),
    ...(work.fileMimeType ? [{ label: "TIPO MIME", value: work.fileMimeType }] : []),
    { label: "DESCRIPCIÓN", value: work.description },
    ...(work.notes ? [{ label: "NOTAS", value: work.notes }] : []),
  ];
}

function MetadataGrid({ work }: { work: Work }) {
  const items = getMetadataItems(work);

  return (
    <dl className="grid border-l-2 border-t-2 border-border sm:grid-cols-2">
      {items.map((item) => (
        <div
          className="border-b-2 border-r-2 border-border p-2.5"
          key={item.label}
        >
          <dt className="font-ui text-[10px] font-bold tracking-[0.1em] text-ink/60">{item.label}</dt>
          <dd className="mt-1 break-words font-ui text-xs leading-4 text-ink" title={item.value}>
            {item.value}
          </dd>
        </div>
      ))}
      {work.sourceUrl ? (
        <div className="border-b-2 border-r-2 border-border p-2.5 sm:col-span-2">
          <dt className="font-ui text-[10px] font-bold tracking-[0.1em] text-ink/60">ENLACE DE ORIGEN</dt>
          <dd className="mt-1 break-all font-ui text-xs leading-4 text-ink" title={work.sourceUrl}>
            {/^https?:\/\//i.test(work.sourceUrl) ? (
              <a
                className="underline decoration-2 underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan"
                href={work.sourceUrl}
                rel="noreferrer"
                target="_blank"
              >
                {work.sourceUrl}
              </a>
            ) : (
              <span className="text-ink/80">{work.sourceUrl}</span>
            )}
          </dd>
        </div>
      ) : null}
      {work.fileUrl ? (
        <div className="border-b-2 border-r-2 border-border bg-cyan/5 p-2.5 sm:col-span-2">
          <dt className="font-ui text-[10px] font-bold tracking-[0.1em] text-cyan-900">
            ARCHIVO PERSISTIDO EN SUPABASE STORAGE
          </dt>
          <dd className="mt-1.5 flex flex-col gap-2">
            <a
              className="inline-flex w-fit items-center gap-1.5 font-ui text-xs font-bold text-ink underline decoration-cyan decoration-2 hover:text-cyan-900"
              href={work.fileUrl}
              rel="noreferrer"
              target="_blank"
            >
              Ver / Descargar {work.filename?.toLowerCase().endsWith(".pdf") ? "Documento PDF" : "Archivo Original"} ↗
            </a>
            {work.fileMimeType?.startsWith("image/") ? (
              <div className="mt-1 w-fit max-w-sm border-2 border-border bg-white p-1 shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt={work.title}
                  className="max-h-56 w-auto object-contain"
                  src={work.fileUrl}
                />
              </div>
            ) : null}
          </dd>
        </div>
      ) : null}
    </dl>
  );
}

export function WorkDetail({ workId }: WorkDetailProps) {
  const [work, setWork] = useState<Work | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadWork() {
      const persistedWork = getWork();
      if (persistedWork.id === workId) {
        if (isMounted) {
          setWork(persistedWork);
          setIsLoading(false);
        }
        return;
      }

      // Try fetching from Supabase / server API if not found in local storage
      try {
        const res = await fetch(`/api/works?id=${encodeURIComponent(workId)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.work && isMounted) {
            setWork(data.work);
            setIsLoading(false);
            return;
          }
        }
      } catch {
        // Fallback
      }

      if (isMounted) {
        setWork(null);
        setIsLoading(false);
      }
    }

    void loadWork();

    return () => {
      isMounted = false;
    };
  }, [workId]);

  if (isLoading) {
    return (
      <section aria-live="polite" className="mx-auto max-w-3xl">
        <Panel padding="sm">
          <p className="font-ui text-xs font-bold tracking-[0.1em] text-ink">CARGANDO REGISTRO...</p>
        </Panel>
      </section>
    );
  }

  if (!work) {
    return (
      <section aria-labelledby="work-not-found-title" className="mx-auto max-w-3xl">
        <Panel padding="md">
          <h1
            className="font-display text-3xl font-semibold tracking-[-0.055em] text-ink sm:text-4xl"
            id="work-not-found-title"
          >
            OBRA NO ENCONTRADA
          </h1>
          <p className="mt-3 max-w-xl font-ui text-sm leading-6 text-ink/75">
            No encontramos un registro local que coincida con este Authory ID.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <BrutalistButton href="/" variant="secondary">
              VOLVER AL INICIO
            </BrutalistButton>
            <BrutalistButton href="/registrar-obra">REGISTRAR OTRA OBRA</BrutalistButton>
          </div>
        </Panel>
      </section>
    );
  }

  const evidence = getEvidence(work);

  const verificationUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/verificar?workId=${encodeURIComponent(work.id)}`
      : `/verificar?workId=${encodeURIComponent(work.id)}`;

  const handleCopyLink = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(verificationUrl);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2500);
      } else {
        setShowFallback(true);
      }
    } catch {
      setShowFallback(true);
    }
  };

  return (
    <section aria-labelledby="work-title" className="mx-auto -mt-4 w-full max-w-7xl sm:-mt-6">
      <div className="flex flex-wrap items-start justify-between gap-3 border-l-2 border-border pl-4 sm:pl-6">
        <div>
          <p className="font-ui text-[10px] font-bold tracking-[0.1em] text-ink/65">REGISTRO DE OBRA</p>
          <h1
            className="mt-1 font-display text-3xl font-semibold leading-[0.95] tracking-[-0.065em] text-ink sm:text-4xl"
            id="work-title"
          >
            {work.title}
          </h1>
          <p className="mt-2 max-w-3xl font-ui text-sm leading-5 text-ink/75">{work.description}</p>
        </div>
        <StatusBadge variant={statusVariants[work.status]}>{statusLabels[work.status]}</StatusBadge>
      </div>

      {/* Ficha Destacada de Saberes y Comercialización */}
      {(work.technique || work.originCommunity || work.price || work.commercialStatus) && (
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {/* Tarjeta de Saberes y Patrimonio */}
          <div className="border-2 border-border bg-yellow/10 p-4">
            <div className="flex items-center gap-2">
              <span className="border border-border bg-yellow px-2 py-0.5 font-ui text-[10px] font-bold tracking-[0.1em] text-ink uppercase">
                Saberes Salvaguardados
              </span>
              <span className="font-ui text-xs font-bold text-ink">PATRIMONIO VIVO</span>
            </div>
            <dl className="mt-3 space-y-2 text-xs font-ui">
              {work.technique ? (
                <div>
                  <dt className="text-[10px] font-bold text-ink/60 uppercase">Técnica Ancestral:</dt>
                  <dd className="font-semibold text-ink">{work.technique}</dd>
                </div>
              ) : null}
              {work.originCommunity ? (
                <div>
                  <dt className="text-[10px] font-bold text-ink/60 uppercase">Comunidad / Origen:</dt>
                  <dd className="font-semibold text-ink">{work.originCommunity}</dd>
                </div>
              ) : null}
              {work.materials ? (
                <div>
                  <dt className="text-[10px] font-bold text-ink/60 uppercase">Materiales e Insumos:</dt>
                  <dd className="text-ink">{work.materials}</dd>
                </div>
              ) : null}
              {work.masterTeacher ? (
                <div>
                  <dt className="text-[10px] font-bold text-ink/60 uppercase">Linaje Formativo:</dt>
                  <dd className="text-ink/80">{work.masterTeacher}</dd>
                </div>
              ) : null}
            </dl>
          </div>

          {/* Tarjeta de Comercio Justo */}
          <div className="border-2 border-border bg-cyan/10 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="border border-border bg-cyan px-2 py-0.5 font-ui text-[10px] font-bold tracking-[0.1em] text-ink uppercase">
                  Comercio Justo
                </span>
                <span className="font-ui text-xs font-bold text-ink">VENTA DIRECTA</span>
              </div>
              {work.commercialStatus ? (
                <span className="border border-border bg-white px-2 py-0.5 font-ui text-[10px] font-bold text-ink">
                  {commercialStatusLabels[work.commercialStatus] || work.commercialStatus}
                </span>
              ) : null}
            </div>

            <div className="mt-3">
              {work.price ? (
                <div className="flex items-baseline gap-2">
                  <span className="text-[10px] font-bold text-ink/60 uppercase font-ui">Precio sugerido:</span>
                  <span className="font-display text-2xl font-bold text-ink">{work.price}</span>
                </div>
              ) : (
                <p className="font-ui text-xs text-ink/70">Precio a consultar directamente con el artesano.</p>
              )}

              {work.artisanContact ? (
                <div className="mt-2 text-xs font-ui">
                  <span className="text-[10px] font-bold text-ink/60 uppercase block">Contacto directo:</span>
                  <span className="font-semibold text-ink">{work.artisanContact}</span>
                </div>
              ) : null}

              {work.artisanWallet ? (
                <div className="mt-2 text-xs font-ui">
                  <span className="text-[10px] font-bold text-cyan-950 uppercase block">Billetera Stellar (Pagos sin intermediarios):</span>
                  <span className="break-all font-mono text-[11px] text-ink">{work.artisanWallet}</span>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}

      <div className="mt-5 grid items-start gap-4 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <Panel aria-labelledby="work-data-title" padding="none">
          <h2
            className="border-b-2 border-border bg-neutral px-3 py-2 font-ui text-[10px] font-bold tracking-[0.1em] text-ink"
            id="work-data-title"
          >
            FICHA TÉCNICA Y DE AUTORÍA
          </h2>
          <MetadataGrid work={work} />
        </Panel>

        {evidence ? (
          <StellarEvidence evidence={evidence} />
        ) : (
          <Panel aria-labelledby="evidence-pending-title" padding="md">
            <h2
              className="font-ui text-[10px] font-bold tracking-[0.1em] text-ink"
              id="evidence-pending-title"
            >
              EVIDENCIA STELLAR
            </h2>
            <p className="mt-3 font-ui text-sm leading-6 text-ink/75">
              La evidencia verificable aún no está disponible para este registro.
            </p>
          </Panel>
        )}
      </div>

      <section aria-labelledby="work-actions-title" className="mt-6 border-t-2 border-border pt-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2
            className="font-ui text-[10px] font-bold tracking-[0.1em] text-ink/65"
            id="work-actions-title"
          >
            ACCIONES DE LA PIEZA
          </h2>
          <p className="font-ui text-[10px] text-ink/60">
            TolteK: pasaporte físico-digital para el artesano, coleccionista y promotor cultural.
          </p>
        </div>

        <div className="mt-3 flex flex-wrap gap-2.5">
          <BrutalistButton href={`/verificar?workId=${encodeURIComponent(work.id)}`} size="sm">
            VERIFICAR AUTENTICIDAD →
          </BrutalistButton>
          <BrutalistButton href={`/obra/${work.id}/derechos`} size="sm" variant="secondary">
            REGISTRAR LICENCIA / CESIÓN →
          </BrutalistButton>
          <BrutalistButton href={`/obra/${work.id}/historial`} size="sm" variant="yellow">
            HISTORIAL DE DERECHOS →
          </BrutalistButton>
          <BrutalistButton
            onClick={() => downloadDemoCertificate(work, verificationUrl)}
            size="sm"
            type="button"
          >
            <Download className="mr-1.5 size-3.5" />
            DESCARGAR PASAPORTE CULTURAL (DEMO)
          </BrutalistButton>
          <BrutalistButton
            onClick={handleCopyLink}
            size="sm"
            type="button"
            variant={copied ? "yellow" : "secondary"}
          >
            {copied ? (
              <>
                <Check className="mr-1.5 size-3.5" />
                ¡ENLACE COPIADO!
              </>
            ) : (
              <>
                <Copy className="mr-1.5 size-3.5" />
                COPIAR ENLACE DE VERIFICACIÓN
              </>
            )}
          </BrutalistButton>
        </div>

        {showFallback ? (
          <div className="mt-4 border-2 border-border bg-neutral/20 p-3">
            <label
              className="block font-ui text-[10px] font-bold tracking-[0.1em] text-ink"
              htmlFor="manual-verification-url"
            >
              ENLACE DIRECTO DE VERIFICACIÓN (SELECCIONAR Y COPIAR):
            </label>
            <div className="mt-1.5 flex flex-wrap gap-2">
              <input
                className="min-w-0 flex-1 border-2 border-border bg-paper px-2.5 py-1.5 font-mono text-xs text-ink focus:outline-none focus:ring-1 focus:ring-ink"
                id="manual-verification-url"
                onFocus={(e) => e.target.select()}
                readOnly
                type="text"
                value={verificationUrl}
              />
              <BrutalistButton
                onClick={() => setShowFallback(false)}
                size="sm"
                type="button"
                variant="secondary"
              >
                CERRAR
              </BrutalistButton>
            </div>
          </div>
        ) : null}
      </section>
    </section>
  );
}
