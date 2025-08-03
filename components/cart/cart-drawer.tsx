"use client"

import { useCart } from "@/components/providers/cart-provider"
import { CartItem } from "./cart-item"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export function CartDrawer() {
  const { isOpen, setIsOpen, items, total } = useCart()

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md w-full">
        {/* ✅ Necessário para acessibilidade */}
        <DialogTitle className="text-lg font-bold mb-4">Seu carrinho</DialogTitle>

        <div className="space-y-4 max-h-[300px] overflow-y-auto">
          {items.length === 0 ? (
            <p className="text-muted-foreground">Carrinho vazio.</p>
          ) : (
            items.map((item) => <CartItem key={item.id} item={item} />)
          )}
        </div>

        {items.length > 0 && (
          <div className="mt-4 border-t pt-4 flex justify-between items-center">
            <span className="font-bold text-base">Total:</span>
            <span className="font-bold text-lg">R$ {total.toFixed(2)}</span>
          </div>
        )}

        <div className="mt-4 flex justify-end">
          <Button variant="outline" onClick={() => setIsOpen(false)}>Fechar</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
