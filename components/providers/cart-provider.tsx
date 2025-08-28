
"use client"

import React, { createContext, useContext, useReducer, useEffect } from 'react'
import type { CartItem, Product } from '@/lib/types'

interface CartState {
  items: CartItem[]
  isOpen: boolean
}

type CartAction = 
  | { type: 'ADD_ITEM'; payload: { product: Product; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' }
  | { type: 'SET_ITEMS'; payload: CartItem[] }

interface CartContextType {
  state: CartState
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  openCart: () => void
  closeCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, quantity } = action.payload
      const existingItemIndex = state.items.findIndex(item => item.id === product.id)
      
      let newItems: CartItem[]
      
      if (existingItemIndex > -1) {
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      } else {
        const newItem: CartItem = {
          id: product.id,
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity
        }
        newItems = [...state.items, newItem]
      }
      
      return { ...state, items: newItems }
    }
    
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      }
    
    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload
      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(item => item.id !== id)
        }
      }
      return {
        ...state,
        items: state.items.map(item =>
          item.id === id ? { ...item, quantity } : item
        )
      }
    }
    
    case 'CLEAR_CART':
      return { ...state, items: [] }
    
    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen }
    
    case 'OPEN_CART':
      return { ...state, isOpen: true }
    
    case 'CLOSE_CART':
      return { ...state, isOpen: false }
    
    case 'SET_ITEMS':
      return { ...state, items: action.payload }
    
    default:
      return state
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    isOpen: false
  })

  // Ensure items is always an array
  const safeState = {
    ...state,
    items: state.items || []
  }

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      try {
        const items = JSON.parse(savedCart)
        dispatch({ type: 'SET_ITEMS', payload: items })
      } catch (error) {
        console.error('Error loading cart from localStorage:', error)
      }
    }
  }, [])

  // Save cart to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(safeState.items))
  }, [safeState.items])

  const addItem = (product: Product, quantity = 1) => {
    dispatch({ type: 'ADD_ITEM', payload: { product, quantity } })
  }

  const removeItem = (productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: productId })
  }

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  const toggleCart = () => {
    dispatch({ type: 'TOGGLE_CART' })
  }

  const openCart = () => {
    dispatch({ type: 'OPEN_CART' })
  }

  const closeCart = () => {
    dispatch({ type: 'CLOSE_CART' })
  }

  const getTotalItems = () => {
    return safeState.items.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalPrice = () => {
    return safeState.items.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const value: CartContextType = {
    state: safeState,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    toggleCart,
    openCart,
    closeCart,
    getTotalItems,
    getTotalPrice
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
