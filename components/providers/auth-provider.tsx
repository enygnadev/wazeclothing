"use client"

import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  useEffect,
} from "react"
import type { User } from "firebase/auth"
import { Timestamp } from "firebase/firestore"
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

/** Cookie opcional para compat/middleware (não obrigatório para funcionar) */
const setAuthCookie = async (user: User | null) => {
  if (typeof window === "undefined") return
  try {
    if (user) {
      const token = await user.getIdToken(true) // force refresh
      const maxAge = 60 * 60 // 1h
      const isSecure = window.location.protocol === "https:"
      document.cookie = `auth-token=${token}; path=/; max-age=${maxAge}${
        isSecure ? "; secure" : ""
      }; samesite=strict`
    } else {
      document.cookie =
        "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;"
    }
  } catch (e) {
    console.error("❌ Erro ao obter token:", e)
    document.cookie =
      "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;"
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<any | null>(null)
  const [loading, setLoading] = useState(false)
  const [initialized, setInitialized] = useState(false)

  // 🔒 refs para evitar re-render loops
  const unsubscribeRef = useRef<(() => void) | null>(null)
  const initStartedRef = useRef(false)
  const mountedRef = useRef(false)
  const refreshTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      if (unsubscribeRef.current) {
        try {
          unsubscribeRef.current()
        } catch {}
        unsubscribeRef.current = null
      }
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current)
        refreshTimeoutRef.current = null
      }
    }
  }, [])

  const scheduleTokenRefresh = useCallback((u: User | null) => {
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current)
      refreshTimeoutRef.current = null
    }
    if (!u) return
    refreshTimeoutRef.current = setTimeout(async () => {
      try {
        if (!mountedRef.current) return
        await setAuthCookie(u)
        // re-agenda o próximo refresh
        scheduleTokenRefresh(u)
      } catch (e) {
        console.error("❌ Erro no refresh automático do token:", e)
      }
    }, 50 * 60 * 1000) // 50 min
  }, [])

  const initializeAuth = useCallback(async () => {
    if (initialized || initStartedRef.current || typeof window === "undefined")
      return
    initStartedRef.current = true
    setLoading(true)
    console.log("🔄 Inicializando autenticação...")

    try {
      const [
        { getAuth, onAuthStateChanged, setPersistence, browserLocalPersistence },
        // ⬇️ importa NOMEADO { app } (sem .default)
        { app },
      ] = await Promise.all([
        import("firebase/auth"),
        import("@/lib/firebase/config"),
      ])

      const auth = getAuth(app)

      try {
        await setPersistence(auth, browserLocalPersistence)
        console.log("🔒 Persistência local configurada")
      } catch (persistError) {
        console.warn("⚠️ Falha ao configurar persistência:", persistError)
      }

      // Fallback: evita spinner infinito se nada disparar
      const initTimeout = setTimeout(() => {
        if (!mountedRef.current) return
        console.log("⏰ Timeout: marcando auth como inicializado")
        setInitialized(true)
        setLoading(false)
      }, 2000)

      const unsubscribe = onAuthStateChanged(auth, async (u) => {
        clearTimeout(initTimeout)
        if (!mountedRef.current) return

        console.log("🔄 Auth state changed:", { user: !!u, email: u?.email })
        setUser(u)

        if (u) {
          await setAuthCookie(u)
          scheduleTokenRefresh(u)

          try {
            const profile = await getUserProfile(u.uid).catch(() => null)
            setUserProfile(profile)
            console.log("👤 Profile carregado:", { isAdmin: profile?.isAdmin })
          } catch (err) {
            console.error("❌ Erro ao buscar user profile:", err)
            setUserProfile(null)
          }
        } else {
          setUserProfile(null)
          await setAuthCookie(null)
          scheduleTokenRefresh(null)
          console.log("👤 Usuário deslogado - dados limpos")
        }

        setLoading(false)
        setInitialized(true)
      })

      // ✅ guarda unsubscribe em ref (sem setState)
      unsubscribeRef.current = unsubscribe
    } catch (error) {
      console.error("❌ Error initializing auth:", error)
      if (!mountedRef.current) return
      setLoading(false)
      setInitialized(true)
    }
  }, [initialized, scheduleTokenRefresh])

  const signIn = useCallback(
    async (email: string, password: string) => {
      if (!initialized) await initializeAuth()
      const [{ signInWithEmailAndPassword, getAuth }, { app }] =
        await Promise.all([
          import("firebase/auth"),
          import("@/lib/firebase/config"),
        ])
      const auth = getAuth(app)
      const result = await signInWithEmailAndPassword(auth, email, password)
      await setAuthCookie(result.user)
      scheduleTokenRefresh(result.user)
    },
    [initialized, initializeAuth, scheduleTokenRefresh]
  )

  const signUp = useCallback(
    async (email: string, password: string) => {
      if (!initialized) await initializeAuth()

      const [
        { createUserWithEmailAndPassword, getAuth },
        { doc, setDoc },
        { getDb },
        { app },
      ] = await Promise.all([
        import("firebase/auth"),
        import("firebase/firestore"),
        import("@/lib/firebase/firestore"),
        import("@/lib/firebase/config"),
      ])

      const auth = getAuth(app)
      const result = await createUserWithEmailAndPassword(auth, email, password)

      const db = getDb()
      const userData = {
        email: result.user.email,
        name: result.user.displayName || email.split("@")[0],
        displayName: result.user.displayName || email.split("@")[0],
        isAdmin:
          email === "admin@waze.com" ||
          email === "admin@admin.com" ||
          email === "guga1trance@gmail.com",
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        consentDate: Timestamp.now(),
        consentVersion: "1.0",
      }

      await setDoc(doc(db, "users", result.user.uid), userData, { merge: true })
      await setAuthCookie(result.user)
      scheduleTokenRefresh(result.user)
      setUserProfile(userData)
    },
    [initialized, initializeAuth, scheduleTokenRefresh]
  )

  const signInWithGoogle = useCallback(
    async () => {
      if (!initialized) await initializeAuth()

      const [
        { signInWithPopup, GoogleAuthProvider, getAuth },
        { doc, setDoc, getDoc },
        { getDb },
        { app },
      ] = await Promise.all([
        import("firebase/auth"),
        import("firebase/firestore"),
        import("@/lib/firebase/firestore"),
        import("@/lib/firebase/config"),
      ])

      const auth = getAuth(app)
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)

      const db = getDb()
      const snap = await getDoc(doc(db, "users", result.user.uid))
      if (snap.exists()) {
        const data = snap.data()
        const profile = {
          id: result.user.uid,
          email: result.user.email!,
          name: data.name || result.user.displayName || "",
          isAdmin: data.isAdmin === true,
          createdAt: data.createdAt?.toDate?.() ?? new Date(),
        }
        setUserProfile(profile)
        console.log("User profile loaded:", profile)
      } else {
        const newProfile = {
          email: result.user.email!,
          name:
            result.user.displayName || result.user.email?.split("@")[0] || "",
          isAdmin: false,
          createdAt: Timestamp.now(),
          consentDate: Timestamp.now(),
          consentVersion: "1.0",
        }
        await setDoc(doc(db, "users", result.user.uid), newProfile)
        const profile = {
          id: result.user.uid,
          email: result.user.email!,
          name: newProfile.name,
          isAdmin: false,
          createdAt: newProfile.createdAt.toDate(),
        }
        setUserProfile(profile)
        console.log("New user profile created:", profile)
      }

      await setAuthCookie(result.user)
      scheduleTokenRefresh(result.user)
    },
    [initialized, initializeAuth, scheduleTokenRefresh]
  )

  const signOut = useCallback(
    async () => {
      if (!initialized) return
      const [{ signOut: firebaseSignOut, getAuth }, { app }] = await Promise.all(
        [import("firebase/auth"), import("@/lib/firebase/config")]
      )
      const auth = getAuth(app)
      await firebaseSignOut(auth)
      await setAuthCookie(null)
      scheduleTokenRefresh(null)
      setUser(null)
      setUserProfile(null)
    },
    [initialized, scheduleTokenRefresh]
  )

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
