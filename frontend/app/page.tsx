import { AppHeader } from "@/components/layout/app-header";
import { PageShell } from "@/components/layout/page-shell";
import { BrutalistButton } from "@/components/ui/brutalist-button";
import { Panel } from "@/components/ui/panel";

const capabilities = [
  {
    title: "REGISTRO DE AUTORÍA",
    description: "Evidencia verificable de creación.",
  },
  {
    title: "VERIFICACIÓN PÚBLICA",
    description: "Comprobación de procedencia.",
  },
  {
    title: "HISTORIAL DE DERECHOS",
    description: "Licencias y transferencias.",
  },
];

export default function Home() {
  return (
    <div className="flex min-h-dvh flex-col bg-white text-ink">
      <AppHeader activeHref="/" />

      <PageShell className="flex flex-1 flex-col !py-4 sm:!py-5">
        <section
          aria-labelledby="home-title"
          className="grid items-start gap-5 lg:flex-1 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch lg:gap-8"
        >
          <div className="border-l-2 border-border pl-5 sm:pl-7 lg:flex lg:flex-col lg:justify-center">
            <h1
              className="font-display text-4xl font-semibold leading-[0.93] tracking-[-0.075em] text-ink sm:text-5xl lg:text-[clamp(2.5rem,3.6vw,3.25rem)] lg:whitespace-nowrap"
              id="home-title"
            >
              <span className="block">PROTEGE Y VERIFICA</span>
              <span className="block">LA AUTORÍA DE TUS</span>
              <span className="block">OBRAS DIGITALES</span>
            </h1>
            <p className="mt-3 max-w-xl font-ui text-sm leading-5 text-ink/75 sm:leading-6">
              Registra evidencia verificable de autoría, fecha y derechos sin publicar el archivo
              original en la blockchain.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <BrutalistButton href="/registrar-obra" size="md">
                REGISTRAR OBRA →
              </BrutalistButton>
              <BrutalistButton href="/verificar" size="md" variant="secondary">
                VERIFICAR OBRA →
              </BrutalistButton>
            </div>
          </div>

          <Panel aria-labelledby="architecture-title" className="lg:flex lg:h-full lg:flex-col" padding="none">
            <div className="border-b-2 border-border px-3 py-2 sm:px-4 sm:py-3">
              <h2
                className="font-display text-base font-semibold tracking-[-0.04em] text-ink"
                id="architecture-title"
              >
                ARQUITECTURA / EVIDENCIA
              </h2>
            </div>

            <div className="flex flex-1 flex-col justify-center p-3 sm:p-4 lg:p-5">
              <div className="border-2 border-border bg-white p-3">
                <h3 className="font-display text-lg font-semibold tracking-[-0.045em] text-ink lg:text-xl">
                  ARCHIVO ORIGINAL
                </h3>
                <p className="mt-0.5 font-ui text-[10px] font-bold tracking-[0.1em] text-ink/60">
                  PRIVADO · OFF-CHAIN
                </p>
              </div>

              <div aria-hidden="true" className="flex h-4 items-center justify-center font-ui text-lg">
                ↓
              </div>

              <div className="border-2 border-border bg-yellow p-3">
                <h3 className="font-display text-lg font-semibold tracking-[-0.045em] text-ink lg:text-xl">
                  HASH CRIPTOGRÁFICO
                </h3>
              </div>

              <div aria-hidden="true" className="flex h-4 items-center justify-center font-ui text-lg">
                ↓
              </div>

              <div className="border-2 border-border bg-cyan p-3">
                <h3 className="font-display text-lg font-semibold tracking-[-0.045em] text-ink lg:text-xl">
                  RED STELLAR
                </h3>
                <p className="mt-0.5 font-ui text-[10px] font-bold tracking-[0.1em] text-ink/65">
                  REFERENCIA VERIFICABLE
                </p>
              </div>

            </div>
          </Panel>
        </section>

        <section
          aria-label="Capacidades principales de Authory"
          className="mt-6 grid border-l-2 border-t-2 border-border sm:mt-8 lg:grid-cols-3"
        >
          {capabilities.map((capability) => (
            <article
              className="border-b-2 border-r-2 border-border p-3 sm:p-4 lg:flex lg:min-h-24 lg:flex-col lg:justify-center lg:p-3"
              key={capability.title}
            >
              <h2 className="font-display text-lg font-semibold tracking-[-0.045em] text-ink">
                {capability.title}
              </h2>
              <p className="mt-2 max-w-xs font-ui text-[11px] leading-4 text-ink/70">
                {capability.description}
              </p>
            </article>
          ))}
        </section>

        <section
          aria-labelledby="privacy-title"
          className="mt-4 bg-ink px-4 py-4 sm:mt-5 sm:px-5"
        >
          <div className="grid items-center gap-3 lg:grid-cols-[1fr_auto] lg:gap-8">
            <h2
              className="font-display text-xl font-semibold tracking-[-0.045em] text-yellow"
              id="privacy-title"
            >
              TU ARCHIVO ORIGINAL SIEMPRE PERMANECE PRIVADO.
            </h2>
            <p className="font-ui text-[11px] leading-5 text-white/65 lg:text-right">
              Stellar = capa de confianza y trazabilidad.
            </p>
          </div>
        </section>
      </PageShell>
    </div>
  );
}
