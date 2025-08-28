
import { Suspense } from "react"
import { UsersManager } from "@/components/admin/users-manager"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { Header } from "@/components/layout/header"

export default function AdminUsersPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex pt-16">
        <AdminSidebar />
        <main className="flex-1 p-6">
          <Suspense fallback={<div>Carregando usuários...</div>}>
            <UsersManager />
          </Suspense>
        </main>
      </div>
    </div>
  )
}
