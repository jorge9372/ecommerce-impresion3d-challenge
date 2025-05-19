import { NextResponse } from 'next/server';
import imagekit from '@/lib/imagekit';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json(
                { message: 'No se encontró el archivo' },
                { status: 400 }
            );
        }

        // Convertir el archivo a un buffer para la SDK de ImageKit
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Subir el archivo a ImageKit
        const uploadResponse = await imagekit.upload({
            file: buffer, // Contenido del archivo (Buffer or base64)
            fileName: file.name, // Nombre del archivo
            folder: '/ecommerce_3d_products/', // Carpeta opcional en ImageKit
            // useUniqueFileName: true, // Opcional: para evitar sobrescribir archivos con el mismo nombre
            // tags: ["tag1", "tag2"], // Opcional
            // isPrivateFile: false, // Opcional
        });

        // uploadResponse contiene url, fileId, thumbnailUrl, etc.
        return NextResponse.json(
            {
                message: 'Imagen subida exitosamente a ImageKit',
                url: uploadResponse.url,
                thumbnailUrl: uploadResponse.thumbnailUrl,
                fileId: uploadResponse.fileId, // MUY IMPORTANTE para futuras gestiones (borrar, etc.)
                name: uploadResponse.name,
                filePath: uploadResponse.filePath,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error al subir la imagen a ImageKit:', error);
        // La SDK de ImageKit puede devolver errores con más detalle
        const errorMessage =
            error instanceof Error ? error.message : 'Error desconocido.';
        if (typeof error === 'object' && error !== null && 'message' in error) {
            // @ts-ignore
            console.error('ImageKit Error Details:', error.message, error.help);
        }
        return NextResponse.json(
            { message: 'Error al subir la imagen', error: errorMessage },
            { status: 500 }
        );
    }
}
