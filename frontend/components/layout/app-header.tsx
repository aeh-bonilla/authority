import Link from "next/link";

import { BrutalistButton } from "@/components/ui/brutalist-button";

export interface AppHeaderLink {
  href: string;
  label: string;
}

export interface AppHeaderProps {
  activeHref?: string;
  brandHref?: string;
  navigation?: readonly AppHeaderLink[];
  signInHref?: string;
  signInLabel?: string;
}

const defaultNavigation: readonly AppHeaderLink[] = [
  { href: "/", label: "INICIO" },
  { href: "/registrar-obra", label: "REGISTRAR OBRA" },
  { href: "/verificar", label: "VERIFICAR OBRA" },
];

export function AppHeader({
  activeHref,
  brandHref = "/",
  navigation = defaultNavigation,
  signInHref,
  signInLabel = "ENTRAR",
}: AppHeaderProps) {
  return (
    <header className="border-b-2 border-border bg-white">
      <div className="mx-auto flex min-h-18 w-full max-w-7xl flex-wrap items-center gap-x-5 gap-y-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link
          className="order-1 font-display text-2xl font-bold tracking-[-0.08em] text-ink"
          href={brandHref}
        >
          AUTHORY
        </Link>

        <nav aria-label="Navegación principal" className="order-3 w-full sm:order-2 sm:w-auto sm:flex-1">
          <ul className="flex flex-wrap gap-x-4 gap-y-2 text-[11px] font-semibold tracking-[0.08em] sm:justify-center">
            {navigation.map((item) => {
              const isActive = item.href === activeHref;

              return (
                <li key={`${item.href}-${item.label}`}>
                  <Link
                    aria-current={isActive ? "page" : undefined}
                    className={`border-b-2 px-1 py-1 focus-visible:border-ink ${
                      isActive
                        ? "border-cyan bg-cyan text-ink"
                        : "border-transparent hover:border-ink"
                    }`}
                    href={item.href}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {signInHref ? (
          <BrutalistButton
            className="order-2 ml-auto sm:order-3 sm:ml-0"
            href={signInHref}
            size="sm"
          >
            {signInLabel}
          </BrutalistButton>
        ) : (
          <BrutalistButton
            aria-label="Entrar no disponible: la autenticación está fuera del alcance de la Prueba Funcional."
            className="order-2 ml-auto sm:order-3 sm:ml-0"
            disabled
            size="sm"
            title="La autenticación está fuera del alcance de la Prueba Funcional."
          >
            {signInLabel}
          </BrutalistButton>
        )}
      </div>
    </header>
  );
}
