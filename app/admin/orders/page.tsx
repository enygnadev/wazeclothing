
import { Suspense } from "react"
import { OrdersManager } from "@/components/admin/orders-manager"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { Header } from "@/components/layout/header"

export default function AdminOrdersPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex pt-16">
        <AdminSidebar />
        <main className="flex-1 p-6">
          <Suspense fallback={<div>Carregando pedidos...</div>}>
            <OrdersManager />
          </Suspense>
        </main>
      </div>
    </div>
  )
}
