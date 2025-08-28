import { doc, getDoc, getDocs, collection, updateDoc, deleteDoc, query, orderBy } from "firebase/firestore"
import { getDb } from "./firestore"
import type { User } from "@/lib/types"

const USERS_COLLECTION = "users"

export async function getUserProfile(userId: string) {
  try {
    const db = getDb()
    const docRef = doc(db, USERS_COLLECTION, userId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return docSnap.data()
    }

    return null
  } catch (error) {
    console.error("Error fetching user profile:", error)
    return null
  }
}

export async function getUsers(): Promise<User[]> {
  try {
    const db = getDb()
    const q = query(collection(db, USERS_COLLECTION), orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date()
    })) as User[]
  } catch (error) {
    console.error("Error getting users:", error)
    return []
  }
}

export async function updateUserRole(userId: string, isAdmin: boolean): Promise<boolean> {
  try {
    const db = getDb()
    const docRef = doc(db, USERS_COLLECTION, userId)
    await updateDoc(docRef, { isAdmin })
    return true
  } catch (error) {
    console.error("Error updating user role:", error)
    return false
  }
}

export async function updateUserProfile(userId: string, data: Partial<User>): Promise<boolean> {
  try {
    const db = getDb()
    const docRef = doc(db, USERS_COLLECTION, userId)
    await updateDoc(docRef, data)
    return true
  } catch (error) {
    console.error("Error updating user profile:", error)
    return false
  }
}

export async function deleteUser(userId: string): Promise<boolean> {
  try {
    const db = getDb()
    const docRef = doc(db, USERS_COLLECTION, userId)
    await deleteDoc(docRef)
    return true
  } catch (error) {
    console.error("Error deleting user:", error)
    return false
  }
}
