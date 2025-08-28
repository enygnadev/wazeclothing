"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Store, MessageCircle, Shield, Bell } from "lucide-react"
import { getSettings, updateSettings } from "@/lib/firebase/settings"

interface StoreSettings {
  storeName: string
  storeDescription: string
  storeEmail: string
  storePhone: string
  whatsappNumber: string
  storeAddress: string
  pixKey: string
  bankInfo: string
  shippingFee: number
  freeShippingMinValue: number
  maintenanceMode: boolean
  allowRegistrations: boolean
  emailNotifications: boolean
  whatsappNotifications: boolean
}

export function SettingsManager() {
  const [settings, setSettings] = useState<StoreSettings>({
    storeName: "Waze Clothing",
    storeDescription: "Sua loja de roupas favorita",
    storeEmail: "contato@wazeclothing.com",
    storePhone: "(11) 99999-9999",
    whatsappNumber: "5511999999999",
    storeAddress: "Rua das Flores, 123 - São Paulo, SP",
    pixKey: "contato@wazeclothing.com",
    bankInfo: "Banco do Brasil - Ag: 1234 - CC: 12345-6",
    shippingFee: 15.90,
    freeShippingMinValue: 199.90,
    maintenanceMode: false,
    allowRegistrations: true,
    emailNotifications: true,
    whatsappNotifications: true,
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const settingsData = await getSettings()
      if (settingsData) {
        setSettings({ ...settings, ...settingsData })
      }
    } catch (error) {
      console.error("Erro ao carregar configurações:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateSettings(settings)
      alert("Configurações salvas com sucesso!")
    } catch (error) {
      console.error("Erro ao salvar configurações:", error)
      alert("Erro ao salvar configurações")
    } finally {
      setSaving(false)
    }
  }

  const updateSetting = (key: keyof StoreSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  if (loading) {
    return <div>Carregando configurações...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Configurações da Loja</h2>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Salvando..." : "Salvar Configurações"}
        </Button>
      </div>

      <Tabs defaultValue="store" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="store" className="flex items-center gap-2">
            <Store className="w-4 h-4" />
            Loja
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Pagamentos
          </TabsTrigger>
          <TabsTrigger value="shipping" className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            Entrega
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Notificações
          </TabsTrigger>
        </TabsList>

        <TabsContent value="store" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações da Loja</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="storeName">Nome da Loja</Label>
                <Input
                  id="storeName"
                  value={settings.storeName}
                  onChange={(e) => updateSetting("storeName", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="storeDescription">Descrição</Label>
                <Textarea
                  id="storeDescription"
                  value={settings.storeDescription}
                  onChange={(e) => updateSetting("storeDescription", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="storeEmail">E-mail de Contato</Label>
                  <Input
                    id="storeEmail"
                    type="email"
                    value={settings.storeEmail}
                    onChange={(e) => updateSetting("storeEmail", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="storePhone">Telefone</Label>
                  <Input
                    id="storePhone"
                    value={settings.storePhone}
                    onChange={(e) => updateSetting("storePhone", e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="storeAddress">Endereço</Label>
                <Textarea
                  id="storeAddress"
                  value={settings.storeAddress}
                  onChange={(e) => updateSetting("storeAddress", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Pagamento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="pixKey">Chave PIX</Label>
                <Input
                  id="pixKey"
                  value={settings.pixKey}
                  onChange={(e) => updateSetting("pixKey", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="bankInfo">Dados Bancários</Label>
                <Textarea
                  id="bankInfo"
                  value={settings.bankInfo}
                  onChange={(e) => updateSetting("bankInfo", e.target.value)}
                  placeholder="Banco, Agência, Conta"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shipping" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Entrega</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="shippingFee">Taxa de Entrega (R$)</Label>
                  <Input
                    id="shippingFee"
                    type="number"
                    step="0.01"
                    value={settings.shippingFee}
                    onChange={(e) => updateSetting("shippingFee", parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="freeShippingMinValue">Valor Mínimo para Frete Grátis (R$)</Label>
                  <Input
                    id="freeShippingMinValue"
                    type="number"
                    step="0.01"
                    value={settings.freeShippingMinValue}
                    onChange={(e) => updateSetting("freeShippingMinValue", parseFloat(e.target.value))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="whatsappNumber">WhatsApp para Pedidos</Label>
                <Input
                  id="whatsappNumber"
                  value={settings.whatsappNumber}
                  onChange={(e) => updateSetting("whatsappNumber", e.target.value)}
                  placeholder="5511999999999"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações do Sistema</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="maintenanceMode">Modo Manutenção</Label>
                  <p className="text-sm text-muted-foreground">
                    Desabilita o acesso público à loja
                  </p>
                </div>
                <Switch
                  id="maintenanceMode"
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) => updateSetting("maintenanceMode", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="allowRegistrations">Permitir Cadastros</Label>
                  <p className="text-sm text-muted-foreground">
                    Permite que novos usuários se cadastrem
                  </p>
                </div>
                <Switch
                  id="allowRegistrations"
                  checked={settings.allowRegistrations}
                  onCheckedChange={(checked) => updateSetting("allowRegistrations", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="emailNotifications">Notificações por E-mail</Label>
                  <p className="text-sm text-muted-foreground">
                    Receba notificações de novos pedidos por e-mail
                  </p>
                </div>
                <Switch
                  id="emailNotifications"
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => updateSetting("emailNotifications", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="whatsappNotifications">Notificações no WhatsApp</Label>
                  <p className="text-sm text-muted-foreground">
                    Receba notificações de novos pedidos no WhatsApp
                  </p>
                </div>
                <Switch
                  id="whatsappNotifications"
                  checked={settings.whatsappNotifications}
                  onCheckedChange={(checked) => updateSetting("whatsappNotifications", checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}