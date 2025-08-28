import { type NextRequest, NextResponse } from "next/server"
import { OpenAIStream, StreamingTextResponse } from "ai"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json()

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      stream: true,
      messages: [
        {
          role: "system",
          content: `Você é um especialista em moda urbana da Waze Clothing, uma loja premium de roupas masculinas.

Ajude os clientes com:
- Recomendações de roupas e combinações de estilo
- Sugestões de tamanhos ideais e caimento
- Informações sobre marcas como Nike, Adidas, Lacoste, Jordan, Puma e peças premium
- Comparações entre produtos e tendências
- Dicas de looks para diferentes ocasiões (casual, streetwear, treino, festa)

Seja sempre estiloso, direto, prestativo e focado em moda masculina urbana e contemporânea.`,
        },
        ...messages,
      ],
    })

    const stream = OpenAIStream(response)
    return new StreamingTextResponse(stream)
  } catch (error) {
    console.error("Error in chat API:", error)
    return NextResponse.json({ error: "Failed to process chat message" }, { status: 500 })
  }
}
