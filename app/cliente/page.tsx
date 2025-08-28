
"use client"


import { Header } from "@/components/layout/header"
import { CustomerDashboard } from "@/components/client/customer-dashboard"
import { useAuth } from "@/components/providers/auth-provider"
import { redirect } from "next/navigation"

export default function ClientePage() {
  const { user, loading } = useAuth()

  if (loading) {
    return <div>Carregando...</div>
  }

  if (!user) {
    redirect("/auth")
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 pt-24">
        <CustomerDashboard />
      </main>
    </div>
  )
}
