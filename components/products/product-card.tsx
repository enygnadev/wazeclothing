"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { ShoppingCart, Lock, Star, Crown, Zap, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/components/providers/cart-provider"
import { useAuth } from "@/components/providers/auth-provider"
import { useToast } from "@/hooks/use-toast"
import type { Product } from "@/lib/types"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, setIsOpen } = useCart()
  const { user, initialized, initializeAuth } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const handleAddToCart = async () => {
    try {
      if (!initialized) {
        await initializeAuth()
      }

      if (!user) {
        toast({
          title: "Login necessário",
          description: "Faça login para adicionar produtos ao carrinho.",
          action: (
            <Button variant="outline" size="sm" onClick={() => router.push("/auth")}>
              Fazer Login
            </Button>
          ),
        })
        return
      }

      console.log("Adicionando produto ao carrinho:", product.title)
      
      await addItem(product.id)

      setIsOpen(true)

      toast({
        title: "Produto adicionado!",
        description: `${product.title} foi adicionado ao carrinho.`,
      })
    } catch (error) {
      console.error("Erro ao adicionar produto:", error)
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o produto ao carrinho.",
        variant: "destructive"
      })
    }
  }

  return (
    <Card className="group relative overflow-hidden bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50 border-0 shadow-md hover:shadow-luxury transition-all duration-300 hover:scale-[1.02] backdrop-blur-sm h-full flex flex-col">
      <div className="absolute inset-0 bg-gradient-to-r from-amber-400/10 via-transparent to-yellow-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg pointer-events-none"></div>

      <CardHeader className="p-0 relative">
        <div className="relative aspect-square overflow-hidden rounded-t-lg">
          <Image
            src={product.image || "/placeholder.svg?height=300&width=300"}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.featured && (
              <Badge className="bg-gradient-to-r from-black-400 to-green-500 text-black font-elegant font-semibold border-0 shadow-md text-xs px-2 py-0.5">
                <Crown className="w-2 h-2 mr-1" />
                Premium
              </Badge>
            )}
            {product.isSmart && (
              <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-elegant font-semibold border-0 shadow-md text-xs px-2 py-0.5">
                <Zap className="w-2 h-2 mr-1" />
                Smart
              </Badge>
            )}
          </div>

          <div className="absolute top-2 right-2">
            <div className="bg-black/80 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-elegant font-bold">
              R$ {product.price.toFixed(2)}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-3 flex-1">
        <div className="space-y-1">
          <h3 className="font-luxury text-lg font-bold line-clamp-2 group-hover:text-black-600 transition-colors leading-tight">
            {product.title}
          </h3>
          <p className="text-muted-foreground text-xs line-clamp-2 font-elegant leading-relaxed">
            {product.description}
          </p>
        </div>

        {product.features && product.features.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {product.features.slice(0, 2).map((feature) => (
              <Badge
                key={feature}
                variant="secondary"
                className="text-xs font-elegant bg-black-50 text-black-700 dark:bg-black-950/20 dark:text-black-300 border border-black-200 dark:border-black-800 px-2 py-0.5"
              >
                {feature}
              </Badge>
            ))}
            {product.features.length > 2 && (
              <Badge
                variant="secondary"
                className="text-xs font-elegant bg-black-50 text-black-700 dark:bg-black-950/20 dark:text-black-300 border border-black-200 dark:border-black-800 px-2 py-0.5"
              >
                +{product.features.length - 2}
              </Badge>
            )}
          </div>
        )}

        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-3 h-3 fill-black-400 text-black-400" />
          ))}
          <span className="text-xs text-muted-foreground font-elegant ml-1">(4.9)</span>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 relative z-10">
        <div className="space-y-2">
          <Button
            type="button"
            onClick={handleAddToCart}
            disabled={false}
            className={`w-full font-elegant font-semibold transition-all duration-300 hover:scale-105 text-sm py-2 cursor-pointer ${
              user
                ? "bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-black shadow-md hover:shadow-lg"
                : "bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white"
            }`}
            style={{ pointerEvents: 'auto' }}
          >
            {user ? (
              <>
                <ShoppingCart className="w-3 h-3 mr-2" />
                Adicionar ao Carrinho
              </>
            ) : (
              <>
                <Lock className="w-3 h-3 mr-2" />
                Fazer Login
              </>
            )}
          </Button>
          <Button
            variant="outline"
            className="w-full bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
            onClick={() => {
              const message = `Olá! Tenho interesse no produto *${product.title}* (R$ ${product.price.toFixed(2)}). Você pode me dar mais informações?`
              const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(message)}`
              window.open(whatsappUrl, '_blank')
            }}
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            Comprar no WhatsApp
          </Button>
        </div>
      </CardFooter>

      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 animate-shimmer"></div>
      </div>
    </Card>
  )
}