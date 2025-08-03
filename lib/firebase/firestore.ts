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
