import * as React from "react"
import { cn } from "../utils"

export interface AlertProps {
  variant?: "default" | "success" | "warning" | "error" | "info"
  title?: string
  children: React.ReactNode
  className?: string
}

const Alert = ({ variant = "default", title, children, className }: AlertProps) => {
  const variantClasses = {
    default: "bg-gray-100 text-gray-800 border-gray-300",
    success: "bg-green-100 text-green-800 border-green-300",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-300",
    error: "bg-red-100 text-red-800 border-red-300",
    info: "bg-blue-100 text-blue-800 border-blue-300",
  }

  return (
    <div
      className={cn(
        "rounded-lg border p-4",
        variantClasses[variant],
        className
      )}
    >
      {title && <div className="font-semibold mb-1">{title}</div>}
      <div className="text-sm">{children}</div>
    </div>
  )
}

export { Alert }
