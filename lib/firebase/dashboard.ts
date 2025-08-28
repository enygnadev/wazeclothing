import { getDb } from "./firestore"
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore"

export interface DashboardStats {
  totalProducts: number
  totalUsers: number
  totalOrders: number
  totalRevenue: number
  monthlyChange: {
    products: number
    orders: number
    users: number
    revenue: number
  }
}

export interface MonthlyStats {
  month: string
  sales: number
  orders: number
}

export interface CategoryStats {
  name: string
  value: number
  color: string
}

export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const db = getDb()

    // Get total products
    const productsQuery = query(collection(db, "products"))
    const productsSnapshot = await getDocs(productsQuery)
    const totalProducts = productsSnapshot.size

    // Get total users
    const usersQuery = query(collection(db, "users"))
    const usersSnapshot = await getDocs(usersQuery)
    const totalUsers = usersSnapshot.size

    // Get total orders
    const ordersQuery = query(collection(db, "orders"))
    const ordersSnapshot = await getDocs(ordersQuery)
    const totalOrders = ordersSnapshot.size

    // Calculate total revenue
    let totalRevenue = 0
    ordersSnapshot.docs.forEach(doc => {
      const data = doc.data()
      if (data.total && typeof data.total === 'number') {
        totalRevenue += data.total
      }
    })

    // Calculate monthly changes (mock for now)
    const monthlyChange = {
      products: 8.2,
      orders: 12.5,
      users: 15.3,
      revenue: 9.7
    }

    return {
      totalProducts,
      totalUsers,
      totalOrders,
      totalRevenue,
      monthlyChange
    }
  } catch (error) {
    console.error("Error getting dashboard stats:", error)
    return {
      totalProducts: 0,
      totalUsers: 0,
      totalOrders: 0,
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

export async function getMonthlyStats(): Promise<MonthlyStats[]> {
  try {
    const db = getDb()
    const ordersQuery = query(
      collection(db, "orders"),
      orderBy("createdAt", "desc"),
      limit(12)
    )
    const ordersSnapshot = await getDocs(ordersQuery)

    const monthlyData: { [key: string]: { sales: number, orders: number } } = {}

    ordersSnapshot.docs.forEach(doc => {
      const data = doc.data()
      if (data.createdAt && data.total) {
        const date = data.createdAt.toDate()
        const monthKey = date.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })

        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = { sales: 0, orders: 0 }
        }

        monthlyData[monthKey].sales += data.total
        monthlyData[monthKey].orders += 1
      }
    })

    return Object.entries(monthlyData).map(([month, data]) => ({
      month,
      sales: data.sales,
      orders: data.orders
    })).slice(0, 6)
  } catch (error) {
    console.error("Error getting monthly stats:", error)
    return []
  }
}

export async function getCategoryStats(): Promise<CategoryStats[]> {
  try {
    const db = getDb()
    const productsQuery = query(collection(db, "products"))
    const productsSnapshot = await getDocs(productsQuery)

    const categoryData: { [key: string]: number } = {}

    productsSnapshot.docs.forEach(doc => {
      const data = doc.data()
      if (data.category) {
        categoryData[data.category] = (categoryData[data.category] || 0) + 1
      }
    })

    const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff88', '#ff0088']

    return Object.entries(categoryData).map(([name, value], index) => ({
      name,
      value,
      color: colors[index % colors.length]
    }))
  } catch (error) {
    console.error("Error getting category stats:", error)
    return []
  }
}