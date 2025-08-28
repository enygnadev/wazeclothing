"use client"

import { ReactNode } from "react"

interface CartDrawerProps {
  children: ReactNode
}

export function CartDrawer({ children }: CartDrawerProps) {
  return <>{children}</>
}
        )}

        <div className="p-4 border-t">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold">Total: R$ {total.toFixed(2)}</span>
          </div>
          <Button
            className="w-full"
            size="lg"
            onClick={() => window.location.href = "/checkout"}
          >
            Finalizar Compra
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}