import { z } from 'zod';

// Esquema para las imágenes de productos
// export const ProductImageSchema = z.object({
//     url: z.string().url({ message: 'La URL de la imagen debe ser válida.' }),
//     altText: z.string().optional(),
//     order: z.number().int().positive().optional(),
// });

export const ProductImageSchema = z.object({ // Lo llamo ProductImageSchema para generalidad
    id: z.string().uuid().optional(), // Útil si alguna vez quieres actualizar imágenes existentes por su ID
    url: z.string().url({ message: "La URL de la imagen debe ser válida." }),
    altText: z.string().optional().nullable(),
    order: z.number().int().positive().optional().nullable(),
    providerImageId: z.string().optional().nullable(), // Para el ID del proveedor de imágenes
  });

// Esquema para crear un nuevo producto
export const CreateProductSchema = z.object({
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
    images: z.array(ProductImageSchema).optional().default([]),
});

// Esquema para actualizar un producto existente
export const UpdateProductSchema = z.object({
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
    images: z.array(ProductImageSchema).optional(),
});

// Tipos inferidos de los esquemas
export type CreateProductInput = z.infer<typeof CreateProductSchema>;
export type UpdateProductInput = z.infer<typeof UpdateProductSchema>;
export type ProductImageInput = z.infer<typeof ProductImageSchema>; 