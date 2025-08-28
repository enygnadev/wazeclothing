
import { Suspense } from "react"
import { ProductGrid } from "@/components/products/product-grid"
import { SearchBar } from "@/components/search/search-bar"
import { Header } from "@/components/layout/header"
import { ProductGridSkeleton } from "@/components/products/product-grid-skeleton"

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Todas as Categorias</h1>
          <p className="text-muted-foreground mb-6">
            Explore nossa coleção completa de roupas masculinas urbanas
          </p>
          <SearchBar />
        </div>

        <Suspense fallback={<ProductGridSkeleton />}>
          <ProductGrid />
        </Suspense>
      </main>
    </div>
  )
}
