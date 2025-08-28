
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { AuthProvider } from '@/components/providers/auth-provider'
import { CartProvider } from '@/components/providers/cart-provider'
import { Toaster } from '@/components/ui/toaster'
import type { Metadata, Viewport } from 'next'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Waze Clothing - Moda Exclusiva',
  description: 'Descubra a última moda em roupas exclusivas na Waze Clothing. Qualidade premium, estilo único.',
  keywords: ['moda', 'roupas', 'fashion', 'clothing', 'estilo'],
  authors: [{ name: 'Waze Clothing' }],
  creator: 'Waze Clothing',
  publisher: 'Waze Clothing',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://wazeclothing.com',
    title: 'Waze Clothing - Moda Exclusiva',
    description: 'Descubra a última moda em roupas exclusivas na Waze Clothing.',
    siteName: 'Waze Clothing',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Waze Clothing - Moda Exclusiva',
    description: 'Descubra a última moda em roupas exclusivas na Waze Clothing.',
    creator: '@wazeclothing',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' }
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
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <CartProvider>
              {children}
              <Toaster />
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
