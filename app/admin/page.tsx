
"use client"

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
          <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <h2 className="text-lg font-semibold text-amber-800">Área Administrativa</h2>
            <p className="text-amber-700">Bem-vindo ao painel administrativo da Waze Clothing</p>
          </div>
          <Suspense fallback={<div>Carregando dashboard...</div>}>
            <AdminDashboard />
          </Suspense>
        </main>
      </div>
    </div>
  )
}
