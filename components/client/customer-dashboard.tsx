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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
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
  Eye,
  Download,
  AlertTriangle,
  Lock,
  Mail,
  Phone,
  Calendar,
  Building,
  Home,
  Save,
  FileText,
  Settings,
  UserCheck,
  ShoppingCart,
  Upload,
  File,
  X
} from "lucide-react"
import { useAuth } from "@/components/providers/auth-provider"
import { getOrdersByUser } from "@/lib/firebase/orders"
import { 
  updateUserProfile, 
  getUserAddresses, 
  addUserAddress, 
  updateUserAddress, 
  deleteUserAddress,
  getUserPaymentMethods,
  addUserPaymentMethod,
  deleteUserPaymentMethod,
  getUserWishlist,
  addToWishlist,
  removeFromWishlist,
  exportUserData,
  deleteUserDataCompletely
} from "@/lib/firebase/users"
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { getFirestore, doc, updateDoc } from "firebase/firestore"
import { app } from "@/lib/firebase/config"
import { getDocumentsForCartItem } from "@/lib/product-templates"
import { useToast } from "@/hooks/use-toast"
import type { Order } from "@/lib/types"

interface UserProfile {
  displayName: string
  email: string
  phone: string
  cpf: string
  birthDate: string
  address: string
  preferences: {
    newsletter: boolean
    smsNotifications: boolean
    emailNotifications: boolean
    marketingCommunications: boolean
  }
  consentDate?: Date
  consentVersion?: string
}

interface Address {
  id: string
  label: string
  name: string
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
  holderName?: string
  isDefault: boolean
}

interface WishlistItem {
  id: string
  productId: string
  title: string
  price: number
  image?: string
  inStock: boolean
  createdAt: Date
}

export function CustomerDashboard() {
  const { user, userProfile } = useAuth()
  const { toast } = useToast()
  const storage = getStorage(app)
  const db = getFirestore(app)
  const [orders, setOrders] = useState<Order[]>([])
  const [addresses, setAddresses] = useState<Address[]>([])
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [wishlist, setWishlist] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [profileLoading, setProfileLoading] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [newAddress, setNewAddress] = useState<Partial<Address>>({})
  const [showAddressDialog, setShowAddressDialog] = useState(false)
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deletingItem, setDeletingItem] = useState<{type: string, id: string} | null>(null)
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null)
  const [showOrderDetailsModal, setShowOrderDetailsModal] = useState(false)
  const [uploadingDocuments, setUploadingDocuments] = useState<{[key: string]: boolean}>({})
  const [orderDocuments, setOrderDocuments] = useState<{[orderId: string]: {[productId: string]: {[document: string]: string}}}>({})

  const [profile, setProfile] = useState<UserProfile>({
    displayName: user?.displayName || "",
    email: user?.email || "",
    phone: "",
    cpf: "",
    birthDate: "",
    address: "",
    preferences: {
      newsletter: true,
      smsNotifications: false,
      emailNotifications: true,
      marketingCommunications: false
    }
  })

  const [newPaymentMethod, setNewPaymentMethod] = useState({
    type: 'credit' as 'credit' | 'debit' | 'pix',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    holderName: '',
    isDefault: false
  })

  const loadUserData = async () => {
    if (!user) {
      console.log("👤 Usuário não autenticado, não carregando dados")
      return
    }

    try {
      console.log("🔄 Iniciando carregamento de dados para:", user.uid)
      console.log("📧 Email do usuário:", user.email)
      console.log("👤 Nome do usuário:", user.displayName)
      setLoading(true)

      const [userOrders, userAddresses, userPaymentMethods, userWishlist] = await Promise.all([
        getOrdersByUser(user.uid),
        getUserAddresses(user.uid),
        getUserPaymentMethods(user.uid),
        getUserWishlist(user.uid)
      ])

      console.log("📦 Dados carregados:", {
        orders: userOrders.length,
        addresses: userAddresses.length,
        paymentMethods: userPaymentMethods.length,
        wishlist: userWishlist.length
      })

      if (userOrders.length > 0) {
        console.log("✅ Pedidos encontrados! Detalhes:")
        userOrders.forEach((order, index) => {
          console.log(`  ${index + 1}. ID: ${order.id}`)
          console.log(`     Status: ${order.status}`)
          console.log(`     Total: R$ ${order.total}`)
          console.log(`     Data: ${order.createdAt.toLocaleDateString()}`)
        })
      } else {
        console.log("⚠️ Nenhum pedido encontrado para este usuário")
        console.log("🔍 Verifique se o pedido foi criado com o userId correto:", user.uid)
      }

      setOrders(userOrders)
      setAddresses(userAddresses as Address[])
      setPaymentMethods(userPaymentMethods as PaymentMethod[])
      setWishlist(userWishlist as WishlistItem[])

      // Carregar dados do perfil se existirem
      if (userProfile) {
        setProfile(prev => ({
          ...prev,
          ...userProfile,
          preferences: {
            ...prev.preferences,
            ...userProfile.preferences
          }
        }))
      }

    } catch (error) {
      console.error("❌ Erro ao carregar dados do usuário:", error)
      toast({
        title: "Erro",
        description: "Erro ao carregar seus dados",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUserData()
  }, [user, userProfile])

  const handleProfileUpdate = async () => {
    if (!user) return

    setProfileLoading(true)
    try {
      await updateUserProfile(user.uid, {
        ...profile,
        updatedAt: new Date()
      })

      toast({
        title: "Sucesso",
        description: "Perfil atualizado com sucesso!"
      })
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error)
      toast({
        title: "Erro",
        description: "Erro ao atualizar perfil",
        variant: "destructive"
      })
    } finally {
      setProfileLoading(false)
    }
  }

  const handleAddAddress = async () => {
    if (!user || !newAddress.street || !newAddress.number || !newAddress.city) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      })
      return
    }

    try {
      const addressId = await addUserAddress(user.uid, newAddress)
      if (addressId) {
        await loadUserData()
        setNewAddress({})
        setShowAddressDialog(false)
        toast({
          title: "Sucesso",
          description: "Endereço adicionado com sucesso!"
        })
      }
    } catch (error) {
      console.error("Erro ao adicionar endereço:", error)
      toast({
        title: "Erro",
        description: "Erro ao adicionar endereço",
        variant: "destructive"
      })
    }
  }

  const handleUpdateAddress = async () => {
    if (!editingAddress) return

    try {
      await updateUserAddress(editingAddress.id, editingAddress)
      await loadUserData()
      setEditingAddress(null)
      toast({
        title: "Sucesso",
        description: "Endereço atualizado com sucesso!"
      })
    } catch (error) {
      console.error("Erro ao atualizar endereço:", error)
      toast({
        title: "Erro",
        description: "Erro ao atualizar endereço",
        variant: "destructive"
      })
    }
  }

  const handleDeleteAddress = async (addressId: string) => {
    try {
      await deleteUserAddress(addressId)
      await loadUserData()
      toast({
        title: "Sucesso",
        description: "Endereço removido com sucesso!"
      })
    } catch (error) {
      console.error("Erro ao remover endereço:", error)
      toast({
        title: "Erro",
        description: "Erro ao remover endereço",
        variant: "destructive"
      })
    }
  }

  const handleAddPaymentMethod = async () => {
    if (!user || !newPaymentMethod.cardNumber || !newPaymentMethod.holderName) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      })
      return
    }

    try {
      const paymentData = {
        type: newPaymentMethod.type,
        last4: newPaymentMethod.cardNumber.slice(-4),
        brand: detectCardBrand(newPaymentMethod.cardNumber),
        expiryMonth: parseInt(newPaymentMethod.expiryMonth),
        expiryYear: parseInt(newPaymentMethod.expiryYear),
        holderName: newPaymentMethod.holderName,
        isDefault: newPaymentMethod.isDefault
      }

      const paymentId = await addUserPaymentMethod(user.uid, paymentData)
      if (paymentId) {
        await loadUserData()
        setNewPaymentMethod({
          type: 'credit',
          cardNumber: '',
          expiryMonth: '',
          expiryYear: '',
          cvv: '',
          holderName: '',
          isDefault: false
        })
        setShowPaymentDialog(false)
        toast({
          title: "Sucesso",
          description: "Método de pagamento adicionado com sucesso!"
        })
      }
    } catch (error) {
      console.error("Erro ao adicionar método de pagamento:", error)
      toast({
        title: "Erro",
        description: "Erro ao adicionar método de pagamento",
        variant: "destructive"
      })
    }
  }

  const handleDeletePaymentMethod = async (paymentMethodId: string) => {
    try {
      await deleteUserPaymentMethod(paymentMethodId)
      await loadUserData()
      toast({
        title: "Sucesso",
        description: "Método de pagamento removido com sucesso!"
      })
    } catch (error) {
      console.error("Erro ao remover método de pagamento:", error)
      toast({
        title: "Erro",
        description: "Erro ao remover método de pagamento",
        variant: "destructive"
      })
    }
  }

  const handleRemoveFromWishlist = async (productId: string) => {
    if (!user) return

    try {
      await removeFromWishlist(user.uid, productId)
      await loadUserData()
      toast({
        title: "Sucesso",
        description: "Item removido da lista de desejos!"
      })
    } catch (error) {
      console.error("Erro ao remover da lista de desejos:", error)
      toast({
        title: "Erro",
        description: "Erro ao remover da lista de desejos",
        variant: "destructive"
      })
    }
  }

  const handleExportData = async () => {
    if (!user) return

    try {
      const userData = await exportUserData(user.uid)
      if (userData) {
        const blob = new Blob([JSON.stringify(userData, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `meus-dados-${new Date().toISOString().split('T')[0]}.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)

        toast({
          title: "Sucesso",
          description: "Seus dados foram exportados com sucesso!"
        })
      }
    } catch (error) {
      console.error("Erro ao exportar dados:", error)
      toast({
        title: "Erro",
        description: "Erro ao exportar dados",
        variant: "destructive"
      })
    }
  }

  const handleDeleteAccount = async () => {
    if (!user) return

    try {
      await deleteUserDataCompletely(user.uid)
      toast({
        title: "Sucesso",
        description: "Sua conta foi excluída permanentemente conforme solicitado."
      })
      // O usuário será redirecionado pelo AuthProvider
    } catch (error) {
      console.error("Erro ao excluir conta:", error)
      toast({
        title: "Erro",
        description: "Erro ao excluir conta",
        variant: "destructive"
      })
    }
  }

  const detectCardBrand = (cardNumber: string): string => {
    const number = cardNumber.replace(/\D/g, '')
    if (number.startsWith('4')) return 'Visa'
    if (number.startsWith('5') || number.startsWith('2')) return 'Mastercard'
    if (number.startsWith('3')) return 'American Express'
    return 'Outro'
  }

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  }

  const formatCEP = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    return numbers.replace(/(\d{5})(\d{3})/, '$1-$2')
  }

  const handleDocumentUpload = async (orderId: string, productId: string, documentName: string, file: File) => {
    if (!user) return

    const uploadKey = `${orderId}-${productId}-${documentName}`
    setUploadingDocuments(prev => ({ ...prev, [uploadKey]: true }))

    try {
      // Upload do arquivo para o Firebase Storage - usando caminho específico para pedidos
      const storageRef = ref(storage, `orders/${orderId}/documents/${productId}_${documentName}_${Date.now()}_${file.name}`)
      await uploadBytes(storageRef, file)
      const downloadURL = await getDownloadURL(storageRef)

      // Encontrar o item no pedido
      const order = orders.find(o => o.id === orderId)

      // Verificar se order e items existem
      if (!order || !order.items || typeof order.items !== 'object') {
        console.error("Pedido não encontrado ou items não existe:", order)
        throw new Error("Pedido inválido")
      }

      // Como items é um mapa/objeto, usar productId como chave direta
      const currentItem = order.items[productId]

      if (!currentItem) {
        console.error("Item não encontrado no pedido:", productId, "Items disponíveis:", Object.keys(order.items))
        throw new Error("Item não encontrado no pedido")
      }

      // Buscar documentos existentes do item
      const currentDocuments = currentItem.documents || []

      // Encontrar ou criar o documento
      const docIndex = currentDocuments.findIndex((d: any) => d.name === documentName)

      if (docIndex >= 0) {
        // Atualizar documento existente
        currentDocuments[docIndex] = {
          name: documentName,
          url: downloadURL,
          uploadedAt: new Date()
        }
      } else {
        // Adicionar novo documento
        currentDocuments.push({
          name: documentName,
          url: downloadURL,
          uploadedAt: new Date()
        })
      }

      // Atualizar no Firestore usando a estrutura de mapa
      const orderRef = doc(db, 'orders', orderId)
      await updateDoc(orderRef, {
        [`items.${productId}.documents`]: currentDocuments,
        updatedAt: new Date()
      })

      // Atualizar o estado local
      setOrderDocuments(prev => ({
        ...prev,
        [orderId]: {
          ...prev[orderId],
          [productId]: {
            ...prev[orderId]?.[productId],
            [documentName]: downloadURL
          }
        }
      }))

      toast({
        title: "Sucesso",
        description: `${documentName} enviado com sucesso!`
      })

      // Recarregar dados dos pedidos
      await loadUserData()

    } catch (error) {
      console.error("Erro ao fazer upload do documento:", error)
      toast({
        title: "Erro",
        description: "Erro ao enviar documento. Tente novamente.",
        variant: "destructive"
      })
    } finally {
      setUploadingDocuments(prev => ({ ...prev, [uploadKey]: false }))
    }
  }

  const getDocumentStatus = (order: Order, productId: string, documentName: string) => {
    // Como items é um mapa/objeto, buscar diretamente pela chave
    if (!order.items || typeof order.items !== 'object') {
      return { uploaded: false }
    }

    const item = order.items[productId]

    if (!item) return { uploaded: false }

    // Verificar se tem documentos no formato do Firebase (array de documentos)
    const documents = (item as any).documents
    if (documents && Array.isArray(documents)) {
      const doc = documents.find((d: any) => d.name === documentName)
      if (doc && doc.url && doc.url !== null) {
        return {
          uploaded: true,
          url: doc.url,
          fileName: doc.name,
          uploadedAt: doc.uploadedAt
        }
      }
    }

    return { uploaded: false }
  }

  const openOrderDetails = (order: Order) => {
    setSelectedOrderDetails(order)
    setShowOrderDetailsModal(true)
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
      .reduce((total, order) => total + ((order as any).totalPrice || order.total || 0), 0)
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
            Bem-vindo, {user?.displayName || profile.displayName || "Cliente"}!
          </p>
          <div className="flex items-center gap-4 mt-2">
            <Badge variant="outline">
              <Star className="w-3 h-3 mr-1" />
              Cliente Verificado
            </Badge>
            <span className="text-sm text-muted-foreground">
              Membro desde {(() => {
                if (userProfile?.createdAt) {
                  // Se for um Timestamp do Firebase
                  if (typeof userProfile.createdAt === 'object' && 'toDate' in userProfile.createdAt) {
                    return userProfile.createdAt.toDate().getFullYear()
                  }
                  // Se for uma string ou Date
                  return new Date(userProfile.createdAt).getFullYear()
                }
                return new Date().getFullYear()
              })()}
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
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Meus Pedidos ({orders.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">Você ainda não fez nenhum pedido.</p>
                  <Button onClick={() => window.location.href = "/products"}>
                    <ShoppingCart className="w-4 h-4 mr-2" />
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
                              {order.createdAt.toLocaleDateString('pt-BR', {
                                day: '2-digit',
                                month: '2-digit', 
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(order.status)}
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => openOrderDetails(order)}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              Detalhes
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
                            <h4 className="font-medium mb-2">Itens ({Array.isArray(order.items) ? order.items.length : (order.items ? Object.keys(order.items).length : 0)})</h4>
                            {(() => {
                              if (!order.items) {
                                return (
                                  <div className="text-center py-4 text-muted-foreground">
                                    <Package className="w-6 h-6 mx-auto mb-2" />
                                    <p className="text-sm">Nenhum item neste pedido</p>
                                  </div>
                                )
                              }

                              // Converter items para array se necessário
                              const itemsArray = Array.isArray(order.items) 
                                ? order.items 
                                : Object.values(order.items)

                              return itemsArray.map((item: any, index: number) => (
                                <div key={item.id || item.itemId || index} className="flex justify-between items-center py-1">
                                  <span className="text-sm">
                                    {item.title || item.name || 'Produto'} x {item.quantity || 1}
                                  </span>
                                  <span className="text-sm font-medium">
                                    R$ {((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                                  </span>
                                </div>
                              ))
                            })()}
                          </div>

                          <Separator />

                          <div className="flex justify-between items-center font-medium">
                            <span>Total:</span>
                            <span className="text-lg">R$ {((order as any).totalPrice || order.total || 0).toFixed(2)}</span>
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
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Informações Pessoais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="displayName">Nome Completo *</Label>
                  <Input
                    id="displayName"
                    value={profile.displayName}
                    onChange={(e) => setProfile({...profile, displayName: e.target.value})}
                    placeholder="Seu nome completo"
                  />
                </div>
                <div>
                  <Label htmlFor="email">E-mail *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Para alterar o e-mail, entre em contato conosco
                  </p>
                </div>
                <div>
                  <Label htmlFor="cpf">CPF</Label>
                  <Input
                    id="cpf"
                    value={profile.cpf}
                    onChange={(e) => setProfile({...profile, cpf: formatCPF(e.target.value)})}
                    placeholder="000.000.000-00"
                    maxLength={14}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => setProfile({...profile, phone: formatPhone(e.target.value)})}
                    placeholder="(11) 99999-9999"
                    maxLength={15}
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

              <Separator />

              <div>
                <h4 className="font-medium mb-4 flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Preferências de Comunicação
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Newsletter</p>
                      <p className="text-sm text-muted-foreground">
                        Receba ofertas e novidades por e-mail
                      </p>
                    </div>
                    <Switch
                      checked={profile.preferences.newsletter}
                      onCheckedChange={(checked) => setProfile({
                        ...profile,
                        preferences: { ...profile.preferences, newsletter: checked }
                      })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Notificações por SMS</p>
                      <p className="text-sm text-muted-foreground">
                        Atualizações de pedidos por SMS
                      </p>
                    </div>
                    <Switch
                      checked={profile.preferences.smsNotifications}
                      onCheckedChange={(checked) => setProfile({
                        ...profile,
                        preferences: { ...profile.preferences, smsNotifications: checked }
                      })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Notificações por E-mail</p>
                      <p className="text-sm text-muted-foreground">
                        Atualizações importantes por e-mail
                      </p>
                    </div>
                    <Switch
                      checked={profile.preferences.emailNotifications}
                      onCheckedChange={(checked) => setProfile({
                        ...profile,
                        preferences: { ...profile.preferences, emailNotifications: checked }
                      })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Comunicações de Marketing</p>
                      <p className="text-sm text-muted-foreground">
                        Promoções e campanhas personalizadas
                      </p>
                    </div>
                    <Switch
                      checked={profile.preferences.marketingCommunications}
                      onCheckedChange={(checked) => setProfile({
                        ...profile,
                        preferences: { ...profile.preferences, marketingCommunications: checked }
                      })}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <Alert>
                <UserCheck className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  <strong>Proteção de Dados (LGPD):</strong> Seus dados são protegidos conforme a Lei Geral de Proteção de Dados. 
                  Você pode solicitar a exportação ou exclusão dos seus dados a qualquer momento.
                  {profile.consentDate && (
                    <span className="block mt-1">
                      Consentimento dado em: {new Date(profile.consentDate).toLocaleDateString('pt-BR')}
                    </span>
                  )}
                </AlertDescription>
              </Alert>

              <Button 
                onClick={handleProfileUpdate} 
                disabled={profileLoading}
                className="w-full md:w-auto"
              >
                {profileLoading ? (
                  <>
                    <Settings className="w-4 h-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Salvar Alterações
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab de Endereços */}
        <TabsContent value="addresses" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Endereços de Entrega ({addresses.length})
                </CardTitle>
                <Dialog open={showAddressDialog} onOpenChange={setShowAddressDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Endereço
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Novo Endereço</DialogTitle>
                      <DialogDescription>
                        Adicione um novo endereço de entrega
                      </DialogDescription>
                    </DialogHeader>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <Label htmlFor="addressLabel">Nome do Endereço *</Label>
                        <Input
                          id="addressLabel"
                          value={newAddress.label || ''}
                          onChange={(e) => setNewAddress({...newAddress, label: e.target.value})}
                          placeholder="Ex: Casa, Trabalho, Casa dos Pais"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <Label htmlFor="addressName">Nome do Destinatário *</Label>
                        <Input
                          id="addressName"
                          value={newAddress.name || ''}
                          onChange={(e) => setNewAddress({...newAddress, name: e.target.value})}
                          placeholder="Nome completo de quem vai receber"
                        />
                      </div>

                      <div>
                        <Label htmlFor="addressZip">CEP *</Label>
                        <Input
                          id="addressZip"
                          value={newAddress.zipCode || ''}
                          onChange={(e) => setNewAddress({...newAddress, zipCode: formatCEP(e.target.value)})}
                          placeholder="00000-000"
                          maxLength={9}
                        />
                      </div>

                      <div>
                        <Label htmlFor="addressStreet">Rua *</Label>
                        <Input
                          id="addressStreet"
                          value={newAddress.street || ''}
                          onChange={(e) => setNewAddress({...newAddress, street: e.target.value})}
                          placeholder="Nome da rua"
                        />
                      </div>

                      <div>
                        <Label htmlFor="addressNumber">Número *</Label>
                        <Input
                          id="addressNumber"
                          value={newAddress.number || ''}
                          onChange={(e) => setNewAddress({...newAddress, number: e.target.value})}
                          placeholder="123"
                        />
                      </div>

                      <div>
                        <Label htmlFor="addressComplement">Complemento</Label>
                        <Input
                          id="addressComplement"
                          value={newAddress.complement || ''}
                          onChange={(e) => setNewAddress({...newAddress, complement: e.target.value})}
                          placeholder="Apto, Bloco, etc."
                        />
                      </div>

                      <div>
                        <Label htmlFor="addressNeighborhood">Bairro *</Label>
                        <Input
                          id="addressNeighborhood"
                          value={newAddress.neighborhood || ''}
                          onChange={(e) => setNewAddress({...newAddress, neighborhood: e.target.value})}
                          placeholder="Nome do bairro"
                        />
                      </div>

                      <div>
                        <Label htmlFor="addressCity">Cidade *</Label>
                        <Input
                          id="addressCity"
                          value={newAddress.city || ''}
                          onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                          placeholder="Nome da cidade"
                        />
                      </div>

                      <div>
                        <Label htmlFor="addressState">Estado *</Label>
                        <Select 
                          value={newAddress.state || ''} 
                          onValueChange={(value) => setNewAddress({...newAddress, state: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="SP">São Paulo</SelectItem>
                            <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                            <SelectItem value="MG">Minas Gerais</SelectItem>
                            <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                            <SelectItem value="PR">Paraná</SelectItem>
                            <SelectItem value="SC">Santa Catarina</SelectItem>
                            {/* Adicionar outros estados */}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="md:col-span-2 flex items-center space-x-2">
                        <Switch
                          id="isDefault"
                          checked={newAddress.isDefault || false}
                          onCheckedChange={(checked) => setNewAddress({...newAddress, isDefault: checked})}
                        />
                        <Label htmlFor="isDefault">Definir como endereço padrão</Label>
                      </div>
                    </div>

                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowAddressDialog(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={handleAddAddress}>
                        <Save className="w-4 h-4 mr-2" />
                        Salvar Endereço
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {addresses.length === 0 ? (
                <div className="text-center py-8">
                  <MapPin className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">
                    Você ainda não tem endereços cadastrados
                  </p>
                  <Button onClick={() => setShowAddressDialog(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Primeiro Endereço
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {addresses.map((address) => (
                    <Card key={address.id} className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium">{address.label}</h4>
                            {address.isDefault && (
                              <Badge variant="secondary">
                                <Home className="w-3 h-3 mr-1" />
                                Padrão
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm font-medium">{address.name}</p>
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
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setEditingAddress(address)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setDeletingItem({type: 'address', id: address.id})
                              setShowDeleteDialog(true)
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab de Métodos de Pagamento */}
        <TabsContent value="payment" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Métodos de Pagamento ({paymentMethods.length})
                </CardTitle>
                <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Cartão
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Novo Método de Pagamento</DialogTitle>
                      <DialogDescription>
                        Adicione um novo cartão de crédito ou débito
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="cardType">Tipo do Cartão</Label>
                        <Select 
                          value={newPaymentMethod.type} 
                          onValueChange={(value: 'credit' | 'debit') => 
                            setNewPaymentMethod({...newPaymentMethod, type: value})
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="credit">Crédito</SelectItem>
                            <SelectItem value="debit">Débito</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="cardNumber">Número do Cartão *</Label>
                        <Input
                          id="cardNumber"
                          value={newPaymentMethod.cardNumber}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '')
                            setNewPaymentMethod({...newPaymentMethod, cardNumber: value})
                          }}
                          placeholder="1234567890123456"
                          maxLength={16}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Apenas os últimos 4 dígitos serão armazenados
                        </p>
                      </div>

                      <div>
                        <Label htmlFor="holderName">Nome no Cartão *</Label>
                        <Input
                          id="holderName"
                          value={newPaymentMethod.holderName}
                          onChange={(e) => setNewPaymentMethod({...newPaymentMethod, holderName: e.target.value})}
                          placeholder="Nome como está no cartão"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="expiryMonth">Mês</Label>
                          <Select 
                            value={newPaymentMethod.expiryMonth} 
                            onValueChange={(value) => setNewPaymentMethod({...newPaymentMethod, expiryMonth: value})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="MM" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({length: 12}, (_, i) => (
                                <SelectItem key={i+1} value={(i+1).toString().padStart(2, '0')}>
                                  {(i+1).toString().padStart(2, '0')}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="expiryYear">Ano</Label>
                          <Select 
                            value={newPaymentMethod.expiryYear} 
                            onValueChange={(value) => setNewPaymentMethod({...newPaymentMethod, expiryYear: value})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="AAAA" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({length: 20}, (_, i) => {
                                const year = new Date().getFullYear() + i
                                return (
                                  <SelectItem key={year} value={year.toString()}>
                                    {year}
                                  </SelectItem>
                                )
                              })}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            value={newPaymentMethod.cvv}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, '')
                              setNewPaymentMethod({...newPaymentMethod, cvv: value})
                            }}
                            placeholder="123"
                            maxLength={4}
                          />
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="isDefaultPayment"
                          checked={newPaymentMethod.isDefault}
                          onCheckedChange={(checked) => setNewPaymentMethod({...newPaymentMethod, isDefault: checked})}
                        />
                        <Label htmlFor="isDefaultPayment">Definir como método padrão</Label>
                      </div>
                    </div>

                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={handleAddPaymentMethod}>
                        <Save className="w-4 h-4 mr-2" />
                        Salvar Cartão
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {paymentMethods.length === 0 ? (
                <div className="text-center py-8">
                  <CreditCard className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">
                    Você ainda não tem métodos de pagamento cadastrados
                  </p>
                  <Button onClick={() => setShowPaymentDialog(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Primeiro Cartão
                  </Button>
                </div>
              ) : (
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
                            <div className="flex items-center gap-2">
                              <p className="text-sm text-muted-foreground">
                                Expira {method.expiryMonth?.toString().padStart(2, '0')}/{method.expiryYear}
                              </p>
                              <Badge variant={method.type === 'credit' ? 'default' : 'secondary'}>
                                {method.type === 'credit' ? 'Crédito' : 'Débito'}
                              </Badge>
                              {method.isDefault && (
                                <Badge variant="outline">Padrão</Badge>
                              )}
                            </div>
                            {method.holderName && (
                              <p className="text-sm text-muted-foreground">
                                {method.holderName}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setDeletingItem({type: 'payment', id: method.id})
                              setShowDeleteDialog(true)
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              <Alert className="mt-4">
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  <strong>Segurança:</strong> Não armazenamos dados completos do cartão. 
                  Apenas os últimos 4 dígitos são salvos para identificação.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab de Lista de Desejos */}
        <TabsContent value="wishlist" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Lista de Desejos ({wishlist.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {wishlist.length === 0 ? (
                <div className="text-center py-8">
                  <Heart className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">
                    Sua lista de desejos está vazia
                  </p>
                  <Button onClick={() => window.location.href = "/products"}>
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Descobrir Produtos
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {wishlist.map((item) => (
                    <Card key={item.id} className="overflow-hidden">
                      <div className="aspect-square bg-muted relative">
                        {item.image && (
                          <img 
                            src={item.image} 
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => handleRemoveFromWishlist(item.productId)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <CardContent className="p-4">
                        <h4 className="font-medium mb-2 line-clamp-2">{item.title}</h4>
                        <p className="text-lg font-bold text-green-600 mb-2">
                          R$ {item.price.toFixed(2)}
                        </p>
                        <div className="flex items-center justify-between mb-3">
                          <Badge variant={item.inStock ? "default" : "secondary"}>
                            {item.inStock ? "Em estoque" : "Indisponível"}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            Adicionado em {item.createdAt.toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                        {item.inStock && (
                          <Button className="w-full">
                            <ShoppingCart className="w-4 h-4 mr-2" />
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

        {/* Tab de Segurança e Privacidade */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Configurações de Segurança
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Alterar Senha
                </h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Para alterar sua senha, você será redirecionado para fazer login novamente com segurança.
                </p>
                <Button variant="outline">
                  <Lock className="w-4 h-4 mr-2" />
                  Alterar Senha
                </Button>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Sessões Ativas
                </h4>
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
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Proteção de Dados (LGPD)
                </h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Seus dados são protegidos conforme a Lei Geral de Proteção de Dados Pessoais (LGPD). 
                  Você tem direito ao acesso, correção, eliminação e portabilidade dos seus dados.
                </p>

                <div className="space-y-3">
                  <Alert>
                    <UserCheck className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Seus Direitos:</strong>
                      <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                        <li>Solicitar informações sobre o tratamento dos seus dados</li>
                        <li>Corrigir dados incompletos, inexatos ou desatualizados</li>
                        <li>Solicitar a eliminação dos dados pessoais</li>
                        <li>Revogar o consentimento</li>
                        <li>Obter a portabilidade dos dados</li>
                      </ul>
                    </AlertDescription>
                  </Alert>

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={handleExportData}>
                      <Download className="w-4 h-4 mr-2" />
                      Exportar Meus Dados
                    </Button>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="destructive">
                          <AlertTriangle className="w-4 h-4 mr-2" />
                          Excluir Conta
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-red-500" />
                            Excluir Conta Permanentemente
                          </DialogTitle>
                          <DialogDescription>
                            Esta ação é irreversível. Todos os seus dados serão excluídos permanentemente, incluindo:
                          </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-2">
                          <ul className="list-disc list-inside text-sm space-y-1">
                            <li>Informações pessoais e perfil</li>
                            <li>Histórico de pedidos</li>
                            <li>Endereços de entrega</li>
                            <li>Métodos de pagamento</li>
                            <li>Lista de desejos</li>
                            <li>Preferências de comunicação</li>
                          </ul>

                          <Alert className="mt-4">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>
                              <strong>Atenção:</strong> Esta ação não pode ser desfeita. 
                              Certifique-se de que deseja excluir permanentemente sua conta.
                            </AlertDescription>
                          </Alert>
                        </div>

                        <DialogFooter>
                          <Button variant="outline">Cancelar</Button>
                          <Button variant="destructive" onClick={handleDeleteAccount}>
                            <AlertTriangle className="w-4 h-4 mr-2" />
                            Confirmar Exclusão
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-2">Contato para Exercer Direitos</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Para exercer qualquer um dos seus direitos sob a LGPD, entre em contato conosco:
                </p>
                <div className="space-y-1 text-sm">
                  <p className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    lgpd@juridicoecommerce.com.br
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    (11) 9999-9999
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal de Detalhes do Pedido */}
      <Dialog open={showOrderDetailsModal} onOpenChange={setShowOrderDetailsModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Detalhes do Pedido #{selectedOrderDetails?.id.slice(-8)}</span>
              {selectedOrderDetails && getStatusBadge(selectedOrderDetails.status)}
            </DialogTitle>
          </DialogHeader>

          {selectedOrderDetails && (
            <div className="space-y-6">
              {/* Informações Gerais */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    Informações do Pedido
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Data do Pedido</p>
                      <p>{selectedOrderDetails.createdAt.toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit', 
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Status</p>
                      <div className="mt-1">
                        {getStatusBadge(selectedOrderDetails.status)}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total</p>
                      <p className="text-lg font-bold">R$ {((selectedOrderDetails as any).totalPrice || selectedOrderDetails.total || 0).toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Itens</p>
                      <p>{(() => {
                        if (selectedOrderDetails.items && typeof selectedOrderDetails.items === 'object') {
                          return Object.keys(selectedOrderDetails.items).length
                        }
                        if (Array.isArray(selectedOrderDetails.items)) {
                          return selectedOrderDetails.items.length
                        }
                        return 0
                      })()} item(s)</p>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Progresso do Pedido</span>
                      <span className="text-sm text-muted-foreground">
                        {getOrderProgress(selectedOrderDetails.status)}%
                      </span>
                    </div>
                    <Progress value={getOrderProgress(selectedOrderDetails.status)} />
                  </div>
                </CardContent>
              </Card>

              {/* Itens e Documentos */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Itens e Documentos Necessários
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {(() => {
                      // Tratar items como mapa (objeto) conforme estrutura do Firebase
                      if (!selectedOrderDetails.items) {
                        return (
                          <div className="text-center py-8 text-muted-foreground">
                            <Package className="w-8 h-8 mx-auto mb-2" />
                            <p>Nenhum item encontrado neste pedido</p>
                          </div>
                        )
                      }

                      let itemEntries: [string, any][] = []

                      if (typeof selectedOrderDetails.items === 'object' && !Array.isArray(selectedOrderDetails.items)) {
                        // Items é um mapa/objeto - obter entries
                        itemEntries = Object.entries(selectedOrderDetails.items)
                      } else if (Array.isArray(selectedOrderDetails.items)) {
                        // Items é um array (fallback) - converter para entries
                        itemEntries = selectedOrderDetails.items.map((item, index) => [index.toString(), item])
                      }

                      if (itemEntries.length === 0) {
                        return (
                          <div className="text-center py-8 text-muted-foreground">
                            <Package className="w-8 h-8 mx-auto mb-2" />
                            <p>Nenhum item encontrado neste pedido</p>
                          </div>
                        )
                      }

                      return itemEntries.map(([itemKey, item]) => {
                        // Para o Firebase, usar itemKey (que é a chave do mapa)
                        // Mas para compatibilidade, também aceitar item.id se existir
                        const itemId = item.id || itemKey

                        // Buscar documentos diretamente do item no Firebase
                        const documentsFromFirebase = item.documents || []

                        return (
                          <div key={itemKey} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h4 className="font-medium">{item.title || item.name || `Item ${itemKey}`}</h4>
                                <p className="text-sm text-muted-foreground">
                                  Quantidade: {item.quantity || 1} | Valor: R$ {((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  ID: {itemId}
                                </p>
                              </div>
                            </div>

                            {documentsFromFirebase.length > 0 ? (
                              <div>
                                <h5 className="font-medium mb-3">Documentos Necessários ({documentsFromFirebase.length}):</h5>
                                <div className="space-y-3">
                                  {documentsFromFirebase.map((doc, docIndex) => {
                                    const documentName = doc.name
                                    const uploadKey = `${selectedOrderDetails.id}-${itemId}-${documentName}`
                                    const isUploading = uploadingDocuments[uploadKey]
                                    const hasUrl = doc.url && doc.url !== null

                                    return (
                                      <div key={docIndex} className="flex flex-col sm:flex-row gap-3 p-3 border rounded">
                                        <div className="flex items-center gap-2 flex-1">
                                          <File className="w-4 h-4" />
                                          <span className="text-sm font-medium">{documentName}</span>
                                          {hasUrl ? (
                                            <Badge variant="default" className="bg-green-500 text-white hover:bg-green-600">
                                              <CheckCircle className="w-3 h-3 mr-1" />
                                              Enviado
                                            </Badge>
                                          ) : (
                                            <Badge variant="destructive" className="bg-red-500 text-white hover:bg-red-600">
                                              <Clock className="w-3 h-3 mr-1" />
                                              Pendente
                                            </Badge>
                                          )}
                                        </div>

                                        {/* Preview da imagem se for documento enviado */}
                                        {hasUrl && (
                                          <div className="relative group w-full sm:w-20 h-16 bg-slate-100 rounded overflow-hidden">
                                            <img
                                              src={doc.url}
                                              alt={documentName}
                                              className="w-full h-full object-cover"
                                              onError={(e) => {
                                                // Se não conseguir carregar como imagem, mostrar ícone de arquivo
                                                const target = e.target as HTMLImageElement
                                                target.style.display = 'none'
                                                const parent = target.parentElement!
                                                const fileIcon = document.createElement('div')
                                                fileIcon.className = 'w-full h-full flex items-center justify-center'
                                                fileIcon.innerHTML = '<svg class="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>'
                                                parent.appendChild(fileIcon)
                                              }}
                                            />
                                            <button
                                              onClick={() => window.open(doc.url, '_blank')}
                                              className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                                            >
                                              <Eye className="w-4 h-4 text-white" />
                                            </button>
                                          </div>
                                        )}

                                        <div className="flex items-center gap-2">
                                          {hasUrl && (
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              onClick={() => window.open(doc.url, '_blank')}
                                            >
                                              <Eye className="w-3 h-3 mr-1" />
                                              Ver
                                            </Button>
                                          )}
                                          <div>
                                            <Input
                                              type="file"
                                              accept="image/jpeg,image/jpg,image/png,image/webp,application/pdf"
                                              onChange={(e) => {
                                                const file = e.target.files?.[0]
                                                if (file) {
                                                  handleDocumentUpload(selectedOrderDetails.id, itemId, documentName, file)
                                                }
                                                e.target.value = ""
                                              }}
                                              className="hidden"
                                              id={`upload-${uploadKey}`}
                                              disabled={isUploading}
                                            />
                                            <Button
                                              variant={hasUrl ? "outline" : "default"}
                                              size="sm"
                                              onClick={() => document.getElementById(`upload-${uploadKey}`)?.click()}
                                              disabled={isUploading}
                                              className={hasUrl ? "border-blue-500 text-blue-600 hover:bg-blue-50" : "bg-blue-500 hover:bg-blue-600 text-white"}
                                            >
                                              {isUploading ? (
                                                <div className="w-4 h-4 animate-spin border-2 border-current border-t-transparent rounded-full mr-1" />
                                              ) : (
                                                <Upload className="w-3 h-3 mr-1" />
                                              )}
                                              {isUploading ? 'Enviando...' : hasUrl ? 'Reenviar' : 'Enviar'}
                                            </Button>
                                          </div>
                                        </div>
                                      </div>
                                    )
                                  })}
                                </div>
                                <p className="text-xs text-slate-500 mt-2">
                                  Formatos aceitos: JPG, PNG, WebP, PDF (máx. 5MB)
                                </p>
                              </div>
                            ) : (
                              <div className="text-center py-4 text-muted-foreground">
                                <FileText className="w-8 h-8 mx-auto mb-2" />
                                <p>Nenhum documento necessário para este item</p>
                              </div>
                            )}
                          </div>
                        )
                      })
                    })()}
                  </div>
                </CardContent>
              </Card>

              {/* Informações de Entrega */}
              {(selectedOrderDetails as any).customerInfo && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Informações de Entrega
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Nome</p>
                        <p>{(selectedOrderDetails as any).customerInfo.name}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Email</p>
                        <p>{(selectedOrderDetails as any).customerInfo.email}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Telefone</p>
                        <p>{(selectedOrderDetails as any).customerInfo.phone || "Não informado"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Endereço</p>
                        <p>{(selectedOrderDetails as any).customerInfo.address || "Não informado"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowOrderDetailsModal(false)}>
              <X className="w-4 h-4 mr-2" />
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmação de exclusão */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza de que deseja excluir este item? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                if (deletingItem?.type === 'address') {
                  handleDeleteAddress(deletingItem.id)
                } else if (deletingItem?.type === 'payment') {
                  handleDeletePaymentMethod(deletingItem.id)
                }
                setShowDeleteDialog(false)
                setDeletingItem(null)
              }}
            >
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de edição de endereço */}
      {editingAddress && (
        <Dialog open={!!editingAddress} onOpenChange={() => setEditingAddress(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Editar Endereço</DialogTitle>
              <DialogDescription>
                Atualize as informações do endereço
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="editLabel">Nome do Endereço</Label>
                <Input
                  id="editLabel"
                  value={editingAddress.label}
                  onChange={(e) => setEditingAddress({...editingAddress, label: e.target.value})}
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="editName">Nome do Destinatário</Label>
                <Input
                  id="editName"
                  value={editingAddress.name}
                  onChange={(e) => setEditingAddress({...editingAddress, name: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="editZip">CEP</Label>
                <Input
                  id="editZip"
                  value={editingAddress.zipCode}
                  onChange={(e) => setEditingAddress({...editingAddress, zipCode: formatCEP(e.target.value)})}
                  maxLength={9}
                />
              </div>

              <div>
                <Label htmlFor="editStreet">Rua</Label>
                <Input
                  id="editStreet"
                  value={editingAddress.street}
                  onChange={(e) => setEditingAddress({...editingAddress, street: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="editNumber">Número</Label>
                <Input
                  id="editNumber"
                  value={editingAddress.number}
                  onChange={(e) => setEditingAddress({...editingAddress, number: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="editComplement">Complemento</Label>
                <Input
                  id="editComplement"
                  value={editingAddress.complement || ''}
                  onChange={(e) => setEditingAddress({...editingAddress, complement: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="editNeighborhood">Bairro</Label>
                <Input
                  id="editNeighborhood"
                  value={editingAddress.neighborhood}
                  onChange={(e) => setEditingAddress({...editingAddress, neighborhood: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="editCity">Cidade</Label>
                <Input
                  id="editCity"
                  value={editingAddress.city}
                  onChange={(e) => setEditingAddress({...editingAddress, city: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="editState">Estado</Label>
                <Select 
                  value={editingAddress.state} 
                  onValueChange={(value) => setEditingAddress({...editingAddress, state: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SP">São Paulo</SelectItem>
                    <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                    <SelectItem value="MG">Minas Gerais</SelectItem>
                    <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                    <SelectItem value="PR">Paraná</SelectItem>
                    <SelectItem value="SC">Santa Catarina</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2 flex items-center space-x-2">
                <Switch
                  id="editIsDefault"
                  checked={editingAddress.isDefault}
                  onCheckedChange={(checked) => setEditingAddress({...editingAddress, isDefault: checked})}
                />
                <Label htmlFor="editIsDefault">Definir como endereço padrão</Label>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingAddress(null)}>
                Cancelar
              </Button>
              <Button onClick={handleUpdateAddress}>
                <Save className="w-4 h-4 mr-2" />
                Salvar Alterações
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
