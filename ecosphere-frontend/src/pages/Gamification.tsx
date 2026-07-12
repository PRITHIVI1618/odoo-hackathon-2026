import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy } from "lucide-react"

export function Gamification() {
  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Trophy className="h-8 w-8 text-yellow-500" />
          Sustainability Leaderboard
        </h2>
      </div>
      <Card className="glass shadow-sm">
        <CardHeader>
          <CardTitle>Department Rankings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] flex items-center justify-center text-muted-foreground border-2 border-dashed border-muted rounded-lg">
            Employee and department gamification metrics will be displayed here.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
