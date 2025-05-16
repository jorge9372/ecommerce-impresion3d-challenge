import { NextResponse } from 'next/server';

import prisma from '@/lib/prisma';
import { CreateCategorySchema } from '@/lib/validations';
import { slugify } from '@/lib/utils';

/**
 * GET /api/categories
 * Obtiene una lista de todas las categorías.
 * Opcionalmente cuenta cuántos productos tiene cada categoría.
 * Ordena las categorías alfabéticamente por nombre.
 */
export async function GET(request: Request) {
    try {
        const categories = await prisma.category.findMany({
            include: {
                _count: {
                    // Opcional: Contar cuántos productos tiene cada categoría
                    select: { products: true },
                },
            },
            orderBy: {
                name: 'asc', // Ordenar alfabéticamente por nombre
            },
        });
        return NextResponse.json(categories);
    } catch (error) {
        console.error('Error al obtener categorías:', error);
        const errorMessage =
            error instanceof Error
                ? error.message
                : 'Ocurrió un error desconocido.';
        return NextResponse.json(
            { message: 'Error al obtener categorías', error: errorMessage },
            { status: 500 }
        );
    }
}

/**
 * POST /api/categories
 * Crea una nueva categoría.
 * Espera un cuerpo JSON con: name (string, requerido), description (string, opcional)
 */
export async function POST(request: Request) {
    try {
        const data = await request.json();
        
        // Validación con Zod
        const validationResult = CreateCategorySchema.safeParse(data);
        if (!validationResult.success) {
            return NextResponse.json(
                {
                    message: 'Error de validación.',
                    errors: validationResult.error.flatten().fieldErrors,
                },
                { status: 400 }
            );
        }

        const { name, description } = validationResult.data;

        const newCategory = await prisma.category.create({
            data: {
                name: name.trim(),
                slug: slugify(name.trim()),
                description: description || null,
            },
        });
        return NextResponse.json(newCategory, { status: 201 });
    } catch (error: any) {
        console.error('Error al crear la categoría:', error);
        if (error.code === 'P2002') {
            let field = 'desconocido';
            if (error.meta?.target?.includes('name')) {
                field = 'nombre';
            } else if (error.meta?.target?.includes('slug')) {
                field = 'slug (generado por un nombre similar)';
            }
            return NextResponse.json(
                { message: `Ya existe una categoría con ese ${field}.` },
                { status: 409 }
            );
        }
        const errorMessage =
            error instanceof Error
                ? error.message
                : 'Ocurrió un error desconocido.';
        return NextResponse.json(
            { message: 'Error al crear la categoría', error: errorMessage },
            { status: 500 }
        );
    }
}
