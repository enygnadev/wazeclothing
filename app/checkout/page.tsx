
import { Header } from "@/components/layout/header"
import { Checkout } from "@/components/cart/checkout"

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Finalizar Compra</h1>
        <Checkout />
      </main>
    </div>
  )
}
