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
} from "firebase/firestore"
import { getDb } from "./firestore"
import type { Product } from "@/lib/types"
import { getFirestore} from "firebase/firestore"

const PRODUCTS_COLLECTION = "products"
const CATEGORIES_COLLECTION = "categories"
const SIZES_COLLECTION = "sizes"

const db = getDb() // ✅ correto, vem de firestore.ts


// 📦 Buscar lista de produtos (com busca opcional)
export async function getProducts(searchTerm?: string): Promise<Product[]> {
  try {
    const db = getDb()
    const q = query(collection(db, PRODUCTS_COLLECTION), orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)

    const products: Product[] = []

    querySnapshot.forEach((doc) => {
      const data = doc.data()

      const product: Product = {
        id: doc.id,
        title: data.title,
        description: data.description,
        price: data.price,
        image: data.image,
        category: data.category ?? "sem-categoria",
        features: Array.isArray(data.features) ? data.features : [],
        featured: data.featured === true,
        size: data.size ?? "Único",
        isSmart: data.isSmart === true,
        createdAt: data.createdAt?.toDate?.() ?? new Date(),
      }

      if (
        !searchTerm ||
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        products.push(product)
      }
    })

    return products
  } catch (error) {
    console.error("❌ Erro ao buscar produtos:", error)
    return []
  }
}

// 📦 Buscar produto individual
export async function getProduct(id: string): Promise<Product | null> {
  try {
    const db = getDb()
    const docRef = doc(db, PRODUCTS_COLLECTION, id)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const data = docSnap.data()
      return {
        id: docSnap.id,
        title: data.title,
        description: data.description,
        price: data.price,
        image: data.image,
        category: data.category ?? "sem-categoria",
        features: Array.isArray(data.features) ? data.features : [],
        featured: data.featured === true,
        size: data.size ?? "Único",
        isSmart: data.isSmart === true,
        createdAt: data.createdAt?.toDate?.() ?? new Date(),
      }
    }

    return null
  } catch (error) {
    console.error("❌ Erro ao buscar produto:", error)
    return null
  }
}

// ➕ Criar novo produto
export async function createProduct(
  productData: Omit<Product, "id" | "createdAt">
): Promise<Product> {
  try {
    const db = getDb()
    const createdAt = new Date()
    const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), {
      ...productData,
      createdAt,
    })

    return {
      id: docRef.id,
      ...productData,
      createdAt,
    }
  } catch (error) {
    console.error("❌ Erro ao criar produto:", error)
    throw error
  }
}

// ✏️ Atualizar produto existente
export async function updateProduct(
  id: string,
  productData: Partial<Product>
): Promise<void> {
  try {
    const db = getDb()
    const docRef = doc(db, PRODUCTS_COLLECTION, id)
    await updateDoc(docRef, {
      ...productData,
      updatedAt: new Date(),
    })
  } catch (error) {
    console.error("❌ Erro ao atualizar produto:", error)
    throw error
  }
}

// 🗑️ Deletar produto
export async function deleteProduct(id: string): Promise<void> {
  try {
    const db = getDb()
    const docRef = doc(db, PRODUCTS_COLLECTION, id)
    await deleteDoc(docRef)
  } catch (error) {
    console.error("❌ Erro ao deletar produto:", error)
    throw error
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  const ref = doc(db, "products", id)
  const snap = await getDoc(ref)
  if (snap.exists()) {
    return { id: snap.id, ...snap.data() } as Product
  }
  return null
}

// 🏷️ Buscar categorias (retorna nomes)
export async function getCategories(): Promise<string[]> {
  try {
    const db = getDb()
    const snapshot = await getDocs(collection(db, CATEGORIES_COLLECTION))
    return snapshot.docs.map((doc) => doc.data().name)
  } catch (error) {
    console.error("❌ Erro ao buscar categorias:", error)
    return []
  }
}

// ➕ Criar nova categoria
export async function createCategory(name: string): Promise<void> {
  try {
    const db = getDb()
    await addDoc(collection(db, CATEGORIES_COLLECTION), { name })
  } catch (error) {
    console.error("❌ Erro ao criar categoria:", error)
  }
}

// 📏 Buscar tamanhos (retorna nomes)
export async function getSizes(): Promise<string[]> {
  try {
    const db = getDb()
    const snapshot = await getDocs(collection(db, SIZES_COLLECTION))
    return snapshot.docs.map((doc) => doc.data().name)
  } catch (error) {
    console.error("❌ Erro ao buscar tamanhos:", error)
    return []
  }
}

// ➕ Criar novo tamanho
export async function createSize(name: string): Promise<void> {
  try {
    const db = getDb()
    await addDoc(collection(db, SIZES_COLLECTION), { name })
  } catch (error) {
    console.error("❌ Erro ao criar tamanho:", error)
  }
}
