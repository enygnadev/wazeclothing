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
    console.log("🔥 Firebase: Conectando ao Firestore...")
    const db = getDb()
    
    console.log("📋 Firebase: Acessando coleção 'products'...")
    const productsRef = collection(db, "products")
    
    console.log("🔍 Firebase: Criando query...")
    const productsQuery = query(productsRef, orderBy("createdAt", "desc"))

    console.log("📡 Firebase: Executando query...")
    const snapshot = await getDocs(productsQuery)
    
    console.log("📊 Firebase: Documentos encontrados:", snapshot.size)
    
    if (snapshot.empty) {
      console.log("⚠️ Firebase: Nenhum produto encontrado na coleção")
      return []
    }

    const products = snapshot.docs.map(doc => {
      const data = doc.data()
      console.log("📄 Firebase: Produto encontrado:", doc.id, data.title || "Sem título")
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      }
    }) as Product[]
    
    console.log("✅ Firebase: Total de produtos processados:", products.length)
    return products
  } catch (error) {
    console.error("❌ Firebase: Erro ao buscar produtos:", error)
    console.error("🔍 Firebase: Tipo do erro:", error.code)
    console.error("📝 Firebase: Mensagem:", error.message)
    
    // Se há erro de permissão, tentar buscar sem orderBy
    if (error.code === 'permission-denied' || error.message?.includes('permission')) {
      try {
        console.log("🔄 Firebase: Tentando busca simples sem orderBy...")
        const db = getDb()
        const productsRef = collection(db, "products")
        const snapshot = await getDocs(productsRef)
        
        console.log("📊 Firebase: Documentos encontrados (sem orderBy):", snapshot.size)
        
        return snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        })) as Product[]
      } catch (retryError) {
        console.error("❌ Firebase: Erro na segunda tentativa:", retryError)
        return []
      }
    }
    
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
    console.error("Erro ao buscar tamanhos:", error)
    return ["PP", "P", "M", "G", "GG", "XG"]
  }
}

export async function createProduct(product: Omit<Product, "id">): Promise<string | null> {
  return addProduct(product)
}

export async function createCategory(name: string): Promise<boolean> {
  try {
    const db = getDb()
    const categoriesRef = collection(db, "categories")
    await addDoc(categoriesRef, { name })
    return true
  } catch (error) {
    console.error("Erro ao criar categoria:", error)
    return false
  }
}

export async function createSize(name: string): Promise<boolean> {
  try {
    const db = getDb()
    const sizesRef = collection(db, "sizes")
    await addDoc(sizesRef, { name })
    return true
  } catch (error) {
    console.error("Erro ao criar tamanho:", error)
    return false
  }
}

export async function getProduct(id: string): Promise<Product | null> {
  return getProductById(id)
}