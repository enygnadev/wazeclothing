
import { ProductGridSkeleton } from "@/components/products/product-grid-skeleton"

export default function CategoriesLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="h-8 bg-muted rounded w-64 mb-4 animate-pulse"></div>
          <div className="h-4 bg-muted rounded w-96 mb-6 animate-pulse"></div>
          <div className="h-12 bg-muted rounded mb-6 animate-pulse"></div>
        </div>
        <ProductGridSkeleton />
      </div>
    </div>
  )
}
