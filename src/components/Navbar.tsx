"use client"

import { ShoppingCart } from "lucide-react"

type NavbarProps = {
  totalItems: number
  onOpenCart: () => void
}

const navItems = [
  {
    label: "INICIO",
    href: "#inicio",
    className: "text-white",
  },
  {
    label: "MENÚ",
    href: "#menu",
    className: "text-white",
  },
  {
    label: "WHATSAPP",
    href: "#contacto",
    className: "text-emerald-300",
  },
  {
    label: "INSTAGRAM",
    href: "https://www.instagram.com/santoperritoval/",
    className: "text-fuchsia-300",
    external: true,
  },
]

export default function Navbar({ totalItems, onOpenCart }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="relative overflow-hidden bg-[linear-gradient(90deg,#5c0000_0%,#b80000_38%,#f21b1b_68%,#ffba08_115%)] shadow-[0_10px_28px_rgba(0,0,0,0.26)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_55%_0%,rgba(255,226,115,0.28),transparent_44%)]" />
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-black/35 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-black/25 to-transparent" />

        <div className="relative mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 pb-2 pt-3 sm:px-6 lg:px-8">
          <a href="#inicio" className="flex min-w-0 items-center gap-3">
            <img
              src="/logo-santo-perrito.png"
              alt="Santo Perrito"
              className="h-[58px] w-[58px] shrink-0 rounded-full object-contain drop-shadow-[0_0_16px_rgba(255,214,10,0.45)] sm:h-16 sm:w-16"
            />

            <div className="min-w-0">
              <p className="truncate text-[1.55rem] font-black uppercase leading-none tracking-tight text-yellow-300 drop-shadow-[0_3px_0_rgba(0,0,0,0.35)] sm:text-3xl">
                Santo Perrito
              </p>
              <p className="mt-1 truncate text-[0.78rem] font-black uppercase tracking-[0.26em] text-yellow-100 sm:text-base">
                Perros & Delicias
              </p>
            </div>
          </a>

          <button
            type="button"
            onClick={onOpenCart}
            aria-label="Abrir carrito"
            className="relative flex h-[58px] w-[58px] shrink-0 items-center justify-center rounded-[1.25rem] bg-[linear-gradient(135deg,#ffd60a_0%,#ffba08_50%,#ff4d00_100%)] text-[#450000] shadow-[0_10px_24px_rgba(0,0,0,0.25)] transition hover:scale-105 sm:h-16 sm:w-16"
          >
            <ShoppingCart size={30} strokeWidth={2.2} />

            {totalItems > 0 && (
              <span className="absolute -right-1 -top-1 flex h-7 min-w-7 items-center justify-center rounded-full bg-white px-2 text-xs font-black text-red-700 shadow-md">
                {totalItems}
              </span>
            )}
          </button>
        </div>

        <div className="relative mx-auto max-w-7xl px-3 pb-3 sm:px-6 lg:px-8">
          <nav className="mx-auto grid max-w-4xl grid-cols-4 items-center rounded-[1.2rem] bg-black/18 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-sm">
            {navItems.map((item) => {
              const linkClass = [
                "flex h-[46px] items-center justify-center text-center",
                "text-[0.68rem] font-black uppercase tracking-[0.10em]",
                "transition duration-200 hover:bg-white/10",
                "first:rounded-l-[1.2rem] last:rounded-r-[1.2rem]",
                "sm:h-[52px] sm:text-sm sm:tracking-[0.18em]",
                item.className,
              ].join(" ")

              if (item.external) {
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className={linkClass}
                  >
                    {item.label}
                  </a>
                )
              }

              return (
                <a key={item.label} href={item.href} className={linkClass}>
                  {item.label}
                </a>
              )
            })}
          </nav>
        </div>
      </div>
    </header>
  )
}