"use client"

import { useMemo, useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Search, X } from "lucide-react"
import ProductCard from "./ProductCard"
import { categories, products } from "@/data/products"
import type { ProductToAdd } from "@/hooks/useCart"

type ProductsProps = {
  onAddToCart: (product: ProductToAdd) => void
  exchangeRate: number
}

export default function Products({
  onAddToCart,
  exchangeRate,
}: ProductsProps) {
  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === "Todos" || product.category === selectedCategory

      const matchesSearch =
        normalizedSearch.length === 0 ||
        product.name.toLowerCase().includes(normalizedSearch) ||
        product.description.toLowerCase().includes(normalizedSearch) ||
        product.category.toLowerCase().includes(normalizedSearch)

      return matchesCategory && matchesSearch
    })
  }, [selectedCategory, searchTerm])

  return (
    <section
      id="menu"
      className="relative overflow-hidden bg-[#8f0000] px-4 pb-20 pt-12 text-white sm:px-6 sm:pb-28 sm:pt-18"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,214,10,0.42),transparent_34%),radial-gradient(circle_at_right,rgba(255,90,0,0.32),transparent_34%),linear-gradient(to_bottom,#d90404_0%,#9b0000_48%,#2a0000_100%)]" />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#d90404] via-[#d90404]/70 to-transparent" />
      <div className="absolute left-1/2 top-24 h-72 w-72 -translate-x-1/2 rounded-full bg-yellow-300/24 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.55 }}
          className="mb-8 max-w-3xl sm:mb-12"
        >
          <div className="mb-5 inline-flex rounded-full border border-yellow-300/30 bg-black/25 px-4 py-2 shadow-lg shadow-black/15">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-yellow-300 sm:text-sm">
              Menú Santo Perrito
            </p>
          </div>

          <h2 className="text-5xl font-black uppercase leading-[0.88] tracking-[-0.08em] text-yellow-300 drop-shadow-[0_4px_0_rgba(0,0,0,0.45)] sm:text-6xl lg:text-7xl">
            Elige tu próximo{" "}
            <span className="text-white drop-shadow-none">antojo</span>
          </h2>

          <p className="mt-5 max-w-2xl text-base font-bold leading-relaxed text-yellow-50/90 sm:text-lg">
            Perros calientes, delicias y bebidas frías. Agrega tus favoritos al
            carrito y pide directo por WhatsApp.
          </p>
        </motion.div>

        <div className="mb-5 rounded-[1.7rem] border border-yellow-300/30 bg-[linear-gradient(135deg,#390000_0%,#6f0000_52%,#a50b00_100%)] p-3 shadow-2xl shadow-black/30 backdrop-blur-xl">
          <div className="relative">
            <Search
              size={21}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-yellow-300 drop-shadow-[0_0_10px_rgba(255,214,10,0.35)]"
            />

            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Buscar productos..."
              className="w-full rounded-2xl border border-yellow-300/30 bg-[linear-gradient(135deg,#240000_0%,#3b0000_52%,#5c0000_100%)] py-4 pl-12 pr-12 text-base font-black text-yellow-50 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_0_24px_rgba(0,0,0,0.18)] outline-none placeholder:text-yellow-200/65 focus:border-yellow-300 focus:bg-[#320000] focus:shadow-[0_0_0_3px_rgba(255,214,10,0.16)]"
            />

            {searchTerm.length > 0 && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl bg-yellow-300 text-[#4a0000] shadow-lg shadow-black/20 transition hover:scale-105 hover:bg-yellow-200"
                aria-label="Limpiar búsqueda"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        <div className="mb-10 rounded-[1.7rem] border border-yellow-300/25 bg-black/24 p-3 shadow-2xl shadow-black/25 backdrop-blur-xl">
          <div className="flex gap-3 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {categories.map((category) => {
              const isActive = selectedCategory === category

              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`shrink-0 rounded-full border px-5 py-3 text-sm font-black uppercase transition ${
                    isActive
                      ? "border-yellow-300 bg-yellow-300 text-[#4a0000] shadow-lg shadow-yellow-950/30"
                      : "border-yellow-300/30 bg-red-950/45 text-yellow-100 hover:border-yellow-300 hover:bg-red-900"
                  }`}
                >
                  {category}
                </button>
              )
            })}
          </div>
        </div>

        {filteredProducts.length > 0 ? (
          <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  category={product.category}
                  description={product.description}
                  price={product.price}
                  image={product.image}
                  exchangeRate={exchangeRate}
                  onAddToCart={onAddToCart}
                  index={index}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="rounded-[2rem] border border-yellow-300/20 bg-black/25 p-8 text-center shadow-2xl shadow-black/25">
            <p className="text-2xl font-black uppercase text-yellow-300">
              No encontramos ese producto
            </p>

            <p className="mx-auto mt-3 max-w-xl font-semibold text-yellow-50/75">
              Prueba buscando otro nombre o cambia la categoría para ver más
              opciones del menú.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearchTerm("")
                setSelectedCategory("Todos")
              }}
              className="mt-6 rounded-full bg-yellow-300 px-6 py-3 text-sm font-black uppercase text-[#4a0000] transition hover:scale-105"
            >
              Ver todo el menú
            </button>
          </div>
        )}
      </div>
    </section>
  )
}