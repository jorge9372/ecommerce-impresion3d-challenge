import { NextResponse } from 'next/server';

import prisma from '@/lib/prisma';

// Función para generar slugs (puedes moverla a un archivo de utilidades si la usas en más lugares)
function slugify(text: string): string {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-') // Reemplaza espacios con -
        .replace(/[^\w-]+/g, '') // Quita caracteres no alfanuméricos (excepto -)
        .replace(/--+/g, '-'); // Reemplaza múltiples - con uno solo
}

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
        const { name, description } = data;

        // Validación básica
        if (!name || typeof name !== 'string' || name.trim() === '') {
            return NextResponse.json(
                {
                    message:
                        'El nombre (name) es requerido y no puede estar vacío.',
                },
                { status: 400 }
            );
        }

        const newCategory = await prisma.category.create({
            data: {
                name: name.trim(),
                slug: slugify(name.trim()), // Generar slug automáticamente
                description: description || null,
            },
        });
        return NextResponse.json(newCategory, { status: 201 }); // 201 Created
    } catch (error: any) {
        // Especificar 'any' o un tipo más específico
        console.error('Error al crear la categoría:', error);
        // Manejar errores específicos de Prisma, como violaciones de constraint único
        if (error.code === 'P2002') {
            // Código de error de Prisma para 'Unique constraint failed'
            let field = 'desconocido';
            if (error.meta?.target?.includes('name')) {
                field = 'nombre';
            } else if (error.meta?.target?.includes('slug')) {
                field = 'slug (generado por un nombre similar)';
            }
            return NextResponse.json(
                { message: `Ya existe una categoría con ese ${field}.` },
                { status: 409 }
            ); // 409 Conflict
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
