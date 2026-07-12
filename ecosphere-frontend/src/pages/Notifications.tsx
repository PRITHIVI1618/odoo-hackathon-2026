import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bell, CheckCircle2, AlertTriangle, Target, ShieldAlert, Calendar } from "lucide-react"

export function Notifications() {
  const notifications = [
    { type: "Success", title: "Odoo Sync Successful", description: "All 1248 employees successfully synchronized.", time: "10 mins ago", icon: CheckCircle2, color: "text-green-500", bg: "bg-green-500/10" },
    { type: "Risk Alert", title: "High Carbon Emissions", description: "Logistics department emissions are 15% above the monthly threshold.", time: "2 hours ago", icon: ShieldAlert, color: "text-red-500", bg: "bg-red-500/10" },
    { type: "Goal Completed", title: "Zero Waste Initiative", description: "Operations department successfully hit the Q3 Zero Waste target!", time: "1 day ago", icon: Target, color: "text-primary", bg: "bg-primary/10" },
    { type: "Warning", title: "Policy Expiration", description: "Anti-Bribery Policy is expiring in 3 days. Please review and update.", time: "1 day ago", icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-500/10" },
    { type: "CSR Event", title: "Upcoming: Tree Planting Drive", description: "Reminder: Beach Cleanup / Tree Planting event scheduled for tomorrow at 8 AM.", time: "2 days ago", icon: Calendar, color: "text-blue-500", bg: "bg-blue-500/10" },
  ];

  return (
    <div className="flex-1 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Bell className="h-8 w-8 text-primary" />
            Notifications Center
          </h2>
          <p className="text-muted-foreground">Stay updated on all system alerts and ESG milestones.</p>
        </div>
      </div>
      
      <Card className="glass shadow-sm">
        <CardHeader>
          <CardTitle>Recent Alerts</CardTitle>
          <CardDescription>You have {notifications.length} unread notifications.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notifications.map((notif, index) => (
              <div key={index} className="flex items-start gap-4 p-4 rounded-lg border border-border/50 bg-background/50 hover:bg-muted/50 transition-colors">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${notif.bg}`}>
                  <notif.icon className={`h-5 w-5 ${notif.color}`} />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-sm">{notif.title}</p>
                    <span className="text-xs text-muted-foreground">{notif.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{notif.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

