"use client"

import type React from "react"
import { useState } from "react"
import { Search, Sparkles } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface SearchBarProps {
  onSearch?: (query: string) => void
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [search, setSearch] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSearch) {
      onSearch(search)
    }
    console.log("Searching for:", search)
  }

  return (
    <div className="max-w-xl mx-auto mb-6">
      <form onSubmit={handleSearch} className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-black-400/20 to-green-400/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        <div className="relative flex items-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-black-200 dark:border-black-800 rounded-full shadow-md hover:shadow-lg transition-all duration-300 focus-within:border-black-400 focus-within:shadow-lg">
          <div className="absolute left-4 flex items-center">
            <Search className="h-4 w-4 text-black-500" />
          </div>

          <Input
            type="text"
            placeholder="Buscar produtos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-12 pr-24 py-3 bg-transparent border-0 focus:ring-0 focus:outline-none font-elegant placeholder:text-muted-foreground/70 text-sm"
          />

          <Button
            type="submit"
            size="sm"
            className="absolute right-2 bg-zinc-200 from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-black font-elegant font-semibold px-3 py-1.5 rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 text-xs"
          >
            <Sparkles className="w-3 h-3 mr-1" />
            <span className="hidden sm:inline">Buscar</span>
          </Button>
        </div>
      </form>
    </div>
  )
}
