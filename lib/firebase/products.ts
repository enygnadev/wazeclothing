import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  limit,
} from "firebase/firestore"
import { getDb } from "./firestore"
import type { Product } from "@/lib/types"

const PRODUCTS_COLLECTION = "products"

export async function getProducts(): Promise<Product[]> {
  try {
    const db = getDb()
    const q = query(collection(db, PRODUCTS_COLLECTION), orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date()
    })) as Product[]
  } catch (error) {
    console.error("Error getting products:", error)
    return []
  }
}

export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const db = getDb()
    const q = query(
      collection(db, PRODUCTS_COLLECTION),
      where("featured", "==", true),
      orderBy("createdAt", "desc"),
      limit(8)
    )
    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date()
    })) as Product[]
  } catch (error) {
    console.error("Error getting featured products:", error)
    return []
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const db = getDb()
    const docRef = doc(db, PRODUCTS_COLLECTION, id)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt?.toDate() || new Date()
      } as Product
    }

    return null
  } catch (error) {
    console.error("Error getting product:", error)
    return null
  }
}

export async function addProduct(product: Omit<Product, "id">): Promise<string | null> {
  try {
    const db = getDb()
    const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), {
      ...product,
      createdAt: new Date()
    })
    return docRef.id
  } catch (error) {
    console.error("Error adding product:", error)
    return null
  }
}

export async function updateProduct(id: string, product: Partial<Product>): Promise<boolean> {
  try {
    const db = getDb()
    const docRef = doc(db, PRODUCTS_COLLECTION, id)
    await updateDoc(docRef, product)
    return true
  } catch (error) {
    console.error("Error updating product:", error)
    return false
  }
}

export async function deleteProduct(id: string): Promise<boolean> {
  try {
    const db = getDb()
    const docRef = doc(db, PRODUCTS_COLLECTION, id)
    await deleteDoc(docRef)
    return true
  } catch (error) {
    console.error("Error deleting product:", error)
    return false
  }
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  try {
    const db = getDb()
    const q = query(
      collection(db, PRODUCTS_COLLECTION),
      where("category", "==", category),
      orderBy("createdAt", "desc")
    )
    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date()
    })) as Product[]
  } catch (error) {
    console.error("Error getting products by category:", error)
    return []
  }
}

export async function getCategories(): Promise<string[]> {
  try {
    const db = getDb()
    const q = query(collection(db, PRODUCTS_COLLECTION))
    const querySnapshot = await getDocs(q)
    
    const categories = new Set<string>()
    querySnapshot.docs.forEach(doc => {
      const data = doc.data()
      if (data.category) {
        categories.add(data.category)
      }
    })
    
    return Array.from(categories).sort()
  } catch (error) {
    console.error("Error getting categories:", error)
    return []
  }
}

export async function getSizes(): Promise<string[]> {
  try {
    const db = getDb()
    const q = query(collection(db, PRODUCTS_COLLECTION))
    const querySnapshot = await getDocs(q)
    
    const sizes = new Set<string>()
    querySnapshot.docs.forEach(doc => {
      const data = doc.data()
      if (data.size) {
        sizes.add(data.size)
      }
    })
    
    return Array.from(sizes).sort()
  } catch (error) {
    console.error("Error getting sizes:", error)
    return []
  }
}

export async function createCategory(categoryName: string): Promise<boolean> {
  try {
    // Categories are created implicitly when products are added
    // This function exists for compatibility but doesn't need to do anything
    return true
  } catch (error) {
    console.error("Error creating category:", error)
    return false
  }
}

export async function createSize(sizeName: string): Promise<boolean> {
  try {
    // Sizes are created implicitly when products are added
    // This function exists for compatibility but doesn't need to do anything
    return true
  } catch (error) {
    console.error("Error creating size:", error)
    return false
  }
}

export async function createProduct(product: Omit<Product, "id">): Promise<string | null> {
  return addProduct(product)
}

// Re-export to ensure they are available
export { getCategories, getSizes } from "./products"