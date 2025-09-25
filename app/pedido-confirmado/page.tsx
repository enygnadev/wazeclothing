
"use client"

import { useSearchParams } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Copy, MessageCircle, ArrowLeft, CreditCard, Smartphone } from "lucide-react"
import Link from "next/link"

export default function PedidoConfirmadoPage() {
  const searchParams = useSearchParams()
  const paymentMethod = searchParams?.get('payment') || 'whatsapp'
  
  const pixKey = "contato@wazeclothing.com"

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixKey)
    alert("Chave PIX copiada!")
  }

  const handleWhatsApp = () => {
    const phone = "5511999999999"
    const message = paymentMethod === 'pix' 
      ? "Olá! Acabei de fazer um pedido e gostaria de enviar o comprovante do PIX."
      : "Olá! Acabei de fazer um pedido e gostaria de finalizar o pagamento."
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank')
  }

  const renderPaymentInstructions = () => {
    switch (paymentMethod) {
      case 'pix':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-blue-600" />
                Pagamento via PIX
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                  Chave PIX para pagamento:
                </h4>
                <div className="flex items-center gap-2">
                  <code className="bg-white dark:bg-gray-800 px-3 py-2 rounded border flex-1">
                    {pixKey}
                  </code>
                  <Button size="sm" variant="outline" onClick={handleCopyPix}>
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

              <Button
                onClick={handleWhatsApp}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Enviar Comprovante PIX
              </Button>
            </CardContent>
          </Card>
        )

      case 'card':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-purple-600" />
                Pagamento com Cartão
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                <h4 className="font-medium text-purple-800 dark:text-purple-200 mb-2">
                  Finalize seu pagamento
                </h4>
                <p className="text-sm text-purple-700 dark:text-purple-300">
                  Entre em contato conosco via WhatsApp para finalizar o pagamento com cartão.
                  Aceitamos cartões de crédito e débito das principais bandeiras.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Próximos passos:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Clique no botão abaixo para conversar conosco</li>
                  <li>Informe que deseja pagar com cartão</li>
                  <li>Forneça os dados do cartão com segurança</li>
                  <li>Aguarde a confirmação do pagamento</li>
                </ol>
              </div>

              <Button
                onClick={handleWhatsApp}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Finalizar Pagamento
              </Button>
            </CardContent>
          </Card>
        )

      default: // whatsapp
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-green-600" />
                Pagamento via WhatsApp
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">
                  Seu pedido foi enviado!
                </h4>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Agora você pode negociar a forma de pagamento diretamente no WhatsApp.
                  Aceitamos PIX, cartão de crédito, débito e outras formas.
                </p>
              </div>

              <Button
                onClick={handleWhatsApp}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Continuar no WhatsApp
              </Button>
            </CardContent>
          </Card>
        )
    }
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
              Seu pedido foi registrado com sucesso. 
              {paymentMethod === 'whatsapp' && " Continue no WhatsApp para finalizar."}
              {paymentMethod === 'pix' && " Realize o pagamento via PIX para finalizar."}
              {paymentMethod === 'card' && " Finalize o pagamento com cartão via WhatsApp."}
            </p>
          </div>

          {/* Instruções de Pagamento */}
          {renderPaymentInstructions()}

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
                    {paymentMethod === 'pix' && "Realize o pagamento via PIX usando a chave acima"}
                    {paymentMethod === 'card' && "Finalize o pagamento com cartão via WhatsApp"}
                    {paymentMethod === 'whatsapp' && "Negocie a forma de pagamento no WhatsApp"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-yellow-100 dark:bg-yellow-900/20 rounded-full p-1 mt-0.5">
                  <div className="w-2 h-2 bg-yellow-600 rounded-full" />
                </div>
                <div>
                  <p className="font-medium text-sm">Confirmação</p>
                  <p className="text-xs text-muted-foreground">
                    Receba a confirmação e acompanhe seu pedido
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-green-100 dark:bg-green-900/20 rounded-full p-1 mt-0.5">
                  <div className="w-2 h-2 bg-green-600 rounded-full" />
                </div>
                <div>
                  <p className="font-medium text-sm">Entrega</p>
                  <p className="text-xs text-muted-foreground">
                    Seu pedido será preparado e enviado
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Botão Voltar */}
          <div className="text-center">
            <Link href="/">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar à Loja
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
