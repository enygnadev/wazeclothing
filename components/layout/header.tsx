"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/components/providers/auth-provider"
import { useCart } from "@/components/providers/cart-provider"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { CartDrawer } from "@/components/cart/cart-drawer"
import { ThemeToggle } from "@/components/theme/theme-toggle"
import { SearchBar } from "@/components/search/search-bar"
import { Badge } from "@/components/ui/badge"
import { 
  ShoppingCart, 
  Menu, 
  User, 
  LogOut, 
  Settings,
  Package
} from "lucide-react"

export function Header() {
  const { user, signOut, isAdmin } = useAuth()
  const { getTotalItems } = useCart()
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error("Erro ao fazer logout:", error)
    }
  }

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? "backdrop-blur-luxury bg-background/95 border-b border-border/50 shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">W</span>
            </div>
            <span className="font-bold text-xl">Waze Clothing</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
              Home
            </Link>
            <Link href="/products" className="text-muted-foreground hover:text-foreground transition-colors">
              Produtos
            </Link>
            <Link href="/categories" className="text-muted-foreground hover:text-foreground transition-colors">
              Categorias
            </Link>
            <Link href="/contato" className="text-muted-foreground hover:text-foreground transition-colors">
              Contato
            </Link>
          </nav>

          {/* Search Bar */}
          <div className="hidden lg:block flex-1 max-w-md mx-8">
            <SearchBar />
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Cart */}
            <CartDrawer>
              <Button variant="outline" size="icon" className="relative">
                <ShoppingCart className="h-4 w-4" />
                {getTotalItems() > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center text-xs"
                  >
                    {getTotalItems()}
                  </Badge>
                )}
                <span className="sr-only">Carrinho</span>
              </Button>
            </CartDrawer>

            {/* User Menu */}
            {user ? (
              <div className="flex items-center space-x-2">
                {isAdmin && (
                  <Link href="/admin">
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      Admin
                    </Button>
                  </Link>
                )}

                <Link href="/cliente">
                  <Button variant="outline" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    {user.displayName || user.email}
                  </Button>
                </Link>

                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Link href="/auth">
                <Button variant="default" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  Entrar
                </Button>
              </Link>
            )}

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="outline" size="icon">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col space-y-4 mt-8">
                  <div className="lg:hidden mb-4">
                    <SearchBar />
                  </div>

                  <Link 
                    href="/" 
                    className="text-lg font-medium hover:text-primary transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Home
                  </Link>
                  <Link 
                    href="/products" 
                    className="text-lg font-medium hover:text-primary transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Produtos
                  </Link>
                  <Link 
                    href="/categories" 
                    className="text-lg font-medium hover:text-primary transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Categorias
                  </Link>
                  <Link 
                    href="/contato" 
                    className="text-lg font-medium hover:text-primary transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Contato
                  </Link>

                  {user && isAdmin && (
                    <Link 
                      href="/admin" 
                      className="text-lg font-medium hover:text-primary transition-colors flex items-center"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Admin
                    </Link>
                  )}

                  {user && (
                    <Link 
                      href="/cliente" 
                      className="text-lg font-medium hover:text-primary transition-colors flex items-center"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Minha Conta
                    </Link>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}