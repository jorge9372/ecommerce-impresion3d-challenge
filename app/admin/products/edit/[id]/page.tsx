'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation'; // useParams para obtener el ID
import ProductForm from '@/components/admin/ProductForm';
import type {
    Category,
    Product,
    ProductImage,
} from '@/app/generated/prisma/client';

type ProductWithDetails = Product & {
    images: ProductImage[];
    category?: Category;
};

export default function EditProductPage() {
    const router = useRouter();
    const params = useParams(); // Hook para obtener los parámetros de la ruta
    const productId = params.id as string; // El ID del producto de la URL

    const [product, setProduct] = useState<ProductWithDetails | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!productId) return;

        const fetchData = async () => {
            setIsLoading(true);
            try {
                // Obtener datos del producto a editar
                const productRes = await fetch(`/api/products/${productId}`);
                if (!productRes.ok) {
                    if (productRes.status === 404)
                        throw new Error('Producto no encontrado');
                    throw new Error('Error al cargar el producto');
                }
                const productData = await productRes.json();
                setProduct(productData);

                // Obtener categorías
                const categoriesRes = await fetch('/api/categories');
                if (!categoriesRes.ok)
                    throw new Error('Error al cargar categorías');
                const categoriesData = await categoriesRes.json();
                setCategories(categoriesData);
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : 'Error desconocido'
                );
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [productId]);

    const handleSubmit = async (data: any) => {
        // 'any' temporal
        setIsSubmitting(true);
        setError(null);
        try {
            const payload = {
                ...data,
                price: parseFloat(data.price),
                stock: parseInt(data.stock, 10),
                images: data.images.filter(
                    (img: { url: string }) => img.url.trim() !== ''
                ),
            };

            const res = await fetch(`/api/products/${productId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(
                    errorData.message || 'Error al actualizar el producto'
                );
            }
            alert('¡Producto actualizado exitosamente!');
            router.push('/products'); // O a donde quieras redirigir
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'Error desconocido al actualizar'
            );
            setIsSubmitting(false);
        }
    };

    if (isLoading)
        return <div className="p-4">Cargando datos del producto...</div>;
    if (error) return <div className="text-red-500 p-4">{error}</div>;
    if (!product)
        return (
            <div className="p-4">Producto no encontrado o error al cargar.</div>
        ); // Puede que el error ya lo haya capturado

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6 text-indigo-700">
                Editar Producto: {product.name}
            </h1>
            {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                    {error}
                </div>
            )}
            <ProductForm
                initialData={product}
                categories={categories}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                submitButtonText="Actualizar Producto"
            />
        </div>
    );
}
