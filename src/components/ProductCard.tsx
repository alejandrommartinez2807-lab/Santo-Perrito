"use client"

import { useState } from "react"
import { motion } from "motion/react"
import { Plus, ShoppingCart } from "lucide-react"
import { formatUSD, formatVES } from "@/utils/formatCurrency"
import type { ProductToAdd } from "@/hooks/useCart"

type ProductCardProps = {
  id: number
  name: string
  category: string
  description: string
  price: number
  image: string
  exchangeRate: number
  index?: number
  onAddToCart: (product: ProductToAdd) => void
}

export default function ProductCard({
  id,
  name,
  category,
  description,
  price,
  image,
  exchangeRate,
  index = 0,
  onAddToCart,
}: ProductCardProps) {
  const [added, setAdded] = useState(false)

  function handleAddToCart() {
    onAddToCart({
      id,
      name,
      category,
      price,
      image,
    })

    setAdded(true)

    setTimeout(() => {
      setAdded(false)
    }, 900)
  }

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 26, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 18, scale: 0.96 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.2) }}
      whileHover={{ y: -6 }}
      className="group overflow-hidden rounded-[1.8rem] border-2 border-[#a00000] bg-white shadow-[0_10px_0_rgba(160,0,0,0.14),0_22px_35px_rgba(80,0,0,0.12)]"
    >
      <div className="relative h-64 overflow-hidden bg-[#fff7e8] sm:h-72">
        <motion.img
          src={image || "/logoremovebg.png"}
          alt={name}
          className="h-full w-full object-cover object-center"
          whileHover={{ scale: 1.06 }}
          transition={{ duration: 0.45 }}
          onError={(event) => {
            event.currentTarget.src = "/logoremovebg.png"
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#220000]/90 via-[#220000]/18 to-transparent" />

        <span className="absolute left-4 top-4 rounded-full border-2 border-yellow-300 bg-[#a00000] px-3 py-2 text-xs font-black uppercase tracking-[0.18em] text-yellow-300 shadow-md">
          {category}
        </span>

        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
          <div className="max-w-[58%]">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-yellow-300">
              Santo Perrito
            </p>

            <h3 className="mt-1 text-[1.85rem] font-black uppercase leading-[0.95] tracking-[-0.05em] text-white drop-shadow-[0_3px_0_rgba(0,0,0,0.35)] sm:text-[2.1rem]">
              {name}
            </h3>
          </div>

          <div className="min-w-[110px] rounded-[1.2rem] border-2 border-[#a00000] bg-yellow-300 px-4 py-3 text-right text-[#4a0000] shadow-[0_7px_0_rgba(100,0,0,0.22)]">
            <p className="text-2xl font-black leading-none">
              {formatUSD(price)}
            </p>

            <div className="mt-2 border-t border-[#a00000]/25 pt-2">
              <p className="text-sm font-black leading-none sm:text-base">
                Bs {formatVES(price * exchangeRate)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <p className="min-h-[64px] text-sm font-semibold leading-relaxed text-[#3a0000]/82 sm:text-base">
          {description}
        </p>

        <button
          type="button"
          onClick={handleAddToCart}
          className={`mt-6 flex w-full items-center justify-center gap-3 rounded-xl border-2 px-4 py-4 font-black uppercase shadow-[0_6px_0_rgba(100,0,0,0.18)] transition active:translate-y-1 active:shadow-none ${
            added
              ? "border-green-700 bg-green-500 text-white"
              : "border-[#a00000] bg-[#a00000] text-white hover:bg-yellow-300 hover:text-[#4a0000]"
          }`}
        >
          {added ? (
            <>
              <ShoppingCart size={18} />
              Agregado
            </>
          ) : (
            <>
              <Plus size={18} />
              Agregar al carrito
            </>
          )}
        </button>
      </div>
    </motion.article>
  )
}
