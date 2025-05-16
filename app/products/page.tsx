import prisma from '@/lib/prisma';
import ProductCard, { type ProductForCard } from '@/components/ProductCard';



async function getProducts(): Promise<ProductForCard[]> {
    const productsFromDb = await prisma.product.findMany({
        where: { isActive: true }, // Solo mostrar productos activos
        include: {
            category: {
                select: { name: true }, // Solo necesitamos el nombre de la categoría
            },
            images: {
                where: { order: 1 }, // Intentar obtener la imagen principal
                take: 1, // Solo tomar una imagen
                select: { url: true, altText: true },
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    // Mapeamos al tipo ProductForCard, asegurando que price sea un número
    return productsFromDb.map((p) => ({
        id: p.id,
        name: p.name,
        price: Number(p.price),
        // Lógica mejorada para imagen:
        images:
            p.images.length > 0
                ? p.images.map((img) => ({
                      url: img.url,
                      altText: img.altText,
                  }))
                : [
                      {
                          url: 'https://dummyimage.com/600x400/000/fff.png&text=Sin+Imagen',
                          altText: 'Producto sin imagen',
                      },
                  ],
        category: p.category ? { name: p.category.name } : null,
    }));
}

// El ProductCard Component (lo moveremos a su propio archivo después)

export default async function ProductsPage() {
    const products = await getProducts();

    if (products.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
                    Nuestro Catálogo
                </h1>
                <p className="text-center text-gray-600">
                    Aún no hay productos disponibles. ¡Vuelve pronto!
                </p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-extrabold text-center text-gray-600 mb-4">
                Nuestro Catálogo
            </h1>
            <div className="w-24 h-1 bg-indigo-600 mx-auto mb-12"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
}
