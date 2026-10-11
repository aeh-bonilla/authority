import type { Work } from "@/types/work";

export interface WorkMetadataProps {
  work: Work;
  className?: string;
}

interface MetadataItem {
  label: string;
  value: string;
}

function formatTimestamp(timestamp: string): string {
  return timestamp.replace("T", " ").replace(".000Z", " UTC");
}

export function WorkMetadata({ work, className = "" }: WorkMetadataProps) {
  const items: MetadataItem[] = [
    { label: "ID DE OBRA", value: work.id },
    { label: "AUTOR", value: work.author },
    { label: "TIPO", value: work.type.toUpperCase() },
    ...(work.createdAt
      ? [{ label: "CREADA", value: formatTimestamp(work.createdAt) }]
      : []),
    ...(work.registeredAt
      ? [{ label: "REGISTRADA", value: formatTimestamp(work.registeredAt) }]
      : []),
    ...(work.filename ? [{ label: "ARCHIVO", value: work.filename }] : []),
    ...(work.fileSize ? [{ label: "TAMAÑO", value: work.fileSize }] : []),
    ...(work.fileMimeType ? [{ label: "FORMATO", value: work.fileMimeType }] : []),
    { label: "RED", value: work.network.toUpperCase() },
  ];

  return (
    <dl className={`grid border-l-2 border-t-2 border-border sm:grid-cols-2 ${className}`}>
      {items.map((item) => (
        <div key={item.label} className="border-b-2 border-r-2 border-border p-3">
          <dt className="font-ui text-[10px] font-bold tracking-[0.1em] text-ink/60">{item.label}</dt>
          <dd className="mt-2 break-words font-ui text-xs leading-5 text-ink">{item.value}</dd>
        </div>
      ))}
      {work.sourceUrl ? (
        <div className="border-b-2 border-r-2 border-border p-3 sm:col-span-2">
          <dt className="font-ui text-[10px] font-bold tracking-[0.1em] text-ink/60">ENLACE DE ORIGEN</dt>
          <dd className="mt-2 break-all font-ui text-xs leading-5">
            {/^https?:\/\//i.test(work.sourceUrl) ? (
              <a className="underline decoration-2 underline-offset-4" href={work.sourceUrl} rel="noreferrer" target="_blank">
                {work.sourceUrl}
              </a>
            ) : (
              <span className="text-ink/80">{work.sourceUrl}</span>
            )}
          </dd>
        </div>
      ) : null}
      {work.notes ? (
        <div className="border-b-2 border-r-2 border-border p-3 sm:col-span-2">
          <dt className="font-ui text-[10px] font-bold tracking-[0.1em] text-ink/60">NOTAS</dt>
          <dd className="mt-2 font-ui text-xs leading-5 text-ink">{work.notes}</dd>
        </div>
      ) : null}
    </dl>
  );
}
