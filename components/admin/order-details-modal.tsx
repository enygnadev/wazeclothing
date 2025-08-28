
"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Package, User, MapPin, CreditCard, Calendar, Phone, Mail } from "lucide-react"
import type { Order } from "@/lib/types"

interface OrderDetailsModalProps {
  order: Order | null
  isOpen: boolean
  onClose: () => void
  onStatusChange: (orderId: string, newStatus: string) => Promise<void>
}

export function OrderDetailsModal({ order, isOpen, onClose, onStatusChange }: OrderDetailsModalProps) {
  const [isUpdating, setIsUpdating] = useState(false)

  if (!order) return null

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "Pendente", color: "bg-yellow-500" },
      processing: { label: "Processando", color: "bg-blue-500" },
      shipped: { label: "Enviado", color: "bg-purple-500" },
      delivered: { label: "Entregue", color: "bg-green-500" },
      cancelled: { label: "Cancelado", color: "bg-red-500" }
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    return <Badge className={`${config.color} text-white`}>{config.label}</Badge>
  }

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true)
    try {
      await onStatusChange(order.id, newStatus)
    } catch (error) {
      console.error("Erro ao atualizar status:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  const getPaymentMethodLabel = (method?: string) => {
    const methods = {
      pix: "PIX",
      credit_card: "Cartão de Crédito", 
      whatsapp: "WhatsApp"
    }
    return methods[method as keyof typeof methods] || "Não informado"
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Detalhes do Pedido #{order.id.slice(-8)}</span>
            {getStatusBadge(order.status)}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações Gerais */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Informações Gerais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">ID do Pedido</p>
                  <p className="font-mono text-sm">{order.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Data do Pedido</p>
                  <p>{order.createdAt.toLocaleDateString()} às {order.createdAt.toLocaleTimeString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status Atual</p>
                  <div className="mt-1">
                    <Select 
                      value={order.status} 
                      onValueChange={handleStatusChange}
                      disabled={isUpdating}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pendente</SelectItem>
                        <SelectItem value="processing">Processando</SelectItem>
                        <SelectItem value="shipped">Enviado</SelectItem>
                        <SelectItem value="delivered">Entregue</SelectItem>
                        <SelectItem value="cancelled">Cancelado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Método de Pagamento</p>
                  <p>{getPaymentMethodLabel(order.paymentMethod)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informações do Cliente */}
          {order.customerInfo && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Informações do Cliente
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Nome</p>
                    <p>{order.customerInfo.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                    <p className="flex items-center gap-2">
                      <Mail className="w-3 h-3" />
                      {order.customerInfo.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Telefone</p>
                    <p className="flex items-center gap-2">
                      <Phone className="w-3 h-3" />
                      {order.customerInfo.phone || "Não informado"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Endereço</p>
                    <p className="flex items-center gap-2">
                      <MapPin className="w-3 h-3" />
                      {order.customerInfo.address || "Não informado"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Itens do Pedido */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                Itens do Pedido ({order.items.length} {order.items.length === 1 ? 'item' : 'itens'})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 border rounded-lg">
                    <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center">
                      <Package className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        Quantidade: {item.quantity}x
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Preço unitário: R$ {item.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">R$ {(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Resumo Financeiro */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Resumo Financeiro
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>R$ {(order.total - (order.shippingFee || 0)).toFixed(2)}</span>
                </div>
                {order.shippingFee && order.shippingFee > 0 && (
                  <div className="flex justify-between">
                    <span>Frete:</span>
                    <span>R$ {order.shippingFee.toFixed(2)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>R$ {order.total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ações */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
