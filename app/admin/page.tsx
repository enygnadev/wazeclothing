
"use client"

import { Suspense, useEffect, useState } from "react"
import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { Header } from "@/components/layout/header"
import { useAuth } from "@/components/providers/auth-provider"
import { Button } from "@/components/ui/button"
import { Shield, Loader2, AlertTriangle } from "lucide-react"

export default function AdminPage() {
  const { user, userProfile, loading, initialized, initializeAuth } = useAuth()
  const [verifying, setVerifying] = useState(true)
  const [debugInfo, setDebugInfo] = useState<any>(null)

  useEffect(() => {
    const init = async () => {
      console.log("🔄 Admin page init...", { initialized, user: !!user, userProfile })
      
      if (!initialized) {
        console.log("🔄 Inicializando auth...")
        await initializeAuth()
        return
      }
      
      // Debug info
      console.log("🔍 Debug Auth State:", {
        user: !!user,
        userEmail: user?.email,
        userProfile,
        isAdmin: userProfile?.isAdmin,
        loading,
        initialized
      })
      
      setDebugInfo({
        user: !!user,
        userEmail: user?.email,
        userProfile,
        isAdmin: userProfile?.isAdmin,
        loading,
        initialized
      })
      
      // Só parar de verificar quando realmente inicializado
      if (initialized && !loading) {
        setVerifying(false)
      }
    }

    init()
  }, [initialized, initializeAuth, user, userProfile, loading])

  // Mostrar loading enquanto está inicializando ou verificando
  if (loading || verifying || !initialized) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="mb-4">Verificando permissões...</p>
          {debugInfo && (
            <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
              <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Se não está logado
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
          
          {/* Debug info */}
          <div className="mt-4 text-xs text-muted-foreground bg-muted p-2 rounded">
            <p>Estado: Usuário não encontrado</p>
            <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
          </div>
        </div>
      </div>
    )
  }

  // Se não é admin
  if (!userProfile?.isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md">
          <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">Acesso Negado</h1>
          <p className="text-muted-foreground mb-6">
            Você não tem permissão para acessar a área administrativa.
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            Usuário: {user.email}
          </p>
          <Button onClick={() => window.location.href = '/'}>
            Voltar ao Site
          </Button>
          
          {/* Debug info */}
          <div className="mt-4 text-xs text-muted-foreground bg-muted p-2 rounded">
            <p>Estado: Usuário não é admin</p>
            <p>isAdmin: {String(userProfile?.isAdmin)}</p>
            <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
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
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center mb-2">
              <Shield className="h-5 w-5 text-green-600 mr-2" />
              <h2 className="text-lg font-semibold text-green-800">Área Administrativa</h2>
            </div>
            <p className="text-green-700">Bem-vindo ao painel administrativo da Waze Clothing</p>
            <p className="text-sm text-green-600 mt-1">
              Logado como: <strong>{user.email}</strong> (Admin)
            </p>
          </div>
          
          <Suspense fallback={
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              Carregando dashboard...
            </div>
          }>
            <AdminDashboard />
          </Suspense>
        </main>
      </div>
    </div>
  )
}
