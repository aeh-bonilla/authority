import { ExternalLink } from "lucide-react";
import { StatusBadge, type StatusBadgeVariant } from "@/components/ui/status-badge";
import { STELLAR_CONFIG, getContractExplorerUrl, getTxExplorerUrl } from "@/lib/stellar/config";
import type { StellarEvidence as StellarEvidenceRecord } from "@/types/stellar";

export interface StellarEvidenceProps {
  evidence: StellarEvidenceRecord;
  className?: string;
}

const statusVariants: Record<StellarEvidenceRecord["status"], StatusBadgeVariant> = {
  pending: "active",
  confirmed: "success",
  failed: "neutral",
};

const statusLabels: Record<StellarEvidenceRecord["status"], string> = {
  pending: "PENDIENTE",
  confirmed: "CONFIRMADO",
  failed: "FALLIDA",
};

export function StellarEvidence({ evidence, className = "" }: StellarEvidenceProps) {
  const isRealTx =
    evidence.transactionId &&
    !evidence.transactionId.startsWith("mock_") &&
    /^[a-fA-F0-9]{64}$/.test(evidence.transactionId);

  const txUrl = isRealTx ? getTxExplorerUrl(evidence.transactionId) : undefined;
  const contractUrl = getContractExplorerUrl(STELLAR_CONFIG.contractId);

  return (
    <section className={`border-2 border-border bg-white ${className}`}>
      <div className="flex items-center justify-between border-b-2 border-border bg-neutral px-3 py-2">
        <p className="font-ui text-[10px] font-bold tracking-[0.1em] text-ink/65">EVIDENCIA STELLAR</p>
        <span className="font-ui text-[9px] font-bold uppercase tracking-wider text-ink/70">
          {isRealTx ? "SOROBAN SMART CONTRACT · TESTNET" : "ENTORNO TESTNET"}
        </span>
      </div>
      <dl className="grid sm:grid-cols-2">
        <div className="border-b-2 border-border p-2.5 sm:border-r-2">
          <dt className="font-ui text-[10px] font-bold tracking-[0.1em] text-ink/60">ID DE OBRA</dt>
          <dd className="mt-1 break-all font-ui text-xs font-semibold leading-4 text-ink" title={evidence.workId}>
            {evidence.workId}
          </dd>
        </div>
        <div className="border-b-2 border-border p-2.5">
          <dt className="font-ui text-[10px] font-bold tracking-[0.1em] text-ink/60">RED</dt>
          <dd className="mt-1 font-ui text-xs leading-4 text-ink">
            STELLAR {evidence.network.toUpperCase()}
          </dd>
        </div>
        <div className="border-b-2 border-border p-2.5 sm:border-r-2">
          <dt className="font-ui text-[10px] font-bold tracking-[0.1em] text-ink/60">
            {evidence.hash.length === 64 ? "HUELLA CRIPTOGRÁFICA (SHA-256)" : "HASH REGISTRADO"}
          </dt>
          <dd className="mt-1 line-clamp-2 break-all font-mono text-[11px] leading-4 text-ink" title={evidence.hash}>
            {evidence.hash}
          </dd>
        </div>
        <div className="border-b-2 border-border p-2.5">
          <dt className="font-ui text-[10px] font-bold tracking-[0.1em] text-ink/60">TRANSACCIÓN EN LEDGER</dt>
          <dd className="mt-1 line-clamp-2 break-all font-mono text-[11px] leading-4 text-ink" title={evidence.transactionId}>
            {txUrl ? (
              <a
                className="inline-flex items-center gap-1 font-semibold text-cyan-800 underline decoration-cyan hover:text-cyan-900"
                href={txUrl}
                rel="noreferrer"
                target="_blank"
              >
                {evidence.transactionId.slice(0, 16)}…{evidence.transactionId.slice(-8)}
                <ExternalLink className="size-3" />
              </a>
            ) : (
              evidence.transactionId
            )}
          </dd>
        </div>
        <div className="border-b-2 border-border p-2.5 sm:border-r-2 sm:border-b-0">
          <dt className="font-ui text-[10px] font-bold tracking-[0.1em] text-ink/60">CONTRATO REGISTRY</dt>
          <dd className="mt-1 break-all font-mono text-[10px] leading-4 text-ink">
            <a
              className="inline-flex items-center gap-1 font-semibold text-ink underline decoration-2 hover:text-cyan-800"
              href={contractUrl}
              rel="noreferrer"
              target="_blank"
            >
              {STELLAR_CONFIG.contractId.slice(0, 8)}…{STELLAR_CONFIG.contractId.slice(-6)}
              <ExternalLink className="size-2.5" />
            </a>
          </dd>
        </div>
        <div className="p-2.5">
          <dt className="font-ui text-[10px] font-bold tracking-[0.1em] text-ink/60">ESTADO</dt>
          <dd className="mt-1 flex items-center justify-between">
            <StatusBadge variant={statusVariants[evidence.status]}>{statusLabels[evidence.status]}</StatusBadge>
            <span className="font-ui text-[10px] text-ink/60">{evidence.registeredAt.slice(0, 10)}</span>
          </dd>
        </div>
      </dl>
    </section>
  );
}
