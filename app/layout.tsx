import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers/providers'
import { Toaster } from '@/components/ui/toaster'
import type { Metadata, Viewport } from 'next'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Waze Clothing - Moda Urbana Premium",
  description: "Descubra a mais nova coleção de roupas urbanas da Waze Clothing. Estilo, qualidade e conforto em cada peça.",
  keywords: ["moda", "roupas", "urbano", "streetwear", "fashion", "clothing"],
  authors: [{ name: "Waze Clothing" }],
  creator: "Waze Clothing",
  publisher: "Waze Clothing",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}