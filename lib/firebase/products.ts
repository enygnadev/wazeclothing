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
    // Para usuários não logados, retornar produtos de exemplo
    if (error.code === 'permission-denied') {
      console.warn("Usando produtos de exemplo para usuário não logado")
      return getSampleProducts()
    }
    console.error("Erro ao buscar produtos:", error)
    throw error
  }
}

// Produtos de exemplo para usuários não logados
function getSampleProducts(): Product[] {
  return [
    {
      id: "sample-1",
      title: "Nike Air Force 1",
      description: "Tênis Nike Air Force 1 clássico, confortável e estiloso.",
      price: 299.90,
      image: "https://source.unsplash.com/400x400/?nike,sneakers",
      category: "nike",
      size: "42",
      featured: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: "sample-2", 
      title: "Adidas Ultraboost",
      description: "Tênis Adidas Ultraboost para corrida e uso casual.",
      price: 399.90,
      image: "https://source.unsplash.com/400x400/?adidas,shoes",
      category: "adidas",
      size: "40",
      featured: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: "sample-3",
      title: "Jordan Retro 1",
      description: "Tênis Jordan Retro 1 edição limitada.",
      price: 899.90,
      image: "https://source.unsplash.com/400x400/?jordan,basketball",
      category: "jordan",
      size: "41",
      featured: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: "sample-4",
      title: "Lacoste Graduate",
      description: "Tênis Lacoste Graduate em couro premium.",
      price: 459.90,
      image: "https://source.unsplash.com/400x400/?lacoste,shoes",
      category: "lacoste",
      size: "43",
      featured: false,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: "sample-5",
      title: "Puma Suede Classic",
      description: "Tênis Puma Suede Classic atemporal.",
      price: 259.90,
      image: "https://source.unsplash.com/400x400/?puma,sneakers",
      category: "puma",
      size: "39",
      featured: false,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: "sample-6",
      title: "Nike Dunk Low",
      description: "Tênis Nike Dunk Low retrô.",
      price: 549.90,
      image: "https://source.unsplash.com/400x400/?nike,dunk",
      category: "nike",
      size: "44",
      featured: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]
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
    const db = getDb()
    const categoriesRef = collection(db, "categories")
    const snapshot = await getDocs(categoriesRef)

    if (snapshot.empty) {
      // Return default categories if none exist
      return ["nike", "adidas", "lacoste", "jordan", "puma"]
    }

    return snapshot.docs.map(doc => doc.data().name)
  } catch (error) {
    console.error("Erro ao buscar categorias:", error)
    return ["nike", "adidas", "lacoste", "jordan", "puma"]
  }
}

export async function getSizes(): Promise<string[]> {
  try {
    const db = getDb()
    const sizesRef = collection(db, "sizes")
    const snapshot = await getDocs(sizesRef)

    if (snapshot.empty) {
      return ["PP", "P", "M", "G", "GG", "XG"]
    }

    return snapshot.docs.map(doc => doc.data().name)
  } catch (error) {
    // Silenciar erros de permissão para usuários não logados  
    if (error.code === 'permission-denied') {
      console.warn("Usando tamanhos padrão - acesso não autorizado")
      return ["PP", "P", "M", "G", "GG", "XG"]
    }
    console.error("Erro ao buscar tamanhos:", error)
    return ["PP", "P", "M", "G", "GG", "XG"]
  }
}

export async function createProduct(product: Omit<Product, "id">): Promise<string | null> {
  return addProduct(product)
}