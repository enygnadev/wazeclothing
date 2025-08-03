import { doc, getDoc, setDoc } from "firebase/firestore"
import { getDb } from "./firestore"

export async function getCart(uid: string) {
  const db = getDb()
  const ref = doc(db, "carts", uid)
  const snap = await getDoc(ref)
  return snap.exists() ? snap.data() : null
}

export async function updateCart(uid: string, items: { productId: string; quantity: number }[]) {
  const db = getDb()
  const ref = doc(db, "carts", uid)
  await setDoc(ref, { items }, { merge: true })
}
