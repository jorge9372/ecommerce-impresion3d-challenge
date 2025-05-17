import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, Heart, Share2, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProductCard from "@/components/product-card"
import prisma from "@/lib/prisma"

async function getProduct(id: string) {
    const product = await prisma.product.findUnique({
        where: { id },
        include: {
            category: true,
            images: {
                orderBy: {
                    order: 'asc'
                }
            }
        }
    });

    if (!product) {
        throw new Error('Producto no encontrado');
    }

    return {
        id: product.id,
        name: product.name,
        description: product.description,
        price: Number(product.price),
        images: product.images.map(img => img.url),
        categoryId: product.categoryId,
        category: {
            name: product.category.name,
            slug: product.category.slug
        },
        material: product.material,
        color: product.color,
        dimensions: product.dimensions
    };
}

async function getRelatedProducts(categoryId: string, currentProductId: string) {
    const products = await prisma.product.findMany({
        where: {
            categoryId,
            id: { not: currentProductId },
            isActive: true
        },
        include: {
            category: true,
            images: {
                orderBy: {
                    order: 'asc'
                },
                take: 1
            }
        },
        take: 4
    });

    return products.map(product => ({
        id: product.id,
        name: product.name,
        description: product?.description || '',
        price: Number(product.price),
        images: product.images.map(img => img.url),
        category: {
            name: product.category.name,
            slug: product.category.slug
        }
    }));
}

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
    const product = await getProduct(params.id);
    const relatedProducts = await getRelatedProducts(product.categoryId, product.id);

    return (
        <main className="flex-1 py-10">
            <div className="container mx-auto px-4">
                {/* Breadcrumbs */}
                <nav className="flex mb-8 text-sm">
                    <ol className="flex items-center space-x-1">
                        <li>
                            <Link href="/" className="text-gray-500 hover:text-brand-primary">
                                Inicio
                            </Link>
                        </li>
                        <li className="flex items-center space-x-1">
                            <span className="text-gray-400">/</span>
                            <Link href="/productos" className="text-gray-500 hover:text-brand-primary">
                                Productos
                            </Link>
                        </li>
                        <li className="flex items-center space-x-1">
                            <span className="text-gray-400">/</span>
                            <Link href={`/categorias/${product.category.slug}`} className="text-gray-500 hover:text-brand-primary">
                                {product.category.name}
                            </Link>
                        </li>
                        <li className="flex items-center space-x-1">
                            <span className="text-gray-400">/</span>
                            <span className="text-gray-900 font-medium">{product.name}</span>
                        </li>
                    </ol>
                </nav>

                {/* Product Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    {/* Product Images */}
                    <div className="space-y-4">
                        <div className="aspect-square relative rounded-lg overflow-hidden">
                            <Image
                                src={product.images[0] || "/placeholder.svg"}
                                alt={product.name}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                            {product.images.slice(1).map((image, index) => (
                                <div key={index} className="aspect-square relative rounded-lg overflow-hidden">
                                    <Image
                                        src={image}
                                        alt={`${product.name} - Vista ${index + 2}`}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                            <p className="text-2xl font-semibold text-brand-primary">€{product.price.toFixed(2)}</p>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="icon">
                                    <Minus className="h-4 w-4" />
                                </Button>
                                <span className="w-8 text-center">1</span>
                                <Button variant="outline" size="icon">
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                            <Button className="flex-1 bg-brand-primary hover:bg-brand-primary/90">
                                Añadir al Carrito
                            </Button>
                            <Button variant="outline" size="icon">
                                <Heart className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon">
                                <Share2 className="h-4 w-4" />
                            </Button>
                        </div>

                        <Tabs defaultValue="description">
                            <TabsList>
                                <TabsTrigger value="description">Descripción</TabsTrigger>
                                <TabsTrigger value="specs">Especificaciones</TabsTrigger>
                                <TabsTrigger value="reviews">Reseñas</TabsTrigger>
                            </TabsList>
                            <TabsContent value="description" className="mt-4">
                                <p className="text-gray-600">{product.description}</p>
                            </TabsContent>
                            <TabsContent value="specs" className="mt-4">
                                <dl className="space-y-4">
                                    <div>
                                        <dt className="font-medium text-gray-900">Material</dt>
                                        <dd className="mt-1 text-gray-600">{product.material}</dd>
                                    </div>
                                    <div>
                                        <dt className="font-medium text-gray-900">Color</dt>
                                        <dd className="mt-1 text-gray-600">{product.color}</dd>
                                    </div>
                                    <div>
                                        <dt className="font-medium text-gray-900">Dimensiones</dt>
                                        <dd className="mt-1 text-gray-600">{product.dimensions}</dd>
                                    </div>
                                </dl>
                            </TabsContent>
                            <TabsContent value="reviews" className="mt-4">
                                <p className="text-gray-600">No hay reseñas aún.</p>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>

                {/* Related Products */}
                <div className="mt-16">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8">Productos Relacionados</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {relatedProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            </div>
        </main>
    )
}
