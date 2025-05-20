'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import type {
    Category,
    Product,
    ProductImage as PrismaProductImage,
} from '@/app/generated/prisma';

interface FormImageType {
    id?: string; // ID de PrismaProductImage si ya existe
    url: string;
    altText?: string;
    order?: number;
    providerImageId?: string | null; // Para el fileId de ImageKit
    file?: File; // Para nuevas imágenes a subir
    isUploading?: boolean;
    uploadError?: string;
}

// El tipo de datos que el formulario enviará al backend para crear/actualizar ProductImages
export interface ProductImageSubmitData {
    id?: string; // Para identificar imágenes existentes en una actualización
    url: string;
    altText?: string | null;
    order?: number | null;
    providerImageId?: string | null;
}

// Tipo para los datos del formulario que se envían a onSubmit
export type ProductFormSubmitData = {
    name: string;
    description: string;
    price: string;
    stock: string;
    categoryId: string;
    material: string;
    color: string;
    dimensions: string;
    isActive: boolean;
    images: ProductImageSubmitData[]; // Array de datos de imagen para el backend
};

interface ProductFormProps {
    initialData?: Product & {
        images: PrismaProductImage[];
        category?: Category | null;
    };
    categories: Category[];
    onSubmit: (data: ProductFormSubmitData) => Promise<void>;
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
    const [formDataImages, setFormDataImages] = useState<FormImageType[]>(
        initialData?.images?.map((img) => ({
            id: img.id,
            url: img.url,
            altText: img.altText || '',
            order: img.order || undefined,
            providerImageId: img.providerImageId,
        })) || []
    );

    const [formProductData, setFormProductData] = useState({
        name: initialData?.name || '',
        description: initialData?.description || '',
        price: initialData?.price?.toString() || '',
        stock: initialData?.stock?.toString() || '0',
        categoryId: initialData?.categoryId || categories[0]?.id || '',
        material: initialData?.material || '',
        color: initialData?.color || '',
        dimensions: initialData?.dimensions || '',
        isActive:
            initialData?.isActive === undefined ? true : initialData.isActive,
    });

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            setFormProductData((prev) => ({
                ...prev,
                [name]: (e.target as HTMLInputElement).checked,
            }));
        } else {
            setFormProductData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleImageFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const filesToUpload = Array.from(e.target.files);

            const currentImageCount = formDataImages.length;
            const newImagePlaceholders: FormImageType[] = filesToUpload.map(
                (file, index) => ({
                    url: '',
                    altText: file.name,
                    order: currentImageCount + index + 1,
                    file: file,
                    isUploading: true,
                })
            );
            setFormDataImages((prev) => [...prev, ...newImagePlaceholders]);

            for (let i = 0; i < filesToUpload.length; i++) {
                const file = filesToUpload[i];

                const imageFormDataPayload = new FormData();
                imageFormDataPayload.append('file', file);

                try {
                    const res = await fetch('/api/upload', {
                        // Llama a tu endpoint de subida
                        method: 'POST',
                        body: imageFormDataPayload,
                    });

                    if (!res.ok) {
                        const errorData = await res.json();
                        throw new Error(
                            errorData.message || `Error al subir ${file.name}`
                        );
                    }
                    const uploadedImageData = await res.json();

                    setFormDataImages((prev) => {
                        const updatedImages = [...prev];
                        const targetImage = updatedImages.find(
                            (img) => img.file === file && img.isUploading
                        );
                        if (targetImage) {
                            targetImage.url = uploadedImageData.url;
                            targetImage.providerImageId =
                                uploadedImageData.fileId; // Guardar el fileId de ImageKit
                            targetImage.isUploading = false;
                            targetImage.file = undefined;
                            targetImage.uploadError = undefined;
                        }
                        return updatedImages;
                    });
                } catch (err) {
                    console.error(`Error subiendo ${file.name}:`, err);
                    setFormDataImages((prev) => {
                        const updatedImages = [...prev];
                        const targetImage = updatedImages.find(
                            (img) => img.file === file && img.isUploading
                        );
                        if (targetImage) {
                            targetImage.isUploading = false;
                            targetImage.uploadError =
                                err instanceof Error
                                    ? err.message
                                    : 'Error desconocido';
                        }
                        return updatedImages;
                    });
                }
            }
            // Limpiar el input de archivo para permitir subir el mismo archivo de nuevo si es necesario
            if (e.target) e.target.value = '';
        }
    };

    const updateImageDetail = (
        index: number,
        field: keyof FormImageType,
        value: string | number
    ) => {
        const newImages = [...formDataImages];
        if (!newImages[index]) return;

        if (field === 'order' && typeof value === 'string') {
            (newImages[index] as any)[field] = parseInt(value, 10) || undefined;
        } else if (
            field !== 'order' &&
            field !== 'file' &&
            field !== 'isUploading' &&
            field !== 'uploadError'
        ) {
            (newImages[index] as any)[field] = value as string;
        }
        setFormDataImages(newImages);
    };

    const removeImage = async (indexToRemove: number) => {
        const imageToRemove = formDataImages[indexToRemove];
        
        // Si la imagen ya fue subida al proveedor (tiene providerImageId), eliminarla
        if (imageToRemove.providerImageId) {
            try {
                const res = await fetch(`/api/upload/${imageToRemove.providerImageId}`, {
                    method: 'DELETE',
                });
                
                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.message || 'Error al eliminar la imagen del proveedor');
                }
            } catch (err) {
                console.error('Error al eliminar la imagen del proveedor:', err);
                // Aún así eliminamos la imagen del estado local
            }
        }
        
        // Eliminar la imagen del estado local
        setFormDataImages((prev) =>
            prev.filter((_, index) => index !== indexToRemove)
        );
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const imagesToSubmit = formDataImages
            .filter((img) => img.url && !img.isUploading && !img.uploadError) // Solo imágenes subidas y sin error
            .map((img) => ({
                id: img.id, // Para actualizar imágenes existentes
                url: img.url,
                altText: img.altText,
                order: img.order,
                providerImageId: img.providerImageId, // Enviar el fileId de ImageKit
            }));

        const dataToSubmit: ProductFormSubmitData = {
            ...formProductData,
            images: imagesToSubmit,
        };
        await onSubmit(dataToSubmit);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-6 bg-white p-8 rounded-lg shadow-md"
        >
            <div>
                <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                >
                    Nombre del Producto
                </label>
                <input
                    type="text"
                    name="name"
                    id="name"
                    value={formProductData.name}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
            </div>

            <div>
                <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700"
                >
                    Descripción
                </label>
                <textarea
                    name="description"
                    id="description"
                    value={formProductData.description}
                    onChange={handleChange}
                    rows={4}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label
                        htmlFor="price"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Precio
                    </label>
                    <input
                        type="number"
                        name="price"
                        id="price"
                        value={formProductData.price}
                        onChange={handleChange}
                        required
                        step="0.01"
                        min="0"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label
                        htmlFor="stock"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Stock
                    </label>
                    <input
                        type="number"
                        name="stock"
                        id="stock"
                        value={formProductData.stock}
                        onChange={handleChange}
                        required
                        step="1"
                        min="0"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
            </div>

            <div>
                <label
                    htmlFor="categoryId"
                    className="block text-sm font-medium text-gray-700"
                >
                    Categoría
                </label>
                <select
                    name="categoryId"
                    id="categoryId"
                    value={formProductData.categoryId}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                    <option value="">Selecciona una categoría</option>
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
                        className="block text-sm font-medium text-gray-700"
                    >
                        Material
                    </label>
                    <input
                        type="text"
                        name="material"
                        id="material"
                        value={formProductData.material}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label
                        htmlFor="color"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Color
                    </label>
                    <input
                        type="text"
                        name="color"
                        id="color"
                        value={formProductData.color}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label
                        htmlFor="dimensions"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Dimensiones
                    </label>
                    <input
                        type="text"
                        name="dimensions"
                        id="dimensions"
                        value={formProductData.dimensions}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
            </div>

            <div className="space-y-4 border-t pt-6 mt-6">
                <h3 className="text-md font-medium text-gray-900">
                    Imágenes del Producto
                </h3>
                <div>
                    <label
                        htmlFor="imageUpload"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Subir nuevas imágenes
                    </label>
                    <input
                        type="file"
                        id="imageUpload"
                        multiple
                        onChange={handleImageFileChange}
                        accept="image/png, image/jpeg, image/webp, image/gif"
                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                    />
                </div>

                {formDataImages.map((image, index) => (
                    <div
                        key={
                            image.id ||
                            `new-${index}-${image.file?.name || 'placeholder'}-${Date.now()}-${Math.random()}`
                        }
                        className="p-3 border rounded-md space-y-3 relative"
                    >
                        {image.isUploading && (
                            <div className="text-xs text-blue-500 animate-pulse">
                                Subiendo {image.altText}...
                            </div>
                        )}
                        {image.uploadError && (
                            <div className="text-xs text-red-500">
                                Error: {image.uploadError}
                            </div>
                        )}

                        {image.url &&
                            !image.isUploading &&
                            !image.uploadError && (
                                <img
                                    src={image.url}
                                    alt={image.altText || 'Vista previa'}
                                    className="w-32 h-32 object-cover rounded-md mb-2"
                                />
                            )}
                        {!image.url &&
                            !image.isUploading &&
                            !image.uploadError &&
                            image.file && (
                                <div className="text-xs text-gray-500">
                                    Pendiente de subir: {image.altText}
                                </div>
                            )}

                        <div>
                            <label
                                htmlFor={`imageAlt-${index}`}
                                className="text-sm font-medium text-gray-700"
                            >
                                Texto Alternativo {index + 1}
                            </label>
                            <input
                                type="text"
                                id={`imageAlt-${index}`}
                                value={image.altText || ''}
                                onChange={(e) =>
                                    updateImageDetail(
                                        index,
                                        'altText',
                                        e.target.value
                                    )
                                }
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                disabled={image.isUploading}
                            />
                        </div>
                        <div>
                            <label
                                htmlFor={`imageOrder-${index}`}
                                className="text-sm font-medium text-gray-700"
                            >
                                Orden {index + 1}
                            </label>
                            <input
                                type="number"
                                id={`imageOrder-${index}`}
                                value={image.order || ''}
                                onChange={(e) =>
                                    updateImageDetail(
                                        index,
                                        'order',
                                        parseInt(e.target.value, 10)
                                    )
                                }
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                min="1"
                                disabled={image.isUploading}
                            />
                        </div>
                        <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 text-xs text-red-500 hover:text-red-700 p-1 bg-white rounded-full shadow disabled:opacity-50"
                            disabled={image.isUploading}
                        >
                            ✕
                        </button>
                    </div>
                ))}
            </div>

            <div className="flex items-center">
                <input
                    id="isActive"
                    name="isActive"
                    type="checkbox"
                    checked={formProductData.isActive}
                    onChange={handleChange}
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
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
                    type="submit"
                    disabled={
                        isSubmitting ||
                        formDataImages.some((img) => !!img.isUploading)
                    }
                    className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                    {isSubmitting ? 'Guardando...' : submitButtonText}
                </button>
            </div>
        </form>
    );
}
