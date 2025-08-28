
import { Suspense } from "react"
import { SettingsManager } from "@/components/admin/settings-manager"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { Header } from "@/components/layout/header"

export default function AdminSettingsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6">
          <Suspense fallback={<div>Carregando configurações...</div>}>
            <SettingsManager />
          </Suspense>
        </main>
      </div>
    </div>
  )
}
