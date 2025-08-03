import { Suspense } from "react"
import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { Header } from "@/components/layout/header"

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6">
          <Suspense fallback={<div>Carregando dashboard...</div>}>
            <AdminDashboard />
          </Suspense>
        </main>
      </div>
    </div>
  )
}
