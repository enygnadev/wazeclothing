"use client"

import React from "react"
import { createContext, useContext, useState } from "react"
import type { User } from "firebase/auth"
import { getUserProfile } from "@/lib/firebase/users"

interface AuthContextType {
  user: User | null
  userProfile: any | null
  loading: boolean
  initialized: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  initializeAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  loading: false,
  initialized: false,
  signIn: async () => {},
  signUp: async () => {},
  signInWithGoogle: async () => {},
  signOut: async () => {},
  initializeAuth: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<any | null>(null)
  const [loading, setLoading] = useState(false)
  const [initialized, setInitialized] = useState(false)
  const [authUnsubscribe, setAuthUnsubscribe] = useState<(() => void) | null>(null)

  const initializeAuth = async () => {
    if (initialized || typeof window === "undefined") return

    setLoading(true)

    try {
      // Dynamic imports to avoid SSR issues
      const { getAuth } = await import("firebase/auth")
      const { onAuthStateChanged } = await import("firebase/auth")
      const app = (await import("@/lib/firebase/config")).default

      const auth = getAuth(app)

      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        setUser(user)

        if (user) {
          try {
            const profile = await getUserProfile(user.uid)
            setUserProfile(profile)
          } catch (error) {
            console.error("Error fetching user profile:", error)
            setUserProfile(null)
          }
        } else {
          setUserProfile(null)
        }

        setLoading(false)
      })

      setAuthUnsubscribe(() => unsubscribe)
      setInitialized(true)
    } catch (error) {
      console.error("Error initializing auth:", error)
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    if (!initialized) await initializeAuth()

    const { signInWithEmailAndPassword } = await import("firebase/auth")
    const { getAuth } = await import("firebase/auth")
    const app = (await import("@/lib/firebase/config")).default

    const auth = getAuth(app)
    await signInWithEmailAndPassword(auth, email, password)
  }

  const signUp = async (email: string, password: string) => {
    if (!initialized) await initializeAuth()

    const { createUserWithEmailAndPassword } = await import("firebase/auth")
    const { getAuth } = await import("firebase/auth")
    const { doc, setDoc } = await import("firebase/firestore")
    const { getDb } = await import("@/lib/firebase/firestore")
    const app = (await import("@/lib/firebase/config")).default

    const auth = getAuth(app)
    const result = await createUserWithEmailAndPassword(auth, email, password)

    // Create user profile in Firestore
    const db = getDb()
    await setDoc(doc(db, "users", result.user.uid), {
      email: result.user.email,
      displayName: result.user.displayName || "",
      isAdmin: false,
      createdAt: new Date(),
    })
  }

  const signInWithGoogle = async () => {
    if (!initialized) await initializeAuth()

    const { signInWithPopup, GoogleAuthProvider } = await import("firebase/auth")
    const { getAuth } = await import("firebase/auth")
    const { doc, setDoc, getDoc } = await import("firebase/firestore")
    const { getDb } = await import("@/lib/firebase/firestore")
    const app = (await import("@/lib/firebase/config")).default

    const auth = getAuth(app)
    const googleProvider = new GoogleAuthProvider()
    const result = await signInWithPopup(auth, googleProvider)

    // Check if user profile exists, if not create it
    const db = getDb()
    const userDoc = await getDoc(doc(db, "users", result.user.uid))
    if (!userDoc.exists()) {
      await setDoc(doc(db, "users", result.user.uid), {
        email: result.user.email,
        displayName: result.user.displayName || "",
        isAdmin: false,
        createdAt: new Date(),
      })
    }
  }

  const signOut = async () => {
    if (!initialized) return

    const { signOut: firebaseSignOut } = await import("firebase/auth")
    const { getAuth } = await import("firebase/auth")
    const app = (await import("@/lib/firebase/config")).default

    const auth = getAuth(app)
    await firebaseSignOut(auth)
  }

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (authUnsubscribe) {
        authUnsubscribe()
      }
    }
  }, [authUnsubscribe])

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        initialized,
        signIn,
        signUp,
        signInWithGoogle,
        signOut,
        initializeAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)