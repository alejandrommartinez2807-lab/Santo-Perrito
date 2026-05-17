"use client"

import { ShoppingCart } from "lucide-react"

type NavbarProps = {
  totalItems: number
  onOpenCart: () => void
}

const INSTAGRAM_URL = "https://www.instagram.com/santoperritoval/"
const WHATSAPP_URL = "https://wa.me/584227377486"

const navItems = [
  {
    label: "INICIO",
    href: "#inicio",
  },
  {
    label: "MENÚ",
    href: "#menu",
  },
  {
    label: "WHATSAPP",
    href: WHATSAPP_URL,
    external: true,
  },
  {
    label: "INSTAGRAM",
    href: INSTAGRAM_URL,
    external: true,
  },
]

export default function Navbar({ totalItems, onOpenCart }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b-4 border-[#a00000] bg-[#fff7e8] shadow-[0_10px_28px_rgba(80,0,0,0.16)]">
      <div className="h-5 bg-[linear-gradient(45deg,#a00000_25%,transparent_25%),linear-gradient(-45deg,#a00000_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#a00000_75%),linear-gradient(-45deg,transparent_75%,#a00000_75%)] bg-[length:32px_32px] bg-[position:0_0,0_16px,16px_-16px,-16px_0] bg-[#fff7e8]" />

      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <a href="#inicio" className="flex min-w-0 items-center gap-3">
          <div className="flex h-[64px] w-[64px] shrink-0 items-center justify-center rounded-full bg-[#d90000] shadow-[0_10px_24px_rgba(160,0,0,0.22)] ring-4 ring-yellow-300 sm:h-[72px] sm:w-[72px]">
            <img
              src="/logoremovebg.png"
              alt="Santo Perrito"
              className="h-[54px] w-[54px] object-contain sm:h-[60px] sm:w-[60px]"
            />
          </div>

          <div className="min-w-0">
            <p className="truncate text-[1.72rem] font-black uppercase leading-none tracking-[-0.04em] text-[#a00000] sm:text-4xl">
              Santo Perrito
            </p>

            <p className="mt-1 truncate text-[0.9rem] font-black uppercase tracking-[0.32em] text-[#220000] sm:text-base">
              Perros & delicias
            </p>
          </div>
        </a>

        <button
          type="button"
          onClick={onOpenCart}
          aria-label="Abrir carrito"
          className="relative flex h-[58px] w-[58px] shrink-0 items-center justify-center rounded-[1.25rem] border-2 border-[#a00000] bg-yellow-300 text-[#4a0000] shadow-[0_10px_24px_rgba(80,0,0,0.18)] transition hover:scale-105 sm:h-16 sm:w-16"
        >
          <ShoppingCart size={30} strokeWidth={2.4} />

          {totalItems > 0 && (
            <span className="absolute -right-2 -top-2 flex h-7 min-w-7 items-center justify-center rounded-full bg-[#a00000] px-2 text-xs font-black text-white shadow-md">
              {totalItems}
            </span>
          )}
        </button>
      </div>

      <div className="mx-auto max-w-7xl px-3 pb-4 sm:px-6 lg:px-8">
        <nav className="mx-auto grid max-w-4xl grid-cols-4 overflow-hidden rounded-[1.1rem] border-2 border-[#a00000] bg-white shadow-[0_8px_0_rgba(160,0,0,0.13)]">
          {navItems.map((item, index) => {
            const linkClass = [
              "flex h-[44px] items-center justify-center text-center",
              "border-[#a00000]/15 text-[0.7rem] font-black uppercase tracking-[0.13em]",
              "text-[#a00000] transition duration-200 hover:bg-yellow-300 hover:text-[#4a0000]",
              "sm:h-[50px] sm:text-sm sm:tracking-[0.18em]",
              index !== navItems.length - 1 ? "border-r" : "",
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
    </header>
  )
}