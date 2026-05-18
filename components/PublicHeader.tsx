import Image from "next/image";
import Link from "next/link";

export function PublicHeader() {
  return (
    <header className="border-b border-sand/25 bg-cream/88 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link className="flex items-center gap-3" href="/contratar">
          <span className="relative h-11 w-11 overflow-hidden rounded-full bg-cream shadow-sm ring-1 ring-sage/15">
            <Image
              alt="Ícone Plena"
              className="object-cover"
              fill
              priority
              sizes="44px"
              src="/brand/plena-icon.png"
            />
          </span>
          <span>
            <span className="block font-serif text-2xl leading-none text-ink">Plena</span>
            <span className="text-xs text-ink/60">Sua assistente de receitas leves</span>
          </span>
        </Link>

        <nav className="flex items-center gap-2 text-sm font-semibold text-ink/70">
          <Link className="rounded-full px-3 py-2 hover:bg-white/70" href="/login">
            Entrar
          </Link>
          <Link className="rounded-full bg-sage px-4 py-2 text-white hover:bg-sage/90" href="/contratar">
            Contratar
          </Link>
        </nav>
      </div>
    </header>
  );
}
