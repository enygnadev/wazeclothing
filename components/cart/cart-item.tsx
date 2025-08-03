"use client"

import Image from "next/image"
import { Minus, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/providers/cart-provider"

interface CartItemProps {
  item: {
    id: string
    title: string
    price: number
    image: string
    quantity: number
  }
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart()

  return (
    <div className="flex items-center space-x-4 py-4">
      <div className="relative h-16 w-16 rounded-md overflow-hidden">
        <Image
          src={item.image || "/placeholder.svg?height=64&width=64"}
          alt={item.title}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium line-clamp-2">{item.title}</h4>
        <p className="text-sm text-muted-foreground">R$ {item.price.toFixed(2)}</p>
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => updateQuantity(item.id, item.quantity - 1)}
        >
          <Minus className="h-3 w-3" />
        </Button>

        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>

        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => updateQuantity(item.id, item.quantity + 1)}
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>

      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeItem(item.id)}>
        <X className="h-4 w-4" />
      </Button>
    </div>
  )
}
