"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/providers/auth-provider"
import { Chrome, Loader2 } from "lucide-react"

interface AuthFormProps {
  mode?: "login" | "register"
}

export function AuthForm({ mode: initialMode = "login" }: AuthFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [mode, setMode] = useState<"login" | "register">(initialMode)

  const { toast } = useToast()
  const router = useRouter()
  const { signIn, signUp, signInWithGoogle, user, initialized, initializeAuth } = useAuth()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !initialized) {
      initializeAuth().catch(console.error)
    }
  }, [mounted, initialized, initializeAuth])

  // Se já está logado, redirecionar (apenas uma vez)
  useEffect(() => {
    if (user && initialized && !loading) {
      const urlParams = new URLSearchParams(window.location.search)
      const returnUrl = urlParams.get('returnUrl') || '/'
      console.log("🔄 Redirecionando usuário logado para:", returnUrl)
      router.push(returnUrl)
    }
  }, [user, initialized, loading, router])

  // Aguardar apenas inicialização
  if (!mounted || !initialized) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-2">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground">
            Inicializando autenticação...
          </p>
        </div>
      </div>
    )
  }

  // Se tem usuário, não mostrar form
  if (user && !loading) {
    const urlParams = new URLSearchParams(window.location.search)
    const returnUrl = urlParams.get('returnUrl') || '/'
    router.push(returnUrl)
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-2">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground">
            Redirecionando...
          </p>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (mode === "login") {
        await signIn(email, password)
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo de volta à Waze Clothing!",
        })
      } else {
        // Validar confirmação de senha
        if (password !== confirmPassword) {
          toast({
            title: "Erro",
            description: "As senhas não coincidem.",
            variant: "destructive",
          })
          setLoading(false)
          return
        }

        await signUp(email, password)
        toast({
          title: "Conta criada com sucesso!",
          description: "Bem-vindo à Waze Clothing!",
        })
      }

      // Redirecionar após sucesso
      const urlParams = new URLSearchParams(window.location.search)
      const returnUrl = urlParams.get('returnUrl') || '/'
      router.push(returnUrl)

    } catch (error: unknown) {
      const errorCode = error?.code || ""
      let errorMessage = "Ocorreu um erro. Tente novamente."

      if (errorCode.includes("user-not-found")) {
        errorMessage = "Usuário não encontrado."
      } else if (errorCode.includes("wrong-password") || errorCode.includes("invalid-credential")) {
        errorMessage = "Senha incorreta ou credenciais inválidas."
      } else if (errorCode.includes("email-already-in-use")) {
        errorMessage = "Este email já está em uso."
      } else if (errorCode.includes("weak-password")) {
        errorMessage = "A senha deve ter pelo menos 6 caracteres."
      } else if (errorCode.includes("invalid-email")) {
        errorMessage = "Email inválido."
      } else if (errorCode.includes("too-many-requests")) {
        errorMessage = "Muitas tentativas. Tente novamente mais tarde."
      }

      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    try {
      await signInWithGoogle()
      toast({
        title: "Login com Google bem-sucedido!",
        description: "Bem-vindo à Waze Clothing!",
      })

      const urlParams = new URLSearchParams(window.location.search)
      const returnUrl = urlParams.get('returnUrl') || '/'
      router.push(returnUrl)

    } catch (error: unknown) {
      const errorCode = error?.code || ""
      let errorMessage = "Erro ao fazer login com Google."

      if (errorCode.includes("popup-closed-by-user")) {
        errorMessage = "Login cancelado pelo usuário."
      } else if (errorCode.includes("popup-blocked")) {
        errorMessage = "Popup bloqueado. Permita popups para este site."
      }

      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            placeholder="seu@email.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Senha</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            minLength={6}
            placeholder="Mínimo 6 caracteres"
          />
        </div>

        {mode === "register" && (
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Senha</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
              minLength={6}
              placeholder="Confirme sua senha"
            />
          </div>
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {mode === "login" ? "Entrando..." : "Criando conta..."}
            </>
          ) : mode === "login" ? "Entrar" : "Criar Conta"}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Ou continue com</span>
        </div>
      </div>

      <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={loading}>
        {loading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Chrome className="mr-2 h-4 w-4" />
        )}
        Google
      </Button>

      <div className="text-center">
        <Button
          variant="link"
          className="p-0 h-auto text-sm"
          onClick={() => {
            setMode(mode === "login" ? "register" : "login")
            setEmail("")
            setPassword("")
            setConfirmPassword("")
          }}
          disabled={loading}
        >
          {mode === "login"
            ? "Não tem uma conta? Criar nova conta"
            : "Já tem uma conta? Fazer login"
          }
        </Button>
      </div>
    </div>
  )
}