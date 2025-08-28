
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

    await updateProduct(id, {
      title: data.title || data.name,
      description: data.description,
      price: parseFloat(data.price),
      image: data.image,
      category: data.category,
      features: Array.isArray(data.features) ? data.features : [],
      featured: data.featured,
      sizes: data.sizes,
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
export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await deleteProduct(id)
    return NextResponse.json({ message: "Produto excluído com sucesso" }, { status: 200 })
  } catch (error) {
    console.error("Erro ao deletar produto:", error)
    return NextResponse.json({ error: "Falha ao deletar produto" }, { status: 500 })
  }
}
