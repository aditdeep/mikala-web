import * as React from "react"
import { cn } from "../utils"

export interface SidebarProps {
  children: React.ReactNode
  className?: string
  collapsed?: boolean
}

const Sidebar = ({ children, className, collapsed }: SidebarProps) => {
  return (
    <aside
      className={cn(
        "bg-gray-900 text-white transition-all duration-300",
        collapsed ? "w-16" : "w-64",
        className
      )}
    >
      {children}
    </aside>
  )
}

export interface SidebarItemProps {
  icon?: React.ReactNode
  label: string
  active?: boolean
  onClick?: () => void
  collapsed?: boolean
}

const SidebarItem = ({ icon, label, active, onClick, collapsed }: SidebarItemProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-800 transition-colors",
        active && "bg-gray-800 border-l-4 border-blue-500",
        collapsed && "justify-center"
      )}
    >
      {icon && <span className="text-lg">{icon}</span>}
      {!collapsed && <span>{label}</span>}
    </button>
  )
}

const SidebarSection = ({ title, children, collapsed }: { title?: string; children: React.ReactNode; collapsed?: boolean }) => {
  return (
    <div className="py-2">
      {title && !collapsed && (
        <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase">
          {title}
        </div>
      )}
      {children}
    </div>
  )
}

export { Sidebar, SidebarItem, SidebarSection }
