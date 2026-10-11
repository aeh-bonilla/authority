import { AppHeader } from "@/components/layout/app-header";
import { PageShell } from "@/components/layout/page-shell";
import { WorkHistory } from "@/components/authory/work-history";

export const instant = false;

interface HistorialPageProps {
  params: Promise<{ id: string }>;
}

export default async function HistorialPage({ params }: HistorialPageProps) {
  const { id } = await params;

  return (
    <div className="min-h-dvh bg-white text-ink">
      <AppHeader />
      <PageShell className="max-w-7xl">
        <WorkHistory workId={id} />
      </PageShell>
    </div>
  );
}
