export type Product = {
  id: number
  name: string
  category: "Perritos" | "Salchipapas" | "Raciones" | "Delicias" | "Bebidas"
  description: string
  price: number
  image: string
}

export const categories = [
  "Todos",
  "Perritos",
  "Salchipapas",
  "Raciones",
  "Delicias",
  "Bebidas",
]

export const products: Product[] = [
  {
    id: 1,
    name: "Clásico",
    category: "Perritos",
    description:
      "Pan, salchicha, papas, cebolla, ensalada, maíz, queso amarillo y salsas de la casa.",
    price: 3,
    image: "/perroclasico.png",
  },
  {
    id: 2,
    name: "Santo Cachón",
    category: "Perritos",
    description:
      "Pan, doble salchicha, papas, cebolla, ensalada, maíz, tocineta, queso amarillo y salsas de la casa.",
    price: 3.5,
    image: "/Santocachon.png",
  },
  {
    id: 3,
    name: "Santo Perrito",
    category: "Perritos",
    description:
      "Pan, salchicha, papas, cebolla, salsa de la casa al estilo ranch, salsa estrella a base de tocineta y parmesano, tocineta, queso amarillo o parmesano.",
    price: 3.5,
    image: "/Santoperrito.png",
  },
  {
    id: 4,
    name: "Salchipapa Sencilla",
    category: "Salchipapas",
    description:
      "Papas fritas, salchicha y queso cheddar fundido.",
    price: 5,
    image: "/salchipapaespecial.png",
  },
  {
    id: 5,
    name: "Salchipapa Especial",
    category: "Salchipapas",
    description:
      "Papas fritas, salchicha, tocineta, queso cheddar y queso amarillo.",
    price: 7,
    image: "/salchipapaespecial.png",
  },
  {
    id: 6,
    name: "Nuggets de Pollo",
    category: "Delicias",
    description:
      "Nuggets de pollo acompañados con papas fritas.",
    price: 5,
    image: "/nuggetspollo.png",
  },
  {
    id: 7,
    name: "Ración de Papas Fritas",
    category: "Raciones",
    description:
      "Ración de papas fritas doradas y crujientes para acompañar tu pedido.",
    price: 3,
    image: "/nuggetspollo.png",
  },
  {
    id: 8,
    name: "Refresco Botella",
    category: "Bebidas",
    description:
      "Refresco frío en botella para acompañar tu pedido.",
    price: 1,
    image: "/refresco-pequeno.png",
  },
  {
    id: 9,
    name: "Refresco 1LT",
    category: "Bebidas",
    description:
      "Refresco de 1 litro ideal para compartir.",
    price: 2,
    image: "/refresco1litros.png",
  },
  {
    id: 10,
    name: "Nestea",
    category: "Bebidas",
    description:
      "Té frío Nestea para acompañar tu comida.",
    price: 3,
    image: "/refresco1.5litros.png",
  },
  {
    id: 11,
    name: "Malta",
    category: "Bebidas",
    description:
      "Malta fría para acompañar tu pedido.",
    price: 1,
    image: "/telipton.png",
  },
  {
    id: 12,
    name: "Agua",
    category: "Bebidas",
    description:
      "Agua fría para refrescarte y acompañar tu comida.",
    price: 1.5,
    image: "/jugoyukeri.png",
  },
]