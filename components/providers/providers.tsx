
"use client"

import { useEffect } from "react"
import { AuthProvider, useAuth } from "./auth-provider"
import { CartProvider } from "./cart-provider"
import { ThemeProvider } from "./theme-provider"

function AuthInitializer({ children }: { children: React.ReactNode }) {
  const { initializeAuth, initialized } = useAuth()

  useEffect(() => {
    if (!initialized) {
      console.log("🔄 Auto-inicializando auth...")
      initializeAuth()
    }
  }, [initialized, initializeAuth])

  return <>{children}</>
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        <AuthInitializer>
          <CartProvider>
            {children}
          </CartProvider>
        </AuthInitializer>
      </AuthProvider>
    </ThemeProvider>
  )
}
