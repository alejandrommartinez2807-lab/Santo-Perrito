export type Product = {
  id: number
  name: string
  category: "Perros" | "Delicias" | "Bebidas"
  description: string
  price: number
  image: string
}

export const categories = ["Todos", "Perros", "Delicias", "Bebidas"]

export const products: Product[] = [
  {
    id: 1,
    name: "Perro Normal",
    category: "Perros",
    description:
      "Perro caliente clásico con pan suave, salchicha, salsas y toppings tradicionales.",
    price: 3,
    image: "/perrosnormales.png",
  },
  {
    id: 2,
    name: "Perro Especial",
    category: "Perros",
    description:
      "Perro caliente más cargado, con queso, papitas, salsas y el toque especial de Santo Perrito.",
    price: 4.5,
    image: "/perros-especiales.png",
  },
  {
    id: 3,
    name: "Pepito",
    category: "Perros",
    description:
      "Pepito con pan tostado, proteína, salsas y una combinación fuerte para resolver el antojo.",
    price: 6,
    image: "/pepito.png",
  },
  {
    id: 4,
    name: "Salchipapa",
    category: "Delicias",
    description:
      "Papas con salchicha, salsas y toppings. Una opción perfecta para compartir o comer completo.",
    price: 5,
    image: "/salchipapa.png",
  },
  {
    id: 5,
    name: "Papas Fritas",
    category: "Delicias",
    description:
      "Papas doradas, crujientes y listas para acompañar tu pedido.",
    price: 3,
    image: "/papasfritas.png",
  },
  {
    id: 6,
    name: "Nuggets",
    category: "Delicias",
    description:
      "Nuggets crujientes, ideales para acompañar con salsas y bebidas frías.",
    price: 4,
    image: "/nugets.png",
  },
  {
    id: 7,
    name: "Tequeños",
    category: "Delicias",
    description:
      "Tequeños dorados y crujientes, perfectos para picar o acompañar tu comida.",
    price: 4,
    image: "/tequeno.png",
  },
  {
    id: 8,
    name: "Yukery",
    category: "Bebidas",
    description:
      "Jugo Yukery frío para acompañar tu perro o tus delicias favoritas.",
    price: 2,
    image: "/jugoyukeri.png",
  },
  {
    id: 9,
    name: "Refresco Pequeño",
    category: "Bebidas",
    description:
      "Refresco pequeño frío para acompañar tu pedido.",
    price: 1.5,
    image: "/refresco-pequeno.png",
  },
  {
    id: 10,
    name: "Refresco 1 Litro",
    category: "Bebidas",
    description:
      "Refresco de 1 litro ideal para compartir.",
    price: 2.5,
    image: "/refresco1litros.png",
  },
  {
    id: 11,
    name: "Refresco 1.5 Litros",
    category: "Bebidas",
    description:
      "Refresco de 1.5 litros para acompañar varios pedidos.",
    price: 3,
    image: "/refresco1,5litros.png",
  },
  {
    id: 12,
    name: "Refresco 2 Litros",
    category: "Bebidas",
    description:
      "Refresco de 2 litros, perfecto para compartir en grupo.",
    price: 4,
    image: "/refresco2litros.png",
  },
  {
    id: 13,
    name: "Té Lipton",
    category: "Bebidas",
    description:
      "Té frío Lipton para acompañar tu comida con algo refrescante.",
    price: 2.5,
    image: "/telipton.png",
  },
]