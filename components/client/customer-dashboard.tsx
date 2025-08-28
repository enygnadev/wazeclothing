"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { User, Package, MapPin, Shield } from "lucide-react"
import { useAuth } from "@/components/providers/auth-provider"
import { getOrdersByUser } from "@/lib/firebase/orders"
import { updateUserProfile } from "@/lib/firebase/users"
import type { Order } from "@/lib/types"

export function CustomerDashboard() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState({
    displayName: user?.displayName || "",
    email: user?.email || "",
    phone: "",
    address: "",
    birthDate: "",
  })

  const loadUserOrders = async () => {
    if (!user) return

    try {
      const userOrders = await getOrdersByUser(user.uid)
      setOrders(userOrders)
    } catch (error) {
      console.error("Erro ao carregar pedidos:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUserOrders()
  }, [loadUserOrders])

  const handleProfileUpdate = async () => {
    if (!user) return

    try {
      await updateUserProfile(user.uid, profile)
      alert("Perfil atualizado com sucesso!")
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error)
      alert("Erro ao atualizar perfil")
    }
  }

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

  if (loading) {
    return <div>Carregando...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4 mb-8">
        <Avatar className="h-20 w-20">
          <AvatarImage src={user?.photoURL || ""} />
          <AvatarFallback>
            {user?.displayName?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold">Minha Conta</h1>
          <p className="text-muted-foreground">
            Bem-vindo, {user?.displayName || "Cliente"}!
          </p>
        </div>
      </div>

      <Tabs defaultValue="orders" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="orders" className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            Pedidos
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Perfil
          </TabsTrigger>
          <TabsTrigger value="addresses" className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Endereços
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Segurança
          </TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Meus Pedidos</CardTitle>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Você ainda não fez nenhum pedido.</p>
                  <Button className="mt-4" onClick={() => window.location.href = "/products"}>
                    Continuar Comprando
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <Card key={order.id}>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-medium">Pedido #{order.id.slice(-8)}</h3>
                            <p className="text-sm text-muted-foreground">
                              {order.createdAt.toLocaleDateString()}
                            </p>
                          </div>
                          {getStatusBadge(order.status)}
                        </div>

                        <div className="space-y-2">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex justify-between items-center">
                              <span className="text-sm">{item.title || item.name} x {item.quantity}</span>
                              <span className="text-sm">R$ {(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>

                        <div className="border-t pt-2 mt-2">
                          <div className="flex justify-between items-center font-medium">
                            <span>Total:</span>
                            <span>R$ {order.total.toFixed(2)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="displayName">Nome Completo</Label>
                  <Input
                    id="displayName"
                    value={profile.displayName}
                    onChange={(e) => setProfile({...profile, displayName: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    disabled
                    className="bg-muted"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => setProfile({...profile, phone: e.target.value})}
                    placeholder="(11) 99999-9999"
                  />
                </div>
                <div>
                  <Label htmlFor="birthDate">Data de Nascimento</Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={profile.birthDate}
                    onChange={(e) => setProfile({...profile, birthDate: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address">Endereço</Label>
                <Textarea
                  id="address"
                  value={profile.address}
                  onChange={(e) => setProfile({...profile, address: e.target.value})}
                  placeholder="Rua, número, bairro, cidade, CEP"
                />
              </div>

              <Button onClick={handleProfileUpdate}>
                Salvar Alterações
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="addresses" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Endereços de Entrega</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Gerencie seus endereços de entrega para facilitar futuras compras.
              </p>
              <Button>Adicionar Novo Endereço</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Segurança</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Alterar Senha</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Para alterar sua senha, você será redirecionado para fazer login novamente.
                </p>
                <Button variant="outline">Alterar Senha</Button>
              </div>

              <div>
                <h4 className="font-medium mb-2">Privacidade</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Seus dados estão protegidos conforme a LGPD.
                  Você pode solicitar a exportação ou exclusão dos seus dados a qualquer momento.
                </p>
                <div className="space-x-2">
                  <Button variant="outline">Exportar Dados</Button>
                  <Button variant="destructive">Excluir Conta</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}