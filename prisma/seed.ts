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
            name: 'Dragón Articulado de Fuego V2', // Cambié un poco el nombre para evitar conflicto si ya existe sin SKU
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
            // sku: ya no está
            images: [
                {
                    url: 'https://via.placeholder.com/600x400.png/FF5733/FFFFFF?Text=Dragon+Fuego+V2+1',
                    altText: 'Dragón de Fuego V2 vista frontal',
                    order: 1,
                },
                {
                    url: 'https://via.placeholder.com/600x400.png/FFC300/000000?Text=Dragon+Fuego+V2+2',
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
                    url: 'https://via.placeholder.com/600x400.png/4D5656/FFFFFF?Text=Portalapices+Hex+V2',
                    altText: 'Portalápices Hexagonal V2',
                    order: 1,
                },
            ],
        },
        // Puedes añadir más productos si lo deseas
    ];

    for (const prodData of productsData) {
        if (!prodData.categoryId) {
            console.warn(
                `⚠️ Producto "${prodData.name}" omitido por categoryId faltante o inválido.`
            );
            continue;
        }
        // Si 'name' no es único en tu schema Product, upsert podría actualizar un producto existente
        // si tiene el mismo nombre. Si quieres asegurar la creación de nuevos productos siempre
        // que ejecutas el seed y los nombres podrían repetirse, considera usar 'create' en lugar de 'upsert'
        // o añade un campo único (como lo era SKU) para usar en el 'where' del upsert.
        // Por ahora, asumimos que los nombres en `productsData` son suficientemente únicos para el seed.
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

    // --- SECCIÓN DE ÓRDENES Y ORDERITEMS ELIMINADA ---

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
