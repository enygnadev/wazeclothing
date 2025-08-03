"use client"

import { useEffect, useState } from "react"
import { ProductCard } from "./product-card"
import { ProductCategories } from "./product-categories"
import type { Product } from "@/lib/types"

export function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedPrice, setSelectedPrice] = useState("")

  useEffect(() => {
    async function fetchProducts() {
      try {
        setError(null)
        const response = await fetch("/api/products")

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()

        if (data.error) {
          throw new Error(data.error)
        }

        setProducts(data)
        setFilteredProducts(data)
      } catch (error) {
        console.error("Error fetching products:", error)
        setError("Erro ao carregar produtos. Tente novamente.")
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  useEffect(() => {
    const filterByCategory = (product: Product) =>
      selectedCategory === "all" || product.category === selectedCategory

    const filterBySize = (product: Product) =>
      !selectedSize || product.size === selectedSize

    const filterByPrice = (product: Product) => {
      if (!selectedPrice) return true
      const price = product.price
      if (selectedPrice === "0-99") return price <= 99
      if (selectedPrice === "100-199") return price >= 100 && price <= 199
      if (selectedPrice === "200-299") return price >= 200 && price <= 299
      if (selectedPrice === "300+") return price >= 300
      return true
    }

    const filtered = products.filter(
      (product) =>
        filterByCategory(product) &&
        filterBySize(product) &&
        filterByPrice(product)
    )

    setFilteredProducts(filtered)
  }, [selectedCategory, selectedSize, selectedPrice, products])

  const handleCategoryChange = (category: string) => setSelectedCategory(category)
  const handleSizeChange = (size: string) => setSelectedSize(size)
  const handlePriceChange = (price: string) => setSelectedPrice(price)

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-6 bg-muted rounded w-48 mb-4"></div>
          <div className="flex flex-wrap gap-2 mb-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-8 bg-muted rounded w-24"></div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-square bg-muted rounded-lg mb-4"></div>
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-muted rounded w-full mb-1"></div>
              <div className="h-3 bg-muted rounded w-2/3 mb-3"></div>
              <div className="h-6 bg-muted rounded w-20"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">⚠️ {error}</div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-black-500 text-white rounded hover:bg-black-600"
        >
          Tentar Novamente
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <ProductCategories
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        onSizeFilterChange={handleSizeChange}
        onPriceFilterChange={handlePriceChange}
      />

      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {products.length === 0
              ? "Nenhum produto encontrado. Execute 'npm run setup-products' para adicionar produtos."
              : "Nenhum produto encontrado com esses filtros."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
