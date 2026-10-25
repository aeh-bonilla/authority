import { AppHeader } from "@/components/layout/app-header";
import { PageShell } from "@/components/layout/page-shell";
import { BrutalistButton } from "@/components/ui/brutalist-button";
import { Panel } from "@/components/ui/panel";

const capabilities = [
  {
    title: "PRESERVACIÓN DEL OFICIO",
    description: "Cápsula de saberes: técnica ancestral, materiales, comunidad y linaje.",
  },
  {
    title: "PASAPORTE CULTURAL & QR",
    description: "Certificado físico-digital de autenticidad anclado de forma inmutable a Stellar.",
  },
  {
    title: "COMERCIO JUSTO Y DIRECTO",
    description: "Venta directa y trazabilidad de derechos y pagos sin intermediarios abusivos.",
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
            <span className="font-ui text-xs font-bold tracking-[0.15em] text-cyan-900 uppercase">
              TlamatiK · Protocolo de Memoria Cultural & Stellar
            </span>
            <h1
              className="mt-2 font-display text-4xl font-semibold leading-[0.93] tracking-[-0.075em] text-ink sm:text-5xl lg:text-[clamp(2.5rem,3.6vw,3.25rem)]"
              id="home-title"
            >
              <span className="block">SALVAGUARDA EL OFICIO.</span>
              <span className="block">COMERCIALIZA CON</span>
              <span className="block text-cyan-950">COMERCIO JUSTO.</span>
            </h1>
            <p className="mt-3 max-w-xl font-ui text-sm leading-5 text-ink/75 sm:leading-6">
              Herramienta integral para que artesanos, artistas y promotores culturales protejan
              la técnica y memoria de su oficio, certifiquen la procedencia con códigos QR y
              vendan su trabajo respaldados por la red Stellar.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <BrutalistButton href="/registrar-obra" size="md">
                REGISTRAR OFICIO / OBRA →
              </BrutalistButton>
              <BrutalistButton href="/verificar" size="md" variant="secondary">
                VERIFICAR AUTENTICIDAD →
              </BrutalistButton>
            </div>
          </div>

          <Panel aria-labelledby="architecture-title" className="lg:flex lg:h-full lg:flex-col" padding="none">
            <div className="border-b-2 border-border px-3 py-2 sm:px-4 sm:py-3">
              <h2
                className="font-display text-base font-semibold tracking-[-0.04em] text-ink"
                id="architecture-title"
              >
                TRAZABILIDAD CULTURAL / STELLAR
              </h2>
            </div>

            <div className="flex flex-1 flex-col justify-center p-3 sm:p-4 lg:p-5">
              <div className="border-2 border-border bg-white p-3">
                <h3 className="font-display text-lg font-semibold tracking-[-0.045em] text-ink lg:text-xl">
                  SABER ANCESTRAL / PIEZA
                </h3>
                <p className="mt-0.5 font-ui text-[10px] font-bold tracking-[0.1em] text-ink/60">
                  TÉCNICA · MATERIALES · COMUNIDAD DE ORIGEN
                </p>
              </div>

              <div aria-hidden="true" className="flex h-4 items-center justify-center font-ui text-lg">
                ↓
              </div>

              <div className="border-2 border-border bg-yellow p-3">
                <h3 className="font-display text-lg font-semibold tracking-[-0.045em] text-ink lg:text-xl">
                  HUELLA CRIPTOGRÁFICA
                </h3>
                <p className="mt-0.5 font-ui text-[10px] font-bold tracking-[0.1em] text-ink/70">
                  SELLO SHA-256 DEL PROCESO Y REGISTRO
                </p>
              </div>

              <div aria-hidden="true" className="flex h-4 items-center justify-center font-ui text-lg">
                ↓
              </div>

              <div className="border-2 border-border bg-cyan p-3">
                <h3 className="font-display text-lg font-semibold tracking-[-0.045em] text-ink lg:text-xl">
                  RED STELLAR & PASAPORTE QR
                </h3>
                <p className="mt-0.5 font-ui text-[10px] font-bold tracking-[0.1em] text-ink/65">
                  ATTESTATION INMUTABLE · COMERCIO DIRECTO
                </p>
              </div>

            </div>
          </Panel>
        </section>

        <section
          aria-label="Capacidades principales de TlamatiK"
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
              DIGNIDAD PARA EL ARTESANO · TRANSPARENCIA EN STELLAR.
            </h2>
            <p className="font-ui text-[11px] leading-5 text-white/65 lg:text-right">
              TlamatiK: Salvaguarda patrimonial contra la apropiación cultural y el regateo.
            </p>
          </div>
        </section>
      </PageShell>
    </div>
  );
}
