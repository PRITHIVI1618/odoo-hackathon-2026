import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles } from "lucide-react"

export function AiInsights() {
  return (
    <div className="flex-1 space-y-6 h-full flex flex-col">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Sparkles className="h-8 w-8 text-primary" />
          AI Insights
        </h2>
      </div>
      <Card className="glass shadow-sm flex-1 flex items-center justify-center">
        <CardContent className="text-center space-y-4">
          <div className="mx-auto h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center mb-6">
            <Sparkles className="h-12 w-12 text-primary animate-pulse" />
          </div>
          <h3 className="text-2xl font-bold tracking-tight">Coming Soon</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Our predictive AI models are currently analyzing your ESG datasets. Check back later for actionable insights and anomaly detection.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
