"use client"

import { useState } from "react"
import Link from "next/link"
import { ShoppingCart, Search, User, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold text-brand-primary">Capas</span><span className="text-xl font-bold text-destructive">Up</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-brand-primary font-medium">
              Inicio
            </Link>
            <Link href="/productos" className="text-gray-700 hover:text-brand-primary font-medium">
              Productos
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="text-gray-700 hover:text-brand-primary font-medium">Categorías</button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link href="/categorias/decoracion">Decoración</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/categorias/funcional">Objetos Funcionales</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/categorias/juguetes">Juguetes y Figuras</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/categorias/accesorios">Accesorios</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link href="/sobre-nosotros" className="text-gray-700 hover:text-brand-primary font-medium">
              Sobre Nosotros
            </Link>
            <Link href="/contacto" className="text-gray-700 hover:text-brand-primary font-medium">
              Contacto
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="text-gray-700 hover:text-brand-primary">
              <Search className="h-5 w-5" />
            </button>
            <Link href="/cuenta" className="text-gray-700 hover:text-brand-primary">
              <User className="h-5 w-5" />
            </Link>
            <Link href="/carrito" className="text-gray-700 hover:text-brand-primary relative">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-2 -right-2 bg-brand-vibrant text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                3
              </span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-4">
            <Link href="/carrito" className="text-gray-700 hover:text-brand-primary relative">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-2 -right-2 bg-brand-vibrant text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                3
              </span>
            </Link>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-700 hover:text-brand-primary">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {isSearchOpen && (
          <div className="py-4 border-t border-gray-200">
            <div className="flex items-center">
              <Input placeholder="Buscar productos..." className="flex-1" />
              <Button className="ml-2 bg-brand-primary hover:bg-brand-primary/90">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200">
          <nav className="flex flex-col divide-y divide-gray-200">
            <Link href="/" className="px-4 py-3 text-gray-700 hover:bg-gray-50" onClick={() => setIsMenuOpen(false)}>
              Inicio
            </Link>
            <Link
              href="/productos"
              className="px-4 py-3 text-gray-700 hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Productos
            </Link>
            <div className="px-4 py-3">
              <div className="font-medium mb-2">Categorías</div>
              <div className="pl-4 space-y-2">
                <Link
                  href="/categorias/decoracion"
                  className="block text-gray-600 hover:text-brand-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Decoración
                </Link>
                <Link
                  href="/categorias/funcional"
                  className="block text-gray-600 hover:text-brand-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Objetos Funcionales
                </Link>
                <Link
                  href="/categorias/juguetes"
                  className="block text-gray-600 hover:text-brand-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Juguetes y Figuras
                </Link>
                <Link
                  href="/categorias/accesorios"
                  className="block text-gray-600 hover:text-brand-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Accesorios
                </Link>
              </div>
            </div>
            <Link
              href="/sobre-nosotros"
              className="px-4 py-3 text-gray-700 hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Sobre Nosotros
            </Link>
            <Link
              href="/contacto"
              className="px-4 py-3 text-gray-700 hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Contacto
            </Link>
            <Link
              href="/cuenta"
              className="px-4 py-3 text-gray-700 hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Mi Cuenta
            </Link>
            <div className="px-4 py-3">
              <div className="relative">
                <Input placeholder="Buscar productos..." className="pr-10" />
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <Search className="h-4 w-4" />
                </button>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
