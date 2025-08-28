"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useAuth } from "./auth-provider"
import type { CartItem } from "@/lib/types"
import { getCart, updateCart } from "@/lib/firebase/cart"
import { getProductById } from "@/lib/firebase/products"

interface CartContextType {
  items: CartItem[]
  addItem: (item: Omit<CartItem, "quantity">) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  total: number
  itemCount: number
  getTotalItems: () => number
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

const CartContext = createContext<CartContextType>({
  items: [],
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  total: 0,
  itemCount: 0,
  getTotalItems: () => 0,
  isOpen: false,
  setIsOpen: () => {},
})

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const { user } = useAuth()

  const addItem = (newItem: Omit<CartItem, "quantity">) => {
    setItems((prev) => {
      const exists = prev.find((item) => item.id === newItem.id)
      if (exists) {
        return prev.map((item) =>
          item.id === newItem.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prev, { ...newItem, quantity: 1 }]
    })
  }

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)
    } else {
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, quantity } : item))
      )
    }
  }

  const clearCart = () => setItems([])

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  // ✅ Carrega carrinho do Firestore e preenche com dados reais do produto
  useEffect(() => {
    const loadCart = async () => {
      if (!user?.uid) return
      const saved = await getCart(user.uid)
      if (saved?.items?.length) {
        const enriched: CartItem[] = await Promise.all(
          saved.items.map(async (i: { productId: string; quantity: number }) => {
            const product = await getProductById(i.productId)
            return {
              id: product?.id || i.productId,
              title: product?.title || "Produto",
              price: product?.price || 0,
              image: product?.image || "/placeholder.svg",
              quantity: i.quantity,
            }
          })
        )
        setItems(enriched)
      }
    }
    loadCart()
  }, [user])

  // ✅ Sempre que alterar o carrinho, salva no Firestore (apenas id + quantity)
  useEffect(() => {
    const syncToFirebase = async () => {
      if (!user?.uid) return
      const minimal = items.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      }))
      await updateCart(user.uid, minimal)
    }
    syncToFirebase()
  }, [items, user])

  const getTotalItems = () => itemCount

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        total,
        itemCount,
        getTotalItems,
        isOpen,
        setIsOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
