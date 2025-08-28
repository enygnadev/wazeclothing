
import { collection, getDocs, query, where, orderBy } from "firebase/firestore"
import { getDb } from "./firestore"

export async function getDashboardStats() {
  try {
    const db = getDb()
    
    // Buscar produtos
    const productsSnapshot = await getDocs(collection(db, "products"))
    const totalProducts = productsSnapshot.size

    // Buscar pedidos
    const ordersSnapshot = await getDocs(collection(db, "orders"))
    const totalOrders = ordersSnapshot.size
    
    // Calcular receita total
    let totalRevenue = 0
    ordersSnapshot.docs.forEach(doc => {
      const order = doc.data()
      if (order.status !== "cancelled") {
        totalRevenue += order.total || 0
      }
    })

    // Buscar usuários
    const usersSnapshot = await getDocs(collection(db, "users"))
    const totalUsers = usersSnapshot.size

    // Para simplificar, vou usar valores mockados para o crescimento mensal
    // Em produção, você implementaria a lógica real de comparação
    const monthlyChange = {
      products: 12,
      orders: 8,
      users: 23,
      revenue: 15
    }

    return {
      totalProducts,
      totalOrders,
      totalUsers,
      totalRevenue,
      monthlyChange
    }
  } catch (error) {
    console.error("Error getting dashboard stats:", error)
    return {
      totalProducts: 0,
      totalOrders: 0,
      totalUsers: 0,
      totalRevenue: 0,
      monthlyChange: {
        products: 0,
        orders: 0,
        users: 0,
        revenue: 0
      }
    }
  }
}

export async function getMonthlyStats() {
  // Implementar lógica para estatísticas mensais
  return []
}

export async function getCategoryStats() {
  // Implementar lógica para estatísticas por categoria
  return []
}
import { collection, query, where, getDocs, orderBy, limit, Timestamp } from "firebase/firestore"
import { getDb } from "./firestore"

export interface DashboardStats {
  totalProducts: number
  totalOrders: number
  totalUsers: number
  totalRevenue: number
  monthlyRevenue: number
  pendingOrders: number
}

export interface MonthlyStats {
  month: string
  revenue: number
  orders: number
  customers: number
}

export interface CategoryStats {
  category: string
  count: number
  revenue: number
}

export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const db = getDb()
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    // Get total products
    const productsQuery = query(collection(db, "products"))
    const productsSnapshot = await getDocs(productsQuery)
    const totalProducts = productsSnapshot.size

    // Get total orders
    const ordersQuery = query(collection(db, "orders"))
    const ordersSnapshot = await getDocs(ordersQuery)
    const totalOrders = ordersSnapshot.size

    // Get total users
    const usersQuery = query(collection(db, "users"))
    const usersSnapshot = await getDocs(usersQuery)
    const totalUsers = usersSnapshot.size

    // Calculate total revenue
    let totalRevenue = 0
    let monthlyRevenue = 0
    let pendingOrders = 0

    ordersSnapshot.docs.forEach(doc => {
      const order = doc.data()
      const orderTotal = order.total || 0
      totalRevenue += orderTotal

      // Monthly revenue
      if (order.createdAt && order.createdAt.toDate() >= startOfMonth) {
        monthlyRevenue += orderTotal
      }

      // Pending orders
      if (order.status === 'pending' || order.status === 'processing') {
        pendingOrders++
      }
    })

    return {
      totalProducts,
      totalOrders,
      totalUsers,
      totalRevenue,
      monthlyRevenue,
      pendingOrders
    }
  } catch (error) {
    console.error("Error getting dashboard stats:", error)
    return {
      totalProducts: 0,
      totalOrders: 0,
      totalUsers: 0,
      totalRevenue: 0,
      monthlyRevenue: 0,
      pendingOrders: 0
    }
  }
}

export async function getMonthlyStats(): Promise<MonthlyStats[]> {
  try {
    const db = getDb()
    const now = new Date()
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1)

    const ordersQuery = query(
      collection(db, "orders"),
      where("createdAt", ">=", Timestamp.fromDate(sixMonthsAgo)),
      orderBy("createdAt", "desc")
    )
    
    const ordersSnapshot = await getDocs(ordersQuery)
    
    const monthlyData: { [key: string]: { revenue: number, orders: number, customers: Set<string> } } = {}

    ordersSnapshot.docs.forEach(doc => {
      const order = doc.data()
      const date = order.createdAt?.toDate() || new Date()
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          revenue: 0,
          orders: 0,
          customers: new Set()
        }
      }
      
      monthlyData[monthKey].revenue += order.total || 0
      monthlyData[monthKey].orders += 1
      monthlyData[monthKey].customers.add(order.userId)
    })

    return Object.entries(monthlyData).map(([month, data]) => ({
      month,
      revenue: data.revenue,
      orders: data.orders,
      customers: data.customers.size
    })).sort((a, b) => a.month.localeCompare(b.month))
  } catch (error) {
    console.error("Error getting monthly stats:", error)
    return []
  }
}

export async function getCategoryStats(): Promise<CategoryStats[]> {
  try {
    const db = getDb()
    
    // Get products to count by category
    const productsQuery = query(collection(db, "products"))
    const productsSnapshot = await getDocs(productsQuery)
    
    // Get orders to calculate revenue by category
    const ordersQuery = query(collection(db, "orders"))
    const ordersSnapshot = await getDocs(ordersQuery)
    
    const categoryData: { [key: string]: { count: number, revenue: number } } = {}

    // Count products by category
    productsSnapshot.docs.forEach(doc => {
      const product = doc.data()
      const category = product.category || 'Sem Categoria'
      
      if (!categoryData[category]) {
        categoryData[category] = { count: 0, revenue: 0 }
      }
      
      categoryData[category].count += 1
    })

    // Calculate revenue by category from orders
    ordersSnapshot.docs.forEach(doc => {
      const order = doc.data()
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach((item: any) => {
          const category = item.category || 'Sem Categoria'
          
          if (!categoryData[category]) {
            categoryData[category] = { count: 0, revenue: 0 }
          }
          
          categoryData[category].revenue += (item.price * item.quantity) || 0
        })
      }
    })

    return Object.entries(categoryData).map(([category, data]) => ({
      category,
      count: data.count,
      revenue: data.revenue
    })).sort((a, b) => b.revenue - a.revenue)
  } catch (error) {
    console.error("Error getting category stats:", error)
    return []
  }
}
