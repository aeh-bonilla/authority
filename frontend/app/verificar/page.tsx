import { Suspense } from "react";

import { WorkVerification } from "@/components/authory/work-verification";
import { AppHeader } from "@/components/layout/app-header";
import { PageShell } from "@/components/layout/page-shell";

export const instant = false;

interface VerificarPageProps {
  searchParams: Promise<{
    workId?: string | string[];
    hash?: string | string[];
  }>;
}

function normalizeParam(param: string | string[] | undefined): string {
  if (Array.isArray(param)) {
    return (param[0] ?? "").trim();
  }
  if (typeof param === "string") {
    return param.trim();
  }
  return "";
}

export default async function VerificarPage({ searchParams }: VerificarPageProps) {
  const params = await searchParams;
  const workId = normalizeParam(params.workId);
  const hash = normalizeParam(params.hash);

  return (
    <div className="min-h-dvh bg-white text-ink">
      <AppHeader activeHref="/verificar" />
      <PageShell className="max-w-7xl">
        <Suspense
          fallback={
            <div className="p-8 font-ui text-xs font-bold tracking-[0.1em] text-ink">
              CARGANDO VERIFICADOR...
            </div>
          }
        >
          <WorkVerification
            key={`${workId}:${hash}`}
            initialHash={hash}
            initialWorkId={workId}
          />
        </Suspense>
      </PageShell>
    </div>
  );
}
