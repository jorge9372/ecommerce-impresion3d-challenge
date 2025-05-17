import Link from "next/link"
import Image from "next/image"
import { Minus, Plus, X, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cartItems } from "@/lib/data"

export default function CartPage() {
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  const shipping = subtotal > 50 ? 0 : 4.99
  const total = subtotal + shipping

  return (
    <main className="flex-1 py-10">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-[#225570] mb-8">Tu Carrito</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            {cartItems.length > 0 ? (
              <div className="border rounded-lg overflow-hidden">
                <div className="hidden sm:grid grid-cols-12 gap-4 p-4 bg-gray-50 text-sm font-medium text-gray-500">
                  <div className="col-span-6">Producto</div>
                  <div className="col-span-2 text-center">Precio</div>
                  <div className="col-span-2 text-center">Cantidad</div>
                  <div className="col-span-2 text-right">Total</div>
                </div>

                <div className="divide-y">
                  {cartItems.map((item) => (
                    <div key={item.id} className="p-4 sm:grid sm:grid-cols-12 sm:gap-4 sm:items-center">
                      {/* Mobile Layout */}
                      <div className="flex items-start gap-4 mb-4 sm:hidden">
                        <div className="relative w-20 h-20 rounded bg-gray-100 overflow-hidden shrink-0">
                          <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{item.name}</h3>
                          <p className="text-sm text-gray-500 mb-2">{item.variant}</p>
                          <div className="flex justify-between">
                            <span className="font-medium">€{item.price.toFixed(2)}</span>
                            <button className="text-gray-400 hover:text-red-500">
                              <X className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:hidden">
                        <div className="flex items-center">
                          <Button variant="outline" size="icon" className="h-8 w-8 rounded-r-none">
                            <Minus className="h-3 w-3" />
                          </Button>
                          <div className="px-3 py-1 border-y border-x-0 border-gray-300 text-center w-10 h-8 flex items-center justify-center">
                            {item.quantity}
                          </div>
                          <Button variant="outline" size="icon" className="h-8 w-8 rounded-l-none">
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="font-medium">€{(item.price * item.quantity).toFixed(2)}</div>
                      </div>

                      {/* Desktop Layout */}
                      <div className="hidden sm:col-span-6 sm:flex sm:items-center sm:gap-4">
                        <button className="text-gray-400 hover:text-red-500">
                          <X className="h-5 w-5" />
                        </button>
                        <div className="relative w-16 h-16 rounded bg-gray-100 overflow-hidden">
                          <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{item.name}</h3>
                          <p className="text-sm text-gray-500">{item.variant}</p>
                        </div>
                      </div>

                      <div className="hidden sm:col-span-2 sm:flex sm:justify-center sm:text-center">
                        €{item.price.toFixed(2)}
                      </div>

                      <div className="hidden sm:col-span-2 sm:flex sm:justify-center">
                        <div className="flex items-center">
                          <Button variant="outline" size="icon" className="h-8 w-8 rounded-r-none">
                            <Minus className="h-3 w-3" />
                          </Button>
                          <div className="px-3 py-1 border-y border-x-0 border-gray-300 text-center w-10 h-8 flex items-center justify-center">
                            {item.quantity}
                          </div>
                          <Button variant="outline" size="icon" className="h-8 w-8 rounded-l-none">
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      <div className="hidden sm:col-span-2 sm:flex sm:justify-end sm:font-medium">
                        €{(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-16 border rounded-lg">
                <h2 className="text-xl font-medium text-gray-900 mb-4">Tu carrito está vacío</h2>
                <p className="text-gray-500 mb-8">Parece que aún no has añadido ningún producto a tu carrito.</p>
                <Button asChild className="bg-[#225570] hover:bg-[#225570]/90">
                  <Link href="/productos">Explorar Productos</Link>
                </Button>
              </div>
            )}

            {cartItems.length > 0 && (
              <div className="mt-6 flex flex-wrap justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Input placeholder="Código de descuento" className="w-48" />
                  <Button variant="outline">Aplicar</Button>
                </div>
                <Button variant="outline" asChild>
                  <Link href="/productos">Continuar Comprando</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Order Summary */}
          {cartItems.length > 0 && (
            <div className="lg:col-span-1">
              <div className="border rounded-lg p-6 bg-gray-50 sticky top-24">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Resumen del Pedido</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">€{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Envío</span>
                    <span className="font-medium">{shipping === 0 ? "Gratis" : `€${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="pt-3 border-t border-gray-200 flex justify-between">
                    <span className="font-medium text-gray-900">Total</span>
                    <span className="font-bold text-[#225570]">€{total.toFixed(2)}</span>
                  </div>
                </div>

                <Button className="w-full bg-[#225570] hover:bg-[#225570]/90 flex items-center justify-center gap-2">
                  Finalizar Compra
                  <ArrowRight className="h-4 w-4" />
                </Button>

                <div className="mt-6 text-sm text-gray-500">
                  <p className="mb-2">Aceptamos:</p>
                  <div className="flex gap-2">
                    <div className="w-10 h-6 bg-gray-200 rounded"></div>
                    <div className="w-10 h-6 bg-gray-200 rounded"></div>
                    <div className="w-10 h-6 bg-gray-200 rounded"></div>
                    <div className="w-10 h-6 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
