import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';

// Esquema Zod para la actualización (permite campos opcionales)
const ProductImageUpdateSchema = z.object({
    url: z.string().url({ message: 'La URL de la imagen debe ser válida.' }),
    altText: z.string().optional(),
    order: z.number().int().positive().optional(),
});

const UpdateProductSchema = z.object({
    name: z
        .string()
        .min(3, { message: 'El nombre debe tener al menos 3 caracteres.' })
        .optional(),
    description: z.string().optional().nullable(),
    price: z
        .number()
        .positive({ message: 'El precio debe ser un número positivo.' })
        .optional(),
    stock: z
        .number()
        .int()
        .nonnegative({ message: 'El stock debe ser un entero no negativo.' })
        .optional(),
    categoryId: z
        .string()
        .uuid({ message: 'El ID de la categoría debe ser un UUID válido.' })
        .optional(),
    material: z.string().optional().nullable(),
    color: z.string().optional().nullable(),
    dimensions: z.string().optional().nullable(),
    isActive: z.boolean().optional(),
    images: z.array(ProductImageUpdateSchema).optional(), // Permite actualizar el array de imágenes
});

/**
 * GET /api/products/[id]
 * Obtiene un producto específico por su ID.
 */
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const resolvedParams = await params;
        const { id } = resolvedParams;
        const product = await prisma.product.findUnique({
            where: { id },
            include: {
                category: true,
                images: { orderBy: { order: 'asc' } },
            },
        });

        if (!product) {
            return NextResponse.json(
                { message: 'Producto no encontrado' },
                { status: 404 }
            );
        }
        return NextResponse.json(product);
    } catch (error) {
        console.error('Error al obtener el producto:', error);
        const errorMessage =
            error instanceof Error
                ? error.message
                : 'Ocurrió un error desconocido.';
        return NextResponse.json(
            { message: 'Error al obtener el producto', error: errorMessage },
            { status: 500 }
        );
    }
}

/**
 * PUT /api/products/[id]
 * Actualiza un producto específico por su ID.
 */
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const resolvedParams = await params;
        const { id } = resolvedParams;
        const requestData = await request.json();

        // Validación con Zod (recomendado)
        const validationResult = UpdateProductSchema.safeParse(requestData);
        if (!validationResult.success) {
            return NextResponse.json(
                {
                    message: 'Error de validación.',
                    errors: validationResult.error.flatten().fieldErrors,
                },
                { status: 400 }
            );
        }

        const dataToUpdate = validationResult.data;

        // Si se proporciona categoryId, verificar que exista
        if (dataToUpdate.categoryId) {
            const categoryExists = await prisma.category.findUnique({
                where: { id: dataToUpdate.categoryId },
            });
            if (!categoryExists) {
                return NextResponse.json(
                    {
                        message: `La categoría con ID ${dataToUpdate.categoryId} no fue encontrada.`,
                    },
                    { status: 404 }
                );
            }
        }

        // Lógica para actualizar el producto
        const updatedProduct = await prisma.product.update({
            where: { id },
            data: {
                name: dataToUpdate.name,
                description: dataToUpdate.description,
                price: dataToUpdate.price,
                stock: dataToUpdate.stock,
                categoryId: dataToUpdate.categoryId,
                material: dataToUpdate.material,
                color: dataToUpdate.color,
                dimensions: dataToUpdate.dimensions,
                isActive: dataToUpdate.isActive,
                // Manejo de imágenes: Si se envía el campo 'images' en el payload,
                // esta lógica reemplazará todas las imágenes existentes del producto.
                // Si 'images' no se envía, las imágenes existentes no se modifican.
                // Si se envía 'images: []' (array vacío), se borrarán todas las imágenes.
                ...(dataToUpdate.images !== undefined && {
                    // Solo modificar imágenes si el campo 'images' está presente
                    images: {
                        deleteMany: {}, // Borra todas las imágenes asociadas existentes
                        create: dataToUpdate.images.map((img) => ({
                            // Crea las nuevas imágenes
                            url: img.url,
                            altText:
                                img.altText ||
                                dataToUpdate.name ||
                                'Imagen de producto',
                            order: img.order || 1,
                        })),
                    },
                }),
            },
            include: {
                category: true,
                images: { orderBy: { order: 'asc' } },
            },
        });

        return NextResponse.json(updatedProduct);
    } catch (error: any) {
        console.error('Error al actualizar el producto:', error);
        if (error.code === 'P2025') {
            // Error de Prisma: Registro a actualizar no encontrado
            return NextResponse.json(
                { message: 'Producto no encontrado para actualizar' },
                { status: 404 }
            );
        }
        // Manejar otros errores específicos de Prisma si es necesario
        const errorMessage =
            error instanceof Error
                ? error.message
                : 'Ocurrió un error desconocido.';
        return NextResponse.json(
            { message: 'Error al actualizar el producto', error: errorMessage },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/products/[id]
 * Elimina un producto específico por su ID.
 */
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const resolvedParams = await params;
        const { id } = resolvedParams;

        // Antes de borrar el producto, es buena práctica verificar si existe
        const productExists = await prisma.product.findUnique({
            where: { id },
        });
        if (!productExists) {
            return NextResponse.json(
                { message: 'Producto no encontrado para eliminar' },
                { status: 404 }
            );
        }

        // Consideraciones para la eliminación:
        // 1. ProductImages: Si en tu schema.prisma, la relación en ProductImage tiene `onDelete: Cascade`
        //    para el campo `product`, entonces las imágenes se borrarán automáticamente.
        //    Ej: model ProductImage { ... product Product @relation(fields: [productId], references: [id], onDelete: Cascade) ... }
        //    Si no es Cascade (es Restrict, el default), y hay ProductImages, este delete fallará.
        //    En ese caso, tendrías que borrar ProductImages primero: await prisma.productImage.deleteMany({ where: { productId: id } });
        //
        // 2. OrderItems: Si este producto está en algún OrderItem, la eliminación fallará debido a la
        //    restricción de clave foránea (a menos que OrderItem.productId también tenga onDelete: Cascade o SetNull).
        //    Esto es generalmente un comportamiento deseado para mantener la integridad de los pedidos.

        await prisma.product.delete({
            where: { id },
        });

        return NextResponse.json(
            { message: 'Producto eliminado exitosamente' },
            { status: 200 }
        );
        // Alternativamente, puedes devolver un 204 No Content, que no tiene cuerpo:
        // return new NextResponse(null, { status: 204 });
    } catch (error: any) {
        console.error('Error al eliminar el producto:', error);
        if (error.code === 'P2025') {
            // Error de Prisma: Registro a eliminar no encontrado (ya cubierto arriba, pero por si acaso)
            return NextResponse.json(
                { message: 'Producto no encontrado para eliminar' },
                { status: 404 }
            );
        }
        // Error P2003: Foreign key constraint failed.
        // Esto sucede si, por ejemplo, el producto está en un OrderItem y la política onDelete no es Cascade.
        if (error.code === 'P2003') {
            return NextResponse.json(
                {
                    message:
                        'No se puede eliminar el producto porque está referenciado en otros registros (ej. pedidos). Primero elimine o desasocie esas referencias.',
                },
                { status: 409 }
            ); // 409 Conflict
        }
        const errorMessage =
            error instanceof Error
                ? error.message
                : 'Ocurrió un error desconocido.';
        return NextResponse.json(
            { message: 'Error al eliminar el producto', error: errorMessage },
            { status: 500 }
        );
    }
}
