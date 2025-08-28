
import { OpenAIStream, StreamingTextResponse } from 'ai'
import OpenAI from 'openai'
import { type NextRequest } from 'next/server'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `Você é um assistente especializado em roupas e moda da loja Waze Clothing. 
          Ajude os clientes com informações sobre produtos, estilos, tamanhos e tendências de moda.
          Seja amigável, prestativo e sempre focado em moda e vestuário.`
        },
        ...messages
      ],
      stream: true,
      temperature: 0.7,
    })

    const stream = OpenAIStream(response)
    return new StreamingTextResponse(stream)
  } catch (error) {
    console.error('Chat error:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
