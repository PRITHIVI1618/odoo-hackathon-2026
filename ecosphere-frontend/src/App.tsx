import { Routes, Route, Navigate } from "react-router-dom"
import { AuthLayout } from "./layouts/AuthLayout"
import { DashboardLayout } from "./layouts/DashboardLayout"
import { Login } from "./pages/Login"
import { Dashboard } from "./pages/Dashboard"
import { Environmental } from "./pages/Environmental"
import { Social } from "./pages/Social"
import { Governance } from "./pages/Governance"
import { Gamification } from "./pages/Gamification"
import { AiInsights } from "./pages/AiInsights"
import { Reports } from "./pages/Reports"
import { Settings } from "./pages/Settings"
import { Profile } from "./pages/Profile"
import { Notifications } from "./pages/Notifications"
import { Toaster } from "sonner"

function App() {
  return (
    <>
      <Routes>
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<div>Register</div>} />
        </Route>

        {/* Protected Dashboard Routes */}
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/environmental" element={<Environmental />} />
          <Route path="/social" element={<Social />} />
          <Route path="/governance" element={<Governance />} />
          <Route path="/gamification" element={<Gamification />} />
          <Route path="/ai-insights" element={<AiInsights />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/notifications" element={<Notifications />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster position="top-right" theme="system" />
    </>
  )
}

export default App
