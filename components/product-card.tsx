import Image from "next/image"
import Link from "next/link"
import { ShoppingCart, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: {
    name: string;
    slug: string;
  };
}

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group relative">
      <div className="aspect-square overflow-hidden rounded-lg bg-gray-100 group-hover:opacity-75">
        <Link href={`/productos/${product.id}`}>
          <Image
            src={product.images[0] || "/placeholder.svg"}
            alt={product.name}
            width={300}
            height={300}
            className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
        <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button size="icon" variant="secondary" className="rounded-full bg-white shadow-md">
            <Heart className="h-4 w-4 text-gray-600" />
          </Button>
        </div>
      </div>
      <div className="mt-4 flex justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-900">
            <Link href={`/productos/${product.id}`}>{product.name}</Link>
          </h3>
          <p className="mt-1 text-sm text-gray-500">{product.category.name}</p>
        </div>
        <p className="text-sm font-medium text-brand-primary">€{product.price.toFixed(2)}</p>
      </div>
      <Button
        className="mt-3 w-full bg-brand-primary hover:bg-brand-primary/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        size="sm"
      >
        <ShoppingCart className="mr-2 h-4 w-4" />
        Añadir al Carrito
      </Button>
    </div>
  )
}
