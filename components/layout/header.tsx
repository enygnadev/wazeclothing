"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ShoppingCart, User, LogOut, Loader2, Crown, Sparkles, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/providers/auth-provider"
import { useCart } from "@/components/providers/cart-provider"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme/theme-toggle"
import { useToast } from "@/hooks/use-toast"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function Header() {
  const { user, userProfile, loading, initialized, signOut, initializeAuth } = useAuth()
  const { itemCount, setIsOpen } = useCart()
  const { toast } = useToast()
  const [mounted, setMounted] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Initialize auth when component mounts (but don't block rendering)
  useEffect(() => {
    if (mounted && !initialized) {
      initializeAuth().catch((error) => {
        console.error("Background auth initialization failed:", error)
      })
    }
  }, [mounted, initialized, initializeAuth])

  const handleSignOut = async () => {
    try {
      await signOut()
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      })
    } catch (error) {
      console.error("Error signing out:", error)
      toast({
        title: "Erro",
        description: "Erro ao fazer logout.",
        variant: "destructive",
      })
    }
  }

  if (!mounted) {
    return (
      <header className="fixed top-0 z-50 w-full backdrop-blur-luxury bg-background/80 border-b border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="w-8 h-8 animate-pulse bg-muted rounded-full" />
          </div>
        </div>
      </header>
    )
  }

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? "backdrop-blur-luxury bg-background/95 border-b border-border/50 shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo - Compact */}
          <Link href="/" className="group flex items-center space-x-2">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-500 rounded-lg blur-sm opacity-30 group-hover:opacity-50 transition-opacity"></div>
              <div className="relative p-1.5 bg-gradient-to-br from-green-900 to-green-500 rounded-lg">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
            </div>
            <div>
              <h1 className="font-luxury text-lg font-bold text-zinc">Waze</h1>
              <p className="font-elegant text-xs text-muted-foreground -mt-1 hidden sm:block">Lighting</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              href="/"
              className="font-elegant text-sm font-medium hover:text-black-500 transition-colors relative group"
            >
              Início
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-green-400 to-white-500 group-hover:w-full transition-all duration-300"></div>
            </Link>
            <Link
              href="/products"
              className="font-elegant text-sm font-medium hover:text-green-500 transition-colors relative group"
            >
              Produtos
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-green-400 to-white-500 group-hover:w-full transition-all duration-300"></div>
            </Link>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-2">
            {/* Theme toggle - hidden on mobile */}
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>

            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(true)}
              className="relative group hover:bg-amber-50 dark:hover:bg-amber-950/20 transition-colors h-9 w-9"
            >
              <ShoppingCart className="h-4 w-4 group-hover:text-amber-500 transition-colors" />
              {itemCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-xs bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-bold animate-pulse">
                  {itemCount}
                </Badge>
              )}
            </Button>

            {/* Auth section */}
            {!initialized ? (
              <div className="flex items-center space-x-1">
                <Loader2 className="h-3 w-3 animate-spin text-amber-500" />
                <span className="text-xs text-muted-foreground font-elegant hidden sm:inline">Carregando...</span>
              </div>
            ) : loading ? (
              <Loader2 className="h-4 w-4 animate-spin text-amber-500" />
            ) : user ? (
              <div className="flex items-center space-x-2">
                {userProfile?.isAdmin && (
                  <Link href="/admin" className="hidden sm:block">
                    <Button
                      variant="outline"
                      size="sm"
                      className="font-elegant border-amber-400/50 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/20 h-8 px-3 text-xs"
                    >
                      <Crown className="w-3 h-3 mr-1" />
                      Admin
                    </Button>
                  </Link>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative group h-9 w-9">
                      <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-yellow-400/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <User className="h-4 w-4 relative z-10 group-hover:text-amber-500 transition-colors" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-40 bg-background/95 backdrop-blur-sm border border-border/50"
                  >
                    {userProfile?.isAdmin && (
                      <DropdownMenuItem asChild className="sm:hidden">
                        <Link href="/admin" className="font-elegant hover:bg-amber-50 dark:hover:bg-amber-950/20">
                          <Crown className="mr-2 h-3 w-3" />
                          Admin
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="font-elegant hover:bg-amber-50 dark:hover:bg-amber-950/20"
                    >
                      <LogOut className="mr-2 h-3 w-3" />
                      Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <Link href="/auth">
                <Button className="font-elegant font-semibold bg-white from-black-400 to-green-500 hover:from-white-500 hover:to-white-600 text-black border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 h-9 px-4 text-sm">
                  <Crown className="w-3 h-3 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Entrar</span>
                </Button>
              </Link>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-9 w-9"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-sm">
            <nav className="flex flex-col space-y-2 p-4">
              <Link
                href="/"
                className="font-elegant text-sm font-medium hover:text-amber-500 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Início
              </Link>
              <Link
                href="/products"
                className="font-elegant text-sm font-medium hover:text-amber-500 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Produtos
              </Link>
              <div className="pt-2">
                <ThemeToggle />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
