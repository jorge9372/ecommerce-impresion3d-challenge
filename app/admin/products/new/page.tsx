'use client'; // Esta página contendrá el Client Component del formulario y manejará su estado/envío

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProductForm from '@/components/admin/ProductForm';
import type { Category } from '@/app/generated/prisma/client';

export default function NewProductPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        // Obtener categorías para el selector
        const fetchCategories = async () => {
            try {
                const res = await fetch('/api/categories');
                if (!res.ok) throw new Error('Error al cargar categorías');
                const data = await res.json();
                setCategories(data);
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : 'Error desconocido'
                );
            }
        };
        fetchCategories();
    }, []);

    const handleSubmit = async (data: any) => {
        setIsSubmitting(true);
        setError(null);
        try {
            // Convertir price y stock a números
            const payload = {
                ...data,
                price: parseFloat(data.price),
                stock: parseInt(data.stock, 10),
                images: data.images.filter(
                    (img: { url: string }) => img.url.trim() !== ''
                ), // Enviar solo imágenes con URL
            };

            const res = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(
                    errorData.message || 'Error al crear el producto'
                );
            }

            // const newProduct = await res.json();
            alert('¡Producto creado exitosamente!'); // O un sistema de notificaciones más elegante
            router.push('/productos'); // Redirigir a la lista de productos del admin (si existe) o a donde quieras en este caso a products
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'Error desconocido al crear'
            );
            setIsSubmitting(false);
        }
        // No es necesario setIsSubmitting(false) aquí si hay redirección exitosa
    };

    if (error && categories.length === 0) {
        // Si hay error cargando categorías
        return (
            <div className="text-red-500 p-4">
                Error al cargar datos necesarios para el formulario: {error}
            </div>
        );
    }

    if (categories.length === 0 && !error) {
        return <div className="p-4">Cargando categorías...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6 text-indigo-700">
                Crear Nuevo Producto
            </h1>
            {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                    {error}
                </div>
            )}
            <ProductForm
                categories={categories}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                submitButtonText="Crear Producto"
            />
        </div>
    );
}
