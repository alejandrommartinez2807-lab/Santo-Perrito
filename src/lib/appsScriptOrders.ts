export type OrderStatus =
  | "Nuevo"
  | "Preparando"
  | "Listo"
  | "Entregado"
  | "Cancelado"

export type OrderItem = {
  id: number
  name: string
  category: string
  price: number
  image: string
  quantity: number
  note?: string
  noteEnabled?: boolean
}

export type LocalOrder = {
  rowNumber?: number
  id: string
  createdAt: string
  customerName: string
  tableNumber: string
  orderType: "Comer aquí" | "Para llevar"
  customerNote: string
  items: OrderItem[]
  itemsText: string
  totalPrice: number
  totalVES: number
  exchangeRate: number
  exchangeSource?: string
  exchangeValueDate?: string
  status: OrderStatus
}

function getWebAppUrl() {
  const url = process.env.GOOGLE_SHEETS_WEB_APP_URL

  if (!url) {
    throw new Error("Falta GOOGLE_SHEETS_WEB_APP_URL")
  }

  return url
}

function getSecret() {
  const secret = process.env.ORDERS_API_SECRET

  if (!secret) {
    throw new Error("Falta ORDERS_API_SECRET")
  }

  return secret
}

async function readJsonResponse(response: Response) {
  const text = await response.text()

  try {
    return JSON.parse(text)
  } catch {
    throw new Error(text || "Respuesta inválida de Google Apps Script")
  }
}

export async function getOrdersFromAppsScript() {
  const url = new URL(getWebAppUrl())

  url.searchParams.set("action", "list")
  url.searchParams.set("secret", getSecret())

  const response = await fetch(url.toString(), {
    method: "GET",
    cache: "no-store",
  })

  const data = await readJsonResponse(response)

  if (!response.ok || data.error) {
    throw new Error(data.error || "No se pudieron cargar los pedidos")
  }

  return data.orders as LocalOrder[]
}

export async function createOrderInAppsScript(input: {
  customerName: string
  tableNumber: string
  orderType: "Comer aquí" | "Para llevar"
  customerNote?: string
  items: OrderItem[]
  exchangeRate: number
  exchangeSource?: string
  exchangeValueDate?: string
}) {
  const response = await fetch(getWebAppUrl(), {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
    cache: "no-store",
    body: JSON.stringify({
      action: "create",
      secret: getSecret(),
      ...input,
    }),
  })

  const data = await readJsonResponse(response)

  if (!response.ok || data.error) {
    throw new Error(data.error || "No se pudo registrar el pedido")
  }

  return data.order as LocalOrder
}

export async function updateOrderStatusInAppsScript(
  orderId: string,
  status: OrderStatus
) {
  const response = await fetch(getWebAppUrl(), {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
    cache: "no-store",
    body: JSON.stringify({
      action: "updateStatus",
      secret: getSecret(),
      orderId,
      status,
    }),
  })

  const data = await readJsonResponse(response)

  if (!response.ok || data.error) {
    throw new Error(data.error || "No se pudo actualizar el pedido")
  }

  return data.order as LocalOrder
}

export async function deleteOrderInAppsScript(orderId: string) {
  const response = await fetch(getWebAppUrl(), {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
    cache: "no-store",
    body: JSON.stringify({
      action: "delete",
      secret: getSecret(),
      orderId,
    }),
  })

  const data = await readJsonResponse(response)

  if (!response.ok || data.error) {
    throw new Error(data.error || "No se pudo eliminar el pedido")
  }

  return data
}