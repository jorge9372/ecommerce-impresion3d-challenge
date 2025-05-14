// components/ProductCard.tsx
import Link from 'next/link';
import Image from 'next/image';


export interface ProductForCard {
    id: string;
    name: string;
    price: number;
    images: { url: string; altText?: string | null }[];
    category?: { name: string } | null;
    // slug?: string;
}

interface ProductCardProps {
    product: ProductForCard;
}

export default function ProductCard({ product }: ProductCardProps) {
    // Tomar la primera imagen, o una por defecto si no hay
    const displayImage =
        product.images && product.images.length > 0
            ? product.images[0]
            : {
                  url: 'https://via.placeholder.com/300x200.png?text=No+Image',
                  altText: 'Producto sin imagen disponible',
              };

    return (
        <Link
            href={`/products/${product.id}`} // Más adelante, esta será la página de detalle del producto
            className="group block border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out bg-white"
        >
            <div className="relative w-full aspect-[4/3] bg-gray-100">
                {' '}
                {/* aspect-ratio para la imagen */}
                <Image
                    src={displayImage.url}
                    alt={displayImage.altText || product.name}
                    fill
                    style={{ objectFit: 'cover' }}
                    className="group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw" // Ayuda a Next/Image a optimizar
                />
            </div>
            <div className="p-4">
                {product.category && (
                    <span className="text-xs font-medium text-gray-600 mb-1 inline-block tracking-wide uppercase">
                        {product.category.name}
                    </span>
                )}
                <h3 className="text-md font-bold text-gray-800 mb-1 truncate group-hover:text-indigo-700 transition-colors">
                    {product.name}
                </h3>
                <p className="text-lg font-bold text-indigo-700">
                    ${product.price.toFixed(2)}
                </p>
                {/* Botón (para el futuro) */}
                {/* <button className="mt-3 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors">
          Añadir al Carrito
        </button> */}
            </div>
        </Link>
    );
}
