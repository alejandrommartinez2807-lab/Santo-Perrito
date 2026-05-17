export type Product = {
  id: number
  name: string
  category: "Combos" | "Perritos" | "Salchipapas" | "Raciones" | "Bebidas"
  description: string
  price: number
  image: string
}

export const categories = [
  "Todos",
  "Combos",
  "Perritos",
  "Salchipapas",
  "Raciones",
  "Bebidas",
]

export const products: Product[] = [
  // COMBOS
  {
    id: 1,
    name: "Combo Clásico",
    category: "Combos",
    description:
      "4 Perros Clásicos + 1 refresco de 1 litro. Pago en Zelle o efectivo.",
    price: 10,
    image: "/combo-normal.png",
  },
  {
    id: 2,
    name: "Combo Cachón",
    category: "Combos",
    description:
      "4 Santo Cachón + 1 refresco de 2 litros. Pago en Zelle o efectivo.",
    price: 15,
    image: "/combo-cachon.png",
  },

  // PERRITOS
  {
    id: 3,
    name: "Clásico",
    category: "Perritos",
    description:
      "Pan, salchicha, papas, cebolla, ensalada, maíz, queso amarillo y salsas de la casa.",
    price: 3,
    image: "/perroclasico.png",
  },
  {
    id: 4,
    name: "Santo Cachón",
    category: "Perritos",
    description:
      "Pan, doble salchicha, papas, cebolla, ensalada, maíz, tocineta, queso amarillo y salsas de la casa.",
    price: 3.5,
    image: "/Santocachon.png",
  },
  {
    id: 5,
    name: "Santo Perrito",
    category: "Perritos",
    description:
      "Pan, salchicha, papas, cebolla, salsa de la casa al estilo ranch, salsa estrella a base de tocineta y parmesano, tocineta, queso amarillo o parmesano.",
    price: 3.5,
    image: "/Santoperrito.png",
  },

  // SALCHIPAPAS
  {
    id: 6,
    name: "Salchipapa Sencilla",
    category: "Salchipapas",
    description: "Papas fritas, salchicha y queso cheddar fundido.",
    price: 5,
    image: "/salchipapa.png",
  },
  {
    id: 7,
    name: "Salchipapa Especial",
    category: "Salchipapas",
    description:
      "Papas fritas, salchicha, tocineta, queso cheddar y queso amarillo.",
    price: 7,
    image: "/salchipapaespecial.png",
  },

  // RACIONES
  {
    id: 8,
    name: "Nuggets de Pollo",
    category: "Raciones",
    description: "Nuggets de pollo con papas fritas.",
    price: 5,
    image: "/nuggetspollo.png",
  },
  {
    id: 9,
    name: "Ración de Papas Fritas",
    category: "Raciones",
    description:
      "Ración de papas fritas doradas y crujientes para acompañar tu pedido.",
    price: 3,
    image: "/papasfritas.png",
  },

  // BEBIDAS
  {
    id: 10,
    name: "Refresco Botella",
    category: "Bebidas",
    description: "Refresco frío en botella para acompañar tu pedido.",
    price: 1,
    image: "/refresco-pequeno.png",
  },
  {
    id: 11,
    name: "Refresco 1LT",
    category: "Bebidas",
    description: "Refresco de 1 litro ideal para compartir.",
    price: 2,
    image: "/refresco1litros.png",
  },
  {
    id: 12,
    name: "Nestea",
    category: "Bebidas",
    description: "Té frío para acompañar tu comida.",
    price: 3,
    image: "/telipton.png",
  },
]