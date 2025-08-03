import { doc, getDoc } from "firebase/firestore"
import { getDb } from "./firestore"

export async function getUserProfile(userId: string) {
  try {
    const db = getDb()
    const docRef = doc(db, "users", userId)
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
