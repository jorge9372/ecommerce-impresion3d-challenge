import { Filter, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import ProductCard from "@/components/product-card"
import prisma from "@/lib/prisma"

async function getProducts() {
    const products = await prisma.product.findMany({
        where: { isActive: true },
        include: {
            category: true,
            images: {
                orderBy: {
                    order: 'asc'
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    return products.map(product => ({
        id: product.id,
        name: product.name,
        description: product?.description || '',
        price: Number(product.price),
        images: product.images.map(img => img.url),
        category: {
            name: product.category.name,
            slug: product.category.slug
        }
    }));
}

export default async function ProductsPage() {
    const products = await getProducts();

    return (
        <main className="flex-1 py-10">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar Filters - Desktop */}
                    <div className="hidden md:block w-64 shrink-0">
                        <div className="sticky top-24">
                            <h2 className="text-xl font-bold text-brand-primary mb-6">Filtros</h2>

                            <div className="mb-8">
                                <h3 className="font-medium text-gray-900 mb-3">Categorías</h3>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Checkbox id="cat-decoracion" />
                                        <Label htmlFor="cat-decoracion" className="text-sm font-normal">
                                            Decoración
                                        </Label>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Checkbox id="cat-funcional" />
                                        <Label htmlFor="cat-funcional" className="text-sm font-normal">
                                            Objetos Funcionales
                                        </Label>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Checkbox id="cat-juguetes" />
                                        <Label htmlFor="cat-juguetes" className="text-sm font-normal">
                                            Juguetes y Figuras
                                        </Label>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Checkbox id="cat-accesorios" />
                                        <Label htmlFor="cat-accesorios" className="text-sm font-normal">
                                            Accesorios
                                        </Label>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-8">
                                <h3 className="font-medium text-gray-900 mb-3">Material</h3>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Checkbox id="mat-pla" />
                                        <Label htmlFor="mat-pla" className="text-sm font-normal">
                                            PLA
                                        </Label>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Checkbox id="mat-abs" />
                                        <Label htmlFor="mat-abs" className="text-sm font-normal">
                                            ABS
                                        </Label>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Checkbox id="mat-petg" />
                                        <Label htmlFor="mat-petg" className="text-sm font-normal">
                                            PETG
                                        </Label>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Checkbox id="mat-resin" />
                                        <Label htmlFor="mat-resin" className="text-sm font-normal">
                                            Resina
                                        </Label>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-8">
                                <h3 className="font-medium text-gray-900 mb-3">Precio</h3>
                                <Slider defaultValue={[50]} max={100} step={1} className="mb-6" />
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">€0</span>
                                    <span className="text-sm text-gray-500">€100+</span>
                                </div>
                            </div>

                            <div className="mb-8">
                                <h3 className="font-medium text-gray-900 mb-3">Color</h3>
                                <div className="flex flex-wrap gap-2">
                                    <div className="w-6 h-6 rounded-full bg-black cursor-pointer border border-gray-300"></div>
                                    <div className="w-6 h-6 rounded-full bg-white cursor-pointer border border-gray-300"></div>
                                    <div className="w-6 h-6 rounded-full bg-red-500 cursor-pointer border border-gray-300"></div>
                                    <div className="w-6 h-6 rounded-full bg-blue-500 cursor-pointer border border-gray-300"></div>
                                    <div className="w-6 h-6 rounded-full bg-green-500 cursor-pointer border border-gray-300"></div>
                                    <div className="w-6 h-6 rounded-full bg-yellow-500 cursor-pointer border border-gray-300"></div>
                                    <div className="w-6 h-6 rounded-full bg-purple-500 cursor-pointer border border-gray-300"></div>
                                </div>
                            </div>

                            <Button className="w-full bg-brand-primary hover:bg-brand-primary/90">Aplicar Filtros</Button>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                            <h1 className="text-3xl font-bold text-brand-primary">Todos los Productos</h1>

                            <div className="flex items-center gap-3">
                                {/* Mobile Filter Button */}
                                <Button variant="outline" className="md:hidden flex items-center gap-2">
                                    <Filter className="h-4 w-4" />
                                    Filtros
                                </Button>

                                {/* Sort Dropdown */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" className="flex items-center gap-2">
                                            <SlidersHorizontal className="h-4 w-4" />
                                            Ordenar
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem>Destacados</DropdownMenuItem>
                                        <DropdownMenuItem>Precio: Menor a Mayor</DropdownMenuItem>
                                        <DropdownMenuItem>Precio: Mayor a Menor</DropdownMenuItem>
                                        <DropdownMenuItem>Más Recientes</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>

                        {/* Pagination */}
                        <div className="flex justify-center mt-12">
                            <nav className="flex items-center gap-1">
                                <Button variant="outline" size="icon" disabled>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </Button>
                                <Button variant="outline" size="sm" className="bg-brand-primary text-white hover:bg-brand-primary/90">
                                    1
                                </Button>
                                <Button variant="outline" size="sm">
                                    2
                                </Button>
                                <Button variant="outline" size="sm">
                                    3
                                </Button>
                                <Button variant="outline" size="icon">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </Button>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
