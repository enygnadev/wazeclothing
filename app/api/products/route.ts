import { NextRequest, NextResponse } from "next/server"
import { getProducts, getProductsByCategory } from "@/lib/firebase/products"

export async function GET() {
  try {
    console.log("🔍 API: Buscando produtos...")

    const products = await getProducts()

    console.log("📦 API: Produtos encontrados:", products.length)

    return NextResponse.json({
      success: true,
      data: products,
      count: products.length
    })
  } catch (error) {
    console.error("❌ API: Erro ao buscar produtos:", error)

    return NextResponse.json(
      { 
        success: false, 
        error: error.message || "Erro interno do servidor",
        details: error
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