/**
 * Convierte un texto en un slug URL-friendly.
 * Ejemplo: "Hello World!" -> "hello-world"
 */
export function slugify(text: string): string {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-') // Reemplaza espacios con -
        .replace(/[^\w-]+/g, '') // Quita caracteres no alfanuméricos (excepto -)
        .replace(/--+/g, '-'); // Reemplaza múltiples - con uno solo
}

/**
 * Capitaliza la primera letra de un texto.
 * Ejemplo: "hello world" -> "Hello world"
 */
export function capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Trunca un texto a una longitud máxima y agrega puntos suspensivos si es necesario.
 * Ejemplo: truncate("Hello world", 5) -> "Hello..."
 */
export function truncate(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
} 