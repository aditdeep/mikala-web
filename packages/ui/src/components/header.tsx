import * as React from "react"
import { cn } from "../utils"

export interface HeaderProps {
  children: React.ReactNode
  className?: string
}

const Header = ({ children, className }: HeaderProps) => {
  return (
    <header
      className={cn(
        "bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between",
        className
      )}
    >
      {children}
    </header>
  )
}

export { Header }
