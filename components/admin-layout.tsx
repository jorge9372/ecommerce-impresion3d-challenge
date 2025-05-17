'use client'

import { usePathname } from 'next/navigation'
import Header from './header'
import Footer from './footer'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isAdminRoute = pathname.startsWith('/admin')

  if (isAdminRoute) {
    return <main className="min-h-screen bg-gray-50">{children}</main>
  }

  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  )
} 