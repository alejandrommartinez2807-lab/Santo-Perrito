"use client"

import { useMemo, useState } from "react"
import { Search, Sparkles } from "lucide-react"
import ProductCard from "@/components/ProductCard"
import { categories, products } from "@/data/products"
import type { ProductToAdd } from "@/hooks/useCart"

type ProductsProps = {
  exchangeRate: number
  onAddToCart: (product: ProductToAdd) => void
}

export default function Products({ exchangeRate, onAddToCart }: ProductsProps) {
  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const [searchTerm, setSearchTerm] = useState("")

  const comboProducts = products.filter((product) => product.category === "Combos")

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
      className="bg-[#fff7e8] px-4 py-14 text-[#220000] sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <p className="text-xs font-black uppercase tracking-[0.38em] text-[#a00000]">
            Menú Santo Perrito
          </p>

          <h2 className="mx-auto mt-3 max-w-4xl text-5xl font-black uppercase leading-[0.9] tracking-[-0.05em] text-[#a00000] drop-shadow-[0_5px_0_rgba(255,211,0,0.9)] sm:text-7xl">
            Perros, combos y bebidas
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base font-bold leading-7 text-[#3a0000]/75 sm:text-lg">
            Elige tus favoritos, agrégalos al carrito y registra el pedido en el
            local o envíalo directamente por WhatsApp.
          </p>
        </div>

        {comboProducts.length > 0 && (
          <section className="mt-10 overflow-hidden rounded-[2rem] border-4 border-[#a00000] bg-white shadow-[0_12px_0_rgba(160,0,0,0.14)]">
            <div className="h-5 bg-[linear-gradient(45deg,#a00000_25%,transparent_25%),linear-gradient(-45deg,#a00000_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#a00000_75%),linear-gradient(-45deg,transparent_75%,#a00000_75%)] bg-[length:32px_32px] bg-[position:0_0,0_16px,16px_-16px,-16px_0] bg-[#fff7e8]" />

            <div className="p-5 sm:p-7">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border-2 border-[#a00000] bg-yellow-300 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#4a0000]">
                    <Sparkles size={16} />
                    Promos de la casa
                  </div>

                  <h3 className="mt-4 text-4xl font-black uppercase leading-none text-[#a00000] drop-shadow-[0_3px_0_rgba(255,211,0,0.75)] sm:text-5xl">
                    Combos destacados
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedCategory("Combos")}
                  className="rounded-full border-2 border-[#a00000] bg-[#a00000] px-5 py-3 text-xs font-black uppercase tracking-[0.12em] text-white shadow-[0_5px_0_rgba(160,0,0,0.16)] transition hover:bg-yellow-300 hover:text-[#4a0000]"
                >
                  Ver combos
                </button>
              </div>

              <div className="mt-6 grid gap-5 lg:grid-cols-2">
                {comboProducts.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    {...product}
                    exchangeRate={exchangeRate}
                    index={index}
                    onAddToCart={onAddToCart}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        <div className="mt-10 rounded-[1.6rem] border-2 border-[#a00000] bg-white p-4 shadow-[0_8px_0_rgba(160,0,0,0.10)]">
          <div className="relative">
            <Search
              size={20}
              className="absolute left-5 top-1/2 -translate-y-1/2 text-[#a00000]"
            />

            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Buscar productos..."
              className="w-full rounded-[1.2rem] border-2 border-[#a00000]/20 bg-[#fff7e8] px-12 py-4 text-base font-black text-[#4a0000] outline-none placeholder:text-[#4a0000]/45 focus:border-[#a00000]"
            />
          </div>

          <div className="mt-5 flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {categories.map((category) => {
              const isActive = selectedCategory === category

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`shrink-0 rounded-full border-2 px-5 py-3 text-xs font-black uppercase tracking-[0.08em] transition ${
                    isActive
                      ? "border-[#a00000] bg-yellow-300 text-[#4a0000] shadow-[0_5px_0_rgba(160,0,0,0.14)]"
                      : "border-[#a00000] bg-white text-[#a00000] hover:bg-yellow-100"
                  }`}
                >
                  {category}
                </button>
              )
            })}
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="mt-10 rounded-[2rem] border-2 border-[#a00000] bg-white px-6 py-14 text-center shadow-[0_8px_0_rgba(160,0,0,0.12)]">
            <img
              src="/logoremovebg.png"
              alt="Santo Perrito"
              className="mx-auto h-28 w-28 object-contain"
            />

            <h3 className="mt-5 text-3xl font-black uppercase text-[#a00000]">
              No encontramos productos
            </h3>

            <p className="mx-auto mt-3 max-w-md text-sm font-bold leading-6 text-[#3a0000]/70">
              Prueba con otra búsqueda o cambia la categoría seleccionada.
            </p>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                {...product}
                exchangeRate={exchangeRate}
                index={index}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}