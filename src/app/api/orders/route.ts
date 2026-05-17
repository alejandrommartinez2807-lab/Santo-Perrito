import { NextRequest, NextResponse } from "next/server"
import {
  createOrderInAppsScript,
  getOrdersFromAppsScript,
} from "@/lib/appsScriptOrders"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

function getAdminPassword() {
  return process.env.ORDERS_ADMIN_PASSWORD || process.env.ADMIN_PASSWORD || ""
}

function checkAdmin(request: NextRequest) {
  const expectedPassword = getAdminPassword()

  if (!expectedPassword) {
    return false
  }

  const receivedPassword = request.headers.get("x-admin-password")

  return receivedPassword === expectedPassword
}

export async function GET(request: NextRequest) {
  try {
    if (!checkAdmin(request)) {
      return NextResponse.json(
        {
          error: "No autorizado",
        },
        {
          status: 401,
        }
      )
    }

    const orders = await getOrdersFromAppsScript()

    return NextResponse.json({
      orders,
    })
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "No se pudieron cargar los pedidos",
      },
      {
        status: 500,
      }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const customerName = String(body.customerName || "").trim()
    const tableNumber = String(body.tableNumber || "").trim()
    const orderType =
      body.orderType === "Para llevar" ? "Para llevar" : "Comer aquí"
    const customerNote = String(body.customerNote || "").trim()
    const items = Array.isArray(body.items) ? body.items : []
    const exchangeRate = Number(body.exchangeRate)
    const exchangeSource = String(body.exchangeSource || "")
    const exchangeValueDate = String(body.exchangeValueDate || "")

    if (!customerName) {
      return NextResponse.json(
        {
          error: "Falta el nombre del cliente",
        },
        {
          status: 400,
        }
      )
    }

    if (!tableNumber) {
      return NextResponse.json(
        {
          error: "Falta la mesa o ubicación",
        },
        {
          status: 400,
        }
      )
    }

    if (!items.length) {
      return NextResponse.json(
        {
          error: "El pedido no tiene productos",
        },
        {
          status: 400,
        }
      )
    }

    if (!Number.isFinite(exchangeRate) || exchangeRate <= 0) {
      return NextResponse.json(
        {
          error: "La tasa no es válida",
        },
        {
          status: 400,
        }
      )
    }

    const order = await createOrderInAppsScript({
      customerName,
      tableNumber,
      orderType,
      customerNote,
      items,
      exchangeRate,
      exchangeSource,
      exchangeValueDate,
    })

    return NextResponse.json({
      order,
    })
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "No se pudo registrar el pedido",
      },
      {
        status: 500,
      }
    )
  }
}