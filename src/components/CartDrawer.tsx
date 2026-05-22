"use client"

import { useEffect, useState } from "react"
import {
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
  X,
  MessageCircle,
  BadgeCheck,
  AlertTriangle,
  ClipboardList,
  Store,
  CheckCircle2,
  Loader2,
} from "lucide-react"
import { formatUSD, formatVES } from "@/utils/formatCurrency"

type ProductPaymentMode = "divisa" | "mixto"

type CartItem = {
  id: number
  name: string
  category: string
  price: number
  image: string
  quantity: number
  note?: string
  noteEnabled?: boolean
  paymentMode?: ProductPaymentMode
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

type OrderType = "Comer aquí" | "Para llevar"

const WHATSAPP_NUMBER = "584227377486"

const LOCATIONS_STORAGE_KEY = "santo_perrito_order_locations"

const DEFAULT_QUICK_PLACES = [
  "Mesa 1",
  "Mesa 2",
  "Mesa 3",
  "Mesa 4",
  "Barra",
  "Afuera",
]

function isComboItem(item: CartItem) {
  return item.paymentMode === "divisa" || item.category === "Combos"
}

function getItemPaymentMode(item: CartItem): ProductPaymentMode {
  return isComboItem(item) ? "divisa" : "mixto"
}

async function readApiResponse(response: Response) {
  const text = await response.text()

  try {
    return JSON.parse(text)
  } catch {
    throw new Error(
      "El servidor no devolvió una respuesta válida. Revisa que la API de pedidos y Google Sheets estén funcionando correctamente."
    )
  }
}

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
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false)
  const [customerName, setCustomerName] = useState("")
  const [tableNumber, setTableNumber] = useState("")
  const [orderType, setOrderType] = useState<OrderType>("Comer aquí")
  const [customerNote, setCustomerNote] = useState("")
  const [lastCreatedOrderId, setLastCreatedOrderId] = useState<string | null>(
    null
  )
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false)
  const [orderError, setOrderError] = useState<string | null>(null)
  const [quickPlaces, setQuickPlaces] = useState(DEFAULT_QUICK_PLACES)

  useEffect(() => {
    try {
      const storedLocations = window.localStorage.getItem(LOCATIONS_STORAGE_KEY)

      if (!storedLocations) return

      const parsedLocations = JSON.parse(storedLocations)

      if (!Array.isArray(parsedLocations)) return

      const cleanLocations = parsedLocations
        .map((location) => String(location || "").trim())
        .filter(Boolean)

      if (cleanLocations.length > 0) {
        setQuickPlaces(cleanLocations)
      }
    } catch {
      setQuickPlaces(DEFAULT_QUICK_PLACES)
    }
  }, [])

  const hasItems = items.length > 0

  const comboItems = items.filter(isComboItem)
  const regularItems = items.filter((item) => !isComboItem(item))

  const comboTotalPrice = comboItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )

  const regularTotalPrice = regularItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )

  const regularTotalVES = regularTotalPrice * exchangeRate
  const totalUSD = comboTotalPrice + regularTotalPrice

  const hasCombos = comboTotalPrice > 0
  const hasRegularProducts = regularTotalPrice > 0

  const sourceLabel = exchangeSource || "BCV"
  const isOfficialBcv = sourceLabel === "BCV" && !exchangeFallback

  const canRegisterLocalOrder =
    hasItems && tableNumber.trim().length > 0 && !isSubmittingOrder

  function buildWhatsAppMessage() {
    const comboLines = comboItems.map((item) => {
      const subtotal = item.price * item.quantity

      const baseLine = `• ${item.name} x${item.quantity} — ${formatUSD(
        subtotal
      )} / Solo divisas`

      if (item.noteEnabled && item.note?.trim()) {
        return `${baseLine}\n  Nota: ${item.note.trim()}`
      }

      return baseLine
    })

    const regularLines = regularItems.map((item) => {
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

    const messageParts = [
      "Hola, quiero hacer este pedido en Santo Perrito:",
      "",
    ]

    if (comboLines.length > 0) {
      messageParts.push("COMBOS — SOLO DIVISAS")
      messageParts.push(...comboLines)
      messageParts.push(`Subtotal combos: ${formatUSD(comboTotalPrice)}`)
      messageParts.push("")
    }

    if (regularLines.length > 0) {
      messageParts.push("PRODUCTOS NORMALES")
      messageParts.push(...regularLines)
      messageParts.push(
        `Subtotal productos normales: ${formatUSD(
          regularTotalPrice
        )} / Bs ${formatVES(regularTotalVES)}`
      )
      messageParts.push("")
    }

    messageParts.push("TOTAL")
    messageParts.push(`Total en divisas: ${formatUSD(totalUSD)}`)

    if (hasCombos) {
      messageParts.push(`Combos solo divisas: ${formatUSD(comboTotalPrice)}`)
    }

    if (hasRegularProducts) {
      messageParts.push(
        `Productos normales: ${formatUSD(regularTotalPrice)} / Bs ${formatVES(
          regularTotalVES
        )}`
      )
      messageParts.push("")
      messageParts.push(`Tasa usada: Bs ${formatVES(exchangeRate)}`)
      messageParts.push(sourceLine)
    }

    return encodeURIComponent(messageParts.join("\n"))
  }

  async function handleRegisterLocalOrder() {
    if (!canRegisterLocalOrder) return

    setIsSubmittingOrder(true)
    setOrderError(null)

    await new Promise((resolve) => requestAnimationFrame(resolve))

    try {
      const normalizedItems = items.map((item) => ({
        ...item,
        paymentMode: getItemPaymentMode(item),
      }))

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerName: customerName.trim() || "Cliente",
          tableNumber: tableNumber.trim(),
          orderType,
          customerNote: customerNote.trim(),
          items: normalizedItems,
          exchangeRate,
          exchangeSource,
          exchangeValueDate,
          totalUSD,
          totalCombosUSD: comboTotalPrice,
          totalRegularUSD: regularTotalPrice,
          totalRegularVES: regularTotalVES,
        }),
      })

      const data = await readApiResponse(response)

      if (!response.ok) {
        throw new Error(data.error || "No se pudo registrar el pedido")
      }

      const orderId = data.order?.id || "Pedido registrado"

      items.forEach((item) => {
        removeItem(item.id)
      })

      setLastCreatedOrderId(orderId)
      setCustomerName("")
      setTableNumber("")
      setCustomerNote("")
      setOrderType("Comer aquí")

      window.setTimeout(() => {
        setIsOrderModalOpen(false)
        setLastCreatedOrderId(null)
        setOrderError(null)
        onClose()
      }, 750)
    } catch (error) {
      setOrderError(
        error instanceof Error
          ? error.message
          : "No se pudo registrar el pedido"
      )
    } finally {
      setIsSubmittingOrder(false)
    }
  }

  function closeOrderModal() {
    if (isSubmittingOrder) return

    setIsOrderModalOpen(false)
    setLastCreatedOrderId(null)
    setOrderError(null)
  }

  function selectOrderType(type: OrderType) {
    setOrderType(type)

    if (type === "Para llevar") {
      setTableNumber("Para llevar")
    }

    if (type === "Comer aquí" && tableNumber === "Para llevar") {
      setTableNumber("")
    }
  }

  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${buildWhatsAppMessage()}`

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[90]">
      <button
        type="button"
        aria-label="Cerrar carrito"
        onClick={onClose}
        className="absolute inset-0 bg-[#220000]/45 backdrop-blur-sm"
      />

      <aside className="absolute right-0 top-0 flex h-full w-full max-w-xl flex-col overflow-hidden border-l-4 border-[#a00000] bg-[#fff7e8] text-[#220000] shadow-2xl shadow-black/40 sm:w-[92%]">
        <div className="h-5 shrink-0 bg-[linear-gradient(45deg,#a00000_25%,transparent_25%),linear-gradient(-45deg,#a00000_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#a00000_75%),linear-gradient(-45deg,transparent_75%,#a00000_75%)] bg-[length:32px_32px] bg-[position:0_0,0_16px,16px_-16px_0] bg-[#fff7e8]" />

        <div className="relative shrink-0 overflow-hidden border-b-4 border-[#a00000] bg-white px-5 py-5 sm:px-8">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,211,0,0.32),transparent_42%)]" />

          <div className="relative flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-[0.35em] text-[#a00000]">
                Santo Perrito
              </p>

              <div className="mt-2 flex min-w-0 items-center gap-3">
                <ShoppingCart className="shrink-0 text-[#a00000]" size={32} />

                <h2 className="pb-1 text-[2.35rem] font-black uppercase leading-[1.02] text-[#a00000] drop-shadow-[0_4px_0_rgba(255,211,0,0.75)] sm:text-5xl">
                  Tu pedido
                </h2>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar carrito"
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-[#a00000] bg-yellow-300 text-[#4a0000] shadow-[0_5px_0_rgba(160,0,0,0.18)] transition hover:scale-105"
            >
              <X size={28} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-8">
          {!hasItems ? (
            <div className="flex min-h-[calc(100vh-210px)] flex-col items-center justify-center rounded-[2rem] border-2 border-[#a00000] bg-white px-6 py-12 text-center shadow-[0_10px_0_rgba(160,0,0,0.12)]">
              <img
                src="/logoremovebg.png"
                alt="Santo Perrito"
                className="mb-6 h-44 w-44 object-contain drop-shadow-[0_16px_18px_rgba(160,0,0,0.16)] sm:h-52 sm:w-52"
              />

              <h3 className="text-3xl font-black uppercase leading-tight text-[#a00000] drop-shadow-[0_3px_0_rgba(255,211,0,0.75)]">
                Tu carrito está vacío
              </h3>

              <p className="mt-4 max-w-sm text-sm font-bold leading-6 text-[#3a0000]/75">
                Agrega productos del menú para preparar tu pedido.
              </p>

              <a
                href="#menu"
                onClick={onClose}
                className="mt-7 inline-flex items-center justify-center rounded-full border-2 border-[#a00000] bg-yellow-300 px-7 py-4 text-sm font-black uppercase tracking-[0.12em] text-[#4a0000] shadow-[0_6px_0_rgba(160,0,0,0.18)] transition hover:scale-105"
              >
                Ver menú
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => {
                const itemSubtotal = item.price * item.quantity
                const itemSubtotalVES = itemSubtotal * exchangeRate
                const isCombo = isComboItem(item)
                const canUseNotes = item.category !== "Bebidas"

                return (
                  <article
                    key={item.id}
                    className="overflow-hidden rounded-[1.6rem] border-2 border-[#a00000] bg-white shadow-[0_7px_0_rgba(160,0,0,0.12)]"
                  >
                    <div className="grid grid-cols-[96px_1fr] gap-4 p-4">
                      <div className="h-24 w-24 overflow-hidden rounded-[1.2rem] border-2 border-[#a00000]/25 bg-[#fff7e8]">
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
                            <p className="text-[0.65rem] font-black uppercase tracking-[0.25em] text-[#a00000]">
                              {item.category}
                            </p>

                            <h3 className="mt-1 text-xl font-black uppercase leading-tight text-[#220000]">
                              {item.name}
                            </h3>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            aria-label={`Eliminar ${item.name}`}
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-[#a00000] bg-white text-[#a00000] transition hover:bg-[#a00000] hover:text-white"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>

                        <div className="mt-4 flex items-center justify-between gap-3">
                          <div className="flex items-center rounded-full border-2 border-[#a00000] bg-[#fff7e8] p-1">
                            <button
                              type="button"
                              onClick={() => decreaseQuantity(item.id)}
                              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#a00000] text-white transition hover:scale-105"
                              aria-label="Disminuir cantidad"
                            >
                              <Minus size={17} />
                            </button>

                            <span className="min-w-10 text-center text-base font-black text-[#220000]">
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
                            <p className="text-xl font-black text-[#a00000]">
                              {formatUSD(itemSubtotal)}
                            </p>

                            {isCombo ? (
                              <p className="mt-1 text-[0.65rem] font-black uppercase tracking-[0.08em] text-[#a00000]">
                                Solo divisas
                              </p>
                            ) : (
                              <p className="mt-1 text-xs font-black text-[#3a0000]/65">
                                Bs {formatVES(itemSubtotalVES)}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {canUseNotes && updateItemNote && updateItemNoteEnabled && (
                      <div className="border-t-2 border-[#a00000]/15 bg-[#fff7e8] px-4 py-4">
                        <label className="flex items-center gap-3 text-sm font-black uppercase tracking-[0.08em] text-[#a00000]">
                          <input
                            type="checkbox"
                            checked={Boolean(item.noteEnabled)}
                            onChange={(event) =>
                              updateItemNoteEnabled(
                                item.id,
                                event.target.checked
                              )
                            }
                            className="h-5 w-5 accent-[#a00000]"
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
                            className="mt-3 min-h-20 w-full resize-none rounded-2xl border-2 border-[#a00000]/25 bg-white px-4 py-3 text-sm font-bold text-[#4a0000] outline-none placeholder:text-[#4a0000]/45 focus:border-[#a00000]"
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

        {hasItems && (
          <div className="shrink-0 border-t-4 border-[#a00000] bg-white px-4 py-2.5 sm:px-6">
            <div className="rounded-[1.05rem] border-2 border-[#a00000] bg-[#fff7e8] px-3.5 py-2.5 shadow-[0_4px_0_rgba(160,0,0,0.12)]">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[0.64rem] font-black uppercase tracking-[0.16em] text-[#a00000]">
                    Total a cobrar
                  </p>
                  <p className="text-[0.68rem] font-black leading-4 text-[#3a0000]/60">
                    Total general en divisas
                  </p>
                </div>

                <p className="shrink-0 text-[1.75rem] font-black leading-none text-[#a00000] drop-shadow-[0_3px_0_rgba(255,211,0,0.75)]">
                  {formatUSD(totalUSD)}
                </p>
              </div>

              {hasCombos && hasRegularProducts ? (
                <div className="mt-2 grid grid-cols-2 overflow-hidden rounded-[1rem] border border-[#a00000]/20 bg-white">
                  <div className="border-r border-[#a00000]/15 px-3 py-2">
                    <p className="text-[0.6rem] font-black uppercase tracking-[0.1em] text-[#a00000]">
                      Combos
                    </p>

                    <strong className="block text-sm font-black leading-5 text-[#220000]">
                      {formatUSD(comboTotalPrice)}
                    </strong>

                    <p className="text-[0.6rem] font-bold leading-3 text-[#3a0000]/55">
                      Solo divisas
                    </p>
                  </div>

                  <div className="px-3 py-2">
                    <p className="text-[0.6rem] font-black uppercase tracking-[0.1em] text-[#a00000]">
                      Normales
                    </p>

                    <strong className="block text-sm font-black leading-5 text-[#220000]">
                      {formatUSD(regularTotalPrice)}
                    </strong>

                    <p className="text-[0.6rem] font-bold leading-3 text-[#3a0000]/55">
                      Bs {formatVES(regularTotalVES)}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="mt-2 rounded-[1rem] border border-[#a00000]/20 bg-white px-3 py-2">
                  {hasCombos && (
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[0.62rem] font-black uppercase tracking-[0.1em] text-[#a00000]">
                          Combos
                        </p>

                        <p className="text-[0.62rem] font-bold text-[#3a0000]/55">
                          Pago solo en divisas
                        </p>
                      </div>

                      <strong className="shrink-0 text-sm font-black text-[#220000]">
                        {formatUSD(comboTotalPrice)}
                      </strong>
                    </div>
                  )}

                  {hasRegularProducts && (
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[0.62rem] font-black uppercase tracking-[0.1em] text-[#a00000]">
                          Productos normales
                        </p>

                        <p className="text-[0.62rem] font-bold leading-4 text-[#3a0000]/55">
                          {formatUSD(regularTotalPrice)} · Ref. Bs{" "}
                          {formatVES(regularTotalVES)}
                        </p>
                      </div>

                      <strong className="shrink-0 text-sm font-black text-[#220000]">
                        {formatUSD(regularTotalPrice)}
                      </strong>
                    </div>
                  )}
                </div>
              )}

              {hasRegularProducts && (
                <div className="mt-1.5 flex items-center justify-between gap-3 rounded-[1rem] border border-[#a00000]/20 bg-white/70 px-3 py-1.5">
                  <div className="min-w-0">
                    <p className="inline-flex items-center gap-1 text-[0.58rem] font-black uppercase tracking-[0.1em] text-[#a00000]">
                      {isOfficialBcv ? (
                        <BadgeCheck size={11} />
                      ) : (
                        <AlertTriangle size={11} />
                      )}
                      Tasa {sourceLabel}
                    </p>

                    {exchangeValueDate && (
                      <p className="text-[0.58rem] font-bold leading-3 text-[#3a0000]/55">
                        {exchangeValueDate}
                      </p>
                    )}
                  </div>

                  <strong className="shrink-0 text-sm font-black text-[#220000]">
                    Bs {formatVES(exchangeRate)}
                  </strong>
                </div>
              )}

              {exchangeWarning && hasRegularProducts && (
                <div className="mt-1.5 rounded-xl border border-orange-400/35 bg-orange-100 px-3 py-1.5">
                  <p className="text-[0.62rem] font-bold leading-4 text-[#7a2e00]">
                    {exchangeWarning}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-2 grid gap-2">
              <button
                type="button"
                onClick={() => setIsOrderModalOpen(true)}
                className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-[#a00000] bg-yellow-300 px-5 py-2.5 text-xs font-black uppercase tracking-[0.12em] text-[#4a0000] shadow-[0_4px_0_rgba(160,0,0,0.18)] transition hover:bg-yellow-200 active:translate-y-1 active:shadow-none"
              >
                <Store size={17} />
                Registrar pedido local
              </button>

              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-[#a00000] bg-[#a00000] px-5 py-2.5 text-xs font-black uppercase tracking-[0.12em] text-white shadow-[0_4px_0_rgba(160,0,0,0.18)] transition hover:bg-yellow-300 hover:text-[#4a0000] active:translate-y-1 active:shadow-none"
              >
                <MessageCircle size={17} />
                Enviar por WhatsApp
              </a>
            </div>
          </div>
        )}
      </aside>

      {isOrderModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-end justify-center bg-[#220000]/60 px-4 py-4 backdrop-blur-sm sm:items-center">
          <div className="max-h-[94vh] w-full max-w-lg overflow-y-auto rounded-[2rem] border-4 border-[#a00000] bg-[#fff7e8] text-[#220000] shadow-2xl shadow-black/45">
            <div className="h-5 bg-[linear-gradient(45deg,#a00000_25%,transparent_25%),linear-gradient(-45deg,#a00000_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#a00000_75%),linear-gradient(-45deg,transparent_75%,#a00000_75%)] bg-[length:32px_32px] bg-[position:0_0,0_16px,16px_-16px_0] bg-[#fff7e8]" />

            <div className="relative bg-white px-6 py-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.28em] text-[#a00000]">
                    Pedido en el local
                  </p>

                  <h3 className="mt-2 text-3xl font-black uppercase leading-none text-[#a00000] drop-shadow-[0_3px_0_rgba(255,211,0,0.75)]">
                    Identificar pedido
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={closeOrderModal}
                  disabled={isSubmittingOrder}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-[#a00000] bg-yellow-300 text-[#4a0000] disabled:opacity-50"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {lastCreatedOrderId ? (
              <div className="px-6 py-8 text-center">
                <CheckCircle2
                  size={58}
                  className="mx-auto text-[#a00000]"
                  strokeWidth={2.2}
                />

                <p className="mt-5 text-sm font-black uppercase tracking-[0.24em] text-[#a00000]">
                  Pedido registrado
                </p>

                <h4 className="mt-2 text-3xl font-black text-[#220000]">
                  Listo para preparar
                </h4>

                <p className="mx-auto mt-4 max-w-sm text-sm font-bold leading-6 text-[#3a0000]/75">
                  El pedido fue enviado al panel interno del local.
                </p>

                <p className="mt-3 text-[0.7rem] font-black uppercase tracking-[0.16em] text-[#a00000]/70">
                  Referencia interna: {lastCreatedOrderId}
                </p>

                <p className="mt-5 text-xs font-black uppercase tracking-[0.16em] text-[#3a0000]/60">
                  Cerrando para seguir vendiendo...
                </p>
              </div>
            ) : isSubmittingOrder ? (
              <div className="px-6 py-12 text-center">
                <Loader2
                  size={58}
                  className="mx-auto animate-spin text-[#a00000]"
                />

                <p className="mt-6 text-sm font-black uppercase tracking-[0.24em] text-[#a00000]">
                  Enviando pedido
                </p>

                <h4 className="mt-2 text-3xl font-black uppercase leading-tight text-[#220000]">
                  Registrando en el panel
                </h4>

                <p className="mx-auto mt-4 max-w-sm text-sm font-bold leading-6 text-[#3a0000]/75">
                  Espera un momento. El pedido se está guardando para el local.
                </p>
              </div>
            ) : (
              <div className="space-y-4 px-6 py-6">
                <div>
                  <label className="text-xs font-black uppercase tracking-[0.18em] text-[#a00000]">
                    Nombre del cliente opcional
                  </label>

                  <input
                    value={customerName}
                    onChange={(event) => setCustomerName(event.target.value)}
                    placeholder="Ejemplo: Carlos"
                    className="mt-2 w-full rounded-2xl border-2 border-[#a00000]/25 bg-white px-4 py-4 text-base font-bold text-[#4a0000] outline-none placeholder:text-[#4a0000]/45 focus:border-[#a00000]"
                  />
                </div>

                <div>
                  <label className="text-xs font-black uppercase tracking-[0.18em] text-[#a00000]">
                    Mesa o ubicación
                  </label>

                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {quickPlaces.map((place) => (
                      <button
                        key={place}
                        type="button"
                        onClick={() => {
                          setTableNumber(place)
                          setOrderType("Comer aquí")
                        }}
                        className={`rounded-xl border-2 px-3 py-3 text-xs font-black uppercase transition ${
                          tableNumber === place
                            ? "border-[#a00000] bg-yellow-300 text-[#4a0000]"
                            : "border-[#a00000] bg-white text-[#a00000]"
                        }`}
                      >
                        {place}
                      </button>
                    ))}
                  </div>

                  <input
                    value={tableNumber}
                    onChange={(event) => setTableNumber(event.target.value)}
                    placeholder="O escribe otra ubicación..."
                    className="mt-3 w-full rounded-2xl border-2 border-[#a00000]/25 bg-white px-4 py-4 text-base font-bold text-[#4a0000] outline-none placeholder:text-[#4a0000]/45 focus:border-[#a00000]"
                  />

                  <p className="mt-2 text-[0.68rem] font-bold text-[#3a0000]/55">
                    Las mesas y ubicaciones se administran desde el panel del
                    local.
                  </p>
                </div>

                <div>
                  <label className="text-xs font-black uppercase tracking-[0.18em] text-[#a00000]">
                    Tipo de pedido
                  </label>

                  <div className="mt-2 grid grid-cols-2 gap-3">
                    {(["Comer aquí", "Para llevar"] as OrderType[]).map(
                      (type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => selectOrderType(type)}
                          className={`rounded-2xl border-2 px-4 py-4 text-sm font-black uppercase transition ${
                            orderType === type
                              ? "border-[#a00000] bg-yellow-300 text-[#4a0000]"
                              : "border-[#a00000] bg-white text-[#a00000]"
                          }`}
                        >
                          {type}
                        </button>
                      )
                    )}
                  </div>
                </div>

                <div className="rounded-2xl border-2 border-[#a00000]/25 bg-white px-4 py-3">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-[#a00000]">
                    Resumen de cobro
                  </p>

                  <div className="mt-3 space-y-2 text-sm font-black text-[#220000]">
                    {hasCombos && (
                      <p>
                        Combos solo divisas:{" "}
                        <span className="text-[#a00000]">
                          {formatUSD(comboTotalPrice)}
                        </span>
                      </p>
                    )}

                    {hasRegularProducts && (
                      <p>
                        Productos normales:{" "}
                        <span className="text-[#a00000]">
                          {formatUSD(regularTotalPrice)}
                        </span>{" "}
                        / Bs {formatVES(regularTotalVES)}
                      </p>
                    )}

                    <p>
                      Total en divisas:{" "}
                      <span className="text-[#a00000]">
                        {formatUSD(totalUSD)}
                      </span>
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-black uppercase tracking-[0.18em] text-[#a00000]">
                    Nota general opcional
                  </label>

                  <textarea
                    value={customerNote}
                    onChange={(event) => setCustomerNote(event.target.value)}
                    placeholder="Ejemplo: cliente espera afuera, entregar rápido..."
                    className="mt-2 min-h-20 w-full resize-none rounded-2xl border-2 border-[#a00000]/25 bg-white px-4 py-4 text-base font-bold text-[#4a0000] outline-none placeholder:text-[#4a0000]/45 focus:border-[#a00000]"
                  />
                </div>

                {orderError && (
                  <div className="rounded-2xl border-2 border-red-500/35 bg-red-100 px-4 py-3">
                    <p className="text-sm font-bold leading-6 text-red-800">
                      {orderError}
                    </p>
                  </div>
                )}

                <button
                  type="button"
                  disabled={!canRegisterLocalOrder}
                  onClick={handleRegisterLocalOrder}
                  className={`mt-2 flex w-full items-center justify-center gap-3 rounded-full border-2 px-6 py-4 text-sm font-black uppercase tracking-[0.12em] shadow-[0_6px_0_rgba(160,0,0,0.18)] transition active:translate-y-1 active:shadow-none ${
                    canRegisterLocalOrder
                      ? "border-[#a00000] bg-yellow-300 text-[#4a0000]"
                      : "border-[#a00000]/15 bg-[#ddd3c4] text-[#3a0000]/35"
                  }`}
                >
                  <ClipboardList size={21} />
                  Registrar pedido
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}