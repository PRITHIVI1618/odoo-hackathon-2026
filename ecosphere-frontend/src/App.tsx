import { Routes, Route, Navigate } from "react-router-dom"
import { AuthLayout } from "./layouts/AuthLayout"
import { DashboardLayout } from "./layouts/DashboardLayout"
import { Login } from "./pages/Login"
import { Register } from "./pages/Register"
import { ForgotPassword } from "./pages/ForgotPassword"
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
import { Users } from "./pages/Users"
import { Departments } from "./pages/Departments"
import { ProtectedRoute } from "./components/shared/ProtectedRoute"
import { Toaster } from "sonner"

function App() {
  return (
    <>
      <Routes>
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Route>

        {/* Protected Dashboard Routes */}
        <Route element={<ProtectedRoute />}>
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
            <Route path="/users" element={<Users />} />
            <Route path="/departments" element={<Departments />} />
          </Route>
        </Route>

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster position="top-right" theme="system" />
    </>
  )
}

export default App
