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
    <div className="flex items-center space-x-3 py-3">
      <div className="relative h-16 w-16 flex-shrink-0">
        <Image
          src={item.image || "/placeholder.svg?height=64&width=64"}
          alt={item.title || item.name}
          fill
          className="rounded-md object-cover"
        />
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium line-clamp-2">{item.title || item.name}</h4>
        <p className="text-sm text-muted-foreground">R$ {item.price.toFixed(2)}</p>
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7"
          onClick={() => updateQuantity(item.id, item.quantity - 1)}
        >
          <Minus className="h-3 w-3" />
        </Button>

        <span className="w-8 text-center text-sm">{item.quantity}</span>

        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7"
          onClick={() => updateQuantity(item.id, item.quantity + 1)}
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-destructive hover:text-destructive"
        onClick={() => removeItem(item.id)}
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  )
}