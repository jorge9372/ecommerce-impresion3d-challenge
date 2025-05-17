import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/product-card';
import CategoryCard from '@/components/category-card';
import FeaturedProduct from '@/components/featured-product';
import prisma from '@/lib/prisma';

async function getFeaturedProducts() {
    const products = await prisma.product.findMany({
        where: { isActive: true },
        include: {
            category: true,
            images: {
                orderBy: {
                    order: 'asc',
                },
            },
        },
        take: 4,
        orderBy: {
            createdAt: 'desc',
        },
    });

    return products.map((product) => ({
        id: product.id,
        name: product.name,
        description: product.description,
        price: Number(product.price),
        images: product.images.map((img) => img.url),
        category: {
            name: product.category.name,
            slug: product.category.slug,
        },
    }));
}

async function getCategories() {
    const categories = await prisma.category.findMany({
        include: {
            _count: {
                select: {
                    products: true,
                },
            },
        },
    });

    return categories.map((category) => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
        image: '/placeholder.svg?height=300&width=300',
        productCount: category._count.products,
    }));
}

async function getNewArrivals() {
    const products = await prisma.product.findMany({
        where: { isActive: true },
        include: {
            category: true,
            images: {
                orderBy: {
                    order: 'asc',
                },
                take: 1,
            },
        },
        take: 4,
        orderBy: {
            createdAt: 'desc',
        },
    });

    return products.map((product) => ({
        id: product.id,
        name: product.name,
        description: product?.description || '',
        price: Number(product.price),
        images: product.images.map((img) => img.url),
        category: {
            name: product.category.name,
            slug: product.category.slug,
        },
    }));
}

export default async function Home() {
    const [featuredProducts, categories, newArrivals] = await Promise.all([
        getFeaturedProducts(),
        getCategories(),
        getNewArrivals(),
    ]);

    return (
        <main className="flex-1">
            {/* Hero Section */}
            <section className="relative h-[600px] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/90 to-brand-primary/70 z-10" />
                <Image
                    src="/images/hero-3d-print.jpg"
                    alt="Impresión 3D de alta calidad"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="relative z-20 container mx-auto px-4 h-full flex flex-col justify-center">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 max-w-2xl">
                        Diseños únicos creados con tecnología de impresión 3D
                    </h1>
                    <p className="text-xl text-white/90 mb-8 max-w-xl">
                        Descubre nuestra colección de productos innovadores,
                        funcionales y artísticos
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <Button
                            size="lg"
                            className="bg-destructive hover:bg-brand-vibrant/90 text-white"
                        >
                            Descubre la Colección
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="bg-white/10 text-white border-white/30 hover:bg-white/20"
                        >
                            Sobre Nosotros
                        </Button>
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-3xl font-bold text-brand-primary">
                            Categorías
                        </h2>
                        <Link
                            href="/productos"
                            className="text-brand-fresh hover:text-brand-fresh/80 flex items-center"
                        >
                            Ver todas <ChevronRight className="h-4 w-4 ml-1" />
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {categories.map((category) => (
                            <CategoryCard
                                key={category.id}
                                category={category}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products Section */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-3xl font-bold text-brand-primary">
                            Productos Destacados
                        </h2>
                        <Link
                            href="/productos"
                            className="text-brand-fresh hover:text-brand-fresh/80 flex items-center"
                        >
                            Ver todos <ChevronRight className="h-4 w-4 ml-1" />
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {featuredProducts.map((product) => (
                            <FeaturedProduct
                                key={product.id}
                                product={product}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* New Arrivals Section */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-3xl font-bold text-brand-primary">
                            Novedades
                        </h2>
                        <Link
                            href="/productos"
                            className="text-brand-fresh hover:text-brand-fresh/80 flex items-center"
                        >
                            Ver todas <ChevronRight className="h-4 w-4 ml-1" />
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {newArrivals.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
