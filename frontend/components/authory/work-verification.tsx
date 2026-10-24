"use client";

import { useRef, useState } from "react";
import { Search, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";

import { StellarEvidence } from "@/components/authory/stellar-evidence";
import { WorkMetadata } from "@/components/authory/work-metadata";
import { BrutalistButton } from "@/components/ui/brutalist-button";
import { Input } from "@/components/ui/input";
import { Panel } from "@/components/ui/panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { getWork } from "@/lib/storage";
import { verifyMockEvidence } from "@/lib/stellar/mock-stellar";
import { computeFileSha256 } from "@/lib/stellar/client-crypto";
import type { VerificationInput, VerificationResult } from "@/types/stellar";
import type { Work } from "@/types/work";

export interface WorkVerificationProps {
  initialWorkId?: string;
  initialHash?: string;
}

type VerificationState = "idle" | "verifying" | "matched" | "not_found" | "error";

interface QueriedCriteria {
  workId?: string;
  hash?: string;
}

export function WorkVerification({
  initialWorkId = "",
  initialHash = "",
}: WorkVerificationProps) {
  const [workIdInput, setWorkIdInput] = useState(initialWorkId.trim());
  const [hashInput, setHashInput] = useState(initialHash.trim());
  const [inputError, setInputError] = useState<string | null>(null);
  const [state, setState] = useState<VerificationState>("idle");
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [matchedWork, setMatchedWork] = useState<Work | null>(null);
  const [activeMessage, setActiveMessage] = useState<string>("");
  const [queriedCriteria, setQueriedCriteria] = useState<QueriedCriteria | null>(null);

  const searchRunRef = useRef(0);

  // Editing any field invalidates pending async queries and clears previous results
  function handleWorkIdChange(value: string) {
    searchRunRef.current += 1;
    setWorkIdInput(value);
    setState("idle");
    setResult(null);
    setMatchedWork(null);
    setInputError(null);
    setActiveMessage("");
  }

  function handleHashChange(value: string) {
    searchRunRef.current += 1;
    setHashInput(value);
    setState("idle");
    setResult(null);
    setMatchedWork(null);
    setInputError(null);
    setActiveMessage("");
  }

  function handleClear() {
    searchRunRef.current += 1;
    setWorkIdInput("");
    setHashInput("");
    setState("idle");
    setResult(null);
    setMatchedWork(null);
    setInputError(null);
    setActiveMessage("");
    setQueriedCriteria(null);
  }

  async function handleVerify(e?: React.FormEvent) {
    if (e) {
      e.preventDefault();
    }

    const trimmedId = workIdInput.trim();
    const trimmedHash = hashInput.trim();

    if (!trimmedId && !trimmedHash) {
      setInputError("Por favor, ingresa al menos un TolteK ID o un Hash SHA-256 para verificar.");
      return;
    }

    // Validate hash format if provided
    if (trimmedHash && !/^[a-fA-F0-9]{64}$/.test(trimmedHash)) {
      setInputError("El hash simulado debe ser una cadena hexadecimal de 64 caracteres.");
      return;
    }

    // Build VerificationInput with both values when provided
    const verificationInput: VerificationInput = {
      ...(trimmedId ? { workId: trimmedId } : {}),
      ...(trimmedHash ? { hash: trimmedHash.toLowerCase() } : {}),
    };

    setInputError(null);
    setState("verifying");
    setResult(null);
    setMatchedWork(null);
    setQueriedCriteria({
      workId: trimmedId || undefined,
      hash: trimmedHash || undefined,
    });

    const currentRun = ++searchRunRef.current;

    try {
      // First attempt on-chain verification against Soroban contract on Testnet
      let onChainMatched = false;
      try {
        const verifyRes = await fetch("/api/stellar/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(verificationInput),
        });

        if (verifyRes.ok) {
          const verifyData = await verifyRes.json();
          if (verifyData.verified) {
            onChainMatched = true;
            if (currentRun === searchRunRef.current) {
              const res: VerificationResult = {
                verified: true,
                workId: verifyData.workId,
                hash: verifyData.hash,
                evidence: verifyData.evidence,
                message: verifyData.message || "Evidencia verificada exitosamente en el Smart Contract de Soroban (Stellar Testnet).",
              };
              setResult(res);
              setActiveMessage(res.message);

              const currentWork = getWork();
              if (currentWork.id === verifyData.workId) {
                setMatchedWork(currentWork);
              } else {
                setMatchedWork({
                  id: verifyData.workId,
                  title: `Obra ${verifyData.workId}`,
                  type: "document",
                  description: "Registro verificado directamente en el Smart Contract de Soroban.",
                  author: verifyData.author || "Autor verificado en ledger",
                  hash: verifyData.hash,
                  network: "testnet",
                  status: "verified",
                  registeredAt: verifyData.registeredAt,
                });
              }
              setState("matched");
              return;
            }
          }
        }
      } catch (chainErr) {
        console.warn("On-chain verification query fell back to local:", chainErr);
      }

      if (onChainMatched) {
        return;
      }

      // Fallback to local mock storage verification
      const res = await verifyMockEvidence(verificationInput);

      // Discard stale responses if user cleared or edited inputs while request was in-flight
      if (currentRun !== searchRunRef.current) {
        return;
      }

      setResult(res);
      setActiveMessage(res.message);

      if (res.verified && res.workId) {
        const currentWork = getWork();
        if (currentWork.id === res.workId) {
          setMatchedWork(currentWork);
          setState("matched");
        } else {
          // Check remote Supabase API
          try {
            const remoteRes = await fetch(`/api/works?id=${encodeURIComponent(res.workId)}`);
            if (remoteRes.ok) {
              const remoteData = await remoteRes.json();
              if (remoteData.work) {
                setMatchedWork(remoteData.work);
                setState("matched");
                return;
              }
            }
          } catch {
            // ignore
          }
          setState("not_found");
        }
      } else {
        setState("not_found");
      }
    } catch {
      if (currentRun === searchRunRef.current) {
        setState("error");
        setActiveMessage("Ocurrió un error inesperado al procesar la verificación.");
      }
    }
  }

  const hasInputs = Boolean(workIdInput.trim() || hashInput.trim());

  return (
    <section aria-labelledby="verification-heading" className="mx-auto w-full max-w-4xl">
      <div className="border-l-4 border-cyan pl-4 sm:pl-6">
        <p className="font-ui text-xs font-bold tracking-[0.1em] text-cyan-900 uppercase">
          TolteK · Verificación Pública de Autenticidad y Oficio
        </p>
        <h1
          className="mt-1 font-display text-3xl font-semibold tracking-[-0.065em] text-ink sm:text-4xl"
          id="verification-heading"
        >
          VERIFICAR PASAPORTE CULTURAL
        </h1>
        <p className="mt-2 font-ui text-sm leading-6 text-ink/75">
          Comprueba la procedencia comunitaria, técnica del artesano y el registro inmutable en Stellar Testnet mediante su TolteK ID o huella criptográfica SHA-256.
        </p>
      </div>

      {/* Honest copy notice */}
      <div
        aria-label="Aviso de trazabilidad"
        className="mt-6 border-2 border-border bg-yellow/10 p-4"
        role="region"
      >
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 size-5 shrink-0 text-ink/80" />
          <p className="font-ui text-xs leading-5 text-ink/80">
            <strong>Trazabilidad en Stellar:</strong> TolteK consulta la blockchain pública de Stellar Testnet (Soroban Smart Contract) y el registro descentralizado para certificar que la pieza no ha sido adulterada ni su autoría plagiada.
          </p>
        </div>
      </div>

      {/* Search form */}
      <form className="mt-6" onSubmit={handleVerify}>
        <Panel padding="md">
          <div className="flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                autoComplete="off"
                disabled={state === "verifying"}
                id="verification-work-id"
                label="TOLTEK ID"
                onChange={(e) => handleWorkIdChange(e.target.value)}
                placeholder="Ej. TLK-2026-001234"
                value={workIdInput}
              />

              <div className="flex flex-col gap-2">
                <Input
                  autoComplete="off"
                  disabled={state === "verifying"}
                  id="verification-hash"
                  label="HUELLA CRIPTOGRÁFICA (SHA-256)"
                  onChange={(e) => handleHashChange(e.target.value)}
                  placeholder="Ej. 6f0a7c2d47e19b3a8c5d..."
                  value={hashInput}
                />
                <label className="flex flex-col gap-1 border border-border/60 bg-neutral/30 p-2">
                  <span className="font-ui text-[10px] font-bold tracking-[0.05em] text-ink/75">
                    O CALCULA EL HASH DIRECTO DESDE UN ARCHIVO ORIGINAL
                  </span>
                  <input
                    className="w-full text-xs text-ink file:mr-2 file:border-0 file:bg-cyan file:px-2 file:py-1 file:font-ui file:text-[10px] file:font-bold file:text-ink"
                    disabled={state === "verifying"}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        try {
                          const fileHash = await computeFileSha256(file);
                          handleHashChange(fileHash);
                        } catch (err) {
                          console.warn("Error calculando hash:", err);
                        }
                      }
                    }}
                    type="file"
                  />
                </label>
              </div>
            </div>

            <p className="font-ui text-[11px] text-ink/65">
              Puedes verificar por <strong>TolteK ID</strong>, por <strong>Hash SHA-256</strong> o contrastando ambos. La consulta audita el Smart Contract en Stellar Testnet y el registro de la pieza.
            </p>

            {inputError && (
              <p className="font-ui text-xs font-semibold text-red-600" role="alert">
                {inputError}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <BrutalistButton
                disabled={state === "verifying" || !hasInputs}
                type="submit"
              >
                {state === "verifying" ? (
                  "CONSULTANDO STELLAR TESTNET..."
                ) : (
                  <>
                    <Search className="mr-1.5 size-4" />
                    VERIFICAR EN STELLAR TESTNET →
                  </>
                )}
              </BrutalistButton>

              {hasInputs && (
                <button
                  className="font-ui text-xs font-semibold text-ink/60 underline hover:text-ink focus-visible:outline-2"
                  onClick={handleClear}
                  type="button"
                >
                  Limpiar búsqueda
                </button>
              )}
            </div>
          </div>
        </Panel>
      </form>

      {/* Results presentation */}
      <div className="mt-8">
        {state === "verifying" && (
          <Panel aria-live="polite" padding="md">
            <div className="flex items-center gap-3">
              <div className="size-4 animate-spin border-2 border-ink border-t-transparent" />
              <p className="font-ui text-sm font-semibold tracking-[0.05em] text-ink">
                Verificando huella y registro en Stellar Testnet simulada...
              </p>
            </div>
          </Panel>
        )}

        {state === "not_found" && (
          <Panel aria-live="polite" className="border-border bg-white" padding="md">
            <div className="flex items-start gap-3 text-ink">
              <XCircle className="mt-0.5 size-5 shrink-0 text-red-600" />
              <div>
                <h2 className="font-ui text-sm font-bold uppercase tracking-[0.08em]">
                  No se encontró evidencia coincidente
                </h2>
                <p className="mt-1 font-ui text-xs leading-5 text-ink/75">
                  {activeMessage || "El identificador o hash ingresado no corresponde a ninguna obra activa en este entorno local."}
                </p>
                {queriedCriteria && (
                  <div className="mt-2 border-t border-border/40 pt-2 font-ui text-[11px] text-ink/65">
                    <strong>Criterio consultado:</strong>{" "}
                    {queriedCriteria.workId ? `ID: ${queriedCriteria.workId}` : ""}
                    {queriedCriteria.workId && queriedCriteria.hash ? " · " : ""}
                    {queriedCriteria.hash ? `Hash: ${queriedCriteria.hash}` : ""}
                  </div>
                )}
                <p className="mt-2 font-ui text-[11px] text-ink/60">
                  Nota: En esta versión de demostración, las obras registradas solo son accesibles desde el mismo navegador y dominio en el que se crearon.
                </p>
              </div>
            </div>
          </Panel>
        )}

        {state === "error" && (
          <Panel aria-live="assertive" className="border-border bg-white" padding="md">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 size-5 shrink-0 text-amber-600" />
              <div>
                <h2 className="font-ui text-sm font-bold uppercase tracking-[0.08em]">
                  Error de verificación
                </h2>
                <p className="mt-1 font-ui text-xs leading-5 text-ink/75">
                  {activeMessage}
                </p>
              </div>
            </div>
          </Panel>
        )}

        {state === "matched" && result?.verified && matchedWork && (
          <div aria-live="polite" className="space-y-6">
            <Panel padding="none">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-border bg-cyan px-4 py-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-5 text-ink" />
                  <span className="font-ui text-xs font-bold tracking-[0.1em] text-ink">
                    EVIDENCIA VERIFICADA CON ÉXITO
                  </span>
                </div>
                <StatusBadge variant="success">VERIFICADA</StatusBadge>
              </div>

              <div className="p-4 sm:p-6">
                <p className="font-ui text-xs leading-5 text-ink/80">
                  {activeMessage}
                </p>
                {queriedCriteria && (
                  <div className="mt-1 font-ui text-[11px] text-ink/65">
                    <strong>Criterio verificado:</strong>{" "}
                    {queriedCriteria.workId ? `ID: ${queriedCriteria.workId}` : ""}
                    {queriedCriteria.workId && queriedCriteria.hash ? " · " : ""}
                    {queriedCriteria.hash ? `Hash: ${queriedCriteria.hash}` : ""}
                  </div>
                )}

                <h2 className="mt-4 font-display text-2xl font-bold tracking-[-0.04em] text-ink">
                  {matchedWork.title}
                </h2>
                <p className="mt-1 font-ui text-xs text-ink/70">
                  Por <strong>{matchedWork.author}</strong> · Tipo: {matchedWork.type}
                </p>

                {/* Evidence snippet */}
                {result.evidence && (
                  <div className="mt-6">
                    <StellarEvidence evidence={result.evidence} />
                  </div>
                )}

                {/* Full metadata */}
                <div className="mt-6">
                  <h3 className="mb-2 font-ui text-[11px] font-bold uppercase tracking-[0.08em] text-ink/65">
                    Metadatos de la Obra
                  </h3>
                  <WorkMetadata work={matchedWork} />
                </div>

                {/* Navigation actions */}
                <div className="mt-8 flex flex-wrap gap-3 border-t-2 border-border pt-4">
                  <BrutalistButton href={`/obra/${matchedWork.id}`} size="sm">
                    VER DETALLE DE LA OBRA →
                  </BrutalistButton>
                  <BrutalistButton
                    href={`/obra/${matchedWork.id}/historial`}
                    size="sm"
                    variant="yellow"
                  >
                    VER HISTORIAL DE DERECHOS →
                  </BrutalistButton>
                  <BrutalistButton
                    href={`/obra/${matchedWork.id}/derechos`}
                    size="sm"
                    variant="secondary"
                  >
                    REGISTRAR LICENCIA →
                  </BrutalistButton>
                </div>
              </div>
            </Panel>
          </div>
        )}
      </div>
    </section>
  );
}
