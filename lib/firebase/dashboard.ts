
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
