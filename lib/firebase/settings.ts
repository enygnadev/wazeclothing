import { doc, getDoc, setDoc } from "firebase/firestore"
import { getDb } from "./firestore"

const SETTINGS_DOC = "settings/store"

export async function getSettings() {
  try {
    const db = getDb()
    const docRef = doc(db, SETTINGS_DOC)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return docSnap.data()
    }

    return null
  } catch (error) {
    console.error("Error getting settings:", error)
    return null
  }
}

export async function updateSettings(settings: any): Promise<boolean> {
  try {
    const db = getDb()
    const docRef = doc(db, SETTINGS_DOC)
    await setDoc(docRef, {
      ...settings,
      updatedAt: new Date()
    }, { merge: true })
    return true
  } catch (error) {
    console.error("Error updating settings:", error)
    return false
  }
}