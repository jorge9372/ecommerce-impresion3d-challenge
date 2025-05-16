'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import type { Category, Product, ProductImage } from '@/app/generated/prisma'; // Importa tus tipos

// Tipo para los datos del formulario, incluyendo imágenes
type ProductFormData = {
    name: string;
    description: string;
    price: string; // El input será string, convertiremos a número al enviar
    stock: string; // Igual que el precio
    categoryId: string;
    material: string;
    color: string;
    dimensions: string;
    isActive: boolean;
    images: { url: string; altText?: string; order?: number }[];
};

interface ProductFormProps {
    initialData?: Product & { images: ProductImage[]; category?: Category }; // Para el modo edición
    categories: Category[]; // Para el selector de categorías
    onSubmit: (data: ProductFormData) => Promise<void>;
    isSubmitting: boolean;
    submitButtonText?: string;
}

export default function ProductForm({
    initialData,
    categories,
    onSubmit,
    isSubmitting,
    submitButtonText = 'Guardar Producto',
}: ProductFormProps) {
    const [formData, setFormData] = useState<ProductFormData>({
        name: initialData?.name || '',
        description: initialData?.description || '',
        price: initialData?.price?.toString() || '', // Convertir Decimal a string
        stock: initialData?.stock?.toString() || '0',
        categoryId: initialData?.categoryId || categories[0]?.id || '',
        material: initialData?.material || '',
        color: initialData?.color || '',
        dimensions: initialData?.dimensions || '',
        isActive:
            initialData?.isActive === undefined ? true : initialData.isActive,
        images: initialData?.images?.map((img) => ({
            url: img.url,
            altText: img.altText || '',
            order: img.order || undefined,
        })) || [{ url: '', altText: '', order: 1 }],
    });

    const router = useRouter();

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            setFormData((prev) => ({
                ...prev,
                [name]: (e.target as HTMLInputElement).checked,
            }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleImageChange = (
        index: number,
        field: keyof ProductFormData['images'][0],
        value: string | number
    ) => {
        const newImages = [...formData.images];
        // Asegurarse de que el objeto newImages[index] exista
        if (!newImages[index])
            newImages[index] = { url: '', altText: '', order: index + 1 };

        if (field === 'order' && typeof value === 'string') {
            newImages[index][field] = parseInt(value, 10) || undefined;
        } else if (field !== 'order') {
            newImages[index][
                field as Exclude<keyof ProductFormData['images'][0], 'order'>
            ] = value as string;
        }

        setFormData((prev) => ({ ...prev, images: newImages }));
    };

    const addImageField = () => {
        setFormData((prev) => ({
            ...prev,
            images: [
                ...prev.images,
                { url: '', altText: '', order: prev.images.length + 1 },
            ],
        }));
    };

    const removeImageField = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        await onSubmit(formData);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-6 bg-white p-8 rounded-lg shadow-md"
        >
            <div>
                <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-900"
                >
                    Nombre del Producto
                </label>
                <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-500 text-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
            </div>

            <div>
                <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-900"
                >
                    Descripción
                </label>
                <textarea
                    name="description"
                    id="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="mt-1 block w-full px-3 py-2 border border-gray-500 text-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label
                        htmlFor="price"
                        className="block text-sm font-medium text-gray-900"
                    >
                        Precio
                    </label>
                    <input
                        type="number"
                        name="price"
                        id="price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                        step="0.01"
                        min="0"
                        className="mt-1 block w-full px-3 py-2 border border-gray-500 text-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label
                        htmlFor="stock"
                        className="block text-sm font-medium text-gray-900"
                    >
                        Stock
                    </label>
                    <input
                        type="number"
                        name="stock"
                        id="stock"
                        value={formData.stock}
                        onChange={handleChange}
                        required
                        step="1"
                        min="0"
                        className="mt-1 block w-full px-3 py-2 border border-gray-500 text-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>
            </div>

            <div>
                <label
                    htmlFor="categoryId"
                    className="block text-sm font-medium text-gray-900"
                >
                    Categoría
                </label>
                <select
                    name="categoryId"
                    id="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-500 text-gray-500 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                            {cat.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <label
                        htmlFor="material"
                        className="block text-sm font-medium text-gray-900"
                    >
                        Material
                    </label>
                    <input
                        type="text"
                        name="material"
                        id="material"
                        value={formData.material}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-500 text-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label
                        htmlFor="color"
                        className="block text-sm font-medium text-gray-900"
                    >
                        Color
                    </label>
                    <input
                        type="text"
                        name="color"
                        id="color"
                        value={formData.color}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-500 text-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label
                        htmlFor="dimensions"
                        className="block text-sm font-medium text-gray-900"
                    >
                        Dimensiones
                    </label>
                    <input
                        type="text"
                        name="dimensions"
                        id="dimensions"
                        value={formData.dimensions}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-500 text-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-md font-medium text-gray-900">
                    Imágenes del Producto
                </h3>
                {formData.images.map((image, index) => (
                    <div
                        key={index}
                        className="p-3 border rounded-md space-y-2"
                    >
                        <div>
                            <label
                                htmlFor={`imageUrl-${index}`}
                                className="text-sm text-gray-900"
                            >
                                URL Imagen {index + 1}
                            </label>
                            <input
                                type="url"
                                id={`imageUrl-${index}`}
                                value={image.url}
                                onChange={(e) =>
                                    handleImageChange(
                                        index,
                                        'url',
                                        e.target.value
                                    )
                                }
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-500 text-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="https://ejemplo.com/imagen.jpg"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor={`imageAlt-${index}`}
                                className="text-sm text-gray-900"
                            >
                                Texto Alternativo {index + 1}
                            </label>
                            <input
                                type="text"
                                id={`imageAlt-${index}`}
                                value={image.altText || ''}
                                onChange={(e) =>
                                    handleImageChange(
                                        index,
                                        'altText',
                                        e.target.value
                                    )
                                }
                                className="mt-1 block w-full px-3 py-2 border border-gray-500 text-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor={`imageOrder-${index}`}
                                className="text-sm text-gray-900"
                            >
                                Orden {index + 1}
                            </label>
                            <input
                                type="number"
                                id={`imageOrder-${index}`}
                                value={image.order || ''}
                                onChange={(e) =>
                                    handleImageChange(
                                        index,
                                        'order',
                                        parseInt(e.target.value, 10)
                                    )
                                }
                                className="mt-1 block w-full px-3 py-2 border border-gray-500 text-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                min="1"
                            />
                        </div>
                        {formData.images.length > 1 && (
                            <button
                                type="button"
                                onClick={() => removeImageField(index)}
                                className="text-xs text-red-600 hover:text-red-800 font-medium"
                            >
                                Eliminar Imagen
                            </button>
                        )}
                    </div>
                ))}
                <button
                    type="button"
                    onClick={addImageField}
                    className="text-sm py-2 px-3 border border-dashed border-gray-400 rounded-md text-gray-700 hover:bg-gray-50 hover:border-blue-500 hover:text-blue-600 transition-colors"
                >
                    + Añadir otra imagen
                </button>
            </div>

            <div className="flex items-center">
                <input
                    id="isActive"
                    name="isActive"
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 border-gray-500 rounded focus:ring-blue-500"
                />
                <label
                    htmlFor="isActive"
                    className="ml-2 block text-sm text-gray-900"
                >
                    Producto Activo
                </label>
            </div>

            <div className="flex justify-end space-x-3">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="py-2 px-4 border border-gray-500 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-blue-500 hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
                >
                    {isSubmitting ? 'Guardando...' : submitButtonText}
                </button>
            </div>
        </form>
    );
}
