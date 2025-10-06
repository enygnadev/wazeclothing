"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ShoppingCart, MessageCircle, CreditCard, Smartphone } from "lucide-react"
import { useCart } from "@/components/providers/cart-provider"
import { useAuth } from "@/components/providers/auth-provider"
import { createOrder } from "@/lib/firebase/orders"
import { useRouter } from "next/navigation"

interface CheckoutData {
  name: string
  email: string
  phone: string
  address: string
  cep: string
  numero: string
  complemento: string
  bairrocomprador: string
  municipiocomprador: string
  enderecocomprador: string
}

export function Checkout() {
  const { items: cartItems, getTotalPrice, clearCart } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'whatsapp' | 'pix' | 'credit' | 'debit'>('whatsapp')
  const [checkoutData, setCheckoutData] = useState<CheckoutData>({
    name: user?.displayName || "",
    email: user?.email || "",
    phone: "",
    address: "",
    cep: "",
    numero: "",
    complemento: "",
    bairrocomprador: "",
    municipiocomprador: "",
    enderecocomprador: "",
  })

  const subtotal = getTotalPrice()
  const finalShippingFee = subtotal >= 100 ? 0 : 15
  const total = subtotal + finalShippingFee

  const fetchAddressFromCEP = async (cep: string) => {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
      const data = await response.json()

      if (!data.erro) {
        setCheckoutData(prev => ({
          ...prev,
          enderecocomprador: data.logradouro || "",
          bairrocomprador: data.bairro || "",
          municipiocomprador: data.localidade || "",
        }))
      }
    } catch (error) {
      console.error("Erro ao buscar CEP:", error)
    }
  }

  const handleInputChange = (field: keyof CheckoutData, value: string) => {
    setCheckoutData(prev => ({ ...prev, [field]: value }))
    if (field === "cep" && value.length === 8) {
      fetchAddressFromCEP(value)
    }
  }

  const generateWhatsAppMessage = () => {
    let message = `🛍️ *NOVO PEDIDO - WAZE CLOTHING*\n\n`
    message += `👤 *Cliente:* ${checkoutData.name}\n`
    message += `📧 *E-mail:* ${checkoutData.email}\n`
    message += `📱 *Telefone:* ${checkoutData.phone}\n`
    message += `📍 *Endereço:* ${checkoutData.address}, Nº ${checkoutData.numero}\n`
    if (checkoutData.complemento) {
      message += `Complemento: ${checkoutData.complemento}\n`
    }
    message += `CEP: ${checkoutData.cep}\n`
    message += `Cidade: ${checkoutData.municipiocomprador} - ${checkoutData.bairrocomprador}\n\n`

    message += `🛒 *ITENS DO PEDIDO:*\n`
    cartItems.forEach((item: any, index: number) => {
      message += `${index + 1}. ${item.title || item.name}\n`
      message += `   Quantidade: ${item.quantity}\n`
      message += `   Valor unitário: R$ ${item.price.toFixed(2)}\n`
      message += `   Subtotal: R$ ${(item.price * item.quantity).toFixed(2)}\n\n`
    })

    message += `💰 *RESUMO DO PAGAMENTO:*\n`
    message += `Subtotal: R$ ${subtotal.toFixed(2)}\n`
    message += `Frete: ${finalShippingFee === 0 ? 'GRÁTIS' : `R$ ${finalShippingFee.toFixed(2)}`}\n`
    message += `*TOTAL: R$ ${total.toFixed(2)}*\n\n`

    // Adicionar método de pagamento escolhido
    const paymentLabels = {
      whatsapp: 'Via WhatsApp',
      pix: 'PIX',
      credit: 'Cartão de Crédito',
      debit: 'Cartão de Débito'
    }
    message += `💳 *Forma de Pagamento:* ${paymentLabels[paymentMethod]}\n\n`

    message += `✅ Pedido enviado através do site oficial da Waze Clothing`

    return encodeURIComponent(message)
  }

  const createOrderInFirebase = async () => {
    if (!user) {
      throw new Error("Usuário não autenticado")
    }

    // Preparar items como array, removendo campos undefined
    const orderItems = cartItems.map((item: any) => {
      const orderItem: any = {
        id: item.id,
        productId: item.productId || item.id,
        name: item.title || item.name || "Produto",
        title: item.title || "Produto",
        price: item.price || 0,
        quantity: item.quantity || 1,
      }
      
      // Adicionar campos opcionais apenas se existirem
      if (item.selectedSize) orderItem.selectedSize = item.selectedSize
      if (item.image) orderItem.image = item.image
      
      return orderItem
    })

    const orderData: any = {
      userId: user.uid, // Campo crítico para busca
      userEmail: user.email || checkoutData.email || "email@nao-informado.com",
      userName: user.displayName || checkoutData.name || "Cliente",
      items: orderItems, // Array de items
      total: total,
      shippingFee: finalShippingFee,
      status: "pending" as const,
      paymentMethod,
      customerInfo: {
        name: checkoutData.name || "Nome não informado",
        email: checkoutData.email || user.email || "email@nao-informado.com",
        phone: checkoutData.phone || "",
        address: checkoutData.address || "",
        cep: checkoutData.cep || "",
        numero: checkoutData.numero || "",
        cidade: checkoutData.municipiocomprador || "",
        estado: checkoutData.bairrocomprador || "",
      },
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // Adicionar complemento apenas se existir
    if (checkoutData.complemento) {
      orderData.customerInfo.complemento = checkoutData.complemento
    }

    console.log("🛒 Criando pedido para userId:", user.uid)
    console.log("📦 Dados do pedido:", JSON.stringify(orderData, null, 2))
    const orderId = await createOrder(orderData)
    console.log("✅ Pedido criado com ID:", orderId)

    if (orderId) {
      console.log("✅ Pedido salvo com sucesso! Verificando...")
      // Dar um tempo para o Firestore processar
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    return orderId
  }

  const handleWhatsAppCheckout = async () => {
    setLoading(true)

    try {
      await createOrderInFirebase()
      await clearCart()

      const message = generateWhatsAppMessage()
      const whatsappNumber = "5511999999999" // Substitua pelo número real
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`

      window.open(whatsappUrl, '_blank')
      router.push('/pedido-confirmado')

    } catch (error) {
      console.error("Erro ao processar pedido:", error)
      alert("Erro ao processar pedido. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  const handlePixCheckout = async () => {
    setLoading(true)

    try {
      await createOrderInFirebase()
      await clearCart()
      router.push('/pedido-confirmado?payment=pix')

    } catch (error) {
      console.error("Erro ao processar pedido:", error)
      alert("Erro ao processar pedido. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  const handleCardCheckout = async () => {
    setLoading(true)

    try {
      await createOrderInFirebase()
      await clearCart()
      router.push('/pedido-confirmado?payment=card')

    } catch (error) {
      console.error("Erro ao processar pedido:", error)
      alert("Erro ao processar pedido. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  const handleCheckout = () => {
    switch (paymentMethod) {
      case 'whatsapp':
        return handleWhatsAppCheckout()
      case 'pix':
        return handlePixCheckout()
      case 'credit':
      case 'debit':
        return handleCardCheckout()
      default:
        return handleWhatsAppCheckout()
    }
  }

  const isFormValid = checkoutData.name && checkoutData.phone && checkoutData.address &&
                     checkoutData.cep && checkoutData.numero && checkoutData.email

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-8">
        <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Carrinho vazio</h2>
        <p className="text-muted-foreground">Adicione produtos ao carrinho para continuar</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Dados do Cliente */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Dados de Entrega</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  value={checkoutData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Seu nome completo"
                />
              </div>
              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={checkoutData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="phone">Telefone/WhatsApp</Label>
              <Input
                id="phone"
                value={checkoutData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="(11) 99999-9999"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <Label htmlFor="cep">CEP</Label>
                <Input
                  id="cep"
                  value={checkoutData.cep}
                  onChange={(e) => handleInputChange("cep", e.target.value)}
                  placeholder="00000-000"
                  maxLength={8}
                />
              </div>
              <div>
                <Label htmlFor="numero">Número</Label>
                <Input
                  id="numero"
                  value={checkoutData.numero}
                  onChange={(e) => handleInputChange("numero", e.target.value)}
                  placeholder="123"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address">Endereço</Label>
              <Input
                id="address"
                value={checkoutData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="Rua, avenida..."
              />
            </div>

            <div>
              <Label htmlFor="complemento">Complemento (opcional)</Label>
              <Input
                id="complemento"
                value={checkoutData.complemento}
                onChange={(e) => handleInputChange("complemento", e.target.value)}
                placeholder="Apartamento, bloco..."
              />
            </div>

            {checkoutData.enderecocomprador && (
              <div className="text-sm text-muted-foreground bg-muted p-3 rounded">
                <p><strong>Endereço encontrado:</strong></p>
                <p>{checkoutData.enderecocomprador}</p>
                <p>{checkoutData.bairrocomprador} - {checkoutData.municipiocomprador}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Forma de Pagamento */}
        <Card>
          <CardHeader>
            <CardTitle>Forma de Pagamento</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup value={paymentMethod} onValueChange={(value: any) => setPaymentMethod(value)}>
              <div className="flex items-center space-x-2 p-3 border rounded-lg">
                <RadioGroupItem value="whatsapp" id="whatsapp" />
                <Label htmlFor="whatsapp" className="flex items-center gap-2 cursor-pointer">
                  <MessageCircle className="w-4 h-4 text-green-600" />
                  WhatsApp (Negociar pagamento)
                </Label>
              </div>

              <div className="flex items-center space-x-2 p-3 border rounded-lg">
                <RadioGroupItem value="pix" id="pix" />
                <Label htmlFor="pix" className="flex items-center gap-2 cursor-pointer">
                  <Smartphone className="w-4 h-4 text-blue-600" />
                  PIX (Pagamento instantâneo)
                </Label>
              </div>

              <div className="flex items-center space-x-2 p-3 border rounded-lg">
                <RadioGroupItem value="credit" id="credit" />
                <Label htmlFor="credit" className="flex items-center gap-2 cursor-pointer">
                  <CreditCard className="w-4 h-4 text-purple-600" />
                  Cartão de Crédito
                </Label>
              </div>

              <div className="flex items-center space-x-2 p-3 border rounded-lg">
                <RadioGroupItem value="debit" id="debit" />
                <Label htmlFor="debit" className="flex items-center gap-2 cursor-pointer">
                  <CreditCard className="w-4 h-4 text-orange-600" />
                  Cartão de Débito
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>
      </div>

      {/* Resumo do Pedido */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Resumo do Pedido</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {cartItems.map((item: any) => (
              <div key={item.id} className="flex justify-between items-center py-2 border-b">
                <div className="flex-1">
                  <p className="font-medium">{item.title || item.name}</p>
                  <p className="text-sm text-muted-foreground">Qtd: {item.quantity}</p>
                </div>
                <p className="font-medium">R$ {(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}

            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>R$ {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Frete:</span>
                <span>{finalShippingFee === 0 ? 'GRÁTIS' : `R$ ${finalShippingFee.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>R$ {total.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Botão de Finalizar */}
        <Card>
          <CardContent className="pt-6">
            <Button
              onClick={handleCheckout}
              disabled={loading || !isFormValid}
              className="w-full h-12 text-lg"
              size="lg"
            >
              {loading ? "Processando..." :
               paymentMethod === 'whatsapp' ? "Finalizar no WhatsApp" :
               paymentMethod === 'pix' ? "Pagar com PIX" :
               "Pagar com Cartão"
              }
            </Button>

            {!isFormValid && (
              <p className="text-sm text-muted-foreground text-center mt-2">
                Preencha todos os campos obrigatórios
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
