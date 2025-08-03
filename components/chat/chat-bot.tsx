"use client"

import { useState } from "react"
import { X, Send, Lightbulb } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useChat } from "ai/react"

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/chat",
  })

  return (
    <>
      {/* Chat Toggle Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 h-12 w-12 rounded-full shadow-lg z-50 bg-black-500 hover:bg-black-600"
        size="icon"
      >
        <Lightbulb className="h-6 w-6" />
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-20 right-4 w-80 h-96 shadow-xl z-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-black-50 dark:bg-black-950">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-black-600" />
              Assistente Waze Clothing
            </CardTitle>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>

          <CardContent className="flex flex-col h-full p-0">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.length === 0 && (
                  <div className="text-sm text-muted-foreground">
                    💡 Olá! Sou o assistente da Waze Clothing. Como posso ajudá-lo com iluminação inteligente hoje?
                  </div>
                )}

                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                        message.role === "user" ? "bg-black-500 text-white" : "bg-muted"
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-lg px-3 py-2 text-sm flex items-center gap-2">
                      <Lightbulb className="h-3 w-3 animate-pulse text-black-500" />
                      Pensando...
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <form onSubmit={handleSubmit} className="flex gap-2 p-4 border-t">
              <Input
                value={input}
                onChange={handleInputChange}
                placeholder="Pergunte sobre iluminação..."
                disabled={isLoading}
              />
              <Button type="submit" size="icon" disabled={isLoading} className="bg-black-500 hover:bg-black-600">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </>
  )
}
