import Image from "next/image";
import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-sand/25 bg-cream/88 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/rotina" className="flex min-w-0 items-center gap-3">
          <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-cream shadow-sm ring-1 ring-sage/15 md:h-11 md:w-11">
            <Image
              alt="Ícone Plena"
              className="object-cover"
              fill
              priority
              sizes="44px"
              src="/brand/plena-icon.png"
            />
          </span>
          <span className="min-w-0">
            <span className="block font-serif text-2xl leading-none text-ink">Plena</span>
            <span className="hidden text-xs text-ink/60 sm:block">Sua assistente de receitas leves</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-1 text-sm font-medium text-ink/70 lg:flex">
          <Link className="rounded-full px-3 py-2 hover:bg-white/70" href="/rotina">Rotina</Link>
          <Link className="rounded-full px-3 py-2 hover:bg-white/70" href="/chat">Chat</Link>
          <Link className="rounded-full px-3 py-2 hover:bg-white/70" href="/cardapio">Cardapio</Link>
          <Link className="rounded-full px-3 py-2 hover:bg-white/70" href="/compras">Compras</Link>
          <Link className="rounded-full px-3 py-2 hover:bg-white/70" href="/despensa">Despensa</Link>
          <Link className="rounded-full px-3 py-2 hover:bg-white/70" href="/favoritas">Favoritas</Link>
          <Link className="rounded-full px-3 py-2 hover:bg-white/70" href="/login">Perfil</Link>
        </nav>
      </div>
    </header>
  );
}
