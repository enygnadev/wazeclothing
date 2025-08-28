export interface Product {
  id: string
  title: string
  description: string
  price: number
  image: string
  category: string // agora obrigatório para garantir filtro por categoria
  features: string[] // agora obrigatório para consistência de exibição
  featured: boolean
  size: string // obrigatório para uso em filtros (ex: GG, M)
  isSmart: boolean // útil mesmo para roupas (false)
  createdAt: Date
}

export interface User {
  id: string
  email: string
  displayName: string
  isAdmin: boolean
  createdAt: Date
}

export interface CartItem {
  id: string
  title: string
  price: number
  image: string
  quantity: number
}

export interface Order {
  id: string
  userId: string
  items: CartItem[]
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  customerInfo?: {
    name: string
    email: string
    phone: string
    address: string
  }
  paymentMethod?: "pix" | "credit_card" | "whatsapp"
  shippingFee: number
  createdAt: Date
} Date
}
