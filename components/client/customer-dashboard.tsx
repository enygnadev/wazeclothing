
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
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { 
  User, 
  Package, 
  MapPin, 
  Shield, 
  Heart,
  Clock,
  CreditCard,
  Truck,
  CheckCircle,
  XCircle,
  Star,
  Plus,
  Edit,
  Trash2,
  Eye
} from "lucide-react"
import { useAuth } from "@/components/providers/auth-provider"
import { getOrdersByUser } from "@/lib/firebase/orders"
import { updateUserProfile } from "@/lib/firebase/users"
import type { Order } from "@/lib/types"

interface UserProfile {
  displayName: string
  email: string
  phone: string
  address: string
  birthDate: string
  preferences: {
    newsletter: boolean
    smsNotifications: boolean
    emailNotifications: boolean
  }
}

interface Address {
  id: string
  label: string
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
  zipCode: string
  isDefault: boolean
}

interface PaymentMethod {
  id: string
  type: 'credit' | 'debit' | 'pix'
  last4?: string
  brand?: string
  expiryMonth?: number
  expiryYear?: number
  isDefault: boolean
}

export function CustomerDashboard() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [profileLoading, setProfileLoading] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  
  const [profile, setProfile] = useState<UserProfile>({
    displayName: user?.displayName || "",
    email: user?.email || "",
    phone: "",
    address: "",
    birthDate: "",
    preferences: {
      newsletter: true,
      smsNotifications: false,
      emailNotifications: true
    }
  })

  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: "1",
      label: "Casa",
      street: "Rua das Flores",
      number: "123",
      complement: "Apto 45",
      neighborhood: "Centro",
      city: "São Paulo",
      state: "SP",
      zipCode: "01234-567",
      isDefault: true
    }
  ])

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: "1",
      type: "credit",
      last4: "1234",
      brand: "Visa",
      expiryMonth: 12,
      expiryYear: 2025,
      isDefault: true
    }
  ])

  const [wishlist] = useState([
    {
      id: "1",
      name: "Camiseta Premium",
      price: 89.90,
      image: "/placeholder.jpg",
      inStock: true
    },
    {
      id: "2",
      name: "Calça Jeans",
      price: 159.90,
      image: "/placeholder.jpg",
      inStock: false
    }
  ])

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
  }, [user])

  const handleProfileUpdate = async () => {
    if (!user) return

    setProfileLoading(true)
    try {
      await updateUserProfile(user.uid, profile)
      alert("Perfil atualizado com sucesso!")
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error)
      alert("Erro ao atualizar perfil")
    } finally {
      setProfileLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "Pendente", color: "bg-yellow-500", icon: Clock },
      processing: { label: "Processando", color: "bg-blue-500", icon: Package },
      shipped: { label: "Enviado", color: "bg-purple-500", icon: Truck },
      delivered: { label: "Entregue", color: "bg-green-500", icon: CheckCircle },
      cancelled: { label: "Cancelado", color: "bg-red-500", icon: XCircle }
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    const Icon = config.icon

    return (
      <Badge className={`${config.color} text-white flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    )
  }

  const getOrderProgress = (status: string): number => {
    const progressMap = {
      pending: 25,
      processing: 50,
      shipped: 75,
      delivered: 100,
      cancelled: 0
    }
    return progressMap[status as keyof typeof progressMap] || 0
  }

  const calculateTotalSpent = (): number => {
    return orders
      .filter(order => order.status !== 'cancelled')
      .reduce((total, order) => total + order.total, 0)
  }

  const getOrderStats = () => {
    const totalOrders = orders.length
    const completedOrders = orders.filter(order => order.status === 'delivered').length
    const cancelledOrders = orders.filter(order => order.status === 'cancelled').length
    const pendingOrders = orders.filter(order => 
      ['pending', 'processing', 'shipped'].includes(order.status)
    ).length

    return { totalOrders, completedOrders, cancelledOrders, pendingOrders }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <Package className="h-12 w-12 animate-spin mx-auto" />
          <p>Carregando seus dados...</p>
        </div>
      </div>
    )
  }

  const stats = getOrderStats()

  return (
    <div className="space-y-6">
      {/* Header com informações do usuário */}
      <div className="flex items-center space-x-4 mb-8">
        <Avatar className="h-20 w-20">
          <AvatarImage src={user?.photoURL || ""} />
          <AvatarFallback className="text-2xl">
            {user?.displayName?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Minha Conta</h1>
          <p className="text-muted-foreground">
            Bem-vindo, {user?.displayName || "Cliente"}!
          </p>
          <div className="flex items-center gap-4 mt-2">
            <Badge variant="outline">
              <Star className="w-3 h-3 mr-1" />
              Cliente Premium
            </Badge>
            <span className="text-sm text-muted-foreground">
              Membro desde {new Date().getFullYear()}
            </span>
          </div>
        </div>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total de Pedidos</p>
                <p className="text-2xl font-bold">{stats.totalOrders}</p>
              </div>
              <Package className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Entregues</p>
                <p className="text-2xl font-bold text-green-600">{stats.completedOrders}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Em Andamento</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pendingOrders}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Gasto</p>
                <p className="text-2xl font-bold">R$ {calculateTotalSpent().toFixed(2)}</p>
              </div>
              <CreditCard className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="orders" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
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
          <TabsTrigger value="payment" className="flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            Pagamento
          </TabsTrigger>
          <TabsTrigger value="wishlist" className="flex items-center gap-2">
            <Heart className="w-4 h-4" />
            Favoritos
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Segurança
          </TabsTrigger>
        </TabsList>

        {/* Tab de Pedidos */}
        <TabsContent value="orders" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Meus Pedidos</CardTitle>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">Você ainda não fez nenhum pedido.</p>
                  <Button onClick={() => window.location.href = "/products"}>
                    Começar a Comprar
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <Card key={order.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-medium">Pedido #{order.id.slice(-8)}</h3>
                            <p className="text-sm text-muted-foreground">
                              {order.createdAt.toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(order.status)}
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedOrder(order)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium">Progresso do Pedido</span>
                              <span className="text-sm text-muted-foreground">
                                {getOrderProgress(order.status)}%
                              </span>
                            </div>
                            <Progress value={getOrderProgress(order.status)} />
                          </div>

                          <Separator />

                          <div>
                            <h4 className="font-medium mb-2">Itens ({order.items.length})</h4>
                            {order.items.slice(0, 2).map((item, index) => (
                              <div key={index} className="flex justify-between items-center py-1">
                                <span className="text-sm">
                                  {item.title || item.name} x {item.quantity}
                                </span>
                                <span className="text-sm font-medium">
                                  R$ {(item.price * item.quantity).toFixed(2)}
                                </span>
                              </div>
                            ))}
                            {order.items.length > 2 && (
                              <p className="text-sm text-muted-foreground">
                                +{order.items.length - 2} item(s) adicionais
                              </p>
                            )}
                          </div>

                          <Separator />

                          <div className="flex justify-between items-center font-medium">
                            <span>Total:</span>
                            <span className="text-lg">R$ {order.total.toFixed(2)}</span>
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

        {/* Tab de Perfil */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <Label htmlFor="address">Endereço Principal</Label>
                <Textarea
                  id="address"
                  value={profile.address}
                  onChange={(e) => setProfile({...profile, address: e.target.value})}
                  placeholder="Rua, número, bairro, cidade, CEP"
                />
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-4">Preferências de Comunicação</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Newsletter</p>
                      <p className="text-sm text-muted-foreground">
                        Receba ofertas e novidades por e-mail
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={profile.preferences.newsletter}
                      onChange={(e) => setProfile({
                        ...profile,
                        preferences: {
                          ...profile.preferences,
                          newsletter: e.target.checked
                        }
                      })}
                      className="h-4 w-4"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Notificações por SMS</p>
                      <p className="text-sm text-muted-foreground">
                        Atualizações de pedidos por SMS
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={profile.preferences.smsNotifications}
                      onChange={(e) => setProfile({
                        ...profile,
                        preferences: {
                          ...profile.preferences,
                          smsNotifications: e.target.checked
                        }
                      })}
                      className="h-4 w-4"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Notificações por E-mail</p>
                      <p className="text-sm text-muted-foreground">
                        Atualizações importantes por e-mail
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={profile.preferences.emailNotifications}
                      onChange={(e) => setProfile({
                        ...profile,
                        preferences: {
                          ...profile.preferences,
                          emailNotifications: e.target.checked
                        }
                      })}
                      className="h-4 w-4"
                    />
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleProfileUpdate} 
                disabled={profileLoading}
                className="w-full md:w-auto"
              >
                {profileLoading ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab de Endereços */}
        <TabsContent value="addresses" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Endereços de Entrega</CardTitle>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Endereço
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {addresses.map((address) => (
                  <Card key={address.id} className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium">{address.label}</h4>
                          {address.isDefault && (
                            <Badge variant="secondary">Padrão</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {address.street}, {address.number}
                          {address.complement && `, ${address.complement}`}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {address.neighborhood}, {address.city} - {address.state}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          CEP: {address.zipCode}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab de Métodos de Pagamento */}
        <TabsContent value="payment" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Métodos de Pagamento</CardTitle>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Cartão
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <Card key={method.id} className="p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded flex items-center justify-center">
                          <CreditCard className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="font-medium">
                            {method.brand} •••• {method.last4}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Expira {method.expiryMonth?.toString().padStart(2, '0')}/{method.expiryYear}
                          </p>
                        </div>
                        {method.isDefault && (
                          <Badge variant="secondary">Padrão</Badge>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab de Favoritos */}
        <TabsContent value="wishlist" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Lista de Desejos</CardTitle>
            </CardHeader>
            <CardContent>
              {wishlist.length === 0 ? (
                <div className="text-center py-8">
                  <Heart className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">
                    Sua lista de desejos está vazia
                  </p>
                  <Button onClick={() => window.location.href = "/products"}>
                    Descobrir Produtos
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {wishlist.map((item) => (
                    <Card key={item.id} className="overflow-hidden">
                      <div className="aspect-square bg-muted"></div>
                      <CardContent className="p-4">
                        <h4 className="font-medium mb-2">{item.name}</h4>
                        <p className="text-lg font-bold text-green-600 mb-2">
                          R$ {item.price.toFixed(2)}
                        </p>
                        <div className="flex items-center justify-between">
                          <Badge variant={item.inStock ? "default" : "secondary"}>
                            {item.inStock ? "Em estoque" : "Indisponível"}
                          </Badge>
                          <Button variant="outline" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        {item.inStock && (
                          <Button className="w-full mt-3">
                            Adicionar ao Carrinho
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab de Segurança */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Segurança</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-medium mb-2">Alterar Senha</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Para alterar sua senha, você será redirecionado para fazer login novamente.
                </p>
                <Button variant="outline">Alterar Senha</Button>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-2">Sessões Ativas</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Gerencie onde você está logado
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-3 border rounded">
                    <div>
                      <p className="font-medium">Este dispositivo</p>
                      <p className="text-sm text-muted-foreground">
                        Último acesso: agora
                      </p>
                    </div>
                    <Badge variant="outline">Atual</Badge>
                  </div>
                </div>
              </div>

              <Separator />

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
