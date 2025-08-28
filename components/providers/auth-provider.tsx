"use client"

import React from "react"
import { createContext, useContext, useState } from "react"
import type { User } from "firebase/auth"
import { getUserProfile } from "@/lib/firebase/users"
import { Timestamp } from "firebase/firestore" // Import Timestamp

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

// Helper function to set auth cookie
const setAuthCookie = async (user: User | null) => {
  if (typeof window !== 'undefined') {
    if (user) {
      try {
        const token = await user.getIdToken(true) // Force refresh
        // Cookie com 1 hora de validade, mas com refresh automático
        const maxAge = 60 * 60 // 1 hora em segundos
        const isSecure = window.location.protocol === 'https:'
        const cookieString = `auth-token=${token}; path=/; max-age=${maxAge}${isSecure ? '; secure' : ''}; samesite=strict`
        document.cookie = cookieString
        console.log("🍪 Token atualizado no cookie (1 hora)")
        
        // Agendar refresh do token em 50 minutos
        setTimeout(async () => {
          if (user && !user.isAnonymous) {
            try {
              await setAuthCookie(user)
            } catch (error) {
              console.error("❌ Erro no refresh automático:", error)
            }
          }
        }, 50 * 60 * 1000) // 50 minutos
        
      } catch (error) {
        console.error("❌ Erro ao obter token:", error)
        // Limpar cookie inválido
        document.cookie = `auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`
      }
    } else {
      document.cookie = `auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`
      console.log("🍪 Cookie removido")
    }
  }
}

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
      const { onAuthStateChanged, setPersistence, browserLocalPersistence } = await import("firebase/auth")
      const app = (await import("@/lib/firebase/config")).default

      const auth = getAuth(app)
      
      // Configurar persistência local
      try {
        await setPersistence(auth, browserLocalPersistence)
        console.log("🔒 Persistência local configurada")
      } catch (persistError) {
        console.warn("⚠️ Falha ao configurar persistência:", persistError)
      }

      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        console.log("🔄 Auth state changed:", { user: !!user, email: user?.email })
        
        setUser(user)
        
        if (user) {
          // Atualizar cookie apenas se realmente logado
          await setAuthCookie(user)
          
          try {
            const profile = await getUserProfile(user.uid)
            setUserProfile(profile)
            console.log("👤 Profile carregado:", { isAdmin: profile?.isAdmin })
          } catch (error) {
            console.error("Error fetching user profile:", error)
            setUserProfile(null)
          }
        } else {
          // Limpar tudo se não há usuário
          setUserProfile(null)
          await setAuthCookie(null)
          console.log("👤 Usuário deslogado - dados limpos")
        }

        setLoading(false)
      }, (error) => {
        console.error("❌ Erro no onAuthStateChanged:", error)
        setLoading(false)
      })

      setAuthUnsubscribe(() => unsubscribe)
      setInitialized(true)
    } catch (error) {
      console.error("Error initializing auth:", error)
      setLoading(false)
      setInitialized(true) // Mesmo com erro, marcar como inicializado
    }
  }

  const signIn = async (email: string, password: string) => {
    if (!initialized) await initializeAuth()

    const { signInWithEmailAndPassword } = await import("firebase/auth")
    const { getAuth } = await import("firebase/auth")
    const app = (await import("@/lib/firebase/config")).default

    const auth = getAuth(app)
    const result = await signInWithEmailAndPassword(auth, email, password)
    await setAuthCookie(result.user)
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
    const userData = {
      email: result.user.email,
      name: result.user.displayName || email.split('@')[0],
      displayName: result.user.displayName || email.split('@')[0],
      isAdmin: email === 'admin@waze.com' || email === 'admin@admin.com' || email === 'guga1trance@gmail.com',
      createdAt: new Date(),
      updatedAt: new Date(),
      consentDate: new Date(),
      consentVersion: "1.0"
    }

    await setDoc(doc(db, "users", result.user.uid), userData)
    await setAuthCookie(result.user)

    // Atualizar o profile localmente
    setUserProfile(userData)
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
    const userDoc = await getDoc(doc(db, 'users', result.user.uid))
      if (userDoc.exists()) {
        const userData = userDoc.data()
        const profile = {
          id: result.user.uid,
          email: result.user.email!,
          name: userData.name || result.user.displayName || '',
          isAdmin: userData.isAdmin === true, // Explicit boolean check
          createdAt: userData.createdAt?.toDate() || new Date(),
        }
        setUserProfile(profile)
        console.log('User profile loaded:', profile)
      } else {
        // Create user profile if it doesn't exist
        const newProfile = {
          email: result.user.email!,
          name: result.user.displayName || result.user.email?.split('@')[0],
          isAdmin: false,
          createdAt: Timestamp.now(),
          consentDate: Timestamp.now(),
          consentVersion: "1.0"
        }

        await setDoc(doc(db, 'users', result.user.uid), newProfile)
        const profile = {
          id: result.user.uid,
          email: result.user.email!,
          name: newProfile.name,
          isAdmin: false,
          createdAt: newProfile.createdAt.toDate(),
        }
        setUserProfile(profile)
        console.log('New user profile created:', profile)
      }

    await setAuthCookie(result.user)
  }

  const signOut = async () => {
    if (!initialized) return

    const { signOut: firebaseSignOut } = await import("firebase/auth")
    const { getAuth } = await import("firebase/auth")
    const app = (await import("@/lib/firebase/config")).default

    const auth = getAuth(app)
    await firebaseSignOut(auth)
    await setAuthCookie(null)

    // Limpar estado local
    setUser(null)
    setUserProfile(null)
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