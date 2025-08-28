"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { ShoppingCart, User, Search, Crown, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/components/providers/auth-provider"
import { CartDrawer } from "@/components/cart/cart-drawer"
import { useCart } from "@/components/providers/cart-provider"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const { user, userProfile, signOut } = useAuth()
  const { getTotalItems } = useCart()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? "backdrop-blur-luxury bg-background/95 border-b border-border/50 shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">W</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Waze Clothing
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              href="/" 
              className="text-foreground/80 hover:text-foreground font-medium transition-colors"
            >
              Home
            </Link>
            <Link 
              href="/products" 
              className="text-foreground/80 hover:text-foreground font-medium transition-colors"
            >
              Produtos
            </Link>
            <Link 
              href="/categories" 
              className="text-foreground/80 hover:text-foreground font-medium transition-colors"
            >
              Categorias
            </Link>
            <Link 
              href="/contato" 
              className="text-foreground/80 hover:text-foreground font-medium transition-colors"
            >
              Contato
            </Link>

            {/* Admin Button - Visible only for admins */}
            {userProfile?.isAdmin && (
              <Link 
                href="/admin" 
                className="flex items-center space-x-1 bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium hover:from-amber-600 hover:to-yellow-600 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <Crown className="h-3 w-3" />
                <span>Admin</span>
              </Link>
            )}
          </nav>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <div className="hidden md:flex relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="search"
                placeholder="Buscar produtos..."
                className="pl-10 w-64 bg-background/50 backdrop-blur-sm border-border/50"
              />
            </div>

            {/* Cart */}
            <CartDrawer>
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full text-xs w-5 h-5 flex items-center justify-center">
                    {getTotalItems()}
                  </span>
                )}
              </Button>
            </CartDrawer>

            {/* User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{userProfile?.name || user.displayName}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                    {userProfile?.isAdmin && (
                      <div className="flex items-center mt-1">
                        <Crown className="h-3 w-3 text-amber-500 mr-1" />
                        <span className="text-xs text-amber-600 font-medium">Administrador</span>
                      </div>
                    )}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/cliente">Minha Conta</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/checkout">Meus Pedidos</Link>
                  </DropdownMenuItem>
                  {userProfile?.isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="text-amber-600">
                        <Crown className="h-4 w-4 mr-2" />
                        Painel Admin
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/auth">
                <Button variant="outline" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  Entrar
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}