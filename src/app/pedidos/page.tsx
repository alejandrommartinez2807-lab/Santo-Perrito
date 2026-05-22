"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import {
  AlertTriangle,
  ArrowLeft,
  BellRing,
  CheckCircle2,
  Clock,
  CookingPot,
  Eye,
  EyeOff,
  Loader2,
  LogIn,
  MapPin,
  PackageCheck,
  Plus,
  RefreshCw,
  Trash2,
  X,
  XCircle,
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

type OrderStatus = "Nuevo" | "Preparando" | "Listo" | "Entregado" | "Cancelado"
type StatusFilter = OrderStatus | "Activos" | "Todos"

type LocalOrder = {
  rowNumber?: number
  id: string
  createdAt: string
  customerName: string
  tableNumber: string
  orderType: "Comer aquí" | "Para llevar"
  customerNote: string
  items: CartItem[]
  itemsText: string

  totalPrice: number
  totalVES: number

  totalUSD?: number
  totalCombosUSD?: number
  totalRegularUSD?: number
  totalRegularVES?: number

  exchangeRate: number
  exchangeSource?: string
  exchangeValueDate?: string
  status: OrderStatus
}

type ProductSold = {
  name: string
  quantity: number
  totalUSD: number
  totalVES: number
  onlyCurrency: boolean
}

type NewOrderToast = {
  id: string
  number: string
  customerName: string
  tableNumber: string
  totalUSD: number
}

const ADMIN_STORAGE_KEY = "santo_perrito_owner_session"
const LOCATIONS_STORAGE_KEY = "santo_perrito_order_locations"

const DEFAULT_ORDER_LOCATIONS = [
  "Mesa 1",
  "Mesa 2",
  "Mesa 3",
  "Mesa 4",
  "Barra",
  "Afuera",
]

const filterOptions: StatusFilter[] = [
  "Activos",
  "Nuevo",
  "Preparando",
  "Listo",
  "Entregado",
  "Cancelado",
  "Todos",
]

function isComboItem(item: CartItem) {
  return item.paymentMode === "divisa" || item.category === "Combos"
}

function getOrderTotals(order: LocalOrder) {
  const exchangeRate = Number(order.exchangeRate || 0)

  const fallback = order.items.reduce(
    (totals, item) => {
      const subtotal = Number(item.price || 0) * Number(item.quantity || 0)

      if (isComboItem(item)) {
        totals.totalCombosUSD += subtotal
      } else {
        totals.totalRegularUSD += subtotal
      }

      totals.totalUSD += subtotal

      return totals
    },
    {
      totalUSD: 0,
      totalCombosUSD: 0,
      totalRegularUSD: 0,
      totalRegularVES: 0,
    }
  )

  fallback.totalRegularVES = fallback.totalRegularUSD * exchangeRate

  const totalUSD = Number(order.totalUSD ?? order.totalPrice ?? fallback.totalUSD)
  const totalCombosUSD = Number(order.totalCombosUSD ?? fallback.totalCombosUSD)
  const totalRegularUSD = Number(order.totalRegularUSD ?? fallback.totalRegularUSD)
  const totalRegularVES = Number(order.totalRegularVES ?? order.totalVES ?? fallback.totalRegularVES)

  return {
    totalUSD,
    totalCombosUSD,
    totalRegularUSD,
    totalRegularVES,
  }
}

async function readApiResponse(response: Response) {
  const text = await response.text()

  try {
    return JSON.parse(text)
  } catch {
    throw new Error(
      "El servidor respondió con una página HTML en vez de datos. Revisa que la API de pedidos y el Apps Script estén funcionando correctamente."
    )
  }
}

function formatDate(value: string) {
  try {
    return new Intl.DateTimeFormat("es-VE", {
      dateStyle: "short",
      timeStyle: "short",
      timeZone: "America/Caracas",
    }).format(new Date(value))
  } catch {
    return value
  }
}

function getDateKeyInCaracas(value: string | Date) {
  const date = typeof value === "string" ? new Date(value) : value

  if (Number.isNaN(date.getTime())) {
    return ""
  }

  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Caracas",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date)

  const year = parts.find((part) => part.type === "year")?.value || "0000"
  const month = parts.find((part) => part.type === "month")?.value || "00"
  const day = parts.find((part) => part.type === "day")?.value || "00"

  return `${year}-${month}-${day}`
}

function formatCaracasLongDate(value: Date) {
  try {
    return new Intl.DateTimeFormat("es-VE", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
      timeZone: "America/Caracas",
    }).format(value)
  } catch {
    return "Hoy"
  }
}

function getDisplayOrderNumber(order: LocalOrder) {
  if (order.rowNumber && order.rowNumber > 1) {
    return `#${String(order.rowNumber - 1).padStart(2, "0")}`
  }

  const parts = order.id.split("-")
  const lastPart = parts[parts.length - 1] || order.id

  return `#${lastPart.slice(-3)}`
}

function getStatusStyle(status: OrderStatus) {
  if (status === "Nuevo") return "bg-red-500 text-white"
  if (status === "Preparando") return "bg-orange-400 text-[#3a0000]"
  if (status === "Listo") return "bg-yellow-300 text-[#3a0000]"
  if (status === "Entregado") return "bg-green-500 text-white"

  return "bg-[#220000] text-white"
}

function getStatusIcon(status: OrderStatus) {
  if (status === "Nuevo") return <Clock size={16} />
  if (status === "Preparando") return <CookingPot size={16} />
  if (status === "Listo") return <PackageCheck size={16} />
  if (status === "Entregado") return <CheckCircle2 size={16} />

  return <XCircle size={16} />
}

function getPrimaryAction(status: OrderStatus):
  | {
      label: string
      nextStatus: OrderStatus
      className: string
    }
  | undefined {
  if (status === "Nuevo") {
    return {
      label: "Preparar",
      nextStatus: "Preparando",
      className: "bg-orange-400 text-[#3a0000] hover:bg-orange-300",
    }
  }

  if (status === "Preparando") {
    return {
      label: "Marcar listo",
      nextStatus: "Listo",
      className: "bg-yellow-300 text-[#3a0000] hover:bg-yellow-200",
    }
  }

  if (status === "Listo") {
    return {
      label: "Entregado",
      nextStatus: "Entregado",
      className: "bg-green-500 text-white hover:bg-green-400",
    }
  }

  return undefined
}

function shouldShowAsActive(order: LocalOrder) {
  return order.status !== "Entregado" && order.status !== "Cancelado"
}

function playNotificationSound() {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext

    if (!AudioContextClass) return

    const audioContext = new AudioContextClass()

    const playBeep = (frequency: number, startTime: number) => {
      const oscillator = audioContext.createOscillator()
      const gain = audioContext.createGain()

      oscillator.type = "sine"
      oscillator.frequency.value = frequency
      gain.gain.value = 0.08

      oscillator.connect(gain)
      gain.connect(audioContext.destination)

      oscillator.start(audioContext.currentTime + startTime)
      oscillator.stop(audioContext.currentTime + startTime + 0.16)
    }

    playBeep(880, 0)
    playBeep(1040, 0.2)
    playBeep(880, 0.4)
  } catch {
    // Algunos navegadores bloquean sonido automático.
  }
}

function getProductsSoldFromOrders(orders: LocalOrder[]) {
  const productMap = new Map<string, ProductSold>()

  orders.forEach((order) => {
    order.items.forEach((item) => {
      const subtotalUSD = Number(item.price || 0) * Number(item.quantity || 0)
      const onlyCurrency = isComboItem(item)
      const subtotalVES = onlyCurrency ? 0 : subtotalUSD * Number(order.exchangeRate || 0)

      const current = productMap.get(item.name) || {
        name: item.name,
        quantity: 0,
        totalUSD: 0,
        totalVES: 0,
        onlyCurrency,
      }

      current.quantity += item.quantity
      current.totalUSD += subtotalUSD
      current.totalVES += subtotalVES
      current.onlyCurrency = current.onlyCurrency && onlyCurrency

      productMap.set(item.name, current)
    })
  })

  return Array.from(productMap.values()).sort(
    (a, b) => b.quantity - a.quantity
  )
}

export default function PedidosPage() {
  const [adminPassword, setAdminPassword] = useState("")
  const [passwordInput, setPasswordInput] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [orders, setOrders] = useState<LocalOrder[]>([])
  const [activeFilter, setActiveFilter] = useState<StatusFilter>("Activos")
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [highlightedIds, setHighlightedIds] = useState<string[]>([])
  const [newOrderToast, setNewOrderToast] = useState<NewOrderToast | null>(null)
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false)
  const [closeSummaryMessage, setCloseSummaryMessage] = useState<string | null>(
    null
  )
  const [isResetModalOpen, setIsResetModalOpen] = useState(false)
  const [resetConfirmationText, setResetConfirmationText] = useState("")
  const [isResettingDay, setIsResettingDay] = useState(false)
  const [isLocationsModalOpen, setIsLocationsModalOpen] = useState(false)
  const [orderLocations, setOrderLocations] = useState<string[]>(
    DEFAULT_ORDER_LOCATIONS
  )
  const [newLocationName, setNewLocationName] = useState("")
  const [locationsMessage, setLocationsMessage] = useState<string | null>(null)

  const knownOrderIdsRef = useRef<Set<string>>(new Set())
  const hasLoadedOnceRef = useRef(false)
  const pendingStatusRef = useRef<Map<string, OrderStatus>>(new Map())

  const isLoggedIn = adminPassword.length > 0

  function saveOrderLocations(nextLocations: string[], message?: string) {
    const cleanLocations = Array.from(
      new Set(
        nextLocations
          .map((location) => location.trim())
          .filter(Boolean)
      )
    )

    const finalLocations = cleanLocations.length > 0 ? cleanLocations : DEFAULT_ORDER_LOCATIONS

    setOrderLocations(finalLocations)
    window.localStorage.setItem(
      LOCATIONS_STORAGE_KEY,
      JSON.stringify(finalLocations)
    )
    setLocationsMessage(message || "Ubicaciones actualizadas correctamente.")
  }

  function addOrderLocation() {
    const nextLocation = newLocationName.trim()

    if (!nextLocation) {
      setLocationsMessage("Escribe el nombre de la mesa o ubicación.")
      return
    }

    const alreadyExists = orderLocations.some(
      (location) => location.toLowerCase() === nextLocation.toLowerCase()
    )

    if (alreadyExists) {
      setLocationsMessage("Esa ubicación ya existe.")
      return
    }

    saveOrderLocations(
      [...orderLocations, nextLocation],
      "Ubicación agregada correctamente."
    )
    setNewLocationName("")
  }

  function removeOrderLocation(locationToRemove: string) {
    if (orderLocations.length <= 1) {
      setLocationsMessage("Debe quedar al menos una ubicación disponible.")
      return
    }

    saveOrderLocations(
      orderLocations.filter((location) => location !== locationToRemove),
      "Ubicación eliminada correctamente."
    )
  }

  function restoreDefaultOrderLocations() {
    saveOrderLocations(
      DEFAULT_ORDER_LOCATIONS,
      "Ubicaciones restauradas correctamente."
    )
    setNewLocationName("")
  }

  async function loadOrders(password = adminPassword, silent = false) {
    if (!password) return

    if (!silent) {
      setIsLoading(true)
    }

    setErrorMessage(null)

    try {
      const response = await fetch("/api/orders", {
        headers: {
          "x-admin-password": password,
        },
        cache: "no-store",
      })

      const data = await readApiResponse(response)

      if (!response.ok) {
        throw new Error(data.error || "No se pudieron cargar los pedidos")
      }

      let nextOrders: LocalOrder[] = data.orders || []

      nextOrders = nextOrders.map((order) => {
        const pendingStatus = pendingStatusRef.current.get(order.id)

        if (!pendingStatus) return order

        return {
          ...order,
          status: pendingStatus,
        }
      })

      if (hasLoadedOnceRef.current) {
        const currentIds = knownOrderIdsRef.current
        const newOrders = nextOrders.filter(
          (order) => order.status === "Nuevo" && !currentIds.has(order.id)
        )

        if (newOrders.length > 0) {
          const newIds = newOrders.map((order) => order.id)
          const newestOrder = newOrders[0]
          const newestOrderTotals = getOrderTotals(newestOrder)

          setHighlightedIds(newIds)
          setNewOrderToast({
            id: newestOrder.id,
            number: getDisplayOrderNumber(newestOrder),
            customerName: newestOrder.customerName || "Cliente",
            tableNumber: newestOrder.tableNumber || "Sin ubicación",
            totalUSD: newestOrderTotals.totalUSD,
          })
          playNotificationSound()

          window.setTimeout(() => {
            setHighlightedIds([])
      setNewOrderToast(null)
          }, 12000)

          window.setTimeout(() => {
            setNewOrderToast((currentToast) =>
              currentToast?.id === newestOrder.id ? null : currentToast
            )
          }, 10000)
        }
      }

      knownOrderIdsRef.current = new Set(nextOrders.map((order) => order.id))
      hasLoadedOnceRef.current = true

      setOrders(nextOrders)
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "No se pudieron cargar los pedidos"
      )
    } finally {
      if (!silent) {
        setIsLoading(false)
      }
    }
  }

  function handleLogin() {
    const password = passwordInput.trim()

    if (!password) return

    window.sessionStorage.setItem(ADMIN_STORAGE_KEY, password)
    setAdminPassword(password)
    loadOrders(password)
  }

  function handleLogout() {
    window.sessionStorage.removeItem(ADMIN_STORAGE_KEY)
    setAdminPassword("")
    setPasswordInput("")
    setOrders([])
    setErrorMessage(null)
    knownOrderIdsRef.current = new Set()
    hasLoadedOnceRef.current = false
    pendingStatusRef.current = new Map()
  }

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
        setOrderLocations(cleanLocations)
      }
    } catch {
      setOrderLocations(DEFAULT_ORDER_LOCATIONS)
    }
  }, [])

  useEffect(() => {
    const savedPassword = window.sessionStorage.getItem(ADMIN_STORAGE_KEY)

    if (savedPassword) {
      setAdminPassword(savedPassword)
      setPasswordInput(savedPassword)
      loadOrders(savedPassword)
    }
  }, [])

  useEffect(() => {
    if (!adminPassword) return

    const interval = window.setInterval(() => {
      loadOrders(adminPassword, true)
    }, 2500)

    return () => {
      window.clearInterval(interval)
    }
  }, [adminPassword])

  const filteredOrders = useMemo(() => {
    if (activeFilter === "Todos") return orders

    if (activeFilter === "Activos") {
      return orders.filter(shouldShowAsActive)
    }

    return orders.filter((order) => order.status === activeFilter)
  }, [orders, activeFilter])

  const activeOrders = orders.filter(shouldShowAsActive)
  const newOrdersCount = orders.filter((order) => order.status === "Nuevo").length
  const readyOrdersCount = orders.filter((order) => order.status === "Listo").length

  const totalRegistered = orders
    .filter((order) => order.status !== "Cancelado")
    .reduce((total, order) => total + getOrderTotals(order).totalUSD, 0)

  const dayStats = useMemo(() => {
    const today = new Date()
    const todayKey = getDateKeyInCaracas(today)
    const ordersToday = orders.filter(
      (order) => getDateKeyInCaracas(order.createdAt) === todayKey
    )

    const deliveredToday = ordersToday.filter(
      (order) => order.status === "Entregado"
    )

    const canceledToday = ordersToday.filter(
      (order) => order.status === "Cancelado"
    )

    const activeToday = ordersToday.filter(shouldShowAsActive)

    const deliveredTotals = deliveredToday.reduce(
      (totals, order) => {
        const orderTotals = getOrderTotals(order)

        totals.totalUSD += orderTotals.totalUSD
        totals.totalCombosUSD += orderTotals.totalCombosUSD
        totals.totalRegularUSD += orderTotals.totalRegularUSD
        totals.totalRegularVES += orderTotals.totalRegularVES

        return totals
      },
      {
        totalUSD: 0,
        totalCombosUSD: 0,
        totalRegularUSD: 0,
        totalRegularVES: 0,
      }
    )

    const activeTotals = activeToday.reduce(
      (totals, order) => {
        const orderTotals = getOrderTotals(order)

        totals.totalUSD += orderTotals.totalUSD
        totals.totalCombosUSD += orderTotals.totalCombosUSD
        totals.totalRegularUSD += orderTotals.totalRegularUSD
        totals.totalRegularVES += orderTotals.totalRegularVES

        return totals
      },
      {
        totalUSD: 0,
        totalCombosUSD: 0,
        totalRegularUSD: 0,
        totalRegularVES: 0,
      }
    )

    const productsSold = getProductsSoldFromOrders(deliveredToday)
    const topProduct = productsSold[0]

    return {
      dateLabel: formatCaracasLongDate(today),
      ordersToday,
      deliveredToday,
      canceledToday,
      activeToday,
      deliveredTotals,
      activeTotals,
      productsSold,
      topProduct,
    }
  }, [orders])

  const closeSummaryText = useMemo(() => {
    const productLines =
      dayStats.productsSold.length > 0
        ? dayStats.productsSold.map((product) => {
            if (product.onlyCurrency) {
              return `- ${product.name} x${product.quantity} | ${formatUSD(
                product.totalUSD
              )} | Solo divisas`
            }

            return `- ${product.name} x${product.quantity} | ${formatUSD(
              product.totalUSD
            )} | Bs ${formatVES(product.totalVES)}`
          })
        : ["- Sin productos entregados"]

    return [
      "CIERRE DEL DÍA - SANTO PERRITO",
      `Fecha: ${dayStats.dateLabel}`,
      "",
      `Pedidos registrados: ${dayStats.ordersToday.length}`,
      `Pedidos activos: ${dayStats.activeToday.length}`,
      `Pedidos entregados: ${dayStats.deliveredToday.length}`,
      `Pedidos cancelados: ${dayStats.canceledToday.length}`,
      "",
      "VENTAS CONFIRMADAS",
      `Total general en divisas: ${formatUSD(dayStats.deliveredTotals.totalUSD)}`,
      `Combos solo divisas: ${formatUSD(dayStats.deliveredTotals.totalCombosUSD)}`,
      `Productos normales: ${formatUSD(dayStats.deliveredTotals.totalRegularUSD)}`,
      `Referencia productos normales Bs: ${formatVES(
        dayStats.deliveredTotals.totalRegularVES
      )}`,
      "",
      "PENDIENTE POR ENTREGAR",
      `Total pendiente en divisas: ${formatUSD(dayStats.activeTotals.totalUSD)}`,
      `Combos pendientes solo divisas: ${formatUSD(
        dayStats.activeTotals.totalCombosUSD
      )}`,
      `Productos normales pendientes: ${formatUSD(
        dayStats.activeTotals.totalRegularUSD
      )}`,
      `Referencia productos normales pendientes Bs: ${formatVES(
        dayStats.activeTotals.totalRegularVES
      )}`,
      "",
      "Productos vendidos:",
      ...productLines,
    ].join("\n")
  }, [dayStats])

  async function copyCloseSummary() {
    try {
      await navigator.clipboard.writeText(closeSummaryText)
      setCloseSummaryMessage("Resumen copiado correctamente.")
    } catch {
      setCloseSummaryMessage("No se pudo copiar automáticamente.")
    }
  }

  async function resetDayOrders() {
    if (!adminPassword) return

    if (resetConfirmationText.trim().toUpperCase() !== "REINICIAR") {
      setErrorMessage("Debes escribir REINICIAR para confirmar el reinicio.")
      return
    }

    try {
      setIsResettingDay(true)
      setErrorMessage(null)

      const response = await fetch("/api/orders", {
        method: "DELETE",
        headers: {
          "x-admin-password": adminPassword,
        },
      })

      const data = await readApiResponse(response)

      if (!response.ok) {
        throw new Error(data.error || "No se pudieron reiniciar los pedidos")
      }

      pendingStatusRef.current = new Map()
      knownOrderIdsRef.current = new Set()
      hasLoadedOnceRef.current = false

      setOrders([])
      setHighlightedIds([])
      setNewOrderToast(null)
      setResetConfirmationText("")
      setIsResetModalOpen(false)
      setIsCloseModalOpen(false)
      setCloseSummaryMessage(
        data.message || "Pedidos reiniciados correctamente."
      )

      await loadOrders(adminPassword, true)
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "No se pudieron reiniciar los pedidos"
      )
    } finally {
      setIsResettingDay(false)
    }
  }

  async function updateStatus(orderId: string, status: OrderStatus) {
    if (!adminPassword) return

    const previousOrder = orders.find((order) => order.id === orderId)
    const requestedStatus = status

    setErrorMessage(null)
    pendingStatusRef.current.set(orderId, requestedStatus)

    setOrders((currentOrders) =>
      currentOrders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status: requestedStatus,
            }
          : order
      )
    )

    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": adminPassword,
        },
        body: JSON.stringify({
          status: requestedStatus,
        }),
      })

      const data = await readApiResponse(response)

      if (!response.ok) {
        throw new Error(data.error || "No se pudo actualizar el pedido")
      }

      window.setTimeout(() => {
        if (pendingStatusRef.current.get(orderId) === requestedStatus) {
          pendingStatusRef.current.delete(orderId)
        }

        loadOrders(adminPassword, true)
      }, 600)
    } catch (error) {
      pendingStatusRef.current.delete(orderId)

      if (previousOrder) {
        setOrders((currentOrders) =>
          currentOrders.map((order) =>
            order.id === orderId ? previousOrder : order
          )
        )
      }

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "No se pudo actualizar el pedido"
      )
    }
  }

  if (!isLoggedIn) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fff7e8] px-4 py-8 text-[#220000]">
        <div className="w-full max-w-md overflow-hidden rounded-[2rem] border-4 border-[#a00000] bg-white shadow-[0_12px_0_rgba(160,0,0,0.14)]">
          <div className="h-6 bg-[linear-gradient(45deg,#a00000_25%,transparent_25%),linear-gradient(-45deg,#a00000_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#a00000_75%),linear-gradient(-45deg,transparent_75%,#a00000_75%)] bg-[length:32px_32px] bg-[position:0_0,0_16px,16px_-16px,0] bg-[#fff7e8]" />

          <div className="px-6 py-6">
            <a
              href="/"
              className="inline-flex items-center gap-2 rounded-full border-2 border-[#a00000] bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-[#a00000]"
            >
              <ArrowLeft size={16} />
              Volver
            </a>

            <img
              src="/logoremovebg.png"
              alt="Santo Perrito"
              className="mx-auto mt-6 h-28 w-28 object-contain"
            />

            <p className="mt-5 text-center text-xs font-black uppercase tracking-[0.28em] text-[#a00000]">
              Acceso privado
            </p>

            <h1 className="mt-2 text-center text-4xl font-black uppercase leading-none text-[#a00000] drop-shadow-[0_3px_0_rgba(255,211,0,0.75)]">
              Panel del local
            </h1>

            <p className="mt-3 text-center text-sm font-bold leading-6 text-[#3a0000]/75">
              Ingresa la clave autorizada para gestionar los pedidos del negocio.
            </p>
          </div>

          <div className="space-y-4 px-6 pb-6">
            <div>
              <label className="text-xs font-black uppercase tracking-[0.18em] text-[#a00000]">
                Clave de acceso
              </label>

              <div className="relative mt-2">
                <input
                  type={showPassword ? "text" : "password"}
                  value={passwordInput}
                  onChange={(event) => setPasswordInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") handleLogin()
                  }}
                  placeholder="Ingresa la clave del local"
                  className="w-full rounded-2xl border-2 border-[#a00000]/25 bg-[#fff7e8] px-4 py-4 pr-12 text-base font-bold text-[#4a0000] outline-none placeholder:text-[#4a0000]/45 focus:border-[#a00000]"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl bg-[#a00000]/10 text-[#4a0000]"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {errorMessage && (
              <div className="rounded-2xl border-2 border-red-500/35 bg-red-100 px-4 py-3">
                <p className="text-sm font-bold leading-6 text-red-800">
                  {errorMessage}
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={handleLogin}
              className="flex w-full items-center justify-center gap-3 rounded-full border-2 border-[#a00000] bg-yellow-300 px-6 py-4 text-sm font-black uppercase tracking-[0.12em] text-[#4a0000] shadow-[0_6px_0_rgba(160,0,0,0.18)] transition hover:scale-[1.02]"
            >
              <LogIn size={21} />
              Entrar al panel
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#fff7e8] px-3 py-4 text-[#220000] sm:px-6 lg:px-8">
      {newOrderToast && (
        <div className="fixed right-4 top-4 z-[160] w-[calc(100%-2rem)] max-w-md overflow-hidden rounded-[1.5rem] border-4 border-red-600 bg-white shadow-2xl shadow-red-950/25">
          <div className="h-4 bg-[linear-gradient(45deg,#a00000_25%,transparent_25%),linear-gradient(-45deg,#a00000_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#a00000_75%),linear-gradient(-45deg,transparent_75%,#a00000_75%)] bg-[length:28px_28px] bg-[position:0_0,0_14px,14px_-14px,0] bg-[#fff7e8]" />

          <div className="flex items-start gap-3 bg-red-50 px-4 py-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-red-600 bg-yellow-300 text-red-700">
              <BellRing size={24} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-red-700">
                Nuevo pedido recibido
              </p>

              <h2 className="mt-1 text-2xl font-black uppercase leading-none text-[#a00000] drop-shadow-[0_2px_0_rgba(255,211,0,0.75)]">
                {newOrderToast.number} · {formatUSD(newOrderToast.totalUSD)}
              </h2>

              <p className="mt-2 text-sm font-black text-[#3a0000]/75">
                {newOrderToast.customerName} · {newOrderToast.tableNumber}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setNewOrderToast(null)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-red-600 bg-white text-red-700"
              aria-label="Cerrar notificación"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl">
        <header className="overflow-hidden rounded-[1.6rem] border-4 border-[#a00000] bg-white shadow-[0_10px_0_rgba(160,0,0,0.12)]">
          <div className="h-5 bg-[linear-gradient(45deg,#a00000_25%,transparent_25%),linear-gradient(-45deg,#a00000_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#a00000_75%),linear-gradient(-45deg,transparent_75%,#a00000_75%)] bg-[length:32px_32px] bg-[position:0_0,0_16px,16px_-16px,0] bg-[#fff7e8]" />

          <div className="p-4 sm:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex flex-wrap gap-2">
                  <a
                    href="/"
                    className="inline-flex items-center gap-2 rounded-full border-2 border-[#a00000] bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-[#a00000] transition hover:bg-yellow-100"
                  >
                    <ArrowLeft size={16} />
                    Menú
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      setCloseSummaryMessage(null)
                      setIsCloseModalOpen(true)
                    }}
                    className="inline-flex items-center gap-2 rounded-full border-2 border-[#a00000] bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-[#a00000] transition hover:bg-yellow-100"
                  >
                    <Clock size={16} />
                    Cierre del día
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setLocationsMessage(null)
                      setIsLocationsModalOpen(true)
                    }}
                    className="inline-flex items-center gap-2 rounded-full border-2 border-[#a00000] bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-[#a00000] transition hover:bg-yellow-100"
                  >
                    <MapPin size={16} />
                    Mesas / ubicaciones
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setResetConfirmationText("")
                      setIsResetModalOpen(true)
                    }}
                    className="inline-flex items-center gap-2 rounded-full border-2 border-red-600 bg-red-100 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-red-700 transition hover:bg-red-200"
                  >
                    <Trash2 size={16} />
                    Reiniciar día
                  </button>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="inline-flex items-center gap-2 rounded-full border-2 border-[#a00000] bg-yellow-300 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-[#4a0000] transition hover:bg-yellow-200"
                  >
                    Cerrar sesión
                  </button>
                </div>

                <p className="mt-4 text-xs font-black uppercase tracking-[0.32em] text-[#a00000]">
                  Santo Perrito
                </p>

                <h1 className="mt-1 text-4xl font-black uppercase leading-none text-[#a00000] drop-shadow-[0_3px_0_rgba(255,211,0,0.75)] sm:text-5xl">
                  Control de pedidos
                </h1>
              </div>

              <div className="grid gap-2 sm:grid-cols-4 lg:w-[650px]">
                <div className="rounded-[1.2rem] border-2 border-[#a00000] bg-[#fff7e8] p-3">
                  <p className="text-[0.62rem] font-black uppercase tracking-[0.16em] text-[#a00000]">
                    Activos
                  </p>
                  <p className="mt-1 text-3xl font-black">
                    {activeOrders.length}
                  </p>
                </div>

                <div
                  className={`rounded-[1.2rem] border-2 border-red-400 bg-red-50 p-3 ${
                    newOrdersCount > 0 ? "animate-pulse ring-4 ring-red-200" : ""
                  }`}
                >
                  <p className="text-[0.62rem] font-black uppercase tracking-[0.16em] text-red-700">
                    Nuevos
                  </p>
                  <p className="mt-1 text-3xl font-black text-red-700">
                    {newOrdersCount}
                  </p>
                </div>

                <div className="rounded-[1.2rem] border-2 border-yellow-400 bg-yellow-100 p-3">
                  <p className="text-[0.62rem] font-black uppercase tracking-[0.16em] text-[#8a5a00]">
                    Listos
                  </p>
                  <p className="mt-1 text-3xl font-black text-[#8a5a00]">
                    {readyOrdersCount}
                  </p>
                </div>

                <div className="rounded-[1.2rem] border-2 border-[#a00000] bg-white p-3">
                  <p className="text-[0.62rem] font-black uppercase tracking-[0.16em] text-[#a00000]">
                    Ventas
                  </p>
                  <p className="mt-1 text-2xl font-black">
                    {formatUSD(totalRegistered)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <section className="sticky top-0 z-30 mt-4 rounded-[1.4rem] border-2 border-[#a00000] bg-white p-3 shadow-[0_8px_0_rgba(160,0,0,0.10)]">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {filterOptions.map((status) => {
                const isActive = activeFilter === status

                return (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setActiveFilter(status)}
                    className={`shrink-0 rounded-full border-2 px-4 py-2.5 text-xs font-black uppercase transition ${
                      isActive
                        ? "border-[#a00000] bg-yellow-300 text-[#4a0000]"
                        : "border-[#a00000] bg-white text-[#a00000] hover:bg-yellow-100"
                    }`}
                  >
                    {status}
                  </button>
                )
              })}
            </div>

            <button
              type="button"
              onClick={() => loadOrders()}
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#a00000] bg-yellow-300 px-5 py-3 text-xs font-black uppercase text-[#4a0000] transition hover:scale-105"
            >
              {isLoading ? (
                <Loader2 size={17} className="animate-spin" />
              ) : (
                <RefreshCw size={17} />
              )}
              Actualizar
            </button>
          </div>

          {errorMessage && (
            <div className="mt-3 rounded-2xl border-2 border-red-500/35 bg-red-100 px-4 py-3">
              <p className="text-sm font-bold leading-6 text-red-800">
                {errorMessage}
              </p>
            </div>
          )}
        </section>

        {filteredOrders.length === 0 ? (
          <section className="mt-5 rounded-[2rem] border-2 border-[#a00000] bg-white px-6 py-14 text-center shadow-[0_8px_0_rgba(160,0,0,0.12)]">
            <img
              src="/logoremovebg.png"
              alt="Santo Perrito"
              className="mx-auto h-28 w-28 object-contain"
            />

            <h2 className="mt-5 text-3xl font-black uppercase text-[#a00000]">
              Sin pedidos pendientes
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm font-bold leading-6 text-[#3a0000]/70">
              Los pedidos nuevos aparecerán automáticamente en esta pantalla.
            </p>
          </section>
        ) : (
          <section className="mt-5 grid gap-4 xl:grid-cols-2">
            {filteredOrders.map((order) => {
              const primaryAction = getPrimaryAction(order.status)
              const isHighlighted = highlightedIds.includes(order.id)
              const orderTotals = getOrderTotals(order)
              const comboItems = order.items.filter(isComboItem)
              const regularItems = order.items.filter((item) => !isComboItem(item))

              return (
                <article
                  key={order.id}
                  className={`overflow-hidden rounded-[1.6rem] border-2 bg-white shadow-[0_8px_0_rgba(160,0,0,0.12)] transition ${
                    isHighlighted
                      ? "border-red-500 ring-4 ring-red-300"
                      : "border-[#a00000]"
                  }`}
                >
                  <div className="border-b-2 border-[#a00000] bg-[#fff7e8] px-4 py-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-4xl font-black leading-none text-[#a00000] drop-shadow-[0_3px_0_rgba(255,211,0,0.75)]">
                            {getDisplayOrderNumber(order)}
                          </p>

                          <span
                            className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-black uppercase ${getStatusStyle(
                              order.status
                            )}`}
                          >
                            {getStatusIcon(order.status)}
                            {order.status}
                          </span>
                        </div>

                        <p className="mt-2 text-xs font-bold text-[#3a0000]/70">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-3xl font-black leading-none text-[#220000]">
                          {formatUSD(orderTotals.totalUSD)}
                        </p>
                        {orderTotals.totalRegularVES > 0 && (
                          <p className="mt-1 text-xs font-black text-[#3a0000]/60">
                            Ref. normales Bs {formatVES(orderTotals.totalRegularVES)}
                          </p>
                        )}
                        {orderTotals.totalCombosUSD > 0 && (
                          <p className="mt-1 text-xs font-black uppercase text-[#a00000]">
                            Combos solo divisas
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="grid gap-2 sm:grid-cols-3">
                      <div className="rounded-2xl border-2 border-[#a00000]/25 bg-[#fff7e8] p-3">
                        <p className="text-[0.62rem] font-black uppercase tracking-[0.16em] text-[#a00000]">
                          Cliente
                        </p>
                        <p className="mt-1 text-lg font-black leading-tight">
                          {order.customerName || "Cliente"}
                        </p>
                      </div>

                      <div className="rounded-2xl border-2 border-[#a00000]/25 bg-[#fff7e8] p-3">
                        <p className="text-[0.62rem] font-black uppercase tracking-[0.16em] text-[#a00000]">
                          Mesa / lugar
                        </p>
                        <p className="mt-1 text-lg font-black leading-tight">
                          {order.tableNumber}
                        </p>
                      </div>

                      <div className="rounded-2xl border-2 border-[#a00000]/25 bg-[#fff7e8] p-3">
                        <p className="text-[0.62rem] font-black uppercase tracking-[0.16em] text-[#a00000]">
                          Tipo
                        </p>
                        <p className="mt-1 text-lg font-black leading-tight">
                          {order.orderType}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 rounded-[1.2rem] border-2 border-[#a00000]/25 bg-white p-3">
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-[#a00000]">
                        Productos
                      </p>

                      {comboItems.length > 0 && (
                        <div className="mt-3 rounded-2xl border-2 border-[#a00000]/20 bg-[#fff7e8] p-3">
                          <p className="text-[0.65rem] font-black uppercase tracking-[0.16em] text-[#a00000]">
                            Combos — solo divisas
                          </p>

                          <div className="mt-3 space-y-2">
                            {comboItems.map((item) => (
                              <div
                                key={`${order.id}-${item.id}-combo`}
                                className="flex items-start justify-between gap-3 border-b border-[#a00000]/15 pb-2 last:border-b-0 last:pb-0"
                              >
                                <div>
                                  <p className="text-base font-black uppercase leading-tight text-[#220000]">
                                    {item.name}{" "}
                                    <span className="text-[#a00000]">
                                      x{item.quantity}
                                    </span>
                                  </p>

                                  <p className="mt-1 text-xs font-black uppercase text-[#a00000]">
                                    Pago solo en divisas
                                  </p>

                                  {item.noteEnabled && item.note && (
                                    <p className="mt-1 text-sm font-bold text-[#3a0000]/65">
                                      Nota: {item.note}
                                    </p>
                                  )}
                                </div>

                                <p className="shrink-0 text-base font-black text-[#a00000]">
                                  {formatUSD(item.price * item.quantity)}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {regularItems.length > 0 && (
                        <div className="mt-3 rounded-2xl border-2 border-[#a00000]/20 bg-white p-3">
                          <p className="text-[0.65rem] font-black uppercase tracking-[0.16em] text-[#a00000]">
                            Productos normales
                          </p>

                          <div className="mt-3 space-y-2">
                            {regularItems.map((item) => {
                              const subtotalUSD = item.price * item.quantity
                              const subtotalVES = subtotalUSD * order.exchangeRate

                              return (
                                <div
                                  key={`${order.id}-${item.id}-regular`}
                                  className="flex items-start justify-between gap-3 border-b border-[#a00000]/15 pb-2 last:border-b-0 last:pb-0"
                                >
                                  <div>
                                    <p className="text-base font-black uppercase leading-tight text-[#220000]">
                                      {item.name}{" "}
                                      <span className="text-[#a00000]">
                                        x{item.quantity}
                                      </span>
                                    </p>

                                    <p className="mt-1 text-xs font-black text-[#3a0000]/65">
                                      Ref. Bs {formatVES(subtotalVES)}
                                    </p>

                                    {item.noteEnabled && item.note && (
                                      <p className="mt-1 text-sm font-bold text-[#3a0000]/65">
                                        Nota: {item.note}
                                      </p>
                                    )}
                                  </div>

                                  <p className="shrink-0 text-base font-black text-[#a00000]">
                                    {formatUSD(subtotalUSD)}
                                  </p>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-3 rounded-[1.2rem] border-2 border-[#a00000]/25 bg-[#fff7e8] p-3">
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-[#a00000]">
                        Resumen de cobro
                      </p>

                      <div className="mt-3 grid gap-2 text-sm font-black text-[#220000]">
                        {orderTotals.totalCombosUSD > 0 && (
                          <p>
                            Combos solo divisas:{" "}
                            <span className="text-[#a00000]">
                              {formatUSD(orderTotals.totalCombosUSD)}
                            </span>
                          </p>
                        )}

                        {orderTotals.totalRegularUSD > 0 && (
                          <p>
                            Productos normales:{" "}
                            <span className="text-[#a00000]">
                              {formatUSD(orderTotals.totalRegularUSD)}
                            </span>{" "}
                            / Bs {formatVES(orderTotals.totalRegularVES)}
                          </p>
                        )}

                        <p>
                          Total en divisas:{" "}
                          <span className="text-[#a00000]">
                            {formatUSD(orderTotals.totalUSD)}
                          </span>
                        </p>
                      </div>
                    </div>

                    {order.customerNote && (
                      <div className="mt-3 rounded-[1.2rem] border-2 border-yellow-400 bg-yellow-100 p-3">
                        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#a00000]">
                          Nota
                        </p>
                        <p className="mt-1 text-sm font-bold leading-5 text-[#3a0000]/80">
                          {order.customerNote}
                        </p>
                      </div>
                    )}

                    <div className="mt-4 grid gap-2 sm:grid-cols-[1fr_auto]">
                      {primaryAction ? (
                        <button
                          type="button"
                          onClick={() =>
                            updateStatus(order.id, primaryAction.nextStatus)
                          }
                          className={`flex items-center justify-center gap-2 rounded-2xl border-2 border-[#a00000] px-4 py-4 text-sm font-black uppercase shadow-[0_5px_0_rgba(160,0,0,0.14)] transition active:translate-y-1 active:shadow-none ${primaryAction.className}`}
                        >
                          {getStatusIcon(primaryAction.nextStatus)}
                          {primaryAction.label}
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => updateStatus(order.id, "Nuevo")}
                          className="flex items-center justify-center gap-2 rounded-2xl border-2 border-[#a00000] bg-white px-4 py-4 text-sm font-black uppercase text-[#a00000] transition hover:bg-yellow-100"
                        >
                          Reabrir
                        </button>
                      )}

                      {order.status !== "Cancelado" &&
                        order.status !== "Entregado" && (
                          <button
                            type="button"
                            onClick={() => updateStatus(order.id, "Cancelado")}
                            className="rounded-2xl border-2 border-[#a00000] bg-white px-4 py-4 text-sm font-black uppercase text-[#a00000] transition hover:bg-red-100"
                          >
                            Cancelar
                          </button>
                        )}
                    </div>
                  </div>
                </article>
              )
            })}
          </section>
        )}
      </div>

      {isCloseModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-end justify-center bg-[#220000]/60 px-4 py-4 backdrop-blur-sm sm:items-center">
          <div className="max-h-[94vh] w-full max-w-3xl overflow-y-auto rounded-[2rem] border-4 border-[#a00000] bg-[#fff7e8] text-[#220000] shadow-2xl shadow-black/45">
            <div className="h-5 bg-[linear-gradient(45deg,#a00000_25%,transparent_25%),linear-gradient(-45deg,#a00000_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#a00000_75%),linear-gradient(-45deg,transparent_75%,#a00000_75%)] bg-[length:32px_32px] bg-[position:0_0,0_16px,16px_-16px,0] bg-[#fff7e8]" />

            <div className="border-b-2 border-[#a00000] bg-white px-6 py-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.28em] text-[#a00000]">
                    Resumen operativo
                  </p>

                  <h2 className="mt-2 text-4xl font-black uppercase leading-none text-[#a00000] drop-shadow-[0_3px_0_rgba(255,211,0,0.75)]">
                    Cierre del día
                  </h2>

                  <p className="mt-3 text-sm font-bold text-[#3a0000]/70">
                    {dayStats.dateLabel}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsCloseModalOpen(false)}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-[#a00000] bg-yellow-300 text-[#4a0000]"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="space-y-4 px-6 py-6">
              <div className="grid gap-3 sm:grid-cols-4">
                <div className="rounded-2xl border-2 border-[#a00000] bg-white p-4">
                  <p className="text-[0.62rem] font-black uppercase tracking-[0.16em] text-[#a00000]">
                    Registrados
                  </p>
                  <p className="mt-2 text-3xl font-black">
                    {dayStats.ordersToday.length}
                  </p>
                </div>

                <div className="rounded-2xl border-2 border-[#a00000] bg-white p-4">
                  <p className="text-[0.62rem] font-black uppercase tracking-[0.16em] text-[#a00000]">
                    Activos
                  </p>
                  <p className="mt-2 text-3xl font-black">
                    {dayStats.activeToday.length}
                  </p>
                </div>

                <div className="rounded-2xl border-2 border-green-500 bg-green-50 p-4">
                  <p className="text-[0.62rem] font-black uppercase tracking-[0.16em] text-green-700">
                    Entregados
                  </p>
                  <p className="mt-2 text-3xl font-black text-green-700">
                    {dayStats.deliveredToday.length}
                  </p>
                </div>

                <div className="rounded-2xl border-2 border-red-400 bg-red-50 p-4">
                  <p className="text-[0.62rem] font-black uppercase tracking-[0.16em] text-red-700">
                    Cancelados
                  </p>
                  <p className="mt-2 text-3xl font-black text-red-700">
                    {dayStats.canceledToday.length}
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-[1.5rem] border-2 border-[#a00000] bg-white p-5">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-[#a00000]">
                    Ventas confirmadas
                  </p>
                  <p className="mt-3 text-4xl font-black text-[#220000]">
                    {formatUSD(dayStats.deliveredTotals.totalUSD)}
                  </p>

                  <div className="mt-3 space-y-1 text-sm font-black text-[#3a0000]/70">
                    <p>
                      Combos solo divisas:{" "}
                      {formatUSD(dayStats.deliveredTotals.totalCombosUSD)}
                    </p>
                    <p>
                      Productos normales:{" "}
                      {formatUSD(dayStats.deliveredTotals.totalRegularUSD)}
                    </p>
                    <p>
                      Ref. productos normales Bs{" "}
                      {formatVES(dayStats.deliveredTotals.totalRegularVES)}
                    </p>
                  </div>
                </div>

                <div className="rounded-[1.5rem] border-2 border-yellow-400 bg-yellow-100 p-5">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-[#8a5a00]">
                    Pendiente por entregar
                  </p>
                  <p className="mt-3 text-4xl font-black text-[#220000]">
                    {formatUSD(dayStats.activeTotals.totalUSD)}
                  </p>

                  <div className="mt-3 space-y-1 text-sm font-black text-[#3a0000]/70">
                    <p>
                      Combos pendientes:{" "}
                      {formatUSD(dayStats.activeTotals.totalCombosUSD)}
                    </p>
                    <p>
                      Productos normales pendientes:{" "}
                      {formatUSD(dayStats.activeTotals.totalRegularUSD)}
                    </p>
                    <p>
                      Ref. normales pendientes Bs{" "}
                      {formatVES(dayStats.activeTotals.totalRegularVES)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-[1.5rem] border-2 border-[#a00000] bg-white p-5">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#a00000]">
                  Productos vendidos
                </p>

                {dayStats.productsSold.length === 0 ? (
                  <p className="mt-4 text-sm font-bold text-[#3a0000]/70">
                    Todavía no hay productos entregados hoy.
                  </p>
                ) : (
                  <div className="mt-4 space-y-2">
                    {dayStats.productsSold.map((product) => (
                      <div
                        key={product.name}
                        className="flex items-center justify-between gap-4 rounded-2xl border border-[#a00000]/20 bg-[#fff7e8] px-4 py-3"
                      >
                        <div>
                          <p className="font-black uppercase text-[#220000]">
                            {product.name}
                          </p>
                          <p className="text-xs font-bold text-[#3a0000]/60">
                            {product.onlyCurrency
                              ? "Solo divisas"
                              : `Bs ${formatVES(product.totalVES)}`}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-xl font-black text-[#a00000]">
                            x{product.quantity}
                          </p>
                          <p className="text-sm font-black text-[#220000]">
                            {formatUSD(product.totalUSD)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {dayStats.topProduct && (
                <div className="rounded-[1.5rem] border-2 border-yellow-400 bg-yellow-100 p-5">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-[#8a5a00]">
                    Producto más vendido
                  </p>
                  <p className="mt-2 text-3xl font-black uppercase text-[#220000]">
                    {dayStats.topProduct.name}
                  </p>
                  <p className="mt-1 text-sm font-black text-[#3a0000]/70">
                    Cantidad vendida: {dayStats.topProduct.quantity}
                  </p>
                </div>
              )}

              <div className="rounded-[1.5rem] border-2 border-[#a00000]/30 bg-white p-4">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#a00000]">
                  Resumen para copiar
                </p>

                <pre className="mt-3 whitespace-pre-wrap rounded-2xl bg-[#fff7e8] p-4 text-sm font-bold leading-6 text-[#3a0000]">
                  {closeSummaryText}
                </pre>
              </div>

              {closeSummaryMessage && (
                <div className="rounded-2xl border-2 border-green-500/30 bg-green-50 px-4 py-3">
                  <p className="text-sm font-black text-green-700">
                    {closeSummaryMessage}
                  </p>
                </div>
              )}

              <div className="rounded-[1.5rem] border-2 border-red-500/35 bg-red-50 p-5">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="mt-1 text-red-600" size={24} />

                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-red-700">
                      Reiniciar pedidos
                    </p>
                    <p className="mt-2 text-sm font-bold leading-6 text-red-800">
                      Usa esta opción solo después de copiar el cierre del día.
                      Esto borrará todos los pedidos guardados y dejará el panel
                      limpio para empezar una nueva jornada.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setResetConfirmationText("")
                    setIsResetModalOpen(true)
                  }}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-red-600 bg-red-600 px-6 py-4 text-sm font-black uppercase tracking-[0.12em] text-white shadow-[0_6px_0_rgba(127,29,29,0.25)] sm:w-auto"
                >
                  <Trash2 size={18} />
                  Reiniciar día
                </button>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={copyCloseSummary}
                  className="rounded-full border-2 border-[#a00000] bg-yellow-300 px-6 py-4 text-sm font-black uppercase tracking-[0.12em] text-[#4a0000] shadow-[0_6px_0_rgba(160,0,0,0.18)]"
                >
                  Copiar resumen
                </button>

                <button
                  type="button"
                  onClick={() => setIsCloseModalOpen(false)}
                  className="rounded-full border-2 border-[#a00000] bg-white px-6 py-4 text-sm font-black uppercase tracking-[0.12em] text-[#a00000]"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isLocationsModalOpen && (
        <div className="fixed inset-0 z-[130] flex items-end justify-center bg-[#220000]/60 px-4 py-4 backdrop-blur-sm sm:items-center">
          <div className="max-h-[94vh] w-full max-w-2xl overflow-y-auto rounded-[2rem] border-4 border-[#a00000] bg-[#fff7e8] text-[#220000] shadow-2xl shadow-black/45">
            <div className="h-5 bg-[linear-gradient(45deg,#a00000_25%,transparent_25%),linear-gradient(-45deg,#a00000_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#a00000_75%),linear-gradient(-45deg,transparent_75%,#a00000_75%)] bg-[length:32px_32px] bg-[position:0_0,0_16px,16px_-16px,0] bg-[#fff7e8]" />

            <div className="border-b-2 border-[#a00000] bg-white px-6 py-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.28em] text-[#a00000]">
                    Configuración del local
                  </p>

                  <h2 className="mt-2 text-4xl font-black uppercase leading-none text-[#a00000] drop-shadow-[0_3px_0_rgba(255,211,0,0.75)]">
                    Mesas y ubicaciones
                  </h2>

                  <p className="mt-3 text-sm font-bold leading-6 text-[#3a0000]/70">
                    Estas opciones aparecerán en el carrito cuando se registre un
                    pedido local. Los clientes no pueden editarlas desde el
                    carrito.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsLocationsModalOpen(false)
                    setNewLocationName("")
                    setLocationsMessage(null)
                  }}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-[#a00000] bg-yellow-300 text-[#4a0000]"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="space-y-4 px-6 py-6">
              <div className="rounded-[1.4rem] border-2 border-[#a00000] bg-white p-4">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#a00000]">
                  Agregar ubicación
                </p>

                <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto]">
                  <input
                    value={newLocationName}
                    onChange={(event) => setNewLocationName(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        addOrderLocation()
                      }
                    }}
                    placeholder="Ejemplo: Mesa 5, Terraza, Mostrador..."
                    className="w-full rounded-2xl border-2 border-[#a00000]/25 bg-[#fff7e8] px-4 py-4 text-base font-bold text-[#4a0000] outline-none placeholder:text-[#4a0000]/45 focus:border-[#a00000]"
                  />

                  <button
                    type="button"
                    onClick={addOrderLocation}
                    className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#a00000] bg-yellow-300 px-6 py-4 text-sm font-black uppercase tracking-[0.12em] text-[#4a0000] shadow-[0_6px_0_rgba(160,0,0,0.18)] transition hover:bg-yellow-200"
                  >
                    <Plus size={18} />
                    Agregar
                  </button>
                </div>
              </div>

              <div className="rounded-[1.4rem] border-2 border-[#a00000]/30 bg-white p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-[#a00000]">
                      Ubicaciones activas
                    </p>
                    <p className="mt-1 text-sm font-bold text-[#3a0000]/65">
                      {orderLocations.length} opciones disponibles para pedidos
                      locales.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={restoreDefaultOrderLocations}
                    className="rounded-full border-2 border-[#a00000] bg-white px-4 py-2.5 text-xs font-black uppercase tracking-[0.12em] text-[#a00000] transition hover:bg-yellow-100"
                  >
                    Restaurar defecto
                  </button>
                </div>

                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {orderLocations.map((location) => (
                    <div
                      key={location}
                      className="flex items-center justify-between gap-3 rounded-2xl border-2 border-[#a00000]/20 bg-[#fff7e8] px-4 py-3"
                    >
                      <span className="text-sm font-black uppercase text-[#220000]">
                        {location}
                      </span>

                      <button
                        type="button"
                        onClick={() => removeOrderLocation(location)}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-red-600 bg-white text-red-700 transition hover:bg-red-100"
                        aria-label={`Eliminar ${location}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {locationsMessage && (
                <div className="rounded-2xl border-2 border-[#a00000]/25 bg-white px-4 py-3">
                  <p className="text-sm font-black text-[#a00000]">
                    {locationsMessage}
                  </p>
                </div>
              )}

              <button
                type="button"
                onClick={() => {
                  setIsLocationsModalOpen(false)
                  setNewLocationName("")
                  setLocationsMessage(null)
                }}
                className="w-full rounded-full border-2 border-[#a00000] bg-yellow-300 px-6 py-4 text-sm font-black uppercase tracking-[0.12em] text-[#4a0000] shadow-[0_6px_0_rgba(160,0,0,0.18)]"
              >
                Guardar y cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {isResetModalOpen && (
        <div className="fixed inset-0 z-[140] flex items-end justify-center bg-[#220000]/70 px-4 py-4 backdrop-blur-sm sm:items-center">
          <div className="w-full max-w-xl overflow-hidden rounded-[2rem] border-4 border-red-600 bg-white text-[#220000] shadow-2xl shadow-black/45">
            <div className="h-5 bg-[linear-gradient(45deg,#a00000_25%,transparent_25%),linear-gradient(-45deg,#a00000_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#a00000_75%),linear-gradient(-45deg,transparent_75%,#a00000_75%)] bg-[length:32px_32px] bg-[position:0_0,0_16px,16px_-16px,0] bg-[#fff7e8]" />

            <div className="border-b-2 border-red-600 bg-red-50 px-6 py-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.28em] text-red-700">
                    Acción irreversible
                  </p>

                  <h2 className="mt-2 text-4xl font-black uppercase leading-none text-red-700">
                    Reiniciar día
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (!isResettingDay) {
                      setIsResetModalOpen(false)
                      setResetConfirmationText("")
                    }
                  }}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-red-600 bg-white text-red-700"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="space-y-4 px-6 py-6">
              <div className="rounded-[1.4rem] border-2 border-red-500/35 bg-red-50 p-4">
                <div className="flex gap-3">
                  <AlertTriangle className="mt-1 shrink-0 text-red-600" size={26} />

                  <div>
                    <p className="text-sm font-black uppercase text-red-800">
                      Esto borrará todos los pedidos actuales.
                    </p>
                    <p className="mt-2 text-sm font-bold leading-6 text-red-800/80">
                      Antes de continuar, copia el resumen de cierre del día si
                      necesitas guardar las ventas. Después de reiniciar, el
                      panel quedará en cero para comenzar una nueva jornada.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-black uppercase tracking-[0.18em] text-red-700">
                  Escribe REINICIAR para confirmar
                </label>

                <input
                  value={resetConfirmationText}
                  onChange={(event) =>
                    setResetConfirmationText(event.target.value)
                  }
                  placeholder="REINICIAR"
                  className="mt-2 w-full rounded-2xl border-2 border-red-500/35 bg-red-50 px-4 py-4 text-base font-black uppercase text-red-800 outline-none placeholder:text-red-800/35 focus:border-red-600"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={resetDayOrders}
                  disabled={
                    isResettingDay ||
                    resetConfirmationText.trim().toUpperCase() !== "REINICIAR"
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-red-700 bg-red-600 px-6 py-4 text-sm font-black uppercase tracking-[0.12em] text-white shadow-[0_6px_0_rgba(127,29,29,0.25)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isResettingDay ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Trash2 size={18} />
                  )}
                  Borrar pedidos
                </button>

                <button
                  type="button"
                  disabled={isResettingDay}
                  onClick={() => {
                    setIsResetModalOpen(false)
                    setResetConfirmationText("")
                  }}
                  className="rounded-full border-2 border-[#a00000] bg-white px-6 py-4 text-sm font-black uppercase tracking-[0.12em] text-[#a00000] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}