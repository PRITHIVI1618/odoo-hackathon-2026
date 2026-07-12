import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Database, Users, Building2, Package, ShoppingCart, RefreshCw, Leaf } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

export function OdooIntegration() {
  const [syncing, setSyncing] = useState(false)
  const [lastSync, setLastSync] = useState("Just now")

  const handleSync = () => {
    setSyncing(true)
    setTimeout(() => {
      setSyncing(false)
      setLastSync("Just now")
      toast.success("Successfully synchronized with Odoo ERP")
    }, 2000)
  }

  const metrics = [
    { name: "Employees Synced", value: 1248, icon: Users, color: "text-blue-500" },
    { name: "Departments Synced", value: 42, icon: Building2, color: "text-purple-500" },
    { name: "Products Synced", value: 3890, icon: Package, color: "text-amber-500" },
    { name: "Purchase Orders Synced", value: 156, icon: ShoppingCart, color: "text-green-500" },
    { name: "Carbon Procurement", value: "24.5 tCO2e", icon: Leaf, color: "text-emerald-500" },
  ]

  return (
    <div className="flex-1 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">Odoo ERP Integration</h2>
          <p className="text-muted-foreground">Manage bi-directional data synchronization with Odoo.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-right hidden sm:block">
            <p className="text-muted-foreground">Status: <Badge variant="default" className="bg-green-500">Connected</Badge></p>
            <p className="text-xs text-muted-foreground mt-1">Last sync: {lastSync}</p>
          </div>
          <Button onClick={handleSync} disabled={syncing} className="shadow-md">
            <RefreshCw className={`mr-2 h-4 w-4 ${syncing ? "animate-spin" : ""}`} />
            {syncing ? 'Syncing...' : 'Sync Now'}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
        {metrics.map((metric, i) => (
          <Card key={i} className="glass shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.name}
              </CardTitle>
              <metric.icon className={`h-4 w-4 ${metric.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="glass shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Database className="h-5 w-5 text-primary" /> Connection Settings</CardTitle>
            <CardDescription>Odoo XML-RPC Configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 items-center gap-4 border-b pb-4">
              <div className="font-medium">Odoo URL</div>
              <div className="col-span-2 text-muted-foreground font-mono text-sm">https://ecosphere.odoo.com</div>
            </div>
            <div className="grid grid-cols-3 items-center gap-4 border-b pb-4">
              <div className="font-medium">Database</div>
              <div className="col-span-2 text-muted-foreground font-mono text-sm">ecosphere_prod</div>
            </div>
            <div className="grid grid-cols-3 items-center gap-4 border-b pb-4">
              <div className="font-medium">Sync Frequency</div>
              <div className="col-span-2 text-muted-foreground text-sm">Every 15 minutes</div>
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <div className="font-medium">Modules</div>
              <div className="col-span-2 flex gap-2 flex-wrap">
                <Badge variant="outline">hr</Badge>
                <Badge variant="outline">purchase</Badge>
                <Badge variant="outline">stock</Badge>
                <Badge variant="outline">fleet</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass shadow-sm">
          <CardHeader>
            <CardTitle>Recent Sync Logs</CardTitle>
            <CardDescription>Latest data transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { time: "Just now", action: "Pulled 12 new employee records (hr.employee)" },
                { time: "15 mins ago", action: "Pushed ESG scores to 42 supplier records" },
                { time: "30 mins ago", action: "Pulled 156 purchase orders for carbon calculation" },
                { time: "45 mins ago", action: "Synced department hierarchy changes" },
              ].map((log, i) => (
                <div key={i} className="flex gap-4 text-sm">
                  <div className="w-20 text-muted-foreground shrink-0">{log.time}</div>
                  <div className="flex flex-col gap-1 w-full">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                      {log.action}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

