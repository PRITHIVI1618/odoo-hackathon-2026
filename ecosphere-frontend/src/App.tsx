import { Suspense, lazy } from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import { AuthLayout } from "./layouts/AuthLayout"
import { DashboardLayout } from "./layouts/DashboardLayout"
import { ProtectedRoute } from "./components/shared/ProtectedRoute"
import { Toaster } from "sonner"
import { Loader2 } from "lucide-react"

// Lazy loaded pages
const Login = lazy(() => import("./pages/Login").then(module => ({ default: module.Login })))
const Register = lazy(() => import("./pages/Register").then(module => ({ default: module.Register })))
const ForgotPassword = lazy(() => import("./pages/ForgotPassword").then(module => ({ default: module.ForgotPassword })))
const Dashboard = lazy(() => import("./pages/Dashboard").then(module => ({ default: module.Dashboard })))
const Environmental = lazy(() => import("./pages/Environmental").then(module => ({ default: module.Environmental })))
const Social = lazy(() => import("./pages/Social").then(module => ({ default: module.Social })))
const Governance = lazy(() => import("./pages/Governance").then(module => ({ default: module.Governance })))
const Gamification = lazy(() => import("./pages/Gamification").then(module => ({ default: module.Gamification })))
const AiInsights = lazy(() => import("./pages/AiInsights").then(module => ({ default: module.AiInsights })))
const AiIntelligence = lazy(() => import("./pages/AiIntelligence").then(module => ({ default: module.AiIntelligence })))
const Reports = lazy(() => import("./pages/Reports").then(module => ({ default: module.Reports })))
const Settings = lazy(() => import("./pages/Settings").then(module => ({ default: module.Settings })))
const Profile = lazy(() => import("./pages/Profile").then(module => ({ default: module.Profile })))
const Notifications = lazy(() => import("./pages/Notifications").then(module => ({ default: module.Notifications })))
const Users = lazy(() => import("./pages/Users").then(module => ({ default: module.Users })))
const Departments = lazy(() => import("./pages/Departments").then(module => ({ default: module.Departments })))
const ActivityLogs = lazy(() => import("./pages/ActivityLogs").then(module => ({ default: module.ActivityLogs })))
const OdooIntegration = lazy(() => import("./pages/OdooIntegration").then(module => ({ default: module.OdooIntegration })))
const About = lazy(() => import("./pages/About").then(module => ({ default: module.About })))

const LoadingScreen = () => (
  <div className="flex h-[80vh] w-full items-center justify-center">
    <Loader2 className="h-10 w-10 animate-spin text-primary" />
  </div>
)

function App() {
  return (
    <>
      <Suspense fallback={<LoadingScreen />}>
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
              <Route path="/ai-intelligence" element={<AiIntelligence />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/users" element={<Users />} />
              <Route path="/departments" element={<Departments />} />
              <Route path="/activity-logs" element={<ActivityLogs />} />
              <Route path="/odoo" element={<OdooIntegration />} />
              <Route path="/about" element={<About />} />
            </Route>
          </Route>

          {/* 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
      <Toaster position="top-right" theme="system" />
    </>
  )
}

export default App
