
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  getDoc
} from "firebase/firestore"
import { getDb } from "./firestore"
import type { Product } from "@/lib/types"

export async function getProducts(): Promise<Product[]> {
  try {
    const db = getDb()
    const productsRef = collection(db, "products")
    const productsQuery = query(productsRef, orderBy("createdAt", "desc"))
    
    const snapshot = await getDocs(productsQuery)
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as Product[]
  } catch (error) {
    console.error("Erro ao buscar produtos:", error)
    return []
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const db = getDb()
    const productRef = doc(db, "products", id)
    const snapshot = await getDoc(productRef)
    
    if (!snapshot.exists()) {
      return null
    }
    
    return {
      id: snapshot.id,
      ...snapshot.data(),
      createdAt: snapshot.data().createdAt?.toDate() || new Date(),
      updatedAt: snapshot.data().updatedAt?.toDate() || new Date(),
    } as Product
  } catch (error) {
    console.error("Erro ao buscar produto:", error)
    return null
  }
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  try {
    const db = getDb()
    const productsRef = collection(db, "products")
    const categoryQuery = query(
      productsRef, 
      where("category", "==", category),
      orderBy("createdAt", "desc")
    )
    
    const snapshot = await getDocs(categoryQuery)
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as Product[]
  } catch (error) {
    console.error(`Erro ao buscar produtos da categoria ${category}:`, error)
    return []
  }
}

export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const db = getDb()
    const productsRef = collection(db, "products")
    const featuredQuery = query(
      productsRef, 
      where("featured", "==", true),
      orderBy("createdAt", "desc")
    )
    
    const snapshot = await getDocs(featuredQuery)
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as Product[]
  } catch (error) {
    console.error("Erro ao buscar produtos em destaque:", error)
    return []
  }
}

export async function addProduct(product: Omit<Product, "id">): Promise<string | null> {
  try {
    const db = getDb()
    const productsRef = collection(db, "products")
    
    const productData = {
      ...product,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    }
    
    const docRef = await addDoc(productsRef, productData)
    return docRef.id
  } catch (error) {
    console.error("Erro ao adicionar produto:", error)
    return null
  }
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<boolean> {
  try {
    const db = getDb()
    const productRef = doc(db, "products", id)
    
    const updateData = {
      ...updates,
      updatedAt: Timestamp.now(),
    }
    
    await updateDoc(productRef, updateData)
    return true
  } catch (error) {
    console.error("Erro ao atualizar produto:", error)
    return false
  }
}

export async function deleteProduct(id: string): Promise<boolean> {
  try {
    const db = getDb()
    const productRef = doc(db, "products", id)
    
    await deleteDoc(productRef)
    return true
  } catch (error) {
    console.error("Erro ao deletar produto:", error)
    return false
  }
}

// Funções para categorias e tamanhos
export async function getCategories(): Promise<string[]> {
  try {
    const products = await getProducts()
    const categories = [...new Set(products.map(product => product.category).filter(Boolean))]
    return categories.length > 0 ? categories : ["camisetas", "calças", "vestidos", "acessórios"]
  } catch (error) {
    console.error("Erro ao buscar categorias:", error)
    return ["camisetas", "calças", "vestidos", "acessórios"]
  }
}

export async function getSizes(): Promise<string[]> {
  try {
    const products = await getProducts()
    const sizes = [...new Set(products.map(product => product.size).filter(Boolean))]
    return sizes.length > 0 ? sizes : ["PP", "P", "M", "G", "GG"]
  } catch (error) {
    console.error("Erro ao buscar tamanhos:", error)
    return ["PP", "P", "M", "G", "GG"]
  }
}

export async function createProduct(product: Omit<Product, "id">): Promise<string | null> {
  return addProduct(product)
}
