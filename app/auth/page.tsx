"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { AuthForm } from "@/components/auth/auth-form"
import { useAuth } from "@/components/providers/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
            {type === 'admin' ? 'Acesso Administrativo' : 'Waze Clothing'}
          </CardTitle>
          <CardDescription>
            {type === 'admin'
              ? 'Faça login para acessar o painel administrativo'
              : 'Entre na sua conta ou crie uma nova'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AuthForm mode={type === 'admin' ? 'login' : 'login'} />
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