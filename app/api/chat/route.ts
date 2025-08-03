import { type NextRequest, NextResponse } from "next/server"
import { streamText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    const result = await streamText({
      model: openai("gpt-3.5-turbo"),
      system: `Você é um especialista em iluminação da Waze Clothing, uma loja premium de iluminação inteligente.
Ajude os clientes com:
- Recomendações de produtos de iluminação
- Dicas de instalação e uso
- Informações sobre iluminação inteligente e smart home
- Comparações entre produtos
- Soluções para diferentes ambientes (sala, quarto, cozinha, área externa)
Seja sempre técnico, prestativo e focado em iluminação moderna e sustentável.`,
      prompt: message,
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Error in chat API:", error)
    return NextResponse.json({ error: "Failed to process chat message" }, { status: 500 })
  }
}
