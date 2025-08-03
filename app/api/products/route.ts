import { type NextRequest, NextResponse } from "next/server"
import { getProducts, createProduct } from "@/lib/firebase/products"

// 📦 GET — Buscar produtos (com suporte a busca ?search=)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""

    const products = await getProducts(search)

    return NextResponse.json(products, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    })
  } catch (error) {
    console.error("❌ Erro ao buscar produtos:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch products",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

// ➕ POST — Criar novo produto
export async function POST(request: NextRequest) {
  try {
    // 🔒 Proteção futura (reabilite quando quiser limitar a admins)
    // const authHeader = request.headers.get("authorization")
    // if (!authHeader?.startsWith("Bearer ")) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    // }

    const body = await request.json()

    // 🧪 Validação simples
    if (
      !body.title ||
      !body.price ||
      isNaN(Number(body.price.toString().replace(",", ".")))
    ) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 })
    }

    const newProduct = await createProduct({
      title: body.title,
      description: body.description || "",
      price: parseFloat(body.price.toString().replace(",", ".")),
      image: body.image || "",
      category: body.category || "sem-categoria",
      features: Array.isArray(body.features) ? body.features : [],
      featured: body.featured === true,
      size: body.size || "Único",
      isSmart: body.isSmart === true,
    })

    return NextResponse.json(newProduct, { status: 201 })
  } catch (error) {
    console.error("❌ Erro ao criar produto:", error)
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    )
  }
}
