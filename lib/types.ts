export interface Product {
  id: string
  title: string
  price: number
  image: string
  category: string
  description?: string
  featured: boolean
  isSmart: boolean
  sizes?: string[]
  colors?: string[]
}

export interface User {
  id: string
  email: string
  name: string
  isAdmin: boolean
  createdAt?: Date
}

export interface CartItem {
  id: string
  productId: string
  quantity: number
  size?: string
  color?: string
}

export interface Order {
  id: string
  userId: string
  items: CartItem[]
  total: number
  status: 'pending' | 'processing' | 'paid' | 'cancelled'
  createdAt: Date
  customerInfo?: {
    name: string
    email: string
    phone: string
    address: string
  }
}

export interface Settings {
  storeName: string
  storeDescription: string
  contactEmail: string
  contactPhone: string
}