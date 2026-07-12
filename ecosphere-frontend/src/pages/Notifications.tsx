import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell } from "lucide-react"

export function Notifications() {
  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Bell className="h-8 w-8 text-primary" />
          Notifications
        </h2>
      </div>
      <Card className="glass shadow-sm">
        <CardHeader>
          <CardTitle>Recent Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] flex items-center justify-center text-muted-foreground border-2 border-dashed border-muted rounded-lg">
            System notifications, anomaly alerts, and task assignments will appear here.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
