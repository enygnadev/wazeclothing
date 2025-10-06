
import { doc, getDoc, getDocs, collection, updateDoc, deleteDoc, query, where, addDoc, setDoc } from "firebase/firestore"
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
    const querySnapshot = await getDocs(collection(db, USERS_COLLECTION))

    const users = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date()
    })) as User[]
    
    // Ordenar no frontend
    return users.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  } catch (error) {
    console.error("Error getting users:", error)
    return []
  }
}

export async function updateUserRole(userId: string, isAdmin: boolean): Promise<boolean> {
  try {
    const db = getDb()
    const role = isAdmin ? 'admin' : 'cliente'
    const docRef = doc(db, USERS_COLLECTION, userId)
    await updateDoc(docRef, { 
      isAdmin,
      role 
    })
    return true
  } catch (error) {
    console.error("Error updating user role:", error)
    return false
  }
}

export async function updateUserProfile(userId: string, data: any): Promise<boolean> {
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

// Funções para endereços
export async function getUserAddresses(userId: string): Promise<any[]> {
  try {
    const db = getDb()
    const querySnapshot = await getDocs(collection(db, `users/${userId}/addresses`))
    
    const addresses = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date()
    }))
    
    // Ordenar no frontend
    return addresses.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  } catch (error) {
    console.error("Error getting user addresses:", error)
    return []
  }
}

export async function addUserAddress(userId: string, address: any): Promise<string | null> {
  try {
    const db = getDb()
    const docRef = await addDoc(collection(db, `users/${userId}/addresses`), {
      ...address,
      createdAt: new Date(),
      updatedAt: new Date()
    })
    return docRef.id
  } catch (error) {
    console.error("Error adding user address:", error)
    return null
  }
}

export async function updateUserAddress(addressId: string, address: any): Promise<boolean> {
  try {
    const db = getDb()
    // Precisamos encontrar o userId primeiro através do addressId
    // Por simplicidade, vamos assumir que o addressId contém o caminho completo
    const docRef = doc(db, `users/${address.userId}/addresses/${addressId}`)
    await updateDoc(docRef, {
      ...address,
      updatedAt: new Date()
    })
    return true
  } catch (error) {
    console.error("Error updating user address:", error)
    return false
  }
}

export async function deleteUserAddress(addressId: string): Promise<boolean> {
  try {
    const db = getDb()
    // Por simplicidade, vamos deletar diretamente
    await deleteDoc(doc(db, `addresses/${addressId}`))
    return true
  } catch (error) {
    console.error("Error deleting user address:", error)
    return false
  }
}

// Funções para métodos de pagamento
export async function getUserPaymentMethods(userId: string): Promise<any[]> {
  try {
    const db = getDb()
    const querySnapshot = await getDocs(collection(db, `users/${userId}/paymentMethods`))
    
    const paymentMethods = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date()
    }))
    
    // Ordenar no frontend
    return paymentMethods.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  } catch (error) {
    console.error("Error getting payment methods:", error)
    return []
  }
}

export async function addUserPaymentMethod(userId: string, paymentMethod: any): Promise<string | null> {
  try {
    const db = getDb()
    const docRef = await addDoc(collection(db, `users/${userId}/paymentMethods`), {
      ...paymentMethod,
      createdAt: new Date(),
      updatedAt: new Date()
    })
    return docRef.id
  } catch (error) {
    console.error("Error adding payment method:", error)
    return null
  }
}

export async function deleteUserPaymentMethod(paymentMethodId: string): Promise<boolean> {
  try {
    const db = getDb()
    await deleteDoc(doc(db, `paymentMethods/${paymentMethodId}`))
    return true
  } catch (error) {
    console.error("Error deleting payment method:", error)
    return false
  }
}

// Funções para lista de desejos
export async function getUserWishlist(userId: string): Promise<any[]> {
  try {
    const db = getDb()
    const querySnapshot = await getDocs(collection(db, `users/${userId}/wishlist`))
    
    const wishlist = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date()
    }))
    
    // Ordenar no frontend
    return wishlist.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  } catch (error) {
    console.error("Error getting wishlist:", error)
    return []
  }
}

export async function addToWishlist(userId: string, productId: string, productData: any): Promise<boolean> {
  try {
    const db = getDb()
    await setDoc(doc(db, `users/${userId}/wishlist/${productId}`), {
      productId,
      ...productData,
      createdAt: new Date()
    })
    return true
  } catch (error) {
    console.error("Error adding to wishlist:", error)
    return false
  }
}

export async function removeFromWishlist(userId: string, productId: string): Promise<boolean> {
  try {
    const db = getDb()
    await deleteDoc(doc(db, `users/${userId}/wishlist/${productId}`))
    return true
  } catch (error) {
    console.error("Error removing from wishlist:", error)
    return false
  }
}

// Funções LGPD
export async function exportUserData(userId: string): Promise<any | null> {
  try {
    const db = getDb()
    
    // Buscar dados do usuário
    const userDoc = await getDoc(doc(db, USERS_COLLECTION, userId))
    const userData = userDoc.exists() ? userDoc.data() : null
    
    // Buscar endereços
    const addressesSnapshot = await getDocs(collection(db, `users/${userId}/addresses`))
    const addresses = addressesSnapshot.docs.map(doc => doc.data())
    
    // Buscar métodos de pagamento
    const paymentMethodsSnapshot = await getDocs(collection(db, `users/${userId}/paymentMethods`))
    const paymentMethods = paymentMethodsSnapshot.docs.map(doc => doc.data())
    
    // Buscar wishlist
    const wishlistSnapshot = await getDocs(collection(db, `users/${userId}/wishlist`))
    const wishlist = wishlistSnapshot.docs.map(doc => doc.data())
    
    // Buscar pedidos
    const ordersSnapshot = await getDocs(query(collection(db, "orders"), where("userId", "==", userId)))
    const orders = ordersSnapshot.docs.map(doc => doc.data())
    
    return {
      user: userData,
      addresses,
      paymentMethods,
      wishlist,
      orders,
      exportDate: new Date().toISOString()
    }
  } catch (error) {
    console.error("Error exporting user data:", error)
    return null
  }
}

export async function deleteUserDataCompletely(userId: string): Promise<boolean> {
  try {
    const db = getDb()
    
    // Deletar endereços
    const addressesSnapshot = await getDocs(collection(db, `users/${userId}/addresses`))
    for (const doc of addressesSnapshot.docs) {
      await deleteDoc(doc.ref)
    }
    
    // Deletar métodos de pagamento
    const paymentMethodsSnapshot = await getDocs(collection(db, `users/${userId}/paymentMethods`))
    for (const doc of paymentMethodsSnapshot.docs) {
      await deleteDoc(doc.ref)
    }
    
    // Deletar wishlist
    const wishlistSnapshot = await getDocs(collection(db, `users/${userId}/wishlist`))
    for (const doc of wishlistSnapshot.docs) {
      await deleteDoc(doc.ref)
    }
    
    // Deletar usuário
    await deleteDoc(doc(db, USERS_COLLECTION, userId))
    
    return true
  } catch (error) {
    console.error("Error deleting user data completely:", error)
    return false
  }
}
