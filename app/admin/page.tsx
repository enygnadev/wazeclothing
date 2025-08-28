
"use client"

import { Suspense, useEffect, useState } from "react"
import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { Header } from "@/components/layout/header"
import { useAuth } from "@/components/providers/auth-provider"
import { Button } from "@/components/ui/button"
import { Shield, Loader2 } from "lucide-react"

export default function AdminPage() {
  const { user, loading } = useAuth()
  const [isAdmin, setIsAdmin] = useState(false)
  const [verifying, setVerifying] = useState(true)

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user) {
        try {
          const { getUserProfile } = await import("@/lib/firebase/users")
          const profile = await getUserProfile(user.uid)
          setIsAdmin(profile?.isAdmin || false)
        } catch (error) {
          console.error("Erro ao verificar status admin:", error)
          setIsAdmin(false)
        }
      }
      setVerifying(false)
    }

    if (!loading) {
      checkAdminStatus()
    }
  }, [user, loading])

  if (loading || verifying) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Verificando permissões...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md">
          <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">Acesso Negado</h1>
          <p className="text-muted-foreground mb-6">
            Você precisa fazer login para acessar a área administrativa.
          </p>
          <Button onClick={() => window.location.href = '/auth?returnUrl=/admin&type=admin'}>
            Fazer Login
          </Button>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md">
          <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">Acesso Negado</h1>
          <p className="text-muted-foreground mb-6">
            Você não tem permissão para acessar a área administrativa.
          </p>
          <Button onClick={() => window.location.href = '/'}>
            Voltar ao Site
          </Button>
        </div>
      </div>
    )
  }

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
