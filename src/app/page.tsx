"use client"

import { useState } from "react"
import { useExchangeRate } from "@/hooks/useExchangeRate"
import { useCart } from "@/hooks/useCart"

import Navbar from "@/components/Navbar"
import Hero from "@/components/Hero"
import Products from "@/components/Products"
import CartDrawer from "@/components/CartDrawer"
import BottomInfoSections from "@/components/BottomInfoSections"

export default function Home() {
  const cart = useCart()
  const exchange = useExchangeRate()
  const [isCartOpen, setIsCartOpen] = useState(false)

  return (
    <main className="min-h-screen bg-[#fff7e8] text-[#220000]">
      <Navbar
        totalItems={cart.totalItems}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <Hero />

      <Products onAddToCart={cart.addItem} exchangeRate={exchange.rate} />

      <BottomInfoSections />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart.items}
        totalPrice={cart.totalPrice}
        removeItem={cart.removeItem}
        increaseQuantity={cart.increaseQuantity}
        decreaseQuantity={cart.decreaseQuantity}
        updateItemNote={cart.updateItemNote}
        updateItemNoteEnabled={cart.updateItemNoteEnabled}
        exchangeRate={exchange.rate}
        exchangeSource={exchange.source}
        exchangeValueDate={exchange.valueDate}
        exchangeFallback={exchange.fallback}
        exchangeWarning={exchange.warning}
      />
    </main>
  )
}
