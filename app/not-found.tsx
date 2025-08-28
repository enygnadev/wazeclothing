
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Home, ArrowLeft, Search, ShoppingBag, Phone } from "lucide-react"
import { Header } from "@/components/layout/header"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <Card className="border-2 border-dashed border-muted-foreground/20">
            <CardContent className="p-12">
              <div className="space-y-6">
                <div className="space-y-2">
                  <h1 className="text-8xl font-bold text-primary">404</h1>
                  <h2 className="text-3xl font-semibold text-foreground">Página não encontrada</h2>
                  <p className="text-muted-foreground text-lg">
                    A página que você está procurando não existe ou foi movida.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
                  <Button asChild variant="default" size="lg">
                    <Link href="/">
                      <Home className="w-4 h-4 mr-2" />
                      Página Inicial
                    </Link>
                  </Button>
                  
                  <Button asChild variant="outline" size="lg">
                    <Link href="/products">
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      Ver Produtos
                    </Link>
                  </Button>
                  
                  <Button asChild variant="outline" size="lg">
                    <Link href="/categories">
                      <Search className="w-4 h-4 mr-2" />
                      Categorias
                    </Link>
                  </Button>
                  
                  <Button asChild variant="outline" size="lg">
                    <Link href="/contato">
                      <Phone className="w-4 h-4 mr-2" />
                      Contato
                    </Link>
                  </Button>
                </div>

                <div className="pt-4">
                  <p className="text-sm text-muted-foreground">
                    Ou volte para a página anterior
                  </p>
                  <Button 
                    variant="link" 
                    onClick={() => window.history.back()}
                    className="text-primary"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Voltar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
