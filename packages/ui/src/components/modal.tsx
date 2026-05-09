import * as React from "react"
import { cn } from "../utils"

export interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  className?: string
}

const Modal = ({ open, onClose, title, children, className }: ModalProps) => {
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    if (open) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }
    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "unset"
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/50"
        onClick={onClose}
      />
      <div
        className={cn(
          "relative z-50 bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-auto",
          className
        )}
      >
        {title && (
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold">{title}</h2>
          </div>
        )}
        <div className="px-6 py-4">{children}</div>
      </div>
    </div>
  )
}

const ModalFooter = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={cn("flex justify-end gap-2 px-6 py-4 border-t", className)}>
      {children}
    </div>
  )
}

export { Modal, ModalFooter }
