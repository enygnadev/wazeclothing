import { type NextRequest, NextResponse } from "next/server"
import { getProducts, addProduct } from "@/lib/firebase/products"

// 📋 GET todos os produtos
export async function GET(request: NextRequest) {
  try {
    console.log("🔄 API: Iniciando busca de produtos...")

    const products = await getProducts()

    console.log(`✅ API: ${products.length} produtos encontrados`)
    console.log("📋 API: Produtos encontrados:", products.map(p => `${p.id}: ${p.title}`).slice(0, 5))

    return NextResponse.json({
      success: true,
      data: products,
      total: products.length
    })
  } catch (error) {
    console.error("❌ API: Erro ao buscar produtos:", error)
    console.error("🔍 API: Stack trace:", error)

    return NextResponse.json(
      { 
        success: false, 
        error: "Erro interno do servidor",
        message: error instanceof Error ? error.message : "Erro desconhecido",
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}

// ➕ POST para adicionar novo produto
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    console.log("📝 API: Criando produto:", data.title)
    
    // Filtrar campos undefined antes de criar produto
    const productData: any = {
      title: data.title,
      description: data.description,
      price: parseFloat(data.price),
      category: data.category,
      features: Array.isArray(data.features) ? data.features : [],
      featured: Boolean(data.featured),
      isSmart: Boolean(data.isSmart),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // Só incluir campos opcionais se não forem undefined
    if (data.image !== undefined) productData.image = data.image
    if (data.sizes !== undefined && data.sizes !== null) productData.sizes = data.sizes
    if (data.size !== undefined) productData.size = data.size

    const productId = await addProduct(productData)

    if (!productId) {
      throw new Error("Falha ao criar produto no Firebase")
    }

    console.log("✅ API: Produto criado com ID:", productId)

    return NextResponse.json(
      { 
        id: productId, 
        message: "Produto criado com sucesso",
        success: true 
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("❌ API: Erro ao criar produto:", error)
    const errorMessage = error instanceof Error ? error.message : 'Erro interno do servidor'
    return NextResponse.json(
      { 
        error: errorMessage, 
        success: false 
      }, 
      { status: 500 }
    )
  }
}