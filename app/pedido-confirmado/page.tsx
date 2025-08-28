
"use client"

import { Header } from "@/components/layout/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Copy, MessageCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function PedidoConfirmadoPage() {
  const pixKey = "contato@wazeclothing.com"

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixKey)
    alert("Chave PIX copiada!")
  }

  const handleWhatsApp = () => {
    const phone = "5511999999999"
    const message = "Olá! Acabei de fazer um pedido e gostaria de enviar o comprovante do PIX."
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank')
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Header de Confirmação */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="bg-green-100 dark:bg-green-900/20 rounded-full p-3">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-green-600">Pedido Confirmado!</h1>
            <p className="text-muted-foreground">
              Seu pedido foi registrado com sucesso. Para finalizar, realize o pagamento via PIX.
            </p>
          </div>

          {/* Instruções PIX */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="bg-blue-100 dark:bg-blue-900/20 rounded-full p-1">
                  <Copy className="h-4 w-4 text-blue-600" />
                </div>
                Instruções de Pagamento PIX
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm font-medium mb-2">Chave PIX:</p>
                <div className="flex items-center gap-2">
                  <code className="bg-background px-3 py-2 rounded flex-1 text-sm">
                    {pixKey}
                  </code>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleCopyPix}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Como pagar:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Copie a chave PIX acima</li>
                  <li>Abra o app do seu banco</li>
                  <li>Escolha a opção PIX</li>
                  <li>Cole a chave PIX</li>
                  <li>Confirme o valor e realize o pagamento</li>
                  <li>Envie o comprovante via WhatsApp</li>
                </ol>
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={handleWhatsApp}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Enviar Comprovante
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Próximos Passos */}
          <Card>
            <CardHeader>
              <CardTitle>Próximos Passos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 dark:bg-blue-900/20 rounded-full p-1 mt-0.5">
                  <div className="w-2 h-2 bg-blue-600 rounded-full" />
                </div>
                <div>
                  <p className="font-medium text-sm">Pagamento</p>
                  <p className="text-xs text-muted-foreground">
                    Realize o pagamento via PIX usando a chave acima
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-yellow-100 dark:bg-yellow-900/20 rounded-full p-1 mt-0.5">
                  <div className="w-2 h-2 bg-yellow-600 rounded-full" />
                </div>
                <div>
                  <p className="font-medium text-sm">Comprovante</p>
                  <p className="text-xs text-muted-foreground">
                    Envie o comprovante via WhatsApp para confirmar
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-green-100 dark:bg-green-900/20 rounded-full p-1 mt-0.5">
                  <div className="w-2 h-2 bg-green-600 rounded-full" />
                </div>
                <div>
                  <p className="font-medium text-sm">Processamento</p>
                  <p className="text-xs text-muted-foreground">
                    Seu pedido será processado e enviado em até 2 dias úteis
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ações */}
          <div className="flex gap-3">
            <Link href="/products" className="flex-1">
              <Button type="button" variant="outline" className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Continuar Comprando
              </Button>
            </Link>
            <Link href="/cliente" className="flex-1">
              <Button type="button" variant="outline" className="w-full">
                Ver Meus Pedidos
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
