export interface Product {
  id: string
  title: string
  name?: string
  description: string
  price: number
  image: string
  category: string
  featured: boolean
  features?: string[]
  size?: string
  sizes?: string[]
  isSmart?: boolean
  createdAt: Date
  updatedAt: Date
}

export interface CartItem {
  id: string
  productId: string
  name: string
  title?: string
  price: number
  image: string
  quantity: number
}

export interface User {
  id: string
  email: string
  name?: string
  role: 'admin' | 'customer'
  createdAt: Date
  updatedAt: Date
}

export interface Order {
  id: string
  userId: string
  items: CartItem[]
  total: number
  shippingFee?: number
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  customerInfo: {
    name: string
    email: string
    phone: string
    address: string
    cep: string
    numero: string
    complemento: string
  }
  paymentMethod?: 'pix' | 'whatsapp'
  createdAt: Date
  updatedAt: Date
}

export interface Category {
  id: string
  name: string
  description?: string
  image?: string
  featured: boolean
}

export interface Settings {
  id: string
  storeName: string
  storeDescription: string
  contactEmail: string
  contactPhone: string
  socialMedia: {
    instagram?: string
    whatsapp?: string
    facebook?: string
  }
  shipping: {
    freeShippingThreshold: number
    defaultShippingFee: number
  }
  updatedAt: Date
}