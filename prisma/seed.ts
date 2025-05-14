import { PrismaClient, UserRole } from '../app/generated/prisma';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

function slugify(text: string): string {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-') // Reemplaza espacios con -
        .replace(/[^\w-]+/g, '') // Quita caracteres no alfanuméricos (excepto -)
        .replace(/--+/g, '-'); // Reemplaza múltiples - con uno solo
}

async function main() {
    console.log(`Start seeding ... ${new Date().toLocaleTimeString()}`);

    console.log(
        '🧹 Deleting existing data (ProductImage, Product, Category)...'
    );
    await prisma.productImage.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.category.deleteMany({});
    console.log('🗑️ Existing catalog data deleted.');
    // --- 1. Crear Usuario Administrador ---
    const adminPlainPassword =
        process.env.SEED_ADMIN_PASSWORD || 'adminDevDefault123!';
    if (
        adminPlainPassword === 'adminDevDefault123!' &&
        process.env.NODE_ENV === 'production'
    ) {
        throw new Error(
            'No se debe usar la contraseña por defecto para el seed en producción. Por favor, establece SEED_ADMIN_PASSWORD.'
        );
    }
    const adminHashedPassword = await hash(adminPlainPassword, 12);

    const adminUser = await prisma.user.upsert({
        where: { email: 'admin@example.com' },
        update: {
            password: adminHashedPassword,
            name: 'Administrador Principal',
        },
        create: {
            email: 'admin@example.com',
            name: 'Administrador Principal',
            password: adminHashedPassword,
            role: UserRole.ADMIN,
        },
    });
    console.log(
        `✅ Admin user: ${adminUser.email} (password: ${
            adminPlainPassword === process.env.SEED_ADMIN_PASSWORD
                ? 'from .env'
                : 'default'
        })`
    );

    // --- 2. Crear Categorías ---
    const categoriesData = [
        {
            name: 'Figuras Coleccionables',
            description: 'Figuras detalladas y coleccionables impresas en 3D.',
        },
        {
            name: 'Organizadores de Escritorio',
            description:
                'Soluciones prácticas y con estilo para tu espacio de trabajo.',
        },
        {
            name: 'Decoración del Hogar',
            description:
                'Piezas únicas para decorar cualquier rincón de tu casa.',
        },
        {
            name: 'Accesorios Gamer',
            description: 'Mejoras y complementos para tu setup de gaming.',
        },
    ];

    const createdCategories = [];
    for (const catData of categoriesData) {
        const category = await prisma.category.upsert({
            where: { name: catData.name }, // Asume que el nombre de la categoría es único para el upsert
            update: { description: catData.description },
            create: {
                name: catData.name,
                slug: slugify(catData.name),
                description: catData.description,
            },
        });
        createdCategories.push(category);
        console.log(`✅ Category: ${category.name}`);
    }

    // --- 3. Crear Productos (con imágenes anidadas) ---
    const productsData = [
        {
            name: 'Robot Articulado Cyberpunk V3',
            description:
                'Robot futurista completamente articulado con diseño cyberpunk. Impreso en PLA de alta calidad.',
            price: 34.99,
            stock: 12,
            categoryId:
                createdCategories.find(
                    (c) => c.name === 'Figuras Coleccionables'
                )?.id || '',
            material: 'PLA Metálico',
            color: 'Plateado con detalles neón',
            dimensions: '20cm alto x 12cm ancho',
            images: [
                {
                    url: 'https://placehold.co/600x400/2C3E50/FFFFFF/png?text=Robot+Cyberpunk+V3',
                    altText: 'Robot Cyberpunk vista lateral',
                    order: 1,
                },
            ],
        },
        {
            name: 'Organizador de Cables Galaxy',
            description:
                'Caja organizadora de cables con diseño espacial y compartimentos ajustables.',
            price: 18.99,
            stock: 25,
            categoryId:
                createdCategories.find(
                    (c) => c.name === 'Organizadores de Escritorio'
                )?.id || '',
            material: 'PETG Translúcido',
            color: 'Negro Espacial con brillos',
            dimensions: '15cm x 10cm x 6cm',
            images: [
                {
                    url: 'https://placehold.co/600x400/1A237E/FFFFFF/png?text=Organizador+Galaxy',
                    altText: 'Organizador de cables cerrado',
                    order: 1,
                },
            ],
        },
        {
            name: 'Lámpara Lunar 3D',
            description:
                'Réplica detallada de la superficie lunar con iluminación LED integrada.',
            price: 45.99,
            stock: 8,
            categoryId:
                createdCategories.find((c) => c.name === 'Decoración del Hogar')
                    ?.id || '',
            material: 'PLA + Resina',
            color: 'Blanco Lunar',
            dimensions: 'Ø20cm x 5cm',
            images: [
                {
                    url: 'https://placehold.co/600x400/757575/FFFFFF/png?text=Lampara+Lunar',
                    altText: 'Lámpara lunar encendida',
                    order: 1,
                },
            ],
        },
        {
            name: 'Soporte para Consolas Doble',
            description:
                'Soporte vertical para PS5 y Xbox Series X con diseño aerodinámico.',
            price: 27.5,
            stock: 18,
            categoryId:
                createdCategories.find((c) => c.name === 'Accesorios Gamer')
                    ?.id || '',
            material: 'ABS',
            color: 'Negro Mate',
            dimensions: '30cm alto x 25cm ancho',
            images: [
                {
                    url: 'https://placehold.co/600x400/212121/FFFFFF/png?text=Soporte+Consolas',
                    altText: 'Soporte doble para consolas',
                    order: 1,
                },
            ],
        },
        {
            name: 'Bandeja Flotante para Teclado',
            description:
                'Bandeja ajustable bajo la mesa para optimizar espacio en setups gaming.',
            price: 22.99,
            stock: 20,
            categoryId:
                createdCategories.find(
                    (c) => c.name === 'Organizadores de Escritorio'
                )?.id || '',
            material: 'PETG Reforzado',
            color: 'Carbono',
            dimensions: '80cm x 25cm x 3cm',
            images: [
                {
                    url: 'https://placehold.co/600x400/37474F/FFFFFF/png?text=Bandeja+Flotante',
                    altText: 'Bandeja instalada bajo mesa',
                    order: 1,
                },
            ],
        },
        {
            name: 'Estatuilla Cyber Samurai',
            description:
                'Samurai futurista con detalles intercambiables. Edición coleccionista.',
            price: 39.99,
            stock: 10,
            categoryId:
                createdCategories.find(
                    (c) => c.name === 'Figuras Coleccionables'
                )?.id || '',
            material: 'PLA Metalizado',
            color: 'Oro y Plata',
            dimensions: '28cm alto x 18cm base',
            images: [
                {
                    url: 'https://placehold.co/600x400/FFD700/000000/png?text=Cyber+Samurai',
                    altText: 'Samurai vista frontal',
                    order: 1,
                },
            ],
        },
        {
            name: 'Macetero Geométrico Hex',
            description:
                'Diseño moderno con patrones hexagonales para plantas pequeñas.',
            price: 15.99,
            stock: 30,
            categoryId:
                createdCategories.find((c) => c.name === 'Decoración del Hogar')
                    ?.id || '',
            material: 'PLA Reciclado',
            color: 'Verde Botánico',
            dimensions: '12cm x 12cm x 12cm',
            images: [
                {
                    url: 'https://placehold.co/600x400/4CAF50/FFFFFF/png?text=Macetero+Hex',
                    altText: 'Macetero con planta',
                    order: 1,
                },
            ],
        },
        {
            name: 'Soporte para Auriculares RGB',
            description:
                'Base iluminada con LED RGB para exhibir auriculares gaming.',
            price: 19.99,
            stock: 22,
            categoryId:
                createdCategories.find((c) => c.name === 'Accesorios Gamer')
                    ?.id || '',
            material: 'PLA + LED',
            color: 'Transparente RGB',
            dimensions: '15cm x 15cm x 10cm',
            images: [
                {
                    url: 'https://placehold.co/600x400/311B92/FFFFFF/png?text=Soporte+RGB',
                    altText: 'Soporte con iluminación',
                    order: 1,
                },
            ],
        },
        {
            name: 'Reloj de Pared Fractal',
            description:
                'Diseño matemático complejo con mecanismo de relojería integrado.',
            price: 49.99,
            stock: 7,
            categoryId:
                createdCategories.find((c) => c.name === 'Decoración del Hogar')
                    ?.id || '',
            material: 'PLA Wood',
            color: 'Madera Natural',
            dimensions: 'Ø30cm x 2cm',
            images: [
                {
                    url: 'https://placehold.co/600x400/795548/FFFFFF/png?text=Reloj+Fractal',
                    altText: 'Reloj colgado en pared',
                    order: 1,
                },
            ],
        },
        {
            name: 'Organizador Vertical de Mandos',
            description:
                'Sistema de almacenamiento vertical para 4 mandos de consola.',
            price: 16.5,
            stock: 25,
            categoryId:
                createdCategories.find((c) => c.name === 'Accesorios Gamer')
                    ?.id || '',
            material: 'PETG',
            color: 'Rojo Gaming',
            dimensions: '18cm x 12cm x 8cm',
            images: [
                {
                    url: 'https://placehold.co/600x400/D32F2F/FFFFFF/png?text=Organizador+Mandos',
                    altText: 'Organizador con mandos',
                    order: 1,
                },
            ],
        },
        {
            name: 'Dragón Articulado de Fuego V2',
            description:
                'Impresionante dragón articulado con detalles de llamas, perfecto para coleccionistas. Impreso en PLA resistente.',
            price: 29.99,
            stock: 15,
            categoryId:
                createdCategories.find(
                    (c) => c.name === 'Figuras Coleccionables'
                )?.id || '',
            material: 'PLA+',
            color: 'Rojo Fuego con detalles Naranja',
            dimensions: '25cm largo x 15cm alto',
            images: [
                {
                    url: 'https://placehold.co/600x400/FF5733/FFFFFF/png?text=Dragon+Fuego+V2+1',
                    altText: 'Dragón de Fuego V2 vista frontal',
                    order: 1,
                },
                {
                    url: 'https://placehold.co/600x400/FFC300/000000/png?text=Dragon+Fuego+V2+2',
                    altText: 'Dragón de Fuego V2 detalle ala',
                    order: 2,
                },
            ],
        },
        {
            name: 'Portalápices Modular Hexagonal V2',
            description:
                'Set de 3 módulos hexagonales para organizar tus lápices y herramientas. Diseño moderno en PETG.',
            price: 12.5,
            stock: 30,
            categoryId:
                createdCategories.find(
                    (c) => c.name === 'Organizadores de Escritorio'
                )?.id || '',
            material: 'PETG',
            color: 'Gris Grafito',
            dimensions: 'Cada módulo 8cm x 7cm',
            images: [
                {
                    url: 'https://placehold.co/600x400/4D5656/FFFFFF/png?text=Portalapices+Hex+V2',
                    altText: 'Portalápices Hexagonal V2',
                    order: 1,
                },
            ],
        },
    ];

    for (const prodData of productsData) {
        if (!prodData.categoryId) {
            console.warn(
                `⚠️ Producto "${prodData.name}" omitido por categoryId faltante o inválido.`
            );
            continue;
        }

        const product = await prisma.product.create({
            data: {
                name: prodData.name,
                description: prodData.description,
                price: prodData.price,
                stock: prodData.stock,
                categoryId: prodData.categoryId,
                material: prodData.material,
                color: prodData.color,
                dimensions: prodData.dimensions,
                isActive: true, // Asegurarse de que esté activo
                images:
                    prodData.images && prodData.images.length > 0
                        ? {
                              create: prodData.images.map((img) => ({
                                  url: img.url,
                                  altText: img.altText,
                                  order: img.order || 1,
                              })),
                          }
                        : undefined,
            },
        });
        console.log(`✅ Product created: ${product.name}`);
    }

    console.log(`Seeding finished. ${new Date().toLocaleTimeString()}`);
}

main()
    .catch(async (e) => {
        console.error('An error occurred during seeding:');
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
