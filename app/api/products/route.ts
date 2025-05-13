import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';

// --- Esquemas de Validación de Zod---
const ProductImageSchema = z.object({
    url: z.string().url({ message: 'La URL de la imagen debe ser válida.' }),
    altText: z.string().optional(),
    order: z.number().int().positive().optional(),
});

const CreateProductSchema = z.object({
    name: z
        .string({ required_error: 'El nombre es requerido.' })
        .min(3, { message: 'El nombre debe tener al menos 3 caracteres.' }),
    description: z.string().optional(),
    price: z
        .number({ required_error: 'El precio es requerido.' })
        .positive({ message: 'El precio debe ser un número positivo.' }),
    stock: z
        .number()
        .int()
        .nonnegative({ message: 'El stock debe ser un entero no negativo.' })
        .optional()
        .default(0),
    categoryId: z
        .string({ required_error: 'El ID de la categoría es requerido.' })
        .uuid({ message: 'El ID de la categoría debe ser un UUID válido.' }),
    material: z.string().optional(),
    color: z.string().optional(),
    dimensions: z.string().optional(),
    isActive: z.boolean().optional().default(true),
    images: z.array(ProductImageSchema).optional().default([]), // Array de imágenes, opcional
});

/**
 * GET /api/products
 * Obtiene una lista de todos los productos.
 * Incluye la categoría y las imágenes asociadas a cada producto.
 */
export async function GET(request: Request) {
    try {
        const products = await prisma.product.findMany({
            include: {
                category: true, // Incluye la información de la categoría del producto
                // Incluye las imágenes del producto
                images: {
                    orderBy: {
                        order: 'asc', // Ordena las imágenes por el campo 'order'
                    },
                },
            },
            orderBy: {
                createdAt: 'desc', // Ordena los productos por fecha de creación descendente
            },
        });

        return NextResponse.json(products);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        // Para asegurar que enviamos un mensaje de error útil y seguro
        const errorMessage =
            error instanceof Error
                ? error.message
                : 'Ocurrió un error desconocido.';
        return NextResponse.json(
            { message: 'Error al obtener productos', error: errorMessage },
            { status: 500 }
        );
    }
}

/**
 * POST /api/products
 * Crea un nuevo producto.
 * Espera un cuerpo JSON con los datos del producto, incluyendo opcionalmente un array de imágenes.
 */
export async function POST(request: Request) {
    try {
        const requestData = await request.json();

        // --- Validación con Zod ---
        const validationResult = CreateProductSchema.safeParse(requestData);

        if (!validationResult.success) {
            return NextResponse.json(
                {
                    message: 'Error de validación.',
                    errors: validationResult.error.flatten().fieldErrors, // Errores detallados por campo
                },
                { status: 400 }
            );
        }

        // Si la validación es exitosa, `validationResult.data` contiene los datos tipados y con valores por defecto aplicados
        const {
            name,
            description,
            price,
            stock,
            categoryId,
            material,
            color,
            dimensions,
            isActive,
            images,
        } = validationResult.data;

        // Verificar que la categoría exista (esto sigue siendo una validación de lógica de negocio)
        const categoryExists = await prisma.category.findUnique({
            where: { id: categoryId },
        });
        if (!categoryExists) {
            return NextResponse.json(
                {
                    message: `La categoría con ID ${categoryId} no fue encontrada.`,
                },
                { status: 404 }
            ); // 404 Not Found, o 400 Bad Request
        }

        // --- Creación del producto en la base de datos ---
        const newProduct = await prisma.product.create({
            data: {
                name,
                description,
                price,
                stock,
                categoryId,
                material,
                color,
                dimensions,
                isActive,
                images:
                    images.length > 0
                        ? {
                              create: images.map((img) => ({
                                  url: img.url,
                                  altText: img.altText || name, // Usar el nombre del producto como altText por defecto si no se provee
                                  order: img.order || 1,
                              })),
                          }
                        : undefined,
            },
            include: {
                category: true,
                images: { orderBy: { order: 'asc' } },
            },
        });

        return NextResponse.json(newProduct, { status: 201 });
    } catch (error: any) {
        console.error('Error al crear el producto:', error);
        // (Manejo de errores de Prisma como P2002 si tienes campos únicos)
        const errorMessage =
            error instanceof Error
                ? error.message
                : 'Ocurrió un error desconocido.';
        return NextResponse.json(
            { message: 'Error al crear el producto', error: errorMessage },
            { status: 500 }
        );
    }
}
