"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { AuthForm } from "@/components/auth/auth-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/components/providers/auth-provider"
import { Loader2 } from "lucide-react"

function AuthPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user, loading, initialized } = useAuth()
  const [mounted, setMounted] = useState(false)

  const returnUrl = searchParams.get('returnUrl') || '/'
  const type = searchParams.get('type')

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && initialized && !loading && user) {
      // Se já está logado, redirecionar
      router.push(returnUrl)
    }
  }, [user, loading, initialized, mounted, returnUrl, router])

  if (!mounted || loading || !initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Carregando...</p>
        </div>
      </div>
    )
  }

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Redirecionando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            {type === 'admin' ? 'Acesso Administrativo' : 'Bem-vindo à Waze Clothing'}
          </CardTitle>
          <CardDescription>
            {type === 'admin' 
              ? 'Entre com sua conta de administrador' 
              : 'Entre na sua conta ou crie uma nova para começar a comprar'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Entrar</TabsTrigger>
              <TabsTrigger value="register">Cadastrar</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <AuthForm mode="login" />
            </TabsContent>
            <TabsContent value="register">
              <AuthForm mode="register" />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Carregando autenticação...</p>
        </div>
      </div>
    }>
      <AuthPageContent />
    </Suspense>
  )
}
