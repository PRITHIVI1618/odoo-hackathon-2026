import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function Reports() {
  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Compliance Reports</h2>
      </div>
      <Card className="glass shadow-sm">
        <CardHeader>
          <CardTitle>Generated Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] flex items-center justify-center text-muted-foreground border-2 border-dashed border-muted rounded-lg">
            Automated compliance reports (GRI, SASB, TCFD) will be displayed here.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
