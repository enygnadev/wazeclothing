import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"
import { app } from "./config" // ✅ Corrigido aqui

// Initialize Firestore and Storage only when needed
let db: any = null
let storage: any = null

export function getDb() {
  if (!db) {
    db = getFirestore(app)
  }
  return db
}

export function getStorageInstance() {
  if (!storage) {
    storage = getStorage(app)
  }
  return storage
}

// Export for backward compatibility
export { getDb as db, getStorageInstance as storage }

export const createDocument = async (collectionName: string, data: Record<string, unknown>): Promise<string> => {
  // Placeholder for actual implementation
  return Promise.resolve("");
}

export const updateDocument = async (collectionName: string, docId: string, data: Record<string, unknown>): Promise<void> => {
  // Placeholder for actual implementation
  return Promise.resolve();
}