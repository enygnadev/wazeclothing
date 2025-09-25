"use client"

import Image from "next/image"
import { Minus, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/providers/cart-provider"
import type { CartItem as CartItemType } from "@/lib/types"

interface CartItemProps {
  item: CartItemType
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart()

  return (
    <div className="flex items-start space-x-4 py-4">
      <div className="relative h-16 w-16 overflow-hidden rounded-md">
        <Image
          src={item.product.image || "/placeholder.svg?height=64&width=64"}
          alt={item.product.title || item.product.name}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex-1 space-y-1">
        <h4 className="text-sm font-medium line-clamp-2">{item.product.title || item.product.name}</h4>
        <p className="text-sm text-muted-foreground">R$ {item.product.price.toFixed(2)}</p>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
          >
            <Minus className="h-3 w-3" />
          </Button>

          <span className="w-8 text-center text-sm">{item.quantity}</span>

          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
          >
            <Plus className="h-3 w-3" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 ml-auto"
            onClick={() => removeItem(item.id)}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  )
}