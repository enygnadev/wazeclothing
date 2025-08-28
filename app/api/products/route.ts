import { type NextRequest, NextResponse } from "next/server"
import { getProducts, addProduct } from "@/lib/firebase/products"

// 📋 GET todos os produtos
export async function GET(request: NextRequest) {
  try {
    console.log("🚀 API: Iniciando busca de produtos...")

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')

    console.log("🔍 API: Filtros recebidos:", { category, featured })

    const products = await getProducts()
    console.log("✅ API: Produtos encontrados:", products.length)

    // Filtrar por categoria se especificada
    let filteredProducts = products
    if (category && category !== 'all') {
      filteredProducts = products.filter(product => 
        product.category.toLowerCase() === category.toLowerCase()
      )
    }

    // Filtrar por destaque se especificado
    if (featured === 'true') {
      filteredProducts = filteredProducts.filter(product => product.featured)
    }

    console.log("🎯 API: Produtos filtrados:", filteredProducts.length)

    return NextResponse.json(filteredProducts, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    })
  } catch (error) {
    console.error("❌ API: Erro ao buscar produtos:", error)

    const errorMessage = error instanceof Error ? error.message : 'Erro interno do servidor'
    const stack = error instanceof Error ? error.stack : undefined

    console.error("❌ API: Stack trace:", stack)

    return NextResponse.json(
      {
        error: errorMessage,
        message: "Falha ao carregar produtos"
      },
      { status: 500 }
    )
  }
}

// ➕ POST para adicionar novo produto
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const productId = await addProduct(data)

    return NextResponse.json(
      { id: productId, message: "Produto criado com sucesso" },
      { status: 201 }
    )
  } catch (error) {
    console.error("Erro ao criar produto:", error)
    const errorMessage = error instanceof Error ? error.message : 'Erro interno do servidor'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}