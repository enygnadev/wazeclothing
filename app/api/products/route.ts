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
    console.log("📥 API: Dados recebidos para criar produto:", product)

    // Validação com os campos corretos que vêm do formulário
    if (!product.title || !product.price) {
      console.error("❌ API: Validação falhou - título ou preço ausente")
      return NextResponse.json(
        { error: "Título e preço são obrigatórios" },
        { status: 400 }
      )
    }

    // Importar a função de criação de produto
    const { createProduct } = await import("@/lib/firebase/products")
    
    // Criar o produto no Firestore
    const productData = {
      title: product.title,
      description: product.description || "",
      price: product.price,
      image: product.image || "",
      category: product.category || "",
      features: product.features || [],
      featured: product.featured || false,
      size: product.size || "",
      isSmart: product.isSmart || false,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    console.log("💾 API: Criando produto:", productData)
    const productId = await createProduct(productData)

    if (productId) {
      console.log("✅ API: Produto criado com ID:", productId)
      return NextResponse.json({ 
        success: true, 
        id: productId,
        message: "Produto criado com sucesso!"
      })
    } else {
      console.error("❌ API: Falha ao criar produto no Firestore")
      return NextResponse.json(
        { error: "Erro ao salvar produto no banco de dados" },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("❌ API: Erro ao criar produto:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}