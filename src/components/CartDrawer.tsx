"use client"

import {
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
  X,
  MessageCircle,
  BadgeCheck,
  AlertTriangle,
} from "lucide-react"
import { formatUSD, formatVES } from "@/utils/formatCurrency"

type CartItem = {
  id: number
  name: string
  category: string
  price: number
  image: string
  quantity: number
  note?: string
  noteEnabled?: boolean
}

type CartDrawerProps = {
  isOpen: boolean
  onClose: () => void
  items: CartItem[]
  totalPrice: number
  removeItem: (id: number) => void
  increaseQuantity: (id: number) => void
  decreaseQuantity: (id: number) => void
  updateItemNote?: (id: number, note: string) => void
  updateItemNoteEnabled?: (id: number, enabled: boolean) => void
  exchangeRate: number
  exchangeSource?: string
  exchangeValueDate?: string
  exchangeFallback?: boolean
  exchangeWarning?: string
}

const WHATSAPP_NUMBER = "584144841618"

export default function CartDrawer({
  isOpen,
  onClose,
  items,
  totalPrice,
  removeItem,
  increaseQuantity,
  decreaseQuantity,
  updateItemNote,
  updateItemNoteEnabled,
  exchangeRate,
  exchangeSource,
  exchangeValueDate,
  exchangeFallback,
  exchangeWarning,
}: CartDrawerProps) {
  const totalVES = totalPrice * exchangeRate
  const hasItems = items.length > 0

  const sourceLabel = exchangeSource || "BCV"
  const isOfficialBcv = sourceLabel === "BCV" && !exchangeFallback

  function buildWhatsAppMessage() {
    const lines = items.map((item) => {
      const subtotal = item.price * item.quantity
      const subtotalVES = subtotal * exchangeRate

      const baseLine = `• ${item.name} x${item.quantity} — ${formatUSD(
        subtotal
      )} / Bs ${formatVES(subtotalVES)}`

      if (item.noteEnabled && item.note?.trim()) {
        return `${baseLine}\n  Nota: ${item.note.trim()}`
      }

      return baseLine
    })

    const sourceLine = isOfficialBcv
      ? `Fuente: BCV${
          exchangeValueDate ? `\nFecha valor: ${exchangeValueDate}` : ""
        }`
      : `Fuente: ${sourceLabel}`

    return encodeURIComponent(
      `Hola, quiero hacer este pedido en Santo Perrito:\n\n${lines.join(
        "\n"
      )}\n\nTotal: ${formatUSD(totalPrice)}\nAprox. Bs ${formatVES(
        totalVES
      )}\n\nTasa usada: Bs ${formatVES(exchangeRate)}\n${sourceLine}`
    )
  }

  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${buildWhatsAppMessage()}`

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[90]">
      <button
        type="button"
        aria-label="Cerrar carrito"
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />

      <aside className="absolute right-0 top-0 flex h-full w-full max-w-xl flex-col overflow-hidden bg-[#370000] text-white shadow-2xl shadow-black/60 sm:w-[92%]">
        <div className="relative overflow-hidden border-b border-yellow-300/20 bg-[linear-gradient(135deg,#620000_0%,#b50000_52%,#ffba08_130%)] px-5 py-6 sm:px-8">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,214,10,0.25),transparent_38%)]" />

          <div className="relative flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.35em] text-yellow-300">
                Santo Perrito
              </p>

              <div className="mt-2 flex items-center gap-3">
                <ShoppingCart className="text-yellow-300" size={34} />

                <h2 className="text-4xl font-black uppercase leading-none text-white drop-shadow-[0_4px_0_rgba(0,0,0,0.35)] sm:text-5xl">
                  Tu pedido
                </h2>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar carrito"
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-black/35 text-yellow-200 transition hover:scale-105 hover:bg-black/50"
            >
              <X size={28} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-8">
          {!hasItems ? (
            <div className="flex min-h-[430px] flex-col items-center justify-center rounded-[2rem] border border-yellow-300/20 bg-black/18 px-6 py-12 text-center">
              <img
                src="/logoremovebg.png"
                alt="Santo Perrito"
                className="mb-8 h-48 w-48 object-contain drop-shadow-[0_0_34px_rgba(255,214,10,0.45)] sm:h-56 sm:w-56"
              />

              <h3 className="text-3xl font-black uppercase leading-tight text-yellow-300">
                Tu carrito está vacío
              </h3>

              <p className="mt-4 max-w-sm text-sm font-semibold leading-6 text-yellow-50/75">
                Agrega perros, delicias o bebidas del menú y luego envía tu
                pedido directo por WhatsApp.
              </p>

              <a
                href="#menu"
                onClick={onClose}
                className="mt-7 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-400 px-7 py-4 text-sm font-black uppercase tracking-[0.12em] text-[#4a0000] transition hover:scale-105"
              >
                Ver menú
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => {
                const itemSubtotal = item.price * item.quantity
                const itemSubtotalVES = itemSubtotal * exchangeRate
                const canUseNotes = item.category !== "Bebidas"

                return (
                  <article
                    key={item.id}
                    className="overflow-hidden rounded-[1.6rem] border border-yellow-300/20 bg-[#4a0000] shadow-xl shadow-black/20"
                  >
                    <div className="grid grid-cols-[96px_1fr] gap-4 p-4">
                      <div className="h-24 w-24 overflow-hidden rounded-[1.2rem] bg-black/30">
                        <img
                          src={item.image || "/logoremovebg.png"}
                          alt={item.name}
                          className="h-full w-full object-cover"
                          onError={(event) => {
                            event.currentTarget.src = "/logoremovebg.png"
                          }}
                        />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-[0.65rem] font-black uppercase tracking-[0.25em] text-yellow-300">
                              {item.category}
                            </p>

                            <h3 className="mt-1 text-xl font-black uppercase leading-tight text-white">
                              {item.name}
                            </h3>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            aria-label={`Eliminar ${item.name}`}
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black/30 text-yellow-200 transition hover:bg-red-600 hover:text-white"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>

                        <div className="mt-4 flex items-center justify-between gap-3">
                          <div className="flex items-center rounded-full border border-yellow-300/25 bg-black/25 p-1">
                            <button
                              type="button"
                              onClick={() => decreaseQuantity(item.id)}
                              className="flex h-9 w-9 items-center justify-center rounded-full bg-yellow-300 text-[#4a0000] transition hover:scale-105"
                              aria-label="Disminuir cantidad"
                            >
                              <Minus size={17} />
                            </button>

                            <span className="min-w-10 text-center text-base font-black text-white">
                              {item.quantity}
                            </span>

                            <button
                              type="button"
                              onClick={() => increaseQuantity(item.id)}
                              className="flex h-9 w-9 items-center justify-center rounded-full bg-yellow-300 text-[#4a0000] transition hover:scale-105"
                              aria-label="Aumentar cantidad"
                            >
                              <Plus size={17} />
                            </button>
                          </div>

                          <div className="text-right">
                            <p className="text-xl font-black text-yellow-300">
                              {formatUSD(itemSubtotal)}
                            </p>

                            <p className="mt-1 text-xs font-black text-yellow-50/75">
                              Bs {formatVES(itemSubtotalVES)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {canUseNotes && updateItemNote && updateItemNoteEnabled && (
                      <div className="border-t border-yellow-300/15 bg-black/14 px-4 py-4">
                        <label className="flex items-center gap-3 text-sm font-black uppercase tracking-[0.08em] text-yellow-200">
                          <input
                            type="checkbox"
                            checked={Boolean(item.noteEnabled)}
                            onChange={(event) =>
                              updateItemNoteEnabled(
                                item.id,
                                event.target.checked
                              )
                            }
                            className="h-5 w-5 accent-yellow-300"
                          />
                          Agregar nota
                        </label>

                        {item.noteEnabled && (
                          <textarea
                            value={item.note || ""}
                            onChange={(event) =>
                              updateItemNote(item.id, event.target.value)
                            }
                            placeholder="Ejemplo: sin cebolla, extra salsa, sin picante..."
                            className="mt-3 min-h-20 w-full resize-none rounded-2xl border border-yellow-300/25 bg-yellow-50 px-4 py-3 text-sm font-semibold text-[#4a0000] outline-none placeholder:text-[#4a0000]/45 focus:border-yellow-400"
                          />
                        )}
                      </div>
                    )}
                  </article>
                )
              })}
            </div>
          )}
        </div>

        <div className="border-t border-yellow-300/20 bg-[#260000] px-5 py-5 sm:px-8">
          <div className="rounded-[1.8rem] border border-yellow-300/25 bg-[linear-gradient(135deg,#270000_0%,#430000_58%,#5f0700_100%)] p-5 shadow-[0_18px_35px_rgba(0,0,0,0.28)]">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.18em] text-yellow-100">
                  Total
                </p>

                <p className="mt-2 text-sm font-black text-yellow-50/70">
                  Aprox. Bs {formatVES(totalVES)}
                </p>
              </div>

              <p className="text-3xl font-black text-yellow-300 drop-shadow-[0_3px_0_rgba(0,0,0,0.35)]">
                {formatUSD(totalPrice)}
              </p>
            </div>

            <div className="mt-5 overflow-hidden rounded-[1.4rem] border border-yellow-300/25 bg-[#220000]">
              <div className="border-b border-yellow-300/15 bg-black/20 px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[0.68rem] font-black uppercase tracking-[0.28em] text-yellow-300">
                    Tasa oficial usada
                  </p>

                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[0.62rem] font-black uppercase tracking-[0.12em] ${
                      isOfficialBcv
                        ? "bg-yellow-300 text-[#4a0000]"
                        : "bg-orange-400 text-[#4a0000]"
                    }`}
                  >
                    {isOfficialBcv ? (
                      <BadgeCheck size={13} />
                    ) : (
                      <AlertTriangle size={13} />
                    )}
                    {sourceLabel}
                  </span>
                </div>
              </div>

              <div className="px-4 py-4">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-yellow-50/60">
                      Euro oficial
                    </p>

                    <p className="mt-1 text-[0.72rem] font-semibold leading-5 text-yellow-50/70">
                      {exchangeValueDate
                        ? `Fecha valor: ${exchangeValueDate}`
                        : "Fecha valor no disponible"}
                    </p>
                  </div>

                  <p className="text-right text-2xl font-black text-white">
                    Bs {formatVES(exchangeRate)}
                  </p>
                </div>

                {exchangeWarning && (
                  <div className="mt-4 rounded-2xl border border-orange-300/25 bg-orange-500/10 px-4 py-3">
                    <p className="text-xs font-bold leading-5 text-orange-100">
                      {exchangeWarning}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <a
            href={hasItems ? whatsappHref : undefined}
            target={hasItems ? "_blank" : undefined}
            rel={hasItems ? "noreferrer" : undefined}
            aria-disabled={!hasItems}
            className={`mt-4 flex w-full items-center justify-center gap-3 rounded-full px-6 py-4 text-sm font-black uppercase tracking-[0.12em] transition ${
              hasItems
                ? "bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-400 text-[#4a0000] shadow-[0_12px_26px_rgba(0,0,0,0.28)] hover:scale-[1.02]"
                : "pointer-events-none bg-white/20 text-white/45"
            }`}
          >
            <MessageCircle size={21} />
            Enviar pedido
          </a>
        </div>
      </aside>
    </div>
  )
}