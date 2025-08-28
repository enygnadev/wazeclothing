import { type NextRequest, NextResponse } from "next/server"
import { deleteProduct, updateProduct, getProduct } from "@/lib/firebase/products"

// 🔍 GET único produto (opcional)
export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const product = await getProduct(params.id)
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
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await request.json()

    await updateProduct(params.id, {
      name: data.name, // Changed from title to name
      description: data.description,
      price: parseFloat(data.price),
      image: data.image,
      category: data.category,
      features: Array.isArray(data.features) ? data.features : [],
      featured: data.featured,
      size: data.size,
      isSmart: data.isSmart,
    })

    return NextResponse.json({ message: "Produto atualizado com sucesso" }, { status: 200 })
  } catch (error) {
    console.error("Erro ao atualizar produto:", error)
    return NextResponse.json({ error: "Falha ao atualizar produto" }, { status: 500 })
  }
}

// 🗑 DELETE para excluir
export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    await deleteProduct(params.id)
    return NextResponse.json({ message: "Produto excluído com sucesso" }, { status: 200 })
  } catch (error) {
    console.error("Erro ao deletar produto:", error)
    return NextResponse.json({ error: "Falha ao deletar produto" }, { status: 500 })
  }
}