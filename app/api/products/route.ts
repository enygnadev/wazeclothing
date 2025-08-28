import { NextRequest, NextResponse } from "next/server"
import { getProducts, getProductsByCategory } from "@/lib/firebase/products"

export async function GET() {
  try {
    console.log("🔍 API: Iniciando busca de produtos...")
    
    // Verificar se Firebase está configurado
    if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
      console.error("❌ API: Firebase não configurado")
      return NextResponse.json(
        { 
          success: false, 
          error: "Firebase não configurado",
          data: []
        },
        { status: 500 }
      )
    }

    console.log("🔥 API: Firebase configurado, buscando produtos...")
    const products = await getProducts()

    console.log("📦 API: Produtos encontrados:", products.length)

    return NextResponse.json(
      {
        success: true,
        data: products || [],
        count: products?.length || 0
      },
      { 
        status: 200,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      }
    )
  } catch (error) {
    console.error("❌ API: Erro ao buscar produtos:", error)
    console.error("❌ API: Stack trace:", error.stack)

    return NextResponse.json(
      { 
        success: false, 
        error: error?.message || "Erro interno do servidor",
        data: [],
        count: 0,
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const product = await request.json()

    // Aqui você pode adicionar validação
    if (!product.name || !product.price) {
      return NextResponse.json(
        { error: "Nome e preço são obrigatórios" },
        { status: 400 }
      )
    }

    // Por enquanto, retorna sucesso
    // Em produção, você adicionaria o produto ao Firestore
    return NextResponse.json({ success: true, id: Date.now().toString() })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json(
      { error: "Erro ao criar produto" },
      { status: 500 }
    )
  }
}