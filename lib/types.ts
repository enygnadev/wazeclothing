
export interface Product {
  id: string
  title: string
  name?: string
  description: string
  price: number
  image: string
  category: string
  features: string[]
  featured: boolean
  size?: string
  sizes?: string[]
  isSmart: boolean
  createdAt: Date
  updatedAt: Date
}

export interface CartItem {
  id: string
  product: Product
  quantity: number
  selectedSize?: string
}

export interface User {
  id: string
  email: string
  name: string
  displayName?: string
  isAdmin: boolean
  createdAt: Date
  updatedAt: Date
  consentDate?: Date
  consentVersion?: string
}

export interface Order {
  id: string
  userId: string
  userEmail: string
  userName: string
  items: OrderItem[]
  total: number
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled'
  paymentMethod?: string
  deliveryAddress?: string
  notes?: string
  createdAt: Date
  updatedAt: Date
  whatsappSent?: boolean
  customerPhone?: string
}

export interface OrderItem {
  id: string
  productId: string
  title: string
  price: number
  quantity: number
  selectedSize?: string
  image?: string
}

export interface Category {
  id: string
  name: string
  icon?: string
  createdAt: Date
  updatedAt: Date
}

export interface Size {
  id: string
  name: string
  createdAt: Date
  updatedAt: Date
}

export interface AdminStats {
  totalProducts: number
  totalOrders: number
  totalUsers: number
  totalRevenue: number
  recentOrders: Order[]
  topProducts: Product[]
}

// Tipos para o chat/assistente
export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
}

export interface ChatSession {
  id: string
  userId?: string
  messages: ChatMessage[]
  createdAt: Date
  updatedAt: Date
}
