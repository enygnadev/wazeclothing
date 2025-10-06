
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  query,
  orderBy,
  where,
} from "firebase/firestore"
import { getDb } from "./firestore"
import type { Order } from "@/lib/types"

const ORDERS_COLLECTION = "orders"

export async function getOrders(): Promise<Order[]> {
  try {
    const db = getDb()
    const q = query(collection(db, ORDERS_COLLECTION), orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date()
    })) as Order[]
  } catch (error) {
    console.error("Error getting orders:", error)
    return []
  }
}

export async function getOrderById(id: string): Promise<Order | null> {
  try {
    const db = getDb()
    const docRef = doc(db, ORDERS_COLLECTION, id)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt?.toDate() || new Date()
      } as Order
    }

    return null
  } catch (error) {
    console.error("Error getting order:", error)
    return null
  }
}

export async function createOrder(order: Omit<Order, "id">): Promise<string | null> {
  try {
    const db = getDb()
    
    console.log("📝 Criando pedido com dados:", {
      userId: order.userId,
      userEmail: order.userEmail,
      itemsCount: Array.isArray(order.items) ? order.items.length : (order.items ? Object.keys(order.items).length : 0),
      total: order.total
    })
    
    const orderData = {
      ...order,
      createdAt: new Date()
    }
    
    console.log("💾 Dados completos do pedido a ser salvo:", JSON.stringify(orderData, null, 2))
    
    const docRef = await addDoc(collection(db, ORDERS_COLLECTION), orderData)
    
    console.log("✅ Pedido criado com ID:", docRef.id)
    
    // Verificar se foi salvo
    const savedDoc = await getDoc(docRef)
    if (savedDoc.exists()) {
      console.log("✅ Pedido verificado no Firebase:", savedDoc.data())
    } else {
      console.error("❌ Pedido não foi encontrado após criação!")
    }
    
    return docRef.id
  } catch (error) {
    console.error("❌ Erro ao criar pedido:", error)
    if (error instanceof Error) {
      console.error("❌ Mensagem:", error.message)
      console.error("❌ Stack:", error.stack)
    }
    return null
  }
}

export async function updateOrderStatus(orderId: string, status: string): Promise<boolean> {
  try {
    const db = getDb()
    const docRef = doc(db, ORDERS_COLLECTION, orderId)
    await updateDoc(docRef, { status })
    return true
  } catch (error) {
    console.error("Error updating order status:", error)
    return false
  }
}

export async function getOrdersByUser(userId: string): Promise<Order[]> {
  try {
    const db = getDb()
    console.log("🔍 Buscando pedidos para userId:", userId)
    console.log("📂 Collection:", ORDERS_COLLECTION)
    console.log("🔑 Tipo do userId:", typeof userId, "Valor:", userId)
    
    // Primeiro, vamos buscar TODOS os pedidos para debug
    const allOrdersSnapshot = await getDocs(collection(db, ORDERS_COLLECTION))
    console.log("📊 Total de pedidos no Firebase:", allOrdersSnapshot.docs.length)
    
    if (allOrdersSnapshot.docs.length > 0) {
      console.log("📋 TODOS OS PEDIDOS NO FIREBASE:")
      allOrdersSnapshot.docs.forEach((doc, index) => {
        const data = doc.data()
        console.log(`\n  📦 Pedido ${index + 1}:`)
        console.log(`    ID do documento: ${doc.id}`)
        console.log(`    userId: "${data.userId}" (tipo: ${typeof data.userId})`)
        console.log(`    userEmail: ${data.userEmail}`)
        console.log(`    userName: ${data.userName}`)
        console.log(`    Total: ${data.total || data.totalPrice}`)
        console.log(`    Status: ${data.status}`)
        console.log(`    Items: ${Array.isArray(data.items) ? data.items.length : (data.items ? Object.keys(data.items).length : 0)}`)
        console.log(`    ✅ Match com userId buscado? ${data.userId === userId ? "SIM" : "NÃO"}`)
        if (data.userId !== userId) {
          console.log(`    ❌ Esperado: "${userId}"`)
          console.log(`    ❌ Encontrado: "${data.userId}"`)
        }
      })
    } else {
      console.log("⚠️ NENHUM pedido encontrado no Firebase! A coleção está vazia.")
    }
    
    // Agora buscar pedidos do usuário específico
    const q = query(
      collection(db, ORDERS_COLLECTION),
      where("userId", "==", userId)
    )
    const querySnapshot = await getDocs(q)
    
    console.log("\n🎯 Resultado da busca filtrada por userId:")
    console.log("📦 Pedidos encontrados:", querySnapshot.docs.length)
    
    if (querySnapshot.docs.length === 0) {
      console.log("\n❌ NENHUM pedido encontrado para este usuário!")
      console.log("🔍 Diagnóstico:")
      console.log("  1. userId buscado:", userId)
      console.log("  2. Tipo do userId:", typeof userId)
      console.log("  3. Total de pedidos no Firebase:", allOrdersSnapshot.docs.length)
      if (allOrdersSnapshot.docs.length > 0) {
        console.log("  4. ⚠️ Existem pedidos no Firebase, mas nenhum com este userId!")
        console.log("  5. 💡 Verifique se o pedido foi criado com o userId correto no checkout")
      }
    }
    
    const orders = querySnapshot.docs.map(doc => {
      const data = doc.data()
      console.log("\n✅ Pedido correspondente encontrado:")
      console.log("  - ID:", doc.id)
      console.log("  - userId:", data.userId)
      console.log("  - userEmail:", data.userEmail)
      console.log("  - Total:", data.total || data.totalPrice)
      console.log("  - Status:", data.status)
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date()
      }
    }) as Order[]
    
    // Ordenar no frontend
    const sortedOrders = orders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    console.log("\n✅ Total de pedidos retornados:", sortedOrders.length)
    return sortedOrders
  } catch (error) {
    console.error("\n❌ ERRO ao buscar pedidos:", error)
    if (error instanceof Error) {
      console.error("❌ Mensagem de erro:", error.message)
      console.error("❌ Stack:", error.stack)
    }
    return []
  }
}
