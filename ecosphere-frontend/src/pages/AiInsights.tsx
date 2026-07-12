import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

export function AiInsights() {
  const navigate = useNavigate()
  useEffect(() => {
    navigate("/ai-intelligence", { replace: true })
  }, [navigate])
  return null
}
