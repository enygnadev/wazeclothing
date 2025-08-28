import { openai } from '@ai-sdk/openai'
import { streamText } from 'ai'
import { type NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    const result = await streamText({
      model: openai('gpt-3.5-turbo'),
      messages,
      system: `Você é um assistente especializado em roupas e moda da loja Waze Clothing. 
      Ajude os clientes com informações sobre produtos, estilos, tamanhos e tendências de moda.
      Seja amigável, prestativo e sempre focado em moda e vestuário.`,
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error('Chat error:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}