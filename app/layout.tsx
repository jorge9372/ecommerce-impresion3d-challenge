import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import AdminLayout from "@/components/admin-layout"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "capasUp - Productos únicos de impresión 3D",
  description:
    "Descubre nuestra colección de productos innovadores, funcionales y artísticos creados con tecnología de impresión 3D",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es"> 
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <AdminLayout>{children}</AdminLayout>
      </body>
    </html>
  )
}
