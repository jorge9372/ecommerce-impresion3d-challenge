import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  oldPrice?: number;
  images: string[];
  category: {
    name: string;
    slug: string;
  };
}

export default function FeaturedProduct({ product }: { product: Product }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-gray-50 rounded-lg overflow-hidden">
      <div className="relative aspect-square md:aspect-auto md:h-full">
        <Image src={product.images[0] || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
      </div>
      <div className="p-8">
        <div className="inline-block px-3 py-1 bg-brand-fresh/10 text-brand-fresh text-sm font-medium rounded-full mb-4">
          Producto Destacado
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{product.name}</h2>
        <p className="text-gray-600 mb-6">{product.description}</p>
        <div className="flex items-center mb-6">
          <div className="text-2xl font-bold text-brand-primary mr-4">€{product.price.toFixed(2)}</div>
          {product.oldPrice && <div className="text-lg text-gray-500 line-through">€{product.oldPrice.toFixed(2)}</div>}
        </div>
        <div className="flex flex-wrap gap-4">
          <Button className="bg-brand-primary hover:bg-brand-primary/90">
            <ShoppingCart className="mr-2 h-4 w-4" />
            Añadir al Carrito
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/productos/${product.id}`} className="flex items-center">
              Ver Detalles
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
