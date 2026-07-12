import { NavLink } from "react-router-dom"
import {
  LayoutDashboard,
  TreePine,
  Users,
  ShieldCheck,
  Trophy,
  Sparkles,
  FileText,
  Settings,
  Bell,
  User,
  LogOut,
  Leaf
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuthStore } from "@/store/useAuthStore"

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Environmental", href: "/environmental", icon: TreePine },
  { name: "Social", href: "/social", icon: Users },
  { name: "Governance", href: "/governance", icon: ShieldCheck },
  { name: "Gamification", href: "/gamification", icon: Trophy },
  { name: "AI Insights", href: "/ai-insights", icon: Sparkles },
  { name: "Reports", href: "/reports", icon: FileText },
  { name: "Notifications", href: "/notifications", icon: Bell },
  { name: "Profile", href: "/profile", icon: User },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function Sidebar() {
  const logout = useAuthStore((state) => state.logout)

  return (
    <div className="flex h-full w-64 flex-col border-r bg-card shadow-sm">
      <div className="flex items-center gap-2 px-6 py-6 border-b border-border/50">
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
          <Leaf className="h-5 w-5 text-primary" />
        </div>
        <span className="text-xl font-bold tracking-tight">EcoSphere AI</span>
      </div>
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary/10 text-primary shadow-sm"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )
            }
          >
            <item.icon className="h-4 w-4" />
            {item.name}
          </NavLink>
        ))}
      </div>
      <div className="p-4 border-t border-border/50">
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </div>
  )
}
