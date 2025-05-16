import { z } from 'zod';

// Esquema para crear una nueva categoría
export const CreateCategorySchema = z.object({
    name: z
        .string({ required_error: 'El nombre es requerido.' })
        .min(2, { message: 'El nombre debe tener al menos 2 caracteres.' })
        .max(50, { message: 'El nombre no puede tener más de 50 caracteres.' }),
    description: z.string().optional(),
});

// Esquema para actualizar una categoría existente
export const UpdateCategorySchema = z.object({
    name: z
        .string()
        .min(2, { message: 'El nombre debe tener al menos 2 caracteres.' })
        .max(50, { message: 'El nombre no puede tener más de 50 caracteres.' })
        .optional(),
    description: z.string().optional().nullable(),
});

// Tipos inferidos de los esquemas
export type CreateCategoryInput = z.infer<typeof CreateCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof UpdateCategorySchema>; 