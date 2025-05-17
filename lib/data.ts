export const categories = [
  {
    id: "cat1",
    name: "Decoración",
    slug: "decoracion",
    image: "/placeholder.svg?height=300&width=300",
    productCount: 24,
  },
  {
    id: "cat2",
    name: "Objetos Funcionales",
    slug: "funcional",
    image: "/placeholder.svg?height=300&width=300",
    productCount: 18,
  },
  {
    id: "cat3",
    name: "Juguetes y Figuras",
    slug: "juguetes",
    image: "/placeholder.svg?height=300&width=300",
    productCount: 32,
  },
  {
    id: "cat4",
    name: "Accesorios",
    slug: "accesorios",
    image: "/placeholder.svg?height=300&width=300",
    productCount: 15,
  },
]

export const featuredProducts = [
  {
    id: "prod1",
    name: "Lámpara Geométrica 3D",
    description:
      "Una elegante lámpara con diseño geométrico que crea patrones de luz únicos en tu espacio. Perfecta para dar un toque moderno a cualquier habitación.",
    price: 49.99,
    oldPrice: 69.99,
    rating: 4.8,
    reviewCount: 124,
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
    colors: [
      { name: "Blanco", hex: "#FFFFFF" },
      { name: "Negro", hex: "#000000" },
      { name: "Azul", hex: "#24A4B5" },
    ],
    category: {
      id: "cat1",
      name: "Decoración",
      slug: "decoracion",
    },
    material: {
      type: "PLA",
      finish: "Mate",
      strength: "Media",
      biodegradable: true,
    },
    dimensions: {
      height: "25 cm",
      width: "25 cm",
      depth: "25 cm",
      weight: "350 g",
    },
    reviews: [
      {
        author: "María G.",
        rating: 5,
        date: "12/04/2024",
        content: "Increíble lámpara, los patrones de luz que crea son preciosos. Muy satisfecha con la compra.",
      },
      {
        author: "Carlos R.",
        rating: 4,
        date: "28/03/2024",
        content: "Buen producto, aunque el montaje fue un poco complicado. Una vez instalada, queda genial.",
      },
    ],
  },
]

export const newArrivals = [
  {
    id: "prod2",
    name: "Organizador de Escritorio",
    description: "Mantén tu espacio de trabajo ordenado con este práctico organizador de escritorio impreso en 3D.",
    price: 24.99,
    rating: 4.5,
    reviewCount: 48,
    images: ["/placeholder.svg?height=300&width=300"],
    category: {
      id: "cat2",
      name: "Objetos Funcionales",
      slug: "funcional",
    },
  },
  {
    id: "prod3",
    name: "Maceta Geométrica",
    description: "Dale un toque moderno a tus plantas con esta maceta de diseño geométrico único.",
    price: 19.99,
    rating: 4.7,
    reviewCount: 36,
    images: ["/placeholder.svg?height=300&width=300"],
    category: {
      id: "cat1",
      name: "Decoración",
      slug: "decoracion",
    },
  },
  {
    id: "prod4",
    name: "Figura Dragón Articulado",
    description: "Impresionante figura de dragón con partes articuladas, perfecta para coleccionistas.",
    price: 34.99,
    rating: 4.9,
    reviewCount: 72,
    images: ["/placeholder.svg?height=300&width=300"],
    category: {
      id: "cat3",
      name: "Juguetes y Figuras",
      slug: "juguetes",
    },
  },
  {
    id: "prod5",
    name: "Soporte para Auriculares",
    description: "Práctico soporte para mantener tus auriculares organizados y a mano.",
    price: 14.99,
    rating: 4.6,
    reviewCount: 29,
    images: ["/placeholder.svg?height=300&width=300"],
    category: {
      id: "cat2",
      name: "Objetos Funcionales",
      slug: "funcional",
    },
  },
]

export const allProducts = [
  ...featuredProducts,
  ...newArrivals,
  {
    id: "prod6",
    name: "Llavero Personalizado",
    description: "Llavero único con tu nombre o iniciales, perfecto como regalo.",
    price: 9.99,
    rating: 4.4,
    reviewCount: 18,
    images: ["/placeholder.svg?height=300&width=300"],
    category: {
      id: "cat4",
      name: "Accesorios",
      slug: "accesorios",
    },
  },
  {
    id: "prod7",
    name: "Reloj de Pared Moderno",
    description: "Elegante reloj de pared con diseño moderno para decorar cualquier espacio.",
    price: 39.99,
    rating: 4.7,
    reviewCount: 42,
    images: ["/placeholder.svg?height=300&width=300"],
    category: {
      id: "cat1",
      name: "Decoración",
      slug: "decoracion",
    },
  },
  {
    id: "prod8",
    name: "Soporte para Tablet",
    description: "Soporte ajustable para tablet, ideal para ver películas o seguir recetas.",
    price: 17.99,
    rating: 4.5,
    reviewCount: 31,
    images: ["/placeholder.svg?height=300&width=300"],
    category: {
      id: "cat2",
      name: "Objetos Funcionales",
      slug: "funcional",
    },
  },
  {
    id: "prod9",
    name: "Pulsera Geométrica",
    description: "Elegante pulsera con diseño geométrico, ligera y resistente.",
    price: 12.99,
    rating: 4.3,
    reviewCount: 24,
    images: ["/placeholder.svg?height=300&width=300"],
    category: {
      id: "cat4",
      name: "Accesorios",
      slug: "accesorios",
    },
  },
]

export const cartItems = [
  {
    id: "prod1",
    name: "Lámpara Geométrica 3D",
    variant: "Blanco",
    price: 49.99,
    quantity: 1,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "prod3",
    name: "Maceta Geométrica",
    variant: "Verde",
    price: 19.99,
    quantity: 2,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "prod6",
    name: "Llavero Personalizado",
    variant: "Azul",
    price: 9.99,
    quantity: 1,
    image: "/placeholder.svg?height=100&width=100",
  },
]
