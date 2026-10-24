import { StatusBadge } from "@/components/ui/status-badge";
import type { Work } from "@/types/work";

export interface WorkSummaryProps {
  work: Work;
  className?: string;
  showDescription?: boolean;
}

const workTypeLabels: Record<Work["type"], string> = {
  photography: "FOTOGRAFÍA",
  illustration: "ILUSTRACIÓN",
  document: "DOCUMENTO",
  music: "MÚSICA",
  code: "CÓDIGO",
  video: "VIDEO",
  other: "OTRA",
};

const statusVariants: Record<Work["status"], "neutral" | "active" | "success"> = {
  draft: "neutral",
  processing: "active",
  registered: "success",
  verified: "success",
};

export function WorkSummary({
  work,
  className = "",
  showDescription = false,
}: WorkSummaryProps) {
  return (
    <article className={`border-2 border-border bg-white p-4 sm:p-5 ${className}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-ui text-[10px] font-bold tracking-[0.1em] text-ink/65">{work.id}</p>
          <h2 className="mt-2 font-display text-2xl font-semibold tracking-[-0.04em] text-ink">
            {work.title}
          </h2>
        </div>
        <StatusBadge variant={statusVariants[work.status]}>{work.status.toUpperCase()}</StatusBadge>
      </div>
      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 font-ui text-[11px] text-ink/75">
        <span>{workTypeLabels[work.type]}</span>
        <span>{work.author}</span>
      </div>
      {showDescription ? (
        <p className="mt-4 max-w-2xl font-ui text-xs leading-6 text-ink/80">{work.description}</p>
      ) : null}
    </article>
  );
}
