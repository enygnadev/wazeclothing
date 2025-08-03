import { type NextRequest, NextResponse } from "next/server"
import { streamText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    const result = await streamText({
      model: openai("gpt-3.5-turbo"),
      system: `Você é um especialista em moda urbana da Waze Clothing, uma loja premium de roupas masculinas.

Ajude os clientes com:
- Recomendações de roupas e combinações de estilo
- Sugestões de tamanhos ideais e caimento
- Informações sobre marcas como Nike, Adidas, Lacoste, Jordan, Puma e peças premium
- Comparações entre produtos e tendências
- Dicas de looks para diferentes ocasiões (casual, streetwear, treino, festa)

Seja sempre estiloso, direto, prestativo e focado em moda masculina urbana e contemporânea.
`,
      prompt: message,
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Error in chat API:", error)
    return NextResponse.json({ error: "Failed to process chat message" }, { status: 500 })
  }
}
