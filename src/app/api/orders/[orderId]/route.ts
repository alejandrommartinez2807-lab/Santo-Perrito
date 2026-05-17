import { NextRequest, NextResponse } from "next/server"
import {
  deleteOrderInAppsScript,
  updateOrderStatusInAppsScript,
  type OrderStatus,
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

function isValidStatus(value: unknown): value is OrderStatus {
  return (
    value === "Nuevo" ||
    value === "Preparando" ||
    value === "Listo" ||
    value === "Entregado" ||
    value === "Cancelado"
  )
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ orderId: string }> }
) {
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

    const { orderId } = await context.params
    const body = await request.json()
    const status = body.status

    if (!isValidStatus(status)) {
      return NextResponse.json(
        {
          error: "Estado inválido",
        },
        {
          status: 400,
        }
      )
    }

    const order = await updateOrderStatusInAppsScript(orderId, status)

    return NextResponse.json({
      order,
    })
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "No se pudo actualizar el pedido",
      },
      {
        status: 500,
      }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ orderId: string }> }
) {
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

    const { orderId } = await context.params

    await deleteOrderInAppsScript(orderId)

    return NextResponse.json({
      ok: true,
    })
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "No se pudo eliminar el pedido",
      },
      {
        status: 500,
      }
    )
  }
}