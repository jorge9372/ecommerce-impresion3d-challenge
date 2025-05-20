import { NextResponse } from 'next/server';
import imagekit from '@/lib/imagekit';

export async function DELETE(
    request: Request,
    { params }: { params: { fileId: string } }
) {
    try {
        const { fileId } = params;

        if (!fileId) {
            return NextResponse.json(
                { message: 'ID de archivo no proporcionado' },
                { status: 400 }
            );
        }

        // Eliminar el archivo de ImageKit
        await imagekit.deleteFile(fileId);

        return NextResponse.json(
            { message: 'Imagen eliminada exitosamente' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error al eliminar la imagen de ImageKit:', error);
        const errorMessage =
            error instanceof Error ? error.message : 'Error desconocido';
        return NextResponse.json(
            { message: 'Error al eliminar la imagen', error: errorMessage },
            { status: 500 }
        );
    }
} 