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
      className="relative overflow-hidden bg-[#fff7e8] px-4 pb-20 pt-14 text-[#220000] sm:px-6 sm:pb-28"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,211,0,0.28),transparent_32%),radial-gradient(circle_at_right,rgba(160,0,0,0.08),transparent_34%)]" />

      <div className="absolute inset-x-0 top-0 h-8 bg-[linear-gradient(45deg,#a00000_25%,transparent_25%),linear-gradient(-45deg,#a00000_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#a00000_75%),linear-gradient(-45deg,transparent_75%,#a00000_75%)] bg-[length:32px_32px] bg-[position:0_0,0_16px,16px_-16px,-16px_0] bg-[#fff7e8]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.55 }}
          className="mb-8 max-w-3xl sm:mb-12"
        >
          <div className="mb-5 inline-flex rounded-[0.5rem] bg-[#a00000] px-5 py-2 shadow-[0_6px_0_rgba(90,0,0,0.18)]">
            <p className="text-xl font-black uppercase tracking-[-0.02em] text-yellow-300 sm:text-3xl">
              Menú
            </p>
          </div>

          <h2 className="text-5xl font-black uppercase leading-[0.88] tracking-[-0.08em] text-[#a00000] drop-shadow-[0_4px_0_rgba(255,211,0,0.75)] sm:text-6xl lg:text-7xl">
            Elige tu próximo{" "}
            <span className="text-[#220000] drop-shadow-none">antojo</span>
          </h2>

          <p className="mt-5 max-w-2xl text-base font-bold leading-relaxed text-[#3a0000]/85 sm:text-lg">
            Perritos, salchipapas, raciones y bebidas frías. Agrega tus
            favoritos al carrito y registra el pedido en el local o por WhatsApp.
          </p>
        </motion.div>

        <div className="mb-5 rounded-[1.4rem] border-2 border-[#a00000] bg-white p-3 shadow-[0_9px_0_rgba(160,0,0,0.12)]">
          <div className="relative">
            <Search
              size={21}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#a00000]"
            />

            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Buscar productos..."
              className="w-full rounded-2xl border-2 border-[#a00000]/25 bg-[#fff7e8] py-4 pl-12 pr-12 text-base font-black text-[#3a0000] outline-none placeholder:text-[#a00000]/55 focus:border-[#a00000] focus:bg-white"
            />

            {searchTerm.length > 0 && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl bg-[#a00000] text-white transition hover:scale-105"
                aria-label="Limpiar búsqueda"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        <div className="mb-10 rounded-[1.4rem] border-2 border-[#a00000] bg-white p-3 shadow-[0_9px_0_rgba(160,0,0,0.12)]">
          <div className="flex gap-3 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {categories.map((category) => {
              const isActive = selectedCategory === category

              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`shrink-0 rounded-full border-2 px-5 py-3 text-sm font-black uppercase transition ${
                    isActive
                      ? "border-[#a00000] bg-yellow-300 text-[#4a0000] shadow-[0_5px_0_rgba(160,0,0,0.18)]"
                      : "border-[#a00000] bg-white text-[#a00000] hover:bg-yellow-100"
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
          <div className="rounded-[2rem] border-2 border-[#a00000] bg-white p-8 text-center shadow-[0_10px_0_rgba(160,0,0,0.12)]">
            <p className="text-2xl font-black uppercase text-[#a00000]">
              No encontramos ese producto
            </p>

            <p className="mx-auto mt-3 max-w-xl font-semibold text-[#3a0000]/75">
              Prueba buscando otro nombre o cambia la categoría para ver más
              opciones del menú.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearchTerm("")
                setSelectedCategory("Todos")
              }}
              className="mt-6 rounded-full border-2 border-[#a00000] bg-yellow-300 px-6 py-3 text-sm font-black uppercase text-[#4a0000] transition hover:scale-105"
            >
              Ver todo el menú
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
