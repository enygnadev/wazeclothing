import { Suspense } from "react"
import { ProductGrid } from "@/components/products/product-grid"
import { SearchBar } from "@/components/search/search-bar"
import { Header } from "@/components/layout/header"
import { Cart } from "@/components/cart/cart"
import { ChatBot } from "@/components/chat/chat-bot"
import { ProductGridSkeleton } from "@/components/products/product-grid-skeleton"
import { HeroSection } from "@/components/layout/hero-section"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-16">
        <HeroSection />
      </div>
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <SearchBar />
        </div>

        <Suspense fallback={<ProductGridSkeleton />}>
          <ProductGrid />
        </Suspense>
      </main>

      <Cart />
      <ChatBot />
    </div>
  )
}