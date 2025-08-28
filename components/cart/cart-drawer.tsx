"use client"

import { ReactNode, useState } from "react"
import { ShoppingCart, X, Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useCart } from "@/components/providers/cart-provider"
import Image from "next/image"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Cart } from "./cart"

interface CartDrawerProps {
  children: ReactNode
}

export function CartDrawer({ children }: CartDrawerProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent side="right" className="w-[400px] sm:w-[540px]">
        <Cart />
      </SheetContent>
    </Sheet>
  )
}