
import { type NextRequest, NextResponse } from "next/server"
import { deleteProduct, updateProduct, getProduct } from "@/lib/firebase/products"

// 🔍 GET único produto (opcional)
export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const product = await getProduct(id)
    if (!product) {
      return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 })
    }
    return NextResponse.json(product)
  } catch (error) {
    console.error("Erro ao buscar produto:", error)
    return NextResponse.json({ error: "Erro ao buscar produto" }, { status: 500 })
  }
}

// ✏️ PUT para atualizar
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const data = await request.json()

    console.log("📝 API: Atualizando produto:", id, data.title)

    // Filtrar valores undefined antes de enviar ao Firestore
    const updateData: any = {
      title: data.title || data.name,
      description: data.description,
      price: parseFloat(data.price),
      category: data.category,
      features: Array.isArray(data.features) ? data.features : [],
      featured: Boolean(data.featured),
      isSmart: Boolean(data.isSmart),
      updatedAt: new Date(),
    }

    // Só incluir campos opcionais se não forem undefined
    if (data.image !== undefined) updateData.image = data.image
    if (data.sizes !== undefined && data.sizes !== null) updateData.sizes = data.sizes
    if (data.size !== undefined) updateData.size = data.size

    const success = await updateProduct(id, updateData)

    if (!success) {
      throw new Error("Falha ao atualizar produto no Firebase")
    }

    console.log("✅ API: Produto atualizado com sucesso:", id)

    return NextResponse.json({ 
      message: "Produto atualizado com sucesso",
      success: true 
    }, { status: 200 })
  } catch (error) {
    console.error("❌ API: Erro ao atualizar produto:", error)
    return NextResponse.json({ 
      error: "Falha ao atualizar produto",
      success: false 
    }, { status: 500 })
  }
}

// 🗑 DELETE para excluir
export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    console.log("🗑️ API: Excluindo produto:", id)
    
    const success = await deleteProduct(id)
    
    if (!success) {
      throw new Error("Falha ao excluir produto no Firebase")
    }

    console.log("✅ API: Produto excluído com sucesso:", id)
    
    return NextResponse.json({ 
      message: "Produto excluído com sucesso",
      success: true 
    }, { status: 200 })
  } catch (error) {
    console.error("❌ API: Erro ao deletar produto:", error)
    return NextResponse.json({ 
      error: "Falha ao deletar produto",
      success: false 
    }, { status: 500 })
  }
}
