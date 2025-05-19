import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { CreateProductSchema, ProductImageInput } from '@/lib/validations';

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
                    errors: validationResult.error.flatten().fieldErrors,
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

        // Verificar que la categoría exista
        const categoryExists = await prisma.category.findUnique({
            where: { id: categoryId },
        });
        if (!categoryExists) {
            return NextResponse.json(
                {
                    message: `La categoría con ID ${categoryId} no fue encontrada.`,
                },
                { status: 404 }
            );
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
                    images && images.length > 0
                        ? {
                              create: images.map((img) => ({
                                  url: img.url,
                                  altText: img.altText, // Considera un fallback aquí
                                  order: img.order || 1,
                                  providerImageId: img.providerImageId,
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
