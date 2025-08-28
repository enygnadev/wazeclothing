
"use client"

import { ShoppingBag, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useCart } from "@/components/providers/cart-provider"
import { useAuth } from "@/components/providers/auth-provider"
import { CartItem } from "./cart-item"
import Link from "next/link"

export function Cart() {
  const { items, isOpen, setIsOpen, getTotalPrice, clearCart } = useCart()
  const { user } = useAuth()
  
  // Safety check for items array
  const safeItems = items || []
  const total = getTotalPrice()

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Carrinho ({safeItems.length} {safeItems.length === 1 ? 'item' : 'itens'})
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 flex flex-col">
          {safeItems.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
              <ShoppingBag className="h-16 w-16 text-muted-foreground" />
              <div>
                <h3 className="font-semibold text-lg">Carrinho vazio</h3>
                <p className="text-muted-foreground">
                  Adicione produtos para começar suas compras
                </p>
              </div>
              <Button onClick={() => setIsOpen(false)}>
                Continuar comprando
              </Button>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto">
                <div className="space-y-1">
                  {safeItems.map((item: CartItem) => (
                    <CartItem key={item.id} item={item} />
                  ))}
                </div>
              </div>

              <div className="border-t pt-4 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total:</span>
                  <span className="font-bold text-lg">R$ {total.toFixed(2)}</span>
                </div>

                {user ? (
                  <div className="space-y-2">
                    <Link href="/checkout" onClick={() => setIsOpen(false)}>
                      <Button className="w-full" size="lg">
                        Finalizar Compra
                      </Button>
                    </Link>
                    <Button variant="outline" className="w-full" onClick={clearCart}>
                      Limpar Carrinho
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link href="/auth" onClick={() => setIsOpen(false)}>
                      <Button className="w-full" size="lg">
                        <Lock className="w-4 h-4 mr-2" />
                        Fazer Login para Comprar
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
