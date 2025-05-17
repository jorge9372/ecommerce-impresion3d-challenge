import Link from "next/link"
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-brand-primary text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">capasUp</h3>
            <p className="text-gray-400 mb-4">Productos únicos e innovadores creados con tecnología de impresión 3D.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-brand-fresh">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-brand-fresh">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-brand-fresh">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-brand-fresh">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Productos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/categorias/decoracion" className="text-gray-400 hover:text-brand-fresh">
                  Decoración
                </Link>
              </li>
              <li>
                <Link href="/categorias/funcional" className="text-gray-400 hover:text-brand-fresh">
                  Objetos Funcionales
                </Link>
              </li>
              <li>
                <Link href="/categorias/juguetes" className="text-gray-400 hover:text-brand-fresh">
                  Juguetes y Figuras
                </Link>
              </li>
              <li>
                <Link href="/categorias/accesorios" className="text-gray-400 hover:text-brand-fresh">
                  Accesorios
                </Link>
              </li>
              <li>
                <Link href="/productos/nuevos" className="text-gray-400 hover:text-brand-fresh">
                  Novedades
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Información</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/sobre-nosotros" className="text-gray-400 hover:text-brand-fresh">
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="text-gray-400 hover:text-brand-fresh">
                  Contacto
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-brand-fresh">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-brand-fresh">
                  Preguntas Frecuentes
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Atención al Cliente</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/envios" className="text-gray-400 hover:text-brand-fresh">
                  Envíos y Entregas
                </Link>
              </li>
              <li>
                <Link href="/devoluciones" className="text-gray-400 hover:text-brand-fresh">
                  Devoluciones
                </Link>
              </li>
              <li>
                <Link href="/terminos" className="text-gray-400 hover:text-brand-fresh">
                  Términos y Condiciones
                </Link>
              </li>
              <li>
                <Link href="/privacidad" className="text-gray-400 hover:text-brand-fresh">
                  Política de Privacidad
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-sm text-gray-400">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p>&copy; 2024 capasUp. Todos los derechos reservados.</p>
            <div className="mt-4 md:mt-0">
              <ul className="flex space-x-4">
                <li>
                  <Link href="/terminos" className="hover:text-brand-fresh">
                    Términos
                  </Link>
                </li>
                <li>
                  <Link href="/privacidad" className="hover:text-brand-fresh">
                    Privacidad
                  </Link>
                </li>
                <li>
                  <Link href="/cookies" className="hover:text-brand-fresh">
                    Cookies
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
