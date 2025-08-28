
"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useAuth } from "./auth-provider"
import type { CartItem } from "@/lib/types"
import { getCart, updateCart } from "@/lib/firebase/cart"
import { getProductById } from "@/lib/firebase/products"

interface CartContextType {
  items: CartItem[]
  addItem: (productId: string, quantity?: number) => Promise<void>
  removeItem: (productId: string) => Promise<void>
  updateItemQuantity: (productId: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  getTotalItems: () => number
  getTotalPrice: () => number
  isLoading: boolean
  itemCount: number
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const { user } = useAuth()

  // Carregar carrinho do Firestore quando usuário logado
  useEffect(() => {
    if (user) {
      loadCart()
    } else {
      // Se não logado, carregar do localStorage
      loadCartFromLocalStorage()
    }
  }, [user])

  const loadCart = async () => {
    if (!user) return
    
    try {
      setIsLoading(true)
      const cartData = await getCart(user.uid)
      
      if (cartData?.items) {
        const cartItems: CartItem[] = []
        
        for (const item of cartData.items) {
          const product = await getProductById(item.productId)
          if (product) {
            cartItems.push({
              id: product.id,
              product,
              quantity: item.quantity
            })
          }
        }
        
        setItems(cartItems)
      }
    } catch (error) {
      console.error("Erro ao carregar carrinho:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadCartFromLocalStorage = () => {
    try {
      const savedCart = localStorage.getItem('cart')
      if (savedCart) {
        setItems(JSON.parse(savedCart))
      }
    } catch (error) {
      console.error("Erro ao carregar carrinho do localStorage:", error)
    }
  }

  const saveToLocalStorage = (cartItems: CartItem[]) => {
    try {
      localStorage.setItem('cart', JSON.stringify(cartItems))
    } catch (error) {
      console.error("Erro ao salvar no localStorage:", error)
    }
  }

  const saveCart = async (cartItems: CartItem[]) => {
    if (user) {
      try {
        const cartData = cartItems.map(item => ({
          productId: item.id,
          quantity: item.quantity
        }))
        await updateCart(user.uid, cartData)
      } catch (error) {
        console.error("Erro ao salvar carrinho:", error)
      }
    } else {
      saveToLocalStorage(cartItems)
    }
  }

  const addItem = async (productId: string, quantity = 1) => {
    try {
      const product = await getProductById(productId)
      if (!product) {
        throw new Error("Produto não encontrado")
      }

      setItems(currentItems => {
        const existingItem = currentItems.find(item => item.id === productId)
        
        let newItems: CartItem[]
        if (existingItem) {
          newItems = currentItems.map(item =>
            item.id === productId
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
        } else {
          newItems = [...currentItems, { id: productId, product, quantity }]
        }
        
        saveCart(newItems)
        return newItems
      })
    } catch (error) {
      console.error("Erro ao adicionar item:", error)
    }
  }

  const removeItem = async (productId: string) => {
    setItems(currentItems => {
      const newItems = currentItems.filter(item => item.id !== productId)
      saveCart(newItems)
      return newItems
    })
  }

  const updateItemQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeItem(productId)
      return
    }

    setItems(currentItems => {
      const newItems = currentItems.map(item =>
        item.id === productId
          ? { ...item, quantity }
          : item
      )
      saveCart(newItems)
      return newItems
    })
  }

  const clearCart = async () => {
    setItems([])
    if (user) {
      await updateCart(user.uid, [])
    } else {
      localStorage.removeItem('cart')
    }
  }

  const getTotalItems = (): number => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalPrice = (): number => {
    return items.reduce((total, item) => total + (item.product.price * item.quantity), 0)
  }

  const itemCount = getTotalItems()

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateItemQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
        isLoading,
        itemCount,
        isOpen,
        setIsOpen
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart deve ser usado dentro de um CartProvider")
  }
  return context
}
