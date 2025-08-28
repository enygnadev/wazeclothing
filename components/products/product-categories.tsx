"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Shirt,
  Flame,
  Mountain,
  Sparkles,
  Crown,
  Activity,
  BadgeDollarSign,
  Stars,
  ShoppingBag,
} from "lucide-react"
import { getCategories, getSizes } from "@/lib/firebase/products"

const categoryIconMap: Record<string, any> = {
  "nike": Flame,
  "adidas": Mountain,
  "lacoste": Shirt,
  "puma": Activity,
  "jordan": Stars,
  "premium": Crown,
  "mais-vendidos": BadgeDollarSign,
  "camisa": Shirt,
  "camiseta": Shirt,
  "moletom": Crown,
  "moletons": Crown,
  "calçados": Activity,
  "tenis": ShoppingBag,
  "sapato": ShoppingBag,
  "roupa": Shirt,
}

const priceRanges = [
  { id: "", label: "Todos os preços" },
  { id: "0-99", label: "Até R$99" },
  { id: "100-199", label: "R$100–R$199" },
  { id: "200-299", label: "R$200–R$299" },
  { id: "300+", label: "Acima de R$300" },
]

interface ProductCategoriesProps {
  selectedCategory: string
  onCategoryChange: (category: string) => void
  onSizeFilterChange?: (size: string) => void
  onPriceFilterChange?: (range: string) => void
}

export function ProductCategories({
  selectedCategory,
  onCategoryChange,
  onSizeFilterChange,
  onPriceFilterChange,
}: ProductCategoriesProps) {
  const [categories, setCategories] = useState<string[]>([])
  const [sizes, setSizes] = useState<string[]>([])

  useEffect(() => {
    getCategories().then(setCategories)
    getSizes().then(setSizes)
  }, [])

  return (
    <div className="mb-6 space-y-6">
      <div className="text-center space-y-1">
        <h3 className="font-luxury text-2xl md:text-3xl font-bold text-bw-solid">
          Roupas Masculinas Urbanas
        </h3>
        <p className="font-elegant text-muted-foreground text-sm">
          Explore Nike, Adidas, Lacoste, Jordan, Puma e mais
        </p>
      </div>

      {/* CATEGORIAS */}
      <div className="flex flex-wrap justify-center gap-2">
        {categories.map((categoryName) => {
          const Icon = categoryIconMap[categoryName.toLowerCase()] || Sparkles
          const isSelected = selectedCategory === categoryName

          return (
            <Button
              key={categoryName}
              variant={isSelected ? "default" : "outline"}
              size="sm"
              onClick={() => onCategoryChange(categoryName)}
              className={`group relative overflow-hidden font-elegant font-semibold transition-all duration-300 hover:scale-105 text-xs px-3 py-2 ${
                isSelected
                  ? `bg-gradient-to-r from-gray-700 to-gray-900 text-white shadow-md border-0`
                  : "border border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900/20"
              }`}
            >
              {!isSelected && (
                <div className="absolute inset-0 bg-gradient-to-r from-zinc-500 to-zinc-700 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
              )}

              <div className="relative flex items-center gap-2">
                <div className="p-1 rounded-full bg-gradient-to-r from-zinc-700 to-zinc-900">
                  <Icon className="h-3 w-3 text-white" />
                </div>
                <span className="hidden sm:inline">{categoryName}</span>
                {isSelected && (
                  <Badge variant="secondary" className="ml-1 bg-white/20 text-white border-0 text-xs px-1">
                    <Crown className="w-2 h-2" />
                  </Badge>
                )}
              </div>

              {isSelected && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer" />
              )}
            </Button>
          )
        })}
      </div>

      {/* TAMANHOS */}
      <div className="flex flex-wrap justify-center gap-4 text-sm font-elegant">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Tamanho:</span>
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => onSizeFilterChange?.(size)}
              className="border px-2 py-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 transition text-xs"
            >
              {size}
            </button>
          ))}
          <button
            onClick={() => onSizeFilterChange?.("")}
            className="underline text-muted-foreground text-xs"
          >
            Limpar
          </button>
        </div>

        {/* PREÇOS */}
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Preço:</span>
          {priceRanges.map((range) => (
            <button
              key={range.id}
              onClick={() => onPriceFilterChange?.(range.id)}
              className="border px-2 py-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 transition text-xs"
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
