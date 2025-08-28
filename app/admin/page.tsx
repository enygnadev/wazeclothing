
"use client"

import { Suspense, useEffect, useState } from "react"
import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { Header } from "@/components/layout/header"
import { useAuth } from "@/components/providers/auth-provider"
import { Button } from "@/components/ui/button"
import { Shield, Loader2, AlertTriangle } from "lucide-react"
import { useRouter } from "next/navigation"

export default function AdminPage() {
  const { user, userProfile, loading, initialized, initializeAuth } = useAuth()
  const [verifying, setVerifying] = useState(true)
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const init = async () => {
      console.log("🔄 Admin page init...", { 
        initialized, 
        user: !!user, 
        userEmail: user?.email,
        userProfile,
        loading
      })
      
      if (!initialized) {
        console.log("🔄 Inicializando auth...")
        try {
          await initializeAuth()
        } catch (error) {
          console.error("❌ Erro na inicialização:", error)
        }
        return
      }
      
      const currentState = {
        user: !!user,
        userEmail: user?.email,
        userProfile,
        isAdmin: userProfile?.isAdmin,
        loading,
        initialized,
        timestamp: new Date().toISOString()
      }
      
      console.log("🔍 Debug Auth State:", currentState)
      setDebugInfo(currentState)
      
      // Parar verificação quando estiver pronto
      if (initialized && !loading) {
        setVerifying(false)
      }
    }

    init()
  }, [initialized, initializeAuth, user, userProfile, loading])

  // Se ainda está verificando
  if (verifying || loading || !initialized) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin mx-auto" />
          <h1 className="text-xl font-semibold">Verificando acesso administrativo...</h1>
          <p className="text-muted-foreground">
            {!initialized ? "Inicializando autenticação..." : 
             loading ? "Carregando dados do usuário..." : 
             "Verificando permissões..."}
          </p>
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
            Você precisa fazer login para acessar a área administrativa.
          </p>
          <Button onClick={() => router.push('/auth?returnUrl=/admin&type=admin')}>
            Fazer Login como Admin
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
            Você não tem permissão para acessar a área administrativa.
          </p>
          <p className="text-sm text-muted-foreground">
            Usuário: {user.email}
          </p>
          <div className="space-y-2">
            <Button onClick={() => router.push('/')}>
              Voltar ao Site
            </Button>
            <Button variant="outline" onClick={() => router.push('/auth?returnUrl=/admin&type=admin')}>
              Fazer Login como Admin
            </Button>
          </div>
          
          {/* Debug info apenas em desenvolvimento */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 text-xs text-muted-foreground bg-muted p-2 rounded">
              <p>Estado: Usuário não é admin</p>
              <p>isAdmin: {String(userProfile?.isAdmin || false)}</p>
              <pre className="text-left">{JSON.stringify(debugInfo, null, 2)}</pre>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Se é admin, mostrar dashboard
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
