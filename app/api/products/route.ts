
import { NextRequest, NextResponse } from "next/server"
import { getProducts, getProductsByCategory } from "@/lib/firebase/products"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    
    let products
    if (category && category !== 'all') {
      products = await getProductsByCategory(category)
    } else {
      products = await getProducts()
    }
    
    return NextResponse.json(products)
  } catch (error) {
    console.error("Error in products API:", error)
    return NextResponse.json(
      { error: "Erro ao carregar produtos" },
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
