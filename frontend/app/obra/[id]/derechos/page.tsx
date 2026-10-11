import { AppHeader } from "@/components/layout/app-header";
import { PageShell } from "@/components/layout/page-shell";
import { RightsRegistrationFlow } from "@/components/authory/rights-registration-flow";

export const instant = false;

interface DerechosPageProps {
  params: Promise<{ id: string }>;
}

export default async function DerechosPage({ params }: DerechosPageProps) {
  const { id } = await params;

  return (
    <div className="min-h-dvh bg-white text-ink">
      <AppHeader />
      <PageShell className="max-w-7xl">
        <RightsRegistrationFlow workId={id} />
      </PageShell>
    </div>
  );
}
