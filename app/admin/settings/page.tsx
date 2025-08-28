
"use client"

import { Suspense } from "react"
import { SettingsManager } from "@/components/admin/settings-manager"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { Header } from "@/components/layout/header"
import { useAuth } from "@/components/providers/auth-provider"
import { Button } from "@/components/ui/button"
import { Shield, Loader2, AlertTriangle } from "lucide-react"
import { useRouter } from "next/navigation"

export default function AdminSettingsPage() {
  const { user, userProfile, loading, initialized } = useAuth()
  const router = useRouter()

  // Se ainda está carregando
  if (!initialized || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin mx-auto" />
          <h1 className="text-xl font-semibold">Verificando acesso...</h1>
        </div>
      </div>
    )
  }

  // Se não está logado
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md space-y-4">
          <AlertTriangle className="h-16 w-16 text-amber-500 mx-auto" />
          <h1 className="text-2xl font-bold">Acesso Negado</h1>
          <p className="text-muted-foreground">
            Você precisa fazer login para acessar esta área.
          </p>
          <Button onClick={() => router.push('/auth?returnUrl=/admin/settings')}>
            Fazer Login
          </Button>
        </div>
      </div>
    )
  }

  // Se não é admin
  if (!userProfile?.isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md space-y-4">
          <Shield className="h-16 w-16 text-red-500 mx-auto" />
          <h1 className="text-2xl font-bold">Acesso Negado</h1>
          <p className="text-muted-foreground">
            Você não tem permissão para acessar as configurações.
          </p>
          <p className="text-sm text-muted-foreground">
            Usuário: {user.email}
          </p>
          <div className="space-y-2">
            <Button onClick={() => router.push('/')}>
              Voltar ao Site
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex pt-16">
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
