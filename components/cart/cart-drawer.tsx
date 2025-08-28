"use client"

import { ReactNode } from "react"
import { Cart } from "./cart"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

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