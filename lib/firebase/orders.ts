
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
    const docRef = await addDoc(collection(db, ORDERS_COLLECTION), {
      ...order,
      createdAt: new Date()
    })
    return docRef.id
  } catch (error) {
    console.error("Error creating order:", error)
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
    const q = query(
      collection(db, ORDERS_COLLECTION),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    )
    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date()
    })) as Order[]
  } catch (error) {
    console.error("Error getting user orders:", error)
    return []
  }
}
