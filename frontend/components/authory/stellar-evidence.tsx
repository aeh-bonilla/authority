import { StatusBadge, type StatusBadgeVariant } from "@/components/ui/status-badge";
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
  return (
    <section className={`border-2 border-border bg-white ${className}`}>
      <div className="border-b-2 border-border bg-neutral px-3 py-2">
        <p className="font-ui text-[10px] font-bold tracking-[0.1em] text-ink/65">EVIDENCIA STELLAR</p>
      </div>
      <dl className="grid sm:grid-cols-2">
        <div className="border-b-2 border-border p-2.5 sm:border-r-2">
          <dt className="font-ui text-[10px] font-bold tracking-[0.1em] text-ink/60">ID DE OBRA</dt>
          <dd className="mt-1 break-all font-ui text-xs leading-4 text-ink" title={evidence.workId}>
            {evidence.workId}
          </dd>
        </div>
        <div className="border-b-2 border-border p-2.5">
          <dt className="font-ui text-[10px] font-bold tracking-[0.1em] text-ink/60">RED</dt>
          <dd className="mt-1 font-ui text-xs leading-4 text-ink">STELLAR {evidence.network.toUpperCase()}</dd>
        </div>
        <div className="border-b-2 border-border p-2.5 sm:border-r-2">
          <dt className="font-ui text-[10px] font-bold tracking-[0.1em] text-ink/60">HASH SIMULADO</dt>
          <dd className="mt-1 line-clamp-2 break-all font-ui text-[11px] leading-4 text-ink" title={evidence.hash}>
            {evidence.hash}
          </dd>
        </div>
        <div className="border-b-2 border-border p-2.5">
          <dt className="font-ui text-[10px] font-bold tracking-[0.1em] text-ink/60">TRANSACCIÓN</dt>
          <dd
            className="mt-1 line-clamp-2 break-all font-ui text-[11px] leading-4 text-ink"
            title={evidence.transactionId}
          >
            {evidence.transactionId}
          </dd>
        </div>
        <div className="border-r-2 border-border p-2.5">
          <dt className="font-ui text-[10px] font-bold tracking-[0.1em] text-ink/60">REGISTRADA</dt>
          <dd className="mt-1 font-ui text-xs leading-4 text-ink">{evidence.registeredAt}</dd>
        </div>
        <div className="p-2.5">
          <dt className="font-ui text-[10px] font-bold tracking-[0.1em] text-ink/60">ESTADO</dt>
          <dd className="mt-1">
            <StatusBadge variant={statusVariants[evidence.status]}>{statusLabels[evidence.status]}</StatusBadge>
          </dd>
        </div>
      </dl>
    </section>
  );
}
