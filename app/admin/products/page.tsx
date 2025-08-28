import { Suspense } from "react"
import { ProductManager } from "@/components/admin/product-manager"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { Header } from "@/components/layout/header"

export default function AdminProductsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex pt-16">
        <AdminSidebar />
        <main className="flex-1 p-6">
          <h1 className="text-3xl font-bold mb-6">Gerenciar Produtos</h1>
          <Suspense fallback={<div>Carregando produtos...</div>}>
            <ProductManager />
          </Suspense>
        </main>
      </div>
    </div>
  )
}
