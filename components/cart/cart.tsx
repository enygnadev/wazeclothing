"use client"

import { ShoppingBag, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useCart } from "@/components/providers/cart-provider"
import { useAuth } from "@/components/providers/auth-provider"
import { CartItem } from "./cart-item"
import Link from "next/link"

export function Cart() {
  const { items, isOpen, setIsOpen, total, clearCart } = useCart()
  const { user } = useAuth()

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Carrinho ({items.length})
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {!user && (
            <div className="bg-black-50 dark:bg-black-950 border border-black-200 dark:border-black-800 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Lock className="h-4 w-4 text-black-600" />
                <span className="text-sm font-medium text-black-800 dark:text-black-200">Login necessário</span>
              </div>
              <p className="text-xs text-black-700 dark:text-black-300 mb-3">
                Faça login para adicionar produtos ao carrinho e finalizar compras.
              </p>
              <Link href="/auth">
                <Button size="sm" className="bg-black-500 hover:bg-black-600">
                  Fazer Login
                </Button>
              </Link>
            </div>
          )}

          <div className="flex-1 overflow-auto py-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Seu carrinho está vazio</p>
                <p className="text-sm text-muted-foreground mt-2">
                  {user ? "Adicione produtos para começar" : "Faça login para adicionar produtos"}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
            )}
          </div>

          {items.length > 0 && user && (
            <div className="border-t pt-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total:</span>
                <span className="text-2xl font-bold text-primary">R$ {total.toFixed(2)}</span>
              </div>

              <div className="space-y-2">
                <Button className="w-full" size="lg">
                  Finalizar Compra
                </Button>
                <Button variant="outline" className="w-full" onClick={clearCart}>
                  Limpar Carrinho
                </Button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
