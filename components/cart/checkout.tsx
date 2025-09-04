"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { ShoppingCart, CreditCard, MessageCircle, Copy } from "lucide-react"
import { useCart } from "@/components/providers/cart-provider"
import { useAuth } from "@/components/providers/auth-provider"
import { createOrder } from "@/lib/firebase/orders"

interface CheckoutData {
  name: string
  email: string
  phone: string
  address: string
  paymentMethod: "pix" | "whatsapp"
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
  const [loading, setLoading] = useState(false)
  const [checkoutData, setCheckoutData] = useState<CheckoutData>({
    name: user?.displayName || "",
    email: user?.email || "",
    phone: "",
    address: "",
    paymentMethod: "whatsapp",
    cep: "",
    numero: "",
    complemento: "",
    bairrocomprador: "",
    municipiocomprador: "",
    enderecocomprador: "",
  })

  const fetchAddressFromCEP = async (cep: string) => {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      if (!data.erro) {
        setCheckoutData(prev => ({
          ...prev,
          enderecocomprador: data.logradouro,
          municipiocomprador: data.localidade,
          bairrocomprador: data.bairro,
          complemento: data.uf, // Assuming UF can be used as a temporary complement if no specific complement is found
          address: `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}` // Auto-fill main address field
        }));
      } else {
        console.error('CEP não encontrado');
        setCheckoutData(prev => ({
          ...prev,
          enderecocomprador: "",
          municipiocomprador: "",
          bairrocomprador: "",
          complemento: "",
          address: "" // Clear address if CEP is not found
        }));
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
      setCheckoutData(prev => ({
        ...prev,
        enderecocomprador: "",
        municipiocomprador: "",
        bairrocomprador: "",
        complemento: "",
        address: "" // Clear address on error
      }));
    }
  };


  const shippingFee = 15.90
  const freeShippingMinValue = 199.90
  const subtotal = getTotalPrice()
  const finalShippingFee = subtotal >= freeShippingMinValue ? 0 : shippingFee
  const total = subtotal + finalShippingFee

  const handleInputChange = (field: keyof CheckoutData, value: string) => {
    setCheckoutData(prev => ({ ...prev, [field]: value }))
    if (field === "cep" && value.length === 8) { // Assuming CEP has 8 digits
        fetchAddressFromCEP(value);
    }
  }

  const generateWhatsAppMessage = () => {
    let message = `🛍️ *NOVO PEDIDO - WAZE CLOTHING*\n\n`
    message += `👤 *Cliente:* ${checkoutData.name}\n`
    message += `📧 *E-mail:* ${checkoutData.email}\n`
    message += `📱 *Telefone:* ${checkoutData.phone}\n`
    message += `📍 *Endereço:* ${checkoutData.address}, Nº ${checkoutData.numero}, Complemento: ${checkoutData.complemento || 'N/A'}\n`

    message += `\n*Endereço Detalhado (via CEP):*\n`
    message += `Logradouro: ${checkoutData.enderecocomprador}\n`
    message += `Bairro: ${checkoutData.bairrocomprador}\n`
    message += `Cidade: ${checkoutData.municipiocomprador}\n`
    message += `Estado: ${checkoutData.complemento}\n\n`


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

    message += `💳 *Forma de pagamento:* ${checkoutData.paymentMethod === 'pix' ? 'PIX' : 'WhatsApp'}\n\n`
    message += `✅ Pedido enviado através do site oficial da Waze Clothing`

    return encodeURIComponent(message)
  }

  const handleWhatsAppCheckout = () => {
    const message = generateWhatsAppMessage()
    const whatsappNumber = "5511999999999" // Número do WhatsApp da loja
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`

    window.open(whatsappUrl, '_blank')

    // Criar pedido no Firebase para controle interno
    createOrderInFirebase("whatsapp")
  }

  const handlePixCheckout = async () => {
    await createOrderInFirebase("pix")
    // Aqui você pode integrar com uma API de pagamento PIX
    alert("Instruções de pagamento PIX enviadas por e-mail!")
  }

  const createOrderInFirebase = async (paymentMethod: "pix" | "whatsapp") => {
    if (!user) return

    setLoading(true)
    try {
      const orderItems = cartItems.map((item: any) => ({
        id: item.id,
        productId: item.productId || item.id,
        name: item.title || item.name,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      }))

      const order = {
        userId: user.uid,
        items: orderItems,
        total,
        shippingFee: finalShippingFee,
        status: "pending" as const,
        customerInfo: {
          name: checkoutData.name,
          email: checkoutData.email,
          phone: checkoutData.phone,
          address: checkoutData.address,
          cep: checkoutData.cep,
          numero: checkoutData.numero,
          complemento: checkoutData.complemento,
        },
        paymentMethod,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      await createOrder(order)
      await clearCart()

      if (paymentMethod === "pix") {
        // Redirecionar para página de confirmação PIX
        window.location.href = "/pedido-confirmado"
      }
    } catch (error) {
      console.error("Erro ao criar pedido:", error)
      alert("Erro ao processar pedido. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  const pixKey = "contato@wazeclothing.com"

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-8">
        <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Seu carrinho está vazio.</p>
        <Button className="mt-4" onClick={() => window.location.href = "/products"}>
          Continuar Comprando
        </Button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações de Entrega</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  value={checkoutData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={checkoutData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="(11) 99999-9999"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={checkoutData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cep">CEP</Label>
                <Input
                  id="cep"
                  value={checkoutData.cep}
                  onChange={(e) => handleInputChange("cep", e.target.value)}
                  placeholder="Apenas números"
                  required
                />
              </div>
              <div>
                <Label htmlFor="numero">Número</Label>
                <Input
                  id="numero"
                  value={checkoutData.numero}
                  onChange={(e) => handleInputChange("numero", e.target.value)}
                  placeholder="Nº da casa"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address">Endereço Completo (Rua, Bairro, Cidade, UF)</Label>
              <Textarea
                id="address"
                value={checkoutData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="Rua, número, complemento, bairro, cidade, CEP"
                required
              />
            </div>

            <div>
              <Label htmlFor="complemento">Complemento</Label>
              <Input
                id="complemento"
                value={checkoutData.complemento}
                onChange={(e) => handleInputChange("complemento", e.target.value)}
                placeholder="Apto, Bloco, etc."
                required
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Forma de Pagamento</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={checkoutData.paymentMethod}
              onValueChange={(value) => handleInputChange("paymentMethod", value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="whatsapp" id="whatsapp" />
                <Label htmlFor="whatsapp" className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp (Recomendado)
                </Label>
              </div>
              <p className="text-sm text-muted-foreground ml-6">
                Envie seu pedido diretamente para nosso WhatsApp e finalize a compra
              </p>

              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pix" id="pix" />
                <Label htmlFor="pix" className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  PIX
                </Label>
              </div>
              <p className="text-sm text-muted-foreground ml-6">
                Pagamento instantâneo via PIX
              </p>
            </RadioGroup>

            {checkoutData.paymentMethod === "pix" && (
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Chave PIX:</h4>
                <div className="flex items-center gap-2">
                  <code className="bg-background px-2 py-1 rounded">{pixKey}</code>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigator.clipboard.writeText(pixKey)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Resumo do Pedido</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{item.title || item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Quantidade: {item.quantity}
                    </p>
                  </div>
                  <p className="font-medium">
                    R$ {(item.price * item.quantity).toFixed(2)}
                  </p>
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
                  <span>
                    {finalShippingFee === 0 ? (
                      <span className="text-green-600 font-medium">GRÁTIS</span>
                    ) : (
                      `R$ ${finalShippingFee.toFixed(2)}`
                    )}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>R$ {total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3">
          {checkoutData.paymentMethod === "whatsapp" ? (
            <Button
              onClick={handleWhatsAppCheckout}
              disabled={loading || !checkoutData.name || !checkoutData.phone || !checkoutData.address || !checkoutData.cep || !checkoutData.numero}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Finalizar no WhatsApp
            </Button>
          ) : (
            <Button
              onClick={handlePixCheckout}
              disabled={loading || !checkoutData.name || !checkoutData.phone || !checkoutData.address || !checkoutData.cep || !checkoutData.numero}
              className="w-full"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              {loading ? "Processando..." : "Finalizar com PIX"}
            </Button>
          )}

          <p className="text-xs text-muted-foreground text-center">
            Ao finalizar a compra, você concorda com nossos Termos de Uso e Política de Privacidade
          </p>
        </div>
      </div>
    </div>
  )
}