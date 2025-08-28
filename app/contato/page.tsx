
"use client"

import { Header } from "@/components/layout/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react"

export default function ContatoPage() {
  const handleWhatsApp = () => {
    const phone = "5511999999999" // Substitua pelo número real
    const message = "Olá! Gostaria de saber mais sobre os produtos da Waze Clothing."
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank')
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 pt-24">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Contato</h1>
          <p className="text-muted-foreground">
            Entre em contato conosco. Estamos aqui para ajudar!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Informações de Contato */}
          <Card>
            <CardHeader>
              <CardTitle>Informações de Contato</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold">Telefone</p>
                  <p className="text-muted-foreground">(11) 99999-9999</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold">E-mail</p>
                  <p className="text-muted-foreground">contato@wazeclothing.com</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold">Endereço</p>
                  <p className="text-muted-foreground">São Paulo, SP</p>
                </div>
              </div>

              <Button 
                onClick={handleWhatsApp}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Falar no WhatsApp
              </Button>
            </CardContent>
          </Card>

          {/* Formulário de Contato */}
          <Card>
            <CardHeader>
              <CardTitle>Envie uma Mensagem</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <Input placeholder="Seu nome" />
                <Input type="email" placeholder="Seu e-mail" />
                <Input placeholder="Assunto" />
                <Textarea 
                  placeholder="Sua mensagem"
                  className="min-h-[120px]"
                />
                <Button type="submit" className="w-full">
                  Enviar Mensagem
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
