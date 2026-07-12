import { Outlet, Navigate } from "react-router-dom"
import { Sidebar } from "@/components/shared/Sidebar"
import { TopNav } from "@/components/shared/TopNav"
import { useAuthStore } from "@/store/useAuthStore"

export function DashboardLayout() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopNav />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
