import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, ActivitySquare } from "lucide-react"

export function ActivityLogs() {
  const logs = [
    { user: "Admin User", action: "Generated Executive Report", module: "AI Intelligence", date: "2026-07-12 10:45 AM", status: "Success" },
    { user: "System", action: "Odoo ERP Sync", module: "Integration", date: "2026-07-12 10:30 AM", status: "Success" },
    { user: "HR Dept", action: "Uploaded CSR Policy v2", module: "Governance", date: "2026-07-12 09:15 AM", status: "Success" },
    { user: "Operations", action: "Failed to upload utility bill", module: "Environmental", date: "2026-07-11 04:20 PM", status: "Failed" },
    { user: "ESG Manager", action: "Created new challenge", module: "Gamification", date: "2026-07-11 02:10 PM", status: "Success" },
    { user: "Admin User", action: "Updated API Keys", module: "Settings", date: "2026-07-11 11:00 AM", status: "Warning" },
    { user: "Finance", action: "Exported Carbon Tax Report", module: "Reports", date: "2026-07-10 03:45 PM", status: "Success" },
  ];

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "Success": return <Badge className="bg-green-500/10 text-green-500 border-green-200">Success</Badge>;
      case "Failed": return <Badge className="bg-red-500/10 text-red-500 border-red-200">Failed</Badge>;
      case "Warning": return <Badge className="bg-amber-500/10 text-amber-500 border-amber-200">Warning</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  }

  return (
    <div className="flex-1 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Activity Logs</h2>
          <p className="text-muted-foreground">Audit trail of all system and user activities.</p>
        </div>
      </div>

      <Card className="glass shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="flex items-center gap-2"><ActivitySquare className="h-5 w-5 text-primary" /> System Events</CardTitle>
            <CardDescription>Last 7 days of activity</CardDescription>
          </div>
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search logs..." 
              className="flex h-9 w-full rounded-md border border-input bg-background/50 px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pl-9"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border mt-4 overflow-hidden">
            <div className="grid grid-cols-5 bg-muted/50 p-3 text-sm font-semibold text-muted-foreground">
              <div>User</div>
              <div className="col-span-2">Action</div>
              <div>Module</div>
              <div>Status</div>
            </div>
            <div className="divide-y">
              {logs.map((log, index) => (
                <div key={index} className="grid grid-cols-5 items-center p-3 text-sm hover:bg-muted/30 transition-colors">
                  <div className="font-medium">{log.user}</div>
                  <div className="col-span-2">
                    <p>{log.action}</p>
                    <p className="text-xs text-muted-foreground">{log.date}</p>
                  </div>
                  <div><Badge variant="outline">{log.module}</Badge></div>
                  <div>{getStatusBadge(log.status)}</div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
