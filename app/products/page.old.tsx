'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface Product {
    id: string;
    name: string;
    description: string | null;
    price: number | string;
    stock: number;
    material: string | null;
    color: string | null;
    dimensions: string | null;
    isActive: boolean;
    category: {
        id: string;
        name: string;
    };
    images: {
        id: string;
        url: string;
        altText: string | null;
        order: number;
    }[];
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('/api/products');
                if (!response.ok) {
                    throw new Error('Error al cargar los productos');
                }
                const data = await response.json();
                setProducts(data);
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : 'Error desconocido'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-red-500">Error: {error}</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Nuestros Productos</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                    <div
                        key={product.id}
                        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                    >
                        <div className="relative h-48 w-full">
                            {product.images && product.images.length > 0 ? (
                                <Image
                                    src={product.images[0].url}
                                    alt={
                                        product.images[0].altText ||
                                        product.name
                                    }
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                    <span className="text-gray-400">
                                        Sin imagen
                                    </span>
                                </div>
                            )}
                        </div>
                        <div className="p-4">
                            <h2 className="text-xl font-semibold mb-2">
                                {product.name}
                            </h2>
                            <p className="text-gray-600 mb-2 line-clamp-2">
                                {product.description || 'Sin descripción'}
                            </p>
                            <div className="flex justify-between items-center">
                                <span className="text-2xl font-bold text-blue-600">
                                    $
                                    {typeof product.price === 'string'
                                        ? Number(product.price).toFixed(2)
                                        : product.price.toFixed(2)}
                                </span>
                                <span className="text-sm text-gray-500">
                                    Stock: {product.stock}
                                </span>
                            </div>
                            <div className="mt-2">
                                <span className="text-sm text-gray-500">
                                    Categoría: {product.category.name}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
