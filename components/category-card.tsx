import Image from "next/image"
import Link from "next/link"

interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  productCount: number;
}

export default function CategoryCard({ category }: { category: Category }) {
  return (
    <Link href={`/categorias/${category.slug}`} className="group">
      <div className="relative aspect-square overflow-hidden rounded-lg">
        <Image
          src={category.image || "/placeholder.svg"}
          alt={category.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/70 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-xl font-bold text-white">{category.name}</h3>
          <p className="text-sm text-white/80">{category.productCount} productos</p>
        </div>
      </div>
    </Link>
  )
}
